import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StarField } from './components/StarField';
import { ProjectCard } from './components/ProjectCard';
import { WinnerVignette } from './components/WinnerVignette';
import { TimelineEntry } from './components/TimelineEntry';
import { TechStack } from './components/TechStack';
import { JoinFrontier } from './components/JoinFrontier';
import { ProjectSkeleton, WinnerSkeleton, TimelineSkeleton } from './components/Skeletons';
import { googleSheetsService } from './services/googleSheets';
import { Project, Winner, TimelineEvent } from './types';
import { MOCK_PROJECTS, MOCK_WINNERS, MOCK_EVENTS } from './constants';

export default function App() {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const [filter, setFilter] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);
  const [projects, setProjects] = useState<Project[]>(SHEET_ID ? [] : MOCK_PROJECTS);
  const [winners, setWinners] = useState<Winner[]>(SHEET_ID ? [] : MOCK_WINNERS);
  const [events, setEvents] = useState<TimelineEvent[]>(SHEET_ID ? [] : MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState(!!SHEET_ID);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch data from Google Sheets only if ID is provided
    const loadData = async () => {
      if (!SHEET_ID) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const [sheetProjects, sheetWinners, sheetEvents] = await Promise.all([
          googleSheetsService.getProjects(),
          googleSheetsService.getWinners(),
          googleSheetsService.getTimelineEvents()
        ]);

        const hasAnyData = sheetProjects.length > 0 || sheetWinners.length > 0 || sheetEvents.length > 0;
        
        if (hasAnyData) {
          if (sheetProjects.length > 0) setProjects(sheetProjects);
          else setProjects(MOCK_PROJECTS);
          
          if (sheetWinners.length > 0) setWinners(sheetWinners);
          else setWinners(MOCK_WINNERS);
          
          if (sheetEvents.length > 0) setEvents(sheetEvents);
          else setEvents(MOCK_EVENTS);
        } else {
          setError("No data found in your Google Sheets. Using fallback archives.");
          setProjects(MOCK_PROJECTS);
          setWinners(MOCK_WINNERS);
          setEvents(MOCK_EVENTS);
        }
      } catch (err: any) {
        console.error("Failed to load data from Google Sheets:", err);
        setError("Connection error. Using fallback archives.");
        setProjects(MOCK_PROJECTS);
        setWinners(MOCK_WINNERS);
        setEvents(MOCK_EVENTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [SHEET_ID]);

  const filteredProjects = projects.filter(p => filter === 'All' || p.category === filter);

  return (
    <div className="app">
      <Navbar isScrolled={isScrolled} theme={theme} toggleTheme={toggleTheme} />

      <main>
        <section className="hero" id="hero">
          <StarField />
          <div className="container-fluid hero-content">
            <motion.h1 
              className="cinzel"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              Sacred Tradition.<br /> Digital Frontier.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              መክሊታችንን ለቤተ ክርስትያናችን — Our talents for our Church. Turning gifts into service and vision into action at ASTU.
            </motion.p>
            <motion.div 
              className="hero-ctas"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="#projects" className="btn btn-filled">Explore Archives</a>
              <a href="#winners" className="btn btn-outline">Meet Laureates</a>
            </motion.div>

            <TechStack />
          </div>
        </section>

        <section className="projects" id="projects">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="section-title cinzel">Project Archives</h2>
              <p className="section-subtitle">A collection of solutions built for the Church and community.</p>
            </motion.div>

            <div className="filter-tabs">
              {['All', 'Web App', 'Mobile', 'Design', 'Other'].map(cat => (
                <button 
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'Other' ? 'Research' : cat === 'Web App' ? 'Web Apps' : cat}
                </button>
              ))}
            </div>
            
            {isLoading && projects.length === 0 ? (
              <div className="projects-grid">
                {[...Array(6)].map((_, i) => (
                  <ProjectSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {error && (
                  <div className="error-banner" style={{ 
                    padding: '1rem', 
                    background: 'rgba(255, 107, 107, 0.1)', 
                    border: '1px solid rgba(255, 107, 107, 0.2)',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    textAlign: 'center',
                    color: '#ff6b6b'
                  }}>
                    <p className="mono text-xs">{error}</p>
                    <p className="text-xs" style={{ opacity: 0.7 }}>Ensure your sheet is shared as "Anyone with the link can view"</p>
                  </div>
                )}
                <motion.div className="projects-grid" layout>
                  <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project, index) => (
                      <ProjectCard key={`${project.title}-${index}`} project={project} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>
        </section>

        <section className="winners" id="winners">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="section-title cinzel">The Laureates</h2>
              <p className="section-subtitle">Excellence honored in the Hall of Fame.</p>
            </motion.div>

            <div className="winners-grid">
              {isLoading && winners.length === 0 ? (
                [...Array(4)].map((_, i) => <WinnerSkeleton key={i} />)
              ) : (
                winners.map((winner, index) => (
                  <WinnerVignette key={`${winner.name}-${index}`} winner={winner} index={index} />
                ))
              )}
            </div>
          </div>
        </section>
          
        <section className="timeline-section" id="journey">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="section-title cinzel">Chronology</h2>
              <p className="section-subtitle">Our shared journey of innovation and faith.</p>
            </motion.div>
            <div className="timeline-grid">
              {isLoading && events.length === 0 ? (
                [...Array(3)].map((_, i) => <TimelineSkeleton key={i} />)
              ) : (
                events.map((event, index) => (
                  <TimelineEntry key={`${event.title}-${index}`} event={event} index={index} />
                ))
              )}
            </div>

            <motion.div 
              className="timeline-bottom-status"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="pulse-dot" />
              <div className="cooking-up-text mono">Planning next chapter...</div>
            </motion.div>
          </div>
        </section>

        <section className="about" id="about">
          <div className="container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="section-title cinzel">The Philosophy</h2>
              <p className="section-subtitle">መክሊታችንን ለቤተ ክርስትያናችን — Our talents for our Church.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p style={{ fontSize: '24px', color: 'var(--gold)', marginBottom: '2rem', fontStyle: 'italic' }}>
                "AGT Hub is a faith-driven platform built on the belief that every talent is a gift meant to serve a greater purpose."
              </p>
              <div style={{ maxWidth: '800px', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '2rem' }}>Inspired by the philosophy “መክሊታችንን ለቤተ ክርስትያናችን”, we bring together individuals who are ready to use their skills in creativity, technology, and leadership to strengthen and support the Church. We transform personal ability into collective impact—turning gifts into service and vision into action.</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="tag">ASTU Gibi Gubaie</span>
                  <span className="tag">Mahbere Kidusan</span>
                  <span className="tag">EOTC Community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        <JoinFrontier />
      </main>
            
      <Footer />
    </div>
  );
}
