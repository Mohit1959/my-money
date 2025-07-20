# Personal Finance Website - Complete Project Documentation

## Project Overview

A zero-cost, mobile-friendly personal finance management website built with Next.js that uses Google Sheets as the primary database. This solution provides comprehensive financial management capabilities while maintaining complete privacy and zero operational costs.

### Core Features

- **Ledger Management**: Double-entry bookkeeping with chart of accounts
- **Cashbook Management**: Bank and cash transaction tracking
- **Investment Portfolio**: Investment tracking with performance monitoring
- **Net Worth Calculator**: Real-time asset and liability tracking
- **Balance Sheet Generator**: Automated financial statements
- **Financial Year Management**: Automatic year-wise data segregation
- **Mobile-First Design**: Responsive interface optimized for all devices
- **Simple Authentication**: Password-protected access without complex user management

## Technology Stack (100% Free)

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Hosting**: Vercel Free Tier (100GB bandwidth, 6000 build minutes/month)
- **Database**: Google Sheets with Google Sheets API v4
- **Authentication**: Simple password middleware using environment variables
- **Version Control**: GitHub (free)
- **Domain**: Vercel subdomain (yourapp.vercel.app)

## Architecture Design

### Data Flow

```
User Interface (Next.js) → Authentication Middleware → Google Sheets API → Google Sheets (Database)
```

### Google Sheets Structure

1. **Transactions** - Main ledger entries
2. **Accounts** - Chart of accounts (Assets, Liabilities, Income, Expenses)
3. **Cashbook** - Bank and cash transactions
4. **Investments** - Investment portfolio tracking
5. **Categories** - Transaction categories
6. **Dashboard** - Calculated summaries and metrics
7. **Config** - Application configuration and settings

## Implementation Plan

### Phase 1: Foundation (Week 1-2)

- Next.js project setup with TypeScript
- Google Sheets API integration
- Basic authentication middleware
- Mobile-responsive layout

### Phase 2: Core Features (Week 3-6)

- Transaction entry and ledger management
- Cashbook functionality
- Account management
- Dashboard with key metrics

### Phase 3: Advanced Features (Week 7-10)

- Investment tracking
- Net worth calculation
- Balance sheet generation
- Financial year segregation

### Phase 4: Finalization (Week 11-12)

- Testing and bug fixes
- Performance optimization
- Documentation

## Project Structure

```
personal-finance/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── transactions/
│   │   │   ├── accounts/
│   │   │   ├── investments/
│   │   │   └── reports/
│   │   ├── dashboard/
│   │   ├── ledger/
│   │   ├── cashbook/
│   │   ├── investments/
│   │   ├── networth/
│   │   ├── balancesheet/
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── tables/
│   │   └── charts/
│   ├── lib/
│   │   ├── google-sheets.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
├── public/
├── middleware.ts
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Security Implementation

### Authentication Strategy

- Simple password protection using Next.js middleware
- Environment variable for password storage
- Session-based authentication
- HTTPS enforced by Vercel

### Data Security

- All data stored in personal Google Sheets
- Google account security controls access
- No third-party data storage
- Automatic HTTPS encryption

## Deployment Instructions

1. **Google Cloud Setup**
   - Create Google Cloud Console project
   - Enable Google Sheets API
   - Create service account and download JSON key
   - Share Google Sheets with service account email

2. **Vercel Deployment**
   - Connect GitHub repository to Vercel
   - Set environment variables:
     - `GOOGLE_SHEETS_PRIVATE_KEY`
     - `GOOGLE_SHEETS_CLIENT_EMAIL`
     - `GOOGLE_SHEET_ID`
     - `AUTH_PASSWORD`
   - Deploy with automatic SSL

3. **Initial Setup**
   - Create Google Sheets template
   - Test authentication and API connection
   - Begin financial data entry

---

# CURSOR AI PROMPT

## Project Generation Instructions

You are tasked with creating a complete personal finance management website using Next.js. Follow these exact specifications to build a production-ready application.

### Project Requirements

**Create a zero-cost personal finance website with the following specifications:**

1. **Technology Stack:**
   - Next.js 14 with App Router and TypeScript
   - Tailwind CSS for styling (mobile-first approach)
   - Google Sheets API v4 for data storage
   - Simple password authentication using middleware
   - No external databases (Google Sheets is the database)

2. **Core Features to Implement:**
   - **Dashboard**: Overview of financial health with key metrics
   - **Ledger Management**: Double-entry bookkeeping system
   - **Cashbook**: Bank and cash transaction management
   - **Investment Tracker**: Portfolio management with performance metrics
   - **Net Worth Calculator**: Real-time asset and liability tracking
   - **Balance Sheet Generator**: Professional financial statements
   - **Financial Year Management**: Automatic year-wise segregation (April-March)

3. **Authentication Requirements:**
   - Simple password protection using Next.js middleware
   - No complex user management system needed
   - Use environment variables for password storage
   - Session-based authentication with login/logout

4. **Google Sheets Integration:**
   - Use Google Sheets API v4 as the primary database
   - Create separate sheets for: Transactions, Accounts, Cashbook, Investments, Categories, Dashboard, Config
   - Implement real-time data synchronization
   - Handle API rate limiting gracefully
   - Financial year-wise data segregation

5. **Mobile-First Design:**
   - Fully responsive design using Tailwind CSS
   - Touch-friendly interfaces
   - Progressive Web App capabilities
   - Fast loading on mobile networks

### File Structure to Create:

```
src/
├── app/
│   ├── layout.tsx (Root layout with auth check)
│   ├── page.tsx (Dashboard/Home page)
│   ├── login/
│   │   └── page.tsx (Simple login form)
│   ├── dashboard/
│   │   └── page.tsx (Financial overview dashboard)
│   ├── ledger/
│   │   └── page.tsx (Transaction entry and ledger view)
│   ├── cashbook/
│   │   └── page.tsx (Bank and cash management)
│   ├── investments/
│   │   └── page.tsx (Investment portfolio tracking)
│   ├── networth/
│   │   └── page.tsx (Net worth calculation and trends)
│   ├── balancesheet/
│   │   └── page.tsx (Balance sheet generation)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   ├── sheets/
│   │   │   ├── transactions/route.ts
│   │   │   ├── accounts/route.ts
│   │   │   ├── investments/route.ts
│   │   │   └── reports/route.ts
│   │   └── financial-year/route.ts
│   └── globals.css (Tailwind imports)
├── components/
│   ├── ui/ (Reusable UI components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   └── loading.tsx
│   ├── forms/
│   │   ├── transaction-form.tsx
│   │   ├── account-form.tsx
│   │   └── investment-form.tsx
│   ├── tables/
│   │   ├── transaction-table.tsx
│   │   ├── account-table.tsx
│   │   └── investment-table.tsx
│   ├── charts/
│   │   ├── net-worth-chart.tsx
│   │   ├── expense-chart.tsx
│   │   └── investment-chart.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── navigation.tsx
│   └── dashboard/
│       ├── metrics-cards.tsx
│       ├── recent-transactions.tsx
│       └── quick-actions.tsx
├── lib/
│   ├── google-sheets.ts (Google Sheets API integration)
│   ├── auth.ts (Authentication utilities)
│   ├── financial-calculations.ts (Financial formulas)
│   ├── date-utils.ts (Date and financial year utilities)
│   └── utils.ts (General utilities)
├── types/
│   ├── financial.ts (Financial data types)
│   └── api.ts (API response types)
├── middleware.ts (Authentication middleware)
└── hooks/
    ├── use-auth.ts
    ├── use-sheets-data.ts
    └── use-financial-year.ts
```

### Specific Implementation Instructions:

#### 1. Authentication System

```typescript
// middleware.ts - Create authentication middleware
// Check for valid session or redirect to login
// Use simple password comparison with environment variable

// lib/auth.ts - Authentication utilities
// Login/logout functions
// Session management
// Password validation
```

#### 2. Google Sheets Integration

```typescript
// lib/google-sheets.ts - Complete Google Sheets API wrapper
// Initialize Google Sheets client using service account
// CRUD operations for all sheet types
// Batch operations for performance
// Error handling and retry logic
// Financial year detection and sheet creation
```

#### 3. Core Components

- **Transaction Form**: Add/edit financial transactions with double-entry validation
- **Dashboard Metrics**: Cards showing total income, expenses, net worth, investment value
- **Account Management**: Chart of accounts with running balances
- **Investment Tracker**: Buy/sell transactions, current portfolio value, gains/losses
- **Reports Generator**: Balance sheet, P&L statement, cash flow statement

#### 4. Mobile-First Design Patterns

- Use Tailwind's responsive prefixes (sm:, md:, lg:)
- Touch-friendly buttons (min 44px touch targets)
- Collapsible navigation for mobile
- Swipe gestures for table navigation
- Pull-to-refresh functionality

#### 5. Financial Calculations

- Double-entry bookkeeping validation (debits = credits)
- Running balance calculations
- Net worth computation (assets - liabilities)
- Investment performance metrics (returns, gains/losses)
- Financial year-end processing

### Environment Variables Required:

```
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account_email
GOOGLE_SHEET_ID=your_sheet_id
AUTH_PASSWORD=your_chosen_password
NEXTAUTH_SECRET=random_secret_for_session
```

### Key Features Implementation:

#### Dashboard Page

- Financial summary cards (Total Assets, Liabilities, Net Worth, Monthly Income/Expenses)
- Recent transactions table (last 10 transactions)
- Quick action buttons (Add Transaction, Add Investment, View Reports)
- Charts showing spending trends and net worth over time

#### Ledger Management

- Transaction entry form with account selection
- Transaction list with filtering and sorting
- Double-entry validation
- Account balance verification

#### Cashbook Management

- Bank account reconciliation
- Cash flow tracking
- Account balance monitoring
- Transaction categorization

#### Investment Tracking

- Portfolio overview with current values
- Buy/sell transaction entry
- Performance metrics and charts
- Asset allocation visualization

#### Balance Sheet Generator

- Automated balance sheet creation
- Year-end processing
- Financial statement export
- Historical comparisons

### Code Quality Requirements:

- Use TypeScript for type safety
- Implement proper error handling
- Add loading states for all async operations
- Include form validation
- Write clean, maintainable code with proper comments
- Follow Next.js best practices
- Optimize for performance (use React.memo, useMemo where appropriate)

### Testing and Validation:

- Test all CRUD operations with Google Sheets
- Validate financial calculations (especially double-entry bookkeeping)
- Ensure mobile responsiveness across devices
- Test authentication flow
- Verify financial year rollover functionality

### Additional Notes:

- Keep the codebase simple and maintainable
- Focus on core functionality over complex features
- Ensure all operations are atomic and consistent
- Implement proper data validation
- Add appropriate loading and error states
- Make the UI intuitive for financial data entry

**Please generate the complete, production-ready codebase following these exact specifications. Include all files mentioned in the structure above with full implementation.**
