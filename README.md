# Study 2 Enterprise Assistant Prototype

A lightweight Next.js + React + TypeScript prototype for the cognitive walkthrough in Study 2.

## Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- XState v5 + `@xstate/react`
- Lucide React icons
- Static JSON-driven scenario data

## What is implemented now

- Enterprise assistant shell UI
- Scenario sidebar
- Main conversation area
- Hardcoded prompt selector instead of free typing
- A03 Adaptive Interaction Control
  - Variant 1: visible slider
  - Variant 2: profile-based control
- Placeholder rails for A05, A06, A08, A09 and embedded A07 / A14
- XState-based branching / state handling

## Recommended setup

```bash
npx create-next-app@latest study2-prototype --typescript --eslint --app --src-dir
cd study2-prototype
npm install tailwindcss @tailwindcss/postcss postcss
npm install xstate @xstate/react lucide-react clsx tailwind-merge
```

If you want shadcn/ui later:

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card dialog sheet select slider badge tabs separator
```

Then copy the files from this starter into your project.

## Run

```bash
npm install
npm run dev
```

## Suggested next implementation steps

1. Add A06 variants (short confirmation card vs intent canvas)
2. Add A09 banner variants (passive vs actionable)
3. Add A08 evidence variants (inline vs side-panel)
4. Add A05 artefact preview / download flow
5. Add a researcher mode toggle to jump between variant branches faster during sessions
