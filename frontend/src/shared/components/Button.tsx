import React from 'react';
import styled from 'styled-components';
import { CustomTheme } from '../../theme';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled.button<ButtonProps>`
  padding: ${props => {
        switch (props.size) {
            case 'small': return '0.5rem 1rem';
            case 'large': return '1rem 2rem';
            default: return '0.75rem 1.5rem';
        }
    }};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: ${props => {
        switch (props.size) {
            case 'small': return '0.875rem';
            case 'large': return '1.125rem';
            default: return '1rem';
        }
    }};
  background-color: ${props => {
        switch (props.variant) {
            case 'secondary': return props.theme.colors.secondary;
            case 'danger': return props.theme.colors.error;
            default: return props.theme.colors.primary;
        }
    }};
  color: ${props => props.theme.colors.text.light};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => {
        switch (props.variant) {
            case 'secondary': return props.theme.colors.secondaryHover;
            case 'danger': return props.theme.colors.error;
            default: return props.theme.colors.primaryHover;
        }
    }};
  }
`;

export function Button({ onClick, children, variant = 'primary', size = 'medium' }: ButtonProps) {
    return (
        <StyledButton onClick={onClick} variant={variant} size={size}>
            {children}
        </StyledButton>
    );
} 