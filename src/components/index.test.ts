/**
 * Test file for components/index.ts
 * Tests all component exports to ensure proper module structure
 */

import {
  SmartSearch,
  SearchInput,
  SearchResult,
  ResultsDropdown,
  SearchResultsCards
} from './index';

describe('Components Index Exports', () => {
  it('should export SmartSearch component', () => {
    expect(SmartSearch).toBeDefined();
    expect(typeof SmartSearch).toBe('function');
  });

  it('should export SearchInput component', () => {
    expect(SearchInput).toBeDefined();
    expect(typeof SearchInput).toBe('object'); // forwardRef creates an object
  });

  it('should export SearchResult component', () => {
    expect(SearchResult).toBeDefined();
    expect(typeof SearchResult).toBe('function');
  });

  it('should export ResultsDropdown component', () => {
    expect(ResultsDropdown).toBeDefined();
    expect(typeof ResultsDropdown).toBe('function');
  });

  it('should export SearchResultsCards component', () => {
    expect(SearchResultsCards).toBeDefined();
    expect(typeof SearchResultsCards).toBe('function');
  });

  it('should export all expected components', () => {
    // Ensure all exports are present
    const exports = {
      SmartSearch,
      SearchInput,
      SearchResult,
      ResultsDropdown,
      SearchResultsCards
    };

    // Verify we have exactly 5 exports
    expect(Object.keys(exports)).toHaveLength(5);
    
    // Verify none are undefined
    Object.values(exports).forEach(exportedComponent => {
      expect(exportedComponent).toBeDefined();
    });
  });
});