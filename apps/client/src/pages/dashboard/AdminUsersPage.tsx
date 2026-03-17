// apps/client/src/pages/dashboard/AdminUsersPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users, Search, Mail, Phone, Shield, MoreVertical, UserPlus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log("[AdminUsers] Utilisateurs reçus:", data);
      return data;
    }
  });

  const filteredUsers = users?.filter((u: any) => 
    (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Header>
        <div>
          <Title>Gestion des Utilisateurs</Title>
          <Subtitle>Consultez et gérez les comptes des entrepreneurs et administrateurs.</Subtitle>
        </div>
        <Button variant="secondary"><UserPlus size={18} /> Ajouter un membre</Button>
      </Header>

      <TableCard>
        <TableActions>
          <SearchWrapper>
            <Search size={16} />
            <SearchInput 
              placeholder="Rechercher par nom ou email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
        </TableActions>
        
        <Table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Contact</th>
              <th>Rôle</th>
              <th>Dernière Connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px'}}>Chargement...</td></tr>
            ) : filteredUsers?.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign: 'center', padding: '40px', color: '#9CA3AF'}}>Aucun utilisateur trouvé.</td></tr>
            ) : filteredUsers?.map((u: any) => (
              <tr key={u.id}>
                <td>
                  <UserCell>
                    <Avatar>{u.name ? u.name[0] : '?'}</Avatar>
                    <div>
                      <Bold>{u.name || 'Utilisateur sans nom'}</Bold>
                      <Email>{u.email || '-'}</Email>
                    </div>
                  </UserCell>
                </td>
                <td>
                   <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280'}}>
                     <Phone size={14} /> {u.phone || 'Non renseigné'}
                   </div>
                </td>
                <td>
                  <RoleTag role={u.role}>{u.role}</RoleTag>
                </td>
                <td style={{color: '#6B7280', fontSize: '13px'}}>Récemment</td>
                <td>
                   <IconButton><MoreVertical size={18} /></IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      <DebugPanel>
        <h4>🛠️ Debug Utilisateurs</h4>
        <pre>{JSON.stringify({ 
          usersCount: users?.length, 
          filter: searchTerm,
          tokenSet: !!localStorage.getItem('accessToken') 
        }, null, 2)}</pre>
      </DebugPanel>
    </DashboardLayout>
  );
};

// Styles
const Header = styled.div`display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px;`;
const Title = styled.h2`font-family: 'Barlow Condensed'; font-size: 32px; font-weight: 900; color: #0D1D45; text-transform: uppercase;`;
const Subtitle = styled.p`color: #6B7280;`;

const TableCard = styled(Card)`padding: 0; overflow: hidden;`;
const TableActions = styled.div`padding: 20px; border-bottom: 1px solid #F3F4F6;`;
const SearchWrapper = styled.div`position: relative; display: flex; align-items: center; color: #9CA3AF;`;
const SearchInput = styled.input`padding: 10px 10px 10px 42px; border: 1px solid #E5E7EB; border-radius: 8px; width: 350px; outline: none; &:focus { border-color: #2CC4C0; }`;

const Table = styled.table`
  width: 100%; border-collapse: collapse;
  th { text-align: left; padding: 16px 24px; background: #F9FAFB; font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; }
  td { padding: 16px 24px; border-top: 1px solid #F3F4F6; font-size: 14px; vertical-align: middle; }
  tr:hover { background: #F9FAFB; }
`;

const UserCell = styled.div`display: flex; align-items: center; gap: 12px;`;
const Avatar = styled.div`width: 32px; height: 32px; border-radius: 50%; background: #E5E7EB; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #4B5563; font-size: 12px;`;
const Bold = styled.div`font-weight: 700; color: #0D1D45;`;
const Email = styled.div`font-size: 12px; color: #6B7280;`;

const RoleTag = styled.span<{role: string}>`
  padding: 4px 10px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase;
  background: ${p => p.role === 'ADMIN' ? '#FEE2E2' : '#E0F2FE'};
  color: ${p => p.role === 'ADMIN' ? '#991B1B' : '#0369A1'};
`;

const IconButton = styled.button`background: none; border: none; color: #9CA3AF; cursor: pointer; &:hover { color: #0D1D45; }`;

const DebugPanel = styled.div`
  margin-top: 40px; padding: 20px; background: #1F2937; color: #10B981; border-radius: 12px; font-family: monospace; font-size: 12px; overflow: auto;
  h4 { color: white; margin-bottom: 10px; font-family: 'Barlow'; }
  pre { margin: 0; }
`;

export default AdminUsersPage;
