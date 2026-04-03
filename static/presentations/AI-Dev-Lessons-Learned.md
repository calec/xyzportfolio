---
marp: true
theme: default
paginate: true
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  /* ── BASE SLIDE ──────────────────────────────────────── */
  section {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: #ffffff;
    color: #0d0d0d;
    padding: 40px 56px;
    font-size: 0.98rem;
    line-height: 1.55;
  }

  /* ── LEAD SLIDES ─────────────────────────────────────── */
  section.lead {
    background: linear-gradient(150deg, #071624 0%, #0a1f35 55%, #0e2d4a 100%);
    color: #e8f1f8;
    justify-content: center;
    text-align: left;
    position: relative;
  }

  section.lead::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    color: #4caf78;
    font-size: 0.72rem;
    font-weight: 500;
  }

  section.lead::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #2e7d32, #43a047, #6a1b9a);
  }

  section.lead h1 {
    font-size: 2.2rem;
    font-weight: 700;
    color: #ffffff;
    border: none;
    border-bottom: 3px solid #2e7d32;
    padding-bottom: 0.5rem;
    margin-bottom: 0.6rem;
    line-height: 1.2;
  }

  section.lead h2 {
    font-size: 1.9rem;
    font-weight: 600;
    color: #e8f1f8;
    border: none;
    border-bottom: 3px solid #2e7d32;
    padding-bottom: 0.4rem;
    margin-bottom: 0.8rem;
  }

  section.lead p {
    color: #a8c8e0;
  }

  section.lead em {
    color: #7ed4a8;
    font-style: italic;
  }

  section.lead strong {
    color: #e8f8ee;
    font-weight: 600;
  }

  section.lead table thead tr {
    background: rgba(46, 125, 50, 0.35) !important;
  }

  section.lead table thead th {
    color: #e0f0e8 !important;
  }

  section.lead table tbody tr:nth-child(odd) {
    background: rgba(255, 255, 255, 0.07) !important;
  }

  section.lead table tbody tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.03) !important;
  }

  section.lead table tbody td {
    color: #b8d4e4 !important;
    border-bottom-color: rgba(255, 255, 255, 0.1) !important;
  }

  /* ── HEADINGS ─────────────────────────────────────────── */
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #0a1929;
    border-left: 5px solid #2e7d32;
    padding-left: 14px;
    margin-bottom: 0.8rem;
    line-height: 1.25;
  }

  h2 {
    font-size: 1.35rem;
    font-weight: 600;
    color: #0a1929;
    border-bottom: 2px solid #2e7d32;
    padding-bottom: 0.25rem;
    margin-bottom: 0.75rem;
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1565c0;
    margin-bottom: 0.35rem;
  }

  /* ── TABLES ───────────────────────────────────────────── */
  table {
    font-size: 0.8rem;
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
    overflow: hidden;
    border-radius: 4px;
  }

  thead tr {
    background: #0a1929 !important;
  }

  thead th {
    padding: 8px 14px !important;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #ffffff !important;
    border: none !important;
    background: #0a1929 !important;
  }

  tbody tr:nth-child(odd) {
    background: #f0f4f8 !important;
  }

  tbody tr:nth-child(even) {
    background: #ffffff !important;
  }

  tbody td {
    padding: 7px 14px !important;
    border: none !important;
    border-bottom: 1px solid #dde4ec !important;
    color: #0d0d0d;
    vertical-align: top;
  }

  tbody tr:last-child td {
    border-bottom: none !important;
  }

  /* ── CODE ─────────────────────────────────────────────── */
  pre {
    font-size: 0.76rem !important;
    background: #071624 !important;
    border-radius: 6px !important;
    border-left: 4px solid #2e7d32 !important;
    padding: 0.9rem 1.2rem !important;
    margin: 0.6rem 0 !important;
  }

  code {
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace !important;
  }

  pre code {
    color: #a8d8b0 !important;
    background: transparent !important;
    font-size: 0.76rem !important;
  }

  :not(pre) > code {
    background: #e6f2e8 !important;
    color: #1b5e20 !important;
    padding: 0.15em 0.45em;
    border-radius: 3px;
    font-size: 0.87em;
  }

  /* ── BLOCKQUOTES ──────────────────────────────────────── */
  blockquote {
    border-left: 4px solid #6a1b9a !important;
    background: #f7f2fc !important;
    margin: 0.8rem 0 !important;
    padding: 0.5rem 1rem !important;
    border-radius: 0 4px 4px 0;
  }

  blockquote p {
    color: #4a148c !important;
    font-style: italic;
    margin: 0;
  }

  /* ── LISTS ────────────────────────────────────────────── */
  ul {
    padding-left: 1.4rem;
  }

  li {
    margin-bottom: 0.2rem;
  }

  ul li::marker {
    color: #2e7d32;
  }

  ol li::marker {
    color: #6a1b9a;
    font-weight: 600;
  }

  /* ── INLINE TEXT ──────────────────────────────────────── */
  strong {
    color: #0a1929;
    font-weight: 600;
  }

  em {
    color: #4a148c;
    font-style: italic;
  }

  /* ── PAGINATION ───────────────────────────────────────── */
  section::after {
    color: #2e7d32;
    font-size: 0.72rem;
    font-weight: 500;
  }

  /* ── HORIZONTAL RULE ──────────────────────────────────── */
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(to right, #0a1929, #2e7d32, #6a1b9a);
    margin: 0.8rem 0;
  }
---

<!-- _class: lead -->

# AI-Assisted Development
## From Experiment to Playbook

_How I built a production-ready marketplace with AI agents — and what every team can learn from it_


<!--
Over the past several months, I've been running a hands-on experiment: building a full-stack production application using AI-assisted development. Today I want to share what worked, what didn't, and a concrete playbook any team can adopt tomorrow.
-->

---

## One Experiment at a Glance

| Metric | Value |
|--------|-------|
| Codebase | 44K lines of TypeScript across 210 files |
| Completed tasks | 94 features, fixes, and improvements |
| Commits | 400+, Agent edits, in line edits, autonomous fixes |
| Test coverage | 36 test files (15 unit, 21 E2E) |
| Database models | 22 models, 49 RLS security policies |
| Documentation | 42 markdown files, comprehensive architecture docs |
| Peak velocity | 70 commits / 8 major tasks in 2 days |

<!--
This isn't a toy project. It's a multi-tenant marketplace with Stripe payments, real auth, row-level security, and a 22-model database. The 100% PR merge rate and zero abandoned PRs tell the real story — quality didn't suffer for speed.
-->

---

## What Changed — Old Way vs. New Way

| Aspect | Traditional | AI-Assisted |
|--------|------------|-------------|
| Feature scoping | Meeting + ticket + estimation | Structured task with subtasks and exit criteria |
| Implementation | Developer writes code line-by-line | Developer describes intent; AI implements with guardrails |
| Code review | Reviewer reads every line | AI follows documented patterns; reviewer validates decisions |
| Documentation | Written after the fact (or never) | Generated alongside code; decisions captured in real-time |
| Consistency | Varies by developer | Enforced by AI instruction files + quality gates |
| Onboarding | Weeks reading code | Read the instruction file, start contributing |

<!--
The shift isn't "AI writes code for us." The shift is: humans focus on *what* and *why*, AI handles *how* within well-defined guardrails. The developer becomes more of an architect and reviewer.
-->

---

<!-- _class: lead -->

## The Three Pillars

<br>

| 1. INSTRUCT | 2. CONSTRAIN | 3. VERIFY |
|:-----------:|:------------:|:---------:|
| Tell AI exactly what to do | Define what NOT to do | Automated quality gates |
| Architecture, patterns, vocabulary | Security rules, boundaries, gotchas | lint · type-check · test · format |

<!--
Every successful AI-assisted workflow rests on three pillars. You have to tell the AI what to do (instructions), what NOT to do (constraints), and then verify the output automatically (quality gates). Miss any one of these and quality breaks down.
-->

---

## Pillar 1 — INSTRUCT: The Instruction File

**The single most impactful practice: a project-level AI instruction file.**

Our file contains:
- **Architecture overview** — system diagram, request flow, directory structure
- **Decision frameworks** — when to use server actions vs. API routes (with decision matrix)
- **Code patterns** — authentication, multi-tenant queries, state management
- **Domain vocabulary** — "Store" not "Shop", "Product" not "Item"
- **Critical gotchas** — auth ID mismatch (Supabase UUID vs. Prisma CUID)

**Why it works:**
- AI follows the same patterns across 210 files with near-perfect consistency
- New developers (human or AI) onboard in minutes, not weeks
- Architectural decisions documented *once*, enforced *everywhere*

<!--
This file is the single highest-ROI artifact in the entire project. It took maybe 2 hours to write, and it saved hundreds of hours of inconsistent code, repeated mistakes, and architectural drift. Think of it as a living style guide that the AI actually reads and follows.
-->

---

## Pillar 2 — CONSTRAIN: Guardrails & Boundaries

**Explicit prohibitions prevent entire categories of bugs.**

From our instruction file:
- `"Never expose SUPABASE_SERVICE_ROLE_KEY to client"` → prevents RLS bypass
- `"Never skip auth checks in server actions"` → prevents unauthorized access
- `"Never compare Store.ownerId (CUID) against user.id (UUID)"` → fixed a bug class in 5 API routes
- `"Always filter by marketplaceId"` → enforces multi-tenant data isolation

**Real example — the auth ID mismatch:**

```
requireAuth() returns Supabase UUID → "abc-123-uuid"
Database User.id is Prisma CUID    → "clx9abc123"
                                      ↑ DIFFERENT!
```

After documenting this constraint: **zero new instances across 80+ mutations.**

<!--
Constraints are the unsung hero. Humans forget edge cases. AI follows instructions literally. When we documented the auth ID mismatch as a "never do this" rule, it went from a recurring bug to a solved problem. Five existing bugs were caught and fixed in one pass.
-->

---

## Pillar 3 — VERIFY: Automated Quality Gates

**Every change must pass four gates before merge:**

```bash
npm run format        # Code formatting (Prettier)
npm run lint          # Static analysis (ESLint)
npx tsc --noEmit      # Type checking (TypeScript strict mode)
npm run test -- --run # Unit + integration tests (Vitest)
```

**Plus architectural enforcement:**

| Layer | What It Enforces |
|-------|-----------------|
| 21 Zod schemas | Runtime input validation |
| 49 RLS policies | Database-level data access |
| Rate limiting | Auth, order, and product endpoints |
| CSRF protection | All mutating API routes |
| Audit logging | All sensitive operations |
| Automated Review | Claude GitHub Agent autonomously scans PRs |

<!--
Quality gates are non-negotiable. AI can generate code fast — which means it can generate *bad* code fast too. The gates catch issues before they reach production. Our type checker alone catches more bugs than most code reviews.
-->

---

## Task Decomposition — How to Talk to AI

**Bad task:** `"Build the checkout flow"`

**Good task structure:**

```markdown
## TASK-074: Checkout Flow
Priority: Critical | Category: Cart/Checkout

### Subtasks:
- [ ] Multi-step form (address → shipping → payment → review)
- [ ] Address selection from saved addresses
- [ ] Stripe PaymentIntent with platform fee calculation
- [ ] Order creation in transaction (Order + OrderItems)
- [ ] Cart clearing after successful payment
- [ ] Email confirmation via Resend

### Constraints:
- Must use prisma.$transaction() for order creation
- Must filter by marketplaceId
- Must validate with Zod schemas from lib/validations.ts
```

<!--
Task decomposition is the developer's primary job in AI-assisted workflows. Well-structured tasks with clear subtasks and explicit constraints produce correct code on the first attempt. Vague tasks produce vague code.
-->

---

## Agent Owner Model — Specialized AI for Specialized Work

**Product Owner (Agent Architect):** Define Scope · Review Output · Validate Plan · Make Decisions

| Agent | Primary Role | Example Tasks |
|-------|-------------|---------------|
| **Explore** | Understand the codebase | "How does X work?" · "Where is Y?" |
| **Plan** | Break down tasks & weigh options | Create TASKs, assess trade-offs |
| **Review** | Validate plan against code rules | Pre-build review; multi-model for large features |
| **Implement** | Write code, tests, docs | Execute clear tasks within constraints |

**When to use which:**
- **Explore first** — before touching anything, understand it
- **Plan always** — every code change tracked as a TASK from Plan Agent
- **Review rigorously** — all TASKs reviewed pre-build; larger features by multiple models
- **Implement last** — only when task + constraints are clearly defined

<!--
We don't throw everything at one AI and hope. Specialized agents for exploration, planning, and implementation mirror how senior engineers actually work: understand the codebase, plan the approach, then implement. The explore-first pattern alone prevented dozens of "wrong approach" rewrites.
-->

---

## Results — Velocity Without Sacrificing Quality

<br>

| Speed | Quality | Coverage |
|-------|---------|----------|
| Peak: 70 commits, 8 features in 2 days | 100% PR merge rate (0 abandoned) | 49 database security policies |
| Avg task cycle: 1–2 hours to merged PR | Near-perfect pattern consistency across 210 files | 21 validation schemas |
| 94 tasks across auth, payments, admin, search, security, analytics | Zero production security incidents | 36 test files |
| | Type-safe end-to-end (Zod → TS → Prisma → Postgres) | 42 documentation files |

<!--
The velocity numbers are impressive, but the quality metrics are the real story. 100% merge rate means the AI isn't generating throwaway code — it's generating production-ready code that follows our patterns. The instruction file and quality gates make this possible.
-->

---

## What Didn't Work — Lessons Learned

| Lesson | Detail |
|--------|--------|
| **Vague instructions produce vague code** | Early tasks without subtasks required 2–3x more iteration |
| **AI drifts without constraints** | Without "never do X" rules, the auth ID mismatch appeared 5 times |
| **Testing can't be an afterthought** | AI code passes type checks but needs runtime tests for business logic |
| **Documentation must be maintained** | Stale instruction files are worse than none — AI follows outdated patterns *confidently* |
| **Not everything should be AI-generated** | Complex architecture, security threat models, and UX flows need human judgment first |

<!--
Honesty about what didn't work is important. AI is not magic. It's a force multiplier that amplifies whatever process you give it. Good process → great results. Sloppy process → fast, confident, wrong code.
-->

---

## The Playbook — 4-Week Rollout

| Week | Focus | Actions |
|------|-------|---------|
| **1 · Foundation** | Instruction file | Create project instruction file (architecture + patterns + constraints); document your "never do this" list; set up quality gates |
| **2 · Task Structure** | Workflow definition | Define task template (goal, subtasks, constraints, exit criteria); structured task tracking; establish domain vocabulary |
| **3 · Workflow** | Agent model | Adopt explore-first pattern; use plan agents for multi-file changes; run quality gates on every change |
| **4 · Iterate** | Continuous improvement | Review instruction file weekly; track what AI gets wrong → add constraints; measure tasks/week, merge rate, bug rate |

> Week 1 is the highest ROI. The instruction file alone transforms AI output. Most teams see measurable productivity gains by week 2.

<!--
This is the slide to leave up during Q&A. It's a concrete 4-week rollout plan. Week 1 is the highest ROI — the instruction file alone transforms how AI works with your codebase. Most teams see measurable productivity gains by week 2.
-->

---

## Recommended Metrics to Track

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Task cycle time** | Hours from ticket to merged PR | Decreasing over time |
| **PR merge rate** | % of PRs merging without major rework | >90% |
| **Rework rate** | % of tasks requiring >1 iteration | <20% |
| **Pattern consistency** | Spot-check: does new code match instruction file? | >95% |
| **Quality gate pass rate** | % of changes passing all gates on first run | Increasing over time |
| **Instruction file updates/week** | Is the team learning and documenting? | 1–3 updates/week |

<!--
These metrics tell you if AI-assisted development is actually working. The most important leading indicator is instruction file updates — if the team is actively maintaining it, everything else follows.
-->

---

<!-- _class: lead -->

## Ask / Next Steps

**Requesting approval to:**

1. **Pilot with Product Owners** using this playbook (4-week rollout)
2. **Standardize the instruction file format** across the org & implement for individual apps
3. **Add AI-assisted development to engineering onboarding**

<br>

<!--
The investment is tiny — 2 hours to create the instruction file, 30 minutes a week to maintain it. The quality gates most teams already have. This is about process, not tooling.
-->

---

<!-- _class: lead -->

# Appendix: Q&A

---

## Q: How do we prevent AI from introducing security vulnerabilities?

**Three layers:**

1. **Instruction file constraints** — explicit "never do X" rules for security-critical patterns
2. **Automated gates** — type checking catches misuse; linting catches anti-patterns; tests catch business logic errors
3. **Human review** — reviewer's job shifts from "is this formatted correctly" to "is this the right approach"

In our project: 49 RLS security policies, CSRF protection, rate limiting, and audit logging — all generated by AI following documented patterns, all verified by automated gates.

---

## Q: What about code ownership and accountability?

The developer who defines the task and reviews the PR owns the code.

AI is a tool — like a compiler or linter.

**The high-value human work is:**
- Task decomposition (defining *what* to build)
- Defining constraints (*what rules* to follow)
- Reviewing for correctness and architectural fit

The implementation is increasingly automatable.

---

## Q: Does this work for legacy codebases?

**Yes — and arguably that's where it's most valuable.**

The instruction file captures tribal knowledge that usually lives in senior engineers' heads.

- Document existing patterns, constraints, and gotchas
- AI follows them
- New team members onboard faster

Our auth ID mismatch is a perfect example: a subtle gotcha that, once documented, never recurred.

---

## Q: What about AI hallucinations / wrong code?

This is why the three pillars matter:

| Pillar | How It Helps |
|--------|-------------|
| **Instruct** | Reduces hallucination — AI has clear patterns to follow |
| **Constrain** | Catches known failure modes — explicit rules for known gotchas |
| **Verify** | Catches the rest — type checker, linter, tests |

**Key insight:** AI makes *different* mistakes than humans. Automated gates catch AI mistakes effectively because they tend to be pattern violations, not logical reasoning errors.

---

## Q: What skills do developers need to develop?

The role shifts toward **senior engineering competencies:**

| Skill | Description |
|-------|-------------|
| **Architecture** | Designing systems, not just implementing them |
| **Task decomposition** | Breaking work into clear, constrained subtasks |
| **Pattern recognition** | Spotting when AI output diverges from conventions |
| **Review efficiency** | Reviewing for correctness, not style |

AI-assisted development effectively levels up the entire team's thinking toward architectural and design work.

---

## Appendix: Key Artifacts from the Experiment

| Artifact | Location | Purpose |
|----------|----------|---------|
| AI Instruction File | `CLAUDE.md` (693 lines) | Architecture, patterns, constraints, gotchas |
| Task Board | `kanban.md` | Active work tracking with priorities |
| Task Archive | `archive.md` (94 tasks) | Historical record of all completed work |
| Quality Gates | `package.json` scripts | format, lint, type-check, test |
| Validation Schemas | `src/lib/validations.ts` (21 schemas) | Runtime input validation |
| Security Policies | `supabase/RLS-POLICIES.sql` (49 policies) | Database-level access control |
| Architecture Docs | `docs/` (35 files) | System design, security audit, guides |
