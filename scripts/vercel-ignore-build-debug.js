#!/usr/bin/env node

/**
 * Vercel Ignored Build Step - Debug Version
 * Provides detailed logging for troubleshooting
 */

import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
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
  log('🔍 Running pre-deployment checks (DEBUG MODE)...', colors.cyan);
  
  // Log environment info
  printSection('🔧 Environment Info');
  log(`Node version: ${process.version}`, colors.blue);
  log(`Platform: ${process.platform}`, colors.blue);
  log(`VERCEL: ${process.env.VERCEL || 'not set'}`, colors.blue);
  log(`VERCEL_ENV: ${process.env.VERCEL_ENV || 'not set'}`, colors.blue);
  log(`CI: ${process.env.CI || 'not set'}`, colors.blue);
  
  // Check if pnpm is available
  printSection('📦 Checking pnpm');
  try {
    const pnpmVersion = execSync('pnpm --version', { encoding: 'utf-8' }).trim();
    log(`✅ pnpm ${pnpmVersion} is available`, colors.green);
  } catch (error) {
    log('❌ pnpm is not available', colors.red);
    log('⚠️  Allowing deployment (cannot run checks)', colors.yellow);
    process.exit(0);
  }

  let checksPassed = true;

  // Run linter
  printSection('📝 Linting');
  try {
    execSync('pnpm run lint', { stdio: 'inherit', env: process.env });
    log('✅ Linting passed', colors.green);
  } catch (error) {
    log('❌ Linting failed', colors.red);
    checksPassed = false;
  }

  // Run tests (skip on Vercel to save time if needed)
  if (process.env.SKIP_TESTS === 'true') {
    log('⏭️  Tests skipped (SKIP_TESTS=true)', colors.yellow);
  } else {
    printSection('🧪 Tests');
    try {
      execSync('pnpm run test:run', { stdio: 'inherit', env: process.env });
      log('✅ Tests passed', colors.green);
    } catch (error) {
      log('❌ Tests failed', colors.red);
      checksPassed = false;
    }
  }

  // Skip type check on Vercel
  if (process.env.VERCEL !== '1') {
    printSection('🔍 Type Check');
    try {
      execSync('pnpm run typecheck', { stdio: 'inherit', env: process.env, timeout: 30000 });
      log('✅ Type check passed', colors.green);
    } catch (error) {
      log('⚠️  Type check failed (warning only)', colors.yellow);
    }
  } else {
    log('⏭️  Type check skipped on Vercel', colors.yellow);
  }

  // Final result
  printSection('📊 Pre-deployment Check Results');
  
  if (checksPassed) {
    log('✅ All checks passed - Proceeding with deployment', colors.green);
    log(`Exit code: 0 (allow deployment)`, colors.blue);
    process.exit(0);
  } else {
    log('❌ Some checks failed - Blocking deployment', colors.red);
    log(`Exit code: 1 (skip deployment)`, colors.blue);
    console.log('\nTo deploy anyway, you can:');
    console.log('1. Fix the failing checks locally');
    console.log('2. Add [skip ci] to your commit message');
    console.log('3. Set SKIP_TESTS=true environment variable in Vercel');
    process.exit(1);
  }
}

main().catch((error) => {
  log(`❌ Unexpected error: ${error.message}`, colors.red);
  console.error(error.stack);
  log('⚠️  Allowing deployment due to script error', colors.yellow);
  process.exit(0); // Allow deployment on script errors
});
