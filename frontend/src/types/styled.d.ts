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
