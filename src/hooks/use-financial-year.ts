import { useState, useEffect } from 'react';
import {
  getCurrentFinancialYear,
  getAvailableFinancialYears,
} from '@/lib/date-utils';

// Global state for financial year
let globalSelectedFinancialYear = getCurrentFinancialYear();
let globalListeners: (() => void)[] = [];

const notifyListeners = () => {
  globalListeners.forEach(listener => listener());
};

export function useFinancialYear() {
  const [currentFinancialYear, setCurrentFinancialYear] = useState<string>(
    getCurrentFinancialYear()
  );
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>(
    globalSelectedFinancialYear
  );
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  useEffect(() => {
    const years = getAvailableFinancialYears();
    setAvailableYears(years);
  }, []);

  useEffect(() => {
    const listener = () => {
      setSelectedFinancialYear(globalSelectedFinancialYear);
    };

    globalListeners.push(listener);

    return () => {
      globalListeners = globalListeners.filter(l => l !== listener);
    };
  }, []);

  const switchFinancialYear = (year: string) => {
    globalSelectedFinancialYear = year;
    setSelectedFinancialYear(year);
    notifyListeners();
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
