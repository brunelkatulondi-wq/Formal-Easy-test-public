// apps/client/src/pages/dashboard/ClientDashboard.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { FileText, Plus, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';

import DashboardLayout from '../../components/layout/DashboardLayout';

const ClientDashboard = () => {
  const { data: dossiers, isLoading } = useQuery({
    queryKey: ['my-dossiers'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dossiers/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DONE': return <Badge type="success">Terminé</Badge>;
      case 'PAY_PENDING': return <Badge type="warning">En attente de traitement</Badge>;
      case 'GUCE_DEPOSIT': return <Badge type="info">Déposé au GUCE</Badge>;
      case 'DRAFT': return <Badge type="default">Brouillon</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <Header>
        <div>
          <Title>Mon Espace Coffre-Fort</Title>
          <Subtitle>Suivez l'avancement de vos dossiers de création d'entreprise.</Subtitle>
        </div>
        <Link to="/questionnaire">
          <Button variant="secondary" size="md">
            <Plus size={18} style={{marginRight: '8px'}} />
            Nouveau Dossier
          </Button>
        </Link>
      </Header>

      {isLoading ? (
        <Loading>Chargement de vos dossiers...</Loading>
      ) : dossiers?.length === 0 ? (
        <EmptyState>
          <FileText size={48} color="#9CA3AF" />
          <p>Vous n'avez pas encore de dossier en cours.</p>
          <Link to="/questionnaire" style={{marginTop: '16px'}}>
            <Button variant="secondary">Lancer ma création maintenant</Button>
          </Link>
        </EmptyState>
      ) : (
        <Grid>
          {dossiers?.map((dossier: any) => (
            <DossierCard key={dossier.id}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <Ref>{dossier.reference}</Ref>
                  <CompanyName>{dossier.companyName}</CompanyName>
                </div>
                {getStatusBadge(dossier.status)}
              </div>
              
              <Details>
                <span>{dossier.legalForm} • Capital: {dossier.capital} $</span>
              </Details>

              <Footer>
                <Link to={`/dashboard/dossier/${dossier.id}`}>
                  <Button variant="outline" size="sm" fullWidth>
                    Suivre le dossier <ArrowRight size={14} style={{marginLeft: '8px'}} />
                  </Button>
                </Link>
              </Footer>
            </DossierCard>
          ))}
        </Grid>
      )}
    </DashboardLayout>
  );
};

// Styles
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: 'Barlow Condensed';
  font-size: 36px;
  font-weight: 900;
  color: #0D1D45;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  color: #6B7280;
  font-size: 16px;
`;

const Loading = styled.div`text-align: center; padding: 100px; color: #6B7280;`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  background: white;
  border-radius: 16px;
  border: 2px dashed #E5E7EB;
  text-align: center;
  color: #6B7280;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const DossierCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Ref = styled.span`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #2CC4C0;
  margin-bottom: 4px;
`;

const CompanyName = styled.h3`
  font-family: 'Barlow';
  font-size: 18px;
  font-weight: 700;
  color: #0D1D45;
  margin-bottom: 12px;
`;

const Details = styled.div`
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
`;

const Footer = styled.div`
  margin-top: auto;
`;

export default ClientDashboard;
