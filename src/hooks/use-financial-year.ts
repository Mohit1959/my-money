import { useState, useEffect } from 'react';
import {
  getCurrentFinancialYear,
  getAvailableFinancialYears,
} from '@/lib/date-utils';

export function useFinancialYear() {
  const [currentFinancialYear, setCurrentFinancialYear] = useState<string>(
    getCurrentFinancialYear()
  );
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>(
    getCurrentFinancialYear()
  );
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    const years = getAvailableFinancialYears();
    setAvailableYears(years);
  }, []);

  const switchFinancialYear = (year: string) => {
    setSelectedFinancialYear(year);
  };

  const isCurrentYear = selectedFinancialYear === currentFinancialYear;

  return {
    currentFinancialYear,
    selectedFinancialYear,
    availableYears,
    switchFinancialYear,
    isCurrentYear,
  };
}
