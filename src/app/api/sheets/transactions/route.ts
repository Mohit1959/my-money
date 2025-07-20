import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';
import { getSession } from '@/lib/auth';
import {
  validateTransaction,
  validateDoubleEntry,
} from '@/lib/financial-calculations';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const financialYear = searchParams.get('financialYear');

    const transactions = await googleSheetsService.getTransactions(
      financialYear || undefined
    );

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const transactionData = await request.json();

    // Validate transaction
    const validation = validateTransaction(transactionData);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Validate double-entry
    const doubleEntryValidation = validateDoubleEntry(transactionData.entries);
    if (!doubleEntryValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: `Transaction is not balanced. Difference: ${doubleEntryValidation.difference.toFixed(
            2
          )}`,
        },
        { status: 400 }
      );
    }

    // Add calculated fields
    const transaction = {
      ...transactionData,
      totalAmount: doubleEntryValidation.totalDebits,
      isBalanced: doubleEntryValidation.isValid,
    };

    const createdTransaction =
      await googleSheetsService.createTransaction(transaction);

    return NextResponse.json({
      success: true,
      data: createdTransaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
