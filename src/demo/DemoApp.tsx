import React, { useState, useCallback, useEffect } from 'react';
import { Sun, Moon, Info } from 'lucide-react';
import { SmartSearch } from '../components/SmartSearch';
import { SearchableItem } from '../types/search.types';
import { mockBankingData } from './mockData';
import styles from './DemoApp.module.scss';

/**
 * Demo Application for Search Component Banking
 * Showcases all features and capabilities of the search component
 */
export const DemoApp: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('light');
  const [searchSize, setSearchSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [minimumSearchLength, setMinimumSearchLength] = useState<number>(1);
  const [searchDebounce, setSearchDebounce] = useState<number>(300);
  const [searchVariant, setSearchVariant] = useState<'outlined' | 'filled'>('outlined');
  const [enableGrouping, setEnableGrouping] = useState(false);
  const [maxResults, setMaxResults] = useState(10);
  const [selectedResult, setSelectedResult] = useState<SearchableItem | null>(null);
  const [searchLog, setSearchLog] = useState<string[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [searchOnSubmit, setSearchOnSubmit] = useState<boolean>(false);
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false);
  const [resultsDisplayMode, setResultsDisplayMode] = useState<'dropdown' | 'cards'>('dropdown');
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000); // 2 second initial load

    return () => clearTimeout(timer);
  }, []);

  // Auto-disable showSearchButton when searchOnSubmit is turned off
  useEffect(() => {
    if (!searchOnSubmit) {
      setShowSearchButton(false);
    }
  }, [searchOnSubmit, showSearchButton]);

  // Handle search events
  const handleSearch = useCallback((query: string) => {
    setIsError(false);
    setSearchLog(prev => [`Search: "${query}" at ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 9)]);
  }, []);

  // Handle result selection
  const handleSelect = useCallback((item: SearchableItem) => {
    setSelectedResult(item);
    setSearchLog(prev => [`Selected: ${item.title} (${item.category})`, ...prev.slice(0, 9)]);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setSelectedTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getThemeIcon = () => {
    return selectedTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />;
  };

  // Show loading screen during initial load
  if (isInitialLoading) {
    return (
      <div className={styles.demoApp} data-theme={selectedTheme}>
        <div className={styles.loadingScreen}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
          <h1 className={styles.loadingTitle}>Search Component Banking</h1>
          <p className={styles.loadingText}>Loading search component...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.demoApp} data-theme={selectedTheme}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Search Component Banking</h1>
              <p className={styles.subtitle}>
                Professional search component for banking applications
              </p>
            </div>
            
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${selectedTheme === 'light' ? 'dark' : 'light'} theme`}
            >
              {getThemeIcon()}
              <span className={styles.themeLabel}>{selectedTheme === 'light' ? 'dark' : 'light'}</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Search Demo Section */}
          <section className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <SmartSearch
                data={mockBankingData}
                onSearch={handleSearch}
                onSelect={handleSelect}
                placeholder="Search accounts, transactions, customers, cards..."
                theme={selectedTheme}
                size={searchSize}
                variant={searchVariant}
                maxResults={maxResults}
                groupBy={enableGrouping ? 'category' : undefined}
                ariaLabel="Demo banking search"
                debounceMs={searchDebounce}
                minSearchLength={minimumSearchLength}
                error={isError ? 'Error: Something went wrong' : undefined}
                disabled={isDisabled}
                searchOnSubmit={searchOnSubmit}
                showSearchButton={showSearchButton}
                resultsDisplayMode={resultsDisplayMode}
              />
            </div>
          </section>

          {/* Configuration Panel */}
          <section className={styles.configSection}>
            <h2 className={styles.sectionTitle}>Configuration</h2>
            
            <div className={styles.configGrid}>
              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Debouce</label>
                <select 
                  className={styles.configSelect}
                  value={searchDebounce}
                  onChange={(e) => setSearchDebounce(Number(e.target.value))}
                >
                  <option value={300}>0.3 Second</option>
                  <option value={500}>0.5 Seconds</option>
                  <option value={1000}>1 Seconds</option>
                </select>
              </div>
              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Min Search Length</label>
                <select 
                  className={styles.configSelect}
                  value={minimumSearchLength}
                  onChange={(e) => setMinimumSearchLength(Number(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Size</label>
                <select 
                  className={styles.configSelect}
                  value={searchSize}
                  onChange={(e) => setSearchSize(e.target.value as 'small' | 'medium' | 'large')}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Variant</label>
                <select 
                  className={styles.configSelect}
                  value={searchVariant}
                  onChange={(e) => setSearchVariant(e.target.value as 'outlined' | 'filled')}
                >
                  <option value="outlined">Outlined</option>
                  <option value="filled">Filled</option>
                </select>
              </div>

              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Max Results</label>
                <select 
                  className={styles.configSelect}
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className={styles.configGroup}>
                <label className={styles.configCheckbox}>
                  <input 
                    type="checkbox"
                    checked={enableGrouping}
                    onChange={(e) => setEnableGrouping(e.target.checked)}
                  />
                  <span className={styles.checkboxLabel}>Group by Category</span>
                </label>
              </div>
              <div className={styles.configGroup}>
                <label className={styles.configCheckbox}>
                  <input 
                    type="checkbox"
                    checked={isError}
                    onChange={(e) => setIsError(e.target.checked)}
                  />
                  <span className={styles.checkboxLabel}>Display error</span>
                </label>
              </div>
              <div className={styles.configGroup}>
                <label className={styles.configCheckbox}>
                  <input 
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) => setIsDisabled(e.target.checked)}
                  />
                  <span className={styles.checkboxLabel}>Disable</span>
                </label>
              </div>

              <div className={styles.configGroup}>
                <label className={styles.configLabel}>Results Display</label>
                <select 
                  className={styles.configSelect}
                  value={resultsDisplayMode}
                  onChange={(e) => setResultsDisplayMode(e.target.value as 'dropdown' | 'cards')}
                >
                  <option value="dropdown">Dropdown</option>
                  <option value="cards">Cards</option>
                </select>
              </div>

              <div className={styles.configGroup}>
                <label className={styles.configCheckbox}>
                  <input 
                    type="checkbox"
                    checked={searchOnSubmit}
                    onChange={(e) => setSearchOnSubmit(e.target.checked)}
                  />
                  <span className={styles.checkboxLabel}>Search on Submit</span>
                </label>
              </div>

              <div className={styles.configGroup}>
                <label className={styles.configCheckbox}>
                  <input 
                    type="checkbox"
                    checked={showSearchButton}
                    onChange={(e) => setShowSearchButton(e.target.checked)}
                    disabled={!searchOnSubmit}
                  />
                  <span className={styles.checkboxLabel}>Show Search Button</span>
                </label>
              </div>
            </div>
          </section>

          {/* Results Display */}
          <div className={styles.resultsGrid}>
            {/* Selected Result */}
            <section className={styles.selectedSection}>
              <h2 className={styles.sectionTitle}>Selected Result</h2>
              {selectedResult ? (
                <div className={styles.selectedResult}>
                  <div className={styles.resultHeader}>
                    <h3 className={styles.resultTitle}>{selectedResult.title}</h3>
                    <span className={styles.resultCategory}>{selectedResult.category}</span>
                  </div>
                  
                  {selectedResult.subtitle && (
                    <p className={styles.resultSubtitle}>{selectedResult.subtitle}</p>
                  )}
                  
                  {selectedResult.description && (
                    <p className={styles.resultDescription}>{selectedResult.description}</p>
                  )}
                  
                  <div className={styles.resultMeta}>
                    {selectedResult.amount && (
                      <div className={styles.metaItem}>
                        <strong>Amount:</strong> {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: selectedResult.currency || 'USD'
                        }).format(selectedResult.amount)}
                      </div>
                    )}
                    
                    {selectedResult.status && (
                      <div className={styles.metaItem}>
                        <strong>Status:</strong> 
                        <span className={`${styles.statusBadge} ${styles[selectedResult.status]}`}>
                          {selectedResult.status}
                        </span>
                      </div>
                    )}
                    
                    {selectedResult.createdAt && (
                      <div className={styles.metaItem}>
                        <strong>Created:</strong> {new Date(selectedResult.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Info className={styles.emptyIcon} size={48} />
                  <p>Select a search result to view details</p>
                </div>
              )}
            </section>

            {/* Search Log */}
            <section className={styles.logSection}>
              <h2 className={styles.sectionTitle}>Activity Log</h2>
              <div className={styles.searchLog}>
                {searchLog.length > 0 ? (
                  <ul className={styles.logList}>
                    {searchLog.map((entry, index) => (
                      <li key={index} className={styles.logEntry}>
                        {entry}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.emptyLog}>
                    <p>Search activity will appear here</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p className={styles.footerText}>
              Search Component Banking • Built with React, TypeScript, and SCSS
            </p>
            <p className={styles.footerVersion}>
              Version 1.0.0 • {mockBankingData.length} sample records
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};