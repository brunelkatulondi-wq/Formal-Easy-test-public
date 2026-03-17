// apps/client/src/pages/QuestionnairePage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import { CheckCircle, Info, ArrowRight, ArrowLeft, BrainCircuit, ShieldCheck, FileText, Download, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import BackButton from '../components/ui/BackButton';

const steps = [
  { id: 1, title: 'Projet', description: 'Nom et structure' },
  { id: 2, title: 'Activité', description: 'IA OHADA' },
  { id: 3, title: 'Aperçu', description: 'Votre brouillon' },
  { id: 4, title: 'Paiement', description: 'Finalisation' }
];

const QuestionnairePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialPack = ((location.state as any)?.pack || params.get('pack') || localStorage.getItem('selectedPack') || 'ESSENTIEL').toString().toUpperCase() as 'ESSENTIEL' | 'CONFORT' | 'PREMIUM';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    legalForm: 'SARL',
    city: 'Kinshasa',
    activityDescription: '',
    socialObject: '',
    capital: 1000,
    pack: initialPack
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step === 1 && !formData.companyName) return toast.error("Veuillez entrer le nom de votre société.");
    setStep(s => Math.min(s + 1, 4));
  };
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const generateAIObject = async () => {
    if (!formData.activityDescription) return toast.error("Décrivez votre activité d'abord.");
    setIsGenerating(true);
    try {
      const { data } = await axios.post('/api/ai/generate-object', 
        { activityDescription: formData.activityDescription },
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      setFormData({ ...formData, socialObject: data.aiDraft });
      toast.success("Objet social généré par l'IA !");
      setStep(3); // Aller direct à l'aperçu
    } catch (err) {
      toast.error("Échec de la génération IA. Le serveur est peut-être hors ligne.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.activityDescription || formData.activityDescription.trim().length < 10) {
      return toast.error("D\u00e9crivez votre activit\u00e9 (10 caract\u00e8res minimum).");
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        activityDescription: formData.activityDescription || undefined,
        socialObject: formData.socialObject || undefined,
      };

      const { data } = await axios.post('/api/dossiers', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      toast.success("Dossier cr\u00e9\u00e9 ! Redirection vers le paiement...");
      const session = await axios.post('/api/payments/create-session', { dossierId: data.id }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      window.location.href = session.data.url;
    } catch (err) {
      toast.error("Erreur lors de la cr\u00e9ation du dossier ou du paiement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <header style={{padding: '20px 0', borderBottom: '1px solid #E5E7EB', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Logo size={20} />
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '13px', fontWeight: 700}}>
           <ShieldCheck size={18} /> Connexion Sécurisée
        </div>
      </header>
      <div style={{marginBottom:'16px'}}>
        <BackButton />
      </div>

      <StepIndicator>
        {steps.map(s => (
          <Step key={s.id} active={step >= s.id}>
             <span className="num">{step > s.id ? <CheckCircle size={16} /> : s.id}</span>
             <span className="label text-xs sm:text-xs">{s.title}</span>
          </Step>
        ))}
      </StepIndicator>

      <FormCard>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <FormStep key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2>Identité de votre entreprise</h2>
              <FormGroup>
                <label>Nom de la future société</label>
                <input 
                  type="text" 
                  placeholder="Ex: KINSHASA LOGISTICS SARL" 
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  autoFocus
                />
              </FormGroup>
              <FormGrid>
                <FormGroup>
                  <label>Forme Juridique</label>
                  <select 
                    value={formData.legalForm}
                    onChange={e => setFormData({...formData, legalForm: e.target.value})}
                  >
                    <option value="SARL">SARL (Responsabilité limitée)</option>
                    <option value="SAS">SAS</option>
                    <option value="SA">SA</option>
                    <option value="SNC">SNC</option>
                    <option value="SCS">SCS</option>
                    <option value="EI">Entreprise Individuelle</option>
                    <option value="Cooperative">Coopérative</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Siège Social (Ville)</label>
                  <select 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  >
                    <option value="Kinshasa">Kinshasa</option>
                    <option value="Lubumbashi">Lubumbashi</option>
                    <option value="Goma">Goma</option>
                    <option value="Autre">Autre</option>
                  </select>
                </FormGroup>
              </FormGrid>
              <InfoBox>
                <Info size={18} color="#0369A1" />
                <p>90% des entrepreneurs en RDC choisissent la <strong>SARL</strong> pour protéger leur patrimoine personnel.</p>
              </InfoBox>
            </FormStep>
          )}

          {step === 2 && (
            <FormStep key="step2">
              <h2>Décrivez votre activité</h2>
              <p style={{color: '#6B7280', marginBottom: '20px'}}>Notre IA va transformer votre description en un objet social juridique conforme au droit OHADA en vigueur en RDC.</p>
              <FormGroup>
                <label>Que va faire votre entreprise ?</label>
                <textarea 
                  placeholder="Ex: Je veux ouvrir une boulangerie artisanale et faire de la livraison à domicile..." 
                  value={formData.activityDescription}
                  onChange={e => setFormData({...formData, activityDescription: e.target.value})}
                  style={{height: '140px'}}
                />
                <Button 
                   variant="secondary" 
                  fullWidth
                  onClick={generateAIObject} 
                  disabled={isGenerating || !formData.activityDescription}
                  style={{marginTop: '20px'}}
                >
                  <BrainCircuit size={20} style={{marginRight: '10px'}} />
                  {isGenerating ? "Le Cerveau IA travaille..." : "Générer mes statuts par IA"}
                </Button>
              </FormGroup>
            </FormStep>
          )}

          {step === 3 && (
             <FormStep key="step3">
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h2>Aperçu juridique</h2>
                  <span style={{background: '#EEF2FF', color: '#4F46E5', padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 800}}>OHADA COMPLIANT</span>
               </div>
               <PreviewBox>
                  <div className="watermark">BROUILLON</div>
                  <pre>{formData.socialObject || "Veuillez générer l'objet social à l'étape précédente."}</pre>
               </PreviewBox>
               <TrustBanner>
                  <UserCheck size={20} color="#059669" />
                  <span>Dossier vérifié par nos formalistes inscrits au barreau après paiement</span>
               </TrustBanner>
             </FormStep>
          )}

          {step === 4 && (
             <FormStep key="step4">
               <h2>Choisissez votre Pack de création</h2>
               <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px'}}>
                  {[
                    {code: 'ESSENTIEL', label: 'Essentiel', desc: 'Statuts certifi\u00e9s + Dossier GUCE pr\u00eat à imprimer', price: '249$'},
                    {code: 'CONFORT', label: 'Confort', desc: 'Essentiel + D\u00e9p\u00f4t physique par nos agents + Retrait RCCM', price: '349$'},
                    {code: 'PREMIUM', label: 'Premium', desc: 'Gestion Totale + NIF + Conseil Juridique + Domiciliation 1 mois', price: '569$'},
                  ].map(p => (
                    <PackCard 
                      key={p.code} 
                      selected={formData.pack === p.code}
                      onClick={() => {
                        localStorage.setItem('selectedPack', p.code);
                        setFormData({...formData, pack: p.code as typeof formData.pack});
                      }}
                    >
                      <div className="pack-info">
                         <h3>{p.label}</h3>
                         <p>{p.desc}</p>
                      </div>
                      <div className="price">{p.price}</div>
                      {formData.pack === p.code && <CheckCircle size={24} color="#2CC4C0" className="check" />}
                    </PackCard>
                  ))}
               </div>
             </FormStep>
          )}
        </AnimatePresence>

        <Actions>
          {step > 1 && <Button variant="ghost" onClick={handleBack}><ArrowLeft size={18} /> Retour</Button>}
          {step < 4 ? (
            <Button 
              variant="secondary" 
              style={{marginLeft: 'auto'}} 
              onClick={handleNext}
              disabled={step === 1 && !formData.companyName}
            >
              Continuer <ArrowRight size={18} />
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              style={{marginLeft: 'auto'}} 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création en cours..." : "Valider et Payer via Stripe"}
            </Button>
          )}
        </Actions>
      </FormCard>
    </PageContainer>
  );
};

// --- STYLES ---

const PageContainer = styled.div`
  max-width: 900px; 
  margin: 0 auto; 
  padding: 40px 20px 100px; 
  font-family: 'Barlow', sans-serif;
  min-height: 100vh;
`;

const StepIndicator = styled.div`display: flex; justify-content: space-between; margin-bottom: 40px; background: #F9FAFB; padding: 20px; border-radius: 12px;`;

const Step = styled.div<{ active: boolean }>`
  display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: ${p => p.active ? 1 : 0.3};
  .num { width: 28px; height: 28px; border-radius: 50%; background: #0d1d45; color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; }
  .label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
`;

const FormCard = styled.div`background: white; padding: 48px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid #F3F4F6;`;

const FormStep = styled(motion.div)`
  h2 { font-size: 28px; font-family: 'Barlow Condensed'; font-weight: 900; margin-bottom: 12px; color: #0d1d45; text-transform: uppercase; }
  p { color: #6B7280; font-size: 16px; }
`;

const FormGroup = styled.div`
  margin-top: 24px;
  label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 8px; color: #374151; }
  input, select, textarea { 
    width: 100%; padding: 14px; border: 1.5px solid #E5E7EB; border-radius: 10px; outline: none; transition: 0.2s; font-size: 15px;
    &:focus { border-color: #2cbab8; box-shadow: 0 0 0 4px rgba(44, 186, 184, 0.1); }
  }
`;

const InfoBox = styled.div`
  margin-top: 24px; background: #F0F9FF; border: 1px solid #B9E6FE; padding: 16px; border-radius: 12px; display: flex; gap: 12px;
  p { font-size: 14px; color: #0369A1; line-height: 1.4; }
`;

const PreviewBox = styled.div`
  margin-top: 24px; background: #F9FAFB; border: 2px dashed #D1D5DB; padding: 30px; border-radius: 12px; position: relative; max-height: 300px; overflow-y: auto;
  pre { white-space: pre-wrap; font-size: 13px; color: #374151; line-height: 1.6; font-family: 'Courier New', monospace; }
  .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 60px; font-weight: 900; color: rgba(0,0,0,0.03); pointer-events: none; }
`;

const TrustBanner = styled.div`
  margin-top: 20px; display: flex; align-items: center; gap: 10px; color: #059669; font-size: 14px; font-weight: 700;
`;

const PackCard = styled.div<{ selected: boolean }>`
  display: flex; justify-content: space-between; align-items: center; padding: 24px; border-radius: 16px; 
  border: 2px solid ${p => p.selected ? '#2cbab8' : '#F3F4F6'};
  background: ${p => p.selected ? 'rgba(44, 186, 184, 0.03)' : 'white'};
  cursor: pointer; position: relative; transition: 0.2s;
  &:hover { border-color: #2cbab8; }
  .pack-info { flex: 1; h3 { font-size: 18px; color: #0d1d45; margin-bottom: 4px; } p { font-size: 13px; color: #6B7280; max-width: 400px; } }
  .price { font-size: 24px; font-weight: 900; color: #0d1d45; margin-right: 40px; }
  .check { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); }
`;

const Actions = styled.div`
  display: flex; 
  justify-content: space-between;
  margin-top: 48px; 
  border-top: 1px solid #F3F4F6; 
  padding-top: 32px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

export default QuestionnairePage;
