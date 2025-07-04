# Testing Guide

This project uses [Vitest](https://vitest.dev/) as the testing framework for both the web and API applications.

## Quick Start

```bash
# Run all tests
npm test

# Run tests for a specific app
cd apps/web && pnpm test
cd apps/api && pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once (no watch mode)
pnpm test:run
```

## Project Structure

### Web App (`apps/web`)
- **Framework**: Vitest with jsdom environment for DOM testing
- **Config**: `vite.config.test.ts`
- **Test files**: `*.test.ts` files alongside source code

### API App (`apps/api`)
- **Framework**: Vitest with Node.js environment
- **Config**: `vitest.config.ts`
- **Test files**: `*.test.ts` files alongside source code

## Running Tests

### All Apps (from root)
```bash
# Run all tests across the monorepo
npm test

# Run specific test files
turbo test --filter=web
turbo test --filter=api
```

### Individual Apps
```bash
# Web app
cd apps/web
pnpm test          # Watch mode
pnpm test:run      # Single run
pnpm test:ui       # Visual UI

# API app
cd apps/api
pnpm test          # Watch mode
pnpm test:run      # Single run
pnpm test:ui       # Visual UI
```

## Writing Tests

### Basic Function Tests

```typescript
import { describe, test, expect } from 'vitest'
import { functionToTest } from './module'

describe('functionToTest', () => {
  test('should handle basic case', () => {
    const result = functionToTest('input')
    expect(result).toBe('expected output')
  })
  
  test('should handle edge cases', () => {
    expect(() => functionToTest(null)).toThrow()
  })
})
```

### React Component Tests

```typescript
import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

// Mock dependencies if needed
vi.mock('../hooks/useTheme', () => ({
  useThemedStyles: () => ({
    colors: { primary: '#3B82F6' },
    utilities: { spacing: (size: string) => '8px' }
  })
}))

describe('MyComponent', () => {
  test('renders with props', () => {
    render(<MyComponent title="Test Title" />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  test('handles user interactions', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<MyComponent onClick={handleClick} />)
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('matches snapshot', () => {
    const { container } = render(<MyComponent />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
```

### Snapshot Testing

Snapshot tests capture the exact output of a component and alert you to any changes:

```typescript
test('matches snapshot', () => {
  const { container } = render(<MyComponent />)
  expect(container.firstChild).toMatchSnapshot()
})
```

- Snapshots are stored in `__snapshots__` folders
- Update snapshots with `pnpm test -- --update-snapshots`
- Review snapshot changes carefully in PRs

### Test Organization
- Place test files next to the source files they test
- Use descriptive test names that explain the behavior being tested
- Group related tests using `describe` blocks
- Use `test.skip()` for temporarily disabled tests

## Current Test Coverage

### Web App (`apps/web`)
- **Deck Parser** (`app/lib/deck-parser.test.ts`)
  - Basic deck list parsing with quantities
  - Split card name handling (Fire // Ice, Fire//Ice, etc.)
  - Comment parsing vs. split card detection
  - Various quantity formats (4x, x4, etc.)
- **React Components** (`app/components/StyledButton.test.tsx`)
  - Component rendering with different props
  - Variant testing (primary, secondary, disabled)
  - Size variations (xs, sm, md, lg, xl)
  - User interactions (click, hover, keyboard)
  - Icon positioning and rendering
  - Accessibility features
  - Snapshot testing for visual regression

### API App (`apps/api`)
- **Card Validation** (`src/data.test.ts`)
  - Split card matching with various slash patterns
  - Case-insensitive exact matching
  - Non-existent card handling
  - Deck size limits
- **Card Search**
  - Perfect match detection for normalized split cards
  - Basic search functionality
  - Pagination and sorting

## Known Issues

- **Split Card Partial Search**: There's a known issue where split cards like "Fire // Ice" don't appear in partial search results (e.g., searching for "Ice"). The validation logic works correctly, but something in the search function filtering needs investigation.

## Configuration Files

### Web App Configuration (`apps/web/vite.config.test.ts`)
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
})
```

### API Configuration (`apps/api/vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})
```

## Future Improvements

- Add test coverage reporting
- Set up CI/CD integration for automated testing
- Add more comprehensive test coverage for remaining modules
- Investigate and fix the split card partial search issue
- Add performance testing for large datasets
- Add integration tests for the GraphQL API