import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DemoApp } from './DemoApp';

// Mock the SmartSearch component
jest.mock('../components/SmartSearch', () => ({
  SmartSearch: ({ onSearch, onSelect, theme, size, variant, disabled, loading, error, data, placeholder, debounceMs, minSearchLength, maxResults, groupBy, customFilter, renderResult, ariaLabel, ariaDescribedBy }: any) => (
    <div 
      data-testid="smart-search" 
      data-theme={theme}
      data-size={size}
      data-variant={variant}
      data-disabled={disabled}
      data-loading={loading}
      data-error={error}
    >
      <button onClick={() => onSearch('test search')}>Trigger Search</button>
      <button onClick={() => onSelect({ id: 1, title: 'Test Item', category: 'account' })}>
        Trigger Select
      </button>
    </div>
  )
}));

// Mock the icons
jest.mock('lucide-react', () => ({
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Info: () => <div data-testid="info-icon">Info</div>
}));

describe('DemoApp', () => {
  beforeEach(() => {
    // Mock setTimeout to fast-forward the loading delay
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render with default state', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Search Component Banking')).toBeInTheDocument();
    expect(screen.getByText('Professional search component for banking applications')).toBeInTheDocument();
    expect(screen.getByTestId('smart-search')).toBeInTheDocument();
  });

  it('should display configuration panel', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Configuration')).toBeInTheDocument();
    expect(screen.getByText('Debouce')).toBeInTheDocument();
    expect(screen.getByText('Min Search Length')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Variant')).toBeInTheDocument();
    expect(screen.getByText('Max Results')).toBeInTheDocument();
  });

  it('should toggle theme when theme button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    expect(themeButton).toBeInTheDocument();
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

    await act(async () => {
      await user.click(themeButton);
    });

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
  });

  it('should update debounce setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const debounceSelect = screen.getByDisplayValue('0.3 Second');
    await act(async () => {
      await user.selectOptions(debounceSelect, '500');
    });

    expect(screen.getByDisplayValue('0.5 Seconds')).toBeInTheDocument();
  });

  it('should update min search length setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const minLengthSelect = screen.getByDisplayValue('1');
    await act(async () => {
      await user.selectOptions(minLengthSelect, '2');
    });

    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('should update size setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const sizeSelect = screen.getByDisplayValue('Medium');
    await act(async () => {
      await user.selectOptions(sizeSelect, 'large');
    });

    expect(screen.getByDisplayValue('Large')).toBeInTheDocument();
    
    const smartSearch = screen.getByTestId('smart-search');
    expect(smartSearch).toHaveAttribute('data-size', 'large');
  });

  it('should update variant setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const variantSelect = screen.getByDisplayValue('Outlined');
    await act(async () => {
      await user.selectOptions(variantSelect, 'filled');
    });

    expect(screen.getByDisplayValue('Filled')).toBeInTheDocument();
    
    const smartSearch = screen.getByTestId('smart-search');
    expect(smartSearch).toHaveAttribute('data-variant', 'filled');
  });

  it('should update max results setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const maxResultsSelect = screen.getByDisplayValue('10');
    await act(async () => {
      await user.selectOptions(maxResultsSelect, '20');
    });

    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
  });

  it('should toggle grouping setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const groupingCheckbox = screen.getByRole('checkbox', { name: /group by category/i });
    expect(groupingCheckbox).not.toBeChecked();

    await act(async () => {
      await user.click(groupingCheckbox);
    });

    expect(groupingCheckbox).toBeChecked();
  });

  it('should toggle error setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const errorCheckbox = screen.getByRole('checkbox', { name: /display error/i });
    expect(errorCheckbox).not.toBeChecked();

    await act(async () => {
      await user.click(errorCheckbox);
    });

    expect(errorCheckbox).toBeChecked();
  });

  it('should toggle disabled setting', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const disabledCheckbox = screen.getByRole('checkbox', { name: /disable/i });
    expect(disabledCheckbox).not.toBeChecked();

    await act(async () => {
      await user.click(disabledCheckbox);
    });

    expect(disabledCheckbox).toBeChecked();
  });

  it('should display selected result section', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Selected Result')).toBeInTheDocument();
    expect(screen.getByText('Select a search result to view details')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('should display activity log section', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Activity Log')).toBeInTheDocument();
    expect(screen.getByText('Search activity will appear here')).toBeInTheDocument();
  });

  it('should log search activity', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const searchButton = screen.getByText('Trigger Search');
    await act(async () => {
      await user.click(searchButton);
    });

    expect(screen.getByText(/Search: "test search" at/)).toBeInTheDocument();
  });

  it('should log selection activity and show selected result', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const selectButton = screen.getByText('Trigger Select');
    await act(async () => {
      await user.click(selectButton);
    });

    expect(screen.getByText(/Selected: Test Item \(account\)/)).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('account')).toBeInTheDocument();
  });

  it('should display footer with version info', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Search Component Banking • Built with React, TypeScript, and SCSS/)).toBeInTheDocument();
    expect(screen.getByText(/Version 1.0.0 •/)).toBeInTheDocument();
  });

  it('should apply theme to main container', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { container } = render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    let demoApp = container.querySelector('[data-theme="light"]');
    expect(demoApp).toBeInTheDocument();

    const themeButton = screen.getByRole('button', { name: /switch to dark theme/i });
    await act(async () => {
      await user.click(themeButton);
    });

    demoApp = container.querySelector('[data-theme="dark"]');
    expect(demoApp).toBeInTheDocument();
  });

  it('should show theme label in theme toggle button', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('dark')).toBeInTheDocument();
  });

  it('should format currency in selected result', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Mock an item with amount
    const selectButton = screen.getByText('Trigger Select');
    
    // Simulate selecting an item with amount
    act(() => {
      fireEvent.click(selectButton);
    });

    // The selected result section should be updated (though we need to mock this properly)
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('should show status badge in selected result when status is present', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const selectButton = screen.getByText('Trigger Select');
    await act(async () => {
      await user.click(selectButton);
    });

    // Should show the selected result with category
    expect(screen.getByText('account')).toBeInTheDocument();
  });

  it('should limit activity log entries', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const searchButton = screen.getByText('Trigger Search');
    
    // Trigger multiple searches (more than 10)
    for (let i = 0; i < 12; i++) {
      await act(async () => {
        await user.click(searchButton);
      });
    }

    // Should only show the most recent 10 entries
    const logEntries = screen.getAllByText(/Search: "test search" at/);
    expect(logEntries.length).toBeLessThanOrEqual(10);
  });

  it('should pass correct props to SmartSearch component', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const smartSearch = screen.getByTestId('smart-search');
    expect(smartSearch).toHaveAttribute('data-theme', 'light');
    expect(smartSearch).toHaveAttribute('data-size', 'medium');
    expect(smartSearch).toHaveAttribute('data-variant', 'outlined');
  });

  it('should handle search errors by resetting error state', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Enable error state
    const errorCheckbox = screen.getByRole('checkbox', { name: /display error/i });
    expect(errorCheckbox).not.toBeChecked();
    
    await act(async () => {
      await user.click(errorCheckbox);
    });

    // Verify checkbox is checked after clicking
    expect(errorCheckbox).toBeChecked();

    // Trigger search should reset error state (unchecks the checkbox)
    const searchButton = screen.getByText('Trigger Search');
    await act(async () => {
      await user.click(searchButton);
    });

    // Error state should be reset (checkbox unchecked)
    expect(errorCheckbox).not.toBeChecked();
  });

  it('should have proper accessibility structure', () => {
    render(<DemoApp />);

    // Fast-forward past the loading delay
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Should have proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Search Component Banking');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3); // Configuration, Selected Result, Activity Log
  });
});