# asadi.ai — Personal Portfolio & AI Assistant

[![CI](https://github.com/moodyguyhub/asadi-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/moodyguyhub/asadi-ai/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://asadi.ai)

> AI-Native Technical Leader — [asadi.ai](https://asadi.ai)

## Features

- ⚡ Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4
- 🤖 **Atlas** — AI-powered portfolio assistant with voice support (OpenAI TTS)
- 📱 **Social Publisher** — Publish to LinkedIn / X with encrypted tokens & content safety scanning
- 🗃️ PostgreSQL + Prisma ORM with driver adapters
- 📊 Vercel Analytics with custom event tracking
- 🔒 AES-256-GCM token encryption, audit trails, idempotency keys

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, Framer Motion |
| UI | Catalyst (Headless UI), Heroicons |
| Database | PostgreSQL + Prisma 7 |
| AI | OpenAI (GPT-4o-mini, TTS) |
| Hosting | Vercel |
| Storage | S3-compatible (AWS / R2) |
| Testing | Vitest |
| CI | GitHub Actions |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint (excludes Catalyst) |
| `npm run test` | Run all tests |
| `npm run test:atlas` | Run Atlas router tests |
| `npm run cv:pdf` | Generate CV PDF from HTML |
| `npm run db:migrate` | Run Prisma migrations |

## License

[MIT](LICENSE)
