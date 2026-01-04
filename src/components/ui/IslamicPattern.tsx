import { CSSProperties } from 'react';

interface IslamicPatternProps {
  variant?: 'complex' | 'simple' | 'star';
  color?: 'white' | 'primary' | 'custom';
  customColor?: string;
  size?: number;
  opacity?: number;
  className?: string;
  fixed?: boolean;
}

/**
 * Reusable Islamic geometric pattern overlay component
 * Used across hero sections, cards, and modals for consistent theming
 */
export default function IslamicPattern({
  variant = 'complex',
  color = 'white',
  size = 100,
  opacity = 0.15,
  className = '',
  fixed = false,
}: IslamicPatternProps) {
  // Color mapping
  const colorMap = {
    white: '%23ffffff',
    primary: '%230d5c3f',
  };

  const strokeColor = colorMap[color as keyof typeof colorMap] || colorMap.white;

  // Pattern variants
  const patterns = {
    // Full complex pattern with diamonds, circles, and stars
    complex: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${strokeColor}' stroke-width='0.5'%3E%3Cpath d='M50 10 L90 50 L50 90 L10 50 Z'/%3E%3Cpath d='M50 25 L75 50 L50 75 L25 50 Z'/%3E%3Ccircle cx='50' cy='50' r='15'/%3E%3Cpath d='M50 0 L60 20 L50 40 L40 20 Z'/%3E%3Cpath d='M50 60 L60 80 L50 100 L40 80 Z'/%3E%3Cpath d='M0 50 L20 60 L40 50 L20 40 Z'/%3E%3Cpath d='M60 50 L80 60 L100 50 L80 40 Z'/%3E%3C/g%3E%3C/svg%3E")`,
    
    // Simpler pattern with diamonds and circle
    simple: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${strokeColor}' stroke-width='0.8'%3E%3Cpath d='M40 8 L72 40 L40 72 L8 40 Z'/%3E%3Cpath d='M40 20 L60 40 L40 60 L20 40 Z'/%3E%3Ccircle cx='40' cy='40' r='10'/%3E%3C/g%3E%3C/svg%3E")`,
    
    // Star pattern
    star: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z' fill='${strokeColor}' fill-opacity='0.5'/%3E%3C/svg%3E")`,
  };

  const style: CSSProperties = {
    backgroundImage: patterns[variant],
    backgroundSize: `${size}px ${size}px`,
    ...(fixed && { backgroundAttachment: 'fixed' }),
  };

  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{ 
        ...style, 
        opacity 
      }}
      aria-hidden="true"
    />
  );
}
