# Edgar Buttner — Personal Website

My personal portfolio website featuring an interactive animated background, smooth scroll effects, and a contact form.

## Pages

- **Home** (`/`) — Landing page with a greeting and profile image
- **About** (`/pages/about`) — About me section
- **Projects** (`/pages/projects`) — Showcase of projects displayed as scroll-animated cards

## Notable Features

- **Interactive mesh background** — A grid of nodes that react to mouse movement, displacing and resizing on hover, rendered via a fixed canvas portal
- **Scroll-animated project cards** — Cards animate into view as the user scrolls through the projects page
- **Contact modal** — A modal form that sends messages using [Resend](https://resend.com)
- **Toast notifications** — Feedback toasts for form submission status
- **Custom Google Fonts** — Grape Nuts, Playfair Display, and Quicksand loaded via `next/font`

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Resend](https://resend.com) — email API for the contact form
- [canvas-confetti](https://github.com/catdad/canvas-confetti) — confetti effect

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
