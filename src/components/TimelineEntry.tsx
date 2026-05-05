import React from 'react';
import { motion } from 'motion/react';
import { TimelineEvent } from '../types';

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    // Handle Google Sheets Gviz format: Date(2024,8,1) or DATE(2024,9,1)
    const gvizMatch = dateStr.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/i);
    if (gvizMatch) {
      const year = parseInt(gvizMatch[1]);
      const month = parseInt(gvizMatch[2]); 
      const day = parseInt(gvizMatch[3]);
      // Note: In Javascript Date, months are 0-11, which matches Gviz's JSON date output
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }).toUpperCase();
    }

    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr.toUpperCase();
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }).toUpperCase();
    } catch (e) {
      return dateStr.toUpperCase();
    }
  };

export const TimelineEntry: React.FC<{ event: TimelineEvent; index: number }> = ({ event, index }) => {
    return (
      <motion.div
        className="timeline-entry"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="timeline-date mono">{formatDate(event.date)}</div>
        <div className="timeline-marker" />
        <div className="timeline-content">
          <h4 className="cinzel">{event.title}</h4>
          <div className="tag mono" style={{ marginBottom: '1rem', background: 'var(--gold-glow)', borderColor: 'var(--border)', color: 'var(--gold)', width: 'fit-content', fontSize: '0.6rem', padding: '2px 8px' }}>{event.type}</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>{event.description}</p>
        </div>
      </motion.div>
    );
};
