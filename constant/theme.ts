// Brand Colors
export const brandColors = {
  primary: {
    DEFAULT: '#c08b79', // Terracotta
    hover: '#b07a69',
    light: '#d49a8a',
    main: '#02343F'
  },
  secondary: {
    DEFAULT: '#768f7d', // Muted green
    hover: '#6a8070',
    light: '#8a9f8f',
  },
  accent: {
    DEFAULT: '#181d2a', // Dark blue
    hover: '#151a26',
    light: '#1e2532',
  },
} as const;

// Background Colors
export const backgroundColors = {
  primary: '#e5ebd3', // Main background
  secondary: '#ffa249', // Darker secondary background
  card: '#1c1a2e', // Card background
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

// Text Colors
export const textColors = {
  primary: '#ffffff',
  secondary: 'rgba(255, 255, 255, 0.7)',
  muted: 'rgba(255, 255, 255, 0.5)',
  disabled: 'rgba(255, 255, 255, 0.3)',
  inverse: '#191121',
} as const;

// Border Colors
export const borderColors = {
  DEFAULT: 'rgba(255, 255, 255, 0.1)',
  light: 'rgba(255, 255, 255, 0.2)',
  dark: 'rgba(255, 255, 255, 0.05)',
} as const;

// Status Colors
export const statusColors = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// Chart Colors (for data visualization)
export const chartColors = {
  1: 'oklch(0.646 0.222 41.116)',
  2: 'oklch(0.6 0.118 184.704)',
  3: 'oklch(0.398 0.07 227.392)',
  4: 'oklch(0.828 0.189 84.429)',
  5: 'oklch(0.769 0.188 70.08)',
} as const;

// Shadow Colors
export const shadowColors = {
  sm: 'rgba(0, 0, 0, 0.1)',
  DEFAULT: 'rgba(0, 0, 0, 0.25)',
  lg: 'rgba(0, 0, 0, 0.35)',
  glow: 'rgba(192, 139, 121, 0.4)', // Brand primary glow
} as const;

// Gradient Presets
export const gradients = {
  primary: 'linear-gradient(135deg, #c08b79 0%, #181d2a 100%)',
  secondary: 'linear-gradient(135deg, #768f7d 0%, #181d2a 100%)',
  subtle: 'linear-gradient(135deg, rgba(192, 139, 121, 0.1) 0%, rgba(24, 29, 42, 0.1) 100%)',
  hero: 'linear-gradient(135deg, #191121 0%, #2a2540 100%)',
} as const;

// Complete Theme Object
export const theme = {
  colors: {
    brand: brandColors,
    background: backgroundColors,
    text: textColors,
    border: borderColors,
    status: statusColors,
    chart: chartColors,
    shadow: shadowColors,
    gradient: gradients,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: 'calc(0.625rem - 4px)',
    md: 'calc(0.625rem - 2px)',
    lg: '0.625rem',
    xl: 'calc(0.625rem + 4px)',
    '2xl': 'calc(0.625rem + 8px)',
    full: '9999px',
  },
} as const;

// CSS Variables for Tailwind CSS
export const cssVariables = {
  colors: {
    '--color-brand-primary': brandColors.primary.DEFAULT,
    '--color-brand-primary-hover': brandColors.primary.hover,
    '--color-brand-secondary': brandColors.secondary.DEFAULT,
    '--color-brand-accent': brandColors.accent.DEFAULT,
    '--color-background': backgroundColors.primary,
    '--color-background-secondary': backgroundColors.secondary,
    '--color-background-card': backgroundColors.card,
    '--color-text-primary': textColors.primary,
    '--color-text-secondary': textColors.secondary,
    '--color-text-muted': textColors.muted,
    '--color-border': borderColors.DEFAULT,
    '--shadow-glow': shadowColors.glow,
  },
} as const;

// Type exports for TypeScript
export type BrandColor = typeof brandColors;
export type BackgroundColor = typeof backgroundColors;
export type TextColor = typeof textColors;
export type StatusColor = typeof statusColors;
export type Gradient = typeof gradients;

// Helper function to get color with opacity
export function withOpacity(color: string, opacity: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // Handle oklch colors - convert to rgba
  return color;
}

// Helper function to get contrast color (light or dark)
export function getContrastColor(hexColor: string): 'light' | 'dark' {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'dark' : 'light';
}

export default theme;

