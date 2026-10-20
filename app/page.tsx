import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import { buildProfileStructuredData, serializeStructuredData } from '@/lib/structuredData';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SelectedWork } from '@/components/SelectedWork';
import { TechStack } from '@/components/TechStack';
import { About } from '@/components/About';
import { GitHubContributions } from '@/components/github/GitHubContributions';
import { Contact } from '@/components/Contact';
import { AskAwaisChat } from '@/components/ai/AskAwaisChat';
export const metadata: Metadata = { alternates: { canonical: absoluteUrl('/') } };
export default function Home() {
 return <main id="portfolio-scroll" className="editorial-page"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeStructuredData(buildProfileStructuredData()) }}/><a className="portfolio-skip-link" href="#work">Skip to selected work</a><Navbar/><Hero/><SelectedWork/><TechStack/><About/><section id="contact" className="editorial-section activity-contact" aria-labelledby="contact-heading"><p className="eyebrow">05 / Activity & contact</p><GitHubContributions/><Contact/></section><AskAwaisChat/></main>;
}
