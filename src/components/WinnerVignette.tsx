import React from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink } from 'lucide-react';
import { Winner } from '../types';

export const WinnerVignette: React.FC<{ winner: Winner; index: number }> = ({ winner, index }) => {
    return (
      <motion.div
        className="winner-vignette"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, scale: 1.02 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="winner-rank">
          {winner.image && winner.image.trim() !== '' ? (
            <img 
              src={winner.image} 
              alt={winner.name} 
              className="winner-img" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  const placeholder = document.createElement('div');
                  placeholder.className = 'winner-img-placeholder';
                  placeholder.style.width = '100%';
                  placeholder.style.height = '100%';
                  placeholder.style.background = 'var(--border-muted)';
                  placeholder.style.display = 'flex';
                  placeholder.style.alignItems = 'center';
                  placeholder.style.justifyContent = 'center';
                  placeholder.style.borderRadius = '12px';
                  placeholder.style.fontSize = '2rem';
                  placeholder.style.color = 'var(--gold)';
                  placeholder.innerText = winner.name.charAt(0);
                  parent.appendChild(placeholder);
                }
              }}
            />
          ) : (
            <div className="winner-img-placeholder" style={{ 
              width: '100%', 
              height: '100%', 
              background: 'var(--border-muted)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '12px',
              fontSize: '2rem',
              color: 'var(--gold)'
            }}>
              {winner.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="winner-details">
          <div className="winner-award">{winner.award}</div>
          <h4 className="cinzel">{winner.name}</h4>
          <div className="mono" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{winner.category}</div>
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
