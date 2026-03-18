/** @jsx jsx */
import React, { useState, useCallback, useEffect, useRef } from "react"
import { jsx } from "theme-ui"
import Draggable from "react-draggable"
import { useSpring, animated } from "react-spring"

interface WindowProps {
  title: string
  icon?: string
  children: React.ReactNode
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number | string; height: number | string }
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  className?: string
  soundEnabled?: boolean
}

function playDragClick() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = "square"
    osc.frequency.setValueAtTime(660, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04)
    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  } catch (_) {
    // AudioContext not available — silently ignore
  }
}

const useBreakpoint = () => {
  const getWidth = () => (typeof window !== "undefined" ? window.innerWidth : 1200)
  const [width, setWidth] = useState(getWidth)

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  }
}

const Window = ({
  title,
  icon,
  children,
  defaultPosition = { x: 100, y: 80 },
  defaultSize = { width: 600, height: 400 },
  isOpen,
  onClose,
  onMinimize,
  zIndex = 100,
  className,
  soundEnabled = false,
}: WindowProps) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const [isMaximized, setIsMaximized] = useState(false)
  const touchStartYRef = useRef<number | null>(null)

  // Mobile: slide up from bottom. Tablet/Desktop: scale in.
  const springProps = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isMobile
      ? isOpen
        ? "translateY(0%)"
        : "translateY(100%)"
      : isOpen
      ? "scale(1)"
      : "scale(0.9)",
    config: { tension: 280, friction: 22 },
  })

  const handleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev)
  }, [])

  // Swipe down on title bar to minimize (mobile/tablet)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartYRef.current === null) return
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current
      if (deltaY > 60 && onMinimize) {
        onMinimize()
      }
      touchStartYRef.current = null
    },
    [onMinimize]
  )

  if (!isOpen) return null

  // Positioning strategy per breakpoint
  const windowStyle =
    isMaximized || isMobile
      ? {
          position: "fixed" as const,
          top: 0,
          left: 0,
          width: "100%",
          height: "calc(100vh - 40px)",
          zIndex,
        }
      : isTablet
      ? {
          position: "fixed" as const,
          top: "4%",
          left: "5%",
          width: "90%",
          height: "86%",
          zIndex,
        }
      : {
          position: "fixed" as const,
          zIndex,
          width: defaultSize.width,
          height: defaultSize.height,
        }

  // On desktop (where react-draggable controls position via CSS transform), only
  // animate opacity. If we also animate `transform` via react-spring on the same
  // element, react-spring overwrites react-draggable's translate whenever React
  // re-renders (e.g. on focus/zIndex change), snapping the window to the top.
  const springStyle =
    isDesktop && !isMaximized
      ? { opacity: springProps.opacity }
      : springProps

  const windowContent = (
    <animated.div
      style={{ ...springStyle, ...windowStyle }}
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(51, 255, 51, 0.5)",
        boxShadow: "0 0 20px rgba(51, 255, 51, 0.15), 0 8px 32px rgba(0, 0, 0, 0.8)",
        fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
        userSelect: "none",
      }}
    >
      {/* Title Bar */}
      <div
        className="window-title-bar"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: isMobile ? "10px" : "6px",
          background: "linear-gradient(90deg, #1a1a2e 0%, #0a0a0a 100%)",
          borderBottom: "1px solid rgba(51, 255, 51, 0.3)",
          cursor: isDesktop && !isMaximized ? "move" : "default",
          flexShrink: 0,
        }}
      >
        {/* Icon + Title */}
        <div
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            overflow: "hidden",
          }}
        >
          {icon && (
            <span
              sx={{
                fontSize: isMobile ? "16px" : "12px",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {icon}
            </span>
          )}
          <span
            sx={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: isMobile ? "8px" : "9px",
              color: "#33ff33",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textShadow: "0 0 6px rgba(51, 255, 51, 0.6)",
            }}
          >
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div
          sx={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "4px",
            flexShrink: 0,
            ml: 2,
          }}
        >
          {/* Minimize — hidden on mobile (swipe down instead) */}
          {onMinimize && !isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMinimize()
              }}
              title="Minimize"
              sx={{
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid #33ff33",
                color: "#33ff33",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "12px",
                lineHeight: 1,
                cursor: "pointer",
                p: 0,
                transition: "all 0.15s ease",
                "&:hover": {
                  background: "rgba(51, 255, 51, 0.15)",
                  boxShadow: "0 0 6px rgba(51, 255, 51, 0.6)",
                },
              }}
            >
              _
            </button>
          )}

          {/* Maximize — hidden on mobile */}
          {!isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleMaximize()
              }}
              title={isMaximized ? "Restore" : "Maximize"}
              sx={{
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid #33ff33",
                color: "#33ff33",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "10px",
                lineHeight: 1,
                cursor: "pointer",
                p: 0,
                transition: "all 0.15s ease",
                "&:hover": {
                  background: "rgba(51, 255, 51, 0.15)",
                  boxShadow: "0 0 6px rgba(51, 255, 51, 0.6)",
                },
              }}
            >
              □
            </button>
          )}

          {/* Close — always visible, larger on mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            title="Close"
            sx={{
              width: isMobile ? "32px" : "18px",
              height: isMobile ? "32px" : "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid #33ff33",
              color: "#33ff33",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: isMobile ? "18px" : "14px",
              lineHeight: 1,
              cursor: "pointer",
              p: 0,
              transition: "all 0.15s ease",
              "&:hover": {
                background: "rgba(255, 51, 51, 0.2)",
                borderColor: "#ff3333",
                color: "#ff3333",
                boxShadow: "0 0 6px rgba(255, 51, 51, 0.6)",
              },
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div
        sx={{
          flex: 1,
          background: "#0d0d0d",
          p: isMobile ? "12px" : "16px",
          overflowY: "auto",
          overflowX: "hidden",
          color: "#33ff33",
          fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
          fontSize: isMobile ? "12px" : "13px",
          lineHeight: 1.7,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#0a0a0a",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#33ff33",
            borderRadius: "3px",
            "&:hover": {
              background: "#55ff55",
            },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "#33ff33 #0a0a0a",
        }}
      >
        {children}
      </div>

      {/* Mobile swipe hint */}
      {isMobile && onMinimize && (
        <div
          sx={{
            textAlign: "center",
            py: "4px",
            background: "#111",
            borderTop: "1px solid rgba(51, 255, 51, 0.1)",
            color: "rgba(51, 255, 51, 0.4)",
            fontSize: "9px",
            fontFamily: '"JetBrains Mono", monospace',
            flexShrink: 0,
          }}
        >
          swipe title bar down to minimize
        </div>
      )}
    </animated.div>
  )

  // Only use Draggable on desktop when not maximized
  if (isDesktop && !isMaximized) {
    return (
      <Draggable
        handle=".window-title-bar"
        defaultPosition={defaultPosition}
        disabled={isMaximized}
        bounds="parent"
        onStart={() => { if (soundEnabled) playDragClick() }}
      >
        {windowContent}
      </Draggable>
    )
  }

  return windowContent
}

export default Window
