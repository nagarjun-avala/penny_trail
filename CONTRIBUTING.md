# Contributing Guide

Welcome! 🎉 We're thrilled you're considering contributing to this project. Whether it's bug reports, feature suggestions, code improvements, or documentation help — your support makes this better for everyone.

## 🚀 How to Contribute

### 1. Fork & Clone

- Fork the repo to your own GitHub.
- Clone your forked version locally:

```bash
git clone https://github.com/nagarjun-avala/penny_trail.git
cd penny_trail
```

### 2. Set Up the Project

Make sure you have Node.js (18+) and npm installed.

```bash
npm install
npm dev
```

This will start the app locally.

### 3. Follow the Branching Model

- Main: Production-ready code.
- Dev: Staging for new features/fixes.
- Feature branches: `feat/your-feature-name`

### 4. Code Style

Use Prettier and follow the existing Tailwind and file naming conventions.
Run:

```bash
npm lint
```

### 5. Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add budget filtering by custom range
fix: Correct transaction sorting bug
chore: Update dependencies
```

### 6. Push & PR

Push your branch and open a Pull Request to the `dev` branch.
Use a descriptive title and include screenshots or demos if applicable.

## 📁 Project Structure Overview

```
.
├── app/               # App-Route-based components
├── components/        # Reusable UI components
├── lib/               # Utilities and helpers (e.g., currency, constants)
├── hooks/             # Custom React hooks
├── data/              # Dummy data for development
```

## 📜 Coding Standards

- Keep components modular and readable.
- Avoid inline styles unless dynamic.
- Reuse existing UI components where possible.

## 🤝 Code of Conduct

We follow [Contributor Covenant](https://www.contributor-covenant.org/).
Be kind, respectful, and inclusive.

## 🛠️ Development Commands

| Command     | Description         |
| ----------- | ------------------- |
| `npm dev`   | Run app in dev mode |
| `npm build` | Production build    |
| `npm lint`  | Lint your code      |

## 🙌 Thank You

Your time and effort make this project stronger. We appreciate every line of code, every issue reported, and every suggestion made.

Happy hacking! 💻
