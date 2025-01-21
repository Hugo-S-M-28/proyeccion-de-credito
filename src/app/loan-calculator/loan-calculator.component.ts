// src/app/loan-calculator/loan-calculator.component.ts
import { Component } from '@angular/core';
import { LoanService } from '../loan.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
    selector: 'app-loan-calculator',
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

  amortizationTable: any[] = [];
  errorMessage: string | null = null;

  constructor(private loanService: LoanService) {}

  calculate() {
    this.errorMessage = ''; // Reset error message

    // Validar entradas
    if (this.principal <= 0) {
      this.errorMessage = 'El monto del préstamo debe ser mayor que 0.';
      return;
    }
    if (this.annualRate <= 0) {
      this.errorMessage = 'La tasa de interés anual debe ser mayor que 0.';
      return;
    }
    if (this.months <= 0) {
      this.errorMessage = 'El plazo del préstamo debe ser mayor que 0.';
      return;
    }

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
      this.errorMessage = 'Error al calcular la tabla de amortización. Verifica los valores ingresados.';
    }
  }

  exportToExcel() {
    try {
      this.loanService.exportToExcel(this.amortizationTable);
    } catch (error) {
      this.errorMessage = 'Error al exportar la tabla a Excel.';
    }
  }
}
