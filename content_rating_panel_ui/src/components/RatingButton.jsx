import React from 'react';

const icons = {
  like: '👍',
  love: '❤️',
  dislike: '👎',
};

// PUBLIC_INTERFACE
export const RatingButton = ({ value, label, active = false, onSelect, onFocus, onBlur }) => {
  /** Focusable rating button with active styling and emoji icon. */
  return (
    <button
      className="crp-rating-btn crp-focusable"
      data-active={active}
      aria-pressed={active}
      aria-label={label}
      onClick={() => onSelect(value)}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <span aria-hidden="true" style={{ fontSize: 22 }}>{icons[value]}</span>
      <span>{label}</span>
    </button>
  );
};
