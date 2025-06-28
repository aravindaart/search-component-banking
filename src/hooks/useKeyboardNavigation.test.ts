import { renderHook, act } from '@testing-library/react';
import { useKeyboardNavigation } from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.removeEventListener('keydown', expect.any(Function));
  });

  it('should initialize with selectedIndex -1', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(5, mockOnSelect, mockOnClose, true)
    );

    expect(result.current.selectedIndex).toBe(-1);
  });

  it('should reset selectedIndex when navigation becomes inactive', () => {
    const { result, rerender } = renderHook(
      ({ isActive }) => useKeyboardNavigation(5, mockOnSelect, mockOnClose, isActive),
      { initialProps: { isActive: true } }
    );

    act(() => {
      result.current.setSelectedIndex(2);
    });
    expect(result.current.selectedIndex).toBe(2);

    rerender({ isActive: false });
    expect(result.current.selectedIndex).toBe(-1);
  });

  it('should reset selectedIndex when itemCount is 0', () => {
    const { result, rerender } = renderHook(
      ({ itemCount }) => useKeyboardNavigation(itemCount, mockOnSelect, mockOnClose, true),
      { initialProps: { itemCount: 5 } }
    );

    act(() => {
      result.current.setSelectedIndex(2);
    });
    expect(result.current.selectedIndex).toBe(2);

    rerender({ itemCount: 0 });
    expect(result.current.selectedIndex).toBe(-1);
  });

  it('should handle ArrowDown key navigation', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(3, mockOnSelect, mockOnClose, true)
    );

    // First ArrowDown: -1 -> 0
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    // Second ArrowDown: 0 -> 1
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    // Third ArrowDown: 1 -> 2
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    // Fourth ArrowDown: 2 -> 0 (wrap around)
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(0);
  });

  it('should handle ArrowUp key navigation', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(3, mockOnSelect, mockOnClose, true)
    );

    // ArrowUp from -1 should go to last item (2)
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(2);

    // ArrowUp from 2 should go to 1
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(1);
  });

  it('should handle Enter key', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(3, mockOnSelect, mockOnClose, true)
    );

    act(() => {
      result.current.setSelectedIndex(1);
    });

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
    });

    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  it('should not call onSelect if no item is selected on Enter', () => {
    renderHook(() => useKeyboardNavigation(3, mockOnSelect, mockOnClose, true));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);
    });

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should handle Escape key', () => {
    renderHook(() => useKeyboardNavigation(3, mockOnSelect, mockOnClose, true));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle Home key', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(5, mockOnSelect, mockOnClose, true)
    );

    act(() => {
      result.current.setSelectedIndex(3);
    });

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Home' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(0);
  });

  it('should handle End key', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(5, mockOnSelect, mockOnClose, true)
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'End' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(4);
  });

  it('should handle Tab key', () => {
    renderHook(() => useKeyboardNavigation(3, mockOnSelect, mockOnClose, true));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(event);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should ignore keyboard events when navigation is inactive', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(3, mockOnSelect, mockOnClose, false)
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(-1);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should ignore keyboard events when itemCount is 0', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(0, mockOnSelect, mockOnClose, true)
    );

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(-1);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('should ignore unhandled keys', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(3, mockOnSelect, mockOnClose, true)
    );

    const initialIndex = result.current.selectedIndex;

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Space' });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(initialIndex);
    expect(mockOnSelect).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should prevent default for handled keys', () => {
    renderHook(() => useKeyboardNavigation(3, mockOnSelect, mockOnClose, true));

    const keysToTest = ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Home', 'End'];

    keysToTest.forEach(key => {
      const preventDefault = jest.fn();
      const event = new KeyboardEvent('keydown', { key });
      event.preventDefault = preventDefault;

      act(() => {
        document.dispatchEvent(event);
      });

      expect(preventDefault).toHaveBeenCalled();
    });
  });

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() =>
      useKeyboardNavigation(3, mockOnSelect, mockOnClose, true)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should allow manual selectedIndex updates', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation(5, mockOnSelect, mockOnClose, true)
    );

    expect(result.current.selectedIndex).toBe(-1);

    act(() => {
      result.current.setSelectedIndex(3);
    });

    expect(result.current.selectedIndex).toBe(3);

    act(() => {
      result.current.setSelectedIndex(0);
    });

    expect(result.current.selectedIndex).toBe(0);
  });
});