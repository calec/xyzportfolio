/** @jsx jsx */
import React, { useState, useCallback, useReducer, useEffect, useRef } from "react"
import { jsx, useColorMode } from "theme-ui"
import DesktopIcon from "./desktop-icon"
import Taskbar from "./taskbar"
import Scanlines from "./scanlines"
import AboutWindow from "./about-window"
import ProjectsWindow from "./projects-window"
import SkillsWindow from "./skills-window"
import ContactWindow from "./contact-window"
import Terminal from "./terminal"
import StrongBadWindow from "./strongbad-window"

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
]

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
  strongbad: { title: "COMPY 386", icon: "💻" },
}

const MAX_Z = 200

function getMaxZ(windows: WindowState[]): number {
  return windows.reduce((max, w) => Math.max(max, w.zIndex), MAX_Z)
}

const initialWindows: WindowState[] = [
  ...ICONS.map((icon) => ({
    id: icon.id,
    isOpen: false,
    isMinimized: false,
    zIndex: MAX_Z,
  })),
  { id: "strongbad", isOpen: false, isMinimized: false, zIndex: MAX_Z },
]

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
      // Restore if minimized or closed; minimize if currently open
      if (!win.isOpen || win.isMinimized) {
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

const Desktop = () => {
  const [windows, dispatch] = useReducer(windowReducer, initialWindows)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const { isMobile, isTablet } = useBreakpoint()
  const [colorMode, setColorMode] = useColorMode()
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Konami code state
  const konamiIdxRef = useRef(0)
  const [konamiActive, setKonamiActive] = useState(false)
  const konamiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [showAboutDialog, setShowAboutDialog] = useState(false)
  const [screenFlicker, setScreenFlicker] = useState(false)
  const flickerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Konami code listener — cleanup timer on unmount
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIdxRef.current]) {
        konamiIdxRef.current += 1
        if (konamiIdxRef.current === KONAMI.length) {
          konamiIdxRef.current = 0
          setKonamiActive(true)
          if (konamiTimerRef.current) clearTimeout(konamiTimerRef.current)
          konamiTimerRef.current = setTimeout(() => setKonamiActive(false), 1800)
        }
      } else {
        konamiIdxRef.current = e.key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("keydown", handleKey)
      if (konamiTimerRef.current) clearTimeout(konamiTimerRef.current)
    }
  }, [])

  // Close context menu on any click
  useEffect(() => {
    const close = () => setContextMenu(null)
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  // Cleanup flicker timer on unmount
  useEffect(() => {
    return () => {
      if (flickerTimerRef.current) clearTimeout(flickerTimerRef.current)
    }
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const handleRefresh = useCallback(() => {
    setContextMenu(null)
    setScreenFlicker(true)
    if (flickerTimerRef.current) clearTimeout(flickerTimerRef.current)
    flickerTimerRef.current = setTimeout(() => setScreenFlicker(false), 600)
  }, [])

  const handleViewSource = useCallback(() => {
    setContextMenu(null)
    window.open("https://github.com/calec/xyzportfolio", "_blank", "noopener,noreferrer")
  }, [])

  const handleAboutOS = useCallback(() => {
    setContextMenu(null)
    setShowAboutDialog(true)
  }, [])

  const handleChangeTheme = useCallback(() => {
    setContextMenu(null)
    setColorMode(colorMode === "amber" ? "default" : "amber")
  }, [colorMode, setColorMode])

  const handleCheckEmail = useCallback(() => {
    setContextMenu(null)
    dispatch({ type: "OPEN", id: "strongbad" })
  }, [])

  const handleOSButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    setContextMenu({ x: rect.left, y: rect.top })
  }, [])

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
      className={konamiActive ? "desktop-konami" : undefined}
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
      onContextMenu={handleContextMenu}
    >
      <style>{`
        :root {
          --retro-primary: ${colorMode === 'amber' ? '#ffb000' : '#33ff33'};
          --retro-primary-rgb: ${colorMode === 'amber' ? '255, 176, 0' : '51, 255, 51'};
          --retro-secondary: ${colorMode === 'amber' ? '#33ff33' : '#ffb000'};
          --retro-secondary-rgb: ${colorMode === 'amber' ? '51, 255, 51' : '255, 176, 0'};
        }
        @keyframes konamiInvert {
          0%   { filter: invert(1) hue-rotate(180deg) saturate(2); }
          40%  { filter: invert(0.6) hue-rotate(90deg); }
          100% { filter: invert(0); }
        }
        @keyframes screenFlicker {
          0%,100% { opacity: 1; }
          10%,30%,50%,70%,90% { opacity: 0.6; }
          20%,40%,60%,80%     { opacity: 0.9; }
        }
        .desktop-konami { animation: konamiInvert 1.8s ease-out forwards; }
        .screen-flicker  { animation: screenFlicker 0.6s ease-out; }
      `}</style>

      {/* Screen flicker overlay */}
      {screenFlicker && (
        <div
          className="screen-flicker"
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(var(--retro-primary-rgb),0.05)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Konami celebration text */}
      {konamiActive && (
        <div
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: ["12px", "18px", "24px"],
            color: "var(--retro-primary)",
            textShadow: "0 0 20px var(--retro-primary), 0 0 40px var(--retro-primary)",
            textAlign: "center",
            pointerEvents: "none",
            lineHeight: 2,
          }}
        >
          CHEAT CODE ACTIVATED!<br />
          <span sx={{ fontSize: "0.6em", color: "var(--retro-secondary)", textShadow: "0 0 10px var(--retro-secondary)" }}>
            +30 STYLE POINTS
          </span>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <div
          sx={{
            position: "fixed",
            left: Math.min(contextMenu.x, (typeof window !== "undefined" ? window.innerWidth : 800) - 200),
            top: Math.min(contextMenu.y, (typeof window !== "undefined" ? window.innerHeight : 600) - 220),
            zIndex: 9997,
            background: "#111",
            border: "1px solid rgba(var(--retro-primary-rgb),0.5)",
            minWidth: "190px",
            boxShadow: "0 0 20px rgba(var(--retro-primary-rgb),0.2), 0 4px 16px rgba(0,0,0,0.8)",
            fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            fontSize: "12px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            { label: "Refresh", action: handleRefresh },
            { label: "View Source", action: handleViewSource },
            { label: "About C4L3 OS", action: handleAboutOS },
            { label: "📧 Check Email", action: handleCheckEmail },
            { label: colorMode === "amber" ? "Theme: Switch to Green" : "Theme: Switch to Amber", action: handleChangeTheme },
          ].map((item, i, arr) => (
            <button
              key={i}
              onClick={item.action}
              sx={{
                display: "block",
                width: "100%",
                px: "14px",
                py: "8px",
                background: "transparent",
                border: "none",
                borderBottom: i < arr.length - 1 ? "1px solid rgba(var(--retro-primary-rgb),0.15)" : "none",
                color: "var(--retro-primary)",
                fontFamily: "inherit",
                fontSize: "inherit",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 0.1s",
                "&:hover": {
                  background: "rgba(var(--retro-primary-rgb),0.12)",
                  textShadow: "0 0 6px rgba(var(--retro-primary-rgb),0.6)",
                },
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* About C4L3 OS dialog */}
      {showAboutDialog && (
        <div
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9996,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
          }}
          onClick={() => setShowAboutDialog(false)}
        >
          <div
            sx={{
              background: "#111",
              border: "1px solid rgba(var(--retro-primary-rgb),0.6)",
              boxShadow: "0 0 30px rgba(var(--retro-primary-rgb),0.2)",
              width: ["90%", "400px"],
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: "12px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title bar */}
            <div sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: "6px", background: "linear-gradient(90deg,#1a1a2e,#0a0a0a)", borderBottom: "1px solid rgba(var(--retro-primary-rgb),0.3)" }}>
              <span sx={{ fontFamily: '"Press Start 2P", monospace', fontSize: "9px", color: "var(--retro-primary)" }}>
                ℹ️ About C4L3 OS
              </span>
              <button
                onClick={() => setShowAboutDialog(false)}
                sx={{ background: "transparent", border: "1px solid var(--retro-primary)", color: "var(--retro-primary)", width: "18px", height: "18px", cursor: "pointer", fontSize: "14px", lineHeight: 1, p: 0, display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { background: "rgba(255,51,51,0.2)", borderColor: "#ff3333", color: "#ff3333" } }}
              >×</button>
            </div>
            {/* Body */}
            <div sx={{ p: "20px", color: "var(--retro-primary)", lineHeight: 1.8 }}>
              <div sx={{ fontFamily: '"Press Start 2P", monospace', fontSize: "11px", mb: 3, textShadow: "0 0 8px rgba(var(--retro-primary-rgb),0.6)" }}>
                C4L3 OS v2.0
              </div>
              <div sx={{ color: "#aaa", mb: 1 }}>Built by: <span sx={{ color: "var(--retro-primary)" }}>Cale Corwin</span></div>
              <div sx={{ color: "#aaa", mb: 1 }}>Stack: <span sx={{ color: "var(--retro-primary)" }}>React + Gatsby + TypeScript</span></div>
              <div sx={{ color: "#aaa", mb: 1 }}>Theme: <span sx={{ color: "var(--retro-primary)" }}>Retro Terminal OS</span></div>
              <div sx={{ color: "#aaa", mb: 3 }}>Year: <span sx={{ color: "var(--retro-primary)" }}>{new Date().getFullYear()}</span></div>
              <div sx={{ color: "#555", fontSize: "11px" }}>
                Try: ↑↑↓↓←→←→BA
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── Mobile layout: vertical menu list ── */}
      {isMobile && (
        <div
          sx={{
            position: "absolute",
            top: "12px",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            px: "12px",
            pb: "8px",
            zIndex: 10,
            overflowY: "auto",
            maxHeight: "calc(100vh - 60px)",
          }}
        >
          <div
            sx={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "10px",
              color: "var(--retro-primary)",
              textShadow: "0 0 8px rgba(var(--retro-primary-rgb), 0.8)",
              mb: "12px",
              textAlign: "center",
              letterSpacing: "0.1em",
            }}
          >
            C4L3 OS v2.0
          </div>
          {ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleIconOpen(icon.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                width: "100%",
                px: "16px",
                py: "14px",
                background: "rgba(var(--retro-primary-rgb), 0.04)",
                border: "1px solid rgba(var(--retro-primary-rgb), 0.25)",
                color: "var(--retro-primary)",
                fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
                "&:hover, &:active": {
                  background: "rgba(var(--retro-primary-rgb), 0.1)",
                  border: "1px solid rgba(var(--retro-primary-rgb), 0.6)",
                  boxShadow: "0 0 8px rgba(var(--retro-primary-rgb), 0.2)",
                },
              }}
            >
              <span sx={{ fontSize: "22px", flexShrink: 0 }}>{icon.icon}</span>
              <span
                sx={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "9px",
                  textShadow: "0 0 6px rgba(var(--retro-primary-rgb), 0.6)",
                  letterSpacing: "0.05em",
                }}
              >
                {icon.label}
              </span>
              <span
                sx={{
                  ml: "auto",
                  color: "rgba(var(--retro-primary-rgb), 0.4)",
                  fontSize: "12px",
                  flexShrink: 0,
                }}
              >
                {">"}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ── Tablet layout: horizontal icon row at top ── */}
      {isTablet && (
        <div
          sx={{
            position: "absolute",
            top: "14px",
            left: "16px",
            right: "16px",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            zIndex: 10,
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
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
      )}

      {/* ── Desktop layout: column on the left ── */}
      {!isMobile && !isTablet && (
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
      )}

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
              soundEnabled={soundEnabled}
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
              soundEnabled={soundEnabled}
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
              soundEnabled={soundEnabled}
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
              soundEnabled={soundEnabled}
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
              soundEnabled={soundEnabled}
            />
          </div>
        )
      })()}

      {(() => {
        const sb = getWin("strongbad")
        return (
          <div onMouseDown={() => handleWindowFocus("strongbad")}>
            <StrongBadWindow
              isOpen={sb.isOpen && !sb.isMinimized}
              onClose={() => handleWindowClose("strongbad")}
              onMinimize={() => handleWindowMinimize("strongbad")}
              zIndex={sb.zIndex}
              soundEnabled={soundEnabled}
            />
          </div>
        )
      })()}

      {/* Taskbar */}
      <Taskbar
        windows={taskbarWindows}
        onWindowToggle={handleTaskbarToggle}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(prev => !prev)}
        onOSButtonClick={handleOSButtonClick}
      />

      {/* Scanlines overlay — on top of everything */}
      <Scanlines />
    </div>
  )
}

export default Desktop
