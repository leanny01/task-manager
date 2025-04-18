import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryHover: string;
      secondary: string;
      secondaryHover: string;
      hover: string;
      border: string;
      error: string;
      errorLight: string;
      success: string;
      successLight: string;
      background: {
        white: string;
        light: string;
      };
      text: {
        primary: string;
        secondary: string;
        light: string;
      };
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
}

export const theme = {
  colors: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    secondary: "#f8fafc",
    secondaryHover: "#f1f5f9",
    hover: "#f8fafc",
    border: "#e5e7eb",
    error: "#dc2626",
    errorLight: "#fee2e2",
    success: "#059669",
    successLight: "#d1fae5",
    background: {
      white: "#ffffff",
      light: "#f8fafc",
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563",
      light: "#6b7280",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
};
