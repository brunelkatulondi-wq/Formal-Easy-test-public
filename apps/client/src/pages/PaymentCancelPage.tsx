import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackButton from '../components/ui/BackButton';
import axios from 'axios';
import toast from 'react-hot-toast';

const PaymentCancelPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const dossierId = params.get('dossierId');
  const [status, setStatus] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(!!dossierId);

  React.useEffect(() => {
    if (!dossierId) return;
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(`/api/dossiers/${dossierId}`);
        setStatus(data.status);
      } catch (e) {
        toast.error("Impossible de rafraîchir le dossier (session expirée ?)");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, [dossierId]);

  return (
    <Wrapper>
      <Header>
        <Logo size={20} />
        <BackButton />
      </Header>
      <Card>
        <h1>Paiement annulé</h1>
        <p>Le paiement n'a pas abouti. Vous pouvez réessayer ou reprendre plus tard.</p>
        {dossierId && (
          <Info>
            <div>Référence dossier : <strong>{dossierId}</strong></div>
            <div>Statut : <strong>{loading ? 'Mise à jour...' : status || '—'}</strong></div>
          </Info>
        )}
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

const Info = styled.div`
  background: #fef3c7;
  border: 1px solid #fcd34d;
  padding: 12px 16px;
  border-radius: 12px;
  color: #92400e;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export default PaymentCancelPage;
