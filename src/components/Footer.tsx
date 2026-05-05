import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer>
            <div className="container footer-grid">
            <div>
                <a href="#" className="footer-logo cinzel">AGT HUB</a>
                <p style={{ color: 'var(--text-muted)', maxWidth: '320px', fontSize: '14px', lineHeight: '1.8' }}>
                Bridging tradition and technology. A student innovation community within ASTU, serving the Church through engineering excellence.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: 'var(--gold)', border: '1px solid var(--border)', padding: '8px', borderRadius: '4px' }}>
                    <Github size={20} />
                </a>
                <a href="#" style={{ color: 'var(--gold)', border: '1px solid var(--border)', padding: '8px', borderRadius: '4px' }}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                </a>
                </div>
            </div>
            <div>
                <h4 className="footer-heading">Navigation</h4>
                <div className="footer-links">
                <a href="#projects">Archives</a>
                <a href="#winners">Laureates</a>
                <a href="#journey">History</a>
                <a href="#about">About Us</a>
                </div>
            </div>
            <div>
                <h4 className="footer-heading">Contact</h4>
                <div className="footer-links">
                <a href="mailto:info@agthub.org">info@agthub.org</a>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>ASTU Building C-102</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Adama, Ethiopia</span>
                </div>
            </div>
            </div>
            <div className="container" style={{ marginTop: '4rem', borderTop: '1px solid var(--border-muted)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>&copy; 2024 AGT Hub. ASTU Gibi Gubaie Tech Team.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', letterSpacing: '0.1em' }} className="mono">FAITH & CODE</p>
            </div>
        </footer>
    );
};
