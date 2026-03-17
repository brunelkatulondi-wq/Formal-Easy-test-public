// apps/client/src/pages/AboutPage.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, Target, Award, Shield, Globe, Landmark, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

const AboutPage = () => {
  return (
    <PageWrapper>
      <Navbar>
        <Link to="/"><Logo size={20} light /></Link>
        <NavLinks>
           <Link to="/">Accueil</Link>
           <Link to="/pricing">Tarifs</Link>
           <Link to="/contact">Contact</Link>
           <Link to="/signup"><Button variant="secondary" size="sm">Créer mon entreprise</Button></Link>
        </NavLinks>
      </Navbar>

      <Hero>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>NOTRE MISSION</Badge>
          <h1>Faciliter l'entrepreneuriat <span>en RDC.</span></h1>
          <p>FormalEasy DRC est née d'une volonté simple : supprimer les barrières administratives pour permettre à chaque Congolais de bâtir son futur.</p>
        </motion.div>
      </Hero>

      <StatsSection>
         <div className="stat">
            <h3>+500</h3>
            <p>Entreprises créées</p>
         </div>
         <div className="stat">
            <h3>24h</h3>
            <p>Délai moyen de dépôt</p>
         </div>
         <div className="stat">
            <h3>100%</h3>
            <p>Dossiers validés</p>
         </div>
         <div className="stat">
            <h3>30%</h3>
            <p>Clients de la Diaspora</p>
         </div>
      </StatsSection>

      <StorySection>
         <div className="text">
            <h2>L'IA au service du Droit <span>OHADA</span></h2>
            <p>Créer une entreprise en République Démocratique du Congo ne devrait pas prendre des semaines de déplacements et d'incertitudes. </p>
            <p>Nous avons combiné l'expertise juridique de nos formalistes avec la puissance de l'intelligence artificielle pour offrir une plateforme qui rédige vos statuts, vérifie vos pièces et suit votre dossier au Guichet Unique (GUCE) en temps réel.</p>
            <div className="values">
               <div className="val"><Shield size={20} color="#2cbab8" /> <span>Intégrité Juridique</span></div>
               <div className="val"><Globe size={20} color="#2cbab8" /> <span>Accessibilité Mondiale</span></div>
               <div className="val"><Target size={20} color="#2cbab8" /> <span>Résultat Garanti</span></div>
            </div>
         </div>
         <div className="image-box">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team Work" />
         </div>
      </StorySection>

      <VisionSection>
         <SectionHeader>
            <SectionTitle>Notre Vision</SectionTitle>
            <SectionSubtitle>Transformer la RDC en un hub entrepreneurial d'excellence.</SectionSubtitle>
         </SectionHeader>
         <VisionGrid>
            <VisionCard>
               <Landmark size={40} color="#2cbab8" />
               <h3>Modernisation du GUCE</h3>
               <p>Nous travaillons main dans la main avec les institutions pour digitaliser les processus et réduire les délais administratifs.</p>
            </VisionCard>
            <VisionCard>
               <Users size={40} color="#2cbab8" />
               <h3>Soutien à la Diaspora</h3>
               <p>Permettre aux Congolais du monde entier d'investir au pays en toute confiance, sans avoir à prendre l'avion pour une signature.</p>
            </VisionCard>
            <VisionCard>
               <Award size={40} color="#2cbab8" />
               <h3>Excellence Juridique</h3>
               <p>Garantir que chaque société créée sur notre plateforme respecte scrupuleusement les normes OHADA et le code de commerce.</p>
            </VisionCard>
         </VisionGrid>
      </VisionSection>

      <TeamPromo>
         <div className="content">
            <h2>Rejoignez l'aventure</h2>
            <p>Plus qu'une plateforme, nous sommes une communauté d'entrepreneurs engagés pour le développement de la RDC.</p>
            <Link to="/signup"><Button variant="secondary" size="lg">Lancer mon projet aujourd'hui</Button></Link>
         </div>
      </TeamPromo>

      <Footer>
         <Logo size={20} light />
         <div className="links">
            <Link to="/pricing">Tarifs</Link>
            <Link to="/contact">Contact</Link>
            <a href="#">Conditions</a>
         </div>
         <p>© 2026 FormalEasy DRC. Propulsé par l'innovation Congolaise.</p>
      </Footer>
    </PageWrapper>
  );
};

// --- STYLES ---

const PageWrapper = styled.div`background: white; min-height: 100vh; font-family: 'Barlow', sans-serif; overflow-x: hidden;`;

const Navbar = styled.nav`
  display: flex; justify-content: space-between; align-items: center; padding: 20px 80px; background: #0d1d45; color: white;
  @media (max-width: 768px) { padding: 20px 40px; }
`;

const NavLinks = styled.div`display: flex; align-items: center; gap: 30px; a { color: white; text-decoration: none; font-weight: 600; font-size: 14px; }`;

const Hero = styled.section`
  padding: 120px 20px; text-align: center; background: #0d1d45; color: white;
  h1 { font-family: 'Barlow Condensed'; font-size: 72px; font-weight: 900; margin-bottom: 24px; text-transform: uppercase; span { color: #2cbab8; } }
  p { font-size: 22px; color: #9CA3AF; max-width: 800px; margin: 0 auto; line-height: 1.5; }
  @media (max-width: 768px) { h1 { font-size: 44px; } }
`;

const Badge = styled.span`
  display: inline-block; background: rgba(44, 186, 184, 0.1); color: #2cbab8; padding: 6px 16px; border-radius: 100px;
  font-size: 12px; font-weight: 800; letter-spacing: 2px; margin-bottom: 20px;
`;

const StatsSection = styled.div`
  max-width: 1000px; margin: -60px auto 100px; background: white; padding: 40px; border-radius: 20px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.1); display: grid; grid-template-columns: repeat(4, 1fr); text-align: center;
  .stat { h3 { font-size: 40px; color: #2cbab8; margin-bottom: 5px; font-weight: 900; } p { font-size: 14px; color: #6B7280; font-weight: 700; } }
  @media (max-width: 768px) { grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
`;

const StorySection = styled.section`
  max-width: 1200px; margin: 0 auto 120px; padding: 0 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  .text { 
    h2 { font-family: 'Barlow Condensed'; font-size: 48px; font-weight: 900; margin-bottom: 24px; text-transform: uppercase; color: #0d1d45; span { color: #2cbab8; } }
    p { font-size: 18px; color: #4B5563; line-height: 1.7; margin-bottom: 20px; }
    .values { display: flex; flex-direction: column; gap: 15px; margin-top: 30px; .val { display: flex; align-items: center; gap: 12px; font-size: 16px; font-weight: 800; color: #0d1d45; } }
  }
  .image-box { border-radius: 30px; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.1); img { width: 100%; height: 500px; object-fit: cover; } }
  @media (max-width: 1024px) { grid-template-columns: 1fr; text-align: center; .values { align-items: center; } }
`;

const VisionSection = styled.section`padding: 100px 40px; background: #F9FAFB;`;
const SectionHeader = styled.div`text-align: center; margin-bottom: 60px;`;
const SectionTitle = styled.h2`font-family: 'Barlow Condensed'; font-size: 48px; font-weight: 900; text-transform: uppercase; margin-bottom: 16px; color: #0d1d45;`;
const SectionSubtitle = styled.p`color: #6B7280; font-size: 18px;`;

const VisionGrid = styled.div`max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; @media (max-width: 1024px) { grid-template-columns: 1fr; }`;
const VisionCard = styled.div`background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; h3 { font-family: 'Barlow Condensed'; font-size: 24px; margin: 20px 0 15px; text-transform: uppercase; } p { color: #6B7280; line-height: 1.6; }`;

const TeamPromo = styled.section`
  padding: 100px 40px; text-align: center;
  .content { max-width: 800px; margin: 0 auto; h2 { font-family: 'Barlow Condensed'; font-size: 48px; font-weight: 900; color: #0d1d45; margin-bottom: 24px; text-transform: uppercase; } p { font-size: 20px; color: #6B7280; margin-bottom: 40px; } }
`;

const Footer = styled.footer`
  padding: 60px 40px; background: #0d1d45; color: white; text-align: center;
  .links { display: flex; justify-content: center; gap: 30px; margin: 30px 0; a { color: #9CA3AF; text-decoration: none; font-size: 14px; &:hover { color: white; } } }
  p { font-size: 12px; color: #4B5563; }
`;

export default AboutPage;
