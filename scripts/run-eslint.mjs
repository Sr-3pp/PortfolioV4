#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)

const eslintPackagePath = require.resolve('eslint/package.json')
const eslintPackage = require(eslintPackagePath)
const eslintEntry = join(dirname(eslintPackagePath), eslintPackage.bin.eslint)

const args = process.argv.slice(2)

const child = spawn(process.execPath, ['--no-warnings', eslintEntry, ...args], {
  stdio: 'inherit'
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})
