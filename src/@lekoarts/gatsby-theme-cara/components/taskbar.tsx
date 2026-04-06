/** @jsx jsx */
import React, { useState, useEffect } from "react"
import { jsx } from "theme-ui"

interface TaskbarWindow {
  id: string
  title: string
  icon?: string
  isOpen: boolean
  isMinimized: boolean
}

interface TaskbarProps {
  windows: TaskbarWindow[]
  onWindowToggle: (id: string) => void
  soundEnabled?: boolean
  onSoundToggle?: () => void
  onOSButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
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
  }
}

const Clock = () => {
  const [time, setTime] = useState("")

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2, "0")
      const mm = String(now.getMinutes()).padStart(2, "0")
      const ss = String(now.getSeconds()).padStart(2, "0")
      setTime(`${hh}:${mm}:${ss}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      sx={{
        fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
        fontSize: "11px",
        color: "var(--retro-primary)",
        textShadow: "0 0 6px rgba(var(--retro-primary-rgb), 0.6)",
        letterSpacing: "0.05em",
        minWidth: "70px",
        textAlign: "right",
      }}
    >
      {time}
    </span>
  )
}

const Taskbar = ({ windows, onWindowToggle, soundEnabled = false, onSoundToggle, onOSButtonClick }: TaskbarProps) => {
  const { isMobile } = useBreakpoint()
  const visibleWindows = windows.filter((w) => w.isOpen || w.isMinimized)

  return (
    <div
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40px",
        background: "#111",
        borderTop: "1px solid rgba(var(--retro-primary-rgb), 0.3)",
        display: "flex",
        alignItems: "center",
        px: isMobile ? "6px" : "8px",
        gap: isMobile ? "4px" : "6px",
        zIndex: 1000,
        fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
      }}
    >
      {/* START / C4L3 OS logo button */}
      <button
        onClick={onOSButtonClick}
        sx={{
          height: "28px",
          px: isMobile ? "8px" : "10px",
          background: "linear-gradient(180deg, #1a1a2e 0%, #0d0d0d 100%)",
          border: "1px solid var(--retro-primary)",
          color: "var(--retro-primary)",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: isMobile ? "6px" : "8px",
          cursor: "pointer",
          letterSpacing: "0.05em",
          textShadow: "0 0 6px rgba(var(--retro-primary-rgb), 0.8)",
          boxShadow: "0 0 8px rgba(var(--retro-primary-rgb), 0.2)",
          flexShrink: 0,
          transition: "all 0.15s ease",
          "&:hover": {
            background: "linear-gradient(180deg, var(--retro-primary) 0%, #1a9e1a 100%)",
            color: "#0a0a0a",
            boxShadow: "0 0 12px rgba(var(--retro-primary-rgb), 0.5)",
          },
          "&:active": {
            transform: "translateY(1px)",
          },
        }}
      >
        {"C4L3 OS"}
      </button>

      {/* Divider */}
      <div
        sx={{
          width: "1px",
          height: "24px",
          background: "rgba(var(--retro-primary-rgb), 0.3)",
          flexShrink: 0,
        }}
      />

      {/* Open / minimized window buttons */}
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {visibleWindows.map((win) => (
          <button
            key={win.id}
            onClick={() => onWindowToggle(win.id)}
            title={win.title}
            sx={{
              height: "28px",
              px: isMobile ? "6px" : "8px",
              // On mobile: icon-only buttons (fixed width); on tablet/desktop: show title text
              width: isMobile ? "36px" : "auto",
              maxWidth: isMobile ? "36px" : "140px",
              minWidth: isMobile ? "36px" : "auto",
              background: win.isMinimized
                ? "transparent"
                : "rgba(var(--retro-primary-rgb), 0.1)",
              border: win.isMinimized
                ? "1px solid rgba(var(--retro-primary-rgb), 0.3)"
                : "1px solid rgba(var(--retro-primary-rgb), 0.6)",
              color: "var(--retro-primary)",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: isMobile ? "14px" : "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-start",
              gap: "4px",
              overflow: "hidden",
              flexShrink: 0,
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              "&:hover": {
                background: "rgba(var(--retro-primary-rgb), 0.15)",
                borderColor: "var(--retro-primary)",
                boxShadow: "0 0 6px rgba(var(--retro-primary-rgb), 0.3)",
              },
            }}
          >
            {win.icon && (
              <span sx={{ flexShrink: 0, fontSize: isMobile ? "14px" : "12px" }}>
                {win.icon}
              </span>
            )}
            {/* Hide title text on mobile — icon only */}
            {!isMobile && (
              <span
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {win.title}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div
        sx={{
          width: "1px",
          height: "24px",
          background: "rgba(var(--retro-primary-rgb), 0.3)",
          flexShrink: 0,
        }}
      />

      {/* Sound toggle */}
      {onSoundToggle && (
        <button
          onClick={onSoundToggle}
          title={soundEnabled ? "Mute drag sound" : "Enable drag sound"}
          sx={{
            height: "28px",
            width: "28px",
            background: "transparent",
            border: "1px solid rgba(var(--retro-primary-rgb),0.3)",
            color: soundEnabled ? "var(--retro-primary)" : "rgba(var(--retro-primary-rgb),0.35)",
            cursor: "pointer",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.15s ease",
            "&:hover": {
              borderColor: "var(--retro-primary)",
              color: "var(--retro-primary)",
              boxShadow: "0 0 6px rgba(var(--retro-primary-rgb),0.3)",
            },
          }}
        >
          {soundEnabled ? "🔊" : "🔇"}
        </button>
      )}

      {/* Clock */}
      <Clock />
    </div>
  )
}

export default Taskbar
