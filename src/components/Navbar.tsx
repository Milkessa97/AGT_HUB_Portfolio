import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
    isScrolled: boolean;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isScrolled, theme, toggleTheme }) => {
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const sections = ['hero', 'projects', 'winners', 'journey', 'about', 'join-us'];
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });

            // Force hero active if at the very top
            if (window.scrollY < 100) {
                setActiveSection('hero');
            }
        }, observerOptions);

        const handleTopScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection('hero');
            }
        };

        window.addEventListener('scroll', handleTopScroll);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleTopScroll);
        };
    }, []);

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <nav id="navbar" style={{
            height: isScrolled ? '64px' : '72px'
        }}>
            <div className="container-fluid nav-content">
                <a href="#" className="nav-logo-link" onClick={scrollToTop}>
                    <img 
                        src={theme === 'dark' ? "/AGT_HUB_Logo.png" : "/AGT_HUB_Logo_dark.png"} 
                        alt="Logo" 
                        style={{ width: '160px', height: '160px', transition: 'opacity 0.3s ease' }} 
                    />
                </a>
                <div className="nav-right">
                    <div className="nav-links">
                        <a href="#projects" className={activeSection === 'projects' ? 'active' : ''}>Archives</a>
                        <a href="#winners" className={activeSection === 'winners' ? 'active' : ''}>Laureates</a>
                        <a href="#journey" className={activeSection === 'journey' ? 'active' : ''}>Journey</a>
                        <a href="#about" className={activeSection === 'about' ? 'active' : ''}>Philosophy</a>
                        <a href="#join-us" className={activeSection === 'join-us' ? 'active' : ''}>Join us</a>
                    </div>
                    
                    <button 
                        onClick={toggleTheme} 
                        className="theme-toggle"
                        aria-label="Toggle theme"
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={theme}
                                initial={{ y: -10, opacity: 0, rotate: -45 }}
                                animate={{ y: 0, opacity: 1, rotate: 0 }}
                                exit={{ y: 10, opacity: 0, rotate: 45 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </motion.div>
                        </AnimatePresence>
                    </button>

                    <img 
                        src="/mk-logo-300.png" 
                        alt="Mahbere Kidusan Logo" 
                        style={{ height: '44px', width: 'auto', marginLeft: '0.5rem' }} 
                    />
                </div>
            </div>
        </nav>
    );
};
