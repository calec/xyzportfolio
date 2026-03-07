# Retro Site Redesign Plan for cale.xyz

## Concept: "Retro Terminal OS"

A hybrid of PostHog's desktop-OS aesthetic and LMNT's dark terminal vibe — your portfolio presented as a retro operating system / terminal environment. Visitors "boot up" your portfolio like an old computer.

---

## Phase 1: Foundation & Theme Overhaul

### 1. Boot Sequence Intro Animation
- CRT screen power-on effect (screen flicker, scanlines, phosphor glow)
- Fake BIOS/POST text scrolling: `Loading CALE_OS v2.0...`, memory check, etc.
- Resolves into the main desktop/terminal view
- Skip button for repeat visitors (localStorage flag)

### 2. New Color Scheme & Typography
- **Primary palette:** Dark background (#0a0a0a), green phosphor text (#33ff33), amber accent (#ffb000), CRT blue (#00d4ff)
- **Fonts:** Monospace terminal font (JetBrains Mono or IBM Plex Mono) for body, a chunky pixel/retro font (Press Start 2P or Silkscreen) for headings
- **Effects:** Text glow (CSS text-shadow), scanline overlay, subtle CRT curvature on containers

### 3. CRT/Scanline Visual Effects
- CSS overlay with repeating scanlines (semi-transparent horizontal lines)
- Subtle screen flicker animation
- CRT screen curvature via CSS border-radius + box-shadow on main containers
- Phosphor glow on text and interactive elements

---

## Phase 2: Layout & Navigation Redesign

### 4. Desktop-Style Layout (PostHog-inspired)
- Replace single-page parallax scroll with a **retro desktop environment**
- Desktop wallpaper background (dark with subtle grid/stars pattern)
- **Taskbar** at bottom with: clock, dark/light mode toggle, navigation icons
- **Desktop icons** for each section: About.exe, Projects.dir, Skills.txt, Contact.msg

### 5. Windowed Content Sections
- Each section opens in a draggable, resizable "window" (like Windows 95/98)
- Window chrome: title bar with minimize/maximize/close buttons, retro styling
- Windows can be minimized to taskbar, maximized to full view
- Use react-spring (already installed) for smooth open/close animations

### 6. Terminal/Command Line Interface
- Optional interactive terminal overlay (toggle with a keyboard shortcut or taskbar icon)
- Users can type commands: `about`, `projects`, `skills`, `contact`, `help`
- Typewriter effect for responses
- Easter eggs: `sudo hire cale`, `matrix`, `hack`, etc.

---

## Phase 3: Section Content Redesign

### 7. Intro / Hero → Boot Screen → Desktop
- Boot animation lands on desktop with a welcome terminal window auto-opened
- ASCII art name/logo: `CALE CORWIN` in big ASCII block letters
- Typewriter-animated tagline

### 8. About Section → "README.txt" Window
- Styled like a text editor / notepad window
- Content presented as a README file with monospace formatting
- Blinking cursor at end of text

### 9. Projects Section → "File Explorer" Window
- Grid of project "files" with retro file icons
- Hover reveals preview tooltip
- Click opens a detail window with:
  - ASCII-art project header
  - Tech stack shown as terminal badges: `[React] [Node.js] [MongoDB]`
  - Links styled as terminal commands: `> open demo` / `> view source`

### 10. Skills Section → "System Info" Window
- Styled like `neofetch` or system properties dialog
- ASCII art logo on left, stats on right
- Skill bars styled as terminal progress bars: `████████░░ 80%`
- Or presented as a package manager: `installed packages: react@expert, node@advanced...`

### 11. Contact Section → "Email Client" Window
- Styled like a retro email compose window
- Pre-filled "To:" field, subject line
- Social links as terminal commands: `> ping linkedin`, `> ssh github`

---

## Phase 4: Interactive & Delightful Details

### 12. Sound Effects (Optional, Muted by Default)
- Subtle retro UI sounds: window open/close clicks, typing sounds
- CRT hum on boot
- Toggle in taskbar

### 13. Easter Eggs & Personality
- Konami code triggers a fun animation
- Hidden "games" (simple snake or pong in a window)
- `help` command lists all available interactions
- Right-click context menu on desktop (retro-styled)

### 14. Cursor & Interaction Polish
- Custom retro cursor (arrow → pointer on interactive elements)
- Hover effects with phosphor glow
- Click ripple effects on buttons
- Keyboard navigation support (Tab through windows, Enter to open)

---

## Phase 5: Performance & Polish

### 15. Responsive Design
- Desktop: Full OS experience with draggable windows
- Tablet: Simplified windowed layout (stacked, non-draggable)
- Mobile: Single-column terminal-style layout, swipe between sections
- Taskbar becomes a hamburger/bottom nav on mobile

### 16. Accessibility & Performance
- Respect `prefers-reduced-motion` (disable animations)
- Semantic HTML under the retro styling
- Lazy load window contents
- Keep Lighthouse score high

---

## Technical Approach

- **Keep Gatsby framework** — it's already set up with the build pipeline and Netlify
- **Shadow the Cara theme heavily** — override layouts, components, and styles
- **New components to build:**
  - `<Desktop />` — wallpaper, icon grid
  - `<Taskbar />` — bottom bar with clock, nav, toggles
  - `<Window />` — draggable/resizable window with title bar chrome
  - `<Terminal />` — interactive CLI component
  - `<BootSequence />` — intro animation
  - `<Scanlines />` — CRT overlay effect
- **Leverage existing deps:** react-spring for animations, Theme-UI for theming
- **New deps needed:** possibly `react-draggable` for window movement, a monospace web font

---

## Priority Order (What to Build First)

1. **Theme overhaul** (colors, fonts, scanlines) — instant visual impact
2. **Window component** — core UI pattern for everything else
3. **Desktop + Taskbar layout** — replaces the parallax scroll
4. **Migrate content into windows** — about, projects, skills, contact
5. **Boot sequence animation** — the "wow" first impression
6. **Terminal CLI** — interactive delight
7. **Easter eggs & polish** — personality layer
8. **Responsive + accessibility** — production-ready
