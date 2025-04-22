import { DefaultTheme } from "styled-components";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  hover: string;
  success: string;
  successLight: string;
  danger: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  text: {
    primary: string;
    secondary: string;
    light: string;
  };
  background: {
    primary: string;
    secondary: string;
    light: string;
    white: string;
  };
  border: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface CustomTheme extends DefaultTheme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  breakpoints: ThemeBreakpoints;
}

export const theme: CustomTheme = {
  colors: {
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    secondary: "#64748b",
    secondaryHover: "#475569",
    hover: "#f1f5f9",
    success: "#22c55e",
    successLight: "#86efac",
    danger: "#ef4444",
    error: "#ef4444",
    errorLight: "#fca5a5",
    warning: "#f59e0b",
    warningLight: "#fef3c7",
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
      light: "#94a3b8",
    },
    background: {
      primary: "#ffffff",
      secondary: "#f8fafc",
      light: "#f1f5f9",
      white: "#ffffff",
    },
    border: "#e2e8f0",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "1rem",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};
