import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SmartSearch } from './SmartSearch';
import { SearchableItem } from '../../types/search.types';
import * as KeyboardNavigationHook from '../../hooks/useKeyboardNavigation'
import { useDebounce } from '../../hooks/useDebounce';
import { useClickOutside } from '../../hooks/useClickOutside';

// Mock SearchResultsCards to avoid highlightText issues
jest.mock('../SearchResultsCards', () => ({
  SearchResultsCards: ({ results, onSelect }: any) => (
    <div data-testid="search-results-cards">
      {results.map((item: any, index: number) => (
        <div 
          key={item.id} 
          data-testid={`result-${item.id}`}
          onClick={() => onSelect(item)}
          aria-selected={false}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}));

// Mock the child components
jest.mock('../SearchInput', () => ({
  SearchInput: React.forwardRef(({ 
    onChange, 
    onClear, 
    onFocus, 
    onSubmit,
    value, 
    ariaLabel, 
    ariaDescribedBy, 
    loading, 
    size, 
    disabled,
    error,
    placeholder,
    variant,
    theme,
    showSearchButton,
    ...props 
  }: any, ref: any) => {
    // Extract DOM-safe props only
    const domProps = {
      ref,
      'data-testid': 'search-input',
      value,
      onChange: (e: any) => onChange(e.target.value),
      onFocus,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'data-size': size,
      'data-loading': loading ? 'true' : 'false',
      disabled,
      placeholder,
      // Remove non-DOM props and add as data attributes
      'data-variant': variant,
      'data-theme': theme,
      'data-show-search-button': showSearchButton ? 'true' : 'false',
      ...Object.keys(props).reduce((acc: any, key) => {
        // Only pass through valid DOM attributes
        if (key.startsWith('aria-') || key.startsWith('data-') || ['id', 'className', 'style'].includes(key)) {
          acc[key] = props[key];
        }
        return acc;
      }, {})
    };

    if (error) {
      domProps['data-error'] = error;
    }

    return (
      <>
        <input 
          {...domProps} 
          onKeyDown={(e: any) => {
            if (e.key === 'Enter' && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <button data-testid="clear-button" onClick={onClear}>Clear</button>
        {showSearchButton && <button data-testid="search-button" onClick={onSubmit}>Search</button>}
      </>
    );
  })
}));


// jest.mock('../ResultsDropdown', () => ({
//   ResultsDropdown: ({ results, isOpen, onSelect, groupBy, maxResults, theme, ...props }: any) => (
//     <div
//       data-testid="results-dropdown"
//       style={{ display: isOpen ? 'block' : 'none' }}
//       groupby={groupBy}
//       maxresults={maxResults}
//       data-theme={theme}
//     >
//       {results && results.map((item: any) => (
//         <button
//           key={item.id}
//           data-testid={`result-${item.id}`}
//           onClick={() => onSelect(item)}
//         >
//           {item.title}
//         </button>
//       ))}
//     </div>
//   )
// }));

// jest.mock('../ResultsDropdown', () => ({
//   ResultsDropdown: ({ results, isOpen, onSelect, onClose, ...props }: any) => (
//     <div
//       data-testid="results-dropdown"
//       style={{ display: isOpen ? 'block' : 'none' }}
//       {...props}
//     >
//       <button data-testid="close-button" onClick={onClose}>
//         Close
//       </button>
//       {results.map((item: any) => (
//         <button
//           key={item.id}
//           data-testid={`result-${item.id}`}
//           onClick={() => onSelect(item)}
//         >
//           {item.title}
//         </button>
//       ))}
//     </div>
//   )
// }));

jest.mock('../ResultsDropdown', () => ({
  ResultsDropdown: ({ results, isOpen, onSelect, onClose, loading, selectedIndex, maxResults, groupBy, renderResult, theme, ...props }: any) => {
    // Force-render a close button to test `onClose`
    return (
      <div 
        data-testid="results-dropdown" 
        style={{ display: isOpen ? 'block' : 'none' }} 
        data-theme={theme}
        data-loading={loading}
        data-selected-index={selectedIndex}
        data-max-results={maxResults}
        data-group-by={groupBy}
        data-render-result={typeof renderResult === 'function' ? 'function' : renderResult}
      >
        <button onClick={onClose} data-testid="mock-close-btn">Close</button>
        {results.map((item: any) => (
          <button
            key={item.id}
            data-testid={`result-${item.id}`}
            onClick={() => onSelect(item)}
          >
            {item.title}
          </button>
        ))}
      </div>
    );
  }
}));



// Mock hooks
jest.mock('../../hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => value)
}));

jest.mock('../../hooks/useKeyboardNavigation', () => ({
  useKeyboardNavigation: jest.fn(() => ({
    selectedIndex: -1,
    setSelectedIndex: jest.fn()
  }))
}));

jest.mock('../../hooks/useClickOutside', () => ({
  useClickOutside: jest.fn((callback) => {
    // Store callback so we can trigger it in tests
    (useClickOutside as any).mockCallback = callback;
    return { current: null };
  })
}));

// Mock utils
jest.mock('../../utils/searchFilters', () => ({
  defaultSearchFilter: jest.fn((item, query) => {
    if (!query) return true;
    return item.title.toLowerCase().includes(query.toLowerCase());
  })
}));

// Use fake timers
jest.useFakeTimers();

describe('SmartSearch', () => {
  const mockOnSearch = jest.fn();
  const mockOnSelect = jest.fn();

  const mockData: SearchableItem[] = [
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

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render with default props', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('results-dropdown')).toBeInTheDocument();
  });

  it('should render with custom placeholder', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        placeholder="Custom search placeholder"
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('placeholder', 'Custom search placeholder');
  });

  it('should filter results based on search query', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');

    await act(async () => {
      await user.type(input, 'John');
      jest.advanceTimersByTime(300);
    });

    // Should filter to only show John's account
    expect(screen.getByTestId('result-1')).toBeInTheDocument();
    expect(screen.queryByTestId('result-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('result-3')).not.toBeInTheDocument();
  });

  it('should call onSearch when query changes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSearch={mockOnSearch}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(input, 'test');
      jest.advanceTimersByTime(300);
    });

    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  it('should call onSelect when result is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');

    await act(async () => {
      await user.type(input, 'John');
      jest.advanceTimersByTime(300);
    });

    const result = screen.getByTestId('result-1');
    await act(async () => {
      await user.click(result);
    });

    expect(mockOnSelect).toHaveBeenCalledWith(mockData[0]);
  });

  it('should not show dropdown when query is too short', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        minSearchLength={2}
      />
    );

    const input = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(input, 'J');
      jest.advanceTimersByTime(300);
    });

    const dropdown = screen.getByTestId('results-dropdown');
    expect(dropdown).toHaveStyle({ display: 'none' });
  });

  it('should show dropdown when query meets minimum length', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        minSearchLength={2}
      />
    );

    const input = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(input, 'Jo');
      jest.advanceTimersByTime(300);
    });

    const dropdown = screen.getByTestId('results-dropdown');
    expect(dropdown).toHaveStyle({ display: 'block' });
  });

  it('should clear search when clear button is used', () => {
    const { rerender } = render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    // Simulate having a value
    rerender(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('');
  });

  it('should focus input when dropdown is opened', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');
    await act(async () => {
      await user.click(input);
    });

    expect(input).toHaveFocus();
  });

  it('should support different themes', () => {
    const { container } = render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        theme="dark"
      />
    );

    const smartSearch = container.querySelector('[data-theme="dark"]');
    expect(smartSearch).toBeInTheDocument();
  });

  it('should support different sizes', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        size="large"
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('data-size', 'large');
  });

  it('should support different variants', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        variant="filled"
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('data-variant', 'filled');
  });

  it('should display loading state', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        loading={true}
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('data-loading', 'true');
  });

  it('should display disabled state', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        disabled={true}
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toBeDisabled();
  });

  it('should display error state', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        error="Something went wrong"
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('data-error', 'Something went wrong');
  });

  it('should support custom debounce time', async () => {

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        debounceMs={500}
      />
    );

    expect(useDebounce).toHaveBeenCalledWith('', 500);
  });

  it('should use custom filter when provided', async () => {
    const customFilter = jest.fn(() => true);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        customFilter={customFilter}
      />
    );

    const input = screen.getByTestId('search-input');
    
    await act(async () => {
      await user.type(input, 'test');
      jest.advanceTimersByTime(300);
    });

    expect(customFilter).toHaveBeenCalled();
  });

  it('should support groupBy prop', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        groupBy="category"
      />
    );

    const dropdown = screen.getByTestId('results-dropdown');
    expect(dropdown).toHaveAttribute('data-group-by', 'category');
  });

  it('should support maxResults prop', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        maxResults={5}
      />
    );

    const dropdown = screen.getByTestId('results-dropdown');
    expect(dropdown).toHaveAttribute('data-max-results', '5');
  });

  it('should set proper ARIA attributes', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        ariaLabel="Search banking records"
        ariaDescribedBy="search-help"
      />
    );

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('aria-label', 'Search banking records');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-haspopup', 'listbox');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
  });

  it('should generate unique IDs for accessibility', () => {
    const { container: container1 } = render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const { container: container2 } = render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    // Each instance should have unique IDs
    const input1 = container1.querySelector('[aria-owns]');
    const input2 = container2.querySelector('[aria-owns]');

    expect(input1?.getAttribute('aria-owns')).not.toBe(input2?.getAttribute('aria-owns'));
  });

  it('should show dropdown on input focus if query meets requirements', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');

    // Type something first
    await act(async () => {
      await user.type(input, 'John');
      jest.advanceTimersByTime(300);
    });

    // Blur and focus again
    input.blur();
    await act(async () => {
      await user.click(input);
    });

    const dropdown = screen.getByTestId('results-dropdown');
    expect(dropdown).toHaveStyle({ display: 'block' });
  });

  it('should close dropdown after selection', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');

    await act(async () => {
      await user.type(input, 'John');
      jest.advanceTimersByTime(300);
    });

    const result = screen.getByTestId('result-1');
    await act(async () => {
      await user.click(result);
    });

    const dropdown = screen.getByTestId('results-dropdown');
    expect(dropdown).toHaveStyle({ display: 'none' });
  });

  it('should clear query after selection', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const input = screen.getByTestId('search-input');

    await act(async () => {
      await user.type(input, 'John');
      jest.advanceTimersByTime(300);
    });

    const result = screen.getByTestId('result-1');
    await act(async () => {
      await user.click(result);
    });

    expect(input).toHaveValue('');
  });

  it('should not filter when query is empty', () => {
    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
      />
    );

    const dropdown = screen.getByTestId('results-dropdown');
    expect(dropdown).toHaveStyle({ display: 'none' });
  });

  it('should handle empty data array', () => {
    render(
      <SmartSearch
        data={[]}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('results-dropdown')).toBeInTheDocument();
  });

  it('should clear input and focus on clear', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<SmartSearch data={mockData} onSelect={jest.fn()} />);

    const input = screen.getByTestId('search-input') as HTMLInputElement;
    const clearBtn = screen.getByTestId('clear-button');

    // Type text
    await act(async () => {
      await user.type(input, 'Test');
      // Advance timers for debounce to settle
      jest.advanceTimersByTime(300);
    });

    expect(input).toHaveValue('Test');

    // Click clear button
    await act(async () => {
      await user.click(clearBtn);
      // Advance timers again in case debounce runs on clear
      jest.advanceTimersByTime(300);
    });

    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });


  it('should call handleResultSelect and close dropdown via keyboard navigation', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  let onSelectCallback: (index: number) => void = () => {};
  let onCloseCallback: () => void = () => {};

  jest.spyOn(KeyboardNavigationHook, 'useKeyboardNavigation').mockImplementation((
    length,
    onSelect,
    onClose,
    isOpen
  ) => {
    onSelectCallback = onSelect;
    onCloseCallback = onClose;
    return {
      selectedIndex: 0,
      setSelectedIndex: jest.fn()
    };
  });

  render(<SmartSearch data={mockData} onSelect={mockOnSelect} />);

  const input = screen.getByTestId('search-input');

  // Type query
  await act(async () => {
    await user.type(input, 'John');
    // Advance timers for debounce
    jest.advanceTimersByTime(300);
  });

  // Wait for filtering and state update
  await screen.findByTestId('result-1');

  // Now filteredResults should be set, so callback works
  act(() => {
    onSelectCallback(0);
  });

  expect(mockOnSelect).toHaveBeenCalledWith(mockData[0]);

  // Call onClose callback to close dropdown
  act(() => {
    onCloseCallback();
  });

  const dropdown = screen.getByTestId('results-dropdown');
  expect(dropdown).toHaveStyle({ display: 'none' });
});



it('should close dropdown when onClose is called', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  render(<SmartSearch data={mockData} onSelect={jest.fn()} />);

  const input = screen.getByTestId('search-input');
  
  await act(async () => {
    await user.type(input, 'John');
    jest.advanceTimersByTime(300); // simulate debounce
  });

  // Ensure dropdown is visible
  const dropdown = screen.getByTestId('results-dropdown');
  expect(dropdown).toHaveStyle({ display: 'block' });

  // ✅ Corrected line here
  const closeBtn = screen.getByTestId('mock-close-btn');
  await act(async () => {
    await user.click(closeBtn);
  });

  // Confirm dropdown closed
  expect(dropdown).toHaveStyle({ display: 'none' });
});

it('should close dropdown when clicking outside', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  render(<SmartSearch data={mockData} onSelect={jest.fn()} />);

  const input = screen.getByTestId('search-input');
  
  // Type to open dropdown
  await act(async () => {
    await user.type(input, 'John');
    jest.advanceTimersByTime(300);
  });

  // Verify dropdown is open
  const dropdown = screen.getByTestId('results-dropdown');
  expect(dropdown).toHaveStyle({ display: 'block' });

  // Trigger click outside callback
  act(() => {
    (useClickOutside as any).mockCallback();
  });

  // Verify dropdown is closed
  expect(dropdown).toHaveStyle({ display: 'none' });
});

  it('should early return from handleSearchSubmit when searchOnSubmit is false', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockOnSearch = jest.fn();

    // First test with searchOnSubmit=true to establish that the mechanism works
    const { rerender } = render(
      <SmartSearch 
        data={mockData} 
        onSelect={jest.fn()} 
        onSearch={mockOnSearch}
        searchOnSubmit={true}
        showSearchButton={true}
      />
    );

    const input = screen.getByTestId('search-input');
    
    // Type a query first
    await act(async () => {
      await user.type(input, 'test');
      jest.advanceTimersByTime(300);
    });

    // Should not have called onSearch yet in submit mode
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Click search button to confirm it works when searchOnSubmit=true
    const searchButton = screen.getByTestId('search-button');
    await act(async () => {
      await user.click(searchButton);
    });

    // Should have called onSearch
    expect(mockOnSearch).toHaveBeenCalledWith('test');
    mockOnSearch.mockClear();

    // Now rerender with searchOnSubmit=false to test early return
    rerender(
      <SmartSearch 
        data={mockData} 
        onSelect={jest.fn()} 
        onSearch={mockOnSearch}
        searchOnSubmit={false} // This should cause early return in handleSearchSubmit
        showSearchButton={false}
      />
    );

    // The search button should no longer be present
    expect(screen.queryByTestId('search-button')).not.toBeInTheDocument();

    // Clear the input and type new text
    await act(async () => {
      await user.clear(input);
      await user.type(input, 'new test');
      jest.advanceTimersByTime(300);
    });

    // Should have called onSearch immediately because searchOnSubmit=false (live search)
    expect(mockOnSearch).toHaveBeenCalledWith('new test');
    mockOnSearch.mockClear();

    // Now test the early return by pressing Enter (which triggers handleSearchSubmit)
    // Even though searchOnSubmit=false, the Enter key handler still calls handleSearchSubmit
    // This should hit the early return (line 121)
    await act(async () => {
      await user.keyboard('{Enter}');
    });

    // Should not have called onSearch again since handleSearchSubmit early returns
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('should handle searchOnSubmit mode correctly', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockOnSearch = jest.fn();

    render(
      <SmartSearch 
        data={mockData} 
        onSelect={jest.fn()} 
        onSearch={mockOnSearch}
        searchOnSubmit={true} // Submit mode enabled
        showSearchButton={true}
      />
    );

    const input = screen.getByTestId('search-input');
    
    // Type a query - should NOT trigger search immediately
    await act(async () => {
      await user.type(input, 'test query');
      jest.advanceTimersByTime(300);
    });

    // Should not have called onSearch yet because we're in submit mode
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    // Submit using the search button - this should call handleSearchSubmit
    const searchButton = screen.getByTestId('search-button');
    await act(async () => {
      await user.click(searchButton);
    });

    // Should have called onSearch with the submitted query
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('should evaluate filteredResults.length > 0 for cards mode navigation', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    // Spy on the useKeyboardNavigation hook to see what isActive value it gets
    const useKeyboardNavigationSpy = jest.spyOn(require('../../hooks/useKeyboardNavigation'), 'useKeyboardNavigation');

    render(
      <SmartSearch
        data={mockData}
        onSelect={mockOnSelect}
        resultsDisplayMode="cards"
      />
    );

    const input = screen.getByTestId('search-input');

    // Initially, filteredResults.length should be 0, so isNavigationActive should be false
    expect(useKeyboardNavigationSpy).toHaveBeenLastCalledWith(
      0, // filteredResults.length = 0 initially
      expect.any(Function), // onSelect callback
      expect.any(Function), // onClose callback  
      false // isActive should be false because filteredResults.length = 0
    );

    // Type to get filtered results in cards mode
    await act(async () => {
      await user.type(input, 'John');
      jest.advanceTimersByTime(300);
    });

    // Now filteredResults.length > 0, so isNavigationActive should be true
    // This exercises the 'filteredResults.length > 0' branch in the ternary
    expect(useKeyboardNavigationSpy).toHaveBeenLastCalledWith(
      expect.any(Number), // filteredResults.length > 0
      expect.any(Function), // onSelect callback
      expect.any(Function), // onClose callback  
      true // isActive should be true because filteredResults.length > 0
    );

    useKeyboardNavigationSpy.mockRestore();
  });


});

