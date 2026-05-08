import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'motion/react';
import { googleSheetsService } from '../services/googleSheets';
import { StarField } from './StarField';
import { Lock, ShieldAlert, Loader2 } from 'lucide-react';

interface PortalGatewayProps {
  onAuthorized: (email: string) => void;
}

export function PortalGateway({ onAuthorized }: PortalGatewayProps) {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse?.credential) {
      setError('No credential received from Google.');
      return;
    }

    setIsVerifying(true);
    setError(null);
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const userEmail = decoded.email?.toLowerCase();

      if (!userEmail) {
        throw new Error('Email not found in token');
      }

      const authorizedUsers = await googleSheetsService.getAuthorizedUsers();
      const isAuthorized = authorizedUsers.some(u => u.email === userEmail);

      if (isAuthorized) {
        onAuthorized(userEmail);
      } else {
        setError(`Access Denied: ${userEmail} is not on the authorized whitelist.`);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Verification failed. Please ensure your email is on the whitelist.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="portal-gateway">
      <StarField />
      
      <motion.div 
        className="gateway-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="gateway-header">
          <div className="icon-badge">
            {isVerifying ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <Lock size={32} />
            )}
          </div>
          <h1 className="cinzel">Sanctum Access</h1>
          <p>Exclusive portal for authorized job providers and partners.</p>
        </div>

        <div className="gateway-content">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Login failed. Please try again.')}
            theme="filled_black"
            shape="pill"
            text="signin_with"
          />

          {error && (
            <motion.div 
              className="gateway-error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ShieldAlert size={18} />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        <div className="gateway-footer">
          <p className="mono text-xs">Security powered by Google OAuth & AGT Hub Archives</p>
        </div>
      </motion.div>

      <style>{`
        .portal-gateway {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .gateway-card {
          width: 100%;
          max-width: 450px;
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          padding: 3rem;
          text-align: center;
          z-index: 10;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .icon-badge {
          width: 80px;
          height: 80px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: var(--gold);
        }

        .gateway-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(to bottom, #fff, #a1a1a1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gateway-header p {
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          font-size: 1rem;
        }

        .gateway-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .gateway-error {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 12px;
          color: #ef4444;
          font-size: 0.875rem;
          text-align: left;
        }

        .gateway-footer {
          margin-top: 3rem;
          opacity: 0.4;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
