/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"
import Window from "./window"

interface ContactWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  soundEnabled?: boolean
}

const ContactWindow = ({ isOpen, onClose, onMinimize, zIndex, soundEnabled }: ContactWindowProps) => {
  return (
    <Window
      title="New Message"
      icon="📧"
      defaultPosition={{ x: 120, y: 120 }}
      defaultSize={{ width: 580, height: 460 }}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
      soundEnabled={soundEnabled}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "12px",
          fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
        }}
      >
        {/* Email Header Fields */}
        <div
          sx={{
            border: "1px solid rgba(51, 255, 51, 0.3)",
            background: "#0d0d0d",
          }}
        >
          {/* From field */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              px: "10px",
              py: "6px",
              borderBottom: "1px solid rgba(51, 255, 51, 0.15)",
            }}
          >
            <span
              sx={{
                color: "#888",
                fontSize: "11px",
                minWidth: "70px",
                flexShrink: 0,
              }}
            >
              From:
            </span>
            <span
              sx={{
                color: "#555",
                fontSize: "12px",
              }}
            >
              visitor@internet
            </span>
          </div>

          {/* To field */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              px: "10px",
              py: "6px",
              borderBottom: "1px solid rgba(51, 255, 51, 0.15)",
            }}
          >
            <span
              sx={{
                color: "#888",
                fontSize: "11px",
                minWidth: "70px",
                flexShrink: 0,
              }}
            >
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

          {/* Subject field */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              px: "10px",
              py: "6px",
            }}
          >
            <span
              sx={{
                color: "#888",
                fontSize: "11px",
                minWidth: "70px",
                flexShrink: 0,
              }}
            >
              Subject:
            </span>
            <span
              sx={{
                color: "#33ff33",
                fontSize: "12px",
                textShadow: "0 0 6px rgba(51, 255, 51, 0.4)",
              }}
            >
              Let's work together
            </span>
          </div>
        </div>

        {/* Email Body Textarea */}
        <div
          sx={{
            flex: 1,
            background: "#050505",
            border: "1px solid rgba(51, 255, 51, 0.2)",
            padding: "12px",
            display: "flex",
            alignItems: "flex-start",
            minHeight: "120px",
          }}
        >
          <span
            sx={{
              color: "#555",
              fontSize: "12px",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            }}
          >
            Type your message here...
          </span>
          <span
            sx={{
              color: "#33ff33",
              fontSize: "12px",
              ml: "2px",
              animation: "blink 1s steps(1) infinite",
              "@keyframes blink": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0 },
              },
            }}
          >
            █
          </span>
        </div>

        {/* Quick Connect Section */}
        <div
          sx={{
            borderTop: "1px solid rgba(51, 255, 51, 0.2)",
            pt: "10px",
          }}
        >
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

          <div
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
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
        <div
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pt: "4px",
          }}
        >
          <button
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
            [ SEND MESSAGE ]
          </button>
        </div>
      </div>
    </Window>
  )
}

export default ContactWindow
