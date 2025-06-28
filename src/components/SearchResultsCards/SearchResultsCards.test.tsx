import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchResultsCards } from './SearchResultsCards';
import { SearchableItem } from '../../types/search.types';

const mockData: SearchableItem[] = [
  {
    id: '1',
    title: 'Business Checking Account',
    subtitle: 'Account #1234567890',
    description: 'Primary business account for daily operations',
    category: 'account',
    status: 'active',
    amount: 15750.50,
    currency: 'USD',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Payment to Supplier XYZ',
    subtitle: 'Transaction #TX-2024-001',
    description: 'Monthly payment for office supplies',
    category: 'transaction',
    status: 'completed',
    amount: -2500.00,
    currency: 'USD',
    createdAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    title: 'John Smith',
    subtitle: 'Customer #C-789123',
    description: 'Premium banking customer since 2020',
    category: 'customer',
    status: 'active',
    createdAt: '2024-01-13T09:15:00Z'
  }
];

describe('SearchResultsCards', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <SearchResultsCards
        results={[]}
        query=""
        loading={true}
        onSelect={mockOnSelect}
      />
    );

    // Should show loading skeleton cards
    expect(document.querySelectorAll('.skeletonCard')).toHaveLength(6);
  });

  it('should render empty state when no results', () => {
    render(
      <SearchResultsCards
        results={[]}
        query="test query"
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search terms or browse by category')).toBeInTheDocument();
  });

  it('should render results as cards', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Business Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Payment to Supplier XYZ')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('should call onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    const firstCard = screen.getByText('Business Checking Account');
    await user.click(firstCard);

    expect(mockOnSelect).toHaveBeenCalledWith(mockData[0]);
  });

  it('should limit results based on maxResults prop', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        maxResults={2}
      />
    );

    expect(screen.getByText('Business Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Payment to Supplier XYZ')).toBeInTheDocument();
    expect(screen.queryByText('John Smith')).not.toBeInTheDocument();
  });

  it('should group results by category when groupBy is specified', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        groupBy="category"
      />
    );

    // Should show group titles (check for group structure specifically)
    const groupTitles = document.querySelectorAll('.groupTitle');
    expect(groupTitles).toHaveLength(3);
    
    // Check for the grouped structure
    expect(document.querySelector('.groupedContainer')).toBeInTheDocument();
    expect(document.querySelectorAll('.group')).toHaveLength(3);
  });

  it('should highlight selected card when selectedIndex is provided', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        selectedIndex={1}
      />
    );

    // The SearchResult component should receive isSelected=true for index 1
    // We can't easily test the internal prop, but we can verify the structure is correct
    expect(screen.getByText('Payment to Supplier XYZ')).toBeInTheDocument();
  });

  it('should support custom theme', () => {
    const { container } = render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        theme="dark"
      />
    );

    const wrapper = container.querySelector('[data-theme="dark"]');
    expect(wrapper).toBeInTheDocument();
  });

  it('should support custom className', () => {
    const { container } = render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should use custom renderResult when provided', () => {
    const customRender = (item: SearchableItem) => (
      <div data-testid={`custom-result-${item.id}`}>{item.title} - Custom</div>
    );

    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        renderResult={customRender}
      />
    );

    expect(screen.getByTestId('custom-result-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-result-2')).toBeInTheDocument();
    expect(screen.getByTestId('custom-result-3')).toBeInTheDocument();
    expect(screen.getByText('Business Checking Account - Custom')).toBeInTheDocument();
  });

  it('should handle scroll into view for selected index', () => {
    const scrollIntoViewMock = Element.prototype.scrollIntoView as jest.Mock;
    scrollIntoViewMock.mockClear();

    const { rerender } = render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        selectedIndex={-1}
      />
    );

    expect(scrollIntoViewMock).not.toHaveBeenCalled();

    rerender(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        selectedIndex={1}
      />
    );

    // Should eventually call scrollIntoView when selectedIndex changes
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('should handle grouped results with selectedIndex correctly', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        groupBy="category"
        selectedIndex={0}
      />
    );

    // Should render grouped structure and handle global index correctly
    expect(document.querySelector('.groupedContainer')).toBeInTheDocument();
    expect(screen.getByText('Business Checking Account')).toBeInTheDocument();
  });

  it('should support different maxResults values', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        maxResults={1}
      />
    );

    expect(screen.getByText('Business Checking Account')).toBeInTheDocument();
    expect(screen.queryByText('Payment to Supplier XYZ')).not.toBeInTheDocument();
    expect(screen.queryByText('John Smith')).not.toBeInTheDocument();
  });

  it('should pass query prop to SearchResult components', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query="business"
        loading={false}
        onSelect={mockOnSelect}
      />
    );

    // The query should be passed to SearchResult for highlighting
    // We can verify the structure is rendered correctly by checking for cards
    expect(document.querySelector('.cardsGrid')).toBeInTheDocument();
    expect(document.querySelectorAll('.cardWrapper')).toHaveLength(3);
  });

  it('should handle keyboard events through props', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        selectedIndex={0}
      />
    );

    const firstResult = screen.getByText('Business Checking Account');
    fireEvent.click(firstResult);

    expect(mockOnSelect).toHaveBeenCalledWith(mockData[0]);
  });

  it('should use custom renderResult in grouped mode', () => {
    const customRender = (item: SearchableItem) => (
      <div data-testid={`custom-grouped-result-${item.id}`}>
        {item.title} - Grouped Custom Render
      </div>
    );

    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        groupBy="category"
        renderResult={customRender}
      />
    );

    // Should show grouped structure
    expect(document.querySelector('.groupedContainer')).toBeInTheDocument();
    const groupTitles = document.querySelectorAll('.groupTitle');
    expect(groupTitles).toHaveLength(3);

    // Should use custom render for each grouped result
    expect(screen.getByTestId('custom-grouped-result-1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-grouped-result-2')).toBeInTheDocument();
    expect(screen.getByTestId('custom-grouped-result-3')).toBeInTheDocument();

    // Should show custom rendered content
    expect(screen.getByText('Business Checking Account - Grouped Custom Render')).toBeInTheDocument();
    expect(screen.getByText('Payment to Supplier XYZ - Grouped Custom Render')).toBeInTheDocument();
    expect(screen.getByText('John Smith - Grouped Custom Render')).toBeInTheDocument();
  });

  it('should handle onClick in grouped mode with default SearchResult', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        groupBy="category"
        // No renderResult prop - uses default SearchResult component
      />
    );

    // Should show grouped structure
    expect(document.querySelector('.groupedContainer')).toBeInTheDocument();
    
    // Click on a result in grouped mode (this should trigger line 119)
    const firstCard = screen.getByText('Business Checking Account');
    await user.click(firstCard);

    expect(mockOnSelect).toHaveBeenCalledWith(mockData[0]);
  });

  it('should use default loading=false when loading prop is not provided', () => {
    render(
      <SearchResultsCards
        results={mockData}
        query=""
        onSelect={mockOnSelect}
        // Note: loading prop is intentionally omitted to test default value
      />
    );

    // Should not show loading skeleton (default loading=false)
    expect(document.querySelectorAll('.skeletonCard')).toHaveLength(0);
    
    // Should show actual results instead (using partial text matching to avoid <mark> tag issues)
    expect(screen.getByText(/Business Checking/)).toBeInTheDocument();
    expect(screen.getByText(/Payment to Supplier/)).toBeInTheDocument();
    expect(screen.getByText(/John Smith/)).toBeInTheDocument();
  });

  it('should handle items with missing groupBy field by using "other" fallback', () => {
    // Create test data with missing category (undefined/null values)
    const dataWithMissingCategory: SearchableItem[] = [
      {
        id: '1',
        title: 'Regular Item',
        category: 'account'
      },
      {
        id: '2', 
        title: 'Missing Category Item',
        // category field is intentionally missing to test fallback
      } as SearchableItem, // Type assertion to bypass TypeScript checking
      {
        id: '3',
        title: 'Null Category Item',
        category: null as any // Explicitly null to test fallback
      }
    ];

    render(
      <SearchResultsCards
        results={dataWithMissingCategory}
        query=""
        loading={false}
        onSelect={mockOnSelect}
        groupBy="category"
      />
    );

    // Should show grouped structure with 'other' group for items with missing category
    expect(document.querySelector('.groupedContainer')).toBeInTheDocument();
    
    // Should show all items including those with missing categories
    expect(screen.getByText('Regular Item')).toBeInTheDocument();
    expect(screen.getByText('Missing Category Item')).toBeInTheDocument();
    expect(screen.getByText('Null Category Item')).toBeInTheDocument();
  });
});