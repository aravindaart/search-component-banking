import { SearchableItem } from '../types/search.types';

/**
 * Search and Filter Utilities
 * Contains helper functions for filtering and searching banking data
 */

/**
 * Default search filter function
 * Searches across title, subtitle, description, and searchableText fields
 */
export function defaultSearchFilter(item: SearchableItem, query: string): boolean {
  if (!query.trim()) return true;

  const searchQuery = query.toLowerCase();
  const searchFields = [
    item.title,
    item.subtitle,
    item.description,
    item.searchableText,
    item.metadata?.accountType,
    item.metadata?.reference,
    item.category
  ];

  return searchFields.some(field => 
    field && field.toString().toLowerCase().includes(searchQuery)
  );
}

/**
 * Highlight matching text in search results
 * Returns text with highlighted portions wrapped in <mark> tags
 */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Group search results by category
 */
export function groupResultsByCategory(items: SearchableItem[]): Record<string, SearchableItem[]> {
  return items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, SearchableItem[]>);
}

/**
 * Sort search results by relevance, date, amount, or alphabetically
 */
export function sortResults(
  items: SearchableItem[], 
  sortBy: 'relevance' | 'date' | 'amount' | 'alphabetical' = 'relevance',
  sortOrder: 'asc' | 'desc' = 'desc'
): SearchableItem[] {
  const sortedItems = [...items];

  sortedItems.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date': {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        comparison = dateA - dateB;
        break;
      }
      case 'amount': {
        const amountA = a.amount || 0;
        const amountB = b.amount || 0;
        comparison = amountA - amountB;
        break;
      }
      case 'alphabetical': {
        comparison = a.title.localeCompare(b.title);
        break;
      }
      case 'relevance':
      default: {
        // Sort by priority first, then by title
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;
        comparison = priorityB - priorityA;
        if (comparison === 0) {
          comparison = a.title.localeCompare(b.title);
        }
        break;
      }
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });

  return sortedItems;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  // Use consistent US locale for simple date format
  return date.toLocaleDateString('en-US');
}