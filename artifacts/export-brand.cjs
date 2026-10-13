// Export sizes only: all artwork was created/edited with the built-in image tool.
const fs = require('node:fs/promises');
const sharp = require('sharp');

async function main() {
  const icons = {};
  for (const theme of ['dark', 'light']) {
    const icon = await sharp(`artifacts/logo-concepts/${theme}-icon.png`).resize(64, 64).png().toBuffer();
    await fs.writeFile(`public/brand/favicon-${theme}.png`, icon);
    icons[theme] = icon.toString('base64');
  }
  // File-based Next icon provides a theme-aware fallback before hydration / without JS.
  await fs.writeFile('app/icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><style>.dark{display:none}@media(prefers-color-scheme:dark){.light{display:none}.dark{display:block}}</style><image class="light" width="64" height="64" href="data:image/png;base64,${icons.light}"/><image class="dark" width="64" height="64" href="data:image/png;base64,${icons.dark}"/></svg>\n`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
