import { vi } from 'vitest'

/**
 * Mock implementation for useTheme hooks used in component tests
 * This provides consistent theme values for testing components that depend on theme context
 */
export const mockUseTheme = () => {
  vi.mock('../hooks/useTheme', () => ({
    useThemedStyles: () => ({
      colors: {
        button: {
          primary: '#3B82F6',
          text: '#FFFFFF',
          disabled: '#9CA3AF',
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F3F4F6',
        },
        text: {
          primary: '#111827',
        },
        border: {
          primary: '#D1D5DB',
        },
      },
      utilities: {
        borderRadius: (size: string) => '8px',
        transition: (prop: string) => `${prop} 0.2s ease`,
        spacing: (size: string) => {
          const sizes = { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '20px', '2xl': '24px' }
          return sizes[size as keyof typeof sizes] || '12px'
        },
        fontSize: (size: string) => {
          const sizes = { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px' }
          return sizes[size as keyof typeof sizes] || '16px'
        },
      },
    }),
    useDesignTokens: () => ({
      typography: {
        fontWeight: {
          medium: '500',
        },
      },
    }),
  }))
}