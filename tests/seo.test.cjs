const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource } = require('./helpers.cjs');

test('profile identity links resolve consistently to the real canonical domain', () => {
  const siteModule = loadSource('lib/site.ts');
  const { portfolioData } = loadSource('data/portfolio.ts');
  const { buildProfileStructuredData } = loadSource('lib/structuredData.ts', {
    '@/data/portfolio': { portfolioData }, './site': siteModule,
  });
  const graph = buildProfileStructuredData()['@graph'];
  const person = graph.find(node => node['@type'] === 'Person');
  const page = graph.find(node => node['@type'] === 'ProfilePage');
  assert.equal(person.url, 'https://buildbyawais.tech/');
  assert.equal(person.name, 'Mohammad Awais Ansari');
  assert.ok(person.alternateName.includes('Awais Ansari'));
  assert.deepEqual(person.sameAs, [portfolioData.socials.github, portfolioData.socials.linkedin]);
  assert.equal(page.mainEntity['@id'], person['@id']);
  assert.equal(person.mainEntityOfPage['@id'], page['@id']);
});

test('structured data cannot terminate its enclosing script element', () => {
  const { serializeStructuredData } = loadSource('lib/structuredData.ts', {
    '@/data/portfolio': {}, './site': {},
  });
  const value = { name: '</script><script>alert(1)</script>' };
  const json = serializeStructuredData(value);
  assert.ok(!json.includes('<'));
  assert.deepEqual(JSON.parse(json), value);
});

test('only the production homepage is advertised for indexing', () => {
  const siteModule = loadSource('lib/site.ts');
  for (const preview of [false, true]) {
    const dependency = { '@/lib/site': { ...siteModule, isPreview: preview } };
    const robots = loadSource('app/robots.ts', dependency).default();
    const sitemap = loadSource('app/sitemap.ts', dependency).default();
    assert.equal(robots.rules.disallow, preview ? '/' : '/api/');
    if (preview) {
      assert.deepEqual(sitemap, []);
      assert.equal(robots.sitemap, undefined);
    } else {
      assert.equal(robots.sitemap, 'https://buildbyawais.tech/sitemap.xml');
      assert.deepEqual(sitemap, [{ url: 'https://buildbyawais.tech/' }]);
    }
  }
});
