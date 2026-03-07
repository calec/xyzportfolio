/** @jsx jsx */
import React, { useState, useCallback, useReducer } from "react"
import { jsx } from "theme-ui"
import DesktopIcon from "./desktop-icon"
import Taskbar from "./taskbar"
import Scanlines from "./scanlines"
import AboutWindow from "./about-window"
import ProjectsWindow from "./projects-window"
import SkillsWindow from "./skills-window"
import ContactWindow from "./contact-window"
import Terminal from "./terminal"

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

const WINDOW_META: Record<string, { title: string; icon: string }> = {
  about: { title: "README.txt", icon: "📄" },
  projects: { title: "C:\\Projects", icon: "📁" },
  system: { title: "System Properties", icon: "⚙️" },
  mail: { title: "New Message", icon: "📧" },
  terminal: { title: "Terminal", icon: ">_" },
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
        const maxZ = getMaxZ(state)
        return state.map((w) =>
          w.id === action.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
            : w
        )
      }
      if (win.isMinimized) {
        const maxZ = getMaxZ(state)
        return state.map((w) =>
          w.id === action.id
            ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
            : w
        )
      }
      return state.map((w) =>
        w.id === action.id ? { ...w, isMinimized: true } : w
      )
    }
    default:
      return state
  }
}

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

  const handleOpenWindow = useCallback((id: string) => {
    dispatch({ type: "OPEN", id })
  }, [])

  const taskbarWindows = windows.map((w) => ({
    id: w.id,
    title: WINDOW_META[w.id]?.title ?? w.id,
    icon: WINDOW_META[w.id]?.icon,
    isOpen: w.isOpen,
    isMinimized: w.isMinimized,
  }))

  const getWin = (id: string) => windows.find((w) => w.id === id)!

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

      {/* Content Windows */}
      {(() => {
        const about = getWin("about")
        return (
          <div onMouseDown={() => handleWindowFocus("about")}>
            <AboutWindow
              isOpen={about.isOpen && !about.isMinimized}
              onClose={() => handleWindowClose("about")}
              onMinimize={() => handleWindowMinimize("about")}
              zIndex={about.zIndex}
            />
          </div>
        )
      })()}

      {(() => {
        const projects = getWin("projects")
        return (
          <div onMouseDown={() => handleWindowFocus("projects")}>
            <ProjectsWindow
              isOpen={projects.isOpen && !projects.isMinimized}
              onClose={() => handleWindowClose("projects")}
              onMinimize={() => handleWindowMinimize("projects")}
              zIndex={projects.zIndex}
            />
          </div>
        )
      })()}

      {(() => {
        const system = getWin("system")
        return (
          <div onMouseDown={() => handleWindowFocus("system")}>
            <SkillsWindow
              isOpen={system.isOpen && !system.isMinimized}
              onClose={() => handleWindowClose("system")}
              onMinimize={() => handleWindowMinimize("system")}
              zIndex={system.zIndex}
            />
          </div>
        )
      })()}

      {(() => {
        const mail = getWin("mail")
        return (
          <div onMouseDown={() => handleWindowFocus("mail")}>
            <ContactWindow
              isOpen={mail.isOpen && !mail.isMinimized}
              onClose={() => handleWindowClose("mail")}
              onMinimize={() => handleWindowMinimize("mail")}
              zIndex={mail.zIndex}
            />
          </div>
        )
      })()}

      {(() => {
        const terminal = getWin("terminal")
        return (
          <div onMouseDown={() => handleWindowFocus("terminal")}>
            <Terminal
              isOpen={terminal.isOpen && !terminal.isMinimized}
              onClose={() => handleWindowClose("terminal")}
              onMinimize={() => handleWindowMinimize("terminal")}
              zIndex={terminal.zIndex}
              onOpenWindow={handleOpenWindow}
            />
          </div>
        )
      })()}

      {/* Taskbar */}
      <Taskbar windows={taskbarWindows} onWindowToggle={handleTaskbarToggle} />

      {/* Scanlines overlay — on top of everything */}
      <Scanlines />
    </div>
  )
}

export default Desktop
