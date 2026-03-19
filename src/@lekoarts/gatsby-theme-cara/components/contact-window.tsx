/** @jsx jsx */
import React, { useState } from "react"
import { jsx } from "theme-ui"
import Window from "./window"

interface ContactWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  soundEnabled?: boolean
}

type FormState = "idle" | "submitting" | "success" | "error"

const inputSx = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  color: "#33ff33",
  fontSize: "12px",
  fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
  textShadow: "0 0 6px rgba(51, 255, 51, 0.4)",
  "::placeholder": {
    color: "#555",
  },
}

const ContactWindow = ({ isOpen, onClose, onMinimize, zIndex, soundEnabled }: ContactWindowProps) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("Let's work together")
  const [message, setMessage] = useState("")
  const [formState, setFormState] = useState<FormState>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("submitting")
    setErrorMsg("")

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "contact",
          name,
          email,
          subject,
          message,
        }).toString(),
      })

      if (response.ok) {
        setFormState("success")
        setName("")
        setEmail("")
        setSubject("Let's work together")
        setMessage("")
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (err) {
      setFormState("error")
      setErrorMsg(err instanceof Error ? err.message : "Transmission failed")
    }
  }

  const windowProps = {
    title: "New Message",
    icon: "📧",
    defaultPosition: { x: 120, y: 120 },
    defaultSize: { width: 580, height: 460 },
    isOpen,
    onClose,
    onMinimize,
    zIndex,
    soundEnabled,
  }

  if (formState === "success") {
    return (
      <Window {...windowProps}>
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
          }}
        >
          <div
            sx={{
              color: "#33ff33",
              fontSize: "14px",
              textAlign: "center",
              textShadow: "0 0 8px rgba(51, 255, 51, 0.6)",
            }}
          >
            {">"} MESSAGE TRANSMITTED SUCCESSFULLY
          </div>
          <div sx={{ color: "#888", fontSize: "11px", textAlign: "center" }}>
            {"// I'll get back to you soon"}
          </div>
          <button
            onClick={() => setFormState("idle")}
            sx={{
              border: "1px solid #33ff33",
              background: "transparent",
              color: "#33ff33",
              padding: "8px 20px",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.05em",
              "&:hover": {
                background: "rgba(51, 255, 51, 0.1)",
                boxShadow: "0 0 10px rgba(51, 255, 51, 0.4)",
              },
            }}
          >
            [ COMPOSE NEW ]
          </button>
        </div>
      </Window>
    )
  }

  return (
    <Window {...windowProps}>
      <form
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "12px",
          fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
        }}
      >
        <input type="hidden" name="form-name" value="contact" />
        {/* Honeypot field — hidden from real users */}
        <input type="text" name="bot-field" sx={{ display: "none" }} />

        {/* Email Header Fields */}
        <div
          sx={{
            border: "1px solid rgba(51, 255, 51, 0.3)",
            background: "#0d0d0d",
          }}
        >
          {/* From field — visitor's email */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              px: "10px",
              py: "6px",
              borderBottom: "1px solid rgba(51, 255, 51, 0.15)",
            }}
          >
            <span sx={{ color: "#888", fontSize: "11px", minWidth: "70px", flexShrink: 0 }}>
              From:
            </span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              sx={inputSx}
            />
          </div>

          {/* To field — static */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              px: "10px",
              py: "6px",
              borderBottom: "1px solid rgba(51, 255, 51, 0.15)",
            }}
          >
            <span sx={{ color: "#888", fontSize: "11px", minWidth: "70px", flexShrink: 0 }}>
              To:
            </span>
            <span
              sx={{
                color: "#33ff33",
                fontSize: "12px",
                textShadow: "0 0 6px rgba(51, 255, 51, 0.4)",
              }}
            >
              cale@cale.xyz
            </span>
          </div>

          {/* Name field */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              px: "10px",
              py: "6px",
              borderBottom: "1px solid rgba(51, 255, 51, 0.15)",
            }}
          >
            <span sx={{ color: "#888", fontSize: "11px", minWidth: "70px", flexShrink: 0 }}>
              Name:
            </span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              sx={inputSx}
            />
          </div>

          {/* Subject field */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              px: "10px",
              py: "6px",
            }}
          >
            <span sx={{ color: "#888", fontSize: "11px", minWidth: "70px", flexShrink: 0 }}>
              Subject:
            </span>
            <input
              type="text"
              name="subject"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              sx={inputSx}
            />
          </div>
        </div>

        {/* Message body */}
        <div
          sx={{
            flex: 1,
            background: "#050505",
            border: "1px solid rgba(51, 255, 51, 0.2)",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            minHeight: "120px",
          }}
        >
          <textarea
            name="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message here..."
            required
            sx={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#33ff33",
              fontSize: "12px",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              resize: "none",
              width: "100%",
              textShadow: "0 0 6px rgba(51, 255, 51, 0.3)",
              "::placeholder": { color: "#555" },
            }}
          />
        </div>

        {/* Error message */}
        {formState === "error" && (
          <div
            sx={{
              color: "#ff3333",
              fontSize: "11px",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            }}
          >
            {">"} ERROR: {errorMsg || "Transmission failed. Try again."}
          </div>
        )}

        {/* Quick Connect Section */}
        <div sx={{ borderTop: "1px solid rgba(51, 255, 51, 0.2)", pt: "10px" }}>
          <div
            sx={{
              color: "#ffb000",
              fontSize: "11px",
              mb: "8px",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            }}
          >
            {"// Quick Connect:"}
          </div>
          <div sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <a
              href="https://www.linkedin.com/in/calecorwin"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#33ff33",
                fontSize: "12px",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  textShadow: "0 0 8px rgba(51, 255, 51, 0.7)",
                },
              }}
            >
              {">"} ping linkedin.com/in/calecorwin
            </a>
            <a
              href="https://www.github.com/calec"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#33ff33",
                fontSize: "12px",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
                transition: "all 0.2s ease",
                "&:hover": {
                  textDecoration: "underline",
                  textShadow: "0 0 8px rgba(51, 255, 51, 0.7)",
                },
              }}
            >
              {">"} ssh github.com/calec
            </a>
          </div>
        </div>

        {/* Send Button */}
        <div sx={{ display: "flex", justifyContent: "flex-end", pt: "4px" }}>
          <button
            type="submit"
            disabled={formState === "submitting"}
            sx={{
              border: "1px solid #33ff33",
              background: "transparent",
              color: "#33ff33",
              padding: "8px 20px",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: "12px",
              cursor: formState === "submitting" ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              letterSpacing: "0.05em",
              opacity: formState === "submitting" ? 0.6 : 1,
              "&:hover": {
                background: formState !== "submitting" ? "rgba(51, 255, 51, 0.1)" : undefined,
                boxShadow:
                  formState !== "submitting" ? "0 0 10px rgba(51, 255, 51, 0.4)" : undefined,
              },
            }}
          >
            {formState === "submitting" ? "[ TRANSMITTING... ]" : "[ SEND MESSAGE ]"}
          </button>
        </div>
      </form>
    </Window>
  )
}

export default ContactWindow
