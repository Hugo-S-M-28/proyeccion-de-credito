import React from 'react';
import githubIcon from '../assets/Github.png';

const Footer: React.FC = () => {
    return (
        <footer className="calculator-footer mt-auto py-4">
            <div className="container-fluid px-md-5">
                <div className="footer-inner d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <span className="footer-copy text-secondary small">&copy; 2024 — Todos los derechos reservados</span>
                    <a 
                        href="https://github.com/Hugo-S-M-28" 
                        aria-label="Github" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="footer-dev developer-badge-glass text-decoration-none text-light py-2 px-3 rounded-pill d-inline-flex align-items-center"
                    >
                        <img src={githubIcon} alt="Github" width="20" className="social-icon me-2" />
                        <span className="small fw-medium">Dev: Sánchez Milán Hugo</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
