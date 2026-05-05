import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
    isScrolled: boolean;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isScrolled, theme, toggleTheme }) => {
    return (
        <nav id="navbar" style={{
            height: isScrolled ? '64px' : '72px'
        }}>
            <div className="container-fluid nav-content">
                <img 
                    src={theme === 'dark' ? "/AGT_HUB_Logo.png" : "/AGT_HUB_Logo_dark.png"} 
                    alt="Logo" 
                    style={{ width: '160px', height: '160px', transition: 'opacity 0.3s ease' }} 
                />
                <div className="nav-right">
                    <div className="nav-links">
                        <a href="#projects">Archives</a>
                        <a href="#winners">Laureates</a>
                        <a href="#journey">Chronology</a>
                        <a href="#about">Philosophy</a>
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
                </div>
            </div>
        </nav>
    );
};
