/** @jsx jsx */
import React, { useState, useCallback } from "react"
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
}: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false)

  const springProps = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "scale(1)" : "scale(0.9)",
    config: { tension: 280, friction: 22 },
  })

  const handleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev)
  }, [])

  if (!isOpen) return null

  const windowStyle = isMaximized
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex,
      }
    : {
        position: "fixed" as const,
        zIndex,
        width: defaultSize.width,
        height: defaultSize.height,
      }

  return (
    <Draggable
      handle=".window-title-bar"
      defaultPosition={defaultPosition}
      disabled={isMaximized}
      bounds="parent"
    >
      <animated.div
        style={{ ...springProps, ...windowStyle }}
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
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: "6px",
            background: "linear-gradient(90deg, #1a1a2e 0%, #0a0a0a 100%)",
            borderBottom: "1px solid rgba(51, 255, 51, 0.3)",
            cursor: isMaximized ? "default" : "move",
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
                  fontSize: "12px",
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
                fontSize: "9px",
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
              gap: "4px",
              flexShrink: 0,
              ml: 2,
            }}
          >
            {/* Minimize */}
            {onMinimize && (
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

            {/* Maximize */}
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

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              title="Close"
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
                fontSize: "14px",
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
            p: "16px",
            overflowY: "auto",
            overflowX: "hidden",
            color: "#33ff33",
            fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            fontSize: "13px",
            lineHeight: 1.7,
            // Custom scrollbar
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
      </animated.div>
    </Draggable>
  )
}

export default Window
