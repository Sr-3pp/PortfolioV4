#!/usr/bin/env node

/**
 * Vercel Ignored Build Step - Allow All
 * Temporarily allows all deployments (for debugging)
 * Use this temporarily while investigating issues
 */

console.log('⚠️  WARNING: Using temporary allow-all script');
console.log('This script allows all deployments without checks');
console.log('Remember to switch back to the full script after debugging!');
console.log('');
console.log('✅ Allowing deployment');
process.exit(0);
