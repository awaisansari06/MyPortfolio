# Search visibility

The canonical website is **https://buildbyawais.tech/**. The homepage includes server-rendered profile information, a canonical link, social previews, and linked `Person`, `ProfilePage`, and `WebSite` structured data. Name variations are tied to the same verified GitHub and LinkedIn profiles. The existing page content and project links are rendered in the initial HTML.

Production exposes `/robots.txt`, `/sitemap.xml`, and `/opengraph-image`. Vercel preview builds use `noindex` and do not advertise a sitemap. API routes are excluded from crawling. The sitemap contains the real homepage only; section fragments are not separate pages. No fabricated modification dates, ratings, or ranking claims are included.

## After deployment

1. Add `buildbyawais.tech` as a Domain property in [Google Search Console](https://search.google.com/search-console) and verify it with the DNS TXT record Google provides. Alternatively, use a URL-prefix property and set `GOOGLE_SITE_VERIFICATION` to its HTML verification token before rebuilding.
2. Submit `https://buildbyawais.tech/sitemap.xml`, inspect the homepage with URL Inspection, and request indexing.
3. Validate the deployed profile markup using [Google’s Rich Results Test](https://search.google.com/test/rich-results).
4. Point your GitHub profile, LinkedIn website field, and other genuine public profiles to this canonical domain. Use your real name consistently.
5. Check impressions, indexed pages, and name queries in Search Console over time. Publish genuine project updates when there is new work to share.

Ensure the domain resolves publicly over HTTPS without deployment protection. Redirect alternate domains to the canonical domain in your hosting settings. DNS, hosting redirects, and Search Console verification require access to those accounts and are not performed by this source change.

Neither structured data nor technical SEO guarantees crawling, AI citations, or a particular position. Google’s [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) recommends the same accessible, accurate, useful content as traditional search; special AI text files and keyword stuffing are unnecessary.
