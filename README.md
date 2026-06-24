# 💳 JityGeld — Track Money. Build Better Habits.

JityGeld is a premium personal finance tracker and budgeting tool built with **Next.js (App Router)**, **TailwindCSS**, **Prisma ORM**, and **Supabase**. It empowers users to monitor cash flows, set smart savings milestones, manage category-based budgets, and analyze spending habits with clean, premium interactive charts.

---

## ✨ Features

### 📊 Financial Dashboard Overview
* **Real-time Balance Tracker**: Live balances updated automatically based on income and expenses with progress indicators.
* **Monthly Spending Charts**: High-performance interactive bar charts that require at least two months of data before rendering, preventing misleading single-point charts.
* **Savings Progress Gauge**: Circular progress gauge measuring current savings against active milestone goals.
* **Recent Transactions List**: Compact, chronological table of transactions featuring auto-categorized icon representation.
* **Fintech Insights**: Quick, contextual insights that provide financial updates at a glance.

### 📈 Analytics & Trends
* **Cash Flow Charts**: Multi-month comparisons of total income vs. total expenses.
* **Income & Expense Trajectories**: Beautiful dual area charts tracing month-over-month trends.
* **Expense Breakdown**: Inner-radius donut charts visualizing cash distribution across categories.

### 💰 Transaction Ledger
* Add, edit, and delete transactions with tags, custom dates, description parameters, and category tags.
* Pagination and search indicators to filter transaction history quickly.

### ⚙️ User Profiles & Settings
* Compact, Linear/Vercel-style account dropdowns.
* High-performance Avatar Upload: Compresses user photos locally to WebP formats (<50KB target size) before uploading to Supabase Storage.
* Customizable currencies and user profile data configurations.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 15+](https://nextjs.org/) (App Router & Turbopack)
* **Styling**: [TailwindCSS](https://tailwindcss.com/)
* **Database Interface**: [Prisma ORM](https://www.prisma.io/)
* **Database Server**: PostgreSQL via [Supabase](https://supabase.com/)
* **Auth & Session Handling**: Supabase Auth (SSR Cookie-based Sessions)
* **Storage Provider**: Supabase Storage
* **Charts Engine**: [Recharts](https://recharts.org/)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18.x or later)** and **npm/yarn/pnpm** installed.

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/jityGeld.git
cd jityGeld
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure the database and Supabase keys:
```env
# Database connection string (PostgreSQL Pooler)
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Database connection string (PostgreSQL Direct)
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOi..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
```

### 4. Database Setup & Sync
Generate the Prisma Client types and run database migrations to seed default transaction categories:
```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Application
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your web browser.

---

## 📊 Development Scripts

* **`npm run dev`**: Boots development server with Turbopack hot-reloads.
* **`npm run build`**: Compiles production bundles, runs TypeScript checker, and builds static routes.
* **`npm run lint`**: Checks for code styling, unused variables, and ESLint rule infractions.

---

## 🔒 Security & Code Standards

* **Hydration Mismatch Mitigation**: Core client-side modules wait for components to mount using an `isMounted` state before loading charts, mitigating differences in locale or date formats between SSR engines and browsers.
* **Layout Constraints for Charts**: Every Recharts wrapper is constrained inside absolute height and min-height wrapper `div`s. This prevents ResponsiveContainer sizing crashes (errors measuring width/height as 0) when rendering components dynamically.
* **Safe Catch Typings**: Catch blocks safely cast caught objects using the `unknown` type, preventing implicit `any` leaks.

---

## 📄 License
This project is licensed under the MIT License.
