import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultsDropdown } from './ResultsDropdown';
import { SearchableItem } from '../../types/search.types';
import { groupResultsByCategory } from '../../utils/searchFilters';

// Mock the SearchResult component
jest.mock('../SearchResult', () => ({
  SearchResult: ({ item, onClick, isSelected }: any) => (
    <button
      data-testid={`search-result-${item.id}`}
      onClick={() => onClick()}
      className={isSelected ? 'selected' : ''}
    >
      {item.title}
    </button>
  )
}));

// Mock utils
jest.mock('../../utils/searchFilters', () => ({
  sortResults: jest.fn((results) => results),
  groupResultsByCategory: jest.fn((results) => {
    const groups: any = {};
    const accountResults = results.filter((r: any) => r.category === 'account');
    const transactionResults = results.filter((r: any) => r.category === 'transaction');
    
    if (accountResults.length > 0) {
      groups.account = accountResults;
    }
    if (transactionResults.length > 0) {
      groups.transaction = transactionResults;
    }
    
    return groups;
  })
}));

describe('ResultsDropdown', () => {
  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  const mockResults: SearchableItem[] = [
    {
      id: 1,
      title: 'John Smith - Checking Account',
      category: 'account',
      amount: 5000
    },
    {
      id: 2,
      title: 'Jane Doe - Savings Account',
      category: 'account',
      amount: 10000
    },
    {
      id: 3,
      title: 'Payment to Utility Company',
      category: 'transaction',
      amount: -150
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when not open', () => {
    const { container } = render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={false}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render when open', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByLabelText('Search results')).toBeInTheDocument();
  });

  it('should display result count header', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('3 results for "test"')).toBeInTheDocument();
  });

  it('should display singular result count', () => {
    render(
      <ResultsDropdown
        results={[mockResults[0]]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('1 result for "test"')).toBeInTheDocument();
  });

  it('should display no results message when empty', () => {
    render(
      <ResultsDropdown
        results={[]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('No results for "test"')).toBeInTheDocument();
  });

  it('should render all results without grouping', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('search-result-1')).toBeInTheDocument();
    expect(screen.getByTestId('search-result-2')).toBeInTheDocument();
    expect(screen.getByTestId('search-result-3')).toBeInTheDocument();
  });

  it('should limit results based on maxResults', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        maxResults={2}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByTestId('search-result-1')).toBeInTheDocument();
    expect(screen.getByTestId('search-result-2')).toBeInTheDocument();
    expect(screen.queryByTestId('search-result-3')).not.toBeInTheDocument();
  });

  it('should call onSelect when result is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    const firstResult = screen.getByTestId('search-result-1');
    await user.click(firstResult);

    expect(mockOnSelect).toHaveBeenCalledWith(mockResults[0]);
  });

  it('should show loading state', () => {
    render(
      <ResultsDropdown
        results={[]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        loading={true}
        onClose={mockOnClose}
      />
    );

    expect(document.querySelector('.loadingSpinner')).toBeInTheDocument();
    expect(document.querySelector('.loadingSkeleton')).toBeInTheDocument();
  });

  it('should render loading skeleton items', () => {
    render(
      <ResultsDropdown
        results={[]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        loading={true}
        onClose={mockOnClose}
      />
    );

    // Should render 3 skeleton items
    const skeletonItems = document.querySelectorAll('.skeletonItem');
    expect(skeletonItems).toHaveLength(3);
  });

  it('should not show header when loading', () => {
    render(
      <ResultsDropdown
        results={[]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        loading={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText(/results for/)).not.toBeInTheDocument();
  });

  it('should not show results when loading', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        loading={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByTestId('search-result-1')).not.toBeInTheDocument();
  });

  it('should show empty state when no results and not loading', () => {
    render(
      <ResultsDropdown
        results={[]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        loading={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText(/No results found for "test"/)).toBeInTheDocument();
  });

  it('should show default empty state message when no query', () => {
    render(
      <ResultsDropdown
        results={[]}
        query=""
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        loading={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Start typing to search accounts, transactions, and customers.')).toBeInTheDocument();
  });

  it('should show keyboard navigation footer', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Use ↑↓ arrow keys to navigate, Enter to select, Esc to close')).toBeInTheDocument();
  });

  it('should not show footer when loading', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        loading={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText(/arrow keys/)).not.toBeInTheDocument();
  });

  it('should not show footer when no results', () => {
    render(
      <ResultsDropdown
        results={[]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText(/arrow keys/)).not.toBeInTheDocument();
  });

  it('should apply theme attribute', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        theme="dark"
        onClose={mockOnClose}
      />
    );

    const dropdown = screen.getByRole('listbox');
    expect(dropdown).toHaveAttribute('data-theme', 'dark');
  });

  it('should render grouped results when groupBy is specified', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        groupBy="category"
        onClose={mockOnClose}
      />
    );

    // Group headers should be present when multiple groups exist
    expect(screen.getByText('accounts')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
    expect(screen.getByText('transactions')).toBeInTheDocument();
    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('should not show group headers when only one group', () => {
    const accountResults = mockResults.filter(r => r.category === 'account');
    
    render(
      <ResultsDropdown
        results={accountResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        groupBy="category"
        onClose={mockOnClose}
      />
    );

    // Should not show group headers when only one group
    expect(screen.queryByText(/accounts/)).not.toBeInTheDocument();
  });

  it('should mark selected result as selected', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    const secondResult = screen.getByTestId('search-result-2');
    expect(secondResult).toHaveClass('selected');
  });

  it('should use custom renderResult when provided', () => {
    const customRender = jest.fn((item: SearchableItem) => (
      <div data-testid={`custom-${item.id}`}>Custom: {item.title}</div>
    ));

    render(
      <ResultsDropdown
        results={[mockResults[0]]}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        renderResult={customRender}
      />
    );

    expect(customRender).toHaveBeenCalledWith(mockResults[0]);
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByText('Custom: John Smith - Checking Account')).toBeInTheDocument();
  });

  it('should handle empty results array', () => {
    render(
      <ResultsDropdown
        results={[]}
        query=""
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(document.querySelector('.emptyState')).toBeInTheDocument();
  });

  it('should render proper list structure', () => {
    render(
      <ResultsDropdown
        results={mockResults}
        query="test"
        isOpen={true}
        selectedIndex={-1}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    const list = document.querySelector('[role="group"]');
    expect(list).toBeInTheDocument();
    
    const listItems = document.querySelectorAll('[role="presentation"]');
    expect(listItems).toHaveLength(3);
  });

  it('should render "All Results" header when group name is "all" and multiple groups exist', () => {
  const mockGroupedResults = {
    all: [mockResults[0]],
    dummy: [mockResults[1]]
  };

  (groupResultsByCategory as jest.Mock).mockImplementation(() => mockGroupedResults);

  render(
    <ResultsDropdown
      results={[mockResults[0], mockResults[1]]}
      query="test"
      isOpen={true}
      selectedIndex={-1}
      onSelect={mockOnSelect}
      groupBy="category"
      onClose={mockOnClose}
    />
  );

  expect(screen.getByText('All Results')).toBeInTheDocument();
});


});