/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"
import Desktop from "./desktop"

const Layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          cursor: default;
          background: #0a0a0a;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
      `}</style>
      <Desktop />
    </>
  )
}

export default Layout
