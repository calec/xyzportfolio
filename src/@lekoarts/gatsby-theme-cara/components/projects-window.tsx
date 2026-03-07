/** @jsx jsx */
import React, { useState } from "react"
import { jsx } from "theme-ui"
import Window from "./window"

interface ProjectsWindowProps {
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
}

interface Project {
  id: string
  name: string
  filename: string
  description: string
  modified: string
  size: string
  tech: string[]
  demoUrl?: string
  sourceUrl?: string
  status?: string
}

const projects: Project[] = [
  {
    id: "grantsnotes",
    name: "GrantsNotes",
    filename: "GrantsNotes.exe",
    description:
      "A note-taking and organization app built with React and Material UI. Deployed on Firebase with real-time sync and user authentication.",
    modified: "2023-08-14",
    size: "2.4 MB",
    tech: ["React", "Material-UI", "Firebase"],
    demoUrl: "https://grants-notes.herokuapp.com",
    sourceUrl: "https://github.com/calec",
  },
  {
    id: "opp-workout",
    name: "OPP Workout Tool",
    filename: "OPP_Workout.exe",
    description:
      "A fitness tracking application for logging workouts, tracking progress, and managing exercise routines. Currently in active development.",
    modified: "2024-11-03",
    size: "1.8 MB",
    tech: ["React", "Node.js", "MongoDB"],
    demoUrl: "https://github.com/calec",
    status: "In Development",
  },
]

const ProjectsWindow = ({ isOpen, onClose, onMinimize, zIndex }: ProjectsWindowProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <Window
      title="C:\Projects"
      icon="📁"
      defaultPosition={{ x: 150, y: 80 }}
      defaultSize={{ width: 680, height: 500 }}
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={onMinimize}
      zIndex={zIndex}
    >
      {/* Address Bar / Breadcrumb Toolbar */}
      <div
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          mb: "16px",
          pb: "12px",
          borderBottom: "1px solid rgba(51, 255, 51, 0.2)",
        }}
      >
        <span
          sx={{
            color: "#888",
            fontSize: "11px",
            flexShrink: 0,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          Address:
        </span>
        <div
          sx={{
            flex: 1,
            background: "#0a0a0a",
            border: "1px solid rgba(51, 255, 51, 0.4)",
            px: "10px",
            py: "4px",
            fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
            fontSize: "12px",
            color: "#33ff33",
            letterSpacing: "0.02em",
          }}
        >
          C:\Users\Cale\Projects\
        </div>
        <span
          sx={{
            color: "#888",
            fontSize: "10px",
            flexShrink: 0,
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          [{projects.length} items]
        </span>
      </div>

      {/* Column Headers */}
      <div
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 80px",
          gap: "8px",
          px: "8px",
          pb: "6px",
          mb: "4px",
          borderBottom: "1px solid rgba(51, 255, 51, 0.15)",
          color: "#888",
          fontSize: "10px",
          fontFamily: '"JetBrains Mono", monospace',
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <span>Name</span>
        <span>Modified</span>
        <span>Size</span>
      </div>

      {/* Project File Entries */}
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {projects.map((project) => {
          const isExpanded = expandedId === project.id

          return (
            <div
              key={project.id}
              sx={{
                border: isExpanded
                  ? "1px solid rgba(51, 255, 51, 0.5)"
                  : "1px solid rgba(51, 255, 51, 0.15)",
                background: isExpanded ? "rgba(51, 255, 51, 0.04)" : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  border: "1px solid rgba(51, 255, 51, 0.4)",
                  background: "rgba(51, 255, 51, 0.03)",
                },
              }}
            >
              {/* File Row (always visible) */}
              <div
                onClick={() => toggleExpand(project.id)}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 80px",
                  gap: "8px",
                  px: "8px",
                  py: "8px",
                  cursor: "pointer",
                  alignItems: "center",
                }}
              >
                {/* Name column */}
                <div
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    overflow: "hidden",
                  }}
                >
                  <span sx={{ fontSize: "14px", flexShrink: 0 }}>📄</span>
                  <span
                    sx={{
                      color: "#33ff33",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "12px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textShadow: "0 0 4px rgba(51, 255, 51, 0.4)",
                    }}
                  >
                    {project.filename}
                  </span>
                  {project.status && (
                    <span
                      sx={{
                        color: "#ffb000",
                        fontSize: "9px",
                        border: "1px solid rgba(255, 176, 0, 0.5)",
                        px: "4px",
                        py: "1px",
                        flexShrink: 0,
                        fontFamily: '"JetBrains Mono", monospace',
                        letterSpacing: "0.04em",
                      }}
                    >
                      {project.status}
                    </span>
                  )}
                </div>

                {/* Modified column */}
                <span
                  sx={{
                    color: "#888",
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: "11px",
                  }}
                >
                  {project.modified}
                </span>

                {/* Size column */}
                <div
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    sx={{
                      color: "#888",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "11px",
                    }}
                  >
                    {project.size}
                  </span>
                  <span
                    sx={{
                      color: "#33ff33",
                      fontSize: "10px",
                      fontFamily: '"JetBrains Mono", monospace',
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    {">"}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div
                  sx={{
                    px: "16px",
                    pb: "14px",
                    pt: "4px",
                    borderTop: "1px solid rgba(51, 255, 51, 0.15)",
                  }}
                >
                  {/* Description */}
                  <p
                    sx={{
                      color: "#888",
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: "11px",
                      lineHeight: 1.7,
                      mb: "12px",
                      mt: "10px",
                    }}
                  >
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      mb: "12px",
                    }}
                  >
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "10px",
                          color: "#33ff33",
                          border: "1px solid #33ff33",
                          px: "6px",
                          py: "2px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        [{tech}]
                      </span>
                    ))}
                  </div>

                  {/* Metadata row */}
                  <div
                    sx={{
                      display: "flex",
                      gap: "20px",
                      mb: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      sx={{
                        color: "#888",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "10px",
                      }}
                    >
                      Modified:{" "}
                      <span sx={{ color: "#ffb000" }}>{project.modified}</span>
                    </span>
                    <span
                      sx={{
                        color: "#888",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "10px",
                      }}
                    >
                      Size: <span sx={{ color: "#ffb000" }}>{project.size}</span>
                    </span>
                  </div>

                  {/* Links */}
                  <div
                    sx={{
                      display: "flex",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#33ff33",
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "11px",
                          textDecoration: "none",
                          letterSpacing: "0.04em",
                          "&:hover": {
                            textDecoration: "underline",
                            textShadow: "0 0 6px rgba(51, 255, 51, 0.6)",
                          },
                        }}
                      >
                        {">"} open demo
                      </a>
                    )}
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#33ff33",
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "11px",
                          textDecoration: "none",
                          letterSpacing: "0.04em",
                          "&:hover": {
                            textDecoration: "underline",
                            textShadow: "0 0 6px rgba(51, 255, 51, 0.6)",
                          },
                        }}
                      >
                        {">"} view source
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Status Bar */}
      <div
        sx={{
          mt: "16px",
          pt: "10px",
          borderTop: "1px solid rgba(51, 255, 51, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          sx={{
            color: "#888",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "10px",
          }}
        >
          {projects.length} object(s)
        </span>
        <span
          sx={{
            color: "#888",
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "10px",
          }}
        >
          {expandedId
            ? `Selected: ${projects.find((p) => p.id === expandedId)?.filename ?? ""}`
            : "Click a file to expand"}
        </span>
      </div>
    </Window>
  )
}

export default ProjectsWindow
