import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './LoanCalculator.css';
import { calculateAmortization, exportToExcel } from '../utils/loanUtils';
import { generateLoanPDF } from '../utils/pdfUtils';
import { saveCalculation, getHistory, clearHistory } from '../utils/storageUtils';
import type { CalculationHistoryItem } from '../utils/storageUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

const LoanCalculator: React.FC = () => {
    const [formData, setFormData] = useState({
        principal: 0,
        annualRate: 0,
        months: 0,
        ivaRate: 0,
        openingFee: 0,
        approvalFee: 0,
        extraPayment: 0,
        startDate: '',
    });

    const [amortizationSchedule, setAmortizationSchedule] = useState<{
        summary: {
            totalInterest: number;
            totalIva: number;
            totalPayment: number;
            monthsSaved: number;
            interestSaved: number;
            finalDate: string | null;
            originalMonths: number;
            actualMonths: number;
        };
        table: Array<{
            month: number;
            date: string;
            balance: number;
            interest: number;
            iva: number;
            amortization: number;
            extraPayment: number;
            totalPaymentWithoutFees: number;
            totalPayment: number;
        }>;
    } | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false); // Toggle historial

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'startDate') {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: parseFloat(value) || 0 });
        }
    };

    const loadFromHistory = (item: CalculationHistoryItem) => {
        setFormData(item.formData);
        // Recalcular automáticamente al cargar
        // Ojo: Podríamos guardar el 'schedule' también, pero ocupa mucho. Mejor recalcular.
        try {
            const result = calculateAmortization(
                item.formData.principal,
                item.formData.annualRate,
                item.formData.months,
                item.formData.ivaRate,
                item.formData.openingFee,
                item.formData.approvalFee,
                item.formData.extraPayment,
                item.formData.startDate
            );
            setAmortizationSchedule(result);
            setShowHistory(false); // Cerrar panel al seleccionar
        } catch (e) {
            console.error(e);
        }
    };

    const handleClearHistory = () => {
        if (window.confirm('¿Estás seguro de borrar el historial?')) {
            clearHistory();
            setHistory([]);
        }
    };

    const validateInputs = (): boolean => {
        if (formData.principal <= 0) {
            setErrorMessage('El monto del préstamo debe ser mayor que 0.');
            return false;
        }
        if (formData.annualRate <= 0) {
            setErrorMessage('La tasa de interés anual debe ser mayor que 0.');
            return false;
        }
        if (formData.months <= 0) {
            setErrorMessage('El plazo del préstamo debe ser mayor que 0.');
            return false;
        }
        return true;
    };

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        if (!validateInputs()) return;

        try {
            const result = calculateAmortization(
                formData.principal,
                formData.annualRate,
                formData.months,
                formData.ivaRate,
                formData.openingFee,
                formData.approvalFee,
                formData.extraPayment,
                formData.startDate
            );
            setAmortizationSchedule(result);

            // Guardar en historial
            saveCalculation(formData, {
                totalPayment: result.summary.totalPayment,
                totalInterest: result.summary.totalInterest,
                finalDate: result.summary.finalDate
            });
            // Recargar historial
            setHistory(getHistory());

        } catch (error) {
            console.error('Error en el cálculo:', error);
            setErrorMessage('Error al calcular la tabla de amortización. Verifica los valores ingresados.');
        }
    };

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (!amortizationSchedule) return;
        try {
            setIsExporting(true);
            await exportToExcel(amortizationSchedule.table);
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            setErrorMessage('Error al exportar la tabla a Excel.');
        } finally {
            setIsExporting(false);
        }
    };

    const handlePDF = () => {
        if (!amortizationSchedule) return;
        generateLoanPDF(amortizationSchedule, formData.principal, formData.annualRate, formData.months);
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="main-content">
            <div className="container mt-4 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Calculadora de Préstamos</h2>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowHistory(!showHistory)}>
                        {showHistory ? 'Ocultar Historial' : 'Ver Historial Reciente'}
                    </button>
                </div>

                {/* Panel de Historial */}
                {showHistory && (
                    <div className="history-panel mb-4 p-3 bg-white border rounded shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="m-0 text-secondary">Últimos Cálculos</h5>
                            {history.length > 0 && (
                                <button className="btn btn-link text-danger btn-sm p-0" onClick={handleClearHistory}>
                                    Borrar todo
                                </button>
                            )}
                        </div>

                        {history.length === 0 ? (
                            <p className="text-muted small">No hay cálculos recientes.</p>
                        ) : (
                            <div className="list-group list-group-flush">
                                {history.map(item => (
                                    <button
                                        key={item.id}
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                        onClick={() => loadFromHistory(item)}
                                    >
                                        <div>
                                            <div className="fw-bold">{formatCurrency(item.formData.principal)} a {item.formData.months} meses</div>
                                            <div className="small text-muted">{item.date}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="badge bg-light text-dark border">
                                                Total: {formatCurrency(item.summary.totalPayment)}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Parte 1: Formulario de Entrada */}
                <div className="form-section mb-4">
                    <form onSubmit={calculate} className="mb-4">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="principal">Monto del Préstamo:</label>
                                <input
                                    type="number"
                                    id="principal"
                                    name="principal"
                                    value={formData.principal || ''}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese el monto"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="annualRate">Tasa de Interés Anual (%):</label>
                                <input
                                    type="number"
                                    id="annualRate"
                                    name="annualRate"
                                    value={formData.annualRate || ''}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese la tasa de interés"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="months">Plazo del Préstamo (meses):</label>
                                <input
                                    type="number"
                                    id="months"
                                    name="months"
                                    value={formData.months || ''}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese el plazo"
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="ivaRate">IVA de Interés (%):</label>
                                <input
                                    type="number"
                                    id="ivaRate"
                                    name="ivaRate"
                                    value={formData.ivaRate || ''}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese el IVA"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="openingFee">Comisión por Contratación:</label>
                                <input
                                    type="number"
                                    id="openingFee"
                                    name="openingFee"
                                    value={formData.openingFee || ''}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese la comisión por contratación"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="approvalFee">Comisión por Autorización:</label>
                                <input
                                    type="number"
                                    id="approvalFee"
                                    name="approvalFee"
                                    value={formData.approvalFee || ''}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese la comisión por autorización"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="extraPayment">Abono Extra Mensual (Capital):</label>
                                <input
                                    type="number"
                                    id="extraPayment"
                                    name="extraPayment"
                                    value={formData.extraPayment || ''}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder="Ingrese abono extra"
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="startDate">Fecha de Inicio:</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <img
                                src="/assets/icons8-v1.png"
                                alt="Información"
                                style={{ height: '1.5rem', marginRight: '0.5rem' }}
                            />
                            <span>Completa los datos para realizar el cálculo</span>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Calcular</button>
                    </form>

                    {errorMessage && (
                        <div className="alert alert-danger mt-4" role="alert">
                            {errorMessage}
                        </div>
                    )}
                </div>

                {/* Parte 2: Resumen y Tabla de Amortización */}
                {amortizationSchedule && (
                    <div className="results-section mt-4">

                        {/* Gráfica y Resumen */}
                        <div className="row mb-5 align-items-center">
                            <div className="col-md-4 mb-4 mb-md-0 d-flex justify-content-center">
                                <div style={{ width: '250px', height: '250px' }}>
                                    <Doughnut
                                        data={{
                                            labels: ['Capital', 'Intereses', 'IVA', 'Comisiones'],
                                            datasets: [
                                                {
                                                    label: 'Costo del Crédito',
                                                    data: [
                                                        formData.principal,
                                                        amortizationSchedule.summary.totalInterest,
                                                        amortizationSchedule.summary.totalIva,
                                                        formData.openingFee + formData.approvalFee
                                                    ],
                                                    backgroundColor: [
                                                        '#4f46e5', // Indigo (Capital)
                                                        '#10b981', // Emerald (Intereses)
                                                        '#0ea5e9', // Sky (IVA)
                                                        '#f59e0b', // Amber (Comisiones)
                                                    ],
                                                    borderColor: [
                                                        '#ffffff',
                                                        '#ffffff',
                                                        '#ffffff',
                                                        '#ffffff',
                                                    ],
                                                    borderWidth: 2,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom',
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="summary-cards row">
                                    <div className="col-md-6 mb-3">
                                        <div className="card text-white bg-primary mb-3 h-100">
                                            <div className="card-header">Pago Total Estimado</div>
                                            <div className="card-body">
                                                <h5 className="card-title">{formatCurrency(amortizationSchedule.summary.totalPayment)}</h5>
                                                <p className="card-text">Suma de todas las mensualidades y comisiones.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="card text-white bg-success mb-3 h-100">
                                            <div className="card-header">Interés Total</div>
                                            <div className="card-body">
                                                <h5 className="card-title">{formatCurrency(amortizationSchedule.summary.totalInterest)}</h5>
                                                <p className="card-text">Monto total pagado solo en intereses.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {amortizationSchedule.summary.finalDate && (
                                        <div className="col-md-12 mb-3">
                                            <div className="card text-white bg-info mb-3 h-100" style={{ backgroundColor: '#6366f1' }}>
                                                <div className="card-header">Fecha de Término</div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{amortizationSchedule.summary.finalDate}</h5>
                                                    <p className="card-text">
                                                        {amortizationSchedule.summary.monthsSaved > 0
                                                            ? `¡Terminas ${amortizationSchedule.summary.monthsSaved} meses antes!`
                                                            : 'Fecha estimada de liquidación.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {amortizationSchedule.summary.interestSaved > 0 && (
                                        <div className="col-md-12 mb-3">
                                            <div className="card text-white bg-warning mb-3 h-100" style={{ backgroundColor: '#f59e0b' }}>
                                                <div className="card-header">Ahorro Estimado</div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{formatCurrency(amortizationSchedule.summary.interestSaved)}</h5>
                                                    <p className="card-text text-white">Ahorro en intereses por pagos extra.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h3 className="mb-3">Tabla de Amortización</h3>
                        <div className="table-container">
                            <table className="table table-bordered mt-4">
                                <thead>
                                    <tr>
                                        <th>PAGO</th>
                                        <th>FECHA</th>
                                        <th>SALDO INSOLUTO</th>
                                        <th>INTERÉS</th>
                                        <th>IVA</th>
                                        <th>AMORTIZACIÓN</th>
                                        <th>ABONO EXTRA</th>
                                        <th>PAGO TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {amortizationSchedule.table.map((row) => (
                                        <tr key={row.month}>
                                            <td>{row.month}</td>
                                            <td>{row.date}</td>
                                            <td>{formatCurrency(row.balance)}</td>
                                            <td>{formatCurrency(row.interest)}</td>
                                            <td>{formatCurrency(row.iva)}</td>
                                            <td>{formatCurrency(row.amortization - row.extraPayment)}</td>
                                            <td>{formatCurrency(row.extraPayment)}</td>
                                            <td>{formatCurrency(row.totalPayment)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-flex gap-2 mt-4">
                            <button
                                onClick={handleExport}
                                className="btn btn-success flex-grow-1"
                                disabled={isExporting}
                            >
                                {isExporting ? 'Exportando...' : 'Excel (.xlsx)'}
                            </button>
                            <button
                                onClick={handlePDF}
                                className="btn btn-danger flex-grow-1"
                            >
                                PDF (.pdf)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Parte 3: Pie de Página */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-info">
                        <span className="footer-brand">Calculadora Financiera Pro</span>
                        <span className="copyright-text">
                            &copy; {new Date().getFullYear()}. Todos los derechos reservados.
                        </span>
                    </div>

                    <div className="developer-badge">
                        <a href="https://github.com/Hugo-S-M-28" aria-label="Github" target="_blank" rel="noopener noreferrer" className="developer-link">
                            <span className="text-muted small me-2">Desarrollado por:</span>
                            <span className="fw-bold text-white">Sánchez Milán Hugo</span>
                            <img src="/assets/Github.png" alt="Github" className="social-icon ms-2" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LoanCalculator;
