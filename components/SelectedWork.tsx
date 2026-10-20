'use client';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData, type ProjectCaseStudy } from '@/data/portfolio';
import { projectImages } from '@/lib/projectImages';
import { ProjectModal } from './ProjectModal';
import { useEditorialMotion } from '@/hooks/useEditorialMotion';

const projectPresentation = [
  { id: 'buildstack', name: 'BuildStack', category: 'AI application builder', description: 'Turn natural-language prompts into web applications with AI agents and live previews.' },
  { id: 'careerwise', name: 'CareerWise', category: 'Career preparation', description: 'AI-powered career preparation, from résumé feedback to interview practice and career roadmaps.' },
  { id: 'tripcraft', name: 'TripCraft', category: 'Travel planning', description: 'Personalized travel itineraries, connected to real places and interactive maps.' },
];

export const SelectedWork = () => {
  const [active, setActive] = useState<ProjectCaseStudy | null>(null);
  const ref = useRef<HTMLElement>(null);
  useEditorialMotion(ref);
  return (
    <section id="work" className="editorial-section" ref={ref} aria-labelledby="work-heading">
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow">02 / Selected work</p><h2 id="work-heading">Ideas, made real.</h2></div>
        <p>From a problem worth solving<br />to a product you can explore.</p>
      </div>
      <div className="work-grid">
        {projectPresentation.map((presentation, index) => {
          const project = portfolioData.projects.find(project => project.id === presentation.id);
          if (!project) return null;
          const images = projectImages[project.id as keyof typeof projectImages];
          return (
            <article key={project.id} className={`work-card ${index === 0 ? 'work-featured' : ''}`} data-reveal>
              <button className="work-image" onClick={() => setActive(project)} aria-label={`Read ${presentation.name} case study`}>
                <span className="project-browser" aria-hidden="true"><span className="browser-dots"><i /><i /><i /></span><span>{presentation.name} / Product preview</span><ArrowUpRight size={12} /></span>
                <span className="project-screen">
                  <Image src={images.dark} alt={`${presentation.name} application screenshot in dark mode`} className="hidden dark:block" sizes={index === 0 ? '(min-width: 1440px) 760px, (min-width: 900px) 57vw, 90vw' : '(min-width: 1440px) 580px, (min-width: 600px) 43vw, 90vw'} />
                  <Image src={images.light} alt={`${presentation.name} application screenshot in light mode`} className="dark:hidden" sizes={index === 0 ? '(min-width: 1440px) 760px, (min-width: 900px) 57vw, 90vw' : '(min-width: 1440px) 580px, (min-width: 600px) 43vw, 90vw'} />
                </span>
                <span className="image-open"><ArrowUpRight size={20} /></span>
              </button>
              <div className="work-copy">
                <p className="eyebrow"><span className="project-index">0{index + 1}</span>{presentation.category}</p>
                <h3>{presentation.name}</h3>
                <p>{presentation.description}</p>
                <div className="project-tech">{(project.compactTechnologies || project.technologies).filter(tech => /next\.js|postgresql|gemini|e2b|convex|mapbox/i.test(tech)).slice(0, 3).map(tech => <span key={tech}>{tech}</span>)}</div>
                <div className="project-links">
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={14} /></a>
                  <button onClick={() => setActive(project)}>Case study <ArrowUpRight size={14} /></button>
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
};
