/** @jsx jsx */
import React, { useState, useEffect } from "react"
import { jsx } from "theme-ui"
import Desktop from "./desktop"
import BootSequence from "./boot-sequence"

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [booted, setBooted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // If already booted before, skip the sequence
    if (localStorage.getItem("cale_os_booted")) {
      setBooted(true)
    }
  }, [])

  // Avoid SSR mismatch — render nothing until mounted
  if (!mounted) return null

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
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      {booted && <Desktop />}
    </>
  )
}

export default Layout
