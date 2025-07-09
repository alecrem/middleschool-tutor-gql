import { vi } from "vitest";

/**
 * Mock implementation for useTheme hooks used in component tests
 * This provides consistent theme values for testing components that depend on theme context
 */
export const mockUseTheme = () => {
  // Mock the ThemeContext first
  vi.mock("../contexts/ThemeContext", () => ({
    useTheme: () => ({
      mode: "light",
      colors: {
        button: {
          primary: "#3B82F6",
          text: "#FFFFFF",
          disabled: "#9CA3AF",
        },
        background: {
          primary: "#FFFFFF",
          secondary: "#F3F4F6",
          card: "#FFFFFF",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          link: "#3B82F6",
          error: "#EF4444",
        },
        border: {
          primary: "#D1D5DB",
          error: "#EF4444",
        },
      },
      setTheme: vi.fn(),
    }),
  }));

  // Mock the useTheme hooks
  vi.mock("../hooks/useTheme", () => ({
    useThemedStyles: () => ({
      colors: {
        button: {
          primary: "#3B82F6",
          text: "#FFFFFF",
          disabled: "#9CA3AF",
        },
        background: {
          primary: "#FFFFFF",
          secondary: "#F3F4F6",
          card: "#FFFFFF",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          link: "#3B82F6",
          error: "#EF4444",
        },
        border: {
          primary: "#D1D5DB",
          error: "#EF4444",
        },
      },
      utilities: {
        borderRadius: (_size: string) => "8px",
        transition: (prop: string) => `${prop} 0.2s ease`,
        spacing: (size: string) => {
          const sizes = {
            xs: "4px",
            sm: "8px",
            md: "12px",
            lg: "16px",
            xl: "20px",
            "2xl": "24px",
          };
          return sizes[size as keyof typeof sizes] || "12px";
        },
        fontSize: (size: string) => {
          const sizes = {
            xs: "12px",
            sm: "14px",
            base: "16px",
            lg: "18px",
            xl: "20px",
          };
          return sizes[size as keyof typeof sizes] || "16px";
        },
      },
    }),
    useDesignTokens: () => ({
      typography: {
        fontWeight: {
          medium: "500",
        },
      },
    }),
    useTheme: () => ({
      mode: "light",
      colors: {
        button: {
          primary: "#3B82F6",
          text: "#FFFFFF",
          disabled: "#9CA3AF",
        },
        background: {
          primary: "#FFFFFF",
          secondary: "#F3F4F6",
          card: "#FFFFFF",
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          link: "#3B82F6",
          error: "#EF4444",
        },
        border: {
          primary: "#D1D5DB",
          error: "#EF4444",
        },
      },
      setTheme: vi.fn(),
    }),
  }));
};
