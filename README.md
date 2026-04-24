# AI Mock Interview

A web app for practicing interviews: define a role and tech stack, get AI-generated questions (technical, behavioral, and experience-focused), record answers with voice (and optional webcam), and review AI feedback. Built with **React**, **TypeScript**, **Vite**, **Clerk**, **Firebase Firestore**, **Google Gemini**, and **shadcn/ui**.

## Features

- **Landing page** — Hero, stats, partner logos marquee, CTA to `/generate`
- **Authentication** — [Clerk](https://clerk.com/) sign-in / sign-up; protected dashboard for signed-in users
- **Dashboard** — Live list of mock interviews (`onSnapshot`); create, edit, start mock, view feedback
- **Interview setup** — Form (position, description, years of experience, tech stack) with **Zod** + **React Hook Form**; AI generates five Q&A pairs stored on the interview document
- **Mock interview** — Per-question flow with speech-to-text and optional webcam; AI rates answers and gives feedback; persists to Firestore
- **Feedback view** — Saved answers and ratings per interview

## Tech Stack

| Area | Technology |
|------|------------|
| UI | React 19, **shadcn/ui** (New York style, neutral base, CSS variables), **Tailwind CSS v4**, **Radix UI**, **CVA**, **Lucide** icons |
| Forms | React Hook Form, Zod, `@hookform/resolvers` |
| Routing | React Router 7 |
| Auth | `@clerk/clerk-react` |
| Database | Firebase **Firestore** (client SDK) |
| AI | `@google/generative-ai` (Gemini, e.g. `gemini-flash-latest`) |
| Toasts | Sonner |
| Speech / camera | `react-hook-speech-to-text`, `react-webcam` |
| Build | Vite 7, TypeScript 5.9 |
| Hosting | Firebase Hosting (`dist/`) |

## Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** (or adapt commands for npm/yarn)
- **Clerk** application, **Firebase** project, **Google AI Studio** (Gemini API key)

## Environment Variables

Create a `.env` or `.env.local` in the project root. Vite only exposes variables prefixed with `VITE_`.

```env
# Clerk (required — the app throws if this is missing)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Firebase Web App config
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Google Gemini
VITE_GEMINI_API_KEY=
```

**Security:** The Gemini key is embedded in the client bundle at build time. For production, prefer a backend or **Cloud Function** that holds the key and proxies requests to Gemini.

## Scripts

```bash
pnpm install      # install dependencies
pnpm dev          # local dev server (Vite)
pnpm build        # TypeScript check + production build → dist/
pnpm preview      # preview the production build locally
pnpm lint         # ESLint
```

## Firebase Hosting

- **`firebase.json`** — `public: "dist"`, SPA rewrite `**` → `/index.html`
- **`.firebaserc`** — default Firebase project (see file for project id)

Deploy after a successful build:

```bash
pnpm run build
firebase deploy --only hosting
```

## Firestore (high level)

- **`users/{clerkUserId}`** — Profile synced when a signed-in user hits the public layout (`AuthHandler`)
- **`interviews`** — `userId`, job fields, `questions: [{ question, answer }]`, timestamps
- **`userAnswers`** — Saved answers with `mockIdRef`, `userId`, ratings, feedback, etc.

You must configure **Firestore security rules** so users can only read and write their own documents.

## Project layout (abbreviated)

```
src/
  App.tsx                    # route tree
  main.tsx                   # ClerkProvider, App, Toaster
  index.css                  # Tailwind + shadcn design tokens
  config/firebase.config.ts  # Firebase app + Firestore
  scripts/index.ts           # Gemini chatSession
  types/index.ts             # Interview, User, UserAnswer
  layouts/                   # public, auth, protected, main
  routes/                    # pages (home, dashboard, mock, feedback, …)
  components/ui/             # shadcn-style primitives + feature UI
  lib/utils.ts               # cn() helper
  handlers/auth-handler.tsx  # Clerk → Firestore user bootstrap
```

## shadcn/ui

Configuration lives in **`components.json`** (style: **new-york**, base color: **neutral**, icon library: **lucide**). The **shadcn** package is a dev dependency (CLI for adding components); the actual UI code is copied into **`src/components/ui/`**.

## License

Private — add a `LICENSE` if you open-source the project.
