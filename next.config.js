/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_SHEETS_PRIVATE_KEY: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    GOOGLE_SHEETS_CLIENT_EMAIL: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

module.exports = nextConfig;
