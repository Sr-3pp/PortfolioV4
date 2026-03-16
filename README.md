# Sr3pp Portfolio V4

Content-driven portfolio built with Nuxt 4, Nuxt Content, Nuxt UI, and Vercel deployment targets.

## Stack

- Nuxt 4
- Nuxt Content for page and project content
- Nuxt UI for interface components
- Nuxt Image and Nuxt Scripts
- Vercel Analytics and Speed Insights
- `nuxt-nodemailer` for the contact form endpoint
- Nuxt Studio for content editing

## Features

- Home and about pages powered by content files
- Project detail pages generated from Markdown content
- SEO metadata and JSON-LD for portfolio pages
- Contact API endpoint that sends emails through configured SMTP
- Vercel-ready Nitro build output

## Project Structure

```text
app/
  components/        UI and content components
  composables/       shared Nuxt composables
  pages/             route pages
content/
  json/              certificates and CV data
  pages/             home, about, and project content
server/
  api/contact.ts     contact form email endpoint
tests/               Vitest test suite
```

## Setup

Install dependencies with pnpm:

```bash
pnpm install
```

Start the dev server at `http://localhost:3000`:

```bash
pnpm dev
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm test
pnpm test:run
pnpm test:coverage
pnpm typecheck
pnpm ci:check
```

## Environment Variables

Create a `.env` file for local development as needed.

### Public site metadata

```bash
NUXT_PUBLIC_SITE_URL=https://sr3pp.dev
NUXT_CONTACT_MAIL=you@example.com
```

### SMTP for contact form

```bash
NUXT_EMAIL_FROM=portfolio@example.com
NUXT_EMAIL_HOST=smtp.example.com
NUXT_EMAIL_PORT=465
NUXT_EMAIL_USER=portfolio@example.com
NUXT_EMAIL_PASS=your-password
```

### Nuxt Studio integration

```bash
STUDIO_GITHUB_OWNER=your-github-user
STUDIO_GITHUB_REPO=your-repo
STUDIO_GITHUB_BRANCH=main
STUDIO_GITHUB_ROOT_DIR=content
```

## Content Editing

Most portfolio data lives under `content/`:

- `content/pages/index.md` for homepage content
- `content/pages/about.md` for the about page
- `content/pages/projects/**` for project entries
- `content/json/cv.json` for CV data
- `content/json/certificates/*.json` for certificate data

Nuxt Studio is mounted at `/studio` when configured.

## Contact Endpoint

The contact form posts to `POST /api/contact`.

It sends a message using the configured SMTP credentials and `NUXT_CONTACT_MAIL` as the recipient.

## Deployment

This project is configured for Vercel through Nitro:

- `nitro.preset = 'vercel'`
- route rules enable caching for public content pages
- Vercel Analytics and Speed Insights are enabled

Build locally with:

```bash
pnpm build
```
