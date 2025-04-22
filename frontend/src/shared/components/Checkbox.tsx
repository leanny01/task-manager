import React from 'react';
import styled from 'styled-components';
import { CustomTheme } from '../../theme';

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
}

const CheckboxInput = styled.input`
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
`;

export function Checkbox({ checked, onChange }: CheckboxProps) {
    return (
        <CheckboxInput
            type="checkbox"
            checked={checked}
            onChange={onChange}
        />
    );
} 