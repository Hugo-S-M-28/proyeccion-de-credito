// src/app/loan-calculator/loan-calculator.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoanService } from '../loan.service';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent {
  principal: number = 0;
  annualRate: number = 0;
  months: number = 0;
  ivaRate: number = 0;
  openingFee: number = 0;
  approvalFee: number = 0;

  amortizationTable: Array<{
    month: number;
    balance: string;
    interest: string;
    iva: string;
    amortization: string;
    totalPaymentWithoutFees: string;
    totalPayment: string;
  }> = [];
  
  errorMessage: string | null = null;

  formFields = [
    { id: 'principal', label: 'Monto del Préstamo', type: 'number', model: 'principal', name: 'principal', placeholder: 'Ingrese el monto', required: true },
    { id: 'annualRate', label: 'Tasa de Interés Anual (%)', type: 'number', model: 'annualRate', name: 'annualRate', placeholder: 'Ingrese la tasa de interés', required: true },
    { id: 'months', label: 'Plazo del Préstamo (meses)', type: 'number', model: 'months', name: 'months', placeholder: 'Ingrese el plazo', required: true },
    { id: 'ivaRate', label: 'IVA de Interés (%)', type: 'number', model: 'ivaRate', name: 'ivaRate', placeholder: 'Ingrese el IVA', required: false },
    { id: 'openingFee', label: 'Comisión por Contratación', type: 'number', model: 'openingFee', name: 'openingFee', placeholder: 'Ingrese la comisión por contratación', required: false },
    { id: 'approvalFee', label: 'Comisión por Autorización', type: 'number', model: 'approvalFee', name: 'approvalFee', placeholder: 'Ingrese la comisión por autorización', required: false }
  ];

  constructor(private loanService: LoanService) {}

  /**
   * Valida las entradas del formulario
   * @returns {boolean} true si los datos son válidos; de lo contrario, false.
   */
  private validateInputs(): boolean {
    if (this.principal <= 0) {
      this.errorMessage = 'El monto del préstamo debe ser mayor que 0.';
      return false;
    }
    if (this.annualRate <= 0) {
      this.errorMessage = 'La tasa de interés anual debe ser mayor que 0.';
      return false;
    }
    if (this.months <= 0) {
      this.errorMessage = 'El plazo del préstamo debe ser mayor que 0.';
      return false;
    }
    return true;
  }

  /**
   * Ejecuta el cálculo de la tabla de amortización
   */
  calculate(): void {
    this.errorMessage = null; // Reiniciar mensajes de error
    if (!this.validateInputs()) return;

    try {
      this.amortizationTable = this.loanService.calculateAmortization(
        this.principal,
        this.annualRate,
        this.months,
        this.ivaRate,
        this.openingFee,
        this.approvalFee
      );
    } catch (error) {
      console.error('Error en el cálculo:', error);
      this.errorMessage = 'Error al calcular la tabla de amortización. Verifica los valores ingresados.';
    }
  }

  /**
   * Exporta la tabla de amortización a un archivo Excel
   */
  exportToExcel(): void {
    try {
      this.loanService.exportToExcel(this.amortizationTable);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.errorMessage = 'Error al exportar la tabla a Excel.';
    }
  }
}
