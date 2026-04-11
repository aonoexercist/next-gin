import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const versionFile = join(process.cwd(), '.build-version');

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const today = `${year}${month}${day}`;

let buildNumber = 1;

try {
  const content = readFileSync(versionFile, 'utf-8').trim();
  const [storedDate, storedCount] = content.split('.');
  if (storedDate === today) {
    buildNumber = parseInt(storedCount, 10) + 1;
  }
} catch {
  // File doesn't exist yet, start from 1
}

const version = `${today}.${buildNumber}`;
writeFileSync(versionFile, version, 'utf-8');
console.log(`Build version: ${version}`);
