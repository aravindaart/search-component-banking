import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing keyboard navigation in lists
 * Handles arrow keys, enter, escape, home, and end keys
 * 
 * @param itemCount - Total number of items to navigate
 * @param onSelect - Callback when an item is selected (Enter key)
 * @param onClose - Callback when list should close (Escape key)
 * @param isActive - Whether keyboard navigation is active
 * @returns Object with selectedIndex and keyboard event handler
 */
export function useKeyboardNavigation(
  itemCount: number,
  onSelect: (index: number) => void,
  onClose: () => void,
  isActive: boolean
) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selected index when navigation becomes inactive or item count changes
  useEffect(() => {
    if (!isActive || itemCount === 0) {
      setSelectedIndex(-1);
    }
  }, [isActive, itemCount]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isActive || itemCount === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < itemCount - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : itemCount - 1
        );
        break;

      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          onSelect(selectedIndex);
        }
        break;

      case 'Escape':
        event.preventDefault();
        onClose();
        break;

      case 'Home':
        event.preventDefault();
        setSelectedIndex(0);
        break;

      case 'End':
        event.preventDefault();
        setSelectedIndex(itemCount - 1);
        break;

      case 'Tab':
        // Allow tab to close dropdown and move to next element
        onClose();
        break;
    }
  }, [isActive, itemCount, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { selectedIndex, setSelectedIndex };
}