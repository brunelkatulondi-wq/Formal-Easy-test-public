// apps/client/src/components/ui/Badge.tsx
import styled from 'styled-components';

interface BadgeProps {
  type?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-family: 'Barlow Condensed', sans-serif;

  ${props => {
    switch (props.type) {
      case 'success': return 'background-color: #D1FAE5; color: #065F46;';
      case 'warning': return 'background-color: #FEF3C7; color: #92400E;';
      case 'danger': return 'background-color: #FEE2E2; color: #991B1B;';
      case 'info': return 'background-color: #DBEAFE; color: #1E40AF;';
      default: return 'background-color: #F3F4F6; color: #374151;';
    }
  }}
`;

export default Badge;
