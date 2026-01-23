
/**
 * Calcula la tabla de amortización basada en los parámetros proporcionados.
 * @param principal Monto del préstamo.
 * @param annualRate Tasa de interés anual.
 * @param months Plazo del préstamo en meses.
 * @param ivaRate Tasa de IVA.
 * @param openingFee Comisión por contratación.
 * @param approvalFee Comisión por autorización.
 * @param extraPayment Abono extra mensual a capital
 * @param startDate Fecha de inicio del crédito (YYYY-MM-DD)
 * @returns Array de objetos que representan la tabla de amortización.
 */
export interface AmortizationSchedule {
    summary: {
        totalInterest: number;
        totalIva: number;
        totalPayment: number;
        monthsSaved: number;        // Nuevo: meses ahorrados por pagos extra
        interestSaved: number;      // Nuevo: interés ahorrado
        finalDate: string | null;  // Nuevo: fecha final real
        originalMonths: number;
        actualMonths: number;
    };
    table: Array<{
        month: number;
        date: string;              // Nuevo: fecha de pago
        balance: number;
        interest: number;
        iva: number;
        amortization: number;
        extraPayment: number;      // Nuevo: columna para abonos extra
        totalPaymentWithoutFees: number;
        totalPayment: number;
    }>;
}

export const calculateAmortization = (
    principal: number,
    annualRate: number,
    months: number,
    ivaRate: number = 0,
    openingFee: number = 0,
    approvalFee: number = 0,
    extraPayment: number = 0, // Nuevo parámetro
    startDate: string = ''    // Nuevo parámetro
): AmortizationSchedule => {
    const monthlyRate = calculateMonthlyRate(annualRate);
    const monthlyPayment = calculateMonthlyPayment(principal, monthlyRate, months);
    const ivaDec = ivaRate / 100;

    // Cálculo "Base" para saber cuánto se hubiera pagado sin abonos extra (para comparar ahorros)
    let baseTotalInterest = 0;
    let baseBalance = principal;
    for (let i = 0; i < months; i++) {
        const interest = baseBalance * monthlyRate;
        baseTotalInterest += interest;
        baseBalance -= (monthlyPayment - interest);
    }

    const table: AmortizationSchedule['table'] = [];
    let balance = principal;

    let totalInterest = 0;
    let totalIva = 0;
    let accumulatedPayment = 0;

    // Parsear fecha de inicio
    // Si no hay fecha, usar fecha actual pero tener cuidado con zonas horarias
    // new Date(startDate + 'T00:00:00') fuerza hora local inicio del dia
    let currentDate = startDate ? new Date(startDate + 'T00:00:00') : new Date();

    let month = 1;

    // Usamos while porque con pagos extra no sabemos cuántos meses durará exactamente
    // Límite de seguridad: mes original * 2 o 30 años 
    const maxMonths = Math.max(months * 2, 360);

    while (balance > 0.01 && month <= maxMonths) {
        let interest = balance * monthlyRate;
        let ivaInterest = interest * ivaDec;

        // Amortización normal según la cuota fija
        let normalAmortization = monthlyPayment - interest;

        // Si el abono extra es mayor que el saldo restante, ajustarlo
        let currentExtraPayment = extraPayment;

        // Amortización total propuesta este mes (lo normal + el extra)
        let totalAmortization = normalAmortization + currentExtraPayment;

        // Ajuste final si el saldo es menor que la amortización calculada (ya acabamos)
        if (balance < totalAmortization) {
            totalAmortization = balance;
            // Repartir entre normal y extra para registro
            if (balance < normalAmortization) {
                normalAmortization = balance;
                currentExtraPayment = 0;
            } else {
                currentExtraPayment = balance - normalAmortization;
            }
        }

        balance -= totalAmortization;
        if (balance < 0.01) balance = 0;

        const fees = (month === 1) ? (openingFee + approvalFee) : 0;

        // El pago sin fees es amortización total + interés
        const totalPaymentWithoutFees = totalAmortization + interest;
        const totalPayment = totalPaymentWithoutFees + ivaInterest + fees;

        totalInterest += interest;
        totalIva += ivaInterest;
        accumulatedPayment += totalPayment;

        // Formatear fecha a string legible (ej: "22 ene 2026")
        const dateStr = currentDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });

        table.push({
            month,
            date: dateStr,
            balance: balance,
            interest: interest,
            iva: ivaInterest,
            amortization: totalAmortization, // Incluye el extra
            extraPayment: currentExtraPayment,
            totalPaymentWithoutFees: totalPaymentWithoutFees,
            totalPayment: totalPayment,
        });

        // Avanzar un mes
        currentDate.setMonth(currentDate.getMonth() + 1);
        month++;
    }

    const actualMonths = table.length;
    // Meses ahorrados: Plazo original - Plazo real
    const monthsSaved = Math.max(0, months - actualMonths);
    const interestSaved = Math.max(0, baseTotalInterest - totalInterest);
    // La fecha final es la de la última fila
    const finalDate = table.length > 0 ? table[table.length - 1].date : null;

    return {
        summary: {
            totalInterest,
            totalIva,
            totalPayment: accumulatedPayment,
            monthsSaved,
            interestSaved,
            finalDate,
            originalMonths: months,
            actualMonths
        },
        table
    };
};

/**
 * Calcula la tasa de interés mensual a partir de la tasa anual.
 * @param annualRate Tasa de interés anual.
 * @returns Tasa de interés mensual.
 */
const calculateMonthlyRate = (annualRate: number): number => {
    return annualRate / 12 / 100;
};

/**
 * Calcula el pago mensual basado en la fórmula estándar de préstamos.
 * @param principal Monto del préstamo.
 * @param monthlyRate Tasa de interés mensual.
 * @param months Plazo del préstamo en meses.
 * @returns El pago mensual.
 */
const calculateMonthlyPayment = (principal: number, monthlyRate: number, months: number): number => {
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
};

/**
 * Exporta la tabla de amortización a un archivo Excel y permite su descarga.
 * @param amortizationTable Tabla de amortización para exportar.
 */
export const exportToExcel = async (amortizationTable: Array<any>): Promise<void> => {
    // Importación dinámica para reducir el tamaño del bundle inicial
    const ExcelJS = (await import('exceljs')).default;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tabla de Amortización');

    // Configurar las columnas del worksheet
    worksheet.columns = [
        { header: 'PAGO', key: 'month', width: 10 },
        { header: 'FECHA DE PAGO', key: 'date', width: 15 }, // Nuevo
        { header: 'SALDO INSOLUTO', key: 'balance', width: 20, style: { numFmt: '$#,##0.00' } },
        { header: 'INTERÉS', key: 'interest', width: 20, style: { numFmt: '$#,##0.00' } },
        { header: 'IVA DE INTERÉS ORDINARIO', key: 'iva', width: 25, style: { numFmt: '$#,##0.00' } },
        { header: 'AMORTIZACIÓN NORMAL', key: 'amortization', width: 20, style: { numFmt: '$#,##0.00' } },
        { header: 'ABONO EXTRA', key: 'extraPayment', width: 20, style: { numFmt: '$#,##0.00' } }, // Nuevo
        { header: 'MENSUALIDAD (S/ACCESORIOS)', key: 'totalPaymentWithoutFees', width: 25, style: { numFmt: '$#,##0.00' } },
        { header: 'MENSUALIDAD TOTAL', key: 'totalPayment', width: 20, style: { numFmt: '$#,##0.00' } }
    ];

    // Agregar filas al worksheet
    amortizationTable.forEach(row => worksheet.addRow(row));

    // Generar el archivo Excel y descargarlo
    try {
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'amortization_table.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        throw error;
    }
};
