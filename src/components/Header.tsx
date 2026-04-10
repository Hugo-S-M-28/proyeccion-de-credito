import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="calculator-header">
            <div className="header-content">
                <div className="header-icon">
                    <i className="bi bi-calculator-fill"></i>
                </div>
                <div>
                    <h1>Proyección de Crédito</h1>
                    <p className="header-subtitle">Calculadora de Amortización de Préstamos</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
