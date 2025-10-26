import { useCallback, useEffect, useRef } from 'react';

function isFocusable(el) {
  if (!el) return false;
  const focusableSelectors = [
    'button', 'a[href]', 'input', 'select', 'textarea', '[tabindex]:not([tabindex="-1"])',
  ];
  return focusableSelectors.some(s => el.matches?.(s));
}

// PUBLIC_INTERFACE
export function useFocusNav(containerRef, options = {}) {
  /** Enables arrow key navigation across focusable children. */
  const lastInteraction = useRef(Date.now());
  const { selector = 'button, [data-focusable="true"]', stopPropagation = true } = options;

  const getFocusables = useCallback(() => {
    const root = containerRef.current;
    if (!root) return [];
    const list = Array.from(root.querySelectorAll(selector))
      .filter(el => !el.hasAttribute('disabled') && isFocusable(el));
    return list;
  }, [containerRef, selector]);

  const focusIndex = useCallback((index) => {
    const items = getFocusables();
    const safe = Math.max(0, Math.min(index, items.length - 1));
    items[safe]?.focus();
  }, [getFocusables]);

  const move = useCallback((dir) => {
    const items = getFocusables();
    const active = document.activeElement;
    const idx = active ? items.indexOf(active) : -1;
    if (items.length === 0) return;
    let next = 0;
    if (idx === -1) {
      next = 0;
    } else {
      if (dir === 'right' || dir === 'down') next = (idx + 1) % items.length;
      else next = (idx - 1 + items.length) % items.length;
    }
    items[next]?.focus();
  }, [getFocusables]);

  useEffect(() => {
    const handler = (e) => {
      const keys = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
        Enter: 'enter',
        Escape: 'esc',
        Backspace: 'back',
      };
      const mapped = keys[e.key];
      if (!mapped) return;

      lastInteraction.current = Date.now();

      if (mapped === 'left' || mapped === 'right' || mapped === 'up' || mapped === 'down') {
        if (stopPropagation) {
          e.preventDefault();
          e.stopPropagation();
        }
        move(mapped);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move, stopPropagation]);

  return {
    move,
    focusFirst: () => focusIndex(0),
    focusLast: () => {
      const items = getFocusables();
      focusIndex(items.length - 1);
    },
    lastInteraction,
  };
}
