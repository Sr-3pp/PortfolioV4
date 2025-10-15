#!/usr/bin/env node

/**
 * Vercel Ignored Build Step - Simplified Version
 * Only runs linting (skips tests for faster checks)
 * Use this if full checks are causing issues on Vercel
 */

import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function printSection(title) {
  console.log('\n' + '━'.repeat(50));
  console.log(`  ${title}`);
  console.log('━'.repeat(50));
}

async function main() {
  log('🔍 Running pre-deployment checks (lint only)...', colors.cyan);

  // Check if pnpm is available
  try {
    execSync('pnpm --version', { stdio: 'pipe' });
  } catch {
    log('⚠️  pnpm not available - allowing deployment', colors.yellow);
    process.exit(0);
  }

  // Run linter only
  printSection('📝 Linting');
  try {
    execSync('pnpm run lint', { stdio: 'inherit', env: process.env });
    log('✅ Linting passed - Proceeding with deployment', colors.green);
    process.exit(0);
  } catch {
    log('❌ Linting failed - Skipping deployment', colors.red);
    console.log('\nFix lint errors or add [skip ci] to your commit message');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`❌ Error: ${error.message}`, colors.red);
  process.exit(1);
});
