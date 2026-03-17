// apps/client/src/components/ui/Logo.tsx
import React from 'react';
import styled from 'styled-components';

const LogoWrapper = styled.div<{ size?: number, light?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  .logo-text {
    font-family: 'Barlow Condensed', sans-serif;
    line-height: 0.9;
    display: flex;
    flex-direction: column;
    
    .formal-easy {
      font-weight: 800;
      font-size: ${props => (props.size || 28) * 0.8}px;
      color: ${props => props.light ? '#ffffff' : '#0d1d45'};
      text-transform: uppercase;
    }
    .drc {
      font-weight: 900;
      font-size: ${props => (props.size || 28)}px;
      color: #2cbab8;
      text-transform: uppercase;
    }
  }
`;

export const Logo = ({ size = 28, light = false }) => (
  <LogoWrapper size={size} light={light}>
    <svg width={size * 1.5} height={size * 1.5} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield (Navy) */}
      <path d="M50 5L15 20V45C15 65 30 85 50 95C70 85 85 65 85 45V20L50 5Z" stroke={light ? "white" : "#0d1d45"} strokeWidth="8" fill="none"/>
      {/* Red Checkmark */}
      <path d="M35 50L45 60L65 40" stroke="#ff0000" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Brain/Network Nodes attached to the right side of the shield */}
      <circle cx="75" cy="30" r="3" fill="#2cbab8"/>
      <circle cx="85" cy="40" r="3" fill="#2cbab8"/>
      <circle cx="78" cy="50" r="3" fill="#2cbab8"/>
      <circle cx="82" cy="20" r="2" fill="#2cbab8"/>
      <line x1="75" y1="30" x2="85" y2="40" stroke="#2cbab8" strokeWidth="1"/>
      <line x1="85" y1="40" x2="78" y2="50" stroke="#2cbab8" strokeWidth="1"/>
      <line x1="75" y1="30" x2="82" y2="20" stroke="#2cbab8" strokeWidth="1"/>
      <line x1="70" y1="35" x2="75" y2="30" stroke="#2cbab8" strokeWidth="1"/>
    </svg>
    <div className="logo-text">
       <span className="formal-easy">Formal Easy</span>
       <span className="drc">DRC.</span>
    </div>
  </LogoWrapper>
);

export default Logo;
