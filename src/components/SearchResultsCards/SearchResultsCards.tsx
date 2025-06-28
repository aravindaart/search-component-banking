import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { SearchableItem } from '../../types/search.types';
import { SearchResult } from '../SearchResult';
import styles from './SearchResultsCards.module.scss';

export interface SearchResultsCardsProps {
  results: SearchableItem[];
  query: string;
  loading?: boolean;
  onSelect: (item: SearchableItem) => void;
  maxResults?: number;
  groupBy?: keyof SearchableItem;
  renderResult?: (item: SearchableItem) => React.ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
  selectedIndex?: number;
}

/**
 * SearchResultsCards Component
 * Displays search results as cards in a grid layout that fits the container
 */
export const SearchResultsCards: React.FC<SearchResultsCardsProps> = ({
  results,
  query,
  loading = false,
  onSelect,
  maxResults = 10,
  groupBy,
  renderResult,
  theme = 'light',
  className,
  selectedIndex = -1
}) => {
  const selectedCardRef = useRef<HTMLDivElement>(null);

  // Scroll selected card into view when selectedIndex changes
  useEffect(() => {
    if (selectedIndex >= 0 && selectedCardRef.current) {
      selectedCardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    }
  }, [selectedIndex]);
  if (loading) {
    return (
      <div className={clsx(styles.container, className)} data-theme={theme}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.skeletonCard}>
                <div className={styles.skeletonAvatar} />
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonSubtitle} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={clsx(styles.container, className)} data-theme={theme}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>No results found</h3>
          <p className={styles.emptyDescription}>
            Try adjusting your search terms or browse by category
          </p>
        </div>
      </div>
    );
  }

  // Group results if groupBy is specified
  const groupedResults = groupBy 
    ? results.reduce((groups, item) => {
        const key = String(item[groupBy] || 'other');
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
        return groups;
      }, {} as Record<string, SearchableItem[]>)
    : { all: results };

  const displayResults = Object.values(groupedResults).flat().slice(0, maxResults);

  return (
    <div className={clsx(styles.container, className)} data-theme={theme}>
      {groupBy ? (
        // Grouped results
        <div className={styles.groupedContainer}>
          {Object.entries(groupedResults).map(([groupName, groupItems]) => {
            const globalStartIndex = displayResults.findIndex(item => item === groupItems[0]);
            return (
              <div key={groupName} className={styles.group}>
                <h3 className={styles.groupTitle}>{groupName}</h3>
                <div className={styles.cardsGrid}>
                  {groupItems.slice(0, maxResults).map((item, localIndex) => {
                    const globalIndex = globalStartIndex + localIndex;
                    return (
                      <div 
                        key={item.id} 
                        className={styles.cardWrapper}
                        ref={globalIndex === selectedIndex ? selectedCardRef : null}
                      >
                        {renderResult ? (
                          renderResult(item)
                        ) : (
                          <SearchResult
                            item={item}
                            query={query}
                            onClick={() => onSelect(item)}
                            theme={theme}
                            isSelected={globalIndex === selectedIndex}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Ungrouped results
        <div className={styles.cardsGrid}>
          {displayResults.map((item, index) => (
            <div 
              key={item.id} 
              className={styles.cardWrapper}
              ref={index === selectedIndex ? selectedCardRef : null}
            >
              {renderResult ? (
                renderResult(item)
              ) : (
                <SearchResult
                  item={item}
                  query={query}
                  onClick={() => onSelect(item)}
                  theme={theme}
                  isSelected={index === selectedIndex}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};