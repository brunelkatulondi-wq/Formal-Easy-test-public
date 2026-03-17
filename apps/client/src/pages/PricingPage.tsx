// apps/client/src/pages/PricingPage.tsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Check, Info, ShieldCheck, Zap, Star, ArrowRight, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import BackButton from '../components/ui/BackButton';

const PricingPage = () => {
  const [options, setOptions] = React.useState({
    domiciliation: false,
    legalAdvice: false,
    accounting: false
  });
  const navigate = useNavigate();
  const [simPack, setSimPack] = React.useState<'Essentiel'|'Confort'|'Premium'>('Confort');
  const [simForm, setSimForm] = React.useState<'SARL'|'SAS'|'SA'|'SNC'|'EI'>('SARL');

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateTotalPrice = (basePrice: number) => {
    let total = basePrice;
    if (options.domiciliation) total += 50;
    if (options.legalAdvice) total += 75;
    if (options.accounting) total += 100;
    return total;
  };

  const packPrices: Record<typeof simPack, number> = {
    Essentiel: 249,
    Confort: 349,
    Premium: 569
  };

  const formFees: Record<typeof simForm, number> = {
    SARL: 120,
    SAS: 150,
    SA: 220,
    SNC: 100,
    EI: 80
  };

  const packs = [
    {
      name: 'Essentiel',
      basePrice: 249,
      description: 'Pour lancer votre activité rapidement avec les documents officiels.',
      features: [
        'Génération des statuts par IA OHADA',
        'Vérification par un formaliste',
        'Dossier GUCE complet prêt au dépôt',
        'Accès au dashboard client',
        'Support email 48h'
      ],
      excluded: [
        'Dépôt physique au GUCE',
        'Obtention du RCCM & NIF'
      ],
      recommended: false,
      cta: 'Choisir Essentiel'
    },
    {
      name: 'Confort',
      basePrice: 349,
      description: 'Le choix n°1 des entrepreneurs : on s\'occupe de tout l\'administratif.',
      features: [
        'Tout le pack Essentiel',
        'Dépôt physique par nos agents GUCE',
        'Retrait du RCCM & NIF inclus',
        'Support WhatsApp Prioritaire',
        'Assurance "Dossier Validé"'
      ],
      excluded: [],
      recommended: true,
      badge: 'POPULAIRE',
      cta: 'Choisir Confort'
    },
    {
      name: 'Premium',
      basePrice: 569,
      description: 'Accompagnement total pour une sérénité absolue.',
      features: [
        'Tout le pack Confort',
        'Frais d\'État INCLUS (Dépôt)',
        '1h de conseil juridique expert (Inclus)',
        'Domiciliation 3 mois offerte',
        'Comptabilité 1er mois offerte',
        'Support dédié 24/7'
      ],
      excluded: [],
      recommended: false,
      cta: 'Choisir Premium'
    }
  ];

  const selectPack = (packCode: 'ESSENTIEL' | 'CONFORT' | 'PREMIUM') => {
    localStorage.setItem('selectedPack', packCode);
    navigate('/signup', { state: { pack: packCode } });
  };

  return (
    <PageWrapper>
      <Navbar>
        <Link to="/"><Logo size={20} light /></Link>
        <NavLinks>
           <Link to="/">Accueil</Link>
           <Link to="/signup"><Button variant="secondary" size="sm">Créer mon entreprise</Button></Link>
        </NavLinks>
      </Navbar>

      <Hero>
        <div style={{marginBottom: '12px'}}>
          <BackButton />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge>TARIFS TRANSPARENTS</Badge>
          <h1>Des tarifs clairs, <span>sans frais cachés.</span></h1>
          <p>Choisissez le pack qui correspond à l'étape de votre projet. FormalEasy DRC s'adapte à vos besoins.</p>
          <p style={{color: '#9CA3AF', marginTop: '10px', fontSize: '14px'}}>
            Les frais administratifs GUCE/impôts ne sont pas inclus et restent dus aux autorités. Nous affichons uniquement nos honoraires et services.
          </p>
          <CTAButtons>
            <Link to="/signup">
              <Button variant="secondary" size="lg">Démarrer ma création</Button>
            </Link>
            <a href="https://wa.me/243847395433?text=Bonjour%20FormalEasy" target="_blank" rel="noreferrer">
              <Button variant="outline" size="lg" style={{borderColor: '#2cc4c0', color: '#2cc4c0'}}>Parler à un conseiller</Button>
            </a>
          </CTAButtons>
        </motion.div>
      </Hero>

      <IncludedSection>
        <div className="card">
          <div>
            <h3>Inclus dans tous les packs</h3>
            <ul>
              <li>Génération des statuts OHADA par IA + relecture formaliste</li>
              <li>Dossier GUCE complet prêt au dépôt</li>
              <li>Dashboard client + messagerie + notifications</li>
            </ul>
          </div>
          <div>
            <h3>Non inclus (frais obligatoires)</h3>
            <ul>
              <li>Frais GUCE / greffe / impôts</li>
              <li>Publication au journal officiel (si requis)</li>
              <li>Frais de traduction/légalisation éventuels</li>
            </ul>
          </div>
        </div>
      </IncludedSection>

      <Simulator>
        <div className="head">
          <Badge>Estimateur rapide</Badge>
          <h2>Calculez vos coûts estimatifs</h2>
          <p>Pack choisi + frais administratifs estimés (indicatif, basé sur tarifs GUCE 2026).</p>
        </div>
        <div className="controls">
          <div className="field">
            <label>Pack</label>
            <select value={simPack} onChange={e => setSimPack(e.target.value as any)}>
              <option value="Essentiel">Essentiel</option>
              <option value="Confort">Confort</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          <div className="field">
            <label>Forme juridique</label>
            <select value={simForm} onChange={e => setSimForm(e.target.value as any)}>
              <option value="SARL">SARL</option>
              <option value="SAS">SAS</option>
              <option value="SA">SA</option>
              <option value="SNC">SNC</option>
              <option value="EI">Entreprise Individuelle</option>
            </select>
          </div>
        </div>
        <Result>
          <div className="line"><span>Pack {simPack}</span><strong>{packPrices[simPack]} $</strong></div>
          <div className="line"><span>Frais GUCE estimés ({simForm})</span><strong>{formFees[simForm]} $</strong></div>
          <div className="line total"><span>Total estimé</span><strong>{packPrices[simPack] + formFees[simForm]} $</strong></div>
          <small>* Estimation indicative, hors coûts spécifiques (annonces, traductions, légalisation).</small>
        </Result>
      </Simulator>

      {/* Pricing Simulator UI */}
      <SimulatorBar>
         <div className="title">Personnalisez votre pack :</div>
         <OptionsRow>
            <OptionItem active={options.domiciliation} onClick={() => toggleOption('domiciliation')}>
               <div className="check">{options.domiciliation ? <Check size={14} /> : null}</div>
               <span>Domiciliation (+50$)</span>
            </OptionItem>
            <OptionItem active={options.legalAdvice} onClick={() => toggleOption('legalAdvice')}>
               <div className="check">{options.legalAdvice ? <Check size={14} /> : null}</div>
               <span>Conseil Juridique (+75$)</span>
            </OptionItem>
            <OptionItem active={options.accounting} onClick={() => toggleOption('accounting')}>
               <div className="check">{options.accounting ? <Check size={14} /> : null}</div>
               <span>Comptabilité (+100$)</span>
            </OptionItem>
         </OptionsRow>
      </SimulatorBar>

      <PacksSection>
        {packs.map((pack, idx) => (
          <PricingCard 
            key={idx} 
            recommended={pack.recommended}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {pack.badge && <span className="pop-badge">{pack.badge}</span>}
            <h3>{pack.name}</h3>
            <div className="price-tag">
              <span className="amount">{calculateTotalPrice(pack.basePrice)}$</span>
            </div>
            <p className="description">{pack.description}</p>
            <Button 
              variant={pack.recommended ? 'secondary' : 'outline'} 
              fullWidth
              style={{ marginTop: '20px' }}
              onClick={() => selectPack(pack.name.toUpperCase() as any)}
            >
              {pack.cta}
            </Button>

            <FeaturesList>
              {pack.features.map((f, i) => (
                <li key={i}><Check size={16} color="#2cbab8" /> <span>{f}</span></li>
              ))}
              {options.domiciliation && <li><Check size={16} color="#2cbab8" /> <span>Domiciliation incluse</span></li>}
              {options.legalAdvice && <li><Check size={16} color="#2cbab8" /> <span>Conseil Expert inclus</span></li>}
              {options.accounting && <li><Check size={16} color="#2cbab8" /> <span>Pack Compta inclus</span></li>}
              {pack.excluded.map((f, i) => (
                <li key={i} className="excluded"><Info size={16} /> <span>{f}</span></li>
              ))}
            </FeaturesList>
          </PricingCard>
        ))}
      </PacksSection>

      <ComparisonTableSection>
        <h2>Comparez nos services en détail</h2>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Services & Formalités</th>
                <th>Essentiel</th>
                <th>Confort</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Génération de Statuts IA (OHADA)</td>
                <td><Check size={20} color="#2cbab8" /></td>
                <td><Check size={20} color="#2cbab8" /></td>
                <td><Check size={20} color="#2cbab8" /></td>
              </tr>
              <tr>
                <td>Vérification par un formaliste spécialisé</td>
                <td><Check size={20} color="#2cbab8" /></td>
                <td><Check size={20} color="#2cbab8" /></td>
                <td><Check size={20} color="#2cbab8" /></td>
              </tr>
              <tr>
                <td>Dépôt physique au Guichet Unique (GUCE)</td>
                <td>-</td>
                <td><Check size={20} color="#2cbab8" /></td>
                <td><Check size={20} color="#2cbab8" /></td>
              </tr>
              <tr>
                <td>Retrait RCCM, NIF et Statuts certifiés</td>
                <td>-</td>
                <td><Check size={20} color="#2cbab8" /></td>
                <td><Check size={20} color="#2cbab8" /></td>
              </tr>
              <tr>
                <td>Avance des Frais d'État (GUCE)</td>
                <td>-</td>
                <td>-</td>
                <td><Check size={20} color="#2cbab8" /></td>
              </tr>
              <tr>
                <td>Domiciliation (Kinshasa Gombe)</td>
                <td>Option</td>
                <td>Option</td>
                <td>3 mois inclus</td>
              </tr>
              <tr>
                <td>Conseil juridique Expert (1h Call)</td>
                <td>-</td>
                <td>-</td>
                <td><Check size={20} color="#2cbab8" /></td>
              </tr>
            </tbody>
          </table>
        </TableContainer>
      </ComparisonTableSection>

      <TrustSection>
        <div className="trust-grid">
           <div className="trust-item">
              <ShieldCheck size={32} color="#2cbab8" />
              <h4>Sécurité Totale</h4>
              <p>Vos documents sont protégés et certifiés conformes.</p>
           </div>
           <div className="trust-item">
              <Zap size={32} color="#2cbab8" />
              <h4>Rapidité</h4>
              <p>Dépôt GUCE sous 24h ouvrées garanti.</p>
           </div>
           <div className="trust-item">
              <Star size={32} color="#2cbab8" />
              <h4>Satisfaction</h4>
              <p>Plus de 500 dossiers déjà validés avec succès.</p>
           </div>
        </div>
      </TrustSection>

      <Footer>
         <Logo size={20} light />
        <p>© 2026 FormalEasy DRC. Facilitateur d'Affaires en RDC.
          <a href="https://wa.me/243847395433?text=Bonjour%20FormalEasy" target="_blank" rel="noreferrer"> Parler à un conseiller</a>
        </p>
      </Footer>
    </PageWrapper>
  );
};

// --- STYLES ---

const PageWrapper = styled.div`
  background: white;
  min-height: 100vh;
  color: #0d1d45;
  font-family: 'Barlow', sans-serif;
`;

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 80px;
  background: #0d1d45;
  color: white;
  @media (max-width: 768px) { padding: 20px 40px; }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  a { color: white; text-decoration: none; font-weight: 600; font-size: 14px; }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const IncludedSection = styled.section`
  max-width: 1100px;
  margin: -30px auto 60px;
  padding: 0 20px;
  .card {
    background: #0d1d45;
    color: white;
    border-radius: 20px;
    padding: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
  h3 { font-family: 'Barlow Condensed'; font-size: 20px; text-transform: uppercase; margin-bottom: 10px; }
  ul { margin: 0; padding-left: 18px; color: #E5E7EB; line-height: 1.5; }
  li { margin-bottom: 6px; }
`;

const Simulator = styled.section`
  max-width: 1100px;
  margin: 0 auto 60px;
  padding: 0 20px;
  .head { text-align: center; margin-bottom: 20px; }
  h2 { font-family: 'Barlow Condensed'; font-size: 32px; text-transform: uppercase; margin: 10px 0; color: #0d1d45; }
  p { color: #6B7280; }
  .controls { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
  .field { display: flex; flex-direction: column; gap: 6px; label { font-weight: 700; color: #374151; font-size: 13px; text-transform: uppercase; } select { padding: 10px 12px; border-radius: 10px; border: 1px solid #E5E7EB; min-width: 180px; } }
`;

const Result = styled.div`
  max-width: 520px;
  margin: 0 auto;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
  .line { display: flex; justify-content: space-between; font-weight: 700; color: #0d1d45; }
  .total { border-top: 1px dashed #E5E7EB; padding-top: 8px; }
  small { color: #6B7280; }
`;

const Hero = styled.section`
  padding: 80px 20px;
  text-align: center;
  background: #0d1d45;
  color: white;
  h1 { font-family: 'Barlow Condensed'; font-size: 56px; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; span { color: #2cbab8; } }
  p { font-size: 20px; color: #9CA3AF; max-width: 700px; margin: 0 auto; }
  @media (max-width: 768px) { padding: 60px 20px; h1 { font-size: 40px; } }
`;

const Badge = styled.span`
  display: inline-block;
  background: rgba(44, 186, 184, 0.1);
  color: #2cbab8;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 20px;
`;

const SimulatorBar = styled.div`
  max-width: 900px; margin: -30px auto 40px; background: white; padding: 20px 40px; border-radius: 100px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; gap: 30px;
  position: relative; z-index: 10; border: 1px solid #F3F4F6;
  .title { font-weight: 800; font-size: 13px; color: #0d1d45; text-transform: uppercase; letter-spacing: 1px; }
  @media (max-width: 1024px) { border-radius: 20px; flex-direction: column; padding: 30px; margin-top: 20px; }
`;

const OptionsRow = styled.div`display: flex; gap: 20px; @media (max-width: 768px) { flex-direction: column; width: 100%; }`;

const OptionItem = styled.div<{active: boolean}>`
  display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 8px 16px; border-radius: 50px;
  background: ${p => p.active ? '#e6f7f6' : 'transparent'};
  border: 1.5px solid ${p => p.active ? '#2cbab8' : '#E5E7EB'};
  transition: 0.2s;
  span { font-size: 13px; font-weight: 700; color: ${p => p.active ? '#0d1d45' : '#6B7280'}; }
  .check { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid ${p => p.active ? '#2cbab8' : '#E5E7EB'}; display: flex; align-items: center; justify-content: center; color: #2cbab8; background: white; }
  &:hover { border-color: #2cbab8; }
`;

const PacksSection = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: -60px auto 80px;
  padding: 0 20px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; margin-top: 40px; }
`;

const PricingCard = styled(motion.div)<{ recommended?: boolean }>`
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.08);
  border: 1px solid ${p => p.recommended ? '#2cbab8' : '#F3F4F6'};
  position: relative;
  display: flex;
  flex-direction: column;

  .pop-badge { 
    position: absolute; 
    top: -12px; 
    right: 30px; 
    background: #2cbab8; 
    color: white; 
    padding: 4px 12px; 
    border-radius: 100px; 
    font-size: 10px; 
    font-weight: 900; 
  }

  h3 { font-family: 'Barlow Condensed'; font-size: 32px; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; color: #0d1d45; }
  .price-tag { margin-bottom: 20px; .amount { font-size: 48px; font-weight: 900; } }
  .description { color: #6B7280; font-size: 15px; margin-bottom: 25px; min-height: 45px; }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 30px;
  li { 
    display: flex; gap: 12px; margin-bottom: 15px; font-size: 14px; font-weight: 600; color: #374151;
    &.excluded { color: #9CA3AF; opacity: 0.6; }
    span { line-height: 1.2; }
  }
`;

const ComparisonTableSection = styled.section`
  max-width: 1000px;
  margin: 0 auto 100px;
  padding: 0 20px;
  h2 { font-family: 'Barlow Condensed'; font-size: 36px; text-transform: uppercase; margin-bottom: 40px; text-align: center; }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid #F3F4F6;
  border-radius: 20px;
  table { 
    width: 100%; border-collapse: collapse; 
    th, td { padding: 20px; text-align: left; border-bottom: 1px solid #F3F4F6; }
    th { background: #F9FAFB; font-weight: 900; text-transform: uppercase; font-size: 13px; font-family: 'Barlow Condensed'; }
    td { font-size: 14px; font-weight: 600; }
    tr:last-child td { border-bottom: none; }
  }
`;

const TrustSection = styled.section`
  background: #F9FAFB;
  padding: 100px 20px;
  .trust-grid { 
    max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; 
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }
  .trust-item { text-align: center; h4 { margin: 20px 0 10px; font-size: 18px; } p { color: #6B7280; font-size: 14px; } }
`;

const Footer = styled.footer`
  padding: 40px;
  background: #0d1d45;
  color: white;
  text-align: center;
  p { margin-top: 15px; font-size: 12px; color: #9CA3AF; }
  a { color: #2cc4c0; font-weight: 700; margin-left: 12px; text-decoration: none; }
`;

export default PricingPage;
