import React, { forwardRef } from 'react';
import { Search, X, Loader, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { SearchInputProps } from '../../types/search.types';
import styles from './SearchInput.module.scss';

/**
 * SearchInput Component
 * A sophisticated search input with loading states, clear functionality, and error handling
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    value,
    onChange,
    onClear,
    onSubmit,
    placeholder = "Search accounts, transactions, customers...",
    loading = false,
    disabled = false,
    error,
    size = 'medium',
    variant = 'outlined',
    theme = 'light',
    ariaLabel,
    ariaDescribedBy,
    showSearchButton = false,
    onFocus,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHaspopup,
    'aria-owns': ariaOwns,
    'aria-autocomplete': ariaAutocomplete,
    ...inputProps
  }, ref) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    const handleClearClick = () => {
      onClear();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
      // Let arrow keys bubble up for keyboard navigation
      // Don't prevent default for ArrowUp, ArrowDown, Home, End, Escape
      if (['ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape'].includes(e.key)) {
        // Allow the event to bubble up to document for keyboard navigation
        return;
      }
    };

    const handleSearchClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onSubmit) {
        onSubmit();
      }
    };

    const showClearButton = value.length > 0 && !loading && !disabled;

    return (
      <div className={styles.searchInput} data-theme={theme}>
        <div className={clsx(styles.inputWrapper, styles[size], {
          [styles.withSearchButton]: showSearchButton,
        })}>
          <Search className={styles.searchIcon} size={20} />
          
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              styles.input,
              styles[size],
              styles[variant],
              {
                [styles.error]: error,
                [styles.withSearchButton]: showSearchButton,
              }
            )}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-expanded={ariaExpanded}
            aria-haspopup={ariaHaspopup}
            aria-owns={ariaOwns}
            aria-autocomplete={ariaAutocomplete}
            autoComplete="off"
            spellCheck="false"
            role="combobox"
            {...inputProps}
          />

          {loading && (
            <Loader className={styles.loadingSpinner} size={18} />
          )}

          {showSearchButton && (
            <button
              type="button"
              onClick={handleSearchClick}
              disabled={disabled}
              className={clsx(styles.searchButton, styles[size], {
                [styles.inactive]: !value.trim()
              })}
              aria-label="Search"
            >
              <Search size={16} />
            </button>
          )}

          {showClearButton && (
            <button
              type="button"
              onClick={handleClearClick}
              className={clsx(styles.clearButton, {
                [styles.visible]: showClearButton
              })}
              aria-label="Clear search"
              tabIndex={-1}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {error && (
          <div className={styles.errorMessage} role="alert">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';