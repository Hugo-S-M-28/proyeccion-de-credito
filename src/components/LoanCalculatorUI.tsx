import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { AmortizationResult } from '../utils/loanUtils';
import infoIcon from '../assets/icons8-v1.png';
import Header from './Header';
import Footer from './Footer';

// --- Tipos ---
export interface LoanCalculatorUIProps {
    params: {
        principal: number | string;
        annualRate: number | string;
        months: number | string;
        ivaRate: number | string;
        openingFee: number | string;
        approvalFee: number | string;
        extraPayment: number | string;
        startDate: string;
    };
    onParamChange: (name: string, value: any) => void;
    calculate: (e: React.FormEvent) => void;
    reset: () => void;
    handleExportExcel: () => void;
    handleExportPDF: () => void;
    clearHistory: () => void;
    applyHistoryItem: (item: any) => void;
    result: AmortizationResult | null;
    errorMessage: string | null;
    history: any[];
    isCalculating: boolean;
    chartData: any;
    isSubmitted: boolean; // Nuevo prop para controlar la visibilidad de errores
}

interface LoanFormProps {
    params: LoanCalculatorUIProps['params'];
    onParamChange: LoanCalculatorUIProps['onParamChange'];
    calculate: LoanCalculatorUIProps['calculate'];
    reset: LoanCalculatorUIProps['reset'];
    isCalculating: boolean;
    errorMessage: string | null;
    isSubmitted: boolean;
    infoIcon: string;
}

interface ResultsSummaryProps {
    summary: AmortizationResult['summary'];
}

interface AmortizationChartProps {
    chartData: any;
}

interface AmortizationTableProps {
    tableData: AmortizationResult['table'];
    summary: AmortizationResult['summary'];
    extraPayment: number;
}

interface HistoryListProps {
    history: any[];
    clearHistory: () => void;
    applyHistoryItem: (item: any) => void;
}

/**
 * LoanCalculatorUI - Presentational Component
 * Handles the visual structure and styling of the loan calculator.
 * Communicates with LoanCalculator.tsx via props.
 */

// --- Sub-componentes ---

const LoanForm: React.FC<LoanFormProps> = ({
    params, onParamChange, calculate, reset, isCalculating, errorMessage, isSubmitted, infoIcon
}) => (
    <section className="form-section shadow-lg card-bg-glass animate-fade-up">
        <div className="d-flex align-items-center mb-4 text-primary border-bottom pb-3 border-secondary border-opacity-25">
            <i className="bi bi-pencil-square me-2 fs-4"></i>
            <h3 className="m-0 fw-semibold text-white">Datos del Préstamo</h3>
            {infoIcon && <img src={infoIcon} alt="Info" className="ms-2 opacity-50 info-icon-style" />}
        </div>

        <form onSubmit={calculate} className="loan-form">
            <div className="row g-4">
                {/* Monto del Préstamo */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="principal" className="form-label">
                        <i className="bi bi-cash-stack me-1"></i> Monto del Préstamo
                    </label>
                    <div className={`input-wrapper ${isSubmitted && Number(params.principal) <= 0 ? 'is-invalid-field' : ''}`}>
                        <span className="input-prefix">$</span>
                        <input
                            id="principal"
                            type="number"
                            className="form-control has-prefix"
                            value={params.principal}
                            onChange={(e) => onParamChange('principal', e.target.value)}
                            placeholder="0"
                            required
                        />
                    </div>
                </div>

                {/* Tasa de Interés */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="annualRate" className="form-label">
                        <i className="bi bi-percent me-1"></i> Tasa de Interés Anual
                    </label>
                    <div className={`input-wrapper ${isSubmitted && Number(params.annualRate) <= 0 ? 'is-invalid-field' : ''}`}>
                        <input
                            id="annualRate"
                            type="number"
                            className="form-control has-suffix"
                            value={params.annualRate}
                            onChange={(e) => onParamChange('annualRate', e.target.value)}
                            placeholder="0"
                            step="0.01"
                            required
                        />
                        <span className="input-suffix">%</span>
                    </div>
                </div>

                {/* Plazo */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="months" className="form-label">
                        <i className="bi bi-calendar3 me-1"></i> Plazo (meses)
                    </label>
                    <input
                        id="months"
                        type="number"
                        className="form-control"
                        value={params.months}
                        onChange={(e) => onParamChange('months', e.target.value)}
                        placeholder="0"
                        required
                    />
                </div>

                {/* IVA */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="ivaRate" className="form-label">
                        <i className="bi bi-receipt me-1"></i> IVA s/ Int.
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="ivaRate"
                            type="number"
                            className="form-control has-suffix"
                            value={params.ivaRate}
                            onChange={(e) => onParamChange('ivaRate', e.target.value)}
                            placeholder="16"
                        />
                        <span className="input-suffix">%</span>
                    </div>
                </div>

                {/* Comisión Contratación */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="openingFee" className="form-label">
                        <i className="bi bi-file-earmark-text me-1"></i> Comisión por Contratación
                    </label>
                    <div className="input-wrapper">
                        <span className="input-prefix">$</span>
                        <input
                            id="openingFee"
                            type="number"
                            className="form-control has-prefix"
                            value={params.openingFee}
                            onChange={(e) => onParamChange('openingFee', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Comisión Autorización */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="approvalFee" className="form-label">
                        <i className="bi bi-check-circle me-1"></i> Comisión por Autorización
                    </label>
                    <div className="input-wrapper">
                        <span className="input-prefix">$</span>
                        <input
                            id="approvalFee"
                            type="number"
                            className="form-control has-prefix"
                            value={params.approvalFee}
                            onChange={(e) => onParamChange('approvalFee', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Abono Extra */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="extraPayment" className="form-label">
                        <i className="bi bi-plus-circle me-1"></i> Abono Extra Mensual
                    </label>
                    <div className="input-wrapper">
                        <span className="input-prefix">$</span>
                        <input
                            id="extraPayment"
                            type="number"
                            className="form-control has-prefix"
                            value={params.extraPayment}
                            onChange={(e) => onParamChange('extraPayment', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Fecha Inicio */}
                <div className="col-lg-3 col-md-6">
                    <label htmlFor="startDate" className="form-label">
                        <i className="bi bi-calendar-event me-1"></i> Fecha de Inicio
                    </label>
                    <input
                        id="startDate"
                        type="date"
                        className="form-control"
                        value={params.startDate}
                        onChange={(e) => onParamChange('startDate', e.target.value)}
                    />
                </div>
            </div>

            {/* ACCIONES */}
            <div className="mt-5 d-flex gap-3 align-items-center mb-0">
                <button
                    type="submit"
                    className="btn btn-primary btn-lg flex-fill shadow-glow fw-bold d-flex align-items-center justify-content-center gap-2"
                    disabled={isCalculating}
                    style={{ height: '56px' }}
                >
                    <i className="bi bi-calculator"></i>
                    {isCalculating ? 'Calculando...' : 'Calcular Amortización'}
                </button>
                <button
                    type="button"
                    onClick={reset}
                    className="btn btn-outline-secondary btn-lg flex-fill glass-button fw-bold d-flex align-items-center justify-content-center gap-2"
                    style={{ height: '56px' }}
                >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <span>Limpiar</span>
                </button>
            </div>

            {isSubmitted && (errorMessage || Number(params.principal) <= 0 || Number(params.annualRate) <= 0) && (
                <div className="mt-3 text-danger small d-flex gap-4 alert-container-custom" role="alert">
                    {Number(params.principal) <= 0 && <span>Monto requerido (mín. $1).</span>}
                    {Number(params.annualRate) <= 0 && <span>Tasa requerida (mín. 0.01%).</span>}
                    {errorMessage && <span>{errorMessage}</span>}
                </div>
            )}
        </form>
    </section>
);

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ summary }) => (
    <>
        <div className="row g-3 mb-4 summary-cards justify-content-center">
            {/* Cuota Mensual Fija - Prominent Card */}
            <div className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 bg-primary-gradient shadow-glow-primary rounded-4">
                    <div className="card-body p-4 text-start">
                        <small className="text-white text-opacity-75 d-block mb-2 text-uppercase fw-bold letter-spacing-1">Cuota Mensual Fija</small>
                        <h3 className="m-0 fw-bold text-white text-shadow-sm">
                            ${summary.monthlyPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>
            </div>
            {/* Other cards */}
            <div className="col-lg-9 col-md-12">
                <div className="row g-2">
                    <div className="col-md-3">
                        <div className="card h-100 border-0 bg-dark-glass rounded-4 summary-card-glow">
                            <div className="card-body p-3">
                                <small className="text-secondary d-block mb-1 text-uppercase small">Total a Pagar</small>
                                <h6 className="m-0 fw-bold text-white">${summary.totalPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card h-100 border-0 bg-dark-glass rounded-4 summary-card-glow">
                            <div className="card-body p-3">
                                <small className="text-secondary d-block mb-1 text-uppercase small">Interés Total</small>
                                <h6 className="m-0 fw-bold text-white">${summary.totalInterest.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card h-100 border-0 bg-dark-glass rounded-4 summary-card-glow">
                            <div className="card-body p-3">
                                <small className="text-secondary d-block mb-1 text-uppercase small">IVA Total</small>
                                <h6 className="m-0 fw-bold text-white">${summary.totalIva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h6>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card h-100 border-0 bg-dark-glass rounded-4 summary-card-glow">
                            <div className="card-body p-3">
                                <small className="text-secondary d-block mb-1 text-uppercase small">Plazo Real</small>
                                <h6 className="m-0 fw-bold text-white">{summary.actualMonths} meses</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {summary.interestSaved > 0 && (
            <div className="savings-badge p-3 rounded-4 mb-4 d-flex align-items-center gap-3 animate-fade-up" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div className="bg-success bg-opacity-25 p-2 rounded-circle">
                    <i className="bi bi-trophy-fill text-success fs-4"></i>
                </div>
                <div>
                    <strong className="text-success d-block">¡Ahorro con pagos extra detectado!</strong>
                    <span className="text-secondary small">
                        Ahorras <strong>${summary.interestSaved.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong> en intereses
                        y reduces <strong>{summary.monthsSaved} meses</strong> tu crédito.
                    </span>
                </div>
            </div>
        )}
    </>
);

const AmortizationChart: React.FC<AmortizationChartProps> = ({ chartData }) => (
    <div className="col-md-4">
        <div className="chart-container text-center bg-dark-glass">
            <div style={{ height: '250px', position: 'relative' }}>
                <Doughnut
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } }
                            }
                        },
                        cutout: '70%'
                    }}
                />
            </div>
        </div>
    </div>
);

const AmortizationTable: React.FC<AmortizationTableProps> = ({ tableData, summary, extraPayment }) => (
    <div className="table-container shadow-lg rounded-4 mt-5 animate-fade-up">
        <div className="table-responsive">
            <table className="table table-hover table-dark-custom mb-0">
                <thead>
                    <tr className="bg-header-dark text-uppercase small letter-spacing-1">
                        <th className="text-center py-3">Pago</th>
                        <th className="py-3">Fecha</th>
                        <th className="text-end py-3">Saldo Insoluto</th>
                        <th className="text-end py-3">Interés</th>
                        <th className="text-end py-3">IVA Interés</th>
                        <th className="text-end py-3">Amortización</th>
                        {extraPayment > 0 && <th className="text-end py-3 text-success-emphasis">Abono Extra</th>}
                        <th className="text-end py-3">Mensualidad (S/ACC)</th>
                        <th className="text-end py-3 text-white fw-bold">Mensualidad Total</th>
                    </tr>
                </thead>
                <tbody className="border-top-0">
                    {tableData.map((row) => (
                        <tr key={row.month} className={`align-middle ${row.month === 0 ? 'bg-dark bg-opacity-25 opacity-50' : ''}`}>
                            <td className="text-center text-secondary-emphasis font-monospace">{row.month}</td>
                            <td className="text-secondary">{row.date}</td>
                            <td className="text-end font-monospace">${row.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                            <td className="text-end font-monospace text-secondary-emphasis">
                                {row.month > 0 ? `$${row.interest.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                            <td className="text-end font-monospace text-secondary-emphasis">
                                {row.month > 0 ? `$${row.iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                            <td className="text-end font-monospace">
                                {row.month > 0 ? `$${row.amortization.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                            {extraPayment > 0 && (
                                <td className="text-end text-success font-monospace">
                                    {row.month > 0 && row.extraPayment > 0 ? `$${row.extraPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                                </td>
                            )}
                            <td className="text-end font-monospace text-secondary-emphasis">
                                {row.month > 0 ? `$${row.totalPaymentWithoutFees.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                            <td className="text-end fw-bold text-white font-monospace total-payment-cell">
                                {row.month > 0 ? `$${row.totalPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="table-dark-footer">
                    <tr className="fw-bold border-top-secondary-emphasis">
                        <td colSpan={2} className="text-center py-3">TOTALES</td>
                        <td className="text-end"></td>
                        <td className="text-end text-primary-emphasis py-3 font-monospace">
                            ${summary.totalInterest.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-end text-primary-emphasis py-3 font-monospace">
                            ${summary.totalIva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="text-end"></td>
                        {extraPayment > 0 && <td></td>}
                        <td className="text-end"></td>
                        <td className="text-end text-gradient fs-5 py-3 font-monospace">
                            ${summary.totalPayment.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
);

const HistoryList: React.FC<HistoryListProps> = ({ history, clearHistory, applyHistoryItem }) => (
    <section className="mt-5 mb-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center text-secondary opacity-75">
                <i className="bi bi-clock-history me-2 fs-4"></i>
                <h4 className="m-0 fw-semibold">Historial Reciente</h4>
            </div>
            {history.length > 0 && (
                <button onClick={clearHistory} className="btn btn-sm btn-link text-danger text-decoration-none opacity-75">
                    <i className="bi bi-trash"></i> Limpiar
                </button>
            )}
        </div>

        {history.length === 0 ? (
            <p className="text-center text-secondary py-4 border border-secondary border-dashed border-opacity-25 rounded-4">
                No hay cálculos recientes guardados.
            </p>
        ) : (
            <div className="row g-3">
                {history.map((item, index) => (
                    <div key={index} className="col-md-6 col-lg-4">
                        <div
                            className="card bg-dark bg-opacity-25 border-secondary border-opacity-25 cursor-pointer hover-scale-sm"
                            onClick={() => applyHistoryItem(item)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-body p-3">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <span className="badge bg-primary bg-opacity-25 text-primary">#{history.length - index}</span>
                                    <small className="text-secondary">{item.date}</small>
                                </div>
                                <h6 className="mb-1 text-white">
                                    ${Number(item.formData.principal).toLocaleString()} @ {item.formData.annualRate}% - {item.formData.months} meses
                                </h6>
                                <p className="small text-secondary mb-0">Total Proyectado: ${item.summary.totalPayment.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </section>
);


// --- Componente principal ---
const LoanCalculatorUI: React.FC<LoanCalculatorUIProps> = (props) => {
    const {
        params,
        onParamChange,
        calculate,
        reset,
        handleExportExcel,
        handleExportPDF,
        clearHistory,
        applyHistoryItem,
        result,
        errorMessage,
        history,
        isCalculating,
        chartData,
        isSubmitted
    } = props;

    return (
        <div className="calculator-wrapper">
            <Header />

            <main className="calculator-body animate-fade-up">
                {/* Formulario */}
                <LoanForm
                    params={params}
                    onParamChange={onParamChange}
                    calculate={calculate}
                    reset={reset}
                    isCalculating={isCalculating}
                    errorMessage={errorMessage}
                    isSubmitted={isSubmitted}
                    infoIcon={infoIcon}
                />

                {/* Resultados (condicional) */}
                {result && (
                    <div className="results-section animate-fade-up shadow-lg">
                        <div className="d-flex align-items-center text-secondary mb-4">
                            <i className="bi bi-graph-up-arrow me-2 fs-4"></i>
                            <h3 className="m-0 fw-semibold">Resumen de Resultados</h3>
                        </div>

                        {/* Tarjetas de resumen */}
                        <ResultsSummary summary={result.summary} />

                        {/* Gráfico y acciones */}
                        <div className="row align-items-center g-4 mb-5">
                            <AmortizationChart chartData={chartData} />
                            <div className="col-md-8 text-center text-md-start">
                                <h4 className="fw-bold mb-3">Estadísticas de Pago</h4>
                                <p className="text-secondary text-opacity-75">
                                    Se ha calculado un plazo real de <strong>{result.summary.actualMonths} meses</strong>,
                                    finalizando el <strong>{result.summary.finalDate}</strong>.
                                </p>
                                <div className="button-group d-flex gap-3 justify-content-center justify-content-md-start mt-4">
                                    <button
                                        onClick={handleExportExcel}
                                        className="btn btn-success d-flex align-items-center gap-2"
                                    >
                                        <i className="bi bi-file-earmark-excel"></i> Excel (.xlsx)
                                    </button>
                                    <button
                                        onClick={handleExportPDF}
                                        className="btn btn-danger d-flex align-items-center gap-2"
                                    >
                                        <i className="bi bi-file-earmark-pdf"></i> PDF (.pdf)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de amortización */}
                        <AmortizationTable
                            tableData={result.table}
                            summary={result.summary}
                            extraPayment={Number(params.extraPayment)}
                        />
                    </div>
                )}

                {/* Historial */}
                <HistoryList
                    history={history}
                    clearHistory={clearHistory}
                    applyHistoryItem={applyHistoryItem}
                />
            </main>

            <Footer />
        </div>
    );
};

export default LoanCalculatorUI;