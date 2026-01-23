import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoanCalculator from './LoanCalculator';

describe('LoanCalculator', () => {
  it('renders the calculator form', () => {
    render(<LoanCalculator />);
    expect(screen.getByText('Calculadora de Préstamos')).toBeInTheDocument();
    expect(screen.getByLabelText(/Monto del Préstamo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tasa de Interés Anual/i)).toBeInTheDocument();
  });

  it('calculates amortization when form is submitted', () => {
    render(<LoanCalculator />);

    const principalInput = screen.getByLabelText(/Monto del Préstamo/i);
    const rateInput = screen.getByLabelText(/Tasa de Interés Anual/i);
    const monthsInput = screen.getByLabelText(/Plazo del Préstamo/i);
    const calculateButton = screen.getByText('Calcular');

    fireEvent.change(principalInput, { target: { value: '10000' } });
    fireEvent.change(rateInput, { target: { value: '12' } });
    fireEvent.change(monthsInput, { target: { value: '12' } });

    fireEvent.click(calculateButton);

    // Check if table appears
    expect(screen.getByRole('table')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // At least header + 1 row

    // Verify summary cards
    expect(screen.getByText('Pago Total Estimado')).toBeInTheDocument();
    expect(screen.getByText('Interés Total')).toBeInTheDocument();

    // Verify buttons
    expect(screen.getByText('Excel (.xlsx)')).toBeInTheDocument();
    expect(screen.getByText('PDF (.pdf)')).toBeInTheDocument();
  });

  it('shows error message for invalid inputs', () => {
    render(<LoanCalculator />);

    const principalInput = screen.getByLabelText(/Monto del Préstamo/i);
    const rateInput = screen.getByLabelText(/Tasa de Interés Anual/i);
    const monthsInput = screen.getByLabelText(/Plazo del Préstamo/i);

    // Fill properly to satisfy 'required' but with invalid logic values
    fireEvent.change(principalInput, { target: { value: '-1000' } });
    fireEvent.change(rateInput, { target: { value: '10' } });
    fireEvent.change(monthsInput, { target: { value: '12' } });

    const calculateButton = screen.getByText('Calcular');
    fireEvent.click(calculateButton);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/El monto del préstamo debe ser mayor que 0/i)).toBeInTheDocument();
  });
});
