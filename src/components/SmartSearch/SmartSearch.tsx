import React, { useState, useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';
import { SmartSearchProps, SearchableItem } from '../../types/search.types';
import { SearchInput } from '../SearchInput';
import { ResultsDropdown } from '../ResultsDropdown';
import { SearchResultsCards } from '../SearchResultsCards';
import { useDebounce } from '../../hooks/useDebounce';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { useClickOutside } from '../../hooks/useClickOutside';
import { defaultSearchFilter } from '../../utils/searchFilters';
import styles from './SmartSearch.module.scss';

/**
 * SmartSearch Component
 * Main container component that orchestrates the search experience
 * Combines SearchInput and ResultsDropdown with intelligent state management
 */
export const SmartSearch: React.FC<SmartSearchProps> = ({
  data,
  onSearch,
  onSelect,
  placeholder = "Search accounts, transactions, customers...",
  debounceMs = 300,
  minSearchLength = 1,
  maxResults = 10,
  searchOnSubmit = false,
  showSearchButton = false,
  resultsDisplayMode = 'dropdown',
  theme = 'light',
  size = 'medium',
  variant = 'outlined',
  loading = false,
  disabled = false,
  error,
  ariaLabel,
  ariaDescribedBy,
  customFilter,
  renderResult,
  groupBy
}) => {
  
  // State management
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState<SearchableItem[]>([]);

  // Reset submitted query when switching from searchOnSubmit mode
  useEffect(() => {
    if (!searchOnSubmit) {
      setSubmittedQuery('');
      // When switching back to live search mode, ensure we search immediately if there's a query
      // The debouncedQuery effect will handle this automatically
    }
  }, [searchOnSubmit]);
  
  // Refs
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounced search query (only used for non-submit mode)
  const debouncedQuery = useDebounce(query, debounceMs);
  
  // Determine which query to use for search
  const searchQuery = searchOnSubmit ? submittedQuery : debouncedQuery;
  

  // Filter results based on search query
  useEffect(() => {
    
    if (!searchQuery.trim() || searchQuery.length < minSearchLength) {
      setFilteredResults([]);
      if (resultsDisplayMode === 'dropdown') {
        setIsOpen(false);
      }
      return;
    }

    const filterFn = customFilter || defaultSearchFilter;
    const results = data.filter(item => filterFn(item, searchQuery));
    
    setFilteredResults(results);
    if (resultsDisplayMode === 'dropdown') {
      setIsOpen(results.length > 0);
    }
    
    // Call external search handler if provided
    if (onSearch) {
      onSearch(searchQuery);
    }
  }, [searchQuery, data, minSearchLength, customFilter, onSearch, resultsDisplayMode]);

  // Keyboard navigation - active when we have results in either mode
  const isNavigationActive = resultsDisplayMode === 'dropdown' ? isOpen : filteredResults.length > 0;
  
  
  const { selectedIndex, setSelectedIndex } = useKeyboardNavigation(
    filteredResults.length,
    (index) => handleResultSelect(filteredResults[index]),
    () => {
      if (resultsDisplayMode === 'dropdown') {
        setIsOpen(false);
      }
      // For cards mode, we could clear selection or do nothing
    },
    isNavigationActive
  );

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    if (!searchOnSubmit && value.trim().length >= minSearchLength && resultsDisplayMode === 'dropdown') {
      setIsOpen(true);
    }
  }, [minSearchLength, searchOnSubmit, resultsDisplayMode]);

  // Handle search submit (Enter key or search button click)
  const handleSearchSubmit = useCallback(() => {
    // Only execute if we're actually in submit mode
    if (!searchOnSubmit) {
        return;
    }
    
    const trimmedQuery = query.trim();
    // Always set the submitted query, even if it's empty (to clear results)
    setSubmittedQuery(trimmedQuery);
  }, [query, searchOnSubmit]);

  // Handle input clear
  const handleInputClear = useCallback(() => {
    setQuery('');
    setSubmittedQuery('');
    setFilteredResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [setSelectedIndex]);

  // Handle result selection
  const handleResultSelect = useCallback((item: SearchableItem) => {
    if (onSelect) {
      onSelect(item);
    }
    if (resultsDisplayMode === 'dropdown') {
      setIsOpen(false);
    }
    setQuery(''); // Optional: clear query after selection
    setSubmittedQuery('');
    inputRef.current?.blur();
  }, [onSelect, resultsDisplayMode]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (!searchOnSubmit && resultsDisplayMode === 'dropdown' && query.trim().length >= minSearchLength && filteredResults.length > 0) {
      setIsOpen(true);
    }
  }, [searchOnSubmit, resultsDisplayMode, query, minSearchLength, filteredResults.length]);

  // Generate unique IDs for accessibility
  const searchId = `smart-search-${Math.random().toString(36).substr(2, 9)}`;
  const dropdownId = `${searchId}-dropdown`;
  const errorId = error ? `${searchId}-error` : undefined;

  // Always provide submit handler, but it will check searchOnSubmit internally
  const submitHandler = handleSearchSubmit;
  const shouldShowSearchButton = searchOnSubmit && showSearchButton;
  

  return (
    <div 
      ref={containerRef}
      className={clsx(styles.smartSearch, styles[size], {
        [styles.fullWidth]: size === 'large'
      })}
      data-theme={theme}
    >
      <div className={styles.container}>
        {/* Search Input */}
        <div className={styles.inputContainer}>
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            onClear={handleInputClear}
            onSubmit={submitHandler}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            loading={loading}
            disabled={disabled}
            error={error}
            size={size}
            variant={variant}
            theme={theme}
            showSearchButton={shouldShowSearchButton}
            ariaLabel={ariaLabel}
            ariaDescribedBy={clsx(ariaDescribedBy, errorId)}
            {...(resultsDisplayMode === 'dropdown' && {
              'aria-expanded': isOpen,
              'aria-haspopup': 'listbox' as const,
              'aria-owns': dropdownId,
              'aria-autocomplete': 'list' as const
            })}
          />
        </div>

        {/* Results Dropdown */}
        {resultsDisplayMode === 'dropdown' && (
          <div className={styles.dropdownContainer}>
            <ResultsDropdown
              results={filteredResults}
              query={searchQuery}
              isOpen={isOpen && !disabled}
              loading={loading}
              selectedIndex={selectedIndex}
              onSelect={handleResultSelect}
              onClose={() => setIsOpen(false)}
              maxResults={maxResults}
              groupBy={groupBy}
              renderResult={renderResult}
              theme={theme}
            />
          </div>
        )}
      </div>

      {/* Results Cards - displayed below container */}
      {resultsDisplayMode === 'cards' && (
        <SearchResultsCards
          results={filteredResults}
          query={searchQuery}
          loading={loading}
          onSelect={handleResultSelect}
          maxResults={maxResults}
          groupBy={groupBy}
          renderResult={renderResult}
          theme={theme}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};