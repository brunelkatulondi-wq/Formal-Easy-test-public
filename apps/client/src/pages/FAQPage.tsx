// apps/client/src/pages/FAQPage.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, FileText, Landmark, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackButton from '../components/ui/BackButton';

const FAQPage = () => {
  const faqs = [
    {
      category: 'Création & Processus',
      items: [
        { q: "Quels sont les délais réels pour obtenir mon RCCM ?", a: "En moyenne, une fois le dossier déposé physiquement au GUCE par nos agents, il faut compter 3 à 7 jours ouvrables pour obtenir le RCCM et le NIF définitifs." },
        { q: "Dois-je me déplacer au Guichet Unique ?", a: "Non. Si vous choisissez le pack Confort ou Premium, nos formalistes s'occupent du dépôt physique pour vous. Vous recevez vos documents numérisés, puis les originaux par coursier ou retrait en bureau." },
        { q: "L'IA peut-elle se tromper dans mes statuts ?", a: "L'IA rédige une base solide conforme au droit OHADA, mais chaque document généré est obligatoirement relu et validé par un formaliste humain avant tout dépôt officiel." }
      ]
    },
    {
      category: 'Diaspora & Paiement',
      items: [
        { q: "Je vis à l'étranger, comment signer mes documents ?", a: "Nous utilisons des plateformes de signature électronique certifiées qui ont valeur légale en RDC pour les actes sous seing privé." },
        { q: "Quels sont les modes de paiement acceptés ?", a: "Nous acceptons les cartes Visa, Mastercard via Stripe, ainsi que les paiements Mobile Money (M-Pesa, Airtel Money) pour les clients locaux." }
      ]
    }
  ];

  return (
    <PageWrapper>
      <Navbar>
        <Link to="/"><Logo size={20} light /></Link>
        <NavLinks>
           <Link to="/">Accueil</Link>
           <Link to="/contact">Contact</Link>
           <Link to="/signup"><Button variant="secondary" size="sm">Lancer mon projet</Button></Link>
        </NavLinks>
      </Navbar>

      <Hero>
        <div style={{textAlign:'left', marginBottom:'10px'}}>
          <BackButton />
        </div>
        <h1>Centre d'aide <span>& FAQ.</span></h1>
        <p>Tout ce que vous devez savoir pour lancer votre entreprise en RDC sans stress.</p>
      </Hero>

      <Content>
        <div className="faq-grid">
          {faqs.map((cat, idx) => (
            <div key={idx} className="category-section">
              <h2>{cat.category}</h2>
              {cat.items.map((item, i) => (
                <FAQItem key={i}>
                  <div className="question">
                     <HelpCircle size={20} color="#2cbab8" />
                     <h4>{item.q}</h4>
                  </div>
                  <p className="answer">{item.a}</p>
                </FAQItem>
              ))}
            </div>
          ))}
        </div>

        <CTA>
          <MessageCircle size={40} color="#2cbab8" />
          <h3>Vous ne trouvez pas votre réponse ?</h3>
          <p>Nos experts sont disponibles sur WhatsApp pour vous répondre en direct.</p>
          <Button variant="secondary" onClick={() => window.open('https://wa.me/243847395433?text=Bonjour%20FormalEasy')}>Discuter sur WhatsApp</Button>
          <small style={{color: '#9CA3AF'}}>Disponible du lundi au vendredi, 8h-18h (GMT+1).</small>
        </CTA>
      </Content>

      <Footer>
         <Logo size={20} light />
         <p>© 2026 FormalEasy DRC. L'entrepreneuriat simplifié.</p>
      </Footer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`background: #F9FAFB; min-height: 100vh; font-family: 'Barlow', sans-serif;`;
const Navbar = styled.nav`display: flex; justify-content: space-between; align-items: center; padding: 20px 80px; background: #0d1d45; color: white;`;
const NavLinks = styled.div`display: flex; align-items: center; gap: 30px; a { color: white; text-decoration: none; font-weight: 600; font-size: 14px; }`;
const Hero = styled.section`padding: 80px 20px; text-align: center; background: #0d1d45; color: white; h1 { font-family: 'Barlow Condensed'; font-size: 56px; font-weight: 900; span { color: #2cbab8; } } p { color: #9CA3AF; font-size: 18px; }`;

const Content = styled.section`max-width: 900px; margin: 40px auto 100px; padding: 0 20px;`;
const FAQItem = styled.div`background: white; padding: 25px; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); .question { display: flex; gap: 15px; align-items: center; margin-bottom: 15px; h4 { font-size: 18px; color: #0d1d45; } } .answer { color: #6B7280; line-height: 1.6; padding-left: 35px; }`;
const CTA = styled.div`text-align: center; background: white; padding: 60px; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); margin-top: 80px; h3 { margin: 20px 0 10px; font-size: 24px; color: #0d1d45; } p { color: #6B7280; margin-bottom: 30px; }`;
const Footer = styled.footer`padding: 40px; background: #0d1d45; color: white; text-align: center; p { margin-top: 15px; font-size: 12px; color: #9CA3AF; }`;

export default FAQPage;
