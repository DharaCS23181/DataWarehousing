# POC Web Application

A modern React + Vite + TailwindCSS proof-of-concept web application.

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool & dev server
- **TailwindCSS 3** — Utility-first CSS framework
- **React Router v6** — Client-side routing

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── app/          # App shell, routing
├── pages/        # Route-level page components
├── components/   # Shared UI components
├── features/     # Feature-based modules
├── services/     # API & external service integrations
├── hooks/        # Custom React hooks
├── context/      # React context providers
├── store/        # State management
├── utils/        # Utility functions
├── constants/    # App-wide constants
├── styles/       # Global styles
├── assets/       # Static assets
├── config/       # Environment & app config
├── lib/          # Third-party library wrappers
├── types/        # Type definitions
└── tests/        # Test utilities & setup
```

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
