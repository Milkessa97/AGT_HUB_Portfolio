import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { MembersPortal } from './pages/MembersPortal';
import { PortalGateway } from './components/PortalGateway';

export default function App() {
  const [authorizedEmail, setAuthorizedEmail] = useState<string | null>(() => {
    return localStorage.getItem('portal_auth_email');
  });

  const handleAuthorized = (email: string) => {
    setAuthorizedEmail(email);
    localStorage.setItem('portal_auth_email', email);
  };

  return (
    <Routes>
      {/* Public Portfolio Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Restricted Portal Route */}
      <Route 
        path="/portal" 
        element={
          authorizedEmail ? (
            <MembersPortal />
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
