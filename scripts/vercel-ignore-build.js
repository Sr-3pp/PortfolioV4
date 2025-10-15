#!/usr/bin/env node

/**
 * Vercel Ignored Build Step (ES Module version)
 * Runs quality checks before deployment to skip builds that would fail
 */

import { execSync } from 'child_process';

// Colors for terminal output
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

function runCommand(command, label) {
  printSection(label);
  try {
    execSync(command, { stdio: 'inherit', env: process.env });
    log(`✅ ${label} passed`, colors.green);
    return true;
  } catch {
    log(`❌ ${label} failed`, colors.red);
    return false;
  }
}

async function main() {
  log('🔍 Running pre-deployment checks...', colors.cyan);
  
  // Check if pnpm is available
  try {
    execSync('pnpm --version', { stdio: 'pipe' });
  } catch {
    log('❌ pnpm is not available', colors.red);
    log('⚠️  Skipping checks - proceeding with deployment', colors.yellow);
    process.exit(0); // Allow deployment if pnpm is not available
  }

  let checksPassed = true;

  // Run linter
  if (!runCommand('pnpm run lint', '📝 Linting')) {
    checksPassed = false;
  }

  // Run tests
  if (!runCommand('pnpm run test:run', '🧪 Tests')) {
    checksPassed = false;
  }

  // Skip type check on Vercel (can be slow and cause timeouts)
  if (process.env.VERCEL !== '1') {
    // Optional: Type check (warning only, only runs locally)
    try {
      printSection('🔍 Type Check');
      execSync('pnpm run typecheck', { stdio: 'inherit', env: process.env, timeout: 30000 });
      log('✅ Type check passed', colors.green);
    } catch {
      log('⚠️  Type check failed (warning only)', colors.yellow);
      // Uncomment to fail on type errors:
      // checksPassed = false;
    }
  } else {
    log('⏭️  Skipping type check on Vercel', colors.yellow);
  }

  // Final result
  printSection('📊 Pre-deployment Check Results');

  if (checksPassed) {
    log('✅ All checks passed - Proceeding with deployment', colors.green);
    process.exit(0);
  } else {
    log('❌ Some checks failed - Skipping deployment', colors.red);
    console.log('\nTo deploy anyway, you can:');
    console.log('1. Fix the failing checks');
    console.log('2. Or add [skip ci] to your commit message');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`❌ Error running checks: ${error.message}`, colors.red);
  process.exit(1);
});
