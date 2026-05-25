#!/usr/bin/env node
/**
 * render-png.mjs — Renderiza slides HTML em PNG 1080x1350
 *
 * Uso:
 *   node scripts/render-png.mjs <pasta-com-htmls> [--output <pasta-png>]
 *
 * Exemplo:
 *   node scripts/render-png.mjs carrosseis/png/p1-carrossel-04/
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Uso: node scripts/render-png.mjs <pasta-com-htmls>');
    process.exit(1);
  }

  const inputDir = path.resolve(args[0]);
  const outputDir = args.includes('--output')
    ? path.resolve(args[args.indexOf('--output') + 1])
    : inputDir;

  if (!fs.existsSync(inputDir)) {
    console.error(`✗ Pasta não encontrada: ${inputDir}`);
    process.exit(1);
  }

  const htmlFiles = fs.readdirSync(inputDir)
    .filter(f => f.endsWith('.html'))
    .sort();

  if (htmlFiles.length === 0) {
    console.error(`✗ Nenhum HTML encontrado em: ${inputDir}`);
    process.exit(1);
  }

  console.log(`\n🎨 Renderizando ${htmlFiles.length} slides → PNG 1080x1350`);
  console.log(`📁 Input: ${inputDir}`);
  console.log(`📁 Output: ${outputDir}\n`);

  // Criar server HTTP local para servir os HTMLs
  const server = http.createServer((req, res) => {
    // Servir desde a raiz do projeto de carrosséis para resolver caminhos relativos
    const basePath = path.resolve(inputDir, '../..');
    let filePath = path.join(basePath, decodeURIComponent(req.url));

    // Se pedir arquivo da pasta atual
    if (req.url.startsWith('/slide-')) {
      filePath = path.join(inputDir, decodeURIComponent(req.url));
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.css': 'text/css',
        '.js': 'application/javascript',
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found: ' + filePath);
    }
  });

  const PORT = 3099;
  await new Promise(resolve => server.listen(PORT, resolve));

  // Lançar browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });

  for (const file of htmlFiles) {
    const page = await context.newPage();
    const url = `http://localhost:${PORT}/slide-${file.replace('slide-', '')}`;

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      // Esperar fontes carregarem
      await page.waitForTimeout(1000);

      const pngName = file.replace('.html', '.png');
      const pngPath = path.join(outputDir, pngName);

      await page.screenshot({
        path: pngPath,
        type: 'png',
        clip: { x: 0, y: 0, width: 1080, height: 1350 },
      });

      const stats = fs.statSync(pngPath);
      console.log(`  ✓ ${pngName} (${Math.round(stats.size / 1024)}KB)`);
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }

    await page.close();
  }

  await browser.close();
  server.close();

  console.log(`\n✅ ${htmlFiles.length} PNGs renderizados em: ${outputDir}`);
}

main().catch(console.error);
