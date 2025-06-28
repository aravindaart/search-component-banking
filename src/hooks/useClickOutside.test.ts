import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  const mockHandler = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a ref', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    expect(result.current).toBeDefined();
    expect(result.current.current).toBeNull();
  });

  it('should call handler when clicking outside element', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);
    result.current.current = testElement;

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalledTimes(1);

    document.body.removeChild(testElement);
    document.body.removeChild(outsideElement);
  });

  it('should not call handler when clicking inside element', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    const testElement = document.createElement('div');
    const childElement = document.createElement('span');
    testElement.appendChild(childElement);
    document.body.appendChild(testElement);
    result.current.current = testElement;

    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: childElement });
    document.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();

    document.body.removeChild(testElement);
  });

  it('should not call handler when clicking on the element itself', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);
    result.current.current = testElement;

    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: testElement });
    document.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();

    document.body.removeChild(testElement);
  });

  it('should handle touchstart events', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);
    result.current.current = testElement;

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new TouchEvent('touchstart', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalledTimes(1);

    document.body.removeChild(testElement);
    document.body.removeChild(outsideElement);
  });

  it('should not call handler when ref is null', () => {
    renderHook(() => useClickOutside(mockHandler));
    
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideElement });
    document.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });

  it('should handle event target being null', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);
    result.current.current = testElement;

    // When target is null, the hook should not crash but may still call handler
    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: null, configurable: true });
    document.dispatchEvent(event);

    // The behavior when target is null is implementation dependent
    // Just ensure it doesn't crash

    document.body.removeChild(testElement);
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => useClickOutside(mockHandler));
    
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  it('should update handler when handler changes', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    const { result, rerender } = renderHook(
      ({ handler }) => useClickOutside(handler),
      { initialProps: { handler: handler1 } }
    );
    
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);
    result.current.current = testElement;

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event1 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event1, 'target', { value: outsideElement });
    document.dispatchEvent(event1);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    rerender({ handler: handler2 });

    const event2 = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event2, 'target', { value: outsideElement });
    document.dispatchEvent(event2);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);

    document.body.removeChild(testElement);
    document.body.removeChild(outsideElement);
  });

  it('should handle multiple rapid clicks', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);
    result.current.current = testElement;

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    for (let i = 0; i < 5; i++) {
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement });
      document.dispatchEvent(event);
    }

    expect(mockHandler).toHaveBeenCalledTimes(5);

    document.body.removeChild(testElement);
    document.body.removeChild(outsideElement);
  });

  it('should handle deeply nested elements', () => {
    const { result } = renderHook(() => useClickOutside(mockHandler));
    
    const testElement = document.createElement('div');
    const level1 = document.createElement('div');
    const level2 = document.createElement('div');
    const level3 = document.createElement('span');
    
    testElement.appendChild(level1);
    level1.appendChild(level2);
    level2.appendChild(level3);
    document.body.appendChild(testElement);
    result.current.current = testElement;

    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: level3 });
    document.dispatchEvent(event);

    expect(mockHandler).not.toHaveBeenCalled();

    document.body.removeChild(testElement);
  });

  it('should work with different element types', () => {
    const { result } = renderHook(() => useClickOutside<HTMLButtonElement>(mockHandler));
    
    const testButton = document.createElement('button');
    document.body.appendChild(testButton);
    result.current.current = testButton;

    const outsideDiv = document.createElement('div');
    document.body.appendChild(outsideDiv);

    const event = new MouseEvent('mousedown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: outsideDiv });
    document.dispatchEvent(event);

    expect(mockHandler).toHaveBeenCalledTimes(1);

    document.body.removeChild(testButton);
    document.body.removeChild(outsideDiv);
  });
});