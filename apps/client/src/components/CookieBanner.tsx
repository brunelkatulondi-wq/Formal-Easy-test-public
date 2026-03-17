import React from 'react';
import styled from 'styled-components';
import Button from './ui/Button';

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = React.useState(() => {
    return localStorage.getItem('cookiesAccepted') !== 'true';
  });

  const accept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Banner>
      <div>
        Nous utilisons des cookies pour améliorer votre expérience (analytics, sécurité). Vous pouvez continuer sans accepter pour naviguer.
      </div>
      <Actions>
        <Button variant="outline" size="sm" onClick={accept}>Accepter</Button>
        <Button variant="ghost" size="sm" onClick={() => setVisible(false)}>Continuer</Button>
      </Actions>
    </Banner>
  );
};

const Banner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0d1d45;
  color: white;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  z-index: 4000;
  box-shadow: 0 -6px 20px rgba(0,0,0,0.3);
  font-size: 13px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export default CookieBanner;
