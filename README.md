# Cyberpunk Portfolio

A cyberpunk-themed personal portfolio built with React, TypeScript, and Vite. Features an AI-powered chat assistant (Neural Interface) powered by Google Gemini.

## Features

- **Home** — Animated particle background with bio and quick links
- **Projects** — Showcase of personal and professional projects
- **Skills** — Technology stack and proficiency overview
- **Experience** — Work history and career timeline
- **Education** — Academic background
- **Neural Interface** — AI chat assistant (Min's personal AI, powered by Gemini)

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **React Router v7** — client-side routing (HashRouter)
- **tsParticles** — interactive particle animations
- **Lucide React** — icon library
- **Google Gemini** (`@google/genai`) — AI chat backend

## Getting Started

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your Gemini API key in `.env.local`:
   ```
   API_KEY=your_api_key_here
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Project Structure

```
├── components/       # Shared UI components (Layout, CyberCard)
├── pages/            # Route-level page components
├── services/         # Gemini API service
├── assets/images/    # Project and company images
├── constants.tsx     # Bio, projects, skills, experience data
├── types.ts          # Shared TypeScript types
└── App.tsx           # Router and layout setup
```
