import React from 'react';
import { 
  CreditCard, 
  Building2, 
  ArrowUpDown, 
  User, 
  TrendingUp,
  FileText 
} from 'lucide-react';
import clsx from 'clsx';
import { SearchResultProps } from '../../types/search.types';
import { formatCurrency, formatDate, highlightText } from '../../utils/searchFilters';
import styles from './SearchResult.module.scss';

/**
 * SearchResult Component
 * Displays individual search results with banking-specific formatting and highlighting
 */
export const SearchResult: React.FC<SearchResultProps> = ({
  item,
  query,
  isSelected = false,
  onClick,
  theme = 'light'
}) => {
  
  // Get appropriate icon for the item category
  const getCategoryIcon = () => {
    switch (item.category) {
      case 'account':
        return <Building2 size={20} />;
      case 'transaction':
        return <ArrowUpDown size={20} />;
      case 'customer':
        return <User size={20} />;
      case 'card':
        return <CreditCard size={20} />;
      case 'investment':
        return <TrendingUp size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  // Format amount with proper styling
  const renderAmount = () => {
    if (typeof item.amount !== 'number') return null;
    
    const formattedAmount = formatCurrency(item.amount, item.currency);
    const amountClass = clsx(styles.amount, {
      [styles.positive]: item.amount > 0,
      [styles.negative]: item.amount < 0
    });
    
    return <div className={amountClass}>{formattedAmount}</div>;
  };

  // Format status with appropriate styling
  const renderStatus = () => {
    if (!item.status) return null;
    
    return (
      <div className={clsx(styles.status, styles[item.status])}>
        {item.status}
      </div>
    );
  };

  const handleClick = () => {
    onClick();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      className={clsx(styles.searchResult, styles.result, {
        [styles.selected]: isSelected
      })}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-category={item.category}
      data-theme={theme}
      role="option"
      aria-selected={isSelected}
    >
      {/* Avatar or Icon */}
      {item.avatar ? (
        <div className={styles.avatar}>
          <img src={item.avatar} alt={item.title} />
        </div>
      ) : (
        <div className={styles.icon}>
          {getCategoryIcon()}
        </div>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        <h3 
          className={styles.title}
          dangerouslySetInnerHTML={{ 
            __html: highlightText(item.title, query) 
          }}
        />
        
        {item.subtitle && (
          <p 
            className={styles.subtitle}
            dangerouslySetInnerHTML={{ 
              __html: highlightText(item.subtitle, query) 
            }}
          />
        )}
        
        {item.description && (
          <p 
            className={styles.description}
            dangerouslySetInnerHTML={{ 
              __html: highlightText(item.description, query) 
            }}
          />
        )}
      </div>

      {/* Metadata */}
      <div className={styles.metadata}>
        {renderAmount()}
        {renderStatus()}
        
        <div className={styles.category}>
          {item.category}
        </div>
        
        {item.createdAt && (
          <div className={styles.date}>
            {formatDate(item.createdAt)}
          </div>
        )}
      </div>
    </button>
  );
};