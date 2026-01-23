import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AmortizationSchedule } from './loanUtils';

export const generateLoanPDF = (
    schedule: AmortizationSchedule,
    principal: number,
    annualRate: number,
    months: number
) => {
    const doc = new jsPDF();

    // 1. Encabezado
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text('Cotización de Préstamo', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de Impresión: ${new Date().toLocaleDateString('es-MX')}`, 14, 28);

    // 2. Resumen Ejecutivo (Rectángulo con datos)
    doc.setFillColor(245, 247, 250); // Gris muy claro
    doc.roundedRect(14, 35, 180, 45, 3, 3, 'F');

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumen Financiero', 20, 45);

    // Columna 1
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Monto del Préstamo:', 20, 55);
    doc.text('Tasa Anual:', 20, 62);
    doc.text('Plazo Original:', 20, 69);

    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${principal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 70, 55);
    doc.text(`${annualRate}%`, 70, 62);
    doc.text(`${months} meses`, 70, 69);

    // Columna 2
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text('Pago Total Estimado:', 110, 55);
    doc.text('Interés Total:', 110, 62);
    doc.text('Fecha Estimada Fin:', 110, 69);

    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(`$${schedule.summary.totalPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 150, 55);
    doc.text(`$${schedule.summary.totalInterest.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 150, 62);
    if (schedule.summary.finalDate) {
        doc.text(schedule.summary.finalDate, 150, 69);
    } else {
        doc.text('-', 150, 69);
    }

    // Ahorro (si existe)
    if (schedule.summary.interestSaved > 0) {
        doc.setTextColor(34, 197, 94); // Green
        doc.setFontSize(11);
        doc.text(`¡Ahorro Proyectado: $${schedule.summary.interestSaved.toLocaleString('es-MX', { minimumFractionDigits: 2 })}!`, 110, 76);
    }

    // 3. Tabla de Amortización
    const tableColumn = ["Pago", "Fecha", "Saldo", "Interés", "IVA", "Amortización", "Abono Extra", "Total"];
    const tableRows: any[] = [];

    schedule.table.forEach(row => {
        const rowData = [
            row.month,
            row.date,
            `$${row.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${row.interest.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${row.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            `$${(row.amortization - row.extraPayment).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            row.extraPayment > 0 ? `$${row.extraPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-',
            `$${row.totalPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
        ];
        tableRows.push(rowData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 90,
        theme: 'grid',
        headStyles: {
            fillColor: [79, 70, 229], // Indigo
            fontSize: 8,
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 8,
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        },
        margin: { top: 90 }
    });

    doc.save(`cotizacion_prestamo_${new Date().getTime()}.pdf`);
};
