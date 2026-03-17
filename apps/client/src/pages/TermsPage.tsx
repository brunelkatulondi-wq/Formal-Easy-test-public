// apps/client/src/pages/TermsPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';

const TermsPage = () => {
  return (
    <PageWrapper>
      <header>
        <Link to="/"><Logo size={20} /></Link>
      </header>
      <Content>
        <h1>Conditions Générales de Vente et d'Utilisation</h1>
        <p>Dernière mise à jour : 16 Mars 2026</p>
        
        <section>
          <h2>1. Objet</h2>
          <p>Les présentes Conditions Générales de Vente et d'Utilisation (ci-après "CGV/CGU") ont pour objet de définir les modalités de mise à disposition des services du site FormalEasy DRC.</p>
        </section>

        <section>
          <h2>2. Services de formalités juridiques</h2>
          <p>FormalEasy DRC propose une assistance à la rédaction de statuts et à la réalisation de formalités administratives en République Démocratique du Congo. <strong>FormalEasy DRC n'est pas un cabinet d'avocats</strong> et ne fournit pas de conseils juridiques personnalisés réservés aux professionnels du droit.</p>
        </section>

        <section>
          <h2>3. Responsabilité de l'IA</h2>
          <p>L'intelligence artificielle utilisée pour la génération d'objets sociaux et de statuts est un outil d'aide à la rédaction. Bien que supervisée par des formalistes, l'utilisateur est responsable de la vérification finale des informations fournies.</p>
        </section>

        <section>
          <h2>4. Tarifs et Paiement</h2>
          <p>Les prix de nos packs sont indiqués en Dollars Américains (USD). Le paiement est exigible immédiatement à la commande par carte bancaire via nos prestataires sécurisés.</p>
        </section>

        <section>
          <h2>5. Droit de rétractation</h2>
          <p>Conformément à la nature des services numériques et personnalisés, dès lors que la rédaction des actes a commencé ou que le dossier a été transmis au formaliste, aucun remboursement ne pourra être effectué.</p>
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
`;
const Footer = styled.footer`margin-top: 60px; border-top: 1px solid #E5E7EB; padding-top: 20px; font-size: 14px; text-align: center; color: #9CA3AF;`;

export default TermsPage;
