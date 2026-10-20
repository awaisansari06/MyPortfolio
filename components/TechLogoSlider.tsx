'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { TechIcon } from './TechIcon';

const technologies = ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'Google Gemini', 'Git'];

export function TechLogoSlider() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="tech-slider" data-paused={paused}>
      <div className="tech-slider-caption">
        <p className="eyebrow">My everyday toolkit</p>
        <button type="button" className="slider-pause" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play technology slider' : 'Pause technology slider'} aria-pressed={paused}>
          {paused ? <Play size={13} /> : <Pause size={13} />}<span>{paused ? 'Play' : 'Pause'}</span>
        </button>
      </div>
      <div className="tech-slider-window">
        <div className="tech-slider-track">
          {[0, 1].map(copy => (
            <ul className="tech-logo-sequence" key={copy} aria-label={copy === 0 ? 'Core technologies' : undefined} aria-hidden={copy === 1 ? true : undefined}>
              {technologies.map(name => <li className="tech-logo" key={name} data-tech={name}><span aria-hidden="true"><TechIcon name={name} className="slider-logo-icon" size={38} /></span><span>{name}</span></li>)}
            </ul>
          ))}
        </div>
      </div>
      <p className="tech-slider-note">The tools change. The attention to detail stays.</p>
    </div>
  );
}
