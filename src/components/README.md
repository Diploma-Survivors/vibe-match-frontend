# Components Structure

This directory contains all React components organized by functionality for better maintainability and clean code.

## 📁 Directory Structure

```
src/components/
├── 🔧 ui/                 # Reusable UI components (shadcn/ui)
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── slider.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── toggle.tsx
│   └── index.ts
├── 🏗️  layout/            # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── index.ts
├── 🏆 contest/            # Contest-related components
│   ├── contest-card.tsx
│   ├── contest-info.tsx
│   ├── contest-list.tsx
│   ├── contest-navbar.tsx
│   ├── contest-stats.tsx
│   ├── contest-table.tsx
│   ├── contest-table-new.tsx
│   └── index.ts
├── 📝 problem/            # Problem-related components
│   ├── problem-filter.tsx
│   ├── problem-navbar.tsx
│   ├── problem-sidebar.tsx
│   ├── problem-stats.tsx
│   ├── problem-stats-new.tsx
│   ├── problem-table.tsx
│   └── index.ts
├── ⌨️  editor/             # Code editor components
│   ├── code-editor.tsx
│   ├── code-editor-new.tsx
│   ├── monaco-submit-editor.tsx
│   ├── simple-submit-editor.tsx
│   └── index.ts
├── 📊 ranking/            # Ranking components
│   ├── ranking-item.tsx
│   ├── ranking-item-new.tsx
│   ├── ranking-list.tsx
│   └── index.ts
├── 🔄 common/             # Common/shared components
│   ├── particle-background.tsx
│   ├── quick-filters.tsx
│   ├── sort-controls.tsx
│   ├── test-page-content.tsx
│   └── index.ts
├── 🎨 providers/          # Context providers
│   ├── theme-provider.tsx
│   └── index.ts
└── index.ts               # Main export file
```

## 📋 Usage Guidelines

### Importing Components

You can import components in two ways:

1. **From specific category** (recommended for better tree-shaking):
```tsx
import { ContestCard, ContestList } from '@/components/contest';
import { Header, Footer } from '@/components/layout';
```

2. **From main index** (for convenience):
```tsx
import { ContestCard, Header, Button } from '@/components';
```

### Category Descriptions

- **ui/**: Base UI components from shadcn/ui library - buttons, inputs, cards, etc.
- **layout/**: Components that define the overall layout structure
- **contest/**: All components related to contest functionality
- **problem/**: Components for problem display and interaction
- **editor/**: Code editing components (Monaco, simple editors)
- **ranking/**: Components for displaying rankings and leaderboards
- **common/**: Shared components used across multiple features
- **providers/**: React context providers for global state

### Best Practices

1. Keep components in their appropriate category
2. Use the index.ts files for clean exports
3. Follow the naming convention: `category-specific-name.tsx`
4. Update index.ts when adding new components
5. Consider component reusability when choosing the category

## 🔄 Migration Notes

This structure was reorganized for better maintainability. All import paths should be updated to use the new structure.
