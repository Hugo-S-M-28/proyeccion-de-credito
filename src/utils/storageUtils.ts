import type { LoanParams, AmortizationSummary } from './loanUtils';

export interface CalculationHistoryItem {
    id: string;
    date: string; 
    formData: LoanParams;
    summary: {
        totalPayment: number;
        totalInterest: number;
        finalDate: string | null;
    };
}

const STORAGE_KEY = 'loan_calculator_history';
const MAX_HISTORY_ITEMS = 10;

export const saveCalculation = (
    formData: LoanParams,
    summary: AmortizationSummary
): void => {
    const newItem: CalculationHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('es-MX', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }),
        formData,
        summary: {
            totalPayment: summary.totalPayment,
            totalInterest: summary.totalInterest,
            finalDate: summary.finalDate
        }
    };

    const currentHistory = getHistory();
    const newHistory = [newItem, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

export const getHistory = (): CalculationHistoryItem[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error al leer el historial:', error);
        return [];
    }
};

export const clearHistory = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
