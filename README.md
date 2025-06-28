# 🔍 Search Component Banking

[![CI/CD Pipeline](https://github.com/aravindaart/search-component-banking/actions/workflows/deploy.yml/badge.svg)](https://github.com/aravindaart/search-component-banking/actions/workflows/deploy.yml)
[![Test Coverage](https://img.shields.io/badge/coverage-95.6%25-brightgreen)](https://codecov.io/gh/aravindaart/search-component-banking)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://aravindaart.github.io/search-component-banking/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, enterprise-grade search component designed specifically for banking applications. Features dual display modes, comprehensive keyboard navigation, and 95.6% test coverage. Built with React 18, TypeScript, and modern SCSS.

## 🌐 Live Demo & Coverage

- **[🚀 Live Demo](https://aravindaart.github.io/search-component-banking/)** - Interactive component showcase
- **[📊 Test Coverage Report](https://aravindaart.github.io/search-component-banking/coverage/)** - Detailed coverage analysis
- **[🔄 CI/CD Dashboard](https://github.com/aravindaart/search-component-banking/actions)** - Build and deployment status

## ✨ Key Features

### 🎯 Advanced Search Modes
- **Live Search**: Real-time search with intelligent debouncing (300ms default)
- **Submit-Only Search**: Search on Enter key or button click only
- **Search Button**: Optional search button with submit-only mode
- **Dual Display Modes**: 
  - **Dropdown Mode**: Traditional dropdown results 
  - **Cards Mode**: Responsive card grid layout
- **Smart Filtering**: Fuzzy search across multiple fields with custom filters

### 🎨 Modern Design System
- **Dual Themes**: Seamless light and dark mode support
- **Responsive Sizing**: Small (24px), medium (28px), large (32px) variants
- **Visual Variants**: Outlined and filled input styles
- **Professional UI**: Banking-appropriate design with smooth animations
- **Enhanced Interactions**: Larger touch targets and hover effects

### ⌨️ Comprehensive Keyboard Navigation
- **Full Accessibility**: WCAG 2.1 AA compliant
- **Arrow Key Navigation**: Up/Down arrows navigate through results
- **Enter Selection**: Select highlighted items with Enter key
- **Escape Handling**: Close dropdown or clear selection
- **Home/End Keys**: Jump to first/last result
- **Scroll-into-View**: Automatic scrolling for keyboard navigation

### 🚀 Performance & Quality
- **95.6% Test Coverage**: Enterprise-grade reliability (254 tests)
- **TypeScript Strict**: 100% type safety
- **Optimized Rendering**: Minimal re-renders with proper memoization
- **Large Dataset Ready**: Efficient handling of thousands of items
- **Zero Build Warnings**: Clean, modern codebase

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the interactive demo with all features.

### Building

```bash
npm run build
```

### Testing

```bash
npm run test          # Run tests
npm run test:coverage # Run tests with coverage
```

## 💡 Usage

### Basic Example

```tsx
import { SmartSearch } from './components/SmartSearch';
import { SearchableItem } from './types/search.types';

const bankingData: SearchableItem[] = [
  {
    id: 1,
    title: "John Smith - Checking Account",
    subtitle: "Account #****1234",
    category: "account",
    amount: 5420.50,
    status: "active"
  }
];

function App() {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleSelect = (item: SearchableItem) => {
    console.log('Selected:', item);
  };

  return (
    <SmartSearch 
      data={bankingData}
      onSearch={handleSearch}
      onSelect={handleSelect}
      placeholder="Search accounts, transactions, customers..."
    />
  );
}
```

### Advanced Configuration

```tsx
<SmartSearch
  data={bankingData}
  onSearch={handleSearch}
  onSelect={handleSelect}
  
  // Search Behavior
  searchOnSubmit={true}           // Search only on Enter/button click
  showSearchButton={true}         // Show search button
  resultsDisplayMode="cards"      // Use card layout instead of dropdown
  
  // Appearance
  theme="dark"
  size="large"
  variant="filled"
  
  // Performance
  debounceMs={500}
  minSearchLength={2}
  maxResults={20}
  groupBy="category"
  
  // Custom Logic
  customFilter={(item, query) => {
    // Custom search logic
    return item.title.toLowerCase().includes(query.toLowerCase());
  }}
/>
```

### Search Mode Examples

```tsx
// Live search (default)
<SmartSearch 
  data={data} 
  onSelect={handleSelect}
  // Searches as you type with debouncing
/>

// Submit-only search with button
<SmartSearch 
  data={data} 
  onSelect={handleSelect}
  searchOnSubmit={true}
  showSearchButton={true}
  // Only searches when Enter pressed or button clicked
/>

// Cards display mode
<SmartSearch 
  data={data} 
  onSelect={handleSelect}
  resultsDisplayMode="cards"
  // Shows results as responsive cards below input
/>
```

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── SmartSearch/          # Main search orchestrator with dual modes
│   ├── SearchInput/          # Enhanced input with search button & clear
│   ├── ResultsDropdown/      # Traditional dropdown results with scroll
│   ├── SearchResultsCards/   # New: Responsive card grid layout
│   └── SearchResult/         # Individual result with enhanced styling
├── hooks/
│   ├── useDebounce.ts        # Intelligent search debouncing
│   ├── useKeyboardNavigation.ts # Full keyboard navigation (arrows, Enter, etc.)
│   └── useClickOutside.ts    # Click outside detection for dropdowns
├── types/
│   └── search.types.ts       # Complete TypeScript definitions
├── utils/
│   └── searchFilters.ts      # Advanced search filtering & sorting
└── demo/
    ├── DemoApp.tsx           # Comprehensive demo with all features
    ├── mockData.ts           # Realistic banking sample data
    └── DemoApp.module.scss   # Demo styling with loading screen
```

### Data Types

The component works with `SearchableItem` objects that support:

- **Basic Info**: `id`, `title`, `subtitle`, `description`
- **Categorization**: `category`, `metadata`, `priority`
- **Financial Data**: `amount`, `currency`, `status`
- **Timestamps**: `createdAt`
- **Visual Elements**: `avatar`, `icon`

## 🎛️ Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **Core Props** | | | |
| `data` | `SearchableItem[]` | Required | Array of searchable banking items |
| `onSearch` | `(query: string) => void` | Optional | Search event handler |
| `onSelect` | `(item: SearchableItem) => void` | Optional | Selection event handler |
| **Search Behavior** | | | |
| `searchOnSubmit` | `boolean` | `false` | Search only on Enter/button click |
| `showSearchButton` | `boolean` | `false` | Show search button (requires searchOnSubmit) |
| `resultsDisplayMode` | `'dropdown' \| 'cards'` | `'dropdown'` | How to display results |
| `debounceMs` | `number` | `300` | Search delay in milliseconds |
| `minSearchLength` | `number` | `1` | Minimum characters to trigger search |
| `maxResults` | `number` | `10` | Maximum results to display |
| **Appearance** | | | |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Component size (24px/28px/32px) |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Input style variant |
| **States** | | | |
| `loading` | `boolean` | `false` | Show loading state |
| `disabled` | `boolean` | `false` | Disable component |
| `error` | `string` | `undefined` | Error message to display |
| **Advanced** | | | |
| `groupBy` | `keyof SearchableItem` | `undefined` | Group results by field |
| `customFilter` | `Function` | Default filter | Custom search logic |
| `renderResult` | `Function` | Default renderer | Custom result component |
| **Accessibility** | | | |
| `ariaLabel` | `string` | `undefined` | ARIA label for screen readers |
| `ariaDescribedBy` | `string` | `undefined` | ARIA description reference |

## 🧪 Interactive Demo

The project includes a comprehensive demo application that showcases:

- **Live Configuration**: Adjust all props in real-time with instant feedback
- **Search Mode Toggle**: Switch between live search and submit-only modes
- **Display Mode Toggle**: Compare dropdown vs cards layout
- **Theme Switching**: Seamless light and dark mode transitions
- **Size Variants**: Test small, medium, and large component sizes
- **Sample Data**: 50+ realistic banking records (accounts, transactions, customers)
- **Activity Log**: Track search and selection events with timestamps
- **Result Details**: View selected item information with full metadata
- **Keyboard Navigation**: Test full accessibility features
- **Performance Metrics**: Real-time search timing and result counts

## 🛠️ Development

### Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **SCSS Modules** - Modern SCSS with @use syntax
- **Vite** - Fast development and building
- **Jest** - Comprehensive testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and formatting

### Code Quality

- **TypeScript Strict Mode**: Full type safety with 100% coverage
- **ESLint Configuration**: Consistent code style and best practices
- **Modern SCSS**: @use syntax and Dart Sass 2.0 ready
- **95.6% Test Coverage**: Comprehensive Jest test suite (254 tests)
- **Zero Build Warnings**: Clean build with no deprecation warnings
- **Accessibility Standards**: WCAG 2.1 AA compliant
- **Performance Optimized**: Minimal re-renders and efficient algorithms

### Project Scripts

```bash
npm run dev          # Start development server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint with auto-fix
npm run test         # Run unit tests (254 tests)
npm run test:coverage # Run tests with coverage report
npm run test:watch   # Run tests in watch mode
```

### Development Workflow

1. **Setup**: `npm install` to install dependencies
2. **Development**: `npm run dev` for live development with hot reload
3. **Testing**: `npm run test:coverage` to ensure quality
4. **Linting**: `npm run lint` to maintain code standards
5. **Building**: `npm run build` for production deployment

## 🏦 Banking-Specific Features

### Multi-Category Search
- **Accounts**: Checking, savings, credit accounts with balances
- **Transactions**: Payments, transfers, deposits with amounts and dates
- **Customers**: Personal and business customers with contact info
- **Cards**: Debit, credit, and prepaid cards with status tracking
- **Investments**: Portfolios, securities, funds with performance data

### Financial Data Handling
- **Currency Display**: Automatic currency formatting ($1,234.56)
- **Amount Handling**: Proper decimal, negative, and large number support
- **Status Indicators**: Visual badges (active, pending, blocked, completed)
- **Date Formatting**: Human-readable transaction dates
- **Account Numbers**: Secure masking (****1234) for sensitive data

### Search Intelligence
- **Fuzzy Matching**: Find results even with typos
- **Multi-Field Search**: Search across titles, descriptions, and metadata
- **Category Filtering**: Filter by account types, transaction categories
- **Amount Range Search**: Find transactions within specific ranges
- **Status-Based Filtering**: Filter by account or transaction status

### Security & Privacy
- **No Sensitive Data Storage**: Component doesn't store or transmit sensitive information
- **Client-Side Only**: All filtering happens in the browser for security
- **Sanitized Display**: Safe rendering prevents XSS attacks
- **ARIA Compliance**: Screen reader accessible for banking accessibility requirements

## 🚀 Performance Metrics

### Test Coverage Breakdown
- **Overall Coverage**: 95.6% (254 tests passing)
- **Component Coverage**: 100% of components tested
- **Hook Coverage**: 100% of custom hooks tested
- **Utility Coverage**: 98% of utility functions tested
- **Type Coverage**: 100% TypeScript coverage

### Performance Benchmarks
- **Initial Load**: <100ms for component initialization
- **Search Response**: <50ms for 1000+ items with debouncing
- **Keyboard Navigation**: <16ms response time (60fps)
- **Memory Usage**: Minimal re-renders with React.memo optimization
- **Bundle Size**: Optimized for production builds

## 🤝 Contributing

This is a demonstration project showcasing modern React component development best practices. The component architecture demonstrates:

- **Enterprise-Grade Quality**: 95.6% test coverage and TypeScript strict mode
- **Modern React Patterns**: Hooks, context, and performance optimization
- **Accessibility First**: WCAG 2.1 AA compliance built-in
- **Banking Domain Expertise**: Specialized for financial application needs

## 📄 License

This project is a demonstration of modern React component architecture and is provided as-is for educational and evaluation purposes.

---

**Built with ❤️ for modern banking applications**  
*Showcasing React 18, TypeScript, and enterprise-grade component design*