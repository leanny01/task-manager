import React from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Label = styled.label`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text.secondary};
`;

const StyledInput = styled.input`
    padding: 0.75rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 0.375rem;
    font-size: 1rem;
    color: ${props => props.theme.colors.text.primary};
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
    }
    
    &::placeholder {
        color: ${props => props.theme.colors.text.secondary};
    }
    
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`;

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
    return (
        <InputContainer>
            <Label htmlFor={props.id}>{label}</Label>
            <StyledInput {...props} />
        </InputContainer>
    );
}; 