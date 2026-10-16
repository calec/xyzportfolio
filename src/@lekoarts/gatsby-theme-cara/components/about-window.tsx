/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"
import Window from "./window"

interface AboutWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  soundEnabled?: boolean
}

const asciiArt = [
  `  ██████╗ █████╗ ██╗     ███████╗`,
  `  ██╔════╝██╔══██╗██║     ██╔════╝`,
  `  ██║     ███████║██║     █████╗  `,
  `  ██║     ██╔══██║██║     ██╔══╝  `,
  `  ╚██████╗██║  ██║███████╗███████╗`,
  `   ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝`,
  ``,
  `   ██████╗ ██████╗ ██████╗ ██╗    ██╗██╗███╗   ██╗`,
  `  ██╔════╝██╔═══██╗██╔══██╗██║    ██║██║████╗  ██║`,
  `  ██║     ██║   ██║██████╔╝██║ █╗ ██║██║██╔██╗ ██║`,
  `  ██║     ██║   ██║██╔══██╗██║███╗██║██║██║╚██╗██║`,
  `  ╚██████╗╚██████╔╝██║  ██║╚███╔███╔╝██║██║ ╚████║`,
  `   ╚═════╝ ╚═════╝ ╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝`,
]

const lines = [
  ``,
  `  README.txt — About Cale Corwin`,
  `  ════════════════════════════════════════════════════`,
  ``,
  `  Technical Product Manager`,
  `  Location   : United States`,
  `  Status     : Open to Product Management roles`,
  ``,
  `  ────────────────────────────────────────────────────`,
  `  ABOUT`,
  `  ────────────────────────────────────────────────────`,
  ``,
  `  Hi! I'm Cale — a product manager with a hands-on`,
  `  engineering background. I've spent my career building`,
  `  digital solutions and automating workflows.`,
  ``,
  `  My project management experience and technical depth`,
  `  let me take a product from whiteboard to launch:`,
  `  framing the problem, aligning stakeholders, and`,
  `  working shoulder-to-shoulder with engineering.`,
  ``,
  `  ────────────────────────────────────────────────────`,
  `  SKILLS`,
  `  ────────────────────────────────────────────────────`,
  ``,
  `  Product & Delivery`,
  `    ► Roadmapping & prioritization`,
  `    ► Agile / Scrum delivery`,
  `    ► Jira, Azure DevOps, MS Project`,
  `    ► AI-assisted development workflows`,
  ``,
  `  Languages & Runtimes`,
  `    ► JavaScript (ES6+)`,
  `    ► Node.js`,
  ``,
  `  Frontend`,
  `    ► React (Hooks)`,
  `    ► Next.js`,
  `    ► Gatsby`,
  ``,
  `  Backend & APIs`,
  `    ► Express`,
  `    ► GraphQL (Apollo)`,
  ``,
  `  Databases`,
  `    ► SQL`,
  `    ► MongoDB`,
  ``,
  `  DevOps & Tooling`,
  `    ► Git`,
  `    ► VSCode`,
  ``,
  `  ────────────────────────────────────────────────────`,
  `  THIS PORTFOLIO`,
  `  ────────────────────────────────────────────────────`,
  ``,
  `  Built on the LekoArts Cara Gatsby theme and`,
  `  customized with a retro OS aesthetic.`,
  `  Deployed and hosted on Netlify.`,
  ``,
  `  ────────────────────────────────────────────────────`,
  ``,
  `  [EOF]`,
  ``,
]

const AboutWindow = ({ isOpen, onClose, onMinimize, zIndex, soundEnabled }: AboutWindowProps) => {
  return (
    <Window
      title="README.txt"
      icon="📄"
      defaultPosition={{ x: 140, y: 40 }}
      defaultSize={{ width: 620, height: 480 }}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
      soundEnabled={soundEnabled}
    >
      {/* Blink keyframe injection */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .retro-cursor {
          animation: blink 1s steps(1) infinite;
        }
      `}</style>

      {/* ASCII Art Banner */}
      <div
        sx={{
          mb: 3,
          flexShrink: 0,
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {asciiArt.map((row, i) => (
          <div
            key={`ascii-${i}`}
            sx={{
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              fontSize: "11px",
              lineHeight: 1.3,
              color: "var(--retro-primary)",
              textShadow: "0 0 8px rgba(var(--retro-primary-rgb), 0.7)",
              whiteSpace: "pre",
              letterSpacing: "0.02em",
            }}
          >
            {row || "\u00A0"}
          </div>
        ))}
      </div>

      {/* Divider after banner */}
      <div
        sx={{
          borderTop: "1px solid rgba(var(--retro-primary-rgb), 0.25)",
          mb: 2,
        }}
      />

      {/* Line-numbered content */}
      <div
        sx={{
          fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
          fontSize: "12px",
          lineHeight: 1.75,
        }}
      >
        {lines.map((line, i) => {
          const lineNum = i + 1
          const isSection =
            line.trim().startsWith("════") ||
            line.trim().startsWith("────")
          const isHeader =
            line.trim() !== "" &&
            !line.trim().startsWith("►") &&
            !line.trim().startsWith("[") &&
            !line.includes(":") &&
            !line.trim().startsWith("════") &&
            !line.trim().startsWith("────") &&
            lines[i - 1]?.trim().startsWith("────") === true

          return (
            <div
              key={`line-${i}`}
              sx={{
                display: "flex",
                alignItems: "baseline",
                gap: "12px",
                "&:hover": {
                  background: "rgba(var(--retro-primary-rgb), 0.04)",
                },
              }}
            >
              {/* Line number */}
              <span
                sx={{
                  color: "#555",
                  fontSize: "11px",
                  fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
                  minWidth: "28px",
                  textAlign: "right",
                  flexShrink: 0,
                  userSelect: "none",
                  lineHeight: 1.75,
                }}
              >
                {lineNum}
              </span>

              {/* Line content */}
              <span
                sx={{
                  color: isSection
                    ? "rgba(var(--retro-primary-rgb), 0.35)"
                    : isHeader
                    ? "#55ffaa"
                    : line.trim().startsWith("►")
                    ? "var(--retro-primary)"
                    : line.trim().startsWith("[")
                    ? "rgba(var(--retro-primary-rgb), 0.5)"
                    : line.includes(":")
                    ? "var(--retro-primary)"
                    : "var(--retro-primary)",
                  textShadow: isSection
                    ? "none"
                    : isHeader
                    ? "0 0 8px rgba(85, 255, 170, 0.5)"
                    : "0 0 4px rgba(var(--retro-primary-rgb), 0.25)",
                  whiteSpace: "pre-wrap",
                  minWidth: 0,
                  fontWeight: isHeader ? 700 : 400,
                  lineHeight: 1.75,
                }}
              >
                {line || "\u00A0"}
              </span>
            </div>
          )
        })}

        {/* Blinking cursor at end */}
        <div
          sx={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            mt: "2px",
          }}
        >
          <span
            sx={{
              color: "#555",
              fontSize: "11px",
              fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
              minWidth: "28px",
              textAlign: "right",
              flexShrink: 0,
              userSelect: "none",
              lineHeight: 1.75,
            }}
          >
            {lines.length + 1}
          </span>
          <span
            className="retro-cursor"
            sx={{
              color: "var(--retro-primary)",
              fontSize: "13px",
              lineHeight: 1.75,
              textShadow: "0 0 8px rgba(var(--retro-primary-rgb), 0.9)",
              userSelect: "none",
            }}
          >
            █
          </span>
        </div>
      </div>
    </Window>
  )
}

export default AboutWindow
