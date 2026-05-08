import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { googleSheetsService } from '../services/googleSheets';
import { Member } from '../types';
import { StarField } from '../components/StarField';
import { Search, Github, Globe, Mail, ChevronRight, UserCircle2, ExternalLink, Sun, Moon } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  index: number;
  key:string;
}

interface MembersPortalProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export function MembersPortal({ theme, toggleTheme }: MembersPortalProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    // Force body styles for scrolling
    document.body.style.overflow = 'auto';
    document.documentElement.style.scrollSnapType = 'none';
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
    document.body.classList.add('portal-active');
    
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

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.scrollSnapType = '';
      document.documentElement.style.height = '';
      document.body.style.height = '';
      document.body.classList.remove('portal-active');
    };
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
      <div className="portal-bg-overlay">
        <StarField />
      </div>
      
      <nav className="portal-nav">
        <div className="container-fluid nav-content">
          <a href="/" className="nav-logo-link">
            <img 
              src={theme === 'dark' ? "/AGT_HUB_Logo.png" : "/AGT_HUB_Logo_dark.png"} 
              alt="Logo" 
              style={{ width: '160px', height: '160px', transition: 'opacity 0.3s ease' }} 
            />
          </a>

          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={() => window.location.href = '/'} className="btn-back">
              Return to Portfolio
            </button>
            
            <button 
                onClick={toggleTheme} 
                className="theme-toggle"
                aria-label="Toggle theme"
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

            <img 
                src="/mk-logo-300.png" 
                alt="Mahbere Kidusan Logo" 
                style={{ height: '44px', width: 'auto' }} 
            />
          </div>
        </div>
      </nav>

      <main className="container portal-main">
        <div className="portal-header-row">
          <div className="portal-title-area">
             <h2 className="cinzel gold-text">Active Talents</h2>
             <p className="mono text-xs" style={{ opacity: 0.6 }}>{filteredMembers.length} Contributors found in Sacred Archives</p>
          </div>

          <div className="portal-controls">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search talents..." 
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
        </div>

        <div className="members-grid">
          {isLoading ? (
            [...Array(6)].map((_, i) => <div key={i} className="member-skeleton" />)
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredMembers.map((member, index) => (
                <MemberCard key={member.id || `member-${index}`} member={member} index={index} />
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
          background: var(--bg);
          color: var(--text-primary);
          padding-top: 140px;
          padding-bottom: 100px;
          position: relative;
          z-index: 1;
        }

        .portal-bg-overlay {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        .portal-bg-overlay #starField {
          position: fixed !important;
        }

        .portal-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: color-mix(in srgb, var(--bg), transparent 10%);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-muted);
          z-index: 1000;
          display: flex;
          align-items: center;
        }

        .nav-logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .gold-text {
          color: var(--gold);
        }

        .btn-back {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: var(--gold);
          color: var(--gold);
          background: var(--gold-glow);
        }

        .portal-main {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .portal-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 4rem;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .portal-title-area h2 {
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .portal-controls {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-bar {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-bar input {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border-muted);
          border-radius: 8px;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          color: var(--text-primary);
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .search-bar input:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 15px var(--gold-glow);
        }

        .filter-chips {
          display: flex;
          gap: 0.5rem;
        }

        .chip {
          background: var(--surface);
          border: 1px solid var(--border-muted);
          color: var(--text-secondary);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .chip:hover {
          border-color: var(--gold);
        }

        .chip.active {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--bg);
        }

        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 2rem;
        }

        .member-skeleton {
          height: 450px;
          background: var(--surface);
          border-radius: 4px;
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        .empty-state {
          text-align: center;
          padding: 5rem;
          color: var(--text-muted);
          border: 1px dashed var(--border-muted);
          border-radius: 8px;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .portal-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }
          .search-bar {
            width: 100%;
          }
          .filter-chips {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          .members-grid {
            grid-template-columns: 1fr;
          }
          .nav-logo-link img {
            width: 120px !important;
            height: 120px !important;
          }
        }
      `}</style>
    </div>
  );
}

function MemberCard({ member, index }: MemberCardProps) {
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
      className="project-card member-portal-card"
      onMouseMove={handleMouseMove}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="member-card-image">
        {member.image ? (
          <img src={member.image} alt={member.name} />
        ) : (
          <div className="avatar-placeholder">
            <UserCircle2 size={64} strokeWidth={1} />
          </div>
        )}
        <div className="member-card-badge">
           <span className={`status-dot ${member.availability.toLowerCase()}`} />
           <span className="mono text-xs">{member.availability}</span>
        </div>
      </div>

      <div className="project-category" style={{ marginBottom: '0.5rem' }}>{member.role}</div>
      <h3 className="cinzel">{member.name}</h3>
      
      <div className="member-contributions-list">
        {member.contributions.slice(0, 3).map((c, i) => (
          <div key={i} className="contribution-item">
            <ChevronRight size={12} className="gold-text" />
            <span>{c}</span>
          </div>
        ))}
      </div>

      <div className="tag-pills" style={{ marginTop: '1.25rem' }}>
        {member.skills.slice(0, 5).map(skill => (
          <span key={skill} className="tag mono">{skill}</span>
        ))}
      </div>

      <div className="project-links" style={{ marginTop: '2.5rem' }}>
        {member.github_url && (
          <a href={member.github_url} target="_blank" rel="noreferrer" className="project-link">
            <Github size={14} /> Code
          </a>
        )}
        {member.portfolio_url && (
          <a href={member.portfolio_url} target="_blank" rel="noreferrer" className="project-link">
            <ExternalLink size={14} /> Portfolio
          </a>
        )}
        {member.contact && (
          <a href={`mailto:${member.contact}`} className="project-link">
            <Mail size={14} /> Contact
          </a>
        )}
      </div>

      <style>{`
        .member-portal-card {
          padding: 2rem !important;
          cursor: default !important;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .member-card-image {
          position: relative;
          width: 100%;
          height: 240px;
          border-radius: 4px;
          overflow: hidden;
          background: var(--surface-elevated);
          margin-bottom: 2rem;
          border: 1px solid var(--border-muted);
        }

        .member-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s var(--expo-out);
        }

        .member-portal-card:hover .member-card-image img {
          transform: scale(1.08);
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          opacity: 0.3;
        }

        .member-card-badge {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: color-mix(in srgb, var(--bg), transparent 15%);
          backdrop-filter: blur(12px);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: 1px solid var(--border-muted);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .status-dot.available { background: #22c55e; box-shadow: 0 0 10px #22c55e; }
        .status-dot.employed { background: #64748b; }
        .status-dot.freelance { background: #3b82 Cameronf6; box-shadow: 0 0 10px #3b82f6; }

        .member-contributions-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin: 1.5rem 0;
        }

        .contribution-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </motion.div>
  );
}
