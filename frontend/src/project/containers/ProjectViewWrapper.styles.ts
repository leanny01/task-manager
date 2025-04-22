import styled from "styled-components";

export const LoadingState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => props.theme.colors.text.secondary};
`;

export const ErrorMessage = styled.div`
  color: ${(props) => props.theme.colors.error};
  padding: 1rem;
  text-align: center;
`;
