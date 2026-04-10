import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LoanService, AmortizationResult, LoanParams, CalculationHistoryItem } from '../app/loan.service';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CurrencyPipe],
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent implements OnInit {
  loanForm!: FormGroup;
  result: AmortizationResult | null = null;
  errorMessage: string | null = null;
  isCalculating: boolean = false;
  history: CalculationHistoryItem[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadHistory();
  }

  /**
   * Inicializa el formulario reactivo
   */
  private initForm(): void {
    this.loanForm = this.fb.group({
      principal: [null, [Validators.required, Validators.min(1)]],
      annualRate: [null, [Validators.required, Validators.min(0.01)]],
      months: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')]],
      ivaRate: [null, [Validators.required, Validators.min(0)]],
      openingFee: [null, [Validators.min(0)]],
      approvalFee: [null, [Validators.min(0)]],
      extraPayment: [null, [Validators.min(0)]],
      startDate: [new Date().toISOString().split('T')[0]]
    });
  }

  /**
   * Carga el historial desde el servicio
   */
  loadHistory(): void {
    this.history = this.loanService.getCalculationHistory();
  }

  /**
   * Ejecuta el cálculo
   */
  calculate(): void {
    if (this.loanForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.errorMessage = null;
    this.isCalculating = true;

    try {
      const params: LoanParams = this.loanForm.value;
      this.result = this.loanService.calculateAmortization(params);
      this.loadHistory(); // Recargar historial después de guardar el nuevo
    } catch (error) {
      console.error('Error en el cálculo:', error);
      this.errorMessage = 'Error al realizar el cálculo.';
    } finally {
      this.isCalculating = false;
    }
  }

  /**
   * Exporta a Excel
   */
  async exportToExcel(): Promise<void> {
    if (!this.result) return;
    try {
      await this.loanService.exportToExcel(this.result);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      this.errorMessage = 'Error al exportar a Excel.';
    }
  }

  /**
   * Exporta a PDF
   */
  exportToPDF(): void {
    if (!this.result) return;
    try {
      this.loanService.exportToPDF(this.result, this.loanForm.value);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      this.errorMessage = 'Error al exportar a PDF.';
    }
  }

  /**
   * Aplica un cálculo del historial al formulario
   */
  applyHistoryItem(item: CalculationHistoryItem): void {
    this.loanForm.patchValue(item.formData);
    this.calculate();
  }

  /**
   * Limpia el historial
   */
  clearHistory(): void {
    this.loanService.clearHistory();
    this.loadHistory();
  }

  /**
   * Reinicia el formulario
   */
  reset(): void {
    this.loanForm.reset({
      principal: null,
      annualRate: null,
      months: null,
      ivaRate: null,
      openingFee: null,
      approvalFee: null,
      extraPayment: null,
      startDate: new Date().toISOString().split('T')[0]
    });
    this.result = null;
    this.errorMessage = null;
  }

  get f() { return this.loanForm.controls; }
}
