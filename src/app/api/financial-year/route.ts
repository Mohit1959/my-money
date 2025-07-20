import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import {
  getCurrentFinancialYear,
  getAvailableFinancialYears,
  getFinancialYearDates,
  isCurrentFinancialYear,
} from '@/lib/date-utils';

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

    const currentYear = getCurrentFinancialYear();
    const availableYears = getAvailableFinancialYears();

    const years = availableYears.map(year => {
      const dates = getFinancialYearDates(year);
      return {
        year,
        startDate: dates.startDate.toISOString(),
        endDate: dates.endDate.toISOString(),
        isCurrent: isCurrentFinancialYear(year),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        currentYear,
        availableYears: years,
      },
    });
  } catch (error) {
    console.error('Error fetching financial years:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial years' },
      { status: 500 }
    );
  }
}
