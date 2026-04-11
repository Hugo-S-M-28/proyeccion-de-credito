import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './LoanCalculator.css';
import { calculateAmortization, exportToExcel } from '../utils/loanUtils';
import { generateLoanPDF } from '../utils/pdfUtils';
import { saveCalculation } from '../utils/storageUtils';
import type { LoanParams, AmortizationResult } from '../utils/loanUtils';
import LoanCalculatorUI from './LoanCalculatorUI';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function LoanCalculator() {
    // --- Logic / State Management ---
    const [params, setParams] = useState({
        principal: '' as number | string,
        annualRate: '' as number | string,
        months: '' as number | string,
        ivaRate: 16 as number | string,
        openingFee: '' as number | string,
        approvalFee: '' as number | string,
        extraPayment: '' as number | string,
        startDate: new Date().toISOString().split('T')[0]
    });

    const [result, setResult] = useState<AmortizationResult | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<Array<{
        date: string;
        formData: typeof params;
        summary: AmortizationResult['summary'];
    }>>([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Load history from local storage
        const savedHistory = localStorage.getItem('loan_history');
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error('Error loading history', e);
            }
        }
    }, []);

    const onParamChange = (name: string, value: any) => {
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const calculate = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (Number(params.principal) <= 0) {
            setErrorMessage('El monto del préstamo debe ser mayor que 0');
            return;
        }
        if (Number(params.annualRate) <= 0) {
            setErrorMessage('La tasa de interés anual debe ser mayor que 0');
            return;
        }
        if (Number(params.months) <= 0) {
            setErrorMessage('El plazo del préstamo debe ser mayor que 0');
            return;
        }

        setIsCalculating(true);
        setErrorMessage(null);
        setIsSubmitted(true);

        // Simulation for UI effect
        setTimeout(() => {
            try {
                const loanParams: LoanParams = {
                    principal: Number(params.principal),
                    annualRate: Number(params.annualRate),
                    months: Number(params.months),
                    ivaRate: Number(params.ivaRate) || 0,
                    openingFee: Number(params.openingFee) || 0,
                    approvalFee: Number(params.approvalFee) || 0,
                    extraPayment: Number(params.extraPayment) || 0,
                    startDate: params.startDate
                };

                const res = calculateAmortization(loanParams);
                setResult(res);

                // Save to history
                const historyItem = {
                    date: new Date().toLocaleString(),
                    formData: { ...params },
                    summary: res.summary
                };
                const newHistory = [historyItem, ...history].slice(0, 10);
                setHistory(newHistory);
                localStorage.setItem('loan_history', JSON.stringify(newHistory));

                // External storage sync
                saveCalculation(loanParams, res.summary);
            } catch (error) {
                console.error('Error en el cálculo:', error);
                setErrorMessage('Error al realizar el cálculo.');
            } finally {
                setIsCalculating(false);
            }
        }, 300);
    };

    const reset = () => {
        setParams({
            principal: '',
            annualRate: '',
            months: '',
            ivaRate: 16,
            openingFee: '',
            approvalFee: '',
            extraPayment: '',
            startDate: new Date().toISOString().split('T')[0]
        });
        setResult(null);
        setErrorMessage(null);
        setIsSubmitted(false);
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('loan_history');
    };

    const applyHistoryItem = (item: any) => {
        setParams(item.formData);
        // We could auto-calculate if we want
        // calculate(); 
    };

    const handleExportExcel = async () => {
        if (result) {
            await exportToExcel(result);
        }
    };

    const handleExportPDF = () => {
        if (result) {
            const loanParams: LoanParams = {
                principal: Number(params.principal),
                annualRate: Number(params.annualRate),
                months: Number(params.months),
                ivaRate: Number(params.ivaRate) || 0,
                openingFee: Number(params.openingFee) || 0,
                approvalFee: Number(params.approvalFee) || 0,
                extraPayment: Number(params.extraPayment) || 0,
                startDate: params.startDate
            };
            generateLoanPDF(result, loanParams);
        }
    };

    const chartData = result ? (() => {
        const capital = Number(params.principal);
        const interest = result.summary.totalInterest;
        const iva = result.summary.totalIva;
        const total = capital + interest + iva;
        return {
            labels: ['Capital', 'Interés', 'IVA'],
            datasets: [
                {
                    data: [capital, interest, iva],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                    hoverBackgroundColor: ['#2563eb', '#059669', '#d97706'],
                    borderWidth: 2,
                    borderColor: 'rgba(15, 23, 42, 0.8)',
                },
            ],
            percentages: {
                capital: ((capital / total) * 100).toFixed(1),
                interest: ((interest / total) * 100).toFixed(1),
                iva: ((iva / total) * 100).toFixed(1),
            },
        };
    })() : null;

    // --- Render View Component ---
    return (
        <LoanCalculatorUI
            params={params}
            onParamChange={onParamChange}
            calculate={calculate}
            reset={reset}
            handleExportExcel={handleExportExcel}
            handleExportPDF={handleExportPDF}
            clearHistory={clearHistory}
            applyHistoryItem={applyHistoryItem}
            result={result}
            errorMessage={errorMessage}
            history={history}
            isCalculating={isCalculating}
            chartData={chartData}
            isSubmitted={isSubmitted}
        />
    );
}