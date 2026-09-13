'use client';

import React, { useEffect, useRef, useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Mail, Github, Linkedin, MapPin, ArrowUp, Send, Check, Copy, ArrowUpRight } from 'lucide-react';
import { gsap, isReducedMotion } from '@/lib/motion';

export const Contact = () => {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      tl.from('.contact-header', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      })
        .from(
          '.contact-statement',
          {
            y: 24,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.out',
          },
          '-=0.3'
        )
        .from(
          '.contact-info',
          {
            y: 20,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out',
            clearProps: 'all',
          },
          '-=0.25'
        )
        .from(
          '.contact-form',
          {
            y: 20,
            opacity: 0,
            duration: 0.55,
            ease: 'power2.out',
            clearProps: 'all',
          },
          '-=0.35'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formState.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `${formState.message}\n\n---\nSender: ${formState.name}\nEmail: ${formState.email}`
    );
    window.location.href = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section ref={containerRef} id="contact" className="pt-24 md:pt-36 bg-neutral-100/60 dark:bg-[#070707] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="contact-header flex flex-col md:flex-row md:items-end justify-between pb-8 mb-16 border-b border-neutral-300 dark:border-[#2A2A2A]">
          <div>
            <div className="font-mono-code text-[11px] text-neutral-500 dark:text-[#A3A3A3] tracking-[0.25em] uppercase mb-2">
              07 / DIRECT INQUIRIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase">
              CONTACT
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3] max-w-sm leading-relaxed">
            Open to software engineering opportunities, collaborations and interesting projects.
          </p>
        </div>

        {/* Big Statement */}
        <div className="contact-statement mb-20">
          <h3 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 dark:text-[#F5F3EF] uppercase leading-[0.95] max-w-4xl">
            LET&apos;S BUILD SOMETHING TOGETHER.
          </h3>
          <p className="mt-6 text-base sm:text-lg text-neutral-600 dark:text-[#A3A3A3] max-w-2xl leading-relaxed font-normal">
            Whether you are discussing full-stack opportunities, AI applications, or software engineering collaborations — feel free to reach out.
          </p>
        </div>

        {/* Contact Layout: Left Info, Right Minimal Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-24 border-b border-neutral-300 dark:border-[#2A2A2A]">
          {/* Left Contact Options */}
          <div className="contact-info lg:col-span-5 space-y-6">
            {/* Email Card with Copy Trigger */}
            <div className="p-6 transition-all duration-300 liquid-glass-card-frame">
              <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase mb-2">
                <span>DIRECT EMAIL</span>
                <Mail className="w-3.5 h-3.5" />
              </div>
              <a
                href={`mailto:${portfolioData.email}`}
                className="text-base sm:text-lg font-bold text-neutral-950 dark:text-[#F5F3EF] hover:underline block break-all font-mono-code"
              >
                {portfolioData.email}
              </a>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`mailto:${portfolioData.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code cursor-pointer liquid-glass-btn-primary bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A]"
                >
                  <Mail className="w-3 h-3" />
                  <span>EMAIL ME</span>
                </a>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono-code cursor-pointer liquid-glass-btn-secondary text-neutral-900 dark:text-[#F5F3EF]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-neutral-500" />}
                  <span>{copied ? 'COPIED' : 'COPY EMAIL'}</span>
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={portfolioData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-5 flex flex-col justify-between transition-all duration-300 liquid-glass-card"
              >
                <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase">
                  <span>REPOSITORIES</span>
                  <Github className="w-4 h-4" />
                </div>
                <div className="mt-4 flex items-center justify-between font-mono-code text-xs font-semibold text-neutral-950 dark:text-[#F5F3EF]">
                  <span>GITHUB</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href={portfolioData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-5 flex flex-col justify-between transition-all duration-300 liquid-glass-card"
              >
                <div className="flex items-center justify-between font-mono-code text-[10px] text-neutral-400 dark:text-[#666666] uppercase">
                  <span>NETWORK</span>
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="mt-4 flex items-center justify-between font-mono-code text-xs font-semibold text-neutral-950 dark:text-[#F5F3EF]">
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>
            </div>

            {/* Location & Status */}
            <div className="p-5 flex items-center justify-between font-mono-code text-xs transition-all duration-300 liquid-glass-card">
              <div className="flex items-center gap-2 text-neutral-800 dark:text-[#A3A3A3]">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 dark:text-[#666666]" />
                <span>{portfolioData.location}</span>
              </div>
              <span className="font-medium flex items-center gap-1.5 liquid-glass-badge text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                OPEN TO OPPORTUNITIES
              </span>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="contact-form lg:col-span-7">
            <div className="p-8 transition-all duration-300 liquid-glass-card-frame">
              <div className="font-mono-code text-xs font-bold text-neutral-950 dark:text-[#F5F3EF] uppercase tracking-wider pb-4 mb-6 border-b border-neutral-300/60 dark:border-white/10">
                SEND AN INQUIRY
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <h4 className="font-mono-code text-sm font-bold text-neutral-950 dark:text-[#F5F3EF] uppercase">
                    EMAIL CLIENT OPENED
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-[#A3A3A3] font-mono-code max-w-sm mx-auto">
                    Your message draft has been prepared. If your email client did not open automatically, you can email me directly at{' '}
                    <a href={`mailto:${portfolioData.email}`} className="underline text-neutral-900 dark:text-[#F5F3EF]">
                      {portfolioData.email}
                    </a>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 font-mono-code text-xs uppercase cursor-pointer rounded-full border border-neutral-300/80 dark:border-[#333333] bg-white/50 dark:bg-[#181818]/50 text-neutral-900 dark:text-[#F5F3EF]"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-mono-code text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#A3A3A3] mb-2">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 text-neutral-950 dark:text-[#F5F3EF] text-sm font-mono-code placeholder:text-neutral-400 dark:placeholder:text-[#555555] liquid-glass-input"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#A3A3A3] mb-2">
                      YOUR EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@company.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3 text-neutral-950 dark:text-[#F5F3EF] text-sm font-mono-code placeholder:text-neutral-400 dark:placeholder:text-[#555555] liquid-glass-input"
                    />
                  </div>

                  <div>
                    <label className="block font-mono-code text-[11px] uppercase tracking-wider text-neutral-500 dark:text-[#A3A3A3] mb-2">
                      PROJECT OR INQUIRY DETAILS
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your project, team opportunity, or inquiry..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 text-neutral-950 dark:text-[#F5F3EF] text-sm font-mono-code resize-none placeholder:text-neutral-400 dark:placeholder:text-[#555555] liquid-glass-input"
                    />
                  </div>

                  <button
                    type="submit"
                    data-cursor="TRANSMIT"
                    className="w-full py-3.5 font-mono-code text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 cursor-pointer liquid-glass-btn-primary bg-neutral-950 dark:bg-[#F5F3EF] text-white dark:text-[#0A0A0A]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND MESSAGE VIA EMAIL</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- FOOTER ---------------- */}
        <footer className="py-12 flex flex-col md:flex-row items-center justify-between gap-6 font-mono-code text-xs text-neutral-500 dark:text-[#A3A3A3]">
          <div>
            <div className="font-bold text-neutral-950 dark:text-[#F5F3EF] uppercase tracking-wider">
              MOHAMMAD AWAIS ANSARI
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-[#666666] mt-0.5">
              FULL-STACK DEVELOPER · AI APPLICATIONS
            </div>
            <a
              href={`mailto:${portfolioData.email}`}
              className="text-[11px] text-neutral-600 dark:text-[#888888] hover:text-neutral-950 dark:hover:text-[#F5F3EF] hover:underline block mt-1 transition-colors"
            >
              {portfolioData.email}
            </a>
          </div>

          <div className="text-[11px] text-center md:text-left text-neutral-500 dark:text-[#666666]">
            BUILT WITH NEXT.JS · THREE.JS · TAILWIND CSS 
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={portfolioData.socials.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors"
            >
              GITHUB
            </a>
            <a
              href={portfolioData.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-950 dark:hover:text-[#F5F3EF] transition-colors"
            >
              LINKEDIN
            </a>
            <span>© 2026</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-neutral-900 dark:text-[#F5F3EF] hover:underline uppercase tracking-wider text-[11px] cursor-pointer"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
};
