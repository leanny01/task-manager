import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryHover: string;
      secondary: string;
      text: {
        primary: string;
        secondary: string;
        light: string;
      };
      border: string;
    };
  }
}
