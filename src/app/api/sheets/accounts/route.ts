import { NextRequest, NextResponse } from 'next/server';
import { googleSheetsService } from '@/lib/google-sheets';
import { getSession } from '@/lib/auth';

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

    const accounts = await googleSheetsService.getAccounts(
      financialYear || undefined
    );

    return NextResponse.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts' },
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

    const accountData = await request.json();

    // Validate required fields
    if (!accountData.name || !accountData.type || !accountData.subType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, type, subType',
        },
        { status: 400 }
      );
    }

    const account = await googleSheetsService.createAccount(accountData);

    return NextResponse.json({
      success: true,
      data: account,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
