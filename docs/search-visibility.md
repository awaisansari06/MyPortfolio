# Search visibility

The canonical website is **https://www.awaisansari.tech/**. The homepage includes server-rendered profile information, a canonical link, social previews, and linked `Person`, `ProfilePage`, and `WebSite` structured data. Name variations are tied to the same verified GitHub and LinkedIn profiles. The existing page content and project links are rendered in the initial HTML.

Production exposes `/robots.txt`, `/sitemap.xml`, and `/opengraph-image`. Vercel preview builds use `noindex` and do not advertise a sitemap. API routes are excluded from crawling. The sitemap contains the real homepage only; section fragments are not separate pages. No fabricated modification dates, ratings, or ranking claims are included.

## After deployment

1. Add `www.awaisansari.tech` as a Domain property in [Google Search Console](https://search.google.com/search-console) and verify it with the DNS TXT record Google provides. Alternatively, use a URL-prefix property and set `GOOGLE_SITE_VERIFICATION` to its HTML verification token before rebuilding.
2. Submit `https://www.awaisansari.tech/sitemap.xml`, inspect the homepage with URL Inspection, and request indexing.
3. Validate the deployed profile markup using [Google’s Rich Results Test](https://search.google.com/test/rich-results).
4. Point your GitHub profile, LinkedIn website field, and other genuine public profiles to this canonical domain. Use your real name consistently.
5. Check impressions, indexed pages, and name queries in Search Console over time. Publish genuine project updates when there is new work to share.

Ensure the domain resolves publicly over HTTPS without deployment protection. Redirect alternate domains to the canonical domain in your hosting settings. DNS, hosting redirects, and Search Console verification require access to those accounts and are not performed by this source change.

Neither structured data nor technical SEO guarantees crawling, AI citations, or a particular position. Google’s [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) recommends the same accessible, accurate, useful content as traditional search; special AI text files and keyword stuffing are unnecessary.

## Bing image-alt audit

The public homepage HTML inspected on 2026-10-30 contained 14 image elements: eight with descriptions, six with explicit empty alt attributes, and none without an alt attribute. The six empty values match the reported count, but Bing's individual image targets were not supplied:

- Light and dark logo variants: decorative inside the home link, which is already named “Mohammad Awais — home”.
- Three background portrait prints: decorative collage, hidden from assistive technology.
- Duplicate hero portrait: decorative navbar overlap, hidden from assistive technology; the main portrait has a description.

Keep these six empty alt values. Each image now also explicitly declares aria-hidden="true", in addition to its existing hidden container. Bing may continue reporting these intentional empty alternatives. Do not replace them with redundant descriptions to clear the notice.

Project dialog screenshots now describe the application and theme variant. The technology icons have names and adjacent labels; the repeated slider sequence is hidden. The generated Open Graph image exports its own alt metadata and contains no HTML img elements. CSS portrait backgrounds do not require HTML alt attributes.

Deploy the source changes before rechecking the public URL in Bing. Preserve https://www.awaisansari.tech/ as canonical. These changes do not guarantee indexing.

Verification: isolated production build succeeded. Its generated homepage HTML contains 14 images, zero missing alt attributes, and six intentionally empty alternatives, each explicitly aria-hidden. Lint, TypeScript, and all 30 tests passed.
