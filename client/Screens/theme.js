export const colors = {
    // Primary colors
    primary: '#FFD700', // Gold
    secondary: '#FFA500', // Orange (used in gradients)
    background: '#121212', // Dark background
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.5)',
    
    // UI elements
    surface: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 215, 0, 0.5)',
    
    // Status colors
    active: '#FFD700',
    inactive: 'rgba(255, 255, 255, 0.4)',
  };
  
  export const gradients = {
    primary: ['#FFD700', '#FFA500'], // Gold to Orange
  };
  
  export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  };
  
  export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 25,
    full: 9999,
  };
  
  export const typography = {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  };
  
  // Reusable styles
  export const commonStyles = {
    // Container styles
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    // Input styles
    input: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      color: colors.textPrimary,
      fontSize: typography.sizes.md,
    },
    
    // Button styles
    buttonBase: {
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    primaryButton: {
      alignItems: 'center',
    },
    primaryButtonText: {
      color: colors.background,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      alignItems: 'center',
      borderRadius: borderRadius.lg,
    },
    secondaryButtonText: {
      color: colors.textPrimary,
      fontSize: typography.sizes.md,
    },
    
    // Label styles
    label: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    
    // Image styles
    image: {
      width: '95%',
      height: '100%',
      borderRadius: borderRadius.md,
    },
    
    // Card styles
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      borderWidth: 2,
      borderColor: colors.border,
    },
  };