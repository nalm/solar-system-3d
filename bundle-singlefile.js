import fs from 'fs';
import path from 'path';

const distPath = path.resolve('./dist');
const html = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

const cssMatch = html.match(/href="\.\/assets\/([^"]+\.css)"/);
const jsMatch = html.match(/src="\.\/assets\/([^"]+\.js)"/);

if (cssMatch && jsMatch) {
  const css = fs.readFileSync(path.join(distPath, 'assets', cssMatch[1]), 'utf8');
  const js = fs.readFileSync(path.join(distPath, 'assets', jsMatch[1]), 'utf8');

  let standalone = html.replace(/<link rel="stylesheet"[^>]+>/, `<style>\n${css}\n</style>`);
  standalone = standalone.replace(/<script type="module"[^>]+><\/script>/, `<script type="module">\n${js}\n</script>`);

  fs.writeFileSync(path.resolve('./solar-system.html'), standalone);
  console.log(`solar-system.html generated! Size: ${(Buffer.byteLength(standalone, 'utf8') / 1024).toFixed(1)} KB`);
} else {
  console.error('Could not match assets in index.html');
}
