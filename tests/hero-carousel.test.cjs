const assert = require('node:assert/strict');
const { test } = require('node:test');
const { loadSource, createReactHarness, findElement, icons } = require('./helpers.cjs');

function heroHarness() {
  const harness = createReactHarness();
  const projects = ['careerwise', 'buildstack', 'tripcraft'].map(id => ({ id, liveUrl: `https://${id}.example`, technologies: ['React', 'TypeScript', 'Next.js'] }));
  const { Hero } = loadSource('components/Hero.tsx', {
    react: harness.React,
    'next/image': 'image',
    'lucide-react': icons,
    '@/data/portfolio': { portfolioData: { projects } },
    '@/lib/projectImages': { projectImages: Object.fromEntries(projects.map(p => [p.id, { light: 'light.png', dark: 'dark.png' }])) },
    '@/lib/motion': { gsap: {}, MOTION_EASE: {} },
    '@/lib/scroll': { getScrollBehavior: () => 'instant' },
  });
  const render = () => harness.render(Hero);
  const carousel = tree => findElement(tree, el => el.props['aria-roledescription'] === 'carousel');
  const project = tree => findElement(tree, el => el.type === 'a' && el.props.target === '_blank' && el.props['aria-label']);
  return { render, carousel, project };
}

test('carousel arrows wrap and update the project destination', () => {
  const h = heroHarness();
  h.carousel(h.render()).props.onKeyDown({ key: 'ArrowLeft', preventDefault() {} });
  assert.equal(h.project(h.render()).props.href, 'https://tripcraft.example');
  h.carousel(h.render()).props.onKeyDown({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(h.project(h.render()).props.href, 'https://careerwise.example');
});

test('carousel swipes change project and suppress the resulting link click, while vertical scrolling does not', () => {
  const h = heroHarness();
  let c = h.carousel(h.render());
  c.props.onTouchStart({ touches: [{ clientX: 220, clientY: 100 }] });
  c.props.onTouchEnd({ changedTouches: [{ clientX: 80, clientY: 110 }] });
  assert.equal(h.project(h.render()).props.href, 'https://buildstack.example');
  let prevented = false;
  c.props.onClickCapture({ preventDefault() { prevented = true; }, stopPropagation() {} });
  assert.equal(prevented, true);
  c = h.carousel(h.render());
  c.props.onTouchStart({ touches: [{ clientX: 220, clientY: 100 }] });
  c.props.onTouchEnd({ changedTouches: [{ clientX: 200, clientY: 300 }] });
  assert.equal(h.project(h.render()).props.href, 'https://buildstack.example');
});
