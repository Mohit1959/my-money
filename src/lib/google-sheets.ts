import { google, sheets_v4 } from 'googleapis';
import {
  Account,
  Transaction,
  CashbookEntry,
  Investment,
  InvestmentTransaction,
  Category,
  FinancialSummary,
} from '@/types/financial';
import { ApiResponse, SheetConfig, BatchUpdateRequest } from '@/types/api';
import { getCurrentFinancialYear } from './date-utils';

export class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;

  private sheetConfig: SheetConfig = {
    transactionsSheet: 'Transactions',
    accountsSheet: 'Accounts',
    cashbookSheet: 'Cashbook',
    investmentsSheet: 'Investments',
    categoriesSheet: 'Categories',
    dashboardSheet: 'Dashboard',
    configSheet: 'Config',
  };

  constructor() {
    const credentials = {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    this.spreadsheetId = process.env.GOOGLE_SHEET_ID!;

    const auth = new google.auth.JWT(
      credentials.client_email,
      undefined,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  // Initialize sheets with headers if they don't exist
  async initializeSheets(): Promise<void> {
    try {
      const sheetsToCreate = [
        {
          name: this.sheetConfig.accountsSheet,
          headers: [
            'ID',
            'Name',
            'Type',
            'SubType',
            'Balance',
            'IsActive',
            'CreatedAt',
            'FinancialYear',
          ],
        },
        {
          name: this.sheetConfig.transactionsSheet,
          headers: [
            'ID',
            'Date',
            'Description',
            'Reference',
            'TotalAmount',
            'IsBalanced',
            'Category',
            'FinancialYear',
            'CreatedAt',
            'UpdatedAt',
            'Entries',
          ],
        },
        {
          name: this.sheetConfig.cashbookSheet,
          headers: [
            'ID',
            'Date',
            'Description',
            'BankAccount',
            'Type',
            'Amount',
            'Balance',
            'Category',
            'Reference',
            'Reconciled',
            'FinancialYear',
            'CreatedAt',
          ],
        },
        {
          name: this.sheetConfig.investmentsSheet,
          headers: [
            'ID',
            'Symbol',
            'Name',
            'Type',
            'Quantity',
            'AveragePrice',
            'CurrentPrice',
            'TotalInvestment',
            'CurrentValue',
            'GainLoss',
            'GainLossPercentage',
            'LastUpdated',
            'FinancialYear',
          ],
        },
        {
          name: this.sheetConfig.categoriesSheet,
          headers: ['ID', 'Name', 'Type', 'IsActive', 'CreatedAt'],
        },
        {
          name: this.sheetConfig.dashboardSheet,
          headers: ['Metric', 'Value', 'LastUpdated'],
        },
        {
          name: this.sheetConfig.configSheet,
          headers: ['Key', 'Value', 'Description'],
        },
      ];

      for (const sheet of sheetsToCreate) {
        await this.createSheetIfNotExists(sheet.name, sheet.headers);
      }
    } catch (error) {
      console.error('Error initializing sheets:', error);
      throw error;
    }
  }

  private async createSheetIfNotExists(
    sheetName: string,
    headers: string[]
  ): Promise<void> {
    try {
      // Check if sheet exists
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const sheetExists = response.data.sheets?.some(
        sheet => sheet.properties?.title === sheetName
      );

      if (!sheetExists) {
        // Create the sheet
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });

        // Add headers
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [headers],
          },
        });
      }
    } catch (error) {
      console.error(`Error creating sheet ${sheetName}:`, error);
      throw error;
    }
  }

  // Accounts methods
  async getAccounts(financialYear?: string): Promise<Account[]> {
    try {
      const range = `${this.sheetConfig.accountsSheet}!A2:H`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      const accounts = rows
        .map(row => this.parseAccountRow(row))
        .filter(Boolean) as Account[];

      if (financialYear) {
        return accounts.filter(
          account => account.financialYear === financialYear
        );
      }

      return accounts;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }

  async createAccount(
    account: Omit<Account, 'id' | 'createdAt' | 'financialYear'>
  ): Promise<Account> {
    try {
      const id = this.generateId();
      const now = new Date().toISOString();
      const financialYear = getCurrentFinancialYear();

      const newAccount: Account = {
        ...account,
        id,
        createdAt: now,
        financialYear,
      };

      const values = this.formatAccountRow(newAccount);
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetConfig.accountsSheet}!A:H`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return newAccount;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async updateAccount(
    id: string,
    updates: Partial<Account>
  ): Promise<Account | null> {
    try {
      const accounts = await this.getAccounts();
      const accountIndex = accounts.findIndex(account => account.id === id);

      if (accountIndex === -1) {
        return null;
      }

      const updatedAccount = { ...accounts[accountIndex], ...updates };
      const values = this.formatAccountRow(updatedAccount);

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetConfig.accountsSheet}!A${accountIndex + 2}:H${
          accountIndex + 2
        }`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return updatedAccount;
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  // Transactions methods
  async getTransactions(financialYear?: string): Promise<Transaction[]> {
    try {
      const range = `${this.sheetConfig.transactionsSheet}!A2:K`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      const transactions = rows
        .map(row => this.parseTransactionRow(row))
        .filter(Boolean) as Transaction[];

      if (financialYear) {
        return transactions.filter(
          transaction => transaction.financialYear === financialYear
        );
      }

      return transactions;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  async createTransaction(
    transaction: Omit<
      Transaction,
      'id' | 'createdAt' | 'updatedAt' | 'financialYear'
    >
  ): Promise<Transaction> {
    try {
      const id = this.generateId();
      const now = new Date().toISOString();
      const financialYear = getCurrentFinancialYear();

      const newTransaction: Transaction = {
        ...transaction,
        id,
        createdAt: now,
        updatedAt: now,
        financialYear,
      };

      const values = this.formatTransactionRow(newTransaction);
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetConfig.transactionsSheet}!A:K`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return newTransaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Cashbook methods
  async getCashbookEntries(financialYear?: string): Promise<CashbookEntry[]> {
    try {
      const range = `${this.sheetConfig.cashbookSheet}!A2:L`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      const entries = rows
        .map(row => this.parseCashbookRow(row))
        .filter(Boolean) as CashbookEntry[];

      if (financialYear) {
        return entries.filter(entry => entry.financialYear === financialYear);
      }

      return entries;
    } catch (error) {
      console.error('Error getting cashbook entries:', error);
      throw error;
    }
  }

  // Investment methods
  async getInvestments(financialYear?: string): Promise<Investment[]> {
    try {
      const range = `${this.sheetConfig.investmentsSheet}!A2:M`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      const investments = rows
        .map(row => this.parseInvestmentRow(row))
        .filter(Boolean) as Investment[];

      if (financialYear) {
        return investments.filter(
          investment => investment.financialYear === financialYear
        );
      }

      return investments;
    } catch (error) {
      console.error('Error getting investments:', error);
      throw error;
    }
  }

  async createInvestment(
    investment: Omit<Investment, 'id' | 'lastUpdated' | 'financialYear'>
  ): Promise<Investment> {
    try {
      const id = this.generateId();
      const now = new Date().toISOString();
      const financialYear = getCurrentFinancialYear();

      const newInvestment: Investment = {
        ...investment,
        id,
        lastUpdated: now,
        financialYear,
      };

      const values = this.formatInvestmentRow(newInvestment);
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetConfig.investmentsSheet}!A:M`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [values],
        },
      });

      return newInvestment;
    } catch (error) {
      console.error('Error creating investment:', error);
      throw error;
    }
  }

  // Categories methods
  async getCategories(): Promise<Category[]> {
    try {
      const range = `${this.sheetConfig.categoriesSheet}!A2:E`;
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      return rows
        .map(row => this.parseCategoryRow(row))
        .filter(Boolean) as Category[];
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  // Dashboard methods
  async updateDashboardSummary(summary: FinancialSummary): Promise<void> {
    try {
      const metrics = [
        ['Total Assets', summary.totalAssets, summary.lastUpdated],
        ['Total Liabilities', summary.totalLiabilities, summary.lastUpdated],
        ['Net Worth', summary.netWorth, summary.lastUpdated],
        ['Monthly Income', summary.monthlyIncome, summary.lastUpdated],
        ['Monthly Expenses', summary.monthlyExpenses, summary.lastUpdated],
        ['Investment Value', summary.investmentValue, summary.lastUpdated],
        ['Cash Balance', summary.cashBalance, summary.lastUpdated],
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetConfig.dashboardSheet}!A2:C8`,
        valueInputOption: 'RAW',
        requestBody: {
          values: metrics,
        },
      });
    } catch (error) {
      console.error('Error updating dashboard summary:', error);
      throw error;
    }
  }

  // Helper methods for parsing rows
  private parseAccountRow(row: any[]): Account | null {
    if (!row || row.length < 8) return null;

    return {
      id: row[0],
      name: row[1],
      type: row[2] as Account['type'],
      subType: row[3],
      balance: parseFloat(row[4]) || 0,
      isActive: row[5] === 'TRUE',
      createdAt: row[6],
      financialYear: row[7],
    };
  }

  private parseTransactionRow(row: any[]): Transaction | null {
    if (!row || row.length < 11) return null;

    return {
      id: row[0],
      date: row[1],
      description: row[2],
      reference: row[3],
      totalAmount: parseFloat(row[4]) || 0,
      isBalanced: row[5] === 'TRUE',
      category: row[6],
      financialYear: row[7],
      createdAt: row[8],
      updatedAt: row[9],
      entries: JSON.parse(row[10] || '[]'),
    };
  }

  private parseCashbookRow(row: any[]): CashbookEntry | null {
    if (!row || row.length < 12) return null;

    return {
      id: row[0],
      date: row[1],
      description: row[2],
      bankAccount: row[3],
      type: row[4] as CashbookEntry['type'],
      amount: parseFloat(row[5]) || 0,
      balance: parseFloat(row[6]) || 0,
      category: row[7],
      reference: row[8],
      reconciled: row[9] === 'TRUE',
      financialYear: row[10],
      createdAt: row[11],
    };
  }

  private parseInvestmentRow(row: any[]): Investment | null {
    if (!row || row.length < 13) return null;

    return {
      id: row[0],
      symbol: row[1],
      name: row[2],
      type: row[3] as Investment['type'],
      quantity: parseFloat(row[4]) || 0,
      averagePrice: parseFloat(row[5]) || 0,
      currentPrice: parseFloat(row[6]) || 0,
      totalInvestment: parseFloat(row[7]) || 0,
      currentValue: parseFloat(row[8]) || 0,
      gainLoss: parseFloat(row[9]) || 0,
      gainLossPercentage: parseFloat(row[10]) || 0,
      lastUpdated: row[11],
      financialYear: row[12],
    };
  }

  private parseCategoryRow(row: any[]): Category | null {
    if (!row || row.length < 5) return null;

    return {
      id: row[0],
      name: row[1],
      type: row[2] as Category['type'],
      isActive: row[3] === 'TRUE',
      createdAt: row[4],
    };
  }

  // Helper methods for formatting rows
  private formatAccountRow(account: Account): any[] {
    return [
      account.id,
      account.name,
      account.type,
      account.subType,
      account.balance,
      account.isActive ? 'TRUE' : 'FALSE',
      account.createdAt,
      account.financialYear,
    ];
  }

  private formatTransactionRow(transaction: Transaction): any[] {
    return [
      transaction.id,
      transaction.date,
      transaction.description,
      transaction.reference || '',
      transaction.totalAmount,
      transaction.isBalanced ? 'TRUE' : 'FALSE',
      transaction.category || '',
      transaction.financialYear,
      transaction.createdAt,
      transaction.updatedAt,
      JSON.stringify(transaction.entries),
    ];
  }

  private formatInvestmentRow(investment: Investment): any[] {
    return [
      investment.id,
      investment.symbol,
      investment.name,
      investment.type,
      investment.quantity,
      investment.averagePrice,
      investment.currentPrice,
      investment.totalInvestment,
      investment.currentValue,
      investment.gainLoss,
      investment.gainLossPercentage,
      investment.lastUpdated,
      investment.financialYear,
    ];
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
