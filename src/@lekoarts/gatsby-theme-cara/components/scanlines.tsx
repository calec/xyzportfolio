/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"
import { keyframes, Global, css } from "@emotion/core"

const flicker = keyframes`
  0%   { opacity: 0.97; }
  25%  { opacity: 1.0; }
  50%  { opacity: 0.98; }
  75%  { opacity: 1.0; }
  100% { opacity: 0.97; }
`

const Scanlines = () => (
  <>
    <Global
      styles={css`
        @media (prefers-reduced-motion: no-preference) {
          .scanlines-overlay {
            animation: ${flicker} 5s ease-in-out infinite;
          }
        }
      `}
    />
    <div
      className="scanlines-overlay"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.1) 2px,
            rgba(0,0,0,0.1) 4px
          )
        `,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `radial-gradient(
            ellipse at center,
            transparent 60%,
            rgba(0,0,0,0.55) 100%
          )`,
          pointerEvents: "none",
        },
      }}
    />
  </>
)

export default Scanlines
