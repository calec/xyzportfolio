/** @jsx jsx */
import React, { useState, useCallback, useReducer } from "react"
import { jsx } from "theme-ui"
import Window from "./window"
import DesktopIcon from "./desktop-icon"
import Taskbar from "./taskbar"
import Scanlines from "./scanlines"

type WindowState = {
  id: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
}

type WindowAction =
  | { type: "OPEN"; id: string }
  | { type: "CLOSE"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "TOGGLE"; id: string }

const ICONS = [
  { id: "about", icon: "📄", label: "README.txt" },
  { id: "projects", icon: "📁", label: "Projects" },
  { id: "system", icon: "⚙️", label: "System" },
  { id: "mail", icon: "📧", label: "Mail" },
  { id: "terminal", icon: ">_", label: "Terminal" },
]

const WINDOW_META: Record<string, { title: string; icon: string; defaultPosition: { x: number; y: number } }> = {
  about: { title: "README.txt", icon: "📄", defaultPosition: { x: 120, y: 60 } },
  projects: { title: "C:\\Projects", icon: "📁", defaultPosition: { x: 200, y: 80 } },
  system: { title: "System Properties", icon: "⚙️", defaultPosition: { x: 280, y: 100 } },
  mail: { title: "New Message", icon: "📧", defaultPosition: { x: 160, y: 120 } },
  terminal: { title: "Terminal", icon: ">_", defaultPosition: { x: 240, y: 60 } },
}

const MAX_Z = 200

function getMaxZ(windows: WindowState[]): number {
  return windows.reduce((max, w) => Math.max(max, w.zIndex), MAX_Z)
}

const initialWindows: WindowState[] = ICONS.map((icon) => ({
  id: icon.id,
  isOpen: false,
  isMinimized: false,
  zIndex: MAX_Z,
}))

function windowReducer(state: WindowState[], action: WindowAction): WindowState[] {
  switch (action.type) {
    case "OPEN": {
      const maxZ = getMaxZ(state)
      return state.map((w) =>
        w.id === action.id
          ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
          : w
      )
    }
    case "CLOSE":
      return state.map((w) =>
        w.id === action.id ? { ...w, isOpen: false, isMinimized: false } : w
      )
    case "MINIMIZE":
      return state.map((w) =>
        w.id === action.id ? { ...w, isMinimized: true } : w
      )
    case "FOCUS": {
      const maxZ = getMaxZ(state)
      return state.map((w) =>
        w.id === action.id ? { ...w, zIndex: maxZ + 1 } : w
      )
    }
    case "TOGGLE": {
      const win = state.find((w) => w.id === action.id)
      if (!win) return state
      if (!win.isOpen && !win.isMinimized) {
        // Open it
        const maxZ = getMaxZ(state)
        return state.map((w) =>
          w.id === action.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
            : w
        )
      }
      if (win.isMinimized) {
        // Restore
        const maxZ = getMaxZ(state)
        return state.map((w) =>
          w.id === action.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
            : w
        )
      }
      // Minimize
      return state.map((w) =>
        w.id === action.id ? { ...w, isMinimized: true } : w
      )
    }
    default:
      return state
  }
}

const WindowContent = ({ id }: { id: string }) => (
  <div
    sx={{
      fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
      fontSize: "13px",
      color: "#33ff33",
      lineHeight: 1.7,
    }}
  >
    <span sx={{ color: "rgba(51, 255, 51, 0.5)" }}>{`// Content for "${id}" window`}</span>
    <br />
    <span sx={{ color: "rgba(51, 255, 51, 0.5)" }}>{`// This will be populated in Task 4`}</span>
  </div>
)

const Desktop = () => {
  const [windows, dispatch] = useReducer(windowReducer, initialWindows)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)

  const handleIconSelect = useCallback((id: string) => {
    setSelectedIcon(id)
  }, [])

  const handleIconOpen = useCallback((id: string) => {
    dispatch({ type: "OPEN", id })
  }, [])

  const handleWindowClose = useCallback((id: string) => {
    dispatch({ type: "CLOSE", id })
  }, [])

  const handleWindowMinimize = useCallback((id: string) => {
    dispatch({ type: "MINIMIZE", id })
  }, [])

  const handleWindowFocus = useCallback((id: string) => {
    dispatch({ type: "FOCUS", id })
  }, [])

  const handleTaskbarToggle = useCallback((id: string) => {
    dispatch({ type: "TOGGLE", id })
  }, [])

  const taskbarWindows = windows.map((w) => ({
    id: w.id,
    title: WINDOW_META[w.id]?.title ?? w.id,
    icon: WINDOW_META[w.id]?.icon,
    isOpen: w.isOpen,
    isMinimized: w.isMinimized,
  }))

  return (
    <div
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0a",
        backgroundImage: `
          linear-gradient(rgba(17, 17, 17, 0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(17, 17, 17, 0.8) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        position: "relative",
      }}
      onClick={(e) => {
        // Deselect icon on background click
        if (e.currentTarget === e.target) {
          setSelectedIcon(null)
        }
      }}
    >
      {/* Desktop Icons — column on the left */}
      <div
        sx={{
          position: "absolute",
          top: "20px",
          left: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 10,
        }}
      >
        {ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            icon={icon.icon}
            label={icon.label}
            isSelected={selectedIcon === icon.id}
            onSelect={handleIconSelect}
            onOpen={handleIconOpen}
          />
        ))}
      </div>

      {/* Open Windows */}
      {windows.map((win) => {
        if (!win.isOpen || win.isMinimized) return null
        const meta = WINDOW_META[win.id]
        return (
          // onMouseDown bubbles up from the fixed-position Window to bring it to front
          <div key={win.id} onMouseDown={() => handleWindowFocus(win.id)}>
            <Window
              title={meta?.title ?? win.id}
              icon={meta?.icon}
              defaultPosition={meta?.defaultPosition ?? { x: 150, y: 100 }}
              defaultSize={{ width: 600, height: 400 }}
              isOpen={win.isOpen && !win.isMinimized}
              onClose={() => handleWindowClose(win.id)}
              onMinimize={() => handleWindowMinimize(win.id)}
              zIndex={win.zIndex}
            >
              <WindowContent id={win.id} />
            </Window>
          </div>
        )
      })}

      {/* Taskbar */}
      <Taskbar windows={taskbarWindows} onWindowToggle={handleTaskbarToggle} />

      {/* Scanlines overlay — on top of everything */}
      <Scanlines />
    </div>
  )
}

export default Desktop
