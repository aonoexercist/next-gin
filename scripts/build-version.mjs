import { execSync } from 'child_process';

const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const today = `${year}${month}${day}`;

let commitCount;

if (process.env.BUILD_COUNT) {
  commitCount = process.env.BUILD_COUNT;
} else {
  try {
    // Fallback for local development
    commitCount = execSync('git rev-list --count HEAD --since="00:00:00"').toString().trim();
  } catch (e) {
    commitCount = '0';
  }
}

console.log(`${today}.${commitCount}`);