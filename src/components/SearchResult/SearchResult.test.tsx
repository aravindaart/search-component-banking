import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchResult } from './SearchResult';
import { SearchableItem } from '../../types/search.types';

// Mock the utils
jest.mock('../../utils/searchFilters', () => ({
  formatCurrency: jest.fn((amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }),
  formatDate: jest.fn((date) => new Date(date).toLocaleDateString('en-US')),
  highlightText: jest.fn((text, query) => {
    if (!query) return text;
    return text.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
  })
}));

describe('SearchResult', () => {
  const mockOnClick = jest.fn();

  const mockItem: SearchableItem = {
    id: 1,
    title: 'John Smith - Checking Account',
    subtitle: 'Account #1234',
    description: 'Primary checking account',
    category: 'account',
    amount: 5000,
    currency: 'USD',
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with basic item data', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(screen.getByRole('option')).toBeInTheDocument();
    expect(screen.getByText('John Smith - Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Account #1234')).toBeInTheDocument();
    expect(screen.getByText('Primary checking account')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('option');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Enter key is pressed', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('option');
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Space key is pressed', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('option');
    fireEvent.keyDown(button, { key: ' ' });

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick for other keys', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('option');
    fireEvent.keyDown(button, { key: 'Tab' });

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should show selected state', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
        isSelected={true}
      />
    );

    const button = screen.getByRole('option');
    expect(button).toHaveClass('selected');
    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('should show unselected state', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
        isSelected={false}
      />
    );

    const button = screen.getByRole('option');
    expect(button).not.toHaveClass('selected');
    expect(button).toHaveAttribute('aria-selected', 'false');
  });

  it('should display category icon for account', () => {
    render(
      <SearchResult
        item={{ ...mockItem, category: 'account' }}
        query=""
        onClick={mockOnClick}
      />
    );

    // Building2 icon should be rendered for account category
    expect(document.querySelector('.icon')).toBeInTheDocument();
  });

  it('should display category icon for transaction', () => {
    render(
      <SearchResult
        item={{ ...mockItem, category: 'transaction' }}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.icon')).toBeInTheDocument();
  });

  it('should display category icon for customer', () => {
    render(
      <SearchResult
        item={{ ...mockItem, category: 'customer' }}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.icon')).toBeInTheDocument();
  });

  it('should display category icon for card', () => {
    render(
      <SearchResult
        item={{ ...mockItem, category: 'card' }}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.icon')).toBeInTheDocument();
  });

  it('should display category icon for investment', () => {
    render(
      <SearchResult
        item={{ ...mockItem, category: 'investment' }}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.icon')).toBeInTheDocument();
  });

  it('should display default icon for other categories', () => {
    render(
      <SearchResult
        item={{ ...mockItem, category: 'other' }}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.icon')).toBeInTheDocument();
  });

  it('should display avatar when provided', () => {
    const itemWithAvatar = {
      ...mockItem,
      avatar: 'https://example.com/avatar.jpg'
    };

    render(
      <SearchResult
        item={itemWithAvatar}
        query=""
        onClick={mockOnClick}
      />
    );

    const avatar = document.querySelector('.avatar img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveAttribute('alt', 'John Smith - Checking Account');
  });

  it('should format and display positive amount', () => {
    render(
      <SearchResult
        item={{ ...mockItem, amount: 1500.50 }}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('$1,500.50')).toBeInTheDocument();
    expect(document.querySelector('.amount.positive')).toBeInTheDocument();
  });

  it('should format and display negative amount', () => {
    render(
      <SearchResult
        item={{ ...mockItem, amount: -250.75 }}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('-$250.75')).toBeInTheDocument();
    expect(document.querySelector('.amount.negative')).toBeInTheDocument();
  });

  it('should not display amount when not provided', () => {
    const itemWithoutAmount = { ...mockItem };
    delete itemWithoutAmount.amount;

    render(
      <SearchResult
        item={itemWithoutAmount}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.amount')).not.toBeInTheDocument();
  });

  it('should display status badge', () => {
    render(
      <SearchResult
        item={{ ...mockItem, status: 'active' }}
        query=""
        onClick={mockOnClick}
      />
    );

    const status = document.querySelector('.status.active');
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent('active');
  });

  it('should not display status when not provided', () => {
    const itemWithoutStatus = { ...mockItem };
    delete itemWithoutStatus.status;

    render(
      <SearchResult
        item={itemWithoutStatus}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.status')).not.toBeInTheDocument();
  });

  it('should display category', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText('account')).toBeInTheDocument();
  });

  it('should display formatted date', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    // The date should be formatted by formatDate mock (US format: M/D/YYYY)
    expect(screen.getByText('1/15/2023')).toBeInTheDocument();
  });

  it('should not display date when not provided', () => {
    const itemWithoutDate = { ...mockItem };
    delete itemWithoutDate.createdAt;

    render(
      <SearchResult
        item={itemWithoutDate}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.date')).not.toBeInTheDocument();
  });

  it('should highlight search query in title', () => {
    render(
      <SearchResult
        item={mockItem}
        query="John"
        onClick={mockOnClick}
      />
    );

    // Should use dangerouslySetInnerHTML with highlighted text
    const title = document.querySelector('.title');
    expect(title?.innerHTML).toContain('<mark>John</mark>');
  });

  it('should highlight search query in subtitle', () => {
    render(
      <SearchResult
        item={mockItem}
        query="1234"
        onClick={mockOnClick}
      />
    );

    const subtitle = document.querySelector('.subtitle');
    expect(subtitle?.innerHTML).toContain('<mark>1234</mark>');
  });

  it('should highlight search query in description', () => {
    render(
      <SearchResult
        item={mockItem}
        query="Primary"
        onClick={mockOnClick}
      />
    );

    const description = document.querySelector('.description');
    expect(description?.innerHTML).toContain('<mark>Primary</mark>');
  });

  it('should not render subtitle when not provided', () => {
    const itemWithoutSubtitle = { ...mockItem };
    delete itemWithoutSubtitle.subtitle;

    render(
      <SearchResult
        item={itemWithoutSubtitle}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.subtitle')).not.toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    const itemWithoutDescription = { ...mockItem };
    delete itemWithoutDescription.description;

    render(
      <SearchResult
        item={itemWithoutDescription}
        query=""
        onClick={mockOnClick}
      />
    );

    expect(document.querySelector('.description')).not.toBeInTheDocument();
  });

  it('should apply theme attribute', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
        theme="dark"
      />
    );

    const button = screen.getByRole('option');
    expect(button).toHaveAttribute('data-theme', 'dark');
  });

  it('should apply category data attribute', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('option');
    expect(button).toHaveAttribute('data-category', 'account');
  });

  it('should have proper ARIA attributes', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
        isSelected={true}
      />
    );

    const button = screen.getByRole('option');
    expect(button).toHaveAttribute('role', 'option');
    expect(button).toHaveAttribute('aria-selected', 'true');
  });

  it('should prevent default on keydown for handled keys', () => {
    render(
      <SearchResult
        item={mockItem}
        query=""
        onClick={mockOnClick}
      />
    );

    const button = screen.getByRole('option');
    
    // Test Enter key
    const enterEvent = fireEvent.keyDown(button, { key: 'Enter' });
    expect(enterEvent).toBe(false); // fireEvent returns false if preventDefault was called
    
    // Test Space key  
    const spaceEvent = fireEvent.keyDown(button, { key: ' ' });
    expect(spaceEvent).toBe(false); // fireEvent returns false if preventDefault was called
  });
});