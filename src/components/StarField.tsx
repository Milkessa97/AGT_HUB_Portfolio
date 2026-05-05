import React, { useEffect, useState } from 'react';

export const StarField: React.FC = () => {
    const [stars, setStars] = useState<{ id: number; size: number; x: number; y: number; duration: string; maxOpacity: number; isGold: boolean; delay: string }[]>([]);
  
    useEffect(() => {
      const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: `${Math.random() * 3 + 2}s`,
        delay: `${Math.random() * 5}s`,
        maxOpacity: Math.random() * 0.4 + 0.1,
        isGold: Math.random() > 0.8
      }));
      setStars(generatedStars);
    }, []);
  
    return (
      <div id="starField">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              background: star.isGold ? 'var(--gold)' : 'var(--star-color)',
              boxShadow: star.isGold ? '0 0 8px var(--gold)' : 'none',
              animationDelay: star.delay,
              // @ts-ignore
              '--duration': star.duration,
              '--max-opacity': star.maxOpacity
            }}
          />
        ))}
      </div>
    );
};
