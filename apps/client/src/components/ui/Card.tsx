// apps/client/src/components/ui/Card.tsx
import styled from 'styled-components';

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  border: 1px solid #F3F4F6;
`;

export const CardTitle = styled.h3`
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #0D1D45;
  margin-bottom: 16px;
  text-transform: uppercase;
`;

export const CardContent = styled.div`
  color: #4B5563;
  line-height: 1.5;
`;
