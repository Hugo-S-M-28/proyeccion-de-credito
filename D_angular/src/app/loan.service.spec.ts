// src/app/loan.service.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { LoanService } from './loan.service';
import { LoanParams } from '../utils/loanUtils';

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanService);
    // Limpiar historial antes de cada prueba
    localStorage.clear();
  });

  it('debe tener el Periodo 0 como saldo inicial', () => {
    const params: LoanParams = {
      principal: 100000,
      annualRate: 12,
      months: 12,
      ivaRate: 0
    };

    const result = service.calculateAmortization(params);
    
    // Período 0: Saldo inicial sin pagos
    expect(result.table[0].month).toBe(0);
    expect(result.table[0].balance).toBe(100000);
    expect(result.table[0].totalPayment).toBe(0);
  });

  it('debe calcular correctamente la amortización del primer mes (Periodo 1)', () => {
    const params: LoanParams = {
      principal: 100000,
      annualRate: 12, // 1% mensual
      months: 12,
      ivaRate: 16
    };

    const result = service.calculateAmortization(params);
    const firstMonth = result.table[1]; // El mes 1 es el índice 1

    // Pago mensual (M) ≈ 8884.88
    // Interés mes 1 = 100,000 * 0.01 = 1000
    // IVA Interés = 1000 * 0.16 = 160
    // Amortización ≈ 7884.88
    // Mensualidad Total = 8884.88 + 160 = 9044.88

    expect(firstMonth.month).toBe(1);
    expect(firstMonth.interest).toBeCloseTo(1000, 2);
    expect(firstMonth.iva).toBeCloseTo(160, 2);
    expect(firstMonth.amortization).toBeCloseTo(7884.88, 2);
    expect(firstMonth.totalPayment).toBeCloseTo(9044.88, 2);
  });

  it('debe manejar tasa de interés Cero correctamente', () => {
    const params: LoanParams = {
      principal: 12000,
      annualRate: 0,
      months: 12,
      ivaRate: 16
    };

    const result = service.calculateAmortization(params);

    expect(result.summary.monthlyPayment).toBe(1000);
    expect(result.summary.totalInterest).toBe(0);
    expect(result.summary.totalIva).toBe(0);
    // Verificamos el mes 1
    expect(result.table[1].amortization).toBe(1000);
  });

  it('debe calcular ahorros con abonos extra', () => {
    const params: LoanParams = {
      principal: 100000,
      annualRate: 12,
      months: 24,
      extraPayment: 5000, // Pagando extra
      ivaRate: 16
    };

    const result = service.calculateAmortization(params);

    // El plazo real debe ser menor a los 24 meses originales
    expect(result.summary.actualMonths).toBeLessThan(24);
    expect(result.summary.monthsSaved).toBeGreaterThan(0);
    expect(result.summary.interestSaved).toBeGreaterThan(0);
  });

  it('debe registrar el cálculo en el historial local', () => {
    const params: LoanParams = {
      principal: 50000,
      annualRate: 15,
      months: 6,
      ivaRate: 16
    };

    service.calculateAmortization(params);
    const history = service.getCalculationHistory();

    expect(history.length).toBeGreaterThan(0);
    expect(history[0].formData.principal).toBe(50000);
  });
});