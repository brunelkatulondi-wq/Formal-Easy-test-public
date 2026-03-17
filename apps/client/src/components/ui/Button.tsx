// apps/client/src/components/ui/Button.tsx
import styled from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  font-family: 'Barlow', sans-serif;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  ${props => {
    switch (props.size) {
      case 'sm': return 'padding: 8px 16px; font-size: 13px;';
      case 'lg': return 'padding: 16px 32px; font-size: 16px;';
      default: return 'padding: 12px 24px; font-size: 14px;';
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'secondary': // Teal Official (#2cbab8)
        return `
          background-color: #2cbab8;
          color: white;
          &:hover { background-color: #24a19f; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(44, 186, 184, 0.3); }
        `;
      case 'danger': // Red Official (#ff0000)
        return `
          background-color: #ff0000;
          color: white;
          &:hover { background-color: #cc0000; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3); }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border: 2px solid #0d1d45;
          color: #0d1d45;
          &:hover { background-color: #0d1d45; color: white; }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: #0d1d45;
          &:hover { background-color: #f3f4f6; }
        `;
      default: // Navy Official (#0d1d45)
        return `
          background-color: #0d1d45;
          color: white;
          &:hover { background-color: #142756; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(13, 29, 69, 0.3); }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export default Button;
