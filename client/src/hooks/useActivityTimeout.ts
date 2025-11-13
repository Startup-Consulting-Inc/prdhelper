/**
 * useActivityTimeout Hook
 *
 * Tracks user activity and triggers a callback after a specified period of inactivity.
 * Used for automatic session timeout to log out inactive users.
 *
 * @param onTimeout - Callback function to execute when inactivity timeout is reached
 * @param timeoutDuration - Duration in milliseconds before timeout (default: 1 hour)
 * @param enabled - Whether activity tracking is enabled (default: true)
 */

import { useEffect, useRef, useCallback } from 'react';

const DEFAULT_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const DEBOUNCE_DELAY = 500; // Debounce activity events to avoid excessive timer resets

export function useActivityTimeout(
  onTimeout: () => void,
  timeoutDuration: number = DEFAULT_TIMEOUT,
  enabled: boolean = true
) {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const debounceIdRef = useRef<NodeJS.Timeout | null>(null);

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    // Clear existing timeout
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    // Set new timeout
    timeoutIdRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutDuration);
  }, [onTimeout, timeoutDuration]);

  // Handle activity with debouncing to avoid excessive timer resets
  const handleActivity = useCallback(() => {
    // Clear existing debounce timer
    if (debounceIdRef.current) {
      clearTimeout(debounceIdRef.current);
    }

    // Debounce the timer reset
    debounceIdRef.current = setTimeout(() => {
      resetTimer();
    }, DEBOUNCE_DELAY);
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) {
      // Clean up timers if tracking is disabled
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current);
      }
      return;
    }

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Start the initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      // Remove event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      // Clear timers
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current);
      }
    };
  }, [enabled, resetTimer, handleActivity]);
}
