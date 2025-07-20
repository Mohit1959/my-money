import {
  format,
  parse,
  startOfMonth,
  endOfMonth,
  subMonths,
  addMonths,
} from 'date-fns';

export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  api: 'yyyy-MM-dd',
  month: 'MMM yyyy',
  short: 'dd MMM',
  long: 'dd MMMM yyyy',
};

export function formatDate(
  date: string | Date,
  formatStr = DATE_FORMATS.display
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

export function parseDate(
  dateStr: string,
  formatStr = DATE_FORMATS.display
): Date {
  return parse(dateStr, formatStr, new Date());
}

export function getCurrentFinancialYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11

  // Financial year starts from April (month 4)
  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(2)}`;
  } else {
    return `${year - 1}-${year.toString().slice(2)}`;
  }
}

export function getFinancialYearDates(financialYear: string): {
  startDate: Date;
  endDate: Date;
} {
  const [startYear, endYearShort] = financialYear.split('-');
  const endYear = `20${endYearShort}`;

  const startDate = new Date(parseInt(startYear), 3, 1); // April 1st
  const endDate = new Date(parseInt(endYear), 2, 31); // March 31st

  return { startDate, endDate };
}

export function isDateInFinancialYear(
  date: string | Date,
  financialYear: string
): boolean {
  const { startDate, endDate } = getFinancialYearDates(financialYear);
  const checkDate = typeof date === 'string' ? new Date(date) : date;

  return checkDate >= startDate && checkDate <= endDate;
}

export function getAvailableFinancialYears(): string[] {
  const currentFY = getCurrentFinancialYear();
  const years: string[] = [];

  // Get last 5 years and next 2 years
  for (let i = -5; i <= 2; i++) {
    const [startYear] = currentFY.split('-');
    const year = parseInt(startYear) + i;
    const nextYear = year + 1;
    years.push(`${year}-${nextYear.toString().slice(2)}`);
  }

  return years.sort((a, b) => b.localeCompare(a)); // Latest first
}

export function getMonthName(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMMM yyyy');
}

export function getMonthStartEnd(date: string | Date): {
  start: Date;
  end: Date;
} {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return {
    start: startOfMonth(dateObj),
    end: endOfMonth(dateObj),
  };
}

export function getPreviousMonth(date: string | Date): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return subMonths(dateObj, 1);
}

export function getNextMonth(date: string | Date): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return addMonths(dateObj, 1);
}

export function getMonthsInFinancialYear(financialYear: string): string[] {
  const { startDate } = getFinancialYearDates(financialYear);
  const months: string[] = [];

  for (let i = 0; i < 12; i++) {
    const month = addMonths(startDate, i);
    months.push(format(month, 'yyyy-MM'));
  }

  return months;
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function isCurrentFinancialYear(financialYear: string): boolean {
  return financialYear === getCurrentFinancialYear();
}

export function getQuarter(date: string | Date): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const month = dateObj.getMonth() + 1;

  // Financial year quarters (April start)
  if (month >= 4 && month <= 6) return 1; // Q1: Apr-Jun
  if (month >= 7 && month <= 9) return 2; // Q2: Jul-Sep
  if (month >= 10 && month <= 12) return 3; // Q3: Oct-Dec
  return 4; // Q4: Jan-Mar
}

export function getFinancialYearFromDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;

  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(2)}`;
  } else {
    return `${year - 1}-${year.toString().slice(2)}`;
  }
}

export function getDateRangeForPeriod(
  period: 'week' | 'month' | 'quarter' | 'year'
): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const end = now;
  let start: Date;

  switch (period) {
    case 'week':
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      start = startOfMonth(now);
      break;
    case 'quarter':
      const quarter = getQuarter(now);
      const year = now.getFullYear();
      const quarterStartMonth = (quarter - 1) * 3 + 3; // 3, 6, 9, 0 (for next year)
      if (quarterStartMonth === 0) {
        start = new Date(year, 0, 1); // January 1st
      } else {
        start = new Date(
          year - (quarterStartMonth === 3 ? 1 : 0),
          (quarterStartMonth - 1) % 12,
          1
        );
      }
      break;
    case 'year':
      const { startDate } = getFinancialYearDates(getCurrentFinancialYear());
      start = startDate;
      break;
    default:
      start = startOfMonth(now);
  }

  return { start, end };
}
