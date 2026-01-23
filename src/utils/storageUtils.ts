
export interface CalculationHistoryItem {
    id: string;
    date: string; // Fecha de creación del registro
    formData: {
        principal: number;
        annualRate: number;
        months: number;
        ivaRate: number;
        openingFee: number;
        approvalFee: number;
        extraPayment: number;
        startDate: string;
    };
    summary: {
        totalPayment: number;
        totalInterest: number;
        finalDate: string | null;
    };
}

const STORAGE_KEY = 'loan_calculator_history';
const MAX_HISTORY_ITEMS = 10;

export const saveCalculation = (
    formData: CalculationHistoryItem['formData'],
    summary: CalculationHistoryItem['summary']
): void => {
    const newItem: CalculationHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('es-MX', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }),
        formData,
        summary
    };

    const currentHistory = getHistory();
    // Agregar al inicio
    const newHistory = [newItem, ...currentHistory];

    // Limitar tamaño
    if (newHistory.length > MAX_HISTORY_ITEMS) {
        newHistory.length = MAX_HISTORY_ITEMS;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
};

export const getHistory = (): CalculationHistoryItem[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error al leer el historial:', error);
        return [];
    }
};

export const clearHistory = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
