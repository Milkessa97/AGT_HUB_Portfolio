import React from 'react';

export const ProjectSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-category" />
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-text" style={{ width: '100%' }} />
    <div className="skeleton skeleton-text" style={{ width: '90%' }} />
    <div className="skeleton skeleton-text" style={{ width: '80%' }} />
    <div className="project-links" style={{ marginTop: 'auto' }}>
      <div className="skeleton skeleton-btn" />
      <div className="skeleton skeleton-btn" />
    </div>
  </div>
);

export const WinnerSkeleton = () => (
  <div className="skeleton skeleton-vignette" />
);

export const TimelineSkeleton = () => (
  <div className="timeline-entry" style={{ paddingBottom: '4rem' }}>
    <div className="skeleton" style={{ width: '100px', height: '14px', marginRight: '2.5rem' }} />
    <div className="timeline-marker skeleton" style={{ border: 'none', background: 'var(--surface-elevated)' }} />
    <div className="timeline-content">
      <div className="skeleton skeleton-title" style={{ width: '40%' }} />
      <div className="skeleton skeleton-text" style={{ width: '100%', marginBottom: '0.5rem' }} />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
    </div>
  </div>
);
