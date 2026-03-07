/** @jsx jsx */
import React, { useState, useCallback, useRef } from "react"
import { jsx } from "theme-ui"

interface DesktopIconProps {
  id: string
  icon: string
  label: string
  isSelected: boolean
  onSelect: (id: string) => void
  onOpen: (id: string) => void
}

const DesktopIcon = ({ id, icon, label, isSelected, onSelect, onOpen }: DesktopIconProps) => {
  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = useCallback(() => {
    clickCountRef.current += 1

    if (clickCountRef.current === 1) {
      onSelect(id)
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0
      }, 300)
    } else if (clickCountRef.current === 2) {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
      }
      clickCountRef.current = 0
      onOpen(id)
    }
  }, [id, onSelect, onOpen])

  return (
    <div
      onClick={handleClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        width: "72px",
        p: "6px",
        cursor: "pointer",
        border: isSelected ? "1px dashed rgba(51, 255, 51, 0.6)" : "1px solid transparent",
        background: isSelected ? "rgba(51, 255, 51, 0.08)" : "transparent",
        borderRadius: "2px",
        transition: "all 0.15s ease",
        "&:hover": {
          background: "rgba(51, 255, 51, 0.06)",
          border: "1px dashed rgba(51, 255, 51, 0.4)",
        },
        userSelect: "none",
      }}
    >
      <span
        sx={{
          fontSize: "32px",
          lineHeight: 1,
          display: "block",
          textAlign: "center",
          filter: isSelected ? "drop-shadow(0 0 8px rgba(51, 255, 51, 0.7))" : "none",
        }}
      >
        {icon}
      </span>
      <span
        sx={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "8px",
          color: "#33ff33",
          textAlign: "center",
          textShadow: "0 0 6px rgba(51, 255, 51, 0.8)",
          lineHeight: 1.4,
          wordBreak: "break-word",
          width: "100%",
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default DesktopIcon
