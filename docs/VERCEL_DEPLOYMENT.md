# Vercel Deployment Configuration

## Overview

This project uses Vercel's **Ignored Build Step** feature to automatically skip deployments when tests or lint checks fail. This ensures only code that passes all quality checks gets deployed.

## How It Works

### 1. Pre-deployment Checks

Before each Vercel deployment, the following checks run automatically:

1. **✅ Linting** - ESLint checks for code quality and style issues
2. **✅ Tests** - All unit tests must pass
3. **⚠️ Type Check** - TypeScript type checking (warning only by default)

### 2. Deployment Decision

- **Exit Code 0** → ✅ All checks passed → **Deployment proceeds**
- **Exit Code 1** → ❌ Some checks failed → **Deployment skipped**

## Configuration Files

### `vercel.json`

```json
{
  "ignoreCommand": "node scripts/vercel-ignore-build.js"
}
```

This tells Vercel to run our check script before building.

### Scripts

**Node.js Version** (Recommended)
- File: `scripts/vercel-ignore-build.js`
- Better cross-platform compatibility
- Easier to debug

**Bash Version** (Alternative)
- File: `scripts/vercel-ignore-build.sh`
- Linux/macOS only
- Lighter weight

## Package.json Scripts

```json
{
  "vercel:ignore": "node scripts/vercel-ignore-build.js",
  "vercel:ignore:bash": "bash scripts/vercel-ignore-build.sh",
  "ci:check": "pnpm lint && pnpm test:run && pnpm typecheck"
}
```

## Testing Locally

Test the checks before pushing:

```bash
# Run all checks
pnpm run ci:check

# Or run the Vercel ignore script
pnpm run vercel:ignore

# Test bash version
pnpm run vercel:ignore:bash
```

## Vercel Dashboard Setup

### Option 1: Using vercel.json (Automatic)

The `vercel.json` file automatically configures Vercel. No manual setup needed!

### Option 2: Manual Configuration

If not using `vercel.json`:

1. Go to your project in Vercel Dashboard
2. Settings → Git
3. **Ignored Build Step** section
4. Enter: `node scripts/vercel-ignore-build.js`

## Skipping Checks (When Needed)

### Temporarily Skip All Checks

Add `[skip ci]` or `[vercel skip]` to your commit message:

```bash
git commit -m "Update docs [skip ci]"
```

### Disable Specific Checks

Edit `scripts/vercel-ignore-build.js`:

```javascript
// Comment out to skip linting
// if (!runCommand('pnpm lint', '📝 Linting')) {
//   checksPassed = false;
// }

// Comment out to skip tests
// if (!runCommand('pnpm test:run', '🧪 Tests')) {
//   checksPassed = false;
// }
```

### Enable Type Check Failures

By default, type check failures are warnings. To fail on type errors:

```javascript
// In vercel-ignore-build.js, uncomment:
if (!runCommand('pnpm exec nuxt typecheck', '🔍 Type Check')) {
  checksPassed = false; // Now type errors will block deployment
}
```

## Troubleshooting

### Deployment Blocked Unexpectedly

**Check the Vercel build logs:**
1. Go to your project dashboard
2. Click on the failed deployment
3. Check the "Ignored" tab or build logs

**Common issues:**
- Missing dependencies (run `pnpm install` locally)
- Failing tests (run `pnpm test:run`)
- Lint errors (run `pnpm lint`)

### Force Deployment

To deploy even with failing checks:

**Method 1: Skip CI**
```bash
git commit -m "Emergency fix [skip ci]"
```

**Method 2: Remove ignore command**
Temporarily remove from `vercel.json`:
```json
{
  "ignoreCommand": ""
}
```

**Method 3: Vercel Dashboard**
1. Go to deployments
2. Find the skipped deployment
3. Click "Redeploy" → "Redeploy without cache"

## Best Practices

1. ✅ **Run checks locally** before pushing
2. ✅ **Fix issues immediately** - don't skip checks regularly
3. ✅ **Keep tests fast** - slow tests delay deployments
4. ✅ **Use meaningful commit messages** for [skip ci]
5. ✅ **Monitor Vercel logs** to catch issues early

## Summary

✅ **Automatic quality checks** before every deployment  
✅ **Skip deployments** that would fail anyway  
✅ **Save time and resources** by catching issues early  
✅ **Maintain code quality** without manual intervention  

Your deployments are now protected by automated quality checks! 🎉
