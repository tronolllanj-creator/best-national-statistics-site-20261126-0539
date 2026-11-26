// This file hands in the Caldoria statistics site.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });

const appSrc = join(__dirname, 'app');
const appDst = join(outputDir, 'app');
cpSync(appSrc, appDst, { recursive: true });

const screenshotsSrc = join(__dirname, 'screenshots');
const screenshotsDst = join(outputDir, 'screenshots');
mkdirSync(screenshotsDst, { recursive: true });
if (existsSync(screenshotsSrc)) {
  cpSync(screenshotsSrc, screenshotsDst, { recursive: true });
}

const dossierBytes = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216
});

writeFileSync(join(outputDir, 'dossier.json'), dossierBytes);
