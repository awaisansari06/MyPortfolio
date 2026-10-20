'use client';

import Image from 'next/image';
import { ArrowUpRight, Download } from 'lucide-react';
import React, { useRef } from 'react';
import { useEditorialMotion } from '@/hooks/useEditorialMotion';

const photographs = [
  { image: '/portraits/editorial-profile.webp', className: 'photo-one' },
  { image: '/portraits/about-editorial.webp', className: 'photo-two' },
  { image: '/portraits/awais-cutout.webp', className: 'photo-three' },
];

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  useEditorialMotion(ref, true);

  return (
    <section ref={ref} id="hero" className="editorial-hero" aria-labelledby="hero-heading">
      <div className="portrait-composition" data-portrait>
        <div className="portrait-atmosphere" aria-hidden="true" />
        <div className="portrait-photographs" aria-hidden="true">
          {photographs.map(photo => (
            <div key={photo.image} className={`portrait-print ${photo.className}`}>
              <Image src={photo.image} alt="" width={400} height={533} sizes="170px" />
            </div>
          ))}
        </div>
        <div className="portrait-main" data-cutout data-parallax>
          <Image
            src="/portraits/hero-thoughtful.webp"
            alt="Mohammad Awais wearing a charcoal checked shirt with sunglasses resting on his hair"
            width={1448}
            height={1086}
            priority
            sizes="(min-width: 1440px) 920px, (min-width: 900px) 64vw, (min-width: 600px) 650px, 480px"
          />
        </div>
        <span className="portrait-signature" aria-hidden="true">Awais</span>
      </div>

      <div className="portrait-crown" aria-hidden="true">
        <div className="portrait-composition">
          <div className="portrait-main" data-cutout data-parallax>
            <Image src="/portraits/hero-thoughtful.webp" alt="" width={1448} height={1086} priority sizes="(min-width: 1440px) 920px, (min-width: 900px) 64vw, (min-width: 600px) 650px, 480px" />
          </div>
        </div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow" data-reveal><span />Full-stack developer / AI applications</p>
        <h1 id="hero-heading" data-reveal>
          <span>Mohammad</span>
          <strong>Awais</strong>
        </h1>
        <p className="hero-intro" data-reveal>
          I turn ideas into <em>useful web apps</em> —<br className="hero-desktop-break" />
          with AI where it matters.
        </p>
        <div className="editorial-actions" data-reveal>
          <a className="editorial-button primary" href="#work">
            Explore My Work <ArrowUpRight size={16} />
          </a>
          <a className="editorial-button" href="/AwaisCV.pdf" target="_blank" rel="noreferrer">
            Resume <Download size={15} />
          </a>
        </div>
        <div className="availability" data-reveal>
          <span className="status-dot" />Open to opportunities
          <span className="availability-divider" aria-hidden="true">·</span>
          <a href="#contact">Let’s connect <ArrowUpRight size={13} /></a>
        </div>
        <p className="hero-technologies" data-reveal>
          React <i /> Next.js <i /> TypeScript <i /> PostgreSQL
          <a href="#stack">+ more</a>
        </p>
      </div>
    </section>
  );
};
