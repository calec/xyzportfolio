/** @jsx jsx */
import React, { useState, useEffect, useRef, useCallback } from "react"
import { jsx } from "theme-ui"
import Window from "./window"

interface StrongBadWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  soundEnabled?: boolean
}

const SBEMAIL_LINKS = [
  { label: "sbemail 50 — website", url: "https://www.youtube.com/watch?v=OEa8wMGFbKk" },
  { label: "sbemail 45 — techno", url: "https://www.youtube.com/watch?v=JwZwkk7q25I" },
  { label: "sbemail 118 — virus", url: "https://www.youtube.com/watch?v=Sck8xNicy5o" },
  { label: "sbemail 40 — vacation", url: "https://www.youtube.com/watch?v=s-WTbGjQhss" },
  { label: "sbemail 206 — being mean", url: "https://www.youtube.com/watch?v=TGSmuOMsarg" },
]

const SMALL_TROPHY = [
  "          ___________",
  "         '._==_==_=_.'",
  "         .-\\:      /-.",
  "        | (|:.     |) |",
  "         '-|:.     |-'",
  "           \\::.    /",
  "            '::. .'",
  "              ) (",
  "            _.' '._",
  "           '-------'",
  "         SMALL TROPHY",
]

const EMAIL_LINES = [
  "subject: your website",
  "",
  "Dear Strong Bad,",
  "",
  "I found this guy's portfolio site and it looks",
  "like a computer from the 1990s. Is he cool?",
  "",
  "Sincerely,",
  "A Fan From the Internet",
  "─────────────────────────────────────────────",
]

const RESPONSE_LINES = [
  "Oh great, ANOTHER portfolio site that thinks it's",
  "all retro and cool because it has GREEN TEXT and",
  "SCANLINES. Let me just...",
  "",
  "Actually wait. This one has a TERMINAL? And you",
  "can type COMMANDS? Okay, that's... that's actually",
  "pretty good. Not as good as my Compy 386, obviously.",
  "But pretty good.",
  "",
  "I give it: A trophy. A small trophy.",
  "",
  ...SMALL_TROPHY,
]

function playSBEmailJingle() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    // "doo doo doo doo DOO doo" approximation
    const notes = [392, 440, 392, 330, 523, 440]
    const dur = 0.13
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "square"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * dur)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (i + 0.9) * dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime + i * dur)
      osc.stop(ctx.currentTime + (i + 1) * dur)
    })
  } catch (_) {
    // AudioContext not available
  }
}

const StrongBadWindow = ({ isOpen, onClose, onMinimize, zIndex, soundEnabled }: StrongBadWindowProps) => {
  // phase: 0=idle, 1=typing email, 2=typing response, 3=done
  const [phase, setPhase] = useState(0)
  const [emailText, setEmailText] = useState<string[]>([])
  const [responseText, setResponseText] = useState<string[]>([])
  const [deleted, setDeleted] = useState(false)
  const [deleteFlash, setDeleteFlash] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  // Scroll to bottom whenever content changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [emailText, responseText, phase])

  // Reset and start sequence when window opens
  useEffect(() => {
    if (!isOpen) {
      clearTimers()
      setPhase(0)
      setEmailText([])
      setResponseText([])
      setDeleted(false)
      setDeleteFlash(false)
      return
    }

    // Play jingle
    if (soundEnabled) playSBEmailJingle()

    // Short delay before typing starts
    const startTimer = setTimeout(() => {
      setPhase(1)
      // Type email lines one at a time
      let cumulativeDelay = 0
      EMAIL_LINES.forEach((line, i) => {
        const lineDelay = line.length * 22 + 80
        const t = setTimeout(() => {
          setEmailText(prev => [...prev, line])
        }, cumulativeDelay)
        timersRef.current.push(t)
        cumulativeDelay += lineDelay
      })

      // After email done, pause then type response
      const responseStart = setTimeout(() => {
        setPhase(2)
        let rDelay = 0
        RESPONSE_LINES.forEach((line, i) => {
          const lineDelay = line.length * 20 + 60
          const rt = setTimeout(() => {
            setResponseText(prev => [...prev, line])
          }, rDelay)
          timersRef.current.push(rt)
          rDelay += lineDelay
        })

        const doneTimer = setTimeout(() => setPhase(3), rDelay + 200)
        timersRef.current.push(doneTimer)
      }, cumulativeDelay + 600)

      timersRef.current.push(responseStart)
    }, 400)

    timersRef.current.push(startTimer)

    return () => clearTimers()
  }, [isOpen, soundEnabled])

  const handleDeleted = useCallback(() => {
    setDeleteFlash(true)
    const t1 = setTimeout(() => setDeleteFlash(false), 150)
    const t2 = setTimeout(() => setDeleted(true), 200)
    const t3 = setTimeout(() => {
      setDeleted(false)
      onClose()
    }, 1700)
    timersRef.current.push(t1, t2, t3)
  }, [onClose])

  return (
    <>
      {/* Screen flash on DELETED */}
      {deleteFlash && (
        <div
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(255,51,51,0.35)",
            pointerEvents: "none",
          }}
        />
      )}

      <Window
        title="COMPY 386 — sbemail.exe"
        icon="💻"
        isOpen={isOpen}
        onClose={onClose}
        onMinimize={onMinimize}
        zIndex={zIndex}
        soundEnabled={soundEnabled}
        defaultPosition={{ x: 180, y: 60 }}
        defaultSize={{ width: 620, height: 460 }}
        className="compy-window"
      >
        <div
          ref={scrollRef}
          sx={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            background: "#000",
            color: "#f0f0f0",
            fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            fontSize: ["11px", "12px", "13px"],
            lineHeight: 1.65,
            p: "16px",
            boxSizing: "border-box",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "#111" },
            "&::-webkit-scrollbar-thumb": { background: "#444", borderRadius: "3px" },
          }}
        >
          {/* Header */}
          <div sx={{ mb: "12px", color: "#ccc" }}>
            <span sx={{ fontFamily: '"Press Start 2P", monospace', fontSize: "9px", color: "#f0f0f0" }}>
              COMPY 386
            </span>
            {"                          "}
            <span sx={{ color: "#888", fontSize: "11px" }}>sbemail.exe</span>
          </div>
          <div sx={{ borderBottom: "1px solid #444", mb: "14px" }} />

          {/* DELETED state */}
          {deleted ? (
            <div
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "280px",
                fontFamily: '"Press Start 2P", monospace',
                fontSize: ["28px", "42px", "56px"],
                color: "#ff3333",
                textShadow: "0 0 30px rgba(255,51,51,0.9), 0 0 60px rgba(255,51,51,0.5)",
                letterSpacing: "0.05em",
                animation: "deletedPulse 0.4s ease-out",
              }}
            >
              DELETED!!
            </div>
          ) : (
            <>
              {/* Email content */}
              {emailText.map((line, i) => (
                <div key={i} sx={{ whiteSpace: "pre", minHeight: "1.65em", color: i < 1 ? "#aaa" : "#f0f0f0" }}>
                  {line}
                </div>
              ))}

              {/* Blinking cursor while typing email */}
              {phase === 1 && (
                <span sx={{ animation: "compyCursor 0.8s step-end infinite", color: "#f0f0f0" }}>█</span>
              )}

              {/* Response */}
              {responseText.length > 0 && (
                <div sx={{ mt: "12px" }}>
                  <div sx={{ color: "#888", mb: "8px", fontSize: "11px" }}>
                    {"Strong Bad responds:"}
                  </div>
                  {responseText.map((line, i) => {
                    const isTrophy = SMALL_TROPHY.includes(line)
                    return (
                      <div
                        key={i}
                        sx={{
                          whiteSpace: "pre",
                          minHeight: "1.65em",
                          color: isTrophy ? "#ffb000" : "#f0f0f0",
                          textShadow: isTrophy ? "0 0 6px rgba(255,176,0,0.5)" : "none",
                          fontFamily: isTrophy ? '"JetBrains Mono", monospace' : "inherit",
                        }}
                      >
                        {line}
                      </div>
                    )
                  })}
                  {phase === 2 && (
                    <span sx={{ animation: "compyCursor 0.8s step-end infinite", color: "#f0f0f0" }}>█</span>
                  )}
                </div>
              )}

              {/* Links + DELETED button — show when done */}
              {phase === 3 && (
                <div sx={{ mt: "20px" }}>
                  <div sx={{ borderTop: "1px solid #444", pt: "14px", mb: "10px", color: "#888", fontSize: "11px" }}>
                    Click here to watch me check REAL emails:
                  </div>
                  {SBEMAIL_LINKS.map((link) => (
                    <div key={link.label} sx={{ mb: "4px" }}>
                      <span sx={{ color: "#666" }}>{"> "}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#f0f0f0",
                          textDecoration: "none",
                          borderBottom: "1px solid #555",
                          transition: "all 0.15s",
                          "&:hover": {
                            color: "#fff",
                            borderBottomColor: "#fff",
                            textShadow: "0 0 8px rgba(255,255,255,0.7)",
                          },
                        }}
                      >
                        {link.label}
                      </a>
                    </div>
                  ))}

                  <div sx={{ mt: "20px", textAlign: "center" }}>
                    <button
                      onClick={handleDeleted}
                      sx={{
                        background: "transparent",
                        border: "2px solid #ff3333",
                        color: "#ff3333",
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: "11px",
                        px: "20px",
                        py: "10px",
                        cursor: "pointer",
                        letterSpacing: "0.1em",
                        transition: "all 0.15s",
                        "&:hover": {
                          background: "rgba(255,51,51,0.15)",
                          boxShadow: "0 0 16px rgba(255,51,51,0.5)",
                          textShadow: "0 0 8px rgba(255,51,51,0.8)",
                        },
                      }}
                    >
                      [ DELETED!! ]
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <style>{`
          @keyframes compyCursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes deletedPulse {
            0% { transform: scale(1.3); opacity: 0; }
            60% { transform: scale(0.95); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </Window>
    </>
  )
}

export default StrongBadWindow
