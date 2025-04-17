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
  }
}
