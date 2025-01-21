// src/app/loan.service.ts
import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  /**
   * Calcula la tabla de amortización basada en los parámetros proporcionados.
   * @param principal Monto del préstamo.
   * @param annualRate Tasa de interés anual.
   * @param months Plazo del préstamo en meses.
   * @param ivaRate Tasa de IVA.
   * @param openingFee Comisión por contratación.
   * @param approvalFee Comisión por autorización.
   * @returns Array de objetos que representan la tabla de amortización.
   */
  calculateAmortization(
    principal: number,
    annualRate: number,
    months: number,
    ivaRate: number = 0,
    openingFee: number = 0,
    approvalFee: number = 0
  ): Array<{
    month: number;
    balance: string;
    interest: string;
    iva: string;
    amortization: string;
    totalPaymentWithoutFees: string;
    totalPayment: string;
  }> {
    const monthlyRate = this.calculateMonthlyRate(annualRate); // Tasa de interés mensual
    const monthlyPayment = this.calculateMonthlyPayment(principal, monthlyRate, months); // Pago mensual
    const iva = ivaRate / 100;

    const amortizationTable: any[] = [];
    let balance = principal;

    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyRate;
      const ivaInterest = interest * iva;
      const amortization = monthlyPayment - interest;
      balance -= amortization;

      const totalPaymentWithoutFees = monthlyPayment;
      const totalPayment = totalPaymentWithoutFees + ivaInterest + openingFee + approvalFee;

      amortizationTable.push({
        month,
        balance: balance.toFixed(2),
        interest: interest.toFixed(2),
        iva: ivaInterest.toFixed(2),
        amortization: amortization.toFixed(2),
        totalPaymentWithoutFees: totalPaymentWithoutFees.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
      });
    }

    return amortizationTable;
  }

  /**
   * Calcula la tasa de interés mensual a partir de la tasa anual.
   * @param annualRate Tasa de interés anual.
   * @returns Tasa de interés mensual.
   */
  private calculateMonthlyRate(annualRate: number): number {
    return annualRate / 12 / 100;
  }

  /**
   * Calcula el pago mensual basado en la fórmula estándar de préstamos.
   * @param principal Monto del préstamo.
   * @param monthlyRate Tasa de interés mensual.
   * @param months Plazo del préstamo en meses.
   * @returns El pago mensual.
   */
  private calculateMonthlyPayment(principal: number, monthlyRate: number, months: number): number {
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  }

  /**
   * Exporta la tabla de amortización a un archivo Excel y permite su descarga.
   * @param amortizationTable Tabla de amortización para exportar.
   */
  exportToExcel(amortizationTable: Array<any>): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabla de Amortización');

    // Configurar las columnas del worksheet
    worksheet.columns = [
      { header: 'PAGO', key: 'month', width: 10 },
      { header: 'SALDO INSOLUTO', key: 'balance', width: 20 },
      { header: 'INTERÉS', key: 'interest', width: 20 },
      { header: 'IVA DE INTERÉS ORDINARIO', key: 'iva', width: 25 },
      { header: 'AMORTIZACIÓN', key: 'amortization', width: 20 },
      { header: 'MENSUALIDAD (S/ACCESORIOS)', key: 'totalPaymentWithoutFees', width: 25 },
      { header: 'MENSUALIDAD TOTAL', key: 'totalPayment', width: 20 }
    ];

    // Agregar filas al worksheet
    amortizationTable.forEach(row => worksheet.addRow(row));

    // Generar el archivo Excel y descargarlo
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'amortization_table.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch(error => {
      console.error('Error al exportar a Excel:', error);
    });
  }
}
