## Documentation

Don't create any *.md files with documentation. 

You can only expand and update the existing README.md file so that it matches the latest changes made in the project.

Requirements:

 - Update only README.md
 - Update the description of functionality, installation, launch, and usage examples.
 - If there are new commands, parameters, or modules, add them to the README.
 - Keep the structure of the README clear and logical.

Bottom line: one updated file README.md, reflecting the current status of the project.

### Import Aliases

**ALWAYS use `@/` alias for internal imports**. Never use relative paths like `../../../../`:

```javascript
// ✅ Correct
import {CoreContext} from '@/contexts/core';
import ACTION_TYPES from '@/config/constants/reducer';
import {ROUTE_ALIASES} from '@/config/constants/routes';

// ❌ Wrong
import {CoreContext} from '../../../../contexts/core';
```

Path alias is configured in `jsconfig.json`: `"@/*": ["src/*"]`

**Do not use the `@/` alias for files outside `src/`.**

#### Mocks and Test Utilities Import Rule

For test utilities, mocks, and providers (e.g., files in `jest/`, `tests/`, or similar), always use the path as configured in the project (usually absolute from project root, e.g., `jest/mock-provider/core`).
**Do not use the `@/` alias for files outside `src/`.**

## Testing Conventions

### Unit Tests (Jest + React Testing Library)

- **Location**: `tests/unit-tests/` - mirrors `src/` structure
- **Run**: `npm run test` (with coverage) or `npm run test:watch`
- **Test ID**: Use `data-qa` attribute (configured in jest.setup.js and test-utils)
- **Mock Providers**: Import from `jest/mock-provider/` (core, layout, search, feature-flags)

**Testing Pattern Example**:

```javascript
import MockCoreProvider from 'jest/mock-provider/core';
import {mockLayoutContextStore} from 'jest/mock-provider/layout';
import {render} from 'test-utils';

const setup = ({mockCoreContext, mockLayoutContext}) => {
  return render(
    <MockCoreProvider customStore={mockCoreContext}>
      <LayoutContext.Provider value={mockLayoutContext}>
        <YourComponent />
      </LayoutContext.Provider>
    </MockCoreProvider>
  );
};
```