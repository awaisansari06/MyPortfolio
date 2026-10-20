import { portfolioData } from '@/data/portfolio';
import { absoluteUrl, site } from './site';

export function buildProfileStructuredData() {
  const personId = absoluteUrl('/#person');
  const pageId = absoluteUrl('/#profile');
  const websiteId = absoluteUrl('/#website');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person', '@id': personId,
        name: site.name, alternateName: site.alternateNames,
        url: absoluteUrl('/'), image: absoluteUrl('/portraits/about-personal.webp'),
        description: site.description, jobTitle: 'Full-Stack Developer',
        homeLocation: { '@type': 'Place', name: portfolioData.location },
        sameAs: [portfolioData.socials.github, portfolioData.socials.linkedin],
        knowsAbout: ['Full-stack development', 'AI integrations', 'React', 'Next.js', 'TypeScript', 'PostgreSQL'],
        mainEntityOfPage: { '@id': pageId },
      },
      {
        '@type': 'ProfilePage', '@id': pageId, url: absoluteUrl('/'),
        name: site.title, description: site.description, inLanguage: 'en',
        mainEntity: { '@id': personId }, isPartOf: { '@id': websiteId },
      },
      {
        '@type': 'WebSite', '@id': websiteId, url: absoluteUrl('/'),
        name: `${site.name} — Developer Portfolio`, alternateName: 'Build by Awais',
        inLanguage: 'en', publisher: { '@id': personId },
      },
    ],
  };
}

/** Escape HTML delimiters before embedding JSON in a script element. */
export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
