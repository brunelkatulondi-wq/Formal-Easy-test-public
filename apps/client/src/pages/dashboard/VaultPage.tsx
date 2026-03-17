// apps/client/src/pages/dashboard/VaultPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ShieldCheck, FileText, Download, Search, Filter, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import DashboardLayout from '../../components/layout/DashboardLayout';

const VaultPage = () => {
  const { data: dossiers, isLoading } = useQuery({
    queryKey: ['vault-dossiers'],
    queryFn: async () => {
      const { data } = await axios.get('/api/dossiers/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      return data;
    }
  });

  const handleDownload = async (id: string, ref: string) => {
    try {
      const response = await axios.get(`/api/dossiers/${id}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${ref}_statuts.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("Download error", e);
    }
  };

  return (
    <DashboardLayout>
      <Header>
        <div>
          <Title><Lock size={28} color="#2CC4C0" /> Coffre-Fort Numérique</Title>
          <Subtitle>Retrouvez tous vos documents officiels, statuts et immatriculations en un lieu sécurisé.</Subtitle>
        </div>
      </Header>

      <VaultContent>
        <Sidebar>
          <Card>
            <FilterTitle>Filtres</FilterTitle>
            <FilterGroup>
              <label>Type de document</label>
              <select>
                <option>Tous les documents</option>
                <option>Statuts OHADA</option>
                <option>RCCM (Registre du Commerce)</option>
                <option>NIF (Numéro Impôt)</option>
              </select>
            </FilterGroup>
            <FilterGroup>
              <label>Période</label>
              <select>
                <option>2026 (Année en cours)</option>
                <option>Archives</option>
              </select>
            </FilterGroup>
            <div style={{marginTop: '20px', padding: '15px', background: '#F0F9FF', borderRadius: '8px', border: '1px solid #B9E6FE'}}>
               <p style={{fontSize: '11px', color: '#0369A1', lineHeight: '1.4', fontWeight: 600}}>
                 <ShieldCheck size={14} style={{verticalAlign: 'middle', marginRight: '4px'}} /> 
                 Vos documents sont chiffrés et accessibles uniquement par vous et nos formalistes agréés.
               </p>
            </div>
          </Card>
        </Sidebar>

        <Main>
          <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
             <SearchBox>
                <Search size={18} />
                <input type="text" placeholder="Rechercher par nom de société ou référence..." />
             </SearchBox>
             <Button variant="outline" size="md"><Filter size={18} /></Button>
          </div>

          <DocGrid>
            {isLoading ? (
              <p>Chargement du coffre-fort...</p>
            ) : dossiers?.length === 0 ? (
              <Card style={{gridColumn: '1/-1', textAlign: 'center', padding: '60px'}}>
                <FileText size={48} color="#D1D5DB" style={{marginBottom: '16px'}} />
                <h3>Aucun document disponible</h3>
                <p style={{color: '#6B7280'}}>Lancez votre première création pour remplir votre coffre-fort.</p>
              </Card>
            ) : dossiers?.map((d: any) => (
              <DocCard key={d.id}>
                <DocIcon><FileText size={24} /></DocIcon>
                <DocInfo>
                  <DocCategory>Statuts OHADA</DocCategory>
                  <DocTitle>{d.companyName}</DocTitle>
                  <DocMeta>{d.reference} • PDF</DocMeta>
                </DocInfo>
                <DocActions>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(d.id, d.reference)}>
                    <Download size={18} />
                  </Button>
                </DocActions>
              </DocCard>
            ))}
            
            {/* Fake items for visual demonstration of various document types */}
            {dossiers?.length > 0 && dossiers[0].status === 'DONE' && (
              <>
                <DocCard>
                  <DocIcon style={{background: '#DBEAFE', color: '#1E40AF'}}><ShieldCheck size={24} /></DocIcon>
                  <DocInfo>
                    <DocCategory>RCCM & NIF</DocCategory>
                    <DocTitle>Certificat d'Immatriculation</DocTitle>
                    <DocMeta>{dossiers[0].reference}_RCCM.pdf</DocMeta>
                  </DocInfo>
                  <DocActions>
                    <Button variant="ghost" size="sm" title="Télécharger">
                      <Download size={18} />
                    </Button>
                  </DocActions>
                </DocCard>
              </>
            )}
          </DocGrid>
        </Main>
      </VaultContent>
    </DashboardLayout>
  );
};

// Styles
const Header = styled.div`margin-bottom: 40px;`;
const Title = styled.h1`font-family: 'Barlow Condensed'; font-size: 36px; font-weight: 900; color: #0D1D45; text-transform: uppercase; display: flex; align-items: center; gap: 12px;`;
const Subtitle = styled.p`color: #6B7280; font-size: 16px; margin-top: 8px;`;

const VaultContent = styled.div`display: grid; grid-template-columns: 300px 1fr; gap: 32px; @media (max-width: 1024px) { grid-template-columns: 1fr; }`;
const Sidebar = styled.div``;
const Main = styled.div``;

const FilterTitle = styled.h4`font-family: 'Barlow Condensed'; font-size: 18px; font-weight: 800; text-transform: uppercase; color: #0D1D45; margin-bottom: 20px;`;
const FilterGroup = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 12px; font-weight: 700; color: #6B7280; text-transform: uppercase; margin-bottom: 6px; }
  select { width: 100%; padding: 10px; border: 1px solid #E5E7EB; border-radius: 8px; outline: none; transition: 0.2s; &:focus { border-color: #2CC4C0; } }
`;

const SearchBox = styled.div`
  flex: 1; position: relative; display: flex; align-items: center; color: #9CA3AF;
  svg { position: absolute; left: 16px; }
  input { width: 100%; padding: 12px 12px 12px 48px; border: 1px solid #E5E7EB; border-radius: 10px; outline: none; transition: 0.2s; &:focus { border-color: #2CC4C0; box-shadow: 0 0 0 4px rgba(44, 196, 192, 0.05); } }
`;

const DocGrid = styled.div`display: flex; flex-direction: column; gap: 12px;`;

const DocCard = styled(Card)`
  display: flex; align-items: center; padding: 16px 24px; transition: 0.2s;
  &:hover { border-color: #2CC4C0; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); }
`;

const DocIcon = styled.div`
  width: 48px; height: 48px; border-radius: 12px; background: #F3F4F6; color: #0D1D45;
  display: flex; align-items: center; justify-content: center; margin-right: 20px;
`;

const DocInfo = styled.div`flex: 1;`;
const DocCategory = styled.div`font-size: 10px; font-weight: 800; color: #2CC4C0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px;`;
const DocTitle = styled.h3`font-size: 16px; font-weight: 700; color: #0D1D45;`;
const DocMeta = styled.div`font-size: 12px; color: #6B7280;`;

const DocActions = styled.div`display: flex; gap: 8px;`;

export default VaultPage;
