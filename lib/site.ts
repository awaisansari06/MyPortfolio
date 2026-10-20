export const site = {
  url: 'https://buildbyawais.tech',
  name: 'Mohammad Awais Ansari',
  alternateNames: ['Awais Ansari', 'Mohammad Awais'],
  title: 'Mohammad Awais Ansari | Full-Stack & AI Developer',
  description: 'Mohammad Awais Ansari (Awais Ansari) is a full-stack developer in Virar, India, building web apps and AI integrations. Explore BuildStack, CareerWise, and TripCraft.',
};

export const isPreview = process.env.VERCEL_ENV === 'preview';

export function absoluteUrl(path: string) {
  return new URL(path, site.url).toString();
}
