export const site = {
  url: 'https://www.awaisansari.tech',
  name: 'Mohammad Awais Ansari',
  alternateNames: ['Awais Ansari', 'Mohammad Awais'],
  title: 'Awais Ansari | Full-Stack Developer & AI Engineer | Next.js • React • TypeScript • Python | Generative AI | Building AI-Powered Web Apps',
  description: 'Awais Ansari (Mohammad Awais Ansari) is a software and full-stack developer based in Virar, Mumbai Metropolitan Region, building web apps and AI integrations.',
};

export const isPreview = process.env.VERCEL_ENV === 'preview';

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}
