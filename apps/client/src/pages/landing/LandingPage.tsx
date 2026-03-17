// apps/client/src/pages/landing/LandingPage.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Check, ArrowRight, Star, Clock, FileText, UserCheck, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const LandingPage = () => {
  return (
    <Container>
      {/* Navbar */}
      <Navbar
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Logo size={24} light />
        <NavLinks>
          <a href="#services">Services</a>
          <a href="#how-it-works">Comment ça marche</a>
          <Link to="/pricing">Tarifs</Link>
          <Link to="/login"><Button variant="ghost" size="sm" style={{color: 'white'}}>Connexion</Button></Link>
          <Link to="/signup"><Button variant="secondary" size="sm">Créer mon entreprise</Button></Link>
          <a href="https://wa.me/243847395433?text=Bonjour%20FormalEasy" target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" style={{borderColor: '#2cbab8', color: '#2cbab8'}}>Parler à un conseiller</Button>
          </a>
        </NavLinks>
      </Navbar>

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <BadgeWrapper>
              <Zap size={14} color="#2cbab8" />
              <span>LegalTech dédiée à la création en RDC</span>
            </BadgeWrapper>
            <MainTitle>
              Lancez votre société en <span>RDC</span>, simplement.
            </MainTitle>
            <Description>
              FormalEasy DRC vous accompagne dans toutes vos formalités juridiques. 
              Génération de statuts OHADA par IA, dépôt au GUCE et suivi en temps réel.
            </Description>
            <HeroActions>
              <Link to="/signup">
                <Button variant="secondary" size="lg" style={{padding: '20px 40px', fontSize: '18px'}}>
                  Commencer ma création <ArrowRight size={20} style={{marginLeft: '10px'}} />
                </Button>
              </Link>
              <TrustBadge>
                <Star size={16} fill="#FFBD2E" color="#FFBD2E" />
                <Star size={16} fill="#FFBD2E" color="#FFBD2E" />
                <Star size={16} fill="#FFBD2E" color="#FFBD2E" />
                <Star size={16} fill="#FFBD2E" color="#FFBD2E" />
                <Star size={16} fill="#FFBD2E" color="#FFBD2E" />
                <span>Approuvé par des centaines d'entrepreneurs congolais et de la diaspora</span>
              </TrustBadge>
            <HeroStats>
              <Stat>
                <strong>1 200+</strong>
                <span>dossiers accompagnés</span>
              </Stat>
                <Stat>
                  <strong>5 j</strong>
                  <span>délai médian RCCM/NIF*</span>
                </Stat>
                <Stat>
                <strong>98%</strong>
                <span>taux d'acceptation</span>
              </Stat>
            </HeroStats>
            <Footnote>*Sources : dossiers déposés 2025-2026, délai médian calculé après réception des pièces complètes.</Footnote>
            <a href="https://wa.me/243847395433?text=Bonjour%20FormalEasy" target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg" style={{borderColor: '#2cbab8', color: '#2cbab8'}}>
                Parler à un conseiller
              </Button>
            </a>
            </HeroActions>
          </motion.div>
        </HeroContent>

        <HeroVisual
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <VisualCard>
            <div className="card-header">
              <div className="dot red" />
              <div className="dot yellow" />
              <div className="dot green" />
              <span>Statuts_Finalisés_OHADA.pdf</span>
            </div>
            <div className="card-body">
               <div className="line" style={{width: '60%'}} />
               <div className="line" style={{width: '100%'}} />
               <div className="line" style={{width: '80%'}} />
               <div className="line teal" style={{width: '40%'}} />
            </div>
          </VisualCard>
          <FloatingElement delay={2}>
             <Shield size={32} color="#2cbab8" />
             <span>Dossier certifié RDC</span>
          </FloatingElement>
        </HeroVisual>
      </HeroSection>

      {/* Partners Banner */}
      <StatsBanner>
         <span>COMPATIBLE AVEC TOUS LES SERVICES DU GUICHT UNIQUE (GUCE)</span>
      </StatsBanner>

      {/* Section "Comment ça marche" (Style LegalPlace) */}
      <HowItWorks id="how-it-works">
        <SectionHeader>
          <SectionTitle>Votre entreprise créée en 3 étapes</SectionTitle>
          <SectionSubtitle>Plus besoin de se déplacer, nous gérons tout pour vous.</SectionSubtitle>
        </SectionHeader>

        <StepsGrid>
           <StepCard>
              <StepNum>1</StepNum>
              <IconBox bg="#2cbab811" color="#2cbab8"><FileText /></IconBox>
              <h3>Questionnaire intelligent</h3>
              <p>Répondez à quelques questions. Notre "Cerveau IA" rédige vos statuts OHADA sur-mesure.</p>
           </StepCard>
           <StepCard>
              <StepArrow><ArrowRight size={40} color="#2cbab822" /></StepArrow>
              <StepNum>2</StepNum>
              <IconBox bg="#2cbab811" color="#2cbab8"><UserCheck /></IconBox>
              <h3>Validation Expert</h3>
              <p>Un formaliste spécialisé vérifie votre dossier sous 2h ouvrées pour maximiser vos chances d’acceptation.</p>
           </StepCard>
           <StepCard>
              <StepNum>3</StepNum>
              <IconBox bg="#2cbab811" color="#2cbab8"><Check /></IconBox>
              <h3>RCCM & NIF reçus</h3>
              <p>Dès validation du GUCE, vous recevez vos documents officiels directement dans votre coffre-fort.</p>
           </StepCard>
        </StepsGrid>
      </HowItWorks>

      {/* Features Section */}
      {/* Extra Services Section */}
      <ExtraServices id="services">
        <SectionHeader>
          <SectionTitle>Au-delà de la création</SectionTitle>
          <SectionSubtitle>On ne vous lâche pas après le RCCM. FormalEasy DRC gère votre croissance.</SectionSubtitle>
        </SectionHeader>
        <ExtraGrid>
           <ExtraCard>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400" alt="Bureau Gombe" />
              <div className="content">
                 <h3>Domiciliation Prestige</h3>
                 <p>Installez votre siège social à Kinshasa Gombe. Gestion de courrier et bureau virtuel inclus.</p>
                 <Button variant="outline" size="sm">En savoir plus</Button>
              </div>
           </ExtraCard>
           <FAQItem style={{background: 'rgba(44, 186, 184, 0.05)', border: '1px solid rgba(44, 186, 184, 0.2)'}}>
              <div className="content">
                 <IconBox bg="#2cbab822" color="#2cbab8"><UserCheck /></IconBox>
                 <h3>Comptabilité DCN</h3>
                 <p>Déclarations fiscales mensuelles et bilans annuels conformes au droit OHADA.</p>
                 <Button variant="outline" size="sm">Consultez un expert</Button>
              </div>
           </FAQItem>
        </ExtraGrid>
      </ExtraServices>

      <FeaturesSection id="services" style={{background: '#0a1635'}}>
        <SectionHeader>
          <SectionTitle>Pourquoi FormalEasy ?</SectionTitle>
        </SectionHeader>
        
        <FeaturesGrid>
           <FeatureCard whileHover={{ y: -10 }}>
              <IconBox bg="#2cbab822" color="#2cbab8"><Clock /></IconBox>
              <h3>Rapidité record</h3>
              <p>Dossier déposé au GUCE dès réception des pièces complètes (souvent sous 24h ouvrées). Gagnez des semaines de démarches.</p>
           </FeatureCard>
           <FeatureCard whileHover={{ y: -10 }}>
              <IconBox bg="#2cbab822" color="#2cbab8"><Lock /></IconBox>
              <h3>Sécurité & Confidentialité</h3>
              <p>Vos données sont chiffrées. Signature électronique sécurisée pour les dossiers à distance.</p>
           </FeatureCard>
           <FeatureCard whileHover={{ y: -10 }}>
              <IconBox bg="#2cbab822" color="#2cbab8"><Globe /></IconBox>
              <h3>Spécial Diaspora</h3>
              <p>Une solution pensée pour les Congolais de l'étranger. Investissez au pays sans stress.</p>
           </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* Testimonials Section */}
      <TestimonialsSection>
        <SectionHeader>
          <SectionTitle>Ils nous ont fait confiance</SectionTitle>
          <SectionSubtitle>Découvrez les retours d'entrepreneurs qui ont lancé leur activité avec succès.</SectionSubtitle>
        </SectionHeader>
        <TestimonialsGrid>
           <TestimonialCard>
              <div className="stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FFBD2E" color="#FFBD2E" />)}
              </div>
              <p>"FormalEasy a réduit mon stress de 90%. J'ai reçu mon RCCM à distance depuis Bruxelles sans aucun souci."</p>
              <div className="user">
                 <div className="avatar">ML</div>
                 <div className="info">
                    <strong>Marc Luvumbu</strong>
                    <span>CEO, Kin-Tech Solutions</span>
                 </div>
              </div>
           </TestimonialCard>
           <TestimonialCard>
              <div className="stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FFBD2E" color="#FFBD2E" />)}
              </div>
              <p>"Le service client est impressionnant. Répons rapide sur WhatsApp et dossiers toujours impeccables."</p>
              <div className="user">
                 <div className="avatar" style={{background: '#EEF2FF', color: '#4F46E5'}}>SN</div>
                 <div className="info">
                    <strong>Sarah Ngalula</strong>
                    <span>Fondatrice, Boutique Elégance</span>
                 </div>
              </div>
           </TestimonialCard>
           <TestimonialCard>
              <div className="stars">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#FFBD2E" color="#FFBD2E" />)}
              </div>
              <p>"Enfin une solution digitale sérieuse en RDC. L'IA pour les statuts est un gain de temps phénoménal."</p>
              <div className="user">
                 <div className="avatar" style={{background: '#ECFDF5', color: '#059669'}}>PK</div>
                 <div className="info">
                    <strong>Patrick Kabeya</strong>
                    <span>Directeur, Logistique 243</span>
                 </div>
              </div>
           </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>

      {/* FAQ Section */}
      <FAQSection>
        <SectionHeader>
          <SectionTitle>Questions Fréquentes</SectionTitle>
        </SectionHeader>
        <FAQGrid>
           <FAQItem>
              <h4>Quels sont les délais de création ?</h4>
              <p>Avec notre pack Express, votre dossier est déposé au GUCE sous 24h. Le délai administratif final dépend du Guichet Unique, généralement entre 3 et 7 jours.</p>
           </FAQItem>
           <FAQItem>
              <h4>Puis-je créer ma société depuis l'étranger ?</h4>
              <p>Oui, nous sommes spécialisés dans l'accompagnement de la diaspora. Tout se fait en ligne, de la signature des statuts au suivi du dépôt.</p>
           </FAQItem>
           <FAQItem>
              <h4>L'objet social généré est-il légal ?</h4>
              <p>Absolument. Notre IA est entraînée sur le droit OHADA. De plus, chaque objet social est relu par un formaliste expert avant le dépôt final.</p>
           </FAQItem>
        </FAQGrid>
      </FAQSection>

      {/* Newsletter */}
      <NewsletterSection>
         <div className="card">
            <div className="content">
               <h3>Restez informé sur le business en RDC</h3>
               <p>Rejoignez 2000+ entrepreneurs abonnés à notre revue bimensuelle sur le climat des affaires.</p>
            </div>
            <div className="form">
               <input type="email" placeholder="votre@email.com" />
               <Button variant="secondary">S'abonner</Button>
            </div>
         </div>
      </NewsletterSection>

      {/* CTA Section */}
      <CTASection>
         <motion.div
           whileInView={{ scale: [0.9, 1], opacity: [0, 1] }}
           transition={{ duration: 0.5 }}
         >
           <h2>Prêt à lancer votre projet ?</h2>
           <p>Rejoignez +500 entrepreneurs qui ont franchi le pas cette année.</p>
           <Link to="/signup"><Button variant="secondary" size="lg" style={{padding: '20px 50px'}}>Créer mon entreprise maintenant</Button></Link>
         </motion.div>
      </CTASection>

      <Footer>
         <Logo size={24} light />
         <FooterLinks>
            <Link to="/about">À Propos</Link>
            <Link to="/pricing">Tarifs</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Conditions</Link>
            <Link to="/privacy">Confidentialité</Link>
            <Link to="/contact">Contact</Link>
            <a href="https://wa.me/243000000000?text=Bonjour%20FormalEasy" target="_blank" rel="noreferrer">Parler à un conseiller</a>
         </FooterLinks>
         <p>&copy; 2026 FormalEasy DRC. LegalTech de référence en Afrique Centrale.</p>
      </Footer>
    </Container>
  );
};

// --- STYLES ---

const Container = styled.div`
  background: #0d1d45;
  color: white;
  min-height: 100vh;
  font-family: 'Barlow', sans-serif;
`;

const Navbar = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 80px;
  position: fixed;
  top: 0; width: 100%; z-index: 1000;
  background: rgba(13, 29, 69, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  @media (max-width: 768px) { padding: 20px 40px; }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  a { 
    color: #9CA3AF; 
    text-decoration: none; 
    font-weight: 600; 
    font-size: 13px; 
    text-transform: uppercase; 
    letter-spacing: 1px;
    &:hover { color: #2cbab8; }
  }
`;

const HeroSection = styled.div`
  padding: 200px 80px 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 1024px) { flex-direction: column; text-align: center; padding: 150px 40px 80px; }
`;

const HeroContent = styled.div`
  max-width: 650px;
`;

const BadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(44, 186, 184, 0.1);
  padding: 8px 16px;
  border-radius: 100px;
  margin-bottom: 24px;
  span { color: #2cbab8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
`;

const MainTitle = styled.h1`
  font-family: 'Barlow Condensed';
  font-size: 84px;
  line-height: 0.95;
  font-weight: 900;
  margin-bottom: 24px;
  text-transform: uppercase;
  span { color: #2cbab8; }
  @media (max-width: 768px) { font-size: 52px; }
`;

const Description = styled.p`
  font-size: 20px;
  color: #9CA3AF;
  line-height: 1.5;
  margin-bottom: 40px;
  max-width: 550px;
  @media (max-width: 1024px) { margin: 0 auto 40px; }
`;

const HeroActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 1024px) { align-items: center; }
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9CA3AF;
  font-size: 14px;
  font-weight: 600;
`;

const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 10px;
  @media (max-width: 600px) { grid-template-columns: repeat(2, minmax(120px, 1fr)); }
`;

const Stat = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 12px 14px;
  strong { display: block; font-size: 18px; color: #2cbab8; }
  span { font-size: 12px; color: #9CA3AF; }
`;

const Footnote = styled.p`
  font-size: 11px;
  color: #6B7280;
  margin: 6px 0 0;
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  width: 450px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1024px) { margin-top: 80px; }
`;

const VisualCard = styled.div`
  background: white;
  width: 320px;
  height: 400px;
  border-radius: 20px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  overflow: hidden;
  .card-header {
    background: #F3F4F6;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    span { font-size: 12px; color: #6B7280; font-weight: 700; margin-left: auto; }
    .dot { width: 8px; height: 8px; border-radius: 50%; }
    .red { background: #ff0000; }
    .yellow { background: #FFBD2E; }
    .green { background: #2cbab8; }
  }
  .card-body {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    .line { height: 10px; background: #E5E7EB; border-radius: 5px; }
    .teal { background: #2cbab8; }
  }
`;

const FloatingElement = styled(motion.div)<{ delay?: number }>`
  position: absolute;
  top: 10%; left: 0;
  background: white;
  padding: 15px 25px;
  border-radius: 15px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  color: #0d1d45; font-weight: 800; font-size: 11px; text-transform: uppercase;
  animation: float 4s ease-in-out infinite;
  animation-delay: ${p => p.delay || 0}s;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
`;

const StatsBanner = styled.div`
  background: rgba(255,255,255,0.02);
  padding: 30px;
  text-align: center;
  font-size: 11px;
  font-weight: 900;
  color: #6B7280;
  letter-spacing: 5px;
  border-top: 1px solid rgba(255,255,255,0.05);
`;

const HowItWorks = styled.section`
  padding: 120px 80px;
  background: #0d1d45;
  @media (max-width: 768px) { padding: 80px 40px; }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-family: 'Barlow Condensed';
  font-size: 48px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

const SectionSubtitle = styled.p`
  color: #9CA3AF;
  font-size: 18px;
`;

const StepsGrid = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 40px;
  @media (max-width: 1024px) { flex-direction: column; align-items: center; }
`;

const StepCard = styled.div`
  flex: 1;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  h3 { font-family: 'Barlow Condensed'; font-size: 24px; margin-bottom: 16px; text-transform: uppercase; }
  p { color: #9CA3AF; font-size: 16px; line-height: 1.5; }
`;

const StepNum = styled.div`
  position: absolute;
  top: -20px; left: 50%; transform: translateX(-50%);
  font-size: 80px; font-weight: 900; color: rgba(255,255,255,0.03); z-index: 0;
`;

const StepArrow = styled.div`
  position: absolute;
  top: 30px; right: -60px;
  @media (max-width: 1024px) { display: none; }
`;

const ExtraServices = styled.section`
  padding: 100px 80px;
  background: white;
  color: #0d1d45;
  ${SectionTitle} { color: #0d1d45; }
  @media (max-width: 768px) { padding: 80px 40px; }
`;

const ExtraGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const ExtraCard = styled.div`
  display: flex;
  background: #F9FAFB;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #E5E7EB;
  img { width: 40%; object-fit: cover; }
  .content { padding: 30px; display: flex; flex-direction: column; gap: 15px; }
  h3 { font-family: 'Barlow Condensed'; font-size: 24px; margin: 0; }
  p { color: #6B7280; font-size: 14px; line-height: 1.5; }
`;

const FeaturesSection = styled.section`
  padding: 120px 80px;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.02);
  padding: 40px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.05);
  h3 { font-family: 'Barlow Condensed'; font-size: 24px; margin-bottom: 16px; text-transform: uppercase; }
  p { color: #9CA3AF; line-height: 1.5; }
`;

const IconBox = styled.div<{bg: string, color: string}>`
  width: 64px; height: 64px; border-radius: 12px; background: ${p => p.bg}; color: ${p => p.color};
  display: flex; align-items: center; justify-content: center; margin-bottom: 24px; position: relative; z-index: 1;
  svg { width: 32px; height: 32px; }
`;

const FAQSection = styled.section`
  padding: 100px 80px;
  background: rgba(255,255,255,0.01);
  @media (max-width: 768px) { padding: 80px 40px; }
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const FAQItem = styled.div`
  background: rgba(255,255,255,0.03);
  padding: 30px;
  border-radius: 16px;
  h4 { font-family: 'Barlow Condensed'; font-size: 20px; color: #2cbab8; margin-bottom: 15px; }
  p { font-size: 15px; color: #9CA3AF; line-height: 1.6; }
`;

const CTASection = styled.section`
  padding: 120px 80px;
  text-align: center;
  background: linear-gradient(to bottom, #0d1d45, #142756);
  h2 { font-family: 'Barlow Condensed'; font-size: 56px; text-transform: uppercase; margin-bottom: 24px; font-weight: 900; }
  p { color: #9CA3AF; margin-bottom: 48px; font-size: 20px; }
`;

const TestimonialsSection = styled.section`padding: 120px 80px; background: rgba(0,0,0,0.02); @media (max-width: 768px) { padding: 80px 40px; }`;
const TestimonialsGrid = styled.div`display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; @media (max-width: 1024px) { grid-template-columns: 1fr; }`;
const TestimonialCard = styled.div`
  background: white; color: #0D1D45; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; gap: 20px; border: 1px solid #F3F4F6;
  .stars { display: flex; gap: 4px; }
  p { font-size: 16px; font-style: italic; line-height: 1.6; color: #374151; }
  .user { display: flex; align-items: center; gap: 12px; margin-top: auto; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; background: #2CC4C0; color: #0D1D45; display: flex; align-items: center; justify-content: center; font-weight: 900; }
  .info { display: flex; flex-direction: column; strong { font-size: 14px; } span { font-size: 11px; color: #6B7280; font-weight: 700; text-transform: uppercase; } }
`;

const NewsletterSection = styled.section`
  padding: 80px;
  .card { 
     background: #2CC4C0; padding: 60px; border-radius: 30px; display: flex; justify-content: space-between; align-items: center; gap: 40px;
     @media (max-width: 1024px) { flex-direction: column; text-align: center; padding: 40px 20px; }
  }
  .content { h3 { font-family: 'Barlow Condensed'; font-size: 32px; color: #0D1D45; text-transform: uppercase; margin-bottom: 8px; } p { color: #0D1D45; opacity: 0.8; font-weight: 600; } }
  .form { display: flex; gap: 12px; flex: 1; justify-content: flex-end; input { padding: 16px 24px; border-radius: 12px; border: none; width: 100%; max-width: 300px; font-weight: 600; } }
`;

const Footer = styled.footer`
  padding: 80px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; align-items: center; gap: 30px;
  p { font-size: 13px; color: #4B5563; }
`;

const FooterLinks = styled.div`
  display: flex; gap: 30px;
  a { color: #6B7280; font-size: 14px; text-decoration: none; &:hover { color: white; } }
`;

export default LandingPage;
