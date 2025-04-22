import { DefaultTheme } from "styled-components";

export interface CustomTheme extends DefaultTheme {
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    hover: string;
    background: {
      white: string;
      light: string;
    };
    text: {
      primary: string;
      secondary: string;
      light: string;
    };
    error: string;
    errorLight: string;
    success: string;
    successLight: string;
    warning: string;
    border: string;
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
  fontSizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const theme: CustomTheme = {
  colors: {
    primary: "#007bff",
    primaryHover: "#0056b3",
    secondary: "#6c757d",
    secondaryHover: "#5a6268",
    hover: "#e9ecef",
    background: {
      white: "#ffffff",
      light: "#f8f9fa",
    },
    text: {
      primary: "#212529",
      secondary: "#6c757d",
      light: "#f8f9fa",
    },
    error: "#dc3545",
    errorLight: "#f8d7da",
    success: "#28a745",
    successLight: "#d4edda",
    warning: "#ffc107",
    border: "#dee2e6",
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
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
};
