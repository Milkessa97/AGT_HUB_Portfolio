import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Linkedin, Send as Telegram, CheckCircle2 } from 'lucide-react';

export const JoinFrontier = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation: Check for at least two words
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = 'Full name is required';
    } else if (nameTrimmed.split(/\s+/).length < 2) {
      newErrors.name = 'Please enter your full name (first and last name)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us a bit about your mission';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Your message is a bit too short';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('submitting');

    try {
      // In a real scenario, this would be a Google Apps Script URL or similar backend endpoint
      const SCRIPT_URL = import.meta.env.VITE_SUBMISSION_SCRIPT_URL;
      
      if (SCRIPT_URL) {
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors', // For Google Apps Script
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            timestamp: new Date().toISOString()
          })
        });
        setStatus('success');
      } else {
        // Fallback/Demo mode if URL is missing
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Form submitted (demo mode):', formData);
        setStatus('success');
      }

      // Reset form after 6 seconds on success to allow time to read email notice
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', email: '', role: 'Developer', message: '' });
        setErrors({});
      }, 6000);

    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  return (
    <section className="join-frontier-section" id="join-us">
      <div className="container">
        <div className="join-grid">
          <motion.div 
            className="join-content"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title cinzel">Join the Frontier</h2>
            <p className="section-subtitle">
              We are inviting developers, designers, and visionaries to collaborate on the future of the Church's digital presence.
            </p>
            
            <div className="join-socials">
              <a href="https://www.linkedin.com/company/agt-hub/" target="_blank" rel="noopener noreferrer" className="social-link-gold">
                <Linkedin size={20} />
                <span>LinkedIn</span>
              </a>
              <a href="https://t.me/AGT_HUB" target="_blank" rel="noopener noreferrer" className="social-link-gold">
                <Telegram size={20} />
                <span>Telegram Community</span>
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="join-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="minimalist-form" noValidate>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className={errors.name ? 'error' : ''}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value});
                    if (errors.name) setErrors({...errors, name: ''});
                  }}
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="error-message"
                    >
                      {errors.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className={errors.email ? 'error' : ''}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="error-message"
                    >
                      {errors.email}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-group">
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Visionary">Visionary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <textarea 
                  placeholder="Tell us about your mission..."
                  className={errors.message ? 'error' : ''}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({...formData, message: e.target.value});
                    if (errors.message) setErrors({...errors, message: ''});
                  }}
                />
                <AnimatePresence>
                  {errors.message && (
                    <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="error-message"
                    >
                      {errors.message}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    className="success-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className="success-modal"
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                      <div className="modal-icon-wrapper">
                        <CheckCircle2 size={48} color="var(--gold)" />
                        <div className="icon-pulse" />
                      </div>
                      <h3 className="cinzel">Transmission Received</h3>
                      <p>
                        Your mission has been acknowledged. A welcome email is currently being transmitted to <strong>{formData.email}</strong>.
                      </p>
                      <div className="modal-footer mono">
                        <span>ESTABLISHING CONNECTION...</span>
                        <div className="loading-bar">
                          <motion.div 
                            className="loading-bar-fill"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                          />
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline" 
                        onClick={() => setStatus('idle')}
                        style={{ marginTop: '2rem', width: '100%' }}
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                className={`btn btn-filled submit-btn ${status}`}
                disabled={status === 'submitting' || status === 'success'}
              >
                <AnimatePresence mode="wait">
                  {status === 'submitting' ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      Sending...
                    </motion.span>
                  ) : status === 'success' ? (
                    <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-center gap-2">
                      <CheckCircle2 size={18} /> Sent
                    </motion.span>
                  ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-center gap-2">
                      <Send size={18} /> Submit Application
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
