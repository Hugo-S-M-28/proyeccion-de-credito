export interface LoanParams {
    principal: number;
    annualRate: number;
    months: number;
    ivaRate?: number;
    openingFee?: number;
    approvalFee?: number;
    extraPayment?: number;
    startDate?: string;
}

export interface AmortizationRow {
    month: number;
    date: string;
    balance: number;
    interest: number;
    iva: number;
    amortization: number;
    extraPayment: number;
    totalPaymentWithoutFees: number;
    totalPayment: number;
}

export interface AmortizationSummary {
    totalInterest: number;
    totalIva: number;
    totalPayment: number;
    monthlyPayment: number;
    monthsSaved: number;
    interestSaved: number;
    finalDate: string | null;
    originalMonths: number;
    actualMonths: number;
}

export interface AmortizationResult {
    summary: AmortizationSummary;
    table: AmortizationRow[];
}

/**
 * Calcula la tabla de amortización completa.
 */
export const calculateAmortization = (params: LoanParams): AmortizationResult => {
    const {
        principal,
        annualRate,
        months,
        ivaRate = 16,
        openingFee = 0,
        approvalFee = 0,
        extraPayment = 0,
        startDate = ''
    } = params;

    const monthlyRate = annualRate / 12 / 100;
    
    // Pago mensual fijo (cuota)
    let monthlyPayment = 0;
    if (monthlyRate === 0) {
        monthlyPayment = principal / months;
    } else {
        const factor = Math.pow(1 + monthlyRate, months);
        monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
    }

    const ivaDec = ivaRate / 100;

    // --- Cálculo base (sin abonos extra) para comparar ahorros ---
    let baseTotalInterest = 0;
    let baseBalance = principal;
    for (let i = 0; i < months; i++) {
        const interest = baseBalance * monthlyRate;
        baseTotalInterest += interest;
        const amortization = Math.min(baseBalance, monthlyPayment - interest);
        baseBalance -= amortization;
    }

    // --- Cálculo real ---
    const table: AmortizationRow[] = [];
    let balance = principal;
    let totalInterest = 0;
    let totalIva = 0;
    let accumulatedPayment = 0;

    let currentDate = startDate ? new Date(startDate + 'T00:00:00') : new Date();
    let month = 1;

    // Agregar mes 0 (Saldo inicial)
    table.push({
        month: 0,
        date: currentDate.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        balance: principal,
        interest: 0,
        iva: 0,
        amortization: 0,
        extraPayment: 0,
        totalPaymentWithoutFees: 0,
        totalPayment: 0,
    });

    while (balance > 0.001 && month <= 600) {
        const interest = balance * monthlyRate;
        const ivaInterest = interest * ivaDec;

        let normalAmortization = monthlyPayment - interest;
        let currentExtraPayment = extraPayment;
        let totalAmortization = normalAmortization + currentExtraPayment;

        if (balance < totalAmortization) {
            if (balance <= normalAmortization) {
                normalAmortization = balance;
                currentExtraPayment = 0;
            } else {
                currentExtraPayment = balance - normalAmortization;
            }
            totalAmortization = balance;
        }

        balance -= totalAmortization;
        if (balance < 0.001) balance = 0;

        const fees = (month === 1) ? (openingFee + approvalFee) : 0;
        const paymentWithoutFees = totalAmortization + interest;
        const totalPaymentMonth = paymentWithoutFees + ivaInterest + fees;

        totalInterest += interest;
        totalIva += ivaInterest;
        accumulatedPayment += totalPaymentMonth;

        const dateStr = currentDate.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        table.push({
            month,
            date: dateStr,
            balance,
            interest,
            iva: ivaInterest,
            amortization: totalAmortization,
            extraPayment: currentExtraPayment,
            totalPaymentWithoutFees: paymentWithoutFees,
            totalPayment: totalPaymentMonth,
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
        month++;
    }

    return {
        summary: {
            totalInterest,
            totalIva,
            totalPayment: accumulatedPayment,
            monthlyPayment,
            monthsSaved: Math.max(0, months - table.length),
            interestSaved: Math.max(0, baseTotalInterest - totalInterest),
            finalDate: table.length > 0 ? table[table.length - 1].date : null,
            originalMonths: months,
            actualMonths: table.length
        },
        table
    };
};

/**
 * Exporta la tabla de amortización a un archivo Excel.
 */
export const exportToExcel = async (result: AmortizationResult): Promise<void> => {
    const ExcelJS = (await import('exceljs')).default;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabla de Amortización');

    worksheet.columns = [
        { header: 'PAGO', key: 'month', width: 10 },
        { header: 'FECHA', key: 'date', width: 15 },
        { header: 'SALDO INSOLUTO', key: 'balance', width: 20, style: { numFmt: '$#,##0.00' } },
        { header: 'INTERÉS', key: 'interest', width: 20, style: { numFmt: '$#,##0.00' } },
        { header: 'IVA INTERÉS', key: 'iva', width: 20, style: { numFmt: '$#,##0.00' } },
        { header: 'AMORTIZACIÓN', key: 'amortization', width: 20, style: { numFmt: '$#,##0.00' } },
        { header: 'ABONO EXTRA', key: 'extraPayment', width: 18, style: { numFmt: '$#,##0.00' } },
        { header: 'MENSUALIDAD (S/ACC)', key: 'totalPaymentWithoutFees', width: 22, style: { numFmt: '$#,##0.00' } },
        { header: 'MENSUALIDAD TOTAL', key: 'totalPayment', width: 20, style: { numFmt: '$#,##0.00' } }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.alignment = { horizontal: 'center' };
    });

    result.table.forEach(row => worksheet.addRow(row));

    const summaryRow = worksheet.addRow({
        month: 'TOTAL',
        interest: result.summary.totalInterest,
        iva: result.summary.totalIva,
        totalPayment: result.summary.totalPayment
    });
    summaryRow.font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tabla_amortizacion_${new Date().getTime()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
};
