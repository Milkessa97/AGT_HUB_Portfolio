import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { MembersPortal } from './pages/MembersPortal';
import { PortalGateway } from './components/PortalGateway';

export default function App() {
  const [authorizedEmail, setAuthorizedEmail] = useState<string | null>(null);
  const location = useLocation();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Clear authentication if the user leaves the portal route
  useEffect(() => {
    if (location.pathname !== '/portal') {
      setAuthorizedEmail(null);
    }
  }, [location.pathname]);

  const handleAuthorized = (email: string) => {
    setAuthorizedEmail(email);
  };

  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />

      {/* Restricted Portal Route */}
      <Route 
        path="/portal" 
        element={
          authorizedEmail ? (
            <MembersPortal theme={theme} toggleTheme={toggleTheme} />
          ) : (
            <PortalGateway onAuthorized={handleAuthorized} />
          )
        } 
      />

      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
