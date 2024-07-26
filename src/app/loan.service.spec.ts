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
    const principal = 100000;  // Ejemplo de monto del préstamo
    const annualRate = 6;      // Ejemplo de tasa de interés anual
    const months = 12;         // Ejemplo de plazo en meses
    const ivaRate = 19;        // Ejemplo de IVA en porcentaje
    const openingFee = 500;    // Ejemplo de comisión de apertura
    const approvalFee = 200;   // Ejemplo de comisión de aprobación

    const result = service.calculateAmortization(principal, annualRate, months, ivaRate, openingFee, approvalFee);

    // Valores esperados calculados manualmente para este ejemplo
    expect(parseFloat(result[0].balance)).toBeCloseTo(91187.23, 2);
    expect(parseFloat(result[0].interest)).toBeCloseTo(5000.00, 2);
    expect(parseFloat(result[0].iva)).toBeCloseTo(950.00, 2);
    expect(parseFloat(result[0].amortization)).toBeCloseTo(8312.77, 2);
    expect(parseFloat(result[0].totalPayment)).toBeCloseTo(14262.77, 2);
  });

  it('should calculate the correct monthly payment', () => {
    const principal = 100000;  // Ejemplo de monto del préstamo
    const annualRate = 6;      // Ejemplo de tasa de interés anual
    const months = 12;         // Ejemplo de plazo en meses
    const ivaRate = 19;        // Ejemplo de IVA en porcentaje
    const openingFee = 500;    // Ejemplo de comisión de apertura
    const approvalFee = 200;   // Ejemplo de comisión de aprobación

    const result = service.calculateAmortization(principal, annualRate, months, ivaRate, openingFee, approvalFee);
    const monthlyRate = annualRate / 12 / 100;
    const expectedMonthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);

    // Verificar que la amortización y el interés sumen el pago mensual esperado
    expect(parseFloat(result[0].amortization) + parseFloat(result[0].interest)).toBeCloseTo(expectedMonthlyPayment, 2);
  });

  it('should handle edge cases where principal is zero', () => {
    const principal = 0;
    const annualRate = 6;
    const months = 12;
    const ivaRate = 19;
    const openingFee = 500;
    const approvalFee = 200;

    const result = service.calculateAmortization(principal, annualRate, months, ivaRate, openingFee, approvalFee);

    expect(result).toEqual([]);
  });

  it('should handle edge cases where months is zero', () => {
    const principal = 100000;
    const annualRate = 6;
    const months = 0;
    const ivaRate = 19;
    const openingFee = 500;
    const approvalFee = 200;

    const result = service.calculateAmortization(principal, annualRate, months, ivaRate, openingFee, approvalFee);

    expect(result).toEqual([]);
  });

  it('should handle edge cases where annual rate is zero', () => {
    const principal = 100000;
    const annualRate = 0;
    const months = 12;
    const ivaRate = 19;
    const openingFee = 500;
    const approvalFee = 200;

    const result = service.calculateAmortization(principal, annualRate, months, ivaRate, openingFee, approvalFee);

    expect(parseFloat(result[0].interest)).toBeCloseTo(0, 2);
    expect(parseFloat(result[0].iva)).toBeCloseTo(0, 2);
  });

  it('should handle negative values gracefully', () => {
    const principal = -100000;
    const annualRate = -6;
    const months = -12;
    const ivaRate = -19;
    const openingFee = -500;
    const approvalFee = -200;

    const result = service.calculateAmortization(principal, annualRate, months, ivaRate, openingFee, approvalFee);

    expect(result).toEqual([]);
  });
});
