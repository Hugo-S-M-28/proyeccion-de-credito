import { Injectable } from '@angular/core';
import { 
  LoanParams, 
  AmortizationResult, 
  calculateAmortization, 
  exportToExcel 
} from '../utils/loanUtils';
import { generateLoanPDF } from '../utils/pdfUtils';
import { saveCalculation, getHistory, clearHistory, CalculationHistoryItem } from '../utils/storageUtils';

export { LoanParams, AmortizationResult, CalculationHistoryItem };

@Injectable({
  providedIn: 'root',
})
export class LoanService {

  /**
   * Calcula la tabla de amortización completa usando utilidades centrales.
   */
  calculateAmortization(params: LoanParams): AmortizationResult {
    const result = calculateAmortization(params);
    
    // Guardar en el historial automáticamente
    saveCalculation(params, result.summary);
    
    return result;
  }

  /**
   * Exporta a Excel.
   */
  async exportToExcel(result: AmortizationResult): Promise<void> {
    return exportToExcel(result);
  }

  /**
   * Exporta a PDF.
   */
  exportToPDF(result: AmortizationResult, params: LoanParams): void {
    return generateLoanPDF(result, params);
  }

  /**
   * Obtiene el historial de cálculos.
   */
  getCalculationHistory(): CalculationHistoryItem[] {
    return getHistory();
  }

  /**
   * Limpia el historial.
   */
  clearHistory(): void {
    return clearHistory();
  }
}
