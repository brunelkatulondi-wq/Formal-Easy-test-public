// apps/client/src/pages/dashboard/AdminDashboard.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { Users, FileStack, CheckCircle, Clock, Search, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminDashboard = () => {
  const queryClient = useQueryClient();

  const { data: stats, isError: statsError, error: sErr } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log("[AdminDashboard] Stats reçues:", data);
      return data;
    }
  });

  const { data: dossiers, isLoading, isError: dossiersError, error: dErr } = useQuery({
    queryKey: ['admin-dossiers'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/dossiers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log("[AdminDashboard] Dossiers reçus:", data);
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return axios.patch(`/api/admin/dossier/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dossiers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success("Statut mis à jour !");
    }
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const [filter, setFilter] = React.useState('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredDossiers = dossiers?.filter((d: any) => {
    const matchesStatus = filter === 'ALL' || d.status === filter;
    const matchesSearch = (d.companyName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (d.reference?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                          (d.user?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <Header>
        <Title>Pipeline Administrateur</Title>
        <Subtitle>Gestion centrale des formalités OHADA au GUCE.</Subtitle>
      </Header>

      {/* Affichage des Erreurs */}
      {(statsError || dossiersError) && (
        <ErrorBanner>
          <strong>⚠️ Erreur de connexion API :</strong> {(dErr as any)?.message || (sErr as any)?.message} 
          <br />Vérifiez que vous êtes bien connecté et que le serveur est en ligne.
        </ErrorBanner>
      )}

      <StatsGrid>
        <StatCard>
          <IconWrapper bg="#DBEAFE" color="#1E40AF"><FileStack size={20} /></IconWrapper>
          <div>
            <StatVal>{stats?.total ?? '?'}</StatVal>
            <StatLabel>Dossiers Total</StatLabel>
          </div>
        </StatCard>
        <StatCard>
          <IconWrapper bg="#FEF3C7" color="#92400E"><Clock size={20} /></IconWrapper>
          <div>
            <StatVal>{stats?.pending ?? '?'}</StatVal>
            <StatLabel>Paiements OK</StatLabel>
          </div>
        </StatCard>
        <StatCard>
          <IconWrapper bg="#D1FAE5" color="#065F46"><CheckCircle size={20} /></IconWrapper>
          <div>
            <StatVal>{stats?.done ?? '?'}</StatVal>
            <StatLabel>Finalisés</StatLabel>
          </div>
        </StatCard>
        <StatCard>
          <IconWrapper bg="#F3F4F6" color="#374151"><Users size={20} /></IconWrapper>
          <div>
            <StatVal>{stats?.totalUsers ?? '?'}</StatVal>
            <StatLabel>Entrepreneurs</StatLabel>
          </div>
        </StatCard>
      </StatsGrid>

      <TableCard>
        <TableActions>
          <Tabs>
             <Tab active={filter === 'ALL'} onClick={() => setFilter('ALL')}>Tous</Tab>
             <Tab active={filter === 'PAY_PENDING'} onClick={() => setFilter('PAY_PENDING')}>Nouveaux</Tab>
             <Tab active={filter === 'GUCE_DEPOSIT'} onClick={() => setFilter('GUCE_DEPOSIT')}>Au GUCE</Tab>
             <Tab active={filter === 'DONE'} onClick={() => setFilter('DONE')}>Terminés</Tab>
          </Tabs>
          <SearchWrapper>
            <Search size={16} />
            <SearchInput 
              placeholder="Société, Réf ou Client..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
        </TableActions>
        
        <Table>
          <thead>
            <tr>
              <th>Réf / Société</th>
              <th>Client</th>
              <th>Pack</th>
              <th>Statut Actuel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px'}}>Chargement du pipeline...</td></tr>
            ) : filteredDossiers?.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px', color: '#9CA3AF'}}>Aucun dossier trouvé.</td></tr>
            ) : filteredDossiers?.map((d: any) => (
              <tr key={d.id}>
                <td>
                  <Bold>{d.reference}</Bold>
                  <SmallText>{d.companyName}</SmallText>
                </td>
                <td>
                  <Bold>{d.user?.name || 'Inconnu'}</Bold>
                  <SmallText>{d.user?.phone || 'Pas de numéro'}</SmallText>
                </td>
                <td><Badge type="info">{d.pack}</Badge></td>
                <td>
                  <StatusSelect 
                    value={d.status} 
                    onChange={(e) => handleStatusChange(d.id, e.target.value)}
                    status={d.status}
                  >
                    <option value="PAY_PENDING">Payé / À traiter</option>
                    <option value="GUCE_DEPOSIT">Déposé au GUCE</option>
                    <option value="DONE">Finalisé (Immatriculé)</option>
                    <option value="CANCELED">Annulé</option>
                  </StatusSelect>
                </td>
                <td>
                   <Link to={`/dashboard/dossier/${d.id}`}>
                    <IconButton title="Voir détails">
                      <ExternalLink size={16} />
                    </IconButton>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      {/* Debug Section (Visible uniquement en dev ou via F12) */}
      <DebugPanel>
        <h4>🛠️ Debug Admin</h4>
        <pre>{JSON.stringify({ 
          stats, 
          dossiersCount: dossiers?.length, 
          filter,
          tokenSet: !!localStorage.getItem('accessToken') 
        }, null, 2)}</pre>
      </DebugPanel>
    </DashboardLayout>
  );
};

// Styles
const Header = styled.div`margin-bottom: 32px;`;
const Title = styled.h2`font-family: 'Barlow Condensed'; font-size: 32px; font-weight: 900; color: #0D1D45; text-transform: uppercase;`;
const Subtitle = styled.p`color: #6B7280;`;

const StatsGrid = styled.div`display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }`;
const StatCard = styled(Card)`display: flex; align-items: center; gap: 16px; padding: 20px;`;
const StatVal = styled.div`font-size: 24px; font-weight: 800; color: #0D1D45;`;
const StatLabel = styled.div`font-size: 12px; color: #6B7280; font-weight: 600;`;
const IconWrapper = styled.div<{bg: string, color: string}>`
  width: 40px; height: 40px; border-radius: 8px; background: ${p => p.bg}; color: ${p => p.color};
  display: flex; align-items: center; justify-content: center;
`;

const TableCard = styled(Card)`padding: 0; overflow: hidden;`;
const TableActions = styled.div`padding: 20px; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between;`;
const SearchWrapper = styled.div`position: relative; display: flex; align-items: center; color: #9CA3AF;`;
const SearchInput = styled.input`padding: 8px 12px 8px 36px; border: 1px solid #E5E7EB; border-radius: 6px; width: 300px; outline: none; &:focus{border-color: #2CC4C0;}`;

const Tabs = styled.div`display: flex; gap: 8px;`;
const Tab = styled.button<{active: boolean}>`
  padding: 8px 16px; border-radius: 6px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s;
  background: ${p => p.active ? '#0D1D45' : 'transparent'};
  color: ${p => p.active ? 'white' : '#6B7280'};
  &:hover { background: ${p => p.active ? '#0D1D45' : '#F3F4F6'}; }
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th { text-align: left; padding: 16px 20px; background: #F9FAFB; font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; }
  td { padding: 16px 20px; border-top: 1px solid #F3F4F6; font-size: 14px; }
  tr:hover { background: #F9FAFB; }
`;

const Bold = styled.div`font-weight: 700; color: #0D1D45;`;
const SmallText = styled.div`font-size: 12px; color: #6B7280;`;
const StatusSelect = styled.select<{status: string}>`
  padding: 6px 12px; border-radius: 6px; border: 1px solid #E5E7EB; background: white; font-weight: 600; font-size: 13px;
  color: ${p => p.status === 'DONE' ? '#059669' : p.status === 'PAY_PENDING' ? '#D97706' : '#0D1D45'};
`;
const IconButton = styled.button`background: none; border: none; color: #6B7280; cursor: pointer; &:hover{color: #2CC4C0;}`;

const ErrorBanner = styled.div`
  background: #FEF2F2; border: 1px solid #FCA5A5; color: #991B1B; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px;
`;

const DebugPanel = styled.div`
  margin-top: 40px; padding: 20px; background: #1F2937; color: #10B981; border-radius: 12px; font-family: monospace; font-size: 12px; overflow: auto;
  h4 { color: white; margin-bottom: 10px; font-family: 'Barlow'; }
  pre { margin: 0; }
`;

export default AdminDashboard;
