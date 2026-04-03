/** @jsx jsx */
import React, { useState, useEffect, useCallback } from "react"
import { jsx } from "theme-ui"
import Window from "./window"

interface PresentationsWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  soundEnabled?: boolean
}

interface PresentationMeta {
  id: string
  title: string
  filename: string
  description: string
  date: string
}

const PRESENTATIONS: PresentationMeta[] = [
  {
    id: "web-dev-journey",
    title: "My Web Dev Journey",
    filename: "web-dev-journey.md",
    description: "From zero to full-stack — a personal retrospective",
    date: "2024-01-15",
  },
  {
    id: "react-patterns",
    title: "React Patterns I Love",
    filename: "react-patterns.md",
    description: "Favourite patterns and techniques in React development",
    date: "2024-03-10",
  },
]

// Parse MARP markdown into an array of slide strings.
// Strips the front matter block (first --- ... --- section with marp: true).
function parseMarpSlides(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, "\n")

  // Detect and strip front matter
  let body = normalized
  if (normalized.startsWith("---\n")) {
    const endIdx = normalized.indexOf("\n---\n", 4)
    if (endIdx !== -1) {
      const frontMatter = normalized.slice(4, endIdx)
      if (frontMatter.includes("marp:")) {
        body = normalized.slice(endIdx + 5) // skip past closing ---
      }
    }
  }

  // Split on slide separators (--- on its own line)
  return body
    .split(/\n---\n/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// Render a single line with inline markdown (bold, inline code, italics)
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    const token = match[0]
    if (token.startsWith("`")) {
      parts.push(
        <code
          key={match.index}
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            background: "rgba(51,255,51,0.1)",
            border: "1px solid rgba(51,255,51,0.3)",
            px: "4px",
            borderRadius: "2px",
            fontSize: "0.9em",
            color: "#00d4ff",
          }}
        >
          {token.slice(1, -1)}
        </code>
      )
    } else if (token.startsWith("**")) {
      parts.push(
        <strong key={match.index} sx={{ color: "#ffb000", fontWeight: "bold" }}>
          {token.slice(2, -2)}
        </strong>
      )
    } else {
      parts.push(
        <em key={match.index} sx={{ color: "#aaffaa", fontStyle: "italic" }}>
          {token.slice(1, -1)}
        </em>
      )
    }
    last = match.index + token.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

// Render slide markdown content as React elements
function SlideContent({ content }: { content: string }) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeLines: string[] = []
  let inList = false
  let listItems: React.ReactNode[] = []

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={key}
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            mb: 3,
          }}
        >
          {listItems}
        </ul>
      )
      listItems = []
    }
    inList = false
  }

  lines.forEach((line, i) => {
    const key = `line-${i}`

    // Code block toggle
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        if (inList) flushList(`list-before-code-${i}`)
        inCodeBlock = true
        codeLines = []
      } else {
        inCodeBlock = false
        elements.push(
          <pre
            key={key}
            sx={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(51,255,51,0.25)",
              p: "12px",
              mb: 3,
              overflowX: "auto",
              fontSize: ["10px", "11px", "12px"],
              fontFamily: '"JetBrains Mono", monospace',
              color: "#00d4ff",
              lineHeight: 1.6,
              borderRadius: "2px",
              "&::-webkit-scrollbar": { height: "4px" },
              "&::-webkit-scrollbar-thumb": { background: "#33ff33" },
            }}
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        )
        codeLines = []
      }
      return
    }

    if (inCodeBlock) {
      codeLines.push(line)
      return
    }

    // MARP HTML comments (directives) — skip
    if (line.startsWith("<!--")) return

    // Headings
    if (line.startsWith("# ")) {
      if (inList) flushList(`list-${i}`)
      elements.push(
        <h1
          key={key}
          sx={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: ["13px", "16px", "20px"],
            color: "#33ff33",
            textShadow: "0 0 12px rgba(51,255,51,0.5)",
            mb: 3,
            lineHeight: 1.7,
            pb: 2,
            borderBottom: "1px solid rgba(51,255,51,0.2)",
          }}
        >
          {renderInline(line.slice(2))}
        </h1>
      )
      return
    }

    if (line.startsWith("## ")) {
      if (inList) flushList(`list-${i}`)
      elements.push(
        <h2
          key={key}
          sx={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: ["10px", "12px", "14px"],
            color: "#ffb000",
            textShadow: "0 0 8px rgba(255,176,0,0.4)",
            mb: 2,
            lineHeight: 1.7,
          }}
        >
          {renderInline(line.slice(3))}
        </h2>
      )
      return
    }

    if (line.startsWith("### ")) {
      if (inList) flushList(`list-${i}`)
      elements.push(
        <h3
          key={key}
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: ["11px", "12px", "13px"],
            color: "#00d4ff",
            mb: 2,
            lineHeight: 1.6,
          }}
        >
          {renderInline(line.slice(4))}
        </h3>
      )
      return
    }

    // Blockquote
    if (line.startsWith("> ")) {
      if (inList) flushList(`list-${i}`)
      elements.push(
        <blockquote
          key={key}
          sx={{
            borderLeft: "3px solid #33ff33",
            pl: 3,
            ml: 0,
            mb: 3,
            color: "#aaffaa",
            fontStyle: "italic",
            opacity: 0.9,
          }}
        >
          {renderInline(line.slice(2))}
        </blockquote>
      )
      return
    }

    // List items
    const bulletMatch = line.match(/^(\s*)[-*]\s(.*)$/)
    if (bulletMatch) {
      inList = true
      const indent = bulletMatch[1].length
      listItems.push(
        <li
          key={key}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            mb: "6px",
            ml: indent > 0 ? 4 : 0,
            color: indent > 0 ? "#aaaaaa" : "#ccffcc",
            fontSize: indent > 0 ? "0.9em" : "1em",
          }}
        >
          <span sx={{ color: indent > 0 ? "#ffb000" : "#33ff33", flexShrink: 0, mt: "1px" }}>
            {indent > 0 ? "·" : "▸"}
          </span>
          <span>{renderInline(bulletMatch[2])}</span>
        </li>
      )
      return
    }

    // Horizontal rule
    if (line.match(/^---+$/) || line.match(/^\*\*\*+$/)) {
      if (inList) flushList(`list-${i}`)
      elements.push(
        <hr
          key={key}
          sx={{ border: "none", borderTop: "1px solid rgba(51,255,51,0.2)", my: 3 }}
        />
      )
      return
    }

    // Empty line
    if (line.trim() === "") {
      if (inList) flushList(`list-${i}`)
      return
    }

    // Paragraph
    if (inList) flushList(`list-${i}`)
    elements.push(
      <p key={key} sx={{ mb: 2, color: "#ccffcc", lineHeight: 1.8 }}>
        {renderInline(line)}
      </p>
    )
  })

  if (inList) {
    const listEl = (
      <ul key="list-end" sx={{ listStyle: "none", p: 0, m: 0, mb: 3 }}>
        {listItems}
      </ul>
    )
    elements.push(listEl)
  }

  return <>{elements}</>
}

const PresentationsWindow = ({
  isOpen,
  onClose,
  onMinimize,
  zIndex,
  soundEnabled,
}: PresentationsWindowProps) => {
  const [selected, setSelected] = useState<PresentationMeta | null>(null)
  const [slides, setSlides] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPresentation = useCallback(async (pres: PresentationMeta) => {
    setLoading(true)
    setError(null)
    setCurrentSlide(0)
    try {
      const res = await fetch(`/presentations/${pres.filename}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const text = await res.text()
      setSlides(parseMarpSlides(text))
      setSelected(pres)
    } catch (err) {
      setError("Failed to load presentation.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleBack = useCallback(() => {
    setSelected(null)
    setSlides([])
    setCurrentSlide(0)
    setError(null)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((n) => Math.max(0, n - 1))
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((n) => Math.min(slides.length - 1, n + 1))
  }, [slides.length])

  // Keyboard navigation
  useEffect(() => {
    if (!selected || !isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextSlide()
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prevSlide()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selected, isOpen, nextSlide, prevSlide])

  return (
    <Window
      title="C:\Presentations"
      icon="📊"
      defaultPosition={{ x: 200, y: 60 }}
      defaultSize={{ width: 740, height: 540 }}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
      soundEnabled={soundEnabled}
    >
      {/* Toolbar */}
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          mb: "14px",
          pb: "12px",
          borderBottom: "1px solid rgba(51,255,51,0.15)",
          flexShrink: 0,
        }}
      >
        <span sx={{ color: "rgba(51,255,51,0.5)", fontSize: "11px" }}>📂</span>
        <span sx={{ color: "rgba(51,255,51,0.5)", fontSize: "11px" }}>
          C:\Presentations{selected ? `\\ ${selected.filename}` : ""}
        </span>
        {selected && (
          <button
            onClick={handleBack}
            sx={{
              ml: "auto",
              background: "transparent",
              border: "1px solid rgba(51,255,51,0.4)",
              color: "#33ff33",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "11px",
              px: "10px",
              py: "4px",
              cursor: "pointer",
              transition: "all 0.15s",
              "&:hover": {
                background: "rgba(51,255,51,0.1)",
                borderColor: "#33ff33",
              },
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div sx={{ textAlign: "center", py: 6, color: "#33ff33", opacity: 0.7 }}>
          <div sx={{ fontFamily: '"Press Start 2P", monospace', fontSize: "10px", mb: 2 }}>
            LOADING...
          </div>
          <div sx={{ fontSize: "11px" }}>Fetching presentation data</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div sx={{ textAlign: "center", py: 6, color: "#ff5555" }}>
          <div sx={{ mb: 2 }}>⚠ {error}</div>
          <button
            onClick={handleBack}
            sx={{
              background: "transparent",
              border: "1px solid #ff5555",
              color: "#ff5555",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "11px",
              px: "12px",
              py: "6px",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* File listing view */}
      {!loading && !error && !selected && (
        <div sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto auto",
              gap: "8px",
              pb: "8px",
              mb: "4px",
              borderBottom: "1px solid rgba(51,255,51,0.1)",
              color: "rgba(51,255,51,0.4)",
              fontSize: "10px",
              fontFamily: '"JetBrains Mono", monospace',
              px: "8px",
            }}
          >
            <span>Name</span>
            <span>Date</span>
            <span>Type</span>
          </div>

          {PRESENTATIONS.map((pres) => (
            <button
              key={pres.id}
              onClick={() => loadPresentation(pres)}
              sx={{
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                gap: "10px",
                alignItems: "center",
                width: "100%",
                px: "8px",
                py: "10px",
                background: "transparent",
                border: "1px solid rgba(51,255,51,0.15)",
                color: "#33ff33",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "12px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                "&:hover": {
                  background: "rgba(51,255,51,0.06)",
                  border: "1px solid rgba(51,255,51,0.4)",
                  boxShadow: "0 0 8px rgba(51,255,51,0.1)",
                },
              }}
            >
              <span sx={{ fontSize: "18px", flexShrink: 0 }}>📊</span>
              <div sx={{ overflow: "hidden" }}>
                <div
                  sx={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "9px",
                    color: "#33ff33",
                    mb: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {pres.title}
                </div>
                <div sx={{ fontSize: "11px", color: "rgba(51,255,51,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {pres.description}
                </div>
              </div>
              <span sx={{ fontSize: "11px", color: "rgba(51,255,51,0.4)", flexShrink: 0 }}>
                {pres.date}
              </span>
              <span sx={{ fontSize: "11px", color: "rgba(51,255,51,0.4)", flexShrink: 0 }}>
                .md
              </span>
            </button>
          ))}

          <div
            sx={{
              mt: 3,
              pt: 3,
              borderTop: "1px solid rgba(51,255,51,0.1)",
              color: "rgba(51,255,51,0.35)",
              fontSize: "10px",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {PRESENTATIONS.length} object(s) &nbsp;·&nbsp; MARP presentations
          </div>
        </div>
      )}

      {/* Slide viewer */}
      {!loading && !error && selected && slides.length > 0 && (
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
          }}
        >
          {/* Slide area */}
          <div
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(51,255,51,0.15)",
              p: ["14px", "20px", "28px"],
              mb: "12px",
              position: "relative",
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": { background: "#33ff33" },
            }}
          >
            {/* Slide number badge */}
            <div
              sx={{
                position: "absolute",
                top: "10px",
                right: "12px",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "10px",
                color: "rgba(51,255,51,0.3)",
                pointerEvents: "none",
              }}
            >
              {currentSlide + 1}/{slides.length}
            </div>

            <SlideContent content={slides[currentSlide]} />
          </div>

          {/* Navigation controls */}
          <div
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              sx={{
                background: "transparent",
                border: "1px solid rgba(51,255,51,0.4)",
                color: currentSlide === 0 ? "rgba(51,255,51,0.2)" : "#33ff33",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "11px",
                px: "14px",
                py: "6px",
                cursor: currentSlide === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                "&:hover:not(:disabled)": {
                  background: "rgba(51,255,51,0.1)",
                  borderColor: "#33ff33",
                },
              }}
            >
              ← Prev
            </button>

            {/* Slide dots */}
            <div sx={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  sx={{
                    width: idx === currentSlide ? "20px" : "8px",
                    height: "8px",
                    background: idx === currentSlide ? "#33ff33" : "rgba(51,255,51,0.25)",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    p: 0,
                    transition: "all 0.2s",
                    "&:hover": { background: "rgba(51,255,51,0.6)" },
                  }}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              sx={{
                background: "transparent",
                border: "1px solid rgba(51,255,51,0.4)",
                color: currentSlide === slides.length - 1 ? "rgba(51,255,51,0.2)" : "#33ff33",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "11px",
                px: "14px",
                py: "6px",
                cursor: currentSlide === slides.length - 1 ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                "&:hover:not(:disabled)": {
                  background: "rgba(51,255,51,0.1)",
                  borderColor: "#33ff33",
                },
              }}
            >
              Next →
            </button>
          </div>

          {/* Keyboard hint */}
          <div
            sx={{
              textAlign: "center",
              mt: "8px",
              color: "rgba(51,255,51,0.25)",
              fontSize: "10px",
              fontFamily: '"JetBrains Mono", monospace',
              flexShrink: 0,
            }}
          >
            ← → arrow keys to navigate
          </div>
        </div>
      )}
    </Window>
  )
}

export default PresentationsWindow
