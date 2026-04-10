// src/app/loan.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { LoanService } from './loan.service';

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanService);
  });

  it('should calculate the correct amortization table for the first month', () => {
    const params = {
      principal: 100000,
      annualRate: 12, // 1% mensual
      months: 12,
      ivaRate: 16,
      openingFee: 1000,
      approvalFee: 500
    };

    const result = service.calculateAmortization(params);
    const firstRow = result.table[0];

    // Pago mensual (M) = 100,000 * [0.01(1.01)^12] / [(1.01)^12 - 1] = 8884.88
    // Interés mes 1 = 100,000 * 0.01 = 1000
    // IVA Interés = 1000 * 0.16 = 160
    // Amortización = 8884.88 - 1000 = 7884.88
    // Pago Total Mes 1 = 8884.88 + 160 + 1000 + 500 = 10544.88

    expect(firstRow.interest).toBeCloseTo(1000, 2);
    expect(firstRow.iva).toBeCloseTo(160, 2);
    expect(firstRow.amortization).toBeCloseTo(7884.88, 2);
    expect(firstRow.totalPayment).toBeCloseTo(10544.88, 2);
    expect(firstRow.balance).toBeCloseTo(92115.12, 2);
  });

  it('should handle zero annual rate correctly', () => {
    const params = {
      principal: 12000,
      annualRate: 0,
      months: 12
    };

    const result = service.calculateAmortization(params);

    expect(result.summary.monthlyPayment).toBe(1000);
    expect(result.summary.totalInterest).toBe(0);
    expect(result.summary.totalIva).toBe(0);
    expect(result.table[0].amortization).toBe(1000);
  });

  it('should calculate savings with extra payments', () => {
    const params = {
      principal: 100000,
      annualRate: 12,
      months: 24,
      extraPayment: 5000 // Pagando casi el doble cada mes
    };

    const result = service.calculateAmortization(params);

    expect(result.summary.actualMonths).toBeLessThan(24);
    expect(result.summary.monthsSaved).toBeGreaterThan(0);
    expect(result.summary.interestSaved).toBeGreaterThan(0);
  });

  it('should apply fees only in the first month', () => {
    const params = {
      principal: 100000,
      annualRate: 12,
      months: 12,
      openingFee: 1000,
      approvalFee: 500
    };

    const result = service.calculateAmortization(params);

    const firstRow = result.table[0];
    const secondRow = result.table[1];

    expect(firstRow.totalPayment - firstRow.totalPaymentWithoutFees - firstRow.iva).toBeCloseTo(1500, 2);
    expect(secondRow.totalPayment - secondRow.totalPaymentWithoutFees - secondRow.iva).toBeCloseTo(0, 2);
  });
});

