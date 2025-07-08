# Testing Guide

This project uses [Vitest](https://vitest.dev/) as the testing framework for both the web and API applications.

## Project Structure

### Web App (`apps/web`)
- **Framework**: Vitest with jsdom environment for DOM testing
- **Config**: `vite.config.test.ts`
- **Test files**: `*.test.ts` files alongside source code

### API App (`apps/api`)
- **Framework**: Vitest with Node.js environment
- **Config**: `vitest.config.ts`
- **Test files**: `*.test.ts` files alongside source code

## Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting to ensure consistent code style and catch potential issues.

### Linting Commands

```bash
# Run linting (check only)
pnpm lint

# Run linting and automatically fix issues
pnpm lint:fix

# Run linting for CI (with GitHub reporter format)
pnpm lint:ci
```

### Pre-commit Hooks

The project uses Husky and lint-staged to automatically:
- Run `biome lint --write` and `biome format --write` on staged files
- Ensure code quality before commits
- Block commits with unfixable lint errors

### VSCode Integration

The project includes VSCode settings (`.vscode/settings.json`) that:
- Set Biome as the default formatter for JS/TS/JSON files
- Enable format on save
- Run code actions (organize imports, quick fixes) on save

Install the [Biome VSCode extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) for the best experience.

## Running Tests

### All Apps (from root)
```bash
# Run all tests across the monorepo
pnpm test

# Run tests for specific apps
pnpm --filter=web test
pnpm --filter=api test
```

### Individual Apps
```bash
# Web app
pnpm --filter=web test          # Watch mode
pnpm --filter=web test:run      # Single run
pnpm --filter=web test:ui       # Visual UI

# API app
pnpm --filter=api test          # Watch mode
pnpm --filter=api test:run      # Single run
pnpm --filter=api test:ui       # Visual UI
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
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'
import { mockUseTheme } from '../test-utils/theme-mocks'

// Mock theme hooks for components that use theme context
mockUseTheme()

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
- Use shared test utilities from `app/test-utils/` for common mocks and helpers

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

- None currently identified.

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
- Add performance testing for large datasets
- Add integration tests for the GraphQL API