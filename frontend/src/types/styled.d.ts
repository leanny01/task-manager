import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
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
        gray: string;
        dark: string;
      };
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
    shadows: {
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
  }
}
