import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { LoanService, AmortizationResult, LoanParams, CalculationHistoryItem } from '../app/loan.service';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CurrencyPipe, DecimalPipe],
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.css']
})
export class LoanCalculatorComponent implements OnInit {
  loanForm!: FormGroup;
  result: AmortizationResult | null = null;
  errorMessage: string | null = null;
  isCalculating: boolean = false;
  isSubmitted: boolean = false;
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
    this.isSubmitted = true;
    
    if (this.loanForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    this.errorMessage = null;
    this.isCalculating = true;

    // Simulación de carga ligera para feedback visual
    setTimeout(() => {
      try {
        const params: LoanParams = this.loanForm.value;
        this.result = this.loanService.calculateAmortization(params);
        this.loadHistory();
      } catch (error) {
        console.error('Error en el cálculo:', error);
        this.errorMessage = 'Error al realizar el cálculo.';
      } finally {
        this.isCalculating = false;
      }
    }, 300);
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
      ivaRate: 16,
      openingFee: 0,
      approvalFee: 0,
      extraPayment: 0,
      startDate: new Date().toISOString().split('T')[0]
    });
    this.result = null;
    this.errorMessage = null;
    this.isSubmitted = false;
  }

  get f() { return this.loanForm.controls; }

  // ===== Chart / percentage getters =====

  /** Total bruto = Capital + Interés + IVA */
  get chartTotal(): number {
    if (!this.result) return 0;
    const principal = this.loanForm?.get('principal')?.value ?? 0;
    return principal + this.result.summary.totalInterest + this.result.summary.totalIva;
  }

  get capitalPercent(): number {
    if (!this.chartTotal) return 0;
    const principal = this.loanForm?.get('principal')?.value ?? 0;
    return (principal / this.chartTotal) * 100;
  }

  get interestPercent(): number {
    if (!this.chartTotal || !this.result) return 0;
    return (this.result.summary.totalInterest / this.chartTotal) * 100;
  }

  get ivaPercent(): number {
    if (!this.chartTotal || !this.result) return 0;
    return (this.result.summary.totalIva / this.chartTotal) * 100;
  }

  /**
   * Returns the SVG stroke-dasharray and stroke-dashoffset for each
   * segment of a 3-slice doughnut drawn on a circle with r=15.9155
   * (circumference ≈ 100).
   */
  get chartSegments(): { dash: string; offset: number; color: string }[] {
    const c = this.capitalPercent;
    const i = this.interestPercent;
    const v = this.ivaPercent;
    return [
      { dash: `${c} ${100 - c}`, offset: 25,         color: '#3b82f6' },  // Capital — blue
      { dash: `${i} ${100 - i}`, offset: 25 - c,     color: '#10b981' },  // Interés — emerald
      { dash: `${v} ${100 - v}`, offset: 25 - c - i,  color: '#f59e0b' },  // IVA — amber
    ];
  }
}
