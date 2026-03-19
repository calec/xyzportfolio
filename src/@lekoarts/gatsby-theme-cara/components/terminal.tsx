/** @jsx jsx */
import React, { useState, useEffect, useRef, useCallback } from "react"
import { jsx } from "theme-ui"
import Window from "./window"

interface TerminalProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  onOpenWindow?: (id: string) => void
  soundEnabled?: boolean
}

let _lineId = 5000
const nextId = () => ++_lineId

type TermLine = {
  id: number
  text: string
  color?: string
}

const WELCOME_LINES: TermLine[] = [
  { id: nextId(), text: "CALE_OS Terminal v2.0", color: "#55ffaa" },
  { id: nextId(), text: 'Copyright (C) 2024 Cale Corwin Industries', color: "#888888" },
  { id: nextId(), text: 'Type "help" for available commands.', color: "#aaaaaa" },
  { id: nextId(), text: "" },
]

const COMMANDS: Record<string, { lines: string[]; color?: string; opensWindow?: string }> = {
  help: {
    lines: [
      "Available commands:",
      "  help        List available commands",
      "  about       Display bio/README content",
      "  projects    List projects",
      "  skills      Show neofetch-style system info",
      "  contact     Show contact info",
      "  clear       Clear terminal",
      "  whoami      Display user info",
      "  pwd         Print working directory",
      "  ls          List directory contents",
      "  date        Show current date/time",
      "  echo [text] Echo back the text",
      "  sudo hire cale  ??? (try it)",
      "  matrix      Easter egg",
      "  hack        Easter egg",
      "  sbemail     Check your email (Compy 386)",
      "  fhqwhgads   ???",
    ],
    color: "#33ff33",
  },
  about: {
    lines: [
      "Opening README.txt...",
      "",
      "cale@portfolio — Full-Stack Developer",
      "════════════════════════════════════════",
      "",
      "Hi! I'm Cale — a developer with a passion",
      "for building clean, performant web apps.",
      "",
      "[Window: README.txt opened]",
    ],
    color: "#33ff33",
    opensWindow: "about",
  },
  projects: {
    lines: [
      "Opening Projects...",
      "",
      "C:\\Users\\Cale\\Projects\\",
      "════════════════════════════════════════",
      "",
      "📄 GrantsNotes.exe          [React + Material-UI]",
      "📄 OPP_Workout.exe          [React + Express + SQL]",
      "",
      "[Window: C:\\Projects opened]",
    ],
    color: "#33ff33",
    opensWindow: "projects",
  },
  skills: {
    lines: [
      "cale@portfolio",
      "───────────────",
      "OS:        CALE_OS v2.0",
      "Host:      cale.xyz",
      "Shell:     bash 5.1",
      "Languages: JavaScript (ES6+), TypeScript",
      "Frontend:  React, Next.js, Gatsby",
      "Backend:   Node.js, Express",
      "Data:      SQL, MongoDB, GraphQL",
      "Tools:     Git, Jira, Azure DevOps",
      "Deploy:    Heroku, Netlify",
      "",
      "[Window: System Properties opened]",
    ],
    color: "#33ff33",
    opensWindow: "system",
  },
  contact: {
    lines: [
      "Opening Mail...",
      "",
      "To:      cale@cale.xyz",
      "Subject: Let's work together!",
      "",
      "> ping linkedin.com/in/calecorwin",
      "> ssh github.com/calecorwin",
      "",
      "[Window: New Message opened]",
    ],
    color: "#33ff33",
    opensWindow: "mail",
  },
  whoami: {
    lines: ["cale — developer, builder, problem solver"],
    color: "#33ff33",
  },
  pwd: {
    lines: ["/home/cale/portfolio"],
    color: "#33ff33",
  },
  ls: {
    lines: ["README.txt  Projects/  system.conf  mail/"],
    color: "#33ff33",
  },
  "sudo hire cale": {
    lines: [
      "Checking permissions...",
      "[sudo] password for visitor: ••••••••",
      "Permission granted.",
      "",
      "  ✓ Sending offer letter...",
      "  ✓ Scheduling onboarding...",
      "  ✓ Ordering standing desk...",
      "  ✓ Updating LinkedIn status...",
      "",
      "Welcome aboard! Cale reports Monday.",
    ],
    color: "#ffb000",
  },
  hack: {
    lines: [
      "Initializing hack sequence...",
      "Scanning target: cale.xyz",
      "Port 22: OPEN (SSH)",
      "Port 80: OPEN (HTTP)",
      "Port 443: OPEN (HTTPS)",
      "Attempting brute force...",
      "Password attempt 1/1000: ❌",
      "Password attempt 2/1000: ❌",
      "Password attempt 3/1000: ❌",
      "...",
      "Deploying payload.exe...",
      "ERROR: Payload too awesome to execute",
      "Switching to social engineering...",
      "Sending email: 'Totally Real Opportunity'",
      "Target response: 'lol nice try'",
      "HACK FAILED: Target is too cool",
      "",
      "Recommendation: Just hire them instead.",
      "Type 'sudo hire cale' to proceed.",
    ],
    color: "#ff5555",
  },
  sbemail: {
    lines: [
      "Loading sbemail.exe...",
      "Connecting to COMPY 386...",
      "",
      "[Window: COMPY 386 opened]",
    ],
    color: "#f0f0f0",
    opensWindow: "strongbad",
  },
  fhqwhgads: {
    lines: [
      "Come on, fhqwhgads,",
      "I see you jockin' me,",
      "Tryin' to play like,",
      "U NO ME.",
      "",
      "Everybody to the limit!",
      "Everybody to the limit!",
      "Everybody come on fhqwhgads!",
    ],
    color: "#ffb000",
  },
  trogdor: {
    lines: [
      "                 ___",
      "                /   \\\\",
      "           /\\\\\\/  \\_  \\",
      "          / /    / \\\\  |",
      "    ___  / /    /   \\\\ |",
      "   /   \\\\/ /     \\\\   \\\\|",
      "   \\\\     /    ___\\\\",
      "    \\\\   / ___/",
      "     \\\\_/\\\\/",
      "      V",
      "  TROGDOR!!",
      "  BURNINATING THE COUNTRYSIDE!",
      "  BURNINATING THE PEASANTS!",
      "  BURNINATING ALL THE PEOPLES!",
      "  IN THEIR THATCHED-ROOF COTTAGES!",
    ],
    color: "#ff5500",
  },
  "the-cheat": {
    lines: [
      "The Cheat is GROUNDED!",
      "We had that lightswitch installed for you",
      "so you could turn the lights on and off.",
      "NOT so you could throw light switch raves!",
      "",
      "* The Cheat... is not dead. *",
      "* I'm so glad The Cheat is not dead. *",
    ],
    color: "#ffdd00",
  },
}

const Terminal = ({ isOpen, onClose, onMinimize, zIndex, onOpenWindow, soundEnabled }: TerminalProps) => {
  const [outputLines, setOutputLines] = useState<TermLine[]>(() => [...WELCOME_LINES])
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [pendingLines, setPendingLines] = useState<Array<{ text: string; color?: string }>>([])
  const [typingLine, setTypingLine] = useState<{
    id: number
    full: string
    pos: number
    color?: string
  } | null>(null)
  const [showMatrix, setShowMatrix] = useState(false)

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const matrixTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const matrixIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const matrixStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Auto-scroll to bottom whenever output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [outputLines, typingLine])

  // Focus input when window opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Start typing when there are pending lines and we're not currently typing
  useEffect(() => {
    if (typingLine !== null) return
    if (pendingLines.length === 0) return

    const next = pendingLines[0]
    const lineId = nextId()

    setOutputLines(prev => [...prev, { id: lineId, text: "", color: next.color }])
    setPendingLines(prev => prev.slice(1))

    if (next.text.length > 0) {
      setTypingLine({ id: lineId, full: next.text, pos: 0, color: next.color })
    }
  }, [pendingLines, typingLine])

  // Drive typewriter character by character
  useEffect(() => {
    if (!typingLine) return

    const { id, full, pos } = typingLine

    if (pos >= full.length) {
      setTypingLine(null)
      return
    }

    const timer = setTimeout(() => {
      const newPos = pos + 1
      setOutputLines(prev =>
        prev.map(l => (l.id === id ? { ...l, text: full.substring(0, newPos) } : l))
      )
      setTypingLine(prev => (prev ? { ...prev, pos: newPos } : null))
    }, 15)

    return () => clearTimeout(timer)
  }, [typingLine])

  // Matrix rain animation
  useEffect(() => {
    if (!showMatrix) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const fontSize = 14
    const cols = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -50)
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;',./<>?"

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#33ff33"
      ctx.font = `${fontSize}px JetBrains Mono, monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    matrixIntervalRef.current = setInterval(draw, 33)
    matrixTimerRef.current = setTimeout(() => {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current)
      setShowMatrix(false)
      setPendingLines(prev => [
        ...prev,
        { text: "[Matrix rain terminated. Welcome back.]", color: "#aaaaaa" },
        { text: "", color: "#aaaaaa" },
      ])
    }, 3500)

    return () => {
      if (matrixIntervalRef.current) clearInterval(matrixIntervalRef.current)
      if (matrixTimerRef.current) clearTimeout(matrixTimerRef.current)
      if (matrixStartTimerRef.current) clearTimeout(matrixStartTimerRef.current)
    }
  }, [showMatrix])

  const enqueueLines = useCallback((lines: string[], color?: string) => {
    setPendingLines(prev => [
      ...prev,
      ...lines.map(text => ({ text, color })),
    ])
  }, [])

  const handleCommand = useCallback(
    (rawCmd: string) => {
      const trimmed = rawCmd.trim()
      if (!trimmed) return

      const cmd = trimmed.toLowerCase()

      // Add to history
      setHistory(prev => [trimmed, ...prev].slice(0, 50))
      setHistoryIndex(-1)

      // Echo the input line immediately (not typewriter)
      const inputLineId = nextId()
      setOutputLines(prev => [
        ...prev,
        { id: inputLineId, text: `cale@portfolio:~$ ${trimmed}`, color: "#33ff33" },
      ])

      if (cmd === "clear") {
        setOutputLines([])
        setPendingLines([])
        setTypingLine(null)
        return
      }

      if (cmd.startsWith("echo ")) {
        enqueueLines([rawCmd.slice(5), ""], "#33ff33")
        return
      }

      if (cmd === "date") {
        enqueueLines([new Date().toString(), ""], "#33ff33")
        return
      }

      if (cmd === "matrix") {
        setPendingLines(prev => [
          ...prev,
          { text: "Initiating Matrix rain sequence...", color: "#55ffaa" },
        ])
        matrixStartTimerRef.current = setTimeout(() => setShowMatrix(true), 600)
        return
      }

      const match = COMMANDS[cmd]
      if (match) {
        enqueueLines([...match.lines, ""], match.color)
        if (match.opensWindow && onOpenWindow) {
          setTimeout(() => onOpenWindow(match.opensWindow!), 1200)
        }
        return
      }

      // Unknown command
      enqueueLines(
        [`bash: ${trimmed}: command not found`, 'Type "help" for available commands.', ""],
        "#ff5555"
      )
    },
    [enqueueLines, onOpenWindow]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCommand(input)
        setInput("")
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setHistoryIndex(prev => {
          const newIdx = Math.min(prev + 1, history.length - 1)
          if (newIdx >= 0) setInput(history[newIdx] ?? "")
          return newIdx
        })
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setHistoryIndex(prev => {
          const newIdx = Math.max(prev - 1, -1)
          setInput(newIdx === -1 ? "" : (history[newIdx] ?? ""))
          return newIdx
        })
      }
    },
    [input, history, handleCommand]
  )

  return (
    <Window
      title="Terminal"
      icon=">_"
      defaultPosition={{ x: 220, y: 120 }}
      defaultSize={{ width: 680, height: 440 }}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
      soundEnabled={soundEnabled}
    >
      <style>{`
        @keyframes termBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .term-cursor { animation: termBlink 1s steps(1) infinite; }
      `}</style>

      <div
        ref={containerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
          fontSize: "13px",
          cursor: "text",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Matrix canvas overlay */}
        {showMatrix && (
          <canvas
            ref={canvasRef}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              pointerEvents: "none",
            }}
          />
        )}

        {/* Output area */}
        <div
          ref={outputRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            pb: 1,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(51, 255, 51, 0.5)",
              borderRadius: "2px",
            },
          }}
        >
          {outputLines.map(line => (
            <div
              key={line.id}
              sx={{
                color: line.color ?? "#33ff33",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                minHeight: "1.6em",
              }}
            >
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>

        {/* Input row */}
        <div
          sx={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid rgba(51, 255, 51, 0.2)",
            pt: "6px",
            mt: "4px",
            flexShrink: 0,
          }}
        >
          {/* Prompt */}
          <span
            sx={{
              color: "#33ff33",
              userSelect: "none",
              flexShrink: 0,
              textShadow: "0 0 6px rgba(51, 255, 51, 0.5)",
              whiteSpace: "nowrap",
            }}
          >
            cale@portfolio:~$&nbsp;
          </span>

          {/* Input display + hidden real input */}
          <div
            sx={{
              position: "relative",
              flex: 1,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              sx={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                cursor: "text",
                fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
                fontSize: "13px",
                color: "transparent",
                caretColor: "transparent",
              }}
            />
            <span
              sx={{
                color: "#33ff33",
                whiteSpace: "pre",
                pointerEvents: "none",
                lineHeight: 1.6,
              }}
            >
              {input}
            </span>
            <span
              className="term-cursor"
              sx={{
                color: "#33ff33",
                textShadow: "0 0 8px rgba(51, 255, 51, 0.9)",
                userSelect: "none",
                pointerEvents: "none",
                lineHeight: 1.6,
              }}
            >
              █
            </span>
          </div>
        </div>
      </div>
    </Window>
  )
}

export default Terminal
