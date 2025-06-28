import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect clicks outside a specified element
 * Useful for closing dropdowns, modals, or other overlay components
 * 
 * @param handler - Function to call when click outside is detected
 * @returns Ref to attach to the element you want to detect outside clicks for
 */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // If the ref element exists and the click was outside of it
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]);

  return ref;
}