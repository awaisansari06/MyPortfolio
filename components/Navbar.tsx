'use client';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '@/context/ThemeContext';
import { useDialogFocus } from '@/hooks/useDialogFocus';
const links = ['Work', 'Stack', 'About', 'Contact'];
export const Navbar = () => {
 const { toggleTheme } = useTheme(); const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false);
 const menu = useRef<HTMLDivElement>(null);
 useDialogFocus(menu, open, () => setOpen(false), '#mobile-nav-toggle', false);
 useEffect(() => {
 const update = () => setScrolled(window.scrollY > 30);
 const resize = () => { if (window.innerWidth >= 900) setOpen(false); };
 update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', resize);
 return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', resize); };
 }, []);
 const ask = () => { setOpen(false); window.dispatchEvent(new Event('open-ask-ai')); };
 return <header id="main-navigation" className={`editorial-nav ${scrolled ? 'is-scrolled' : ''}`}>
 <a href="#hero" aria-label="Mohammad Awais — home" onClick={() => setOpen(false)}><BrandLogo priority/></a>
 <nav aria-label="Main navigation" className="desktop-navigation">{links.map(link => <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>)}</nav>
 <div className="nav-controls"><button className="theme-control" onClick={toggleTheme} aria-label="Toggle light and dark theme"><Sun className="hidden dark:block" size={17}/><Moon className="dark:hidden" size={17}/></button><button id="ask-ai-launcher" className="editorial-button nav-ai" onClick={ask}><span className="status-dot"/>Ask Awais AI <ArrowUpRight size={14}/></button><button id="mobile-nav-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="editorial-menu" className="menu-control" onClick={() => setOpen(!open)}>{open ? <X size={21}/> : <Menu size={21}/>}</button></div>
 {open && <div ref={menu} id="editorial-menu" role="dialog" aria-modal="false" aria-label="Navigation" className="editorial-menu" tabIndex={-1}><nav aria-label="Mobile navigation">{links.map((link, index) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}><span>0{index + 1}</span>{link}<ArrowUpRight size={18}/></a>)}</nav><button className="editorial-button primary" onClick={ask}>Ask Awais AI <ArrowUpRight size={16}/></button><p>Have something in mind? Let’s build it.</p></div>}
 </header>;
};
