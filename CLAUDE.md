# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **SeaTable Tree Plugin** - a React/TypeScript plugin that enables hierarchical tree visualization of linked tables within SeaTable. The plugin allows displaying up to three connected tables in a foldable/unfoldable tree structure.

### Technology Stack
- **React 17** with TypeScript
- **Webpack 5** for building
- **Jest 27** for testing
- **Sass** for styling
- **react-intl-universal** for internationalization
- **Prettier** for code formatting
- **ESLint** for linting

## Common Development Commands

### Development
```bash
# Start development server
npm start

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Building
```bash
# Build for production
npm run build

# Build plugin for deployment (generates plugin-zip)
npm run build-plugin

# Clean build artifacts
npm run clean
```

### Code Quality
```bash
# Format code with Prettier
npm run format

# Type check
npm run type-check
```

Note: ESLint is configured but no explicit `lint` script is defined in package.json. The configuration enforces:
- Single quotes
- 2-space indentation
- TypeScript strict mode
- React hooks exhaustive-deps disabled (see .eslintrc.json)

### Translation
```bash
# Pull translations from Transifex
npm run pull-translate

# Push source language to Transifex
npm run push-translate

# Generate locale files
npm run translate
```

## Development Setup

### 1. Configure Local Development

Copy `src/setting.local.dist.js` to `src/setting.local.js` and update with your SeaTable server details:

```javascript
export default {
  server: 'https://your-seatable-server.com',
  dtableName: 'YourTableName',
  APIToken: 'your-api-token',
  workspaceID: 'workspace-id',
  lang: 'en',
  loadVerbose: true,
};
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development

```bash
npm start
```

This will start the webpack dev server and connect to your SeaTable base defined in `setting.local.js`.

## Project Architecture

### Directory Structure

```
src/
├── app.tsx                      # Main application component with complex state management
├── entry.tsx                    # Plugin entry point (registered with SeaTable)
├── setting.ts                   # Configuration loader
├── setting.local.js             # Local dev settings (git-ignored)
├── setting.local.dist.js        # Template for local settings
├── plugin-config/
│   └── info.json                # Plugin metadata
├── locale/
│   ├── index.ts                 # Locale configuration
│   └── lang/                    # Translation files (*.json)
├── utils/
│   ├── template-utils/          # Shared plugin utilities & interfaces
│   │   ├── interfaces/          # TypeScript interfaces
│   │   ├── constants/           # App constants
│   │   └── utils.ts             # Helper functions
│   └── custom-utils/            # Tree-specific utilities
│       ├── interfaces/          # Tree plugin interfaces
│       ├── constants/           # Tree plugin constants
│       └── utils.ts             # Tree structure helper functions
├── components/
│   ├── template-components/     # Reusable SeaTable plugin components
│   │   ├── Header/              # Plugin header component
│   │   ├── PluginSettings/      # Settings panel with dropdowns
│   │   ├── PluginPresets/       # Preset management (CRUD)
│   │   ├── Elements/            # Form elements and editors
│   │   └── ResizableWrapper/    # Column resizing functionality
│   └── custom-components/       # Tree-specific components
│       ├── ExpandableItem/      # Expandable tree node component
│       ├── HeaderRow/           # Table header with resize handles
│       ├── ResizableCell/       # Resizable table cell
│       └── index.tsx            # Main PluginTL component
├── styles/
│   ├── template-styles/         # Base plugin styles
│   └── custom-styles/           # Tree-specific styles
├── hooks/                       # Custom React hooks
├── model/                       # Data models
├── assets/                      # Static assets
├── index.js                     # Plugin index
└── plugin-context.ts           # Plugin context interface
```

### Key Files

- **`src/entry.tsx`**: Plugin entry point that registers with SeaTable
- **`src/app.tsx`**: Main React application component with complex state management for presets, data sync, and tree expansion
- **`src/components/custom-components/index.tsx`**: Main PluginTL component that handles tree rendering, row expansion, and data management
- **`src/utils/custom-utils/utils.ts`**: Tree-specific utilities for level calculations, row finding, and tree structure generation
- **`src/setting.ts`**: Loads configuration from `setting.local.js`
- **`src/locale/index.ts`**: Manages available locales and default language
- **`plugin-config/info.json`**: Plugin metadata (name: "tree", display_type: "overlay")

### Architecture Pattern

The plugin uses a **dual-layer architecture** with:

1. **Template Components** (`src/components/template-components/`): Reusable SeaTable plugin components (Header, PluginSettings, PluginPresets, etc.)
2. **Custom Components** (`src/components/custom-components/`): Tree-specific business logic (ExpandableItem, HeaderRow, ResizableCell)
3. **Template Utils** (`src/utils/template-utils/`): Base SeaTable plugin utilities and interfaces
4. **Custom Utils** (`src/utils/custom-utils/`): Tree-specific data structures and helper functions

### Core Data Flow

1. **Preset Management**: Users can create multiple presets, each containing table/view selections and tree configuration
2. **3-Level Hierarchy**: Supports up to 3 connected tables through linked columns (first → second → third level)
3. **State Synchronization**: Real-time data sync between local state and SeaTable via `window.dtableSDK`
4. **Row Expansion**: Persistent expansion state stored in plugin settings
5. **Dynamic Column Resizing**: User-adjustable column widths persisted per preset

### Key State Management

The main `app.tsx` manages:
- `isShowState`: UI visibility controls (settings panel, presets)
- `appActiveState`: Current active preset and table/view selections
- `pluginDataStore`: Complete plugin configuration including presets and expansion states
- `allTables`: Cached table data from SeaTable
- `activeLevelSelections`: Current hierarchy level selections

### Internationalization

- Translations stored in `src/locale/lang/` as JSON files (one per language)
- Uses `react-intl-universal` for i18n
- Supports dynamic language switching based on SeaTable's `window.dtable.lang`
- Integration with **Transifex** for translation management via `tx` CLI

## Configuration Files

### Build Configuration
- **`.babelrc`**: Babel preset configuration (react-app)
- **`tsconfig.json`**: TypeScript configuration with path mapping (`@/*` -> `src/*`)
- **`webpack.config.js`**: Webpack bundling configuration
- **`config/`**: Additional webpack and build configurations

### Code Quality
- **`.eslintrc.json`**: ESLint rules (extends react-app, TypeScript, Prettier)
- **`prettier.config.json`**: Prettier formatting rules
  - Tab width: 2
  - Single quotes
  - Print width: 100

### Testing
- **`jest.config.js`**: Jest test configuration
- **`tests/setupTests.js`**: Test environment setup
- **`tests/`**: Test files directory

## Plugin Integration with SeaTable

The plugin registers itself with SeaTable via:

```typescript
// src/entry.tsx
window.app.registerPluginItemCallback(info.name, SeaTablePlugin.execute);
```

The plugin:
1. Initializes internationalization
2. Renders the main `<App>` component
3. Connects to the configured SeaTable base via `setting.local.js`
4. Provides hierarchical tree visualization for linked tables

## Key Dependencies

### Production
- `react` & `react-dom`: UI framework
- `@seafile/*`: SeaTable-specific UI components
- `dtable-ui-component` & `dtable-utils`: SeaTable data table utilities
- `react-intl-universal`: Internationalization
- `react-icons`: Icon library

### Development
- `typescript`: Type checking
- `webpack` & related: Build tooling
- `jest` & `@testing-library/*`: Testing framework
- `eslint` & `prettier`: Code quality and formatting
- `sass`: CSS preprocessing

## Testing

Tests are located in the `tests/` directory with the following structure:
- `tests/setupTests.js`: Jest setup and polyfills
- `tests/**/*.spec.ts/jsx`: Test files

Jest is configured with:
- jsdom test environment
- Babel transformations
- CSS module mocking
- React Testing Library support

## Build Output

- **`build/`**: Webpack build output
- **`plugin-zip/`**: Final plugin distribution (created by `npm run build-plugin`)
  - Contains the packaged plugin ready for deployment to SeaTable

## Translation Management

The plugin uses **Transifex** for translation management:

1. Source language files: `src/locale/lang/en.json`
2. Sync with Transifex: `npm run push-translate`
3. Pull translations: `npm run pull-translate`
4. Generate locale files: `npm run translate`

## Important Notes

1. **Local Development**: Always configure `src/setting.local.js` before running `npm start`
2. **Git Ignore**: `src/setting.local.js` is git-ignored (contains sensitive credentials)
3. **Path Mapping**: TypeScript paths use `@/*` to reference `src/*`
4. **SCSS Modules**: Styles use SCSS modules (`.module.scss` files)
5. **Code Style**:
   - ESLint rules enforce single quotes, 2-space indentation
   - Prettier formats all code automatically
   - TypeScript strict mode is enabled
   - React hooks exhaustive-deps disabled by configuration
6. **Sourcemap**: Disabled for production plugin builds (`GENERATE_SOURCEMAP=false`)
7. **Plugin Display Type**: Uses "overlay" display mode in plugin-config/info.json
8. **Data Synchronization**: Plugin automatically syncs with SeaTable data changes via event listeners

## Development Architecture Details

### Custom Component Structure

The main tree functionality is implemented in `src/components/custom-components/index.tsx` (PluginTL component):
- Manages 3-level tree hierarchy with expandable nodes
- Handles column resizing with persistent width storage
- Supports adding new rows with different column types (text, date, single-select, auto-number)
- Integrates with SeaTable's real-time collaboration features

### Key Constants and Utilities

Located in `src/utils/custom-utils/constants/`:
- `LINK_TYPE`: Defines link column types (link, link-formula, link-formula-2nd)
- `LEVEL_SEL_DEFAULT`: Default structure for level selections
- `INDEX_COLUMN`: Configuration for row index columns

### Row Addition Logic

The plugin supports adding rows with various column types:
- **Text/Number**: Direct input field
- **Date**: Calendar picker using rc-calendar
- **Single Select**: Dropdown using SeaTable's SingleSelectEditor
- **Auto Number/Formula**: Automatic creation without user input

## Additional Resources

- [SeaTable Plugin Template](https://github.com/seatable/seatable-plugin-template-base/tree/TB-staging)
- [SeaTable Admin Manual - Plugins](https://admin.seatable.io/configuration/plugins/?h=plugins)
- [Plugin Archive](https://cloud.seatable.io/apps/custom/plugin-archive)
