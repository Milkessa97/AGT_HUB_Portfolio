import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '../types';

export const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
    const cardRef = useRef<HTMLDivElement>(null);
  
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      cardRef.current.style.setProperty('--mouse-x', `${x}%`);
      cardRef.current.style.setProperty('--mouse-y', `${y}%`);
    };
  
    return (
      <motion.div
        ref={cardRef}
        className="project-card"
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -10, scale: 1.01 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        layout
      >
        <div className="project-category">{project.category}</div>
        <h3 className="cinzel">{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-pills">
          {project.tags.map((tag: string, i: number) => (
            <span key={`${tag}-${i}`} className="tag mono">{tag}</span>
          ))}
        </div>
        <div className="project-links">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link">
              <Github size={14} />
              Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="project-link">
              <ExternalLink size={14} />
              Demo
            </a>
          )}
        </div>
      </motion.div>
    );
};
