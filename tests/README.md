# Test Suite Documentation

## Overview

This project uses **Vitest** with **@nuxt/test-utils** for testing composables, utilities, and API endpoints.

## Test Structure

```
tests/
├── api/
│   └── expense.test.ts           # API endpoint tests
├── composables/
│   └── ExpenseFilters.test.ts    # Composable tests
└── utils/
    └── expense.test.ts            # Utility function tests
```

## Running Tests

### Run all tests
```bash
pnpm test
```

### Run tests in watch mode (during development)
```bash
pnpm test
```

### Run tests once (CI/CD)
```bash
pnpm test:run
```

### Run tests with UI
```bash
pnpm test:ui
```

### Run tests with coverage
```bash
pnpm test:coverage
```

## Test Files

### 1. Utility Tests (`tests/utils/expense.test.ts`)

Tests for utility functions in `/app/utils/expense.ts`:

- ✅ `extractSelectValue()` - Extract values from SelectMenu
- ✅ `hasValue()` - Check if value exists
- ✅ `formatCurrency()` - Format currency
- ✅ `formatDate()` - Format date
- ✅ `formatDateTime()` - Format datetime
- ✅ `formatError()` - Format error messages

**Coverage**: All utility functions with edge cases

### 2. Composable Tests (`tests/composables/ExpenseFilters.test.ts`)

Tests for the `useExpenseFilters` composable:

- ✅ Categories from allowedCategories
- ✅ Category options with "All categories"
- ✅ Methods from allowedMethods + existing expenses
- ✅ Method options with "All methods"
- ✅ Alphabetical sorting
- ✅ Unique values

**Coverage**: All composable functionality

### 3. API Tests (`tests/api/expense.test.ts`)

Tests for API endpoints:

**POST /api/expense**
- ✅ Create expense with valid data
- ✅ Reject without required fields
- ✅ Reject invalid amount

**GET /api/expense**
- ✅ Return expenses list

**POST /api/expense/recurring**
- ✅ Create recurring expense
- ✅ Reject without frequency
- ✅ Reject invalid frequency

**GET /api/expense/summary**
- ✅ Return summary data
- ✅ Accept month/year parameters
- ✅ Reject invalid month
- ✅ Reject invalid year

**Note**: API tests require authentication. Without a session, they expect 401 errors.

## Writing New Tests

### Test Template

```typescript
import { describe, it, expect } from 'vitest'

describe('Feature Name', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = myFunction(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

### Testing Composables

```typescript
import { describe, it, expect } from 'vitest'
import { useMyComposable } from '~/composables/MyComposable'

describe('useMyComposable', () => {
  it('should work', () => {
    const { value } = useMyComposable()
    expect(value.value).toBeDefined()
  })
})
```

### Testing API Endpoints

```typescript
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('API Tests', () => {
  await setup()
  
  it('should return data', async () => {
    const data = await $fetch('/api/endpoint')
    expect(data).toBeDefined()
  })
})
```

## Mocking

### Mock Composables

```typescript
vi.mock('~/composables/MyComposable', () => ({
  useMyComposable: () => ({
    value: ref('mocked')
  })
}))
```

### Mock API Calls

```typescript
vi.mock('$fetch', () => ({
  default: vi.fn(() => Promise.resolve({ data: 'mocked' }))
}))
```

## CI/CD Integration

Add to your CI/CD pipeline:

```yaml
- name: Run Tests
  run: pnpm test:run

- name: Generate Coverage
  run: pnpm test:coverage
```

## Best Practices

1. ✅ Test one thing per test
2. ✅ Use descriptive test names
3. ✅ Follow AAA pattern (Arrange, Act, Assert)
4. ✅ Test edge cases
5. ✅ Mock external dependencies
6. ✅ Keep tests fast and isolated
7. ✅ Aim for high coverage (>80%)

## Debugging Tests

### Run specific test file
```bash
pnpm test expense.test
```

### Run specific test
```bash
pnpm test -t "should format currency"
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test", "--run"],
  "console": "integratedTerminal"
}
```

## Next Steps

Consider adding:
- [ ] Integration tests for full workflows
- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Mutation testing
