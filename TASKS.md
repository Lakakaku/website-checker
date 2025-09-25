Website-Checker Development Tasks
Tech Stack
Core Technologies

- Frontend: Next.js 14 (App Router) with TypeScript
- Backend: Node.js with Express/Next.js API Routes
- Database: Railway PostgreSQL
- Hosting:
  - Frontend/API: Vercel
  - Background Jobs: Railway (for long-running scans)
- Styling: Tailwind CSS + shadcn/ui
- Payment: Stripe
- Email: Resend or SendGrid
- Queue: BullMQ with Redis (hosted on Railway)
- Accessibility Scanner: Axe-core + Puppeteer/Playwright
  Additional Libraries
- Charts: Recharts or Chart.js
- PDF Generation: React-pdf or Puppeteer
- Authentication: NextAuth.js (Auth.js)
- Forms: React Hook Form + Zod
- State Management: Zustand or TanStack Query
- Analytics: Mixpanel or PostHog
- Monitoring: Sentry
  Database Schema (Railway PostgreSQL)
  -- Companies being analyzed
  companies (
  id uuid primary key,
  name text,
  website_url text unique,
  industry text,
  email_contact text,
  organization_number text,
  created_at timestamp,
  status text, -- 'scanning', 'pending', 'customer', 'failure'
  emailed boolean default false,
  emailed_at timestamp,
  token text unique,
  compliance_score integer,
  critical_errors integer,
  high_errors integer,
  medium_errors integer,
  low_errors integer,
  risk_score integer,
  estimated_fine_exposure integer
  )

-- Scan reports
reports (
id uuid primary key,
company_id uuid references companies(id),
created_at timestamp,
compliance_score integer,
total_errors integer,
critical_errors integer,
high_errors integer,
medium_errors integer,
low_errors integer,
full_report_json jsonb,
teaser_report_json jsonb
)

-- Customer subscriptions
subscriptions (
id uuid primary key,
company_id uuid references companies(id),
user_id uuid references users(id),
stripe_subscription_id text,
status text, -- 'active', 'cancelled', 'past_due'
started_at timestamp,
cancelled_at timestamp,
next_report_date timestamp,
plan_type text default 'monthly'
)

-- Admin users (separate from customers)
admin_users (
id uuid primary key,
email text unique,
role text, -- 'admin', 'worker'
created_at timestamp
)

-- Scan jobs queue
scan_jobs (
id uuid primary key,
company_id uuid references companies(id),
status text, -- 'queued', 'processing', 'completed', 'failed'
progress integer default 0,
started_at timestamp,
completed_at timestamp,
error_message text
)
Phase 1: Core Infrastructure (Week 1)
Task 1.1: Project Setup

- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Configure Tailwind CSS and shadcn/ui
- [ ] Set up Railway PostgreSQL database and configure environment variables
- [ ] Create Railway project for background workers
- [ ] Set up Vercel deployment pipeline
- [ ] Configure ESLint, Prettier, and Husky for code quality
- [ ] Set up Sentry for error monitoring
      Task 1.2: Database Setup
- [ ] Create PostgreSQL tables in Railway using the schema above
- [ ] Set up database roles and permissions
- [ ] Create database migrations using Drizzle ORM or Prisma
- [ ] Set up NextAuth.js with email/password provider
- [ ] Create separate auth flow for admin users vs customers
- [ ] Set up Railway database backup strategy
      Task 1.3: Authentication System
- [ ] Implement admin login page at /admin/login
- [ ] Create customer login/signup flow
- [ ] Set up protected routes with middleware
- [ ] Implement password reset functionality
- [ ] Add session management with NextAuth.js
- [ ] Create auth context/provider for React with NextAuth session
      Phase 2: Accessibility Scanner Engine (Week 1-2)
      Task 2.1: Scanner Core
- [ ] Set up Playwright for website crawling
- [ ] Integrate axe-core for accessibility testing
- [ ] Create scanner that:
  - Crawls up to 50 pages per site
  - Runs WCAG 2.1 Level AA tests
  - Takes screenshots of issues
  - Generates issue severity scores
- [ ] Implement error handling for various site structures
- [ ] Add support for JavaScript-heavy sites (SPAs)
      Task 2.2: Report Generation
- [ ] Create report data structure matching business requirements
- [ ] Generate teaser report with top 5 issues
- [ ] Generate full report with all issues and solutions
- [ ] Add screenshot capture for each issue
- [ ] Calculate compliance score algorithm
- [ ] Add industry benchmarking comparison
- [ ] Create code snippet extraction for issues
      Task 2.3: Background Job System
- [ ] Set up BullMQ with Redis on Railway
- [ ] Create worker process for scan jobs
- [ ] Implement job progress tracking
- [ ] Add retry logic for failed scans
- [ ] Set up webhook for job completion
- [ ] Create job scheduling for weekly customer scans
      Phase 3: Admin Panel (Week 2)
      Task 3.1: Admin Dashboard
- [ ] Create admin layout with navigation
- [ ] Build company grid view with:
  - Company cards showing scan status
  - Real-time progress indicators
  - Industry/risk score display
  - "Emailed?" checkbox
  - Token/signup URL display
- [ ] Add filtering by status (scanning/pending/customer/failure)
- [ ] Implement search functionality
- [ ] Add sorting by various metrics
      Task 3.2: Scan Initiation Flow
- [ ] Create "New Scan" form with URL input
- [ ] Validate URL and check for duplicates
- [ ] Trigger background scan job
- [ ] Show real-time progress (0-100%)
- [ ] Auto-generate unique token on scan start
- [ ] Create personalized signup page URL
      Task 3.3: Customer Management
- [ ] Display all customers with subscription status
- [ ] Show next report date for each customer
- [ ] View historical reports for each customer
- [ ] Add ability to cancel/modify subscriptions
- [ ] Export customer data to CSV
- [ ] Add notes/comments system for customers
      Phase 4: Customer-Facing Signup Flow (Week 2-3)
      Task 4.1: Dynamic Signup Page
- [ ] Create route: /report/[token]
- [ ] Fetch company data based on token
- [ ] Display animated compliance score meter
- [ ] Show teaser report (top 5 issues)
- [ ] Implement blur effect for locked content
- [ ] Add industry comparison chart
- [ ] Display legal warnings and statistics
      Task 4.2: Payment Integration
- [ ] Set up Stripe account and API keys
- [ ] Create Stripe checkout session
- [ ] Implement subscription creation
- [ ] Handle both card and invoice payment methods
- [ ] Set up webhook for payment confirmation
- [ ] Create success/failure pages
- [ ] Add Swedish-specific payment methods
      Task 4.3: Account Creation
- [ ] Auto-create customer account on payment
- [ ] Send welcome email with credentials
- [ ] Grant access to full report
- [ ] Set up weekly scan schedule
- [ ] Generate first compliance certificate
      Phase 5: Customer Portal (Week 3)
      Task 5.1: Customer Dashboard
- [ ] Create customer layout with navigation
- [ ] Display compliance score trend chart
- [ ] Show days until EAA deadline countdown
- [ ] List all reports (newest first)
- [ ] Create notification system for new reports
      Task 5.2: Report Viewer
- [ ] Display full report with all sections
- [ ] Add code syntax highlighting
- [ ] Implement issue filtering/search
- [ ] Create print-friendly version
- [ ] Add export to PDF functionality
- [ ] Generate downloadable compliance certificate
      Task 5.3: Account Management
- [ ] Profile settings page
- [ ] Subscription management (cancel)
- [ ] Billing history and invoices
- [ ] Download all data (GDPR compliance)
- [ ] Email notification preferences
      Phase 6: Email System (Week 3-4)
      Task 6.1: Email Templates
- [ ] Create initial outreach email template
- [ ] Design report notification emails
- [ ] Build subscription confirmation email
- [ ] Create cancellation confirmation
- [ ] Add weekly report delivery email
      Task 6.2: Email Automation
- [ ] Set up email service (Resend/SendGrid)
- [ ] Create email sending queue
- [ ] Implement email tracking (opens/clicks)
- [ ] Add unsubscribe functionality
- [ ] Set up email scheduling system
- [ ] Create admin email preview tool
      Phase 7: Automated Monitoring (Week 4)
      Task 7.1: Weekly Scanning
- [ ] Create cron job for weekly scans
- [ ] Queue scans for all active customers
- [ ] Compare results with previous scan
- [ ] Calculate improvement/regression
- [ ] Generate weekly report
- [ ] Send email notifications
      Task 7.2: Alerting System
- [ ] Alert when compliance score drops for the individual customer
- [ ] Notify about new critical issues
- [ ] Send deadline reminders
- [ ] Alert admin about failed scans
- [ ] Customer churn warnings
      Phase 8: Analytics & Optimization (Week 4-5)
      Task 8.1: Analytics Implementation
- [ ] Set up PostHog
- [ ] Track conversion funnel:
  - Email open → Click → Signup page view → Payment
- [ ] Monitor scan performance metrics
- [ ] Track feature usage in customer portal
- [ ] Implement A/B testing framework
      Task 8.2: Performance Optimization
- [ ] Optimize scan speed (parallel processing)
- [ ] Implement caching for reports
- [ ] Add CDN for static assets
- [ ] Optimize database queries
- [ ] Implement rate limiting
- [ ] Add request queuing for heavy loads
      Phase 9: Advanced Features (Week 5-6)
      Task 9.1: AI Enhancements
- [ ] Integrate GPT-4o-mini for better alt text generation
- [ ] Add AI-powered issue explanations
- [ ] Create automated fix suggestions
- [ ] Implement smart prioritization
- [ ] Add natural language search in reports
      Phase 10: Launch Preparation (Week 6)
      Task 10.1: Testing
- [ ] Complete unit test coverage (>80%)
- [ ] Integration testing for critical flows
- [ ] Load testing with Railway/Vercel
- [ ] Security audit and penetration testing
- [ ] GDPR compliance review
- [ ] Accessibility testing (practice what we preach)
      Task 10.2: Documentation
- [ ] API documentation
- [ ] Developer documentation
- [ ] Terms of service and privacy policy
      Task 10.3: Launch Checklist
- [ ] Domain setup and SSL certificates
- [ ] Backup and disaster recovery plan
- [ ] Customer support system (Intercom/Crisp)
- [ ] Status page for monitoring
- [ ] Google Analytics and Search Console
      Environment Variables

# Railway PostgreSQL

DATABASE_URL=

# NextAuth

NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Stripe

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email

RESEND_API_KEY=

# Redis (Railway)

REDIS_URL=

# Analytics

MIXPANEL_TOKEN=

# Sentry

SENTRY_DSN=

# App

NEXT_PUBLIC_APP_URL=
ADMIN_SECRET_KEY=
Development Workflow

1. Local Development: Use Docker PostgreSQL or Railway dev environment
2. Testing: Jest + React Testing Library + Playwright
3. CI/CD: GitHub Actions → Vercel (preview/production)
4. Background Jobs: Develop locally, deploy to Railway
5. Database Migrations: Drizzle/Prisma migrations in db/migrations
6. Feature Branches: feature/_, fix/_, chore/\*
7. Code Review: Required before merge to main
   Success Metrics

- [ ] Can scan and analyze a website in <2 minutes
- [ ] Generate report with 50+ pages in <5 minutes
- [ ] Handle 100 concurrent scans
- [ ] 99.9% uptime for customer portal
- [ ] <3 second page load times
- [ ] Mobile responsive on all pages
- [ ] WCAG AA compliant (ourselves)
- [ ] Support 10,000+ customers without performance degradation
