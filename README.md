# DevQuery Forum

A modern, Stack Overflow-style Q&A platform where every question receives instant AI-generated answers through background processing, while maintaining the ability for human responses.

## Features

- **Instant AI Responses**: Every question gets an AI-generated answer within seconds using GPT-5
- **GPT-5 Vision Support**: AI can analyze images attached to questions (up to 4 images per question)
- **Smart Auto-Tagging**: AI automatically categorizes and tags questions using GPT-5 Mini
- **Image Upload**: Upload up to 4 images per question/answer using AWS S3 presigned URLs
- **Full-Text Search**: Fast PostgreSQL-powered search across questions and answers
- **Rate Limiting**: Upstash Redis-based rate limiting to prevent abuse
- **Voting & Reputation**: Stack Overflow-style voting system with reputation points
- **User Profiles**: Comprehensive user profiles showing stats, questions, and answers
- **Full Authentication**: Email/password + OAuth (GitHub & Google) with Better Auth
- **Event-Driven Architecture**: Reliable background processing with Inngest
- **Modern UI**: Beautiful, responsive design with Tailwind CSS v4 and shadcn/ui
- **Serverless-First**: Built for scale using Neon Postgres and Vercel

## Tech Stack

### Frontend

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS v4
- shadcn/ui components
- TanStack Query (React Query)
- React Hook Form with Zod validation

### Backend

- Node.js 20+ (Next.js API Routes)
- TypeScript 5.3+
- Better Auth v1.3+
- Drizzle ORM v0.44+
- Neon Postgres (serverless)
- Inngest v3.0+ (background jobs)

### AI & Services

- OpenAI GPT-5 (main answers with vision support) & GPT-5 Mini (tagging)
- AWS S3 (image storage with presigned URLs)
- Upstash Redis (rate limiting)
- Resend (email service)
- React Email (email templates)

## Getting Started

### Prerequisites

- Node.js 20 or higher
- A Neon Postgres database
- OpenAI API key
- Inngest account
- AWS S3 bucket (for image uploads)
- Upstash Redis database (for rate limiting)
- Resend API key (for emails)
- GitHub/Google OAuth credentials (optional)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Setup environment variables**

   Copy `.env.example` to `.env.local` and fill in your credentials:

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   - `DATABASE_URL`: Your Neon Postgres connection string
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_APP_URL`: Your app URL (e.g., http://localhost:3000)
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `INNGEST_EVENT_KEY`: From Inngest dashboard
   - `INNGEST_SIGNING_KEY`: From Inngest dashboard
   - `RESEND_API_KEY`: Your Resend API key
   - `AWS_REGION`: AWS region for S3 (e.g., us-east-1)
   - `AWS_ACCESS_KEY_ID`: AWS access key
   - `AWS_SECRET_ACCESS_KEY`: AWS secret key
   - `AWS_S3_BUCKET_NAME`: S3 bucket name
   - `UPSTASH_REDIS_REST_URL`: Upstash Redis REST URL
   - `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token

   Optional (for OAuth):
   - `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. **Setup database**

   Generate and run database migrations:

   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Setup Inngest Dev Server** (optional for local development)

   In a separate terminal:

   ```bash
   npx inngest-cli@latest dev
   ```

   This will start the Inngest dev server at [http://localhost:8288](http://localhost:8288) where you can view function execution logs.

## Project Structure

```
project/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/           # Better Auth endpoints
│   │   ├── inngest/        # Inngest function handler
│   │   ├── questions/      # Question CRUD + voting
│   │   ├── answers/        # Answer CRUD + voting
│   │   ├── users/          # User profile endpoints
│   │   ├── search/         # Full-text search endpoint
│   │   └── upload/         # S3 presigned URL generation
│   ├── auth/               # Auth pages
│   │   ├── signin/         # Sign in page
│   │   └── signup/         # Sign up page
│   ├── questions/          # Question pages
│   │   ├── [id]/          # Question detail page
│   │   ├── ask/           # Ask question page (with image upload)
│   │   └── page.tsx       # Questions list page
│   ├── search/            # Search page
│   │   └── page.tsx       # Search results page
│   ├── users/             # User pages
│   │   └── [id]/          # User profile page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── header.tsx         # Dynamic header with auth
│   ├── vote-buttons.tsx   # Voting component
│   ├── image-upload.tsx   # S3 image upload component (max 4 images)
│   └── providers.tsx      # React Query provider
├── inngest/               # Inngest functions
│   └── functions/
│       ├── generate-ai-answer.ts  # GPT-5 answer generation with vision
│       ├── send-welcome-email.ts  # Welcome email
│       └── send-answer-notification.ts
├── lib/                   # Utility files
│   ├── api/              # Centralized API & query management
│   │   ├── index.ts      # API client, Zod schemas, types
│   │   ├── queries/      # TanStack Query hooks (GET operations)
│   │   │   ├── questions.ts
│   │   │   ├── users.ts
│   │   │   ├── search.ts
│   │   │   └── images.ts
│   │   └── mutations/    # TanStack Mutation hooks (POST/PUT/DELETE)
│   │       ├── questions.ts
│   │       ├── answers.ts
│   │       ├── votes.ts
│   │       └── images.ts
│   ├── schema.ts         # Drizzle database schema
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Better Auth server config
│   ├── auth-client.ts    # Better Auth client hooks
│   ├── inngest.ts        # Inngest client
│   ├── s3.ts             # AWS S3 client configuration
│   ├── rate-limit.ts     # Upstash Redis rate limiting
│   └── utils.ts          # Helper functions
├── proxy.ts               # Next.js 16 proxy for rate limiting
└── drizzle/              # Database migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Centralized Query Management

This project uses a centralized query management system built with TanStack Query (React Query). All API calls are organized in dedicated folders rather than scattered throughout components.

### Structure
- **`lib/api/`** - API client, Zod schemas, and type definitions with runtime validation
- **`lib/queries/`** - Read operations (GET requests) with TanStack Query hooks
- **`lib/mutations/`** - Write operations (POST, PUT, DELETE) with TanStack Mutation hooks

### Benefits
- **Type Safety**: Zod schemas provide runtime validation and TypeScript types
- **Code Organization**: All API logic centralized in dedicated folders
- **Caching**: Automatic caching, background refetching, and stale-while-revalidate
- **Optimistic Updates**: Better UX with immediate UI updates
- **Error Handling**: Centralized error handling with retry logic
- **Performance**: Query deduplication and intelligent cache management

### Usage Examples

```tsx
// Using queries
import { useQuestions, useQuestion } from "@/lib/queries";
const { data, isLoading } = useQuestions(1);
const { data: question } = useQuestion(id);

// Using mutations
import { useCreateQuestion, useVote } from "@/lib/mutations";
const createQuestion = useCreateQuestion(); // Handles navigation and cache invalidation
const vote = useVote(); // Handles optimistic updates and cache invalidation
```

## Key Features Implementation Status

- [x] User authentication (email/password + OAuth - GitHub & Google)
- [x] Complete auth pages (sign in, sign up, sign out)
- [x] Ask questions with Markdown support
- [x] **Image upload** (up to 4 images per question using AWS S3)
- [x] **GPT-5 Vision** (AI analyzes images in questions)
- [x] View questions list with pagination
- [x] View question details with all answers
- [x] AI answer generation with GPT-5
- [x] Auto-tagging with GPT-5 Mini
- [x] Email notifications (welcome, answer alerts)
- [x] **Voting system** (upvote/downvote questions & answers)
- [x] **Reputation system** (earn points from votes)
- [x] **User profiles** (view user stats, questions, answers)
- [x] Dynamic header (shows logged-in user)
- [x] **Full-text search** (PostgreSQL to_tsvector search)
- [x] **Rate limiting** (Upstash Redis-based protection)
- [x] **Centralized query management** (TanStack Query with Zod validation)
- [ ] Accept answers
- [ ] Daily digest emails
- [ ] Comments on answers

## Deploy on Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Install Inngest integration from Vercel marketplace
5. Deploy!

## License

MIT
