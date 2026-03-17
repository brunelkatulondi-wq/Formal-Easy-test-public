import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackButton from '../components/ui/BackButton';

const PaymentCancelPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dossierId = params.get('dossierId');

  return (
    <Wrapper>
      <Header>
        <Logo size={20} />
        <BackButton />
      </Header>
      <Card>
        <h1>Paiement annulé</h1>
        <p>Le paiement n'a pas abouti. Vous pouvez réessayer ou reprendre plus tard.</p>
        <Actions>
          {dossierId && (
            <Link to={`/dashboard/dossier/${dossierId}`}>
              <Button variant="secondary">Réessayer le paiement</Button>
            </Link>
          )}
          <Link to="/dashboard">
            <Button variant="outline">Retour au tableau de bord</Button>
          </Link>
        </Actions>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  background: #f9fafb;
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
  p { color: #374151; margin-bottom: 16px; }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export default PaymentCancelPage;
