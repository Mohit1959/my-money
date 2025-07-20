# Personal Finance Manager

A zero-cost, mobile-friendly personal finance management application built with Next.js that uses Google Sheets as the primary database. This solution provides comprehensive financial management capabilities while maintaining complete privacy and zero operational costs.

## Features

- **📊 Dashboard**: Overview of financial health with key metrics
- **📚 Ledger Management**: Double-entry bookkeeping system
- **💰 Cashbook**: Bank and cash transaction management
- **📈 Investment Tracker**: Portfolio management with performance metrics
- **💎 Net Worth Calculator**: Real-time asset and liability tracking
- **📋 Balance Sheet Generator**: Professional financial statements
- **📅 Financial Year Management**: Automatic year-wise data segregation (April-March)
- **📱 Mobile-First Design**: Responsive interface optimized for all devices
- **🔐 Simple Authentication**: Password-protected access

## Technology Stack (100% Free)

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Hosting**: Vercel Free Tier (100GB bandwidth, 6000 build minutes/month)
- **Database**: Google Sheets with Google Sheets API v4
- **Authentication**: Simple password middleware using environment variables
- **Version Control**: GitHub (free)
- **Domain**: Vercel subdomain (yourapp.vercel.app)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Console account
- Google Sheets document
- GitHub account (for deployment)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd personal-finance
npm install
```

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create Service Account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create
   - Click on the created service account
   - Go to "Keys" tab > "Add Key" > "Create New Key" > "JSON"
   - Download the JSON file

### 3. Google Sheets Setup

1. Create a new Google Sheets document
2. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit#gid=0
   ```
3. Share the sheet with your service account email (found in the JSON file)
4. Give "Editor" permissions

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_SHEET_ID="your_google_sheet_id_here"

# Authentication
AUTH_PASSWORD="your_secure_password_here"
NEXTAUTH_SECRET="your_random_secret_key_here"
```

**Important**:

- Copy the entire private key from the JSON file, including the header and footer
- Make sure to replace `\n` with actual line breaks in the private key
- Use a strong password for AUTH_PASSWORD
- Generate a random string for NEXTAUTH_SECRET

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login with your password.

## Development Setup

### Code Quality Tools

This project uses ESLint and Prettier for code quality and formatting:

```bash
# Lint the code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check
```

### VS Code Integration

For the best development experience, install these VS Code extensions:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

The project includes VS Code settings that will:

- Format code on save using Prettier
- Show ESLint errors and warnings
- Auto-fix ESLint issues on save

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Line length**: 80 characters
- **Trailing commas**: ES5 style

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Connect your GitHub account
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - Go to Settings > Environment Variables
   - Add all the variables from your `.env.local` file

5. Deploy!

Your app will be available at `https://your-app-name.vercel.app`

## Project Structure

```
personal-finance/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── ledger/           # Ledger management
│   │   ├── investments/      # Investment tracking
│   │   └── login/            # Authentication
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── forms/           # Form components
│   │   ├── tables/          # Table components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utility libraries
│   │   ├── google-sheets.ts # Google Sheets integration
│   │   ├── auth.ts          # Authentication
│   │   └── utils.ts         # General utilities
│   ├── types/               # TypeScript definitions
│   └── hooks/               # Custom React hooks
├── middleware.ts            # Authentication middleware
└── tailwind.config.js      # Tailwind CSS configuration
```

## Financial Features

### Double-Entry Bookkeeping

- Every transaction requires balanced debits and credits
- Automatic validation ensures accounting accuracy
- Support for multiple account types (Assets, Liabilities, Income, Expenses, Equity)

### Investment Tracking

- Portfolio performance monitoring
- Gain/loss calculations
- Asset allocation analysis
- Support for stocks, mutual funds, bonds, crypto, and other investments

### Financial Year Management

- Automatic financial year detection (April-March)
- Year-wise data segregation
- Easy switching between financial years

### Reports & Analytics

- Net worth tracking over time
- Balance sheet generation
- Income vs expense analysis
- Investment performance metrics

## Data Storage

All your financial data is stored in your personal Google Sheets, ensuring:

- **Complete Privacy**: Only you have access to your data
- **No Vendor Lock-in**: Your data remains in a standard format
- **Backup & Export**: Easy to backup and export your data
- **Collaboration**: Share with family members or accountants if needed

## Security

- Password-protected application access
- HTTPS encryption (automatic with Vercel)
- No third-party data storage
- Google account security controls data access
- Environment variables for sensitive configuration

## Customization

### Adding New Account Types

Edit `src/types/financial.ts` to add new account types or categories.

### Modifying Financial Year

Update `src/lib/date-utils.ts` to change the financial year calculation if needed.

### Styling

The app uses Tailwind CSS. Customize colors and styling in `tailwind.config.js`.

## Troubleshooting

### Common Issues

1. **"Unauthorized" errors**
   - Check if Google Sheets is shared with service account email
   - Verify environment variables are set correctly

2. **Authentication not working**
   - Ensure AUTH_PASSWORD is set in environment variables
   - Check if NEXTAUTH_SECRET is configured

3. **Google Sheets API errors**
   - Verify Google Sheets API is enabled in Google Cloud Console
   - Check service account has correct permissions

### Getting Help

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Google Sheets is accessible with the service account
4. Review Google Cloud Console for API quotas and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] Expense category management
- [ ] Recurring transaction templates
- [ ] Data import/export features
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Multi-currency support
- [ ] Goal tracking and budgeting

---

**Note**: This application is designed for personal use. While it follows accounting principles, please consult with a professional accountant for business or complex financial scenarios.
