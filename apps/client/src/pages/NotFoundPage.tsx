import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackButton from '../components/ui/BackButton';

const NotFoundPage = () => {
  const location = useLocation();
  return (
    <Wrapper>
      <Header>
        <Logo size={20} />
        <BackButton />
      </Header>
      <Card>
        <h1>Page introuvable</h1>
        <p>L’URL « {location.pathname} » n’existe pas ou n’est plus disponible.</p>
        <Actions>
          <Link to="/"><Button variant="secondary">Retour à l’accueil</Button></Link>
          <Link to="/dashboard"><Button variant="outline">Aller au dashboard</Button></Link>
        </Actions>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0d1d45;
  font-family: 'Barlow', sans-serif;
`;

const Header = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  max-width: 640px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  h1 { font-size: 28px; margin-bottom: 12px; }
  p { color: #374151; margin-bottom: 20px; }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export default NotFoundPage;
