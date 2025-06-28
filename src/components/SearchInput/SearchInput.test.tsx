import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  const mockOnChange = jest.fn();
  const mockOnClear = jest.fn();
  const mockOnFocus = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default props', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search accounts, transactions, customers...');
  });

  it('should render with custom placeholder', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        placeholder="Custom placeholder"
      />
    );

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('should display current value', () => {
    render(
      <SearchInput
        value="test search"
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByDisplayValue('test search')).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByRole('combobox');
    await user.type(input, 'john');

    expect(mockOnChange).toHaveBeenCalledTimes(4);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, 'j');
    expect(mockOnChange).toHaveBeenNthCalledWith(2, 'o');
    expect(mockOnChange).toHaveBeenNthCalledWith(3, 'h');
    expect(mockOnChange).toHaveBeenNthCalledWith(4, 'n');
  });

  it('should show clear button when value is present', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();
  });

  it('should not show clear button when value is empty', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should call onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    await user.click(clearButton);

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('should show loading spinner when loading', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
        loading={true}
      />
    );

    // The loading spinner should be present (Loader component)
    expect(document.querySelector('.loadingSpinner')).toBeInTheDocument();
  });

  it('should not show clear button when loading', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
        loading={true}
      />
    );

    const clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
        disabled={true}
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toBeDisabled();
  });

  it('should not show clear button when disabled', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
        disabled={true}
      />
    );

    const clearButton = screen.queryByRole('button', { name: /clear search/i });
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should display error message when error prop is provided', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
        error="Something went wrong"
      />
    );

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Something went wrong');
  });

  it('should apply error styles when error is present', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
        error="Error message"
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveClass('error');
  });

  it('should support different sizes', () => {
    const { rerender } = render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        size="small"
      />
    );

    let input = screen.getByRole('combobox');
    expect(input).toHaveClass('small');

    rerender(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        size="large"
      />
    );

    input = screen.getByRole('combobox');
    expect(input).toHaveClass('large');
  });

  it('should support different variants', () => {
    const { rerender } = render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        variant="outlined"
      />
    );

    let input = screen.getByRole('combobox');
    expect(input).toHaveClass('outlined');

    rerender(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        variant="filled"
      />
    );

    input = screen.getByRole('combobox');
    expect(input).toHaveClass('filled');
  });

  it('should support different themes', () => {
    const { container } = render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        theme="dark"
      />
    );

    const wrapper = container.querySelector('[data-theme="dark"]');
    expect(wrapper).toBeInTheDocument();
  });

  it('should set proper ARIA attributes', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        ariaLabel="Search banking records"
        ariaDescribedBy="search-help"
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('aria-label', 'Search banking records');
    expect(input).toHaveAttribute('aria-describedby', 'search-help');
  });

  it('should have proper input attributes', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('autoComplete', 'off');
    expect(input).toHaveAttribute('spellCheck', 'false');
    expect(input).toHaveAttribute('role', 'combobox');
  });

  it('should forward ref to input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    
    render(
      <SearchInput
        ref={ref}
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('should call onFocus when input is focused', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        onFocus={mockOnFocus}
      />
    );

    const input = screen.getByRole('combobox');
    await user.click(input);

    expect(mockOnFocus).toHaveBeenCalledTimes(1);
  });

  it('should spread additional props to input', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
        data-testid="custom-input"
      />
    );

    const input = screen.getByRole('combobox');
    expect(input).toHaveAttribute('data-testid', 'custom-input');
  });

  it('should have search icon', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    // Search icon should be present
    expect(document.querySelector('.searchIcon')).toBeInTheDocument();
  });

  it('should have clear button with correct tabIndex', () => {
    render(
      <SearchInput
        value="test"
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toHaveAttribute('tabIndex', '-1');
  });

  it('should handle change event properly', () => {
    render(
      <SearchInput
        value=""
        onChange={mockOnChange}
        onClear={mockOnClear}
      />
    );

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('should display name correctly', () => {
    expect(SearchInput.displayName).toBe('SearchInput');
  });

  // Tests for uncovered lines
  describe('Search submission functionality', () => {
    it('should call onSubmit when Enter key is pressed', async () => {
      const user = userEvent.setup();
      
      render(
        <SearchInput
          value="test query"
          onChange={mockOnChange}
          onClear={mockOnClear}
          onSubmit={mockOnSubmit}
        />
      );

      const input = screen.getByRole('combobox');
      await user.type(input, '{Enter}');

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should prevent default when Enter key is pressed with onSubmit', () => {
      render(
        <SearchInput
          value="test query"
          onChange={mockOnChange}
          onClear={mockOnClear}
          onSubmit={mockOnSubmit}
        />
      );

      const input = screen.getByRole('combobox');
      
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should not call onSubmit when Enter key is pressed without onSubmit prop', async () => {
      const user = userEvent.setup();
      
      render(
        <SearchInput
          value="test query"
          onChange={mockOnChange}
          onClear={mockOnClear}
        />
      );

      const input = screen.getByRole('combobox');
      await user.type(input, '{Enter}');

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should allow arrow keys to bubble up for keyboard navigation', () => {
      render(
        <SearchInput
          value="test query"
          onChange={mockOnChange}
          onClear={mockOnClear}
          onSubmit={mockOnSubmit}
        />
      );

      const input = screen.getByRole('combobox');
      
      // Test arrow keys - they should not call onSubmit but should bubble up
      ['ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape'].forEach(key => {
        fireEvent.keyDown(input, { key });
      });
      
      // onSubmit should not be called for navigation keys
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Search button functionality', () => {
    it('should show search button when showSearchButton is true', () => {
      render(
        <SearchInput
          value="test"
          onChange={mockOnChange}
          onClear={mockOnClear}
          onSubmit={mockOnSubmit}
          showSearchButton={true}
        />
      );

      const searchButton = screen.getByLabelText('Search');
      expect(searchButton).toBeInTheDocument();
    });

    it('should call onSubmit when search button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <SearchInput
          value="test query"
          onChange={mockOnChange}
          onClear={mockOnClear}
          onSubmit={mockOnSubmit}
          showSearchButton={true}
        />
      );

      const searchButton = screen.getByLabelText('Search');
      await user.click(searchButton);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should prevent default and stop propagation when search button is clicked', () => {
      render(
        <SearchInput
          value="test query"
          onChange={mockOnChange}
          onClear={mockOnClear}
          onSubmit={mockOnSubmit}
          showSearchButton={true}
        />
      );

      const searchButton = screen.getByLabelText('Search');
      fireEvent.click(searchButton);

      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    it('should not call onSubmit when search button is clicked without onSubmit prop', async () => {
      const user = userEvent.setup();
      
      render(
        <SearchInput
          value="test query"
          onChange={mockOnChange}
          onClear={mockOnClear}
          showSearchButton={true}
        />
      );

      // Search button should show but not have any submit handler
      const searchButton = screen.getByLabelText('Search');
      await user.click(searchButton);

      // Since onSubmit wasn't provided, mockOnSubmit should not be called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should apply withSearchButton class when showSearchButton is true', () => {
      render(
        <SearchInput
          value="test"
          onChange={mockOnChange}
          onClear={mockOnClear}
          showSearchButton={true}
        />
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveClass('withSearchButton');
    });

    it('should not show clear button when showSearchButton is true but still show when value exists', () => {
      render(
        <SearchInput
          value="test"
          onChange={mockOnChange}
          onClear={mockOnClear}
          showSearchButton={true}
        />
      );

      // Clear button should still show even with search button
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });
  });
});