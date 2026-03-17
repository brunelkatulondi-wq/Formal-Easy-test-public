// apps/client/src/pages/PrivacyPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';

const PrivacyPage = () => {
  return (
    <PageWrapper>
      <header>
        <Link to="/"><Logo size={20} /></Link>
      </header>
      <Content>
        <h1>Politique de Confidentialité</h1>
        <p>Dernière mise à jour : 16 Mars 2026</p>
        
        <section>
          <h2>1. Collecte des données</h2>
          <p>Nous collectons les informations nécessaires à la création de votre dossier juridique : nom, prénom, email, téléphone, et données relatives à votre entreprise.</p>
        </section>

        <section>
          <h2>2. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul>
            <li>Générer vos documents juridiques.</li>
            <li>Traiter vos formalités au Guichet Unique (GUCE).</li>
            <li>Vous informer de l'état d'avancement de votre dossier.</li>
          </ul>
        </section>

        <section>
          <h2>3. Partage des données</h2>
          <p>Nous ne partageons vos données qu'avec les autorités administratives compétentes (Greffe du Commerce, Administration fiscale) et nos partenaires technologiques nécessaires (Stripe pour le paiement, OpenAI pour l'assistance à la rédaction).</p>
        </section>

        <section>
          <h2>4. Sécurité</h2>
          <p>Nous mettons en œuvre des mesures de sécurité techniques pour protéger vos informations contre tout accès non autorisé ou perte accidentelle.</p>
        </section>
      </Content>
      <Footer>
        <p>© 2026 FormalEasy DRC</p>
      </Footer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: 'Inter', sans-serif; line-height: 1.6; color: #374151;`;
const Content = styled.div`
  margin-top: 40px;
  h1 { color: #0d1d45; margin-bottom: 30px; }
  h2 { color: #0d1d45; margin-top: 30px; font-size: 20px; border-bottom: 2px solid #F3F4F6; padding-bottom: 10px; }
  p { margin-bottom: 15px; }
  ul { margin-bottom: 15px; padding-left: 20px; }
`;
const Footer = styled.footer`margin-top: 60px; border-top: 1px solid #E5E7EB; padding-top: 20px; font-size: 14px; text-align: center; color: #9CA3AF;`;

export default PrivacyPage;
