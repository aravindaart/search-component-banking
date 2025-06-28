import {
  defaultSearchFilter,
  highlightText,
  groupResultsByCategory,
  sortResults,
  formatCurrency,
  formatDate
} from './searchFilters';
import { SearchableItem } from '../types/search.types';

describe('searchFilters', () => {
  const mockItems: SearchableItem[] = [
    {
      id: 1,
      title: 'John Smith - Checking Account',
      subtitle: 'Account #1234',
      description: 'Primary checking account',
      category: 'account',
      amount: 5000,
      currency: 'USD',
      priority: 2,
      createdAt: '2023-01-15T10:00:00Z',
      status: 'active',
      metadata: { accountType: 'checking', reference: 'CHK001' }
    },
    {
      id: 2,
      title: 'Jane Doe - Savings Account',
      subtitle: 'Account #5678',
      description: 'High yield savings',
      category: 'account',
      amount: 10000,
      currency: 'USD',
      priority: 1,
      createdAt: '2023-02-20T15:30:00Z',
      status: 'active',
      searchableText: 'high yield premium'
    },
    {
      id: 3,
      title: 'Payment to Utility Company',
      subtitle: 'Transaction #9999',
      description: 'Monthly electricity bill',
      category: 'transaction',
      amount: -150,
      currency: 'USD',
      priority: 3,
      createdAt: '2023-03-10T09:15:00Z',
      status: 'completed'
    }
  ];

  describe('defaultSearchFilter', () => {
    it('should sort by title if priorities are equal (relevance fallback)', () => {
      const itemsWithSamePriority: SearchableItem[] = [
        {
          id: 1,
          title: 'Banana Account',
          category: 'account',
          priority: 1
        },
        {
          id: 2,
          title: 'Apple Account',
          category: 'account',
          priority: 1
        }
      ];

      const sorted = sortResults(itemsWithSamePriority, 'relevance', 'asc');

      // Alphabetical order fallback: Apple comes before Banana
      expect(sorted[0].title).toBe('Apple Account');
      expect(sorted[1].title).toBe('Banana Account');
    });

    it('should use default priority 0 when missing', () => {
      const items: SearchableItem[] = [
        {
          id: 1,
          title: 'Alpha',
          category: 'account'
          // no priority
        },
        {
          id: 2,
          title: 'Beta',
          category: 'account'
          // no priority
        }
      ];

      const sorted = sortResults(items, 'relevance', 'asc');

      // priorities are both 0 -> fallback to title comparison
      expect(sorted[0].title).toBe('Alpha');
      expect(sorted[1].title).toBe('Beta');
    });

    it('should return true for empty query', () => {
      expect(defaultSearchFilter(mockItems[0], '')).toBe(true);
      expect(defaultSearchFilter(mockItems[0], '   ')).toBe(true);
    });

    it('should search in title', () => {
      expect(defaultSearchFilter(mockItems[0], 'john')).toBe(true);
      expect(defaultSearchFilter(mockItems[0], 'JOHN')).toBe(true);
      expect(defaultSearchFilter(mockItems[0], 'smith')).toBe(true);
      expect(defaultSearchFilter(mockItems[0], 'checking')).toBe(true);
    });

    it('should search in subtitle', () => {
      expect(defaultSearchFilter(mockItems[0], '1234')).toBe(true);
      expect(defaultSearchFilter(mockItems[0], 'account')).toBe(true);
    });

    it('should search in description', () => {
      expect(defaultSearchFilter(mockItems[0], 'primary')).toBe(true);
      expect(defaultSearchFilter(mockItems[2], 'electricity')).toBe(true);
    });

    it('should search in searchableText', () => {
      expect(defaultSearchFilter(mockItems[1], 'premium')).toBe(true);
      expect(defaultSearchFilter(mockItems[1], 'yield')).toBe(true);
    });

    it('should search in category', () => {
      expect(defaultSearchFilter(mockItems[0], 'account')).toBe(true);
      expect(defaultSearchFilter(mockItems[2], 'transaction')).toBe(true);
    });

    it('should search in metadata', () => {
      expect(defaultSearchFilter(mockItems[0], 'checking')).toBe(true);
      expect(defaultSearchFilter(mockItems[0], 'CHK001')).toBe(true);
    });

    it('should return false for non-matching queries', () => {
      expect(defaultSearchFilter(mockItems[0], 'nonexistent')).toBe(false);
      expect(defaultSearchFilter(mockItems[0], 'xyz')).toBe(false);
    });

    it('should handle items with missing fields', () => {
      const minimalItem: SearchableItem = {
        id: 99,
        title: 'Test Item',
        category: 'other'
      };

      expect(defaultSearchFilter(minimalItem, 'test')).toBe(true);
      expect(defaultSearchFilter(minimalItem, 'other')).toBe(true);
      expect(defaultSearchFilter(minimalItem, 'missing')).toBe(false);
    });
  });

  describe('highlightText', () => {
    it('should return original text for empty query', () => {
      expect(highlightText('Hello World', '')).toBe('Hello World');
      expect(highlightText('Hello World', '   ')).toBe('Hello World');
    });

    it('should highlight matching text', () => {
      expect(highlightText('Hello World', 'Hello')).toBe('<mark>Hello</mark> World');
      expect(highlightText('Hello World', 'World')).toBe('Hello <mark>World</mark>');
      expect(highlightText('Hello World', 'hello')).toBe('<mark>Hello</mark> World');
    });

    it('should highlight multiple occurrences', () => {
      expect(highlightText('Hello Hello World', 'Hello')).toBe('<mark>Hello</mark> <mark>Hello</mark> World');
    });

    it('should escape regex special characters', () => {
      expect(highlightText('Cost: $100.50', '$100')).toBe('Cost: <mark>$100</mark>.50');
      expect(highlightText('Email: test@example.com', '@')).toBe('Email: test<mark>@</mark>example.com');
    });

    it('should be case insensitive', () => {
      expect(highlightText('JavaScript', 'java')).toBe('<mark>Java</mark>Script');
      expect(highlightText('JavaScript', 'SCRIPT')).toBe('Java<mark>Script</mark>');
    });
  });

  describe('groupResultsByCategory', () => {
    it('should group items by category', () => {
      const grouped = groupResultsByCategory(mockItems);

      expect(grouped).toHaveProperty('account');
      expect(grouped).toHaveProperty('transaction');
      expect(grouped.account).toHaveLength(2);
      expect(grouped.transaction).toHaveLength(1);
    });

    it('should handle empty array', () => {
      const grouped = groupResultsByCategory([]);
      expect(grouped).toEqual({});
    });

    it('should handle single category', () => {
      const singleCategoryItems = mockItems.filter(item => item.category === 'account');
      const grouped = groupResultsByCategory(singleCategoryItems);

      expect(Object.keys(grouped)).toHaveLength(1);
      expect(grouped.account).toHaveLength(2);
    });
  });

  describe('sortResults', () => {
    it('should sort by relevance (default)', () => {
      const sorted = sortResults(mockItems);

      // Default relevance sort: higher priority first, but with desc order it's reversed
      expect(sorted[0].priority).toBe(1);
      expect(sorted[1].priority).toBe(2);
      expect(sorted[2].priority).toBe(3);
    });

    it('should sort by relevance ascending', () => {
      const sorted = sortResults(mockItems, 'relevance', 'asc');

      // Ascending relevance: higher priority first
      expect(sorted[0].priority).toBe(3);
      expect(sorted[1].priority).toBe(2);
      expect(sorted[2].priority).toBe(1);
    });

    it('should sort by date descending', () => {
      const sorted = sortResults(mockItems, 'date', 'desc');

      expect(sorted[0].id).toBe(3);
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(1);
    });

    it('should sort by date ascending', () => {
      const sorted = sortResults(mockItems, 'date', 'asc');

      expect(sorted[0].id).toBe(1);
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(3);
    });

    it('should sort by amount descending', () => {
      const sorted = sortResults(mockItems, 'amount', 'desc');

      expect(sorted[0].amount).toBe(10000);
      expect(sorted[1].amount).toBe(5000);
      expect(sorted[2].amount).toBe(-150);
    });

    it('should sort by amount ascending', () => {
      const sorted = sortResults(mockItems, 'amount', 'asc');

      expect(sorted[0].amount).toBe(-150);
      expect(sorted[1].amount).toBe(5000);
      expect(sorted[2].amount).toBe(10000);
    });

    it('should sort alphabetically ascending', () => {
      const sorted = sortResults(mockItems, 'alphabetical', 'asc');

      expect(sorted[0].title).toBe('Jane Doe - Savings Account');
      expect(sorted[1].title).toBe('John Smith - Checking Account');
      expect(sorted[2].title).toBe('Payment to Utility Company');
    });

    it('should sort alphabetically descending', () => {
      const sorted = sortResults(mockItems, 'alphabetical', 'desc');

      expect(sorted[0].title).toBe('Payment to Utility Company');
      expect(sorted[1].title).toBe('John Smith - Checking Account');
      expect(sorted[2].title).toBe('Jane Doe - Savings Account');
    });

    it('should handle items without sort field', () => {
      const itemsWithoutFields: SearchableItem[] = [
        { id: 1, title: 'B Item', category: 'other' },
        { id: 2, title: 'A Item', category: 'other' }
      ];

      const sortedByDate = sortResults(itemsWithoutFields, 'date');
      expect(sortedByDate).toHaveLength(2);

      const sortedByAmount = sortResults(itemsWithoutFields, 'amount');
      expect(sortedByAmount).toHaveLength(2);
    });

    it('should not mutate original array', () => {
      const originalItems = [...mockItems];
      sortResults(mockItems, 'alphabetical');

      expect(mockItems).toEqual(originalItems);
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-500.25)).toBe('-$500.25');
    });

    it('should format other currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('should handle decimal places', () => {
      expect(formatCurrency(10.1)).toBe('$10.10');
      expect(formatCurrency(10.999)).toBe('$11.00'); // Rounds to nearest cent
      expect(formatCurrency(10.995)).toBe('$11.00');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string', () => {
      const formatted = formatDate('2023-06-15T14:30:00Z');
      expect(formatted).toBe('6/15/2023');
    });

    it('should handle different date formats', () => {
      const formatted1 = formatDate('2023-06-15T12:00:00Z');
      const formatted2 = formatDate('2023-12-25T12:00:00Z');

      expect(formatted1).toBe('6/15/2023');
      expect(formatted2).toBe('12/25/2023');
    });

    it('should handle invalid date strings', () => {
      const formatted = formatDate('invalid-date');
      expect(formatted).toBe('Invalid Date');
    });
  });
});