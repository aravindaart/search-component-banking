/**
 * Banking Search Types
 * Defines all TypeScript interfaces for the Smart Search Banking Component
 */

export interface SearchableItem {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  category: 'account' | 'transaction' | 'customer' | 'card' | 'investment' | 'other';
  metadata?: Record<string, unknown>;
  searchableText?: string;
  priority?: number;
  status?: 'active' | 'inactive' | 'pending' | 'blocked' | 'completed';
  createdAt?: string;
  avatar?: string;
  amount?: number;
  currency?: string;
  icon?: string;
}

export interface SearchFilters {
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  status?: string[];
  sortBy?: 'relevance' | 'date' | 'amount' | 'alphabetical';
  sortOrder?: 'asc' | 'desc';
}

export interface SmartSearchProps {
  // Data & Search
  data: SearchableItem[];
  onSearch?: (query: string, filters?: SearchFilters) => void;
  onSelect?: (item: SearchableItem) => void;
  placeholder?: string;
  
  // Behavior
  debounceMs?: number;
  minSearchLength?: number;
  maxResults?: number;
  searchOnSubmit?: boolean; // New: search only on Enter/button click
  showSearchButton?: boolean; // New: show search button when searchOnSubmit is true
  resultsDisplayMode?: 'dropdown' | 'cards'; // New: how to display results
  
  // Appearance
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
  
  // States
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
  
  // Advanced
  customFilter?: (item: SearchableItem, query: string) => boolean;
  renderResult?: (item: SearchableItem) => React.ReactNode;
  groupBy?: keyof SearchableItem;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onFocus?: () => void;
  onSubmit?: () => void; // New: for Enter key and search button
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
  theme?: 'light' | 'dark';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  showSearchButton?: boolean; // New: show search button
  // ARIA attributes for HTML input
  'aria-expanded'?: boolean;
  'aria-haspopup'?: 'listbox' | 'dialog' | 'grid' | 'menu' | 'tree' | 'true' | 'false' | undefined
  'aria-owns'?: string;
  'aria-autocomplete'?: 'list' | 'none' | 'inline' | 'both';
}

export interface ResultsDropdownProps {
  results: SearchableItem[];
  query: string;
  isOpen: boolean;
  loading?: boolean;
  selectedIndex: number;
  onSelect: (item: SearchableItem) => void;
  onClose: () => void;
  maxResults?: number;
  groupBy?: keyof SearchableItem;
  renderResult?: (item: SearchableItem) => React.ReactNode;
  theme?: 'light' | 'dark';
}

export interface SearchResultProps {
  item: SearchableItem;
  query: string;
  isSelected?: boolean;
  onClick: () => void;
  theme?: 'light' | 'dark';
}