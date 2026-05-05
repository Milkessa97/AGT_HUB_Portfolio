import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink } from 'lucide-react';
import { Winner } from '../types';

export const WinnerVignette: React.FC<{ winner: Winner; index: number }> = ({ winner, index }) => {
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
      <motion.div
        className="winner-vignette"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, scale: 1.02 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ 
          duration: 1, 
          delay: index * 0.1, 
          ease: [0.16, 1, 0.3, 1] 
        }}
      >
        <div className="winner-rank">
          <AnimatePresence mode="wait">
            {!imgError && winner.image && winner.image.trim() !== '' ? (
              <motion.img 
                key="image"
                src={winner.image} 
                alt={winner.name} 
                className="winner-img" 
                referrerPolicy="no-referrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: imgLoaded ? 1 : 0 }}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            ) : (
              <motion.div 
                key="placeholder"
                className="winner-img-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'var(--border-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '12px',
                  fontSize: '2.5rem',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-cinzel)'
                }}
              >
                {winner.name.charAt(0)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="winner-details">
          <div className="winner-award">{winner.award}</div>
          <h4 className="cinzel">{winner.name}</h4>
          <div className="mono" style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.7rem', letterSpacing: '0.1em' }}>{winner.category}</div>
          <p className="winner-quote">{winner.quote}</p>
          <div className="laureate-links">
            {winner.github_url && (
              <a href={winner.github_url} target="_blank" rel="noopener noreferrer" className="project-link">
                <Github size={14} />
                GitHub
              </a>
            )}
            {winner.portfolio_url && (
              <a href={winner.portfolio_url} target="_blank" rel="noopener noreferrer" className="project-link">
                <ExternalLink size={14} />
                Portfolio
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
};
