import type { MetadataRoute } from 'next';
import { absoluteUrl, isPreview } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return isPreview ? [] : [{ url: absoluteUrl('/') }];
}
