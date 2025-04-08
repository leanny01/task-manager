import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const StyledButton = styled.button<ButtonProps>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background-color: ${props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      background-color: ${props.theme.colors.primaryHover};
    }
  ` : `
    background: none;
    border: 1px solid ${props.theme.colors.border};
    color: ${props.theme.colors.text.secondary};
    
    &:hover {
      background-color: ${props.theme.colors.secondary};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return <StyledButton variant={variant} {...props} />;
}; 