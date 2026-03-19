/** @jsx jsx */
import { jsx } from "theme-ui"
import Window from "./window"

interface SkillsWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  soundEnabled?: boolean
}

const asciiArt = `  ██████╗ █████╗ ██╗     ███████╗
 ██╔════╝██╔══██╗██║     ██╔════╝
 ██║     ███████║██║     █████╗
 ██║     ██╔══██║██║     ██╔══╝
 ╚██████╗██║  ██║███████╗███████╗
  ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝`

const infoRows: Array<{ key: string; value: string } | { separator: true }> = [
  { separator: true },
  { key: "OS:", value: "C4L3 OS v2.0" },
  { key: "Host:", value: "cale.xyz" },
  { key: "Shell:", value: "bash 5.1" },
  { key: "Uptime:", value: "5+ years experience" },
  { separator: true },
  { key: "Languages:", value: "JavaScript, TypeScript" },
  { key: "Frontend:", value: "React, Next.js, Gatsby" },
  { key: "Backend:", value: "Node.js, Express" },
  { key: "Data:", value: "SQL, MongoDB, GraphQL" },
  { key: "Tools:", value: "Git, Jira, Azure DevOps" },
  { key: "Deploy:", value: "Heroku, Netlify" },
]

const SkillsWindow = ({ isOpen, onClose, onMinimize, zIndex, soundEnabled }: SkillsWindowProps) => {
  return (
    <Window
      title="System Properties"
      icon="⚙️"
      defaultPosition={{ x: 200, y: 100 }}
      defaultSize={{ width: 660, height: 460 }}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
      soundEnabled={soundEnabled}
    >
      <div
        sx={{
          display: "flex",
          // Stack vertically on narrow screens, side-by-side on wider ones
          flexDirection: ["column", "column", "row"],
          gap: ["16px", "16px", "32px"],
          fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
          fontSize: "12px",
          lineHeight: 1.6,
          height: "100%",
        }}
      >
        {/* Left column: ASCII art — hidden on mobile to save space */}
        <div
          sx={{
            display: ["none", "none", "block"],
            flexShrink: 0,
            color: "#00d4ff",
            textShadow: "0 0 8px rgba(0, 212, 255, 0.5)",
            whiteSpace: "pre",
            fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            fontSize: "11px",
            lineHeight: 1.4,
            letterSpacing: 0,
            alignSelf: "flex-start",
            paddingTop: "4px",
          }}
        >
          {asciiArt}
        </div>

        {/* Right column: neofetch info */}
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            fontSize: "12px",
            lineHeight: 1.7,
            minWidth: 0,
          }}
        >
          {/* Username header */}
          <div
            sx={{
              color: "#33ff33",
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(51, 255, 51, 0.8), 0 0 16px rgba(51, 255, 51, 0.4)",
              fontSize: "13px",
              mb: "2px",
            }}
          >
            cale@portfolio
          </div>

          {infoRows.map((row, i) => {
            if ("separator" in row) {
              return (
                <div
                  key={`sep-${i}`}
                  sx={{
                    color: "#33ff33",
                    my: "2px",
                    opacity: 0.7,
                  }}
                >
                  ──────────────────────────────
                </div>
              )
            }

            return (
              <div
                key={row.key}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "4px",
                }}
              >
                <span
                  sx={{
                    color: "#ffb000",
                    minWidth: "90px",
                    flexShrink: 0,
                  }}
                >
                  {row.key}
                </span>
                <span
                  sx={{
                    color: "#33ff33",
                  }}
                >
                  {row.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Window>
  )
}

export default SkillsWindow
