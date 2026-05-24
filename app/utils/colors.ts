export const colors = {
  // Primary Colors
  primarySage: '#C084FC',      // Soft Purple
  darkSage: '#A855F7',         // Deep Purple
  
  // Background Colors
  creamBackground: '#F5F3FF',  // Very Light Purple
  cardBackground: '#FFFDF8',    // Soft White
  
  // Additional Colors for Homesty Analytics
  primaryPurple: '#C084FC',   // Soft Purple
  deepPurple: '#A855F7',      // Deep Purple
  pinkRose: '#F472B6',        // Pink Rose
  lightPink: '#F9A8D4',       // Light Pink
  lavender: '#E9D5FF',        // Lavender
} as const;

export type ColorPalette = typeof colors;