'use client';
import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Copy, Check, Github, Linkedin, Mail } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { useEditorialMotion } from '@/hooks/useEditorialMotion';
export const Contact = () => {
 const [copied, setCopied] = useState(false);
 const [status, setStatus] = useState('');
 const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
 const ref = useRef<HTMLDivElement>(null); useEditorialMotion(ref);
 useEffect(() => () => { if(timer.current) clearTimeout(timer.current); }, []);
 const copy = async () => {
 try { await navigator.clipboard.writeText(portfolioData.email); setCopied(true); setStatus('Email copied.'); if(timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 2500); }
 catch { setStatus('Copy unavailable. You can select the email address above.'); }
 };
 const submit = (event: FormEvent<HTMLFormElement>) => {
 event.preventDefault(); const form = new FormData(event.currentTarget);
 const subject = encodeURIComponent(`Portfolio inquiry from ${form.get('name')}`);
 const body = encodeURIComponent(`${form.get('message')}\n\n---\nSender: ${form.get('name')}\nEmail: ${form.get('email')}`);
 window.location.href = `mailto:${portfolioData.email}?subject=${subject}&body=${body}`;
 setStatus('Your email app will open with your message. Send it there to complete your inquiry.');
 };
 return <div className="contact-finale" ref={ref}><div data-reveal><p className="eyebrow"><span className="status-dot"/>Open to opportunities</p><h2 id="contact-heading">Let’s build<br/>something <em>together.</em></h2><a className="editorial-button primary" href={`mailto:${portfolioData.email}`}>Get in touch <ArrowUpRight size={17}/></a></div><div className="contact-channels" data-reveal><p>Have a project, a question,<br/>or a good opportunity? Say hello.</p><div className="email-row"><a href={`mailto:${portfolioData.email}`}>{portfolioData.email}</a><button aria-label="Copy email address" onClick={copy}>{copied ? <Check size={16}/> : <Copy size={16}/>}</button></div><div className="social-links"><a href={portfolioData.socials.github} target="_blank" rel="noreferrer"><Github size={17}/>GitHub <ArrowUpRight size={13}/></a><a href={portfolioData.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin size={17}/>LinkedIn <ArrowUpRight size={13}/></a></div><details className="editorial-details contact-expand"><summary><span className="summary-label"><Mail size={15}/>Write a message</span><span>+</span></summary><form className="compact-contact-form" onSubmit={submit}><p>Compose here, then send with your email app.</p><label>Your name<input name="name" autoComplete="name" required maxLength={120}/></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>What do you have in mind?<textarea name="message" rows={4} required maxLength={5000}/></label><button className="editorial-button primary" type="submit">Continue to email <ArrowUpRight size={15}/></button></form></details><p className="contact-status" role="status">{status}</p></div><footer><span>© {new Date().getFullYear()} Mohammad Awais</span><span>Thoughtfully designed. Personally built.</span><a href="#hero">Back to top ↑</a></footer></div>;
};
