'use client';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { TechLogoSlider } from './TechLogoSlider';
import { useEditorialMotion } from '@/hooks/useEditorialMotion';

const expertise = [
  ['Full-stack development', 'Connecting the interface, the API, and the data into one useful product.'],
  ['AI integrations', 'Practical model integrations with considered prompts and clear workflows.'],
  ['Frontend engineering', 'Responsive interfaces with attention to clarity, motion, and accessibility.'],
  ['Backend & databases', 'Authentication, data modeling, and dependable application systems.'],
];

export const TechStack = () => {
  const ref = useRef<HTMLElement>(null);
  useEditorialMotion(ref);
  return (
    <section id="stack" className="editorial-section stack-section" ref={ref} aria-labelledby="stack-heading">
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow">03 / Expertise & stack</p><h2 id="stack-heading">The craft behind<br />the experience.</h2></div>
        <p>Considered at every layer.<br />From the first interaction to the last query.</p>
      </div>
      <TechLogoSlider />
      <div className="stack-workbench">
        <div className="expertise-list">
          {expertise.map(([name, description], index) => <div className="expertise-row" key={name} data-reveal><span>0{index + 1}</span><div><h3>{name}</h3><p>{description}</p></div></div>)}
        </div>
      </div>
      <a href="#work" className="stack-work-link">See the tools in practice <ArrowUpRight size={14} /></a>
      <details className="editorial-details"><summary>Explore the complete toolkit <span>+</span></summary><div className="technology-details">{portfolioData.techCategories.map(category => <div key={category.title}><h3>{category.title}</h3><p>{category.skills.join(' · ')}</p></div>)}</div></details>
    </section>
  );
};
