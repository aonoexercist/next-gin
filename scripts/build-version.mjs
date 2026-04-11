import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

const versionFile = join(process.cwd(), '.build-version');

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const today = `${year}${month}${day}`;

const afterDate = `${year}-${month}-${day} 00:00:00`;
const buildNumber = execSync(
  `git log --oneline --after="${afterDate}" --before="${year}-${month}-${day} 23:59:59"`,
  { encoding: 'utf-8' }
).trim().split('\n').filter(Boolean).length;

const version = `${today}.${buildNumber}`;
writeFileSync(versionFile, version, 'utf-8');
console.log(`Build version: ${version}`);
