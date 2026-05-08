import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { googleSheetsService } from '../services/googleSheets';
import { Member } from '../types';
import { StarField } from '../components/StarField';
import { Search, Filter, Github, Globe, Mail, ChevronRight, UserCircle2, Briefcase, Award } from 'lucide-react';

export function MembersPortal() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await googleSheetsService.getMembers();
        setMembers(data);
      } catch (err) {
        console.error('Failed to load members:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, []);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = activeFilter === 'All' || m.availability === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="members-portal">
      <StarField />
      
      <header className="portal-nav">
        <div className="container">
          <div className="nav-brand">
            <span className="cinzel gold-text">AGT HUB</span>
            <span className="nav-divider">/</span>
            <span className="mono text-xs">TALENT ARCHIVE</span>
          </div>
          <button onClick={() => window.location.href = '/'} className="btn-back">
            Return to Portfolio
          </button>
        </div>
      </header>

      <main className="container portal-main">
        <section className="portal-hero">
          <motion.h1 
            className="cinzel section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Digital Talents Archive
          </motion.h1>
          <p className="section-subtitle">A curated list of our most active contributors and their specialized skillsets.</p>
        </section>

        <div className="portal-controls">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, role, or skill..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-chips">
            {['All', 'Available', 'Employed', 'Freelance'].map(filter => (
              <button 
                key={filter}
                className={`chip ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="members-grid">
          {isLoading ? (
            [...Array(6)].map((_, i) => <div key={i} className="member-skeleton" />)
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredMembers.map((member, index) => (
                <motion.div 
                  key={member.id || index}
                  className="member-card"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="member-header">
                    <div className="member-avatar">
                      {member.image ? (
                        <img src={member.image} alt={member.name} />
                      ) : (
                        <UserCircle2 size={48} strokeWidth={1} />
                      )}
                    </div>
                    <div className="member-status">
                      <span className={`status-dot ${member.availability.toLowerCase()}`} />
                      <span className="mono text-xs">{member.availability}</span>
                    </div>
                  </div>

                  <div className="member-info">
                    <h3 className="cinzel">{member.name}</h3>
                    <p className="role-text">{member.role}</p>
                  </div>

                  <div className="member-tags">
                    {member.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="skill-tag">{skill}</span>
                    ))}
                    {member.skills.length > 4 && <span className="skill-tag">+{member.skills.length - 4}</span>}
                  </div>

                  <div className="member-contributions">
                    <div className="section-label">
                      <Briefcase size={14} />
                      <span>Key Contributions</span>
                    </div>
                    <ul>
                      {member.contributions.map((c, i) => (
                        <li key={i}><ChevronRight size={12} /> {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="member-footer">
                    <div className="social-links">
                      {member.github_url && <a href={member.github_url} target="_blank" rel="noreferrer"><Github size={18} /></a>}
                      {member.portfolio_url && <a href={member.portfolio_url} target="_blank" rel="noreferrer"><Globe size={18} /></a>}
                      {member.contact && <a href={`mailto:${member.contact}`}><Mail size={18} /></a>}
                    </div>
                    <button className="btn-details">View Full Profile</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!isLoading && filteredMembers.length === 0 && (
          <div className="empty-state">
            <p>No members match your current search or filter.</p>
          </div>
        )}
      </main>

      <style>{`
        .members-portal {
          min-height: 100vh;
          background: #020202;
          color: white;
          padding-top: 80px;
          padding-bottom: 100px;
        }

        .portal-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          z-index: 100;
          display: flex;
          align-items: center;
        }

        .portal-nav .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-divider {
          opacity: 0.2;
          font-weight: 300;
        }

        .btn-back {
          background: none;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: var(--gold);
          color: var(--gold);
        }

        .portal-main {
          max-width: 1200px;
          margin: 0 auto;
        }

        .portal-hero {
          text-align: center;
          margin-bottom: 4rem;
        }

        .portal-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .search-bar {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
        }

        .search-bar input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 1rem 1rem 1rem 3.5rem;
          color: white;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--gold);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .filter-chips {
          display: flex;
          gap: 0.75rem;
        }

        .chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-secondary);
          padding: 0.6rem 1.2rem;
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .chip:hover {
          border-color: rgba(255,255,255,0.3);
        }

        .chip.active {
          background: var(--gold);
          border-color: var(--gold);
          color: black;
          font-weight: 600;
        }

        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .member-card {
          background: rgba(20, 20, 20, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .member-card:hover {
          transform: translateY(-10px);
          border-color: rgba(212, 175, 55, 0.3);
          background: rgba(30, 30, 30, 0.6);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .member-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .member-avatar {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
        }

        .member-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .member-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          background: rgba(0,0,0,0.3);
          border-radius: 8px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.available { background: #22c55e; box-shadow: 0 0 10px #22c55e; }
        .status-dot.employed { background: #64748b; }
        .status-dot.freelance { background: #3b82f6; box-shadow: 0 0 10px #3b82f6; }

        .member-info h3 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .role-text {
          color: var(--gold);
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .member-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .skill-tag {
          padding: 0.3rem 0.6rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .member-contributions {
          background: rgba(0,0,0,0.2);
          padding: 1.25rem;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }

        .member-contributions ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .member-contributions li {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .member-footer {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          color: var(--text-secondary);
          transition: color 0.2s;
        }

        .social-links a:hover {
          color: var(--gold);
        }

        .btn-details {
          background: none;
          border: none;
          color: var(--gold);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-details:hover {
          opacity: 0.7;
        }

        .member-skeleton {
          height: 450px;
          background: rgba(255,255,255,0.03);
          border-radius: 24px;
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }

        .empty-state {
          text-align: center;
          padding: 5rem;
          color: var(--text-secondary);
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: 24px;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .portal-controls {
            flex-direction: column;
            align-items: stretch;
          }
          .members-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
