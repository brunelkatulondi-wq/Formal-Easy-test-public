// apps/client/src/pages/dashboard/ProfilePage.tsx
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield, Camera, Bell, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profil mis à jour avec succès !");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <Header>
        <Title>Mon Profil Entrepreneur</Title>
        <Subtitle>Gérez vos informations personnelles et vos préférences de sécurité.</Subtitle>
      </Header>

      <Grid>
        <Sidebar>
          <ProfileSummary>
            <AvatarContainer>
              <Avatar>{user?.name?.[0] || 'U'}</Avatar>
              <EditAvatar><Camera size={14} /></EditAvatar>
            </AvatarContainer>
            <UserInfo>
              <h3>{user?.name}</h3>
              <p>{user?.role === 'ADMIN' ? 'Administrateur Plateforme' : 'Entrepreneur'}</p>
            </UserInfo>
          </ProfileSummary>

          <NavMenu>
            <NavItem active={1}><User size={18} /> Infos Personnelles</NavItem>
            <NavItem><Shield size={18} /> Sécurité & Mot de passe</NavItem>
            <NavItem><Bell size={18} /> Notifications</NavItem>
          </NavMenu>
        </Sidebar>

        <Main>
          <Card>
            <SectionTitle>Détails du compte</SectionTitle>
            <FormGrid>
              <Field>
                <label><User size={14} /> Nom Complet</label>
                <input type="text" defaultValue={user?.name} />
              </Field>
              <Field>
                <label><Mail size={14} /> Adresse Email</label>
                <input type="email" defaultValue={user?.email} />
              </Field>
              <Field>
                <label><Phone size={14} /> Numéro de téléphone</label>
                <input type="text" placeholder="+243 ..." />
              </Field>
              <Field>
                <label><MapPin size={14} /> Ville de résidence</label>
                <input type="text" placeholder="Kinshasa, RDC" />
              </Field>
            </FormGrid>
            <div style={{marginTop: '32px', display: 'flex', gap: '12px'}}>
              <Button variant="secondary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          </Card>

          <Card style={{marginTop: '24px'}}>
            <SectionTitle><Lock size={18} style={{marginRight: '10px'}} /> Sécurité du Compte</SectionTitle>
            <SecurityGrid>
               <SecurityItem>
                  <div className="icon"><Shield size={20} /></div>
                  <div className="text">
                     <h4>Double Authentification (2FA)</h4>
                     <p>Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
                  </div>
                  <Button variant="outline" size="sm">Activer</Button>
               </SecurityItem>
               <SecurityItem>
                  <div className="icon"><Bell size={20} /></div>
                  <div className="text">
                     <h4>Alertes de connexion</h4>
                     <p>Recevez un email à chaque nouvelle connexion sur votre compte.</p>
                  </div>
                  <Button variant="ghost" size="sm" style={{color: '#059669'}}>Activé</Button>
               </SecurityItem>
            </SecurityGrid>
            <hr style={{margin: '24px 0', border: 'none', borderTop: '1px solid #F3F4F6'}} />
            <Button variant="outline" size="sm">Changer le mot de passe</Button>
          </Card>
        </Main>
      </Grid>
    </DashboardLayout>
  );
};

// Styles
const Header = styled.div`margin-bottom: 40px;`;
const Title = styled.h1`font-family: 'Barlow Condensed'; font-size: 36px; font-weight: 900; color: #0D1D45; text-transform: uppercase;`;
const Subtitle = styled.p`color: #6B7280; font-size: 16px; margin-top: 8px;`;

const Grid = styled.div`display: grid; grid-template-columns: 320px 1fr; gap: 32px; @media (max-width: 1024px) { grid-template-columns: 1fr; }`;

const Sidebar = styled.div`display: flex; flex-direction: column; gap: 24px;`;
const Main = styled.div``;

const ProfileSummary = styled(Card)`text-align: center; padding: 40px 20px;`;
const AvatarContainer = styled.div`position: relative; width: 100px; height: 100px; margin: 0 auto 20px;`;
const Avatar = styled.div`width: 100%; height: 100%; border-radius: 50%; background: #2CC4C0; color: #0D1D45; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 900;`;
const EditAvatar = styled.div`position: absolute; bottom: 0; right: 0; background: #0D1D45; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; cursor: pointer;`;
const UserInfo = styled.div`h3 { font-size: 20px; color: #0D1D45; margin-bottom: 4px; } p { color: #6B7280; font-size: 14px; font-weight: 600; }`;

const NavMenu = styled(Card)`padding: 10px; display: flex; flex-direction: column; gap: 4px;`;
const NavItem = styled.div<{active?: number}>`
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.2s;
  background: ${p => p.active ? 'rgba(44, 196, 192, 0.1)' : 'transparent'};
  color: ${p => p.active ? '#0D1D45' : '#6B7280'};
  &:hover { background: rgba(0,0,0,0.02); }
`;

const SectionTitle = styled.h3`font-family: 'Barlow Condensed'; font-size: 20px; font-weight: 900; text-transform: uppercase; color: #0D1D45; margin-bottom: 24px; display: flex; align-items: center;`;

const FormGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 24px; @media (max-width: 640px) { grid-template-columns: 1fr; }`;
const Field = styled.div`
  label { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; color: #6B7280; text-transform: uppercase; margin-bottom: 8px; }
  input { width: 100%; padding: 12px; border: 1.5px solid #E5E7EB; border-radius: 8px; outline: none; transition: 0.2s; font-size: 14px; &:focus { border-color: #2CC4C0; } }
`;

const SecurityGrid = styled.div`display: flex; flex-direction: column; gap: 16px;`;
const SecurityItem = styled.div`
  display: flex; align-items: center; gap: 20px; padding: 16px; background: #F9FAFB; border-radius: 12px; border: 1px solid #F3F4F6;
  .icon { width: 40px; height: 40px; border-radius: 8px; background: white; display: flex; align-items: center; justify-content: center; color: #0D1D45; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
  .text { flex: 1; h4 { font-size: 14px; color: #0D1D45; margin-bottom: 2px; } p { font-size: 12px; color: #6B7280; } }
`;

export default ProfilePage;
