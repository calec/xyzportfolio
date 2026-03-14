/** @jsx jsx */
import React, { useState, useEffect, useCallback, useRef } from "react"
import { jsx } from "theme-ui"
import { useSpring, animated } from "react-spring"

interface BootSequenceProps {
  onComplete: () => void
}

const BOOT_LINES = [
  "C4L3_OS BIOS v2.0",
  "Copyright (C) 2026",
  "",
  "Checking memory... 640K OK",
  "Detecting drives... SSD0: portfolio.img [OK]",
  "Loading kernel modules...",
  "  \u251C\u2500\u2500 react.ko .............. [OK]",
  "  \u251C\u2500\u2500 typescript.ko ............. [OK]",
  "  \u251C\u2500\u2500 creativity.ko ......... [OK]",
  "  \u2514\u2500\u2500 coffee.ko ............. [CRITICAL]",
  "",
  "Starting C4L3_OS...",
  "",
  "> Welcome to cale.xyz",
  "> Type 'help' for available commands",
]

const CHAR_DELAY = 30
const LINE_GAP = 80

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [done, setDone] = useState(false)
  const [fading, setFading] = useState(false)
  const skippedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fadeSpring = useSpring({
    opacity: fading ? 0 : 1,
    config: { duration: 600 },
    onRest: () => {
      if (fading) onComplete()
    },
  })

  const finishBoot = useCallback(() => {
    if (skippedRef.current) return
    skippedRef.current = true
    localStorage.setItem("cale_os_booted", "1")
    setFading(true)
  }, [])

  const skipBoot = useCallback(() => {
    if (skippedRef.current) return
    skippedRef.current = true
    // Show all lines instantly then fade
    setDisplayedLines(BOOT_LINES)
    setCurrentLineIndex(BOOT_LINES.length)
    setDone(true)
    localStorage.setItem("cale_os_booted", "1")
    setTimeout(() => setFading(true), 300)
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (skippedRef.current || done) return
    if (currentLineIndex >= BOOT_LINES.length) {
      setDone(true)
      setTimeout(finishBoot, 800)
      return
    }

    const line = BOOT_LINES[currentLineIndex]

    if (currentCharIndex <= line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const next = [...prev]
          next[currentLineIndex] = line.slice(0, currentCharIndex)
          return next
        })
        setCurrentCharIndex(i => i + 1)
      }, currentCharIndex === 0 && currentLineIndex > 0 ? LINE_GAP : CHAR_DELAY)
      return () => clearTimeout(timeout)
    } else {
      // Line complete, move to next
      const timeout = setTimeout(() => {
        setCurrentLineIndex(i => i + 1)
        setCurrentCharIndex(0)
      }, LINE_GAP)
      return () => clearTimeout(timeout)
    }
  }, [currentLineIndex, currentCharIndex, done, finishBoot])

  // Skip on click or keypress
  useEffect(() => {
    const handleKey = () => skipBoot()
    const handleClick = () => skipBoot()
    window.addEventListener("keydown", handleKey)
    window.addEventListener("click", handleClick)
    return () => {
      window.removeEventListener("keydown", handleKey)
      window.removeEventListener("click", handleClick)
    }
  }, [skipBoot])

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [displayedLines])

  return (
    <animated.div
      style={fadeSpring}
      sx={{
        position: "fixed",
        inset: 0,
        bg: "#000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 10000,
        p: [3, 4, 5],
        fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
        fontSize: ["12px", "13px", "14px"],
        color: "#33ff33",
        cursor: "default",
      }}
    >
      <div
        ref={containerRef}
        sx={{
          width: "100%",
          maxWidth: "700px",
          overflowY: "auto",
          maxHeight: "80vh",
        }}
      >
        {displayedLines.map((line, i) => (
          <div
            key={i}
            sx={{
              whiteSpace: "pre",
              lineHeight: "1.8",
              color: line.includes("[CRITICAL]")
                ? "#ff3333"
                : line.startsWith(">")
                ? "#33ff33"
                : line.includes("[OK]")
                ? "#33ff33"
                : "#aaffaa",
              textShadow: "0 0 8px currentColor",
            }}
          >
            {line}
            {i === currentLineIndex && !done && (
              <span
                sx={{
                  display: "inline-block",
                  width: "0.6em",
                  height: "1em",
                  bg: "#33ff33",
                  ml: "1px",
                  verticalAlign: "text-bottom",
                  animation: "blink 1s step-end infinite",
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 },
                  },
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div
        sx={{
          position: "absolute",
          bottom: ["12px", "20px"],
          right: ["12px", "20px"],
          color: "#555",
          fontSize: "11px",
          fontFamily: "monospace",
        }}
      >
        [click or press any key to skip]
      </div>
    </animated.div>
  )
}

export default BootSequence
