import React, { useMemo, useEffect, useRef } from 'react';
import { Search, Loader } from 'lucide-react';
import clsx from 'clsx';
import { ResultsDropdownProps, SearchableItem } from '../../types/search.types';
import { SearchResult } from '../SearchResult';
import { groupResultsByCategory, sortResults } from '../../utils/searchFilters';
import styles from './ResultsDropdown.module.scss';

/**
 * ResultsDropdown Component
 * Displays search results in a dropdown with grouping, loading states, and error handling
 */
export const ResultsDropdown: React.FC<ResultsDropdownProps> = ({
  results,
  query,
  isOpen,
  loading = false,
  selectedIndex,
  onSelect,
  maxResults = 10,
  groupBy,
  renderResult,
  theme = 'light'
}) => {
  const selectedItemRef = useRef<HTMLLIElement>(null);
  
  // Scroll selected item into view when selectedIndex changes
  useEffect(() => {
    if (selectedIndex >= 0 && selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);
  
  // Process and limit results
  const processedResults = useMemo(() => {
    const sorted = sortResults(results, 'relevance');
    return sorted.slice(0, maxResults);
  }, [results, maxResults]);

  // Group results if groupBy is specified
  const groupedResults = useMemo(() => {
    if (!groupBy || groupBy !== 'category') {
      return { all: processedResults };
    }
    return groupResultsByCategory(processedResults);
  }, [processedResults, groupBy]);

  // Calculate total number of results for keyboard navigation
  const totalResults = processedResults.length;

  // Handle result selection
  const handleResultSelect = (item: SearchableItem) => {
    onSelect(item);
  };

  // Get result index for keyboard navigation
  const getResultIndex = (groupIndex: number, itemIndex: number): number => {
    if (!groupBy) return itemIndex;
    
    let currentIndex = 0;
    const groups = Object.keys(groupedResults);
    
    for (let i = 0; i < groupIndex; i++) {
      currentIndex += groupedResults[groups[i]].length;
    }
    
    return currentIndex + itemIndex;
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className={styles.loadingSkeleton}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={styles.skeletonItem}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonSubtitle} />
          </div>
          <div className={styles.skeletonMeta} />
        </div>
      ))}
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <Search className={styles.emptyIcon} size={48} />
      <h3 className={styles.emptyTitle}>No results found</h3>
      <p className={styles.emptyDescription}>
        {query 
          ? `No results found for "${query}". Try adjusting your search terms.`
          : 'Start typing to search accounts, transactions, and customers.'
        }
      </p>
    </div>
  );

  // Render individual result
  const renderResultItem = (item: SearchableItem, globalIndex: number) => {
    if (renderResult) {
      return renderResult(item);
    }

    return (
      <SearchResult
        key={item.id}
        item={item}
        query={query}
        isSelected={selectedIndex === globalIndex}
        onClick={() => handleResultSelect(item)}
        theme={theme}
      />
    );
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className={clsx(styles.dropdown, {
        [styles.open]: isOpen,
      })}
      data-theme={theme}
      role="listbox"
      aria-label="Search results"
    >
      {/* Header with result count */}
      {query && !loading && (
        <div className={styles.header}>
          {totalResults > 0 
            ? `${totalResults} result${totalResults === 1 ? '' : 's'} for "${query}"`
            : `No results for "${query}"`
          }
        </div>
      )}

      {/* Loading state with spinner and skeleton */}
      {loading && (
        <div className={styles.loadingContainer}>
          <Loader size={24} className={styles.loadingSpinner} />
          {renderLoadingSkeleton()}
        </div>
      )}

      {/* Results container */}
      {!loading && (
        <div className={styles.resultsContainer}>
          {totalResults === 0 ? (
            renderEmptyState()
          ) : (
            <div>
              {Object.entries(groupedResults).map(([groupName, groupResults], groupIndex) => (
                <div key={groupName} className={styles.groupContainer}>
                  {/* Group header (only show if grouping is enabled and there are multiple groups) */}
                  {groupBy && Object.keys(groupedResults).length > 1 && (
                    <div className={styles.groupHeader}>
                      {groupName === 'all' ? 'All Results' : `${groupName}s`}
                      <span> ({groupResults.length})</span>
                    </div>
                  )}
                  
                  {/* Results list */}
                  <ul className={styles.resultsList} role="group">
                    {groupResults.map((item, itemIndex) => {
                      const globalIndex = getResultIndex(groupIndex, itemIndex);
                      return (
                        <li 
                          key={item.id} 
                          className={styles.resultItem}
                          role="presentation"
                          ref={globalIndex === selectedIndex ? selectedItemRef : null}
                        >
                          {renderResultItem(item, globalIndex)}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer with keyboard navigation hints */}
      {totalResults > 0 && !loading && (
        <div className={styles.footer}>
          Use ↑↓ arrow keys to navigate, Enter to select, Esc to close
        </div>
      )}
    </div>
  );
};