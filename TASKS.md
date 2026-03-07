# Retro OS Redesign — Agent Task Breakdown

Each task below is self-contained and can be handed to a Claude agent. Tasks are ordered by dependency — earlier tasks must complete before later ones can start, except where noted as parallelizable.

---

## Task 0: Project Setup & Dependencies
**Priority:** FIRST — blocks everything
**Estimated files:** `package.json`, `gatsby-config.js`

**Instructions:**
1. Install dependencies: `yarn add react-draggable@^4`
2. Update `gatsby-config.js`:
   - Change manifest `name` to `"CALE_OS — Cale Corwin's Portfolio"`
   - Change `short_name` to `"CALE_OS"`
   - Change `description` to `"Retro terminal OS portfolio by Cale Corwin"`
   - Change `background_color` to `"#0a0a0a"`
   - Change `theme_color` to `"#33ff33"`
3. Add Google Fonts link for "JetBrains Mono" and "Press Start 2P" via `gatsby-plugin-google-fonts` or by adding a `<link>` in a custom `html.js`
4. Create `src/gatsby-plugin-theme-ui/index.js` to override the Cara theme's Theme-UI config with:
   ```js
   export default {
     colors: {
       text: '#33ff33',
       background: '#0a0a0a',
       primary: '#33ff33',
       secondary: '#ffb000',
       accent: '#00d4ff',
       muted: '#1a1a2e',
       highlight: '#ffb000',
       modes: {
         amber: {
           text: '#ffb000',
           primary: '#ffb000',
           secondary: '#33ff33',
         }
       }
     },
     fonts: {
       body: '"JetBrains Mono", "IBM Plex Mono", monospace',
       heading: '"Press Start 2P", monospace',
       monospace: '"JetBrains Mono", monospace',
     },
     fontSizes: [12, 14, 16, 20, 24, 32, 48],
     lineHeights: { body: 1.7, heading: 1.4 },
     styles: {
       root: {
         fontFamily: 'body',
         color: 'text',
         bg: 'background',
       }
     }
   }
   ```

**Done when:** `yarn develop` boots with green-on-black monospace text, no build errors.

---

## Task 1: Scanlines & CRT Effects Component
**Priority:** HIGH — provides visual foundation
**Parallelizable with:** Task 2
**Files to create:** `src/@lekoarts/gatsby-theme-cara/components/scanlines.tsx`

**Instructions:**
Build a `<Scanlines />` React component that renders a fixed, full-screen overlay with:
1. **Scanline effect:** Repeating horizontal lines via CSS `background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)`
2. **Screen flicker:** Subtle CSS animation that varies opacity between 0.97 and 1.0 on a 5s loop
3. **CRT vignette:** Radial gradient overlay darkening edges
4. The overlay must be `pointer-events: none`, `position: fixed`, `inset: 0`, `z-index: 9999`
5. Respect `prefers-reduced-motion` — disable flicker animation if user prefers reduced motion
6. Export as default

Use Theme-UI's `jsx` pragma and `sx` prop for styling. No external dependencies needed.

**Done when:** Component renders a subtle CRT overlay across the entire viewport.

---

## Task 2: Window Component
**Priority:** HIGH — core UI building block
**Parallelizable with:** Task 1
**Files to create:** `src/@lekoarts/gatsby-theme-cara/components/window.tsx`

**Instructions:**
Build a `<Window />` component styled like a Windows 95/98 window:

**Props interface:**
```tsx
interface WindowProps {
  title: string            // Window title bar text (e.g., "README.txt")
  icon?: string            // Optional emoji/icon for title bar
  children: React.ReactNode
  defaultPosition?: { x: number, y: number }
  defaultSize?: { width: number | string, height: number | string }
  isOpen: boolean
  onClose: () => void
  onMinimize?: () => void
  zIndex?: number
  className?: string
}
```

**Requirements:**
1. **Title bar:** Gradient background (#1a1a2e to #0a0a0a), left-aligned icon + title in "Press Start 2P" font (small, ~10px), right-aligned minimize `_` / maximize `□` / close `×` buttons
2. **Title bar buttons:** Styled as small squares with 1px solid borders (#33ff33), hover glow effect
3. **Window body:** Dark background (#0d0d0d), 1px solid border (#33ff33 at 50% opacity), padding 16px
4. **Draggable:** Use `react-draggable` — drag handle is the title bar only
5. **Animation:** Use react-spring `useSpring` for open/close (scale from 0.9→1, opacity 0→1)
6. **Click to focus:** onClick sets highest z-index (lift to front)
7. **Scrollable body:** `overflow-y: auto` with styled scrollbar (thin, green thumb on dark track)

Use Theme-UI `jsx` pragma. Import Draggable from `react-draggable`.

**Done when:** A draggable, closeable window renders with retro chrome styling and spring animation.

---

## Task 3: Desktop & Taskbar Layout
**Priority:** HIGH — replaces existing layout
**Depends on:** Task 0 (theme), Task 2 (Window)
**Files to create:**
- `src/@lekoarts/gatsby-theme-cara/components/desktop.tsx`
- `src/@lekoarts/gatsby-theme-cara/components/taskbar.tsx`
- `src/@lekoarts/gatsby-theme-cara/components/desktop-icon.tsx`

**Instructions:**

### Desktop component (`desktop.tsx`):
1. Full-viewport container (`100vw × 100vh`, `overflow: hidden`)
2. Background: dark (#0a0a0a) with a subtle CSS grid pattern (faint lines every 40px, color #111)
3. Renders a grid of `<DesktopIcon />` components in the top-left area
4. Manages window state: which windows are open, their z-index stacking order
5. Renders open `<Window />` components
6. Renders `<Taskbar />` at the bottom
7. Renders `<Scanlines />` overlay on top of everything

### Desktop Icon component (`desktop-icon.tsx`):
1. Displays an icon (emoji or ASCII art) + label below
2. Icons arranged in a column along the left side, spaced 100px apart
3. Double-click opens the corresponding window
4. Single-click selects (highlight border)
5. Label in "Press Start 2P" at 8px, green text with text-shadow glow
6. Icons to create:
   - `📄 README.txt` → opens About window
   - `📁 Projects` → opens Projects window
   - `⚙️ System` → opens Skills/System Info window
   - `📧 Mail` → opens Contact window
   - `>_ Terminal` → opens Terminal window

### Taskbar component (`taskbar.tsx`):
1. Fixed bar at bottom of viewport, height ~40px
2. Background: #111 with 1px top border (#33ff33 at 30% opacity)
3. Left side: "START" button (or "CALE_OS" logo text)
4. Middle: Buttons for each open/minimized window (click to toggle focus/minimize)
5. Right side: Digital clock (updates every second, format: `HH:MM:SS`), green text
6. All text in monospace, small font size

**State management:** Use React useState/useReducer in Desktop to track:
```ts
type WindowState = {
  id: string
  isOpen: boolean
  isMinimized: boolean
  zIndex: number
}
```

**Done when:** Full desktop environment renders with clickable icons, functional taskbar, and window management.

---

## Task 4: Migrate Content into Windows
**Priority:** HIGH — makes the site functional
**Depends on:** Task 2 (Window), Task 3 (Desktop)
**Files to create/modify:**
- `src/@lekoarts/gatsby-theme-cara/components/about-window.tsx`
- `src/@lekoarts/gatsby-theme-cara/components/projects-window.tsx`
- `src/@lekoarts/gatsby-theme-cara/components/skills-window.tsx`
- `src/@lekoarts/gatsby-theme-cara/components/contact-window.tsx`

**Instructions:**

### About Window (`about-window.tsx`) — "README.txt"
1. Wrap in `<Window title="README.txt" icon="📄">`
2. Style content like a plain text file:
   - Line numbers on the left (grey, `#555`)
   - Monospace text, green on dark
   - Content from current `about.mdx`: bio text, skills mention
   - Blinking cursor (`█`) at the end via CSS animation
3. Header: ASCII art "CALE CORWIN" banner (use a simple block-letter ASCII art)

### Projects Window (`projects-window.tsx`) — "File Explorer"
1. Wrap in `<Window title="C:\Projects" icon="📁">`
2. Toolbar row at top: fake breadcrumb path `C:\Users\Cale\Projects\`
3. Grid of project cards, each styled as a "file":
   - File icon (📄 or custom)
   - Filename: project name
   - "Modified:" date
   - "Size:" fake file size
4. Content from current `projects.mdx`:
   - GrantsNotes (React + Material UI)
   - OPP Workout Tool
5. Click a project → expand inline or open sub-window with details
6. Tech stack as terminal badges: `[React]` `[Material-UI]` etc. in colored borders
7. Links styled as: `> open demo` / `> view source` with hover underline

### Skills Window (`skills-window.tsx`) — "System Properties"
1. Wrap in `<Window title="System Properties" icon="⚙️">`
2. Style like `neofetch` output:
   ```
   cale@portfolio
   ─────────────────
   OS:        CALE_OS v2.0
   Host:      cale.xyz
   Shell:     bash 5.1
   Languages: JavaScript, TypeScript
   Frontend:  React, Next.js, Gatsby
   Backend:   Node.js, Express
   Data:      SQL, MongoDB, GraphQL
   Tools:     Git, Jira, Azure DevOps
   Deploy:    Heroku, Netlify
   Uptime:    [years of experience]
   ```
3. Left side: ASCII art logo or avatar placeholder
4. Skills data sourced from current `about.mdx` content

### Contact Window (`contact-window.tsx`) — "Compose Message"
1. Wrap in `<Window title="New Message" icon="📧">`
2. Email-compose layout:
   - `From: visitor@internet` (greyed out)
   - `To: cale@cale.xyz`
   - `Subject: Let's work together`
   - Body area with blinking cursor
3. Below the compose area, social links styled as terminal commands:
   - `> ping linkedin.com/in/calecorwin` → links to LinkedIn
   - `> ssh github.com/calecorwin` → links to GitHub
4. "Send" button styled retro (border, glow on hover)

**Done when:** All four content windows render with themed content matching the retro OS aesthetic.

---

## Task 5: Override Main Page Layout
**Priority:** HIGH — wires everything together
**Depends on:** Tasks 1–4
**Files to create/modify:**
- Shadow the main Cara layout/page by creating `src/@lekoarts/gatsby-theme-cara/components/layout.tsx` (or whichever file Cara uses for its main page)

**Instructions:**
1. Shadow Cara's main page component to replace the parallax layout entirely
2. The new layout should render only:
   ```tsx
   <>
     <SEO />
     <Desktop />
   </>
   ```
3. Import Desktop from `./desktop`
4. Keep Cara's SEO/helmet component for meta tags
5. Add global styles: `html, body { margin: 0; overflow: hidden; cursor: default; }`
6. The old parallax sections (Hero, About, Projects, Contact) are fully replaced — content now lives in window components

**Done when:** Site loads directly into the desktop OS view instead of the old parallax layout.

---

## Task 6: Boot Sequence Animation
**Priority:** MEDIUM — "wow factor" entry point
**Depends on:** Task 5 (layout wired up)
**Files to create:** `src/@lekoarts/gatsby-theme-cara/components/boot-sequence.tsx`

**Instructions:**
1. Full-screen black background, monospace green text
2. Sequence of timed lines appearing (typewriter style, ~30ms per character):
   ```
   CALE_OS BIOS v2.0
   Copyright (C) 2024 Cale Corwin Industries

   Checking memory... 640K OK
   Detecting drives... SSD0: portfolio.img [OK]
   Loading kernel modules...
     ├── react.ko .............. [OK]
     ├── gatsby.ko ............. [OK]
     ├── creativity.ko ......... [OK]
     └── coffee.ko ............. [CRITICAL]

   Starting CALE_OS...

   > Welcome to CALE_OS
   > Type 'help' for available commands
   ```
3. After sequence completes (~4-5 seconds), fade/transition to Desktop
4. **Skip mechanism:**
   - Click anywhere or press any key to skip
   - Check `localStorage.getItem('cale_os_booted')` — if set, skip entirely
   - Set the flag after first complete boot
5. Use react-spring for the fade-out transition to Desktop
6. Integrate into layout: render `<BootSequence onComplete={() => setBooted(true)} />` before Desktop

**Done when:** First visit shows boot animation, subsequent visits skip straight to desktop.

---

## Task 7: Interactive Terminal
**Priority:** MEDIUM — interactive delight
**Depends on:** Task 2 (Window), Task 3 (Desktop)
**Files to create:** `src/@lekoarts/gatsby-theme-cara/components/terminal.tsx`

**Instructions:**
Build an interactive terminal that runs inside a `<Window>`:

1. **Prompt display:** `cale@portfolio:~$ ` in green, with blinking block cursor
2. **Input:** Real text input (styled invisible, captures keystrokes)
3. **Command history:** Up/Down arrow to cycle through previous commands
4. **Output area:** Scrollable div showing command history and responses
5. **Supported commands:**
   ```
   help        - List available commands
   about       - Display bio/README content
   projects    - List projects
   skills      - Show neofetch-style system info
   contact     - Show contact info
   clear       - Clear terminal
   whoami      - "cale — developer, builder, problem solver"
   pwd         - "/home/cale/portfolio"
   ls          - "README.txt  Projects/  system.conf  mail/"
   date        - Current date/time
   echo [text] - Echo back the text
   sudo hire cale - Easter egg: "Permission granted. Sending offer letter..."
   matrix      - Easter egg: brief Matrix-style rain animation
   hack        - Easter egg: fake "hacking" sequence
   ```
6. **Typewriter output:** Responses appear character-by-character (~15ms per char)
7. **Auto-scroll:** Always scroll to bottom on new output
8. Commands that open windows (`about`, `projects`, etc.) should trigger the corresponding window to open on the desktop (pass a callback prop)

**Done when:** Terminal accepts input, processes commands, shows typewriter output, and easter eggs work.

---

## Task 8: Responsive Design & Mobile
**Priority:** MEDIUM
**Depends on:** Tasks 3–5 (desktop layout complete)
**Files to modify:** All component files from Tasks 1–7

**Instructions:**
1. **Breakpoints:**
   - Desktop (>1024px): Full OS experience, draggable windows
   - Tablet (768–1024px): Windows stacked vertically, not draggable, full-width
   - Mobile (<768px): Single-column terminal-style layout

2. **Mobile layout:**
   - Replace desktop icons with a vertical menu list
   - Taskbar becomes a fixed bottom nav with 4-5 icon buttons
   - Windows open as full-screen overlays (slide up animation)
   - Close button prominent in top-right
   - No dragging on touch devices

3. **Tablet layout:**
   - Windows centered and stacked
   - Taskbar remains at bottom
   - Desktop icons in a horizontal row at top

4. **Touch support:**
   - Tap = click
   - Swipe down on window title bar = minimize
   - No drag behavior on touch devices (use `window.matchMedia` or `'ontouchstart' in window`)

5. Use Theme-UI responsive arrays: `[mobileValue, tabletValue, desktopValue]`

**Done when:** Site is usable and attractive on mobile, tablet, and desktop viewports.

---

## Task 9: Easter Eggs & Polish
**Priority:** LOW — personality layer
**Depends on:** Task 7 (Terminal)
**Files to modify:** `terminal.tsx`, `desktop.tsx`

**Instructions:**
1. **Konami Code:** Listen for ↑↑↓↓←→←→BA sequence → trigger a fun CSS animation (screen flip, color inversion, or confetti)
2. **Right-click context menu** on desktop background:
   - "Refresh" (does nothing, maybe flickers screen)
   - "View Source" → links to GitHub repo
   - "About CALE_OS" → opens a small about dialog window
   - "Change Theme" → toggles amber/green color mode
3. **Matrix rain Easter egg** in terminal: Brief canvas animation of falling green characters
4. **Custom cursor:** CSS `cursor: url(...)` with a retro arrow cursor, and pointer variant for interactive elements
5. **Hover glow:** All interactive elements get a subtle green `box-shadow` glow on hover
6. **Window drag sound:** Optional subtle click sound on window drag start (muted by default, toggle in taskbar system tray)

**Done when:** Easter eggs trigger correctly, context menu works, polish effects applied.

---

## Dependency Graph

```
Task 0 (Setup)
  ├── Task 1 (Scanlines)  ──────────────┐
  └── Task 2 (Window)                    │
        └── Task 3 (Desktop + Taskbar) ──┤
              ├── Task 4 (Content Windows)│
              │     └── Task 5 (Layout Override) ← assembles everything
              │           └── Task 6 (Boot Sequence)
              └── Task 7 (Terminal)
                    └── Task 9 (Easter Eggs)
Task 8 (Responsive) ← after Task 5
```

**Parallelizable pairs:**
- Task 1 + Task 2 (no dependencies on each other)
- Task 4's four windows can be built in parallel by separate agents
- Task 8 + Task 9 (after Task 5 is done)
