import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce string values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'changed', delay: 300 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('changed');
  });

  it('should debounce number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 500 } }
    );

    expect(result.current).toBe(0);

    rerender({ value: 42, delay: 500 });
    expect(result.current).toBe(0);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(42);
  });

  it('should debounce object values', () => {
    const initialObj = { name: 'initial' };
    const changedObj = { name: 'changed' };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 300 } }
    );

    expect(result.current).toBe(initialObj);

    rerender({ value: changedObj, delay: 300 });
    expect(result.current).toBe(initialObj);

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(changedObj);
  });

  it('should reset timer when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'change1', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'change2', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: 'final', delay: 300 });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('final');
  });

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'changed', delay: 300 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    rerender({ value: 'changed', delay: 500 });
    
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('changed');
  });

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'changed', delay: 0 });
    
    act(() => {
      jest.advanceTimersByTime(0);
    });
    
    expect(result.current).toBe('changed');
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    
    const { unmount } = renderHook(() => useDebounce('test', 300));
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should handle boolean values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: false, delay: 300 } }
    );

    expect(result.current).toBe(false);

    rerender({ value: true, delay: 300 });
    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(true);
  });

  it('should handle array values', () => {
    const initialArray = [1, 2, 3];
    const changedArray = [4, 5, 6];

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialArray, delay: 300 } }
    );

    expect(result.current).toBe(initialArray);

    rerender({ value: changedArray, delay: 300 });
    expect(result.current).toBe(initialArray);

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe(changedArray);
  });
});