# JityGeld — Project Context for AI Agents

This file is the **complete context document** for the JityGeld personal finance web application. Read this file in full before writing any code. It documents the architecture, design system, database schema, component structure, and the full history of features and changes made.

---

## 1. What Is JityGeld?

**JityGeld** is a personal finance dashboard web application. It allows users to:
- Track income and expense transactions
- Categorize transactions
- View spending analytics (weekly, monthly, yearly)
- Set and track savings goals
- Visualize cash flow and expense breakdowns

It is inspired by modern fintech apps like **Copilot Money, Monarch Money, Revolut, and Stripe Dashboard**.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.2.9** (App Router, Turbopack) |
| Language | **TypeScript 5** |
| Styling | **Tailwind CSS v4** |
| UI Components | **shadcn/ui** (base-ui primitives via @base-ui/react) |
| Icons | **lucide-react** |
| Charts | **Recharts 3** |
| Forms | **react-hook-form** + **zod** |
| Auth | **Supabase Auth** (via @supabase/ssr) |
| Database Client | **Prisma 7** (with @prisma/adapter-pg) |
| Database | **PostgreSQL** (hosted on Supabase) |
| Session Proxy | Custom proxy.ts for Supabase session refresh |
| Theming | **next-themes** |
| Animation | **tw-animate-css** + custom shimmer keyframes |

> IMPORTANT: Next.js 16 is NOT the same as Next.js 14/15 from training data.
> APIs and conventions differ. Always read node_modules/next/dist/docs/ before writing any Next.js-specific code.

---

## 3. Environment Variables

Required in .env:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 4. Project Structure

```
d:/jityGeld/
├── app/
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Dashboard shell (header + sidebar)
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main dashboard page (Server Component)
│   │   │   ├── loading.tsx       # Suspense loading UI
│   │   │   ├── total-balance-card.tsx
│   │   │   ├── spending-analytics.tsx   # Spending card w/ time range selector
│   │   │   ├── main-analytics-chart.tsx # Expenses & Income dual-area chart
│   │   │   ├── recent-transactions.tsx
│   │   │   ├── cash-flow-chart.tsx
│   │   │   ├── expense-pie-chart.tsx
│   │   │   ├── jitygeld-insights.tsx    # AI insights banner
│   │   │   ├── savings-progress.tsx
│   │   │   └── stats-cards.tsx
│   │   ├── transactions/         # Full transaction list + CRUD
│   │   ├── analytics/            # Detailed analytics page
│   │   ├── savings/              # Savings goals management
│   │   ├── categories/           # Category management
│   │   └── settings/             # User profile settings
│   ├── auth/callback/route.ts    # Supabase OAuth callback handler
│   ├── globals.css               # Global styles + design tokens
│   ├── layout.tsx                # Root layout (ThemeProvider)
│   └── generated/prisma/         # Auto-generated Prisma client
├── actions/                      # Next.js Server Actions
│   ├── auth.ts                   # Login, register, logout
│   ├── transactions.ts           # CRUD for transactions
│   ├── categories.ts             # CRUD for categories
│   ├── savings.ts                # CRUD for savings goals
│   ├── spending.ts               # Spending aggregation by time range
│   └── profile.ts                # User profile updates
├── services/                     # Server-side data fetching (used by pages)
│   ├── dashboard.ts              # Dashboard stats aggregation
│   ├── analytics.ts              # Analytics page aggregation
│   ├── transactions.ts           # Transaction list queries
│   ├── categories.ts             # Category list queries
│   └── savings.ts                # Savings goals queries
├── components/
│   ├── ui/                       # shadcn/ui primitive components
│   │   ├── select.tsx            # Select with custom "outline" variant
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── dashboard-header.tsx      # Responsive header (mobile hamburger + drawer)
│   ├── skeletons.tsx             # All page-specific shimmer skeletons
│   ├── app-sidebar.tsx           # Desktop sidebar navigation
│   ├── theme-toggle.tsx          # Dark/light mode toggle
│   └── user-nav.tsx              # Profile dropdown
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # createClient() for Server Components
│   │   └── client.ts             # createClient() for Client Components
│   └── prisma.ts                 # Prisma singleton client
├── types/index.ts                # Shared TypeScript types
├── utils/                        # Utility helpers
├── prisma/schema.prisma          # Database schema
├── proxy.ts                      # Supabase session refresh proxy
├── AGENTS.md                     # Agent behavioral rules
└── CLAUDE.md                     # This file
```

---

## 5. Database Schema

All tables use UUID primary keys matching Supabase Auth user IDs.

### users
- id: UUID (PK) — matches Supabase Auth UUID
- email: String (unique)
- name: String? — optional display name
- created_at / updated_at: DateTime

### categories
- id: UUID (PK)
- user_id: UUID (FK → users, cascade delete)
- name: String
- type: Enum INCOME | EXPENSE
- created_at / updated_at: DateTime

### transactions
- id: UUID (PK)
- user_id: UUID (FK → users, cascade delete)
- category_id: UUID (FK → categories, cascade delete)
- amount: Decimal(15,2)
- type: Enum INCOME | EXPENSE
- description: String?
- transaction_date: Date
- created_at / updated_at: DateTime
- Indexes: user_id, category_id, transaction_date, (user_id, transaction_date)

### savings_goals
- id: UUID (PK)
- user_id: UUID (FK → users, cascade delete)
- title: String
- target_amount: Decimal(15,2)
- current_amount: Decimal(15,2) — default 0
- deadline: Date?
- created_at / updated_at: DateTime

---

## 6. Authentication Flow

1. User visits /login or /register (auth route group).
2. Server Action in actions/auth.ts calls Supabase Auth.
3. On success, Supabase sets session cookie via @supabase/ssr.
4. proxy.ts middleware refreshes the session on every request.
5. Protected routes in (dashboard) layout check the session server-side.
6. /auth/callback/route.ts handles OAuth/magic link redirects.

---

## 7. Design System

### Color Palette (Fintech Blue — migrated from Emerald Green)

Light mode:
- Primary:    oklch(0.60 0.20 250)  approx #3B82F6
- Background: oklch(0.96 0.015 248)
- Card:       oklch(1 0 0) = white
- Border:     oklch(0.915 0.008 250)

Dark mode:
- Primary:    oklch(0.72 0.16 250)  approx #60A5FA
- Background: oklch(0.13 0.015 260)
- Card:       oklch(0.18 0.015 260)
- Border:     oklch(0.25 0.015 260)

### Chart Colors
- Income:  Blue (chart-1)
- Expense: Red (chart-5 / destructive)
- Savings: Cyan (chart-3)
- Balance: Indigo

### Typography
Font: Inter (Google Fonts)

### Shimmer Skeleton Animation
CSS variables: --skeleton-base, --skeleton-highlight
Class: animate-shimmer (1.6s infinite linear gradient sweep)
Class: animate-fade-in (200ms ease-out opacity)

---

## 8. Key Components & Patterns

### SelectTrigger "outline" Variant
File: components/ui/select.tsx

Two variants exist:
- "default": form underline style (used in forms/dialogs)
- "outline": compact dashboard filter button (Spending card, Expenses & Income card)

Outline variant specs:
- padding:       py-1 px-3
- height:        ~26px (auto)
- border-radius: rounded-lg (8px)
- font:          text-xs font-semibold
- border:        1px solid var(--border)
- background:    var(--card)
- chevron:       size-3 (12px)
- hover:         bg-muted/40, 200ms transition
- width:         auto (w-fit, based on label text)

SelectContent for dashboard dropdowns:
- width: 150px
- padding: p-[4px]
- border-radius: rounded-lg
- sideOffset: 4px
- alignItemWithTrigger={false} (decouples popup width from trigger)

SelectItem specs:
- height: h-7 (28px)
- padding: px-2.5
- font: text-xs font-semibold
- selected (light): bg-blue-500/10 text-blue-600
- selected (dark): bg-blue-950/30 text-blue-400
- hover: bg-muted text-foreground

### Dashboard Header — Mobile Responsive
File: components/dashboard-header.tsx

- Desktop (>=1024px): Horizontal nav bar
- Tablet (768-1023px): Hamburger + collapsed nav
- Mobile (<768px): Top app bar + slide-over drawer from left
  - Drawer contains: nav links, dark mode toggle, logout
  - Active page: blue bg + white icon + rounded-lg

### Spending Card — Time Range Selector
File: app/(dashboard)/dashboard/spending-analytics.tsx

- Weekly: Mon-Sun daily totals, % vs previous week
- Monthly: Week 1-4 totals, % vs previous month
- Yearly: Jan-Dec monthly totals, % vs previous year
- Active bar: highlighted blue
- Range persisted in localStorage
- Server Action: actions/spending.ts

### Skeleton Loading System
File: components/skeletons.tsx

Every page has a custom shimmer skeleton mimicking actual UI.
No generic grey blocks. Each skeleton matches the final layout.

---

## 9. Development Commands

```
npm run dev           # Start dev server
npm run build         # prisma generate && next build
npm run lint          # eslint
npx prisma generate   # Regenerate Prisma client only
```

---

## 10. History of Major Prompts & Changes

### [1] Dark Mode Color Audit
Replace all hardcoded white/light backgrounds with CSS variable tokens.
Every component must switch correctly between light and dark mode.
Used: bg-card, bg-background, bg-muted, border-border throughout.

### [2] Dashboard Functionality Audit
Connect all dashboard cards to real Supabase/Prisma queries.
services/dashboard.ts aggregates total balance, income, expenses, transactions.
Charts use real transaction data. Empty states only when zero transactions.

### [3] Dashboard Overview Redesign
Dashboard should not reuse the full Analytics page.
Create lightweight mini-chart overview: mini spending bar chart (last 6 months),
compact dual-area income vs expense chart. Missing months = zero, not hidden.
Analytics page stays detailed and untouched.

### [4] Design System: Emerald Green → Modern Fintech Blue
Replace all primary green with blue palette (#3B82F6 light / #60A5FA dark).
Update globals.css tokens, all buttons, nav, tabs, links, charts.
Chart colors: Income=Blue, Expense=Red, Savings=Cyan, Balance=Indigo.
Remove all hardcoded emerald-* Tailwind classes.

### [5] Responsive Mobile Navigation
Desktop (>=1024px): keep horizontal nav.
Tablet (768-1023px): hamburger collapse.
Mobile (<768px): top app bar + slide-over drawer.
Drawer: nav links + dark mode toggle + logout.
Active page: blue bg + white icon + rounded-lg.
File: components/dashboard-header.tsx (Client Component).

### [6] Premium Skeleton Loading
Replace generic placeholder blocks with shimmer skeletons mimicking real UI.
animate-shimmer keyframe in globals.css.
components/skeletons.tsx: all page-specific skeletons.
loading.tsx in every route uses these skeletons.
Content appears with animate-fade-in after hydration.

### [7] Spending Period Selector (Weekly/Monthly/Yearly)
Make "Monthly" dropdown functional with Weekly, Monthly, Yearly options.
Weekly: Mon-Sun breakdown, % vs previous week.
Monthly: Week 1-4, % vs previous month.
Yearly: Jan-Dec, % vs previous year.
Server Action: actions/spending.ts. Active bar highlighted blue. Persisted in localStorage.

### [8] Spending Dropdown Initial UI Fix
First refinement pass: reduce dropdown bubble radius, fix oversized width,
fix excessive item spacing, reduce font size, resize trigger.
Applied: SelectTrigger outline variant, SelectContent width 170px, item h-9.

### [9] Spending Trigger Visual Alignment
Trigger must exactly match the "Options" button in Expenses & Income card.
Same height, padding, border, border-radius, font size, font weight, chevron.
Result: py-1 px-3, rounded-lg, text-xs font-semibold, size-3 chevron, ~26px height.

### [10] Spending Dropdown Compaction
Dropdown popup still too large vs trigger.
Reduced: width 170px→150px, sideOffset 6→4, item height h-9→h-7,
font text-sm→text-xs, padding p-[6px]→p-[4px], gap 2px→1px.

---

## 11. Agent Behavioral Rules

### Code Style
- TypeScript only. No JavaScript files except config.
- All colors via CSS variables — never hardcode hex/rgb in className.
- Use cn() (clsx + tailwind-merge) for conditional classes.
- No inline style props unless absolutely unavoidable.
- No !important.

### Next.js Rules
- App Router only — no pages/ directory.
- Server Components by default. Add "use client" only for event handlers, hooks, browser APIs.
- Server Actions in actions/ handle all mutations.
- Never call Prisma from a Client Component.
- Data fetching in Server Components via services/ functions.
- Loading UI in loading.tsx route files using skeletons from components/skeletons.tsx.

### Prisma Rules
- Always use singleton from lib/prisma.ts.
- Client generated to app/generated/prisma/ (non-default location).
- All queries must filter by userId — never cross-user data.
- Run prisma generate before building (already in npm run build).

### Supabase Auth Rules
- Server Components: lib/supabase/server.ts → createClient()
- Client Components: lib/supabase/client.ts → createClient()
- Use getUser() not getSession() for secure server-side auth checks.
- proxy.ts handles session refresh automatically.

### UI Component Rules
- Use shadcn/ui primitives from components/ui/.
- Dashboard filter buttons: SelectTrigger variant="outline" — NOT variant="default".
- Skeleton loading states: add to components/skeletons.tsx — never create one-off styles.
- No white backgrounds in dark mode — always use bg-card, bg-background, bg-muted.
- No emerald/green — design system is blue.

### Validation After Every Change
1. npm run lint — must pass with 0 errors.
2. npm run build — must compile successfully.
3. git status — working tree must be clean after commits.

---

## 12. Vercel Deployment

Required environment variables in Vercel dashboard:
- DATABASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Build command: prisma generate && next build (set in package.json)
Prisma uses @prisma/adapter-pg for serverless connection pooling compatibility.
