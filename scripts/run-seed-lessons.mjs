/**
 * run-seed-lessons.mjs
 * Runs the full seed-lessons.ts file using tsx.
 * This seeds ALL lesson topics: HTML (75+), CSS (100+), JS (140+), React (60), Next.js (70), Tailwind (100)
 * 
 * Run: node scripts/run-seed-lessons.mjs
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting full lesson seed...');
console.log('📂 Root:', rootDir);

try {
  execSync(
    'npx tsx scripts/seed-lessons.ts',
    { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env }
    }
  );
  console.log('✅ Seed complete!');
} catch (err) {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
}
