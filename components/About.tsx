'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { useEditorialMotion } from '@/hooks/useEditorialMotion';

export const About = () => {
  const ref = useRef<HTMLElement>(null);
  useEditorialMotion(ref);
  return (
    <section id="about" className="editorial-section" ref={ref} aria-labelledby="about-heading">
      <div className="about-layout">
        <figure className="about-photograph" data-story-photo>
          <Image src="/portraits/about-personal.webp" alt="Mohammad Awais in a charcoal shirt, photographed in soft natural light" width={900} height={1125} sizes="(min-width: 900px) 390px, (min-width: 600px) 40vw, 90vw" />
          <figcaption><span>Beyond the screen</span><span>Virar, India ↗</span></figcaption>
        </figure>
        <div className="about-copy">
          <p className="eyebrow" data-reveal>04 / The person behind the work</p>
          <h2 id="about-heading" data-reveal>Curious by nature.<br />A builder by choice.</h2>
          <p data-reveal>I’m Mohammad Awais Ansari, also known as Awais Ansari, a software developer specializing in full-stack development, based in Virar, Maharashtra, in the Mumbai Metropolitan Region. I build web applications and practical AI integrations, from a first idea to something people can actually use.</p>
          <div className="about-story">
            <p data-reveal><span>01 / The curiosity</span>Computer science gives me the foundations. Building things is how I put them into practice.</p>
            <p data-reveal><span>02 / The craft</span>Thoughtful interfaces, dependable backend systems, and AI where it makes a useful difference.</p>
          </div>
          <div className="education-highlight" data-reveal><span>Still learning. Still building.</span><h3>{portfolioData.education[0].degree}</h3><p>{portfolioData.education[0].institution} · {portfolioData.education[0].year}</p></div>
          <a className="editorial-button" href="/AwaisCV.pdf" target="_blank" rel="noreferrer">View resume <ArrowUpRight size={15} /></a>
          <details className="editorial-details">
            <summary>Education & credentials <span>+</span></summary>
            <div className="credential-list">
              {portfolioData.education.map(item => <div key={item.degree}><h3>{item.degree}</h3><p>{item.institution} · {item.year}{item.score ? ` · ${item.score}` : ''}</p><p>{item.details}</p></div>)}
              {portfolioData.certifications.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.issuer} · {item.year}</p></div>)}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
};
