export const theme = {
  colors: {
    primary: '#2563EB',
    secondary: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    text: '#111827',
    surface: '#ffffff',
    background: '#f9fafb',
    overlay: 'rgba(17, 24, 39, 0.6)',
  },
  shadows: {
    md: '0 8px 24px rgba(0, 0, 0, 0.18)',
    sm: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  transition: {
    base: 'all 200ms ease',
    slow: 'all 400ms ease',
  },
  focus: {
    ring: '0 0 0 3px rgba(37, 99, 235, 0.5)',
  },
};

// PUBLIC_INTERFACE
export function applyThemeToDocument() {
  /** Applies theme CSS variables to :root for CSS consumption. */
  const r = document.documentElement;
  r.style.setProperty('--crp-primary', theme.colors.primary);
  r.style.setProperty('--crp-secondary', theme.colors.secondary);
  r.style.setProperty('--crp-success', theme.colors.success);
  r.style.setProperty('--crp-error', theme.colors.error);
  r.style.setProperty('--crp-text', theme.colors.text);
  r.style.setProperty('--crp-surface', theme.colors.surface);
  r.style.setProperty('--crp-background', theme.colors.background);
  r.style.setProperty('--crp-overlay', theme.colors.overlay);
  r.style.setProperty('--crp-shadow-sm', theme.shadows.sm);
  r.style.setProperty('--crp-shadow-md', theme.shadows.md);
  r.style.setProperty('--crp-radius-sm', theme.radius.sm);
  r.style.setProperty('--crp-radius-md', theme.radius.md);
  r.style.setProperty('--crp-radius-lg', theme.radius.lg);
  r.style.setProperty('--crp-radius-full', theme.radius.full);
  r.style.setProperty('--crp-transition', theme.transition.base);
  r.style.setProperty('--crp-transition-slow', theme.transition.slow);
  r.style.setProperty('--crp-focus-ring', theme.focus.ring);
}
