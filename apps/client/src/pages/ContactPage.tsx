// apps/client/src/pages/ContactPage.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageSquare, Clock, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import toast from 'react-hot-toast';
import BackButton from '../components/ui/BackButton';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Votre message a été envoyé ! Notre équipe vous contactera sous 2h.");
  };

  return (
    <PageWrapper>
      <Navbar>
        <Link to="/"><Logo size={20} light /></Link>
        <NavLinks>
           <Link to="/">Accueil</Link>
           <Link to="/pricing">Tarifs</Link>
           <Link to="/signup"><Button variant="secondary" size="sm">S'inscrire</Button></Link>
        </NavLinks>
      </Navbar>

      <Hero>
        <div style={{textAlign:'left', marginBottom:'12px'}}>
          <BackButton />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Contactez nos <span>experts.</span></h1>
          <p>Une question juridique ? Besoin d'aide pour votre dossier ? Nous sommes là pour vous accompagner, où que vous soyez.</p>
          <ButtonsRow>
            <a href="https://wa.me/243847395433?text=Bonjour%20FormalEasy" target="_blank" rel="noreferrer">
              <Button variant="secondary" size="md">Parler sur WhatsApp</Button>
            </a>
            <a href="tel:+243810000000">
              <Button variant="outline" size="md" style={{borderColor: '#2cbab8', color: '#2cbab8'}}>Appeler le support</Button>
            </a>
          </ButtonsRow>
        </motion.div>
      </Hero>

      <ContentGrid>
        <ContactInfo>
          <h2>Nos coordonées</h2>
          <p>Disponibles du lundi au vendredi, de 8h à 18h (GMT+1).</p>
          
          <InfoItems>
           <div className="item">
              <div className="icon"><Phone size={24} /></div>
              <div className="details">
                  <h4>Téléphone / WhatsApp</h4>
                  <p>+243 847 395 433</p>
              </div>
           </div>
            <div className="item">
               <div className="icon"><Mail size={24} /></div>
               <div className="details">
                  <h4>Email</h4>
                  <p>contact@formaleasy.cd</p>
               </div>
            </div>
            <div className="item">
               <div className="icon"><MapPin size={24} /></div>
               <div className="details">
                  <h4>Siège Social</h4>
                  <p>123 Avenue de la Gombe, Immeuble Prestige, Kinshasa - RDC</p>
               </div>
            </div>
          </InfoItems>

          <SupportCard>
             <MessageSquare size={32} color="#2cbab8" />
             <h3>Support Diaspora</h3>
             <p>Vous investissez depuis l'étranger ? Nous avons une ligne dédiée pour faciliter vos démarches à distance via la signature électronique.</p>
             <Button variant="ghost" style={{padding: 0, color: '#2cbab8', fontWeight: 800}}>En savoir plus <ArrowRight size={16} /></Button>
          </SupportCard>
        </ContactInfo>

        <FormCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3>Envoyez-nous un message</h3>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <div className="group">
                 <label>Nom complet</label>
                 <input type="text" placeholder="Jean Dupont" required />
              </div>
              <div className="group">
                 <label>Email professionnel</label>
                 <input type="email" placeholder="jean@entreprise.com" required />
              </div>
            </FormGrid>
            <div className="group" style={{marginTop: '20px'}}>
               <label>Sujet</label>
               <select required>
                  <option value="">Sélectionnez un sujet</option>
                  <option value="creation">Création d'entreprise</option>
                  <option value="diaspora">Investissement Diaspora</option>
                  <option value="domiciliation">Domiciliation / Bureaux</option>
                  <option value="autre">Autre demande</option>
               </select>
            </div>
            <div className="group" style={{marginTop: '20px'}}>
               <label>Votre message</label>
               <textarea placeholder="Comment pouvons-nous vous aider ?" required style={{height: '150px'}}></textarea>
            </div>
            <Button variant="secondary" fullWidth style={{marginTop: '30px', padding: '15px'}}>Envoyer le message</Button>
          </form>
        </FormCard>
      </ContentGrid>

      <MapPlaceholder>
         <div className="overlay">
            <CheckCircle size={40} color="#2cbab8" />
            <h3>Présents physiquement à Kinshasa</h3>
            <p>Rendez-vous possible dans nos bureaux de la Gombe sur réservation.</p>
         </div>
      </MapPlaceholder>

      <Footer>
         <Logo size={20} light />
         <div className="links">
            <Link to="/pricing">Tarifs</Link>
            <a href="#">Conditions</a>
            <a href="#">Confidentialité</a>
         </div>
         <p>© 2026 FormalEasy DRC. Le partenaire de votre succès.</p>
      </Footer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`background: #F9FAFB; min-height: 100vh; font-family: 'Barlow', sans-serif;`;

const Navbar = styled.nav`
  display: flex; justify-content: space-between; align-items: center; padding: 20px 80px; background: #0d1d45; color: white;
  @media (max-width: 768px) { padding: 20px 40px; }
`;

const NavLinks = styled.div`display: flex; align-items: center; gap: 30px; a { color: white; text-decoration: none; font-weight: 600; font-size: 14px; }`;

const Hero = styled.section`
  padding: 80px 20px; text-align: center; background: #0d1d45; color: white;
  h1 { font-family: 'Barlow Condensed'; font-size: 64px; font-weight: 900; margin-bottom: 20px; text-transform: uppercase; span { color: #2cbab8; } }
  p { font-size: 20px; color: #9CA3AF; max-width: 650px; margin: 0 auto; line-height: 1.5; }
  @media (max-width: 768px) { h1 { font-size: 40px; } }
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const ContentGrid = styled.section`
  max-width: 1200px; margin: -50px auto 80px; padding: 0 20px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; margin-top: 40px; }
`;

const ContactInfo = styled.div`
  h2 { font-family: 'Barlow Condensed'; font-size: 40px; font-weight: 900; color: #0d1d45; margin-bottom: 10px; text-transform: uppercase; }
  & > p { color: #6B7280; margin-bottom: 40px; }
`;

const InfoItems = styled.div`
  display: flex; flex-direction: column; gap: 30px; margin-bottom: 50px;
  .item { 
    display: flex; gap: 20px; align-items: flex-start;
    .icon { background: white; padding: 12px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); color: #2cbab8; }
    h4 { font-size: 16px; margin-bottom: 5px; color: #0d1d45; font-weight: 800; }
    p { color: #6B7280; font-size: 15px; }
  }
`;

const SupportCard = styled.div`
  background: white; padding: 40px; border-radius: 20px; border-left: 5px solid #2cbab8; box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  h3 { margin: 15px 0 10px; color: #0d1d45; }
  p { color: #6B7280; font-size: 14px; margin-bottom: 20px; line-height: 1.6; }
`;

const FormCard = styled(motion.div)`
  background: white; padding: 50px; border-radius: 24px; box-shadow: 0 30px 60px rgba(0,0,0,0.1);
  h3 { font-family: 'Barlow Condensed'; font-size: 28px; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; color: #0d1d45; }
  .group { 
    display: flex; flex-direction: column; gap: 8px;
    label { font-size: 13px; font-weight: 800; color: #374151; }
    input, select, textarea { 
      padding: 12px 16px; border: 1.5px solid #E5E7EB; border-radius: 10px; outline: none; transition: 0.2s;
      &:focus { border-color: #2cbab8; box-shadow: 0 0 0 4px rgba(44, 186, 184, 0.1); }
    }
  }
`;

const FormGrid = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 20px; @media (max-width: 640px) { grid-template-columns: 1fr; }`;

const MapPlaceholder = styled.div`
  height: 400px; background: #e5e7eb url('https://images.unsplash.com/photo-1577086664693-894d8405334a?auto=format&fit=crop&q=80&w=1200') center/cover;
  position: relative; display: flex; align-items: center; justify-content: center;
  .overlay { background: white; padding: 40px; border-radius: 20px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.2); max-width: 400px; }
  h3 { margin: 15px 0 5px; color: #0d1d45; font-family: 'Barlow Condensed'; font-size: 24px; text-transform: uppercase; }
  p { color: #6B7280; font-size: 14px; }
`;

const Footer = styled.footer`
  padding: 60px 20px; background: #0d1d45; color: white; text-align: center;
  .links { display: flex; justify-content: center; gap: 30px; margin: 30px 0; a { color: #9CA3AF; text-decoration: none; font-size: 14px; &:hover { color: white; } } }
  p { font-size: 12px; color: #4B5563; }
`;

export default ContactPage;
