# Mirai Forms

Mirai Forms is a modern, high-performance form builder and data collection platform designed for the future. Built with a powerful monorepo architecture, it seamlessly bridges a highly interactive Next.js frontend with an incredibly fast, type-safe Express & tRPC backend.

---

## Tech Stack

- **Monorepo:** [Turborepo](https://turbo.build/repo) + [pnpm](https://pnpm.io/) Workspaces
- **Frontend:** Next.js 16 (App Router), Tailwind CSS, shadcn/ui
- **Backend:** Express, tRPC, Zod validation
- **Database:** PostgreSQL (Neon), Drizzle ORM
- **Authentication:** Clerk
- **API Documentation:** Scalar API

---

## Setup Instructions

### 1. Prerequisites

- Node.js >= 18.x
- `pnpm` (v8 or higher)
- A PostgreSQL database (e.g., [Neon](https://neon.tech))
- A [Clerk](https://clerk.com) account for authentication

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/CodeX047/MiraiForms.git
cd MiraiForms
pnpm install
```

### 3. Environment Configuration

You need to set up environment variables for both the root project and the individual apps.

Create a `.env` file at the root of the project with the following keys:

```env
# Database
DATABASE_URL="postgres://user:password@host/db_name"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Frontend Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:8000"

# Backend Config
PORT="8000"
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### 4. Database Setup

Push the Drizzle schema to your PostgreSQL database:

```bash
pnpm run db:push
# OR run migrations:
pnpm run db:migrate
```

### 5. Running Locally

Start the development server for all apps and packages simultaneously using Turborepo:

```bash
pnpm dev
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)

---

## API Docs (Scalar)

Mirai Forms automatically generates beautiful API documentation for the backend using **Scalar**.

When the backend server is running, you can access the interactive API Reference at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

This dashboard allows you to explore all tRPC/Express endpoints, view required payloads via Zod schemas, and execute test requests directly from your browser.

---

## Demo Credentials

To explore the application without signing up, you can use the following demo credentials on the login screen:

> **Email:** `simpmug@gmail.com`

> **Password:** `Mirai@07$`

Scalar Docs: **[https://miraiforms.onrender.com/docs](https://miraiforms.onrender.com/docs)**

_(Note to judges/evaluators: If the demo credentials above do not work, please feel free to create a new account using the standard Clerk sign-up flow.)_
