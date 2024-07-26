// src/app/loan.service.ts
import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';

@Injectable({
  providedIn: 'root',
})
export class LoanService {

  calculateAmortization(
    principal: number,
    annualRate: number,
    months: number,
    ivaRate: number,
    openingFee: number,
    approvalFee: number
  ): any[] {
    const monthlyRate = annualRate / 12 / 100; // Tasa de interés mensual
    const iva = ivaRate / 100; // Tasa de IVA

    // Fórmula del pago mensual
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);

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

  exportToExcel(amortizationTable: any[]): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Amortization Table');

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
