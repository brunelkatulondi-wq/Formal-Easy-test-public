import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowLeft, Download, Clock, Send, ShieldCheck, MessageCircle, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, X } from 'lucide-react';
import { CheckCircle, AlertCircle, Clock as ClockIcon } from 'lucide-react';

const DossierDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'GERANT';

  const [chatMessages, setChatMessages] = React.useState<any[]>([]);
  const [inputText, setInputText] = React.useState('');
  const [showSignModal, setShowSignModal] = React.useState(false);
  const [signatureName, setSignatureName] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { data: dossier, refetch } = useQuery({
    queryKey: ['dossier', id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/dossiers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      return data;
    }
  });

  // Charger les messages initiaux
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/chat/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setChatMessages(data);
      } catch (err) {
        console.error("Erreur chargement messages", err);
      }
    };
    if (id) fetchMessages();
  }, [id]);

  useEffect(() => {
    // @ts-ignore
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
    socket.emit('join-dossier', id);

    socket.on('event', (data) => {
      console.log('Real-time event received:', data);
      if (data.type === 'NEW_MESSAGE') {
        setChatMessages(prev => [...prev, data.message]);
      } else {
        refetch();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, refetch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    try {
      const { data } = await axios.post('/api/chat', {
        dossierId: id,
        content: inputText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      // Le message est déjà ajouté via Socket.io mais on peut l'anticiper si besoin
      // Ici on attend le socket pour éviter les doublons
      setInputText('');
    } catch (err) {
      toast.error("Échec de l'envoi");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/dossiers/${id}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${dossier.reference}_statuts.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      toast.error("Erreur lors du téléchargement.");
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      await axios.patch(`/api/admin/dossier/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      toast.success("Statut mis à jour !");
      refetch();
    } catch (e) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const handleSign = async () => {
    if (!signatureName.trim()) return;
    try {
      // Simulation d'appel API pour la signature
      await axios.post(`/api/dossiers/${id}/sign`, { signature: signatureName }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      toast.success("Documents signés électroniquement !");
      setShowSignModal(false);
      refetch();
    } catch (e) {
      toast.error("Erreur lors de la signature.");
    }
  };

  const addOfficialDocument = async (name: string, url: string) => {
    try {
      await axios.post(`/api/admin/dossier/${id}/documents`, { name, url }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      toast.success("Document ajouté !");
      refetch();
    } catch (e) {
      toast.error("Erreur lors de l'ajout.");
    }
  };

  if (!dossier) return <Loading>Chargement du dossier...</Loading>;

  const checklist = [
    { label: 'Statuts générés', done: Boolean(dossier.socialObject || dossier.activityDescription) },
    { label: 'Pièces d’identité / K-bis associés', done: dossier.documents?.length > 0 },
    { label: 'Paiement pack', done: dossier.status !== 'DRAFT' },
    { label: 'Signature client', done: dossier.status === 'SIGNED_BY_CLIENT' || dossier.status === 'READY_FOR_SIGNATURE' },
    { label: 'Dépôt GUCE', done: dossier.status === 'GUCE_DEPOSIT' || dossier.status === 'DONE' },
    { label: 'RCCM & NIF récupérés', done: dossier.documents?.some((d: any) => d.name?.toLowerCase().includes('rccm') || d.name?.toLowerCase().includes('nif')) || dossier.status === 'DONE' },
  ];

  const statusFlow = [
    { code: 'DRAFT', label: 'Brouillon', desc: 'Questionnaire terminé, en attente paiement.' },
    { code: 'PAY_PENDING', label: 'Paiement confirmé', desc: 'Votre paiement est validé, préparation des statuts.' },
    { code: 'READY_FOR_SIGNATURE', label: 'Signature requise', desc: 'Statuts prêts à être signés en ligne.' },
    { code: 'SIGNED_BY_CLIENT', label: 'Signé', desc: 'Documents signés, dépôt en cours.' },
    { code: 'GUCE_DEPOSIT', label: 'Dépôt GUCE', desc: 'Dossier déposé, en attente validation GUCE.' },
    { code: 'DONE', label: 'Terminé', desc: 'RCCM/NIF remis dans votre coffre-fort.' },
  ];
  const currentIndex = Math.max(0, statusFlow.findIndex(s => s.code === dossier.status));

  return (
    <DashboardLayout>
      <Header>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
          <div>
             <Ref>{dossier.reference}</Ref>
             <Title>{dossier.companyName}</Title>
          </div>
          <Badge type="info" style={{padding: '8px 16px', fontSize: '14px', borderRadius: '100px'}}>{dossier.status.replace(/_/g, ' ')}</Badge>
        </div>
      </Header>

      {!isAdmin && (dossier.status === 'PAY_PENDING' || dossier.status === 'READY_FOR_SIGNATURE') && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'linear-gradient(135deg, #0D1D45 0%, #1a3a8a 100%)', 
            color: 'white', 
            padding: '24px', 
            borderRadius: '16px', 
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 10px 25px rgba(13, 29, 69, 0.2)'
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'Barlow Condensed', fontSize: '22px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
              ✍️ Signature requise
            </h3>
            <p style={{ opacity: 0.8, fontSize: '14px' }}>Vos statuts sont prêts. Veuillez les signer électroniquement pour lancer le dépôt au GUCE.</p>
          </div>
          <Button variant="secondary" onClick={() => setShowSignModal(true)} style={{ boxShadow: '0 4px 12px rgba(44, 196, 192, 0.3)' }}>
            Signer maintenant
          </Button>
        </motion.div>
      )}

        <Grid>
          <Main>
            <Card>
              <CardTitle>📁 Documents Officiels</CardTitle>
              <p style={{marginBottom: '20px', color: '#6B7280', fontSize: '14px'}}>Vos documents certifiés conformes au droit OHADA.</p>
            <DocList>
               <DocItem>
                 <div style={{display: 'flex', alignItems: 'center'}}>
                    <FileIcon><FileText size={20} /></FileIcon>
                    <div>
                      <DocName>Statuts Finalisés</DocName>
                      <DocMeta>Validé par nos experts • {dossier.legalForm}</DocMeta>
                    </div>
                 </div>
                 <Button variant="outline" size="sm" onClick={handleDownload} title="Télécharger">
                   <Download size={16} />
                 </Button>
               </DocItem>
               
               {dossier.documents?.map((doc: any) => (
                 <DocItem key={doc.id}>
                   <div style={{display: 'flex', alignItems: 'center'}}>
                      <FileIcon><ShieldCheck size={20} /></FileIcon>
                      <div>
                        <DocName>{doc.name}</DocName>
                        <DocMeta>Transmis le {new Date(doc.createdAt).toLocaleDateString()}</DocMeta>
                      </div>
                   </div>
                   <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')} title="Télécharger">
                     <Download size={16} />
                   </Button>
                 </DocItem>
               ))}

               {(!dossier.documents || dossier.documents.length === 0) && dossier.status !== 'DONE' && (
                 <DocItem style={{opacity: 0.5}}>
                   <div style={{display: 'flex', alignItems: 'center'}}>
                      <FileIcon><ShieldCheck size={20} /></FileIcon>
                      <div>
                        <DocName>RCCM & NIF</DocName>
                        <DocMeta>En attente du GUCE</DocMeta>
                      </div>
                   </div>
                   <Badge style={{background: '#E5E7EB', color: '#6B7280'}}>Indisponible</Badge>
                 </DocItem>
               )}
            </DocList>
          </Card>

          <Card style={{marginTop: '24px', padding: 0, overflow: 'hidden'}}>
            <CardTitle style={{padding: '24px 24px 0 24px'}}>💬 Messagerie Expert</CardTitle>
            <ChatContainer>
                <Messages>
                    {chatMessages.length === 0 ? (
                      <div style={{textAlign: 'center', padding: '20px', color: '#9CA3AF', fontSize: '13px'}}>
                        Aucun message. Posez votre première question ici.
                      </div>
                    ) : chatMessages.map((msg) => (
                      <Msg key={msg.id} sent={msg.userId === user?.id}>
                        <div className="bubble">{msg.content}</div>
                        <div className="time">
                          {msg.user?.name} • {new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </Msg>
                    ))}
                    <div ref={messagesEndRef} />
                </Messages>
                <ChatInput>
                   <input 
                     type="text" 
                     placeholder="Posez une question à votre formaliste..." 
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                   />
                   <Button variant="secondary" size="sm" style={{height: '38px'}} onClick={handleSendMessage}><Send size={16} /></Button>
                </ChatInput>
            </ChatContainer>
          </Card>

          <Card style={{marginTop: '24px'}}>
            <CardTitle>✅ Checklist dossier</CardTitle>
            <Checklist>
              {checklist.map((item, idx) => (
                <li key={idx}>
                  {item.done ? <CheckCircle size={16} color="#10b981" /> : <AlertCircle size={16} color="#f59e0b" />}
                  <span className={item.done ? 'done' : ''}>{item.label}</span>
                </li>
              ))}
            </Checklist>
            <Note>Cette checklist est indicative ; les étapes peuvent varier selon votre forme juridique.</Note>
          </Card>
        </Main>

        <Sidebar>
          <Card>
            <CardTitle>📍 Suivi en Temps Réel</CardTitle>
            <Timeline>
              {dossier.events?.map((event: any, index: number) => (
                <TimelineItem key={event.id} isLast={index === dossier.events.length - 1}>
                  <Dot active={true} />
                  <TimelineContent>
                    <TimeLabel>{new Date(event.createdAt).toLocaleDateString()} {new Date(event.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</TimeLabel>
                    <EventLabel>{event.type.replace(/_/g, ' ')}</EventLabel>
                  </TimelineContent>
                </TimelineItem>
              ))}
              {dossier.status !== 'DONE' && (
                <TimelineItem isLast={true}>
                  <Dot active={false} />
                  <TimelineContent>
                    <TimeLabel>Prochaine étape</TimeLabel>
                    <EventLabel style={{opacity: 0.5}}>Validation Finale GUCE</EventLabel>
                  </TimelineContent>
                </TimelineItem>
              )}
            </Timeline>
          </Card>

          <Card>
            <CardTitle>🧭 Étapes prévues</CardTitle>
            <Checklist>
              {statusFlow.map((step, idx) => (
                <li key={step.code}>
                  {idx <= currentIndex ? <CheckCircle size={16} color="#10b981" /> : <ClockIcon size={16} color="#f59e0b" />}
                  <div>
                    <div className={idx <= currentIndex ? 'done' : ''}>{step.label}</div>
                    <small>{step.desc}</small>
                  </div>
                </li>
              ))}
            </Checklist>
            <Note>Les délais peuvent varier selon le GUCE et la complétude de vos pièces.</Note>
          </Card>
          
          <ActionBox>
            <h4>Informations Dossier</h4>
            <div className="row"><span>Forme :</span> <strong>{dossier.legalForm}</strong></div>
            <div className="row"><span>Capital :</span> <strong>{dossier.capital} $</strong></div>
            <div className="row"><span>Siège :</span> <strong>{dossier.city || 'Kinshasa'}</strong></div>
          </ActionBox>

          {isAdmin && (
            <Card style={{marginTop: '24px', border: '1px solid #FEE2E2', background: '#FEF2F2'}}>
              <CardTitle style={{fontSize: '18px', color: '#991B1B'}}>🛠️ Actions Admin</CardTitle>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <p style={{fontSize: '12px', color: '#B91C1C', fontWeight: 600, marginBottom: '8px'}}>Mettez à jour l'avancement du dossier pour informer le client en temps réel.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => updateStatus('GUCE_DEPOSIT')}
                  style={{borderColor: '#F87171', color: '#B91C1C'}}
                >
                  Marquer comme Déposé au GUCE
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => updateStatus('DONE')}
                >
                  Finaliser le dossier (Terminé)
                </Button>

                <div style={{marginTop: '16px', borderTop: '1px solid rgba(185, 28, 28, 0.1)', paddingTop: '16px'}}>
                  <p style={{fontSize: '11px', color: '#B91C1C', fontWeight: 600, marginBottom: '8px'}}>AJOUTER DOCUMENTS OFFICIELS</p>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addOfficialDocument("RCCM Certifié", "https://formaleasy.cd/docs/placeholder_rccm.pdf")}
                      style={{borderColor: '#F87171', color: '#B91C1C', fontSize: '10px', flex: 1}}
                    >
                      + RCCM
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addOfficialDocument("NIF Certifié", "https://formaleasy.cd/docs/placeholder_nif.pdf")}
                      style={{borderColor: '#F87171', color: '#B91C1C', fontSize: '10px', flex: 1}}
                    >
                      + NIF
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Sidebar>
      </Grid>

      <AnimatePresence>
        {showSignModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-card"
            >
               <div className="modal-header">
                  <h3>Signature Électronique Certifiée</h3>
                  <button onClick={() => setShowSignModal(false)}><X size={20} /></button>
               </div>
               <div className="modal-body">
                  <p>En tant que gérant de <strong>{dossier.companyName}</strong>, vous vous apprêtez à signer vos documents officiels.</p>
                  
                  <div className="sign-preview">
                    <div className="label">Votre signature manuscrite :</div>
                    <div className="canvas">
                       {signatureName || 'Veuillez saisir votre nom complet'}
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Saisissez votre Nom et Prénom pour signer</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Jean Mukendi" 
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                    />
                  </div>

                  <div className="legal-notice">
                    <ShieldCheck size={14} />
                    Cette signature a valeur juridique conformément aux dispositions de l'OHADA sur les documents numériques.
                  </div>
               </div>
               <div className="modal-footer">
                  <Button variant="outline" onClick={() => setShowSignModal(false)}>Annuler</Button>
                  <Button variant="secondary" onClick={handleSign} disabled={!signatureName.trim()}>Confirmer et Signer</Button>
               </div>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

// Styles
const Header = styled.header`margin-bottom: 32px;`;
const Loading = styled.div`text-align: center; padding: 100px; color: #0D1D45;`;
const Ref = styled.span`color: #2CC4C0; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;`;
const Title = styled.h1`font-family: 'Barlow Condensed'; font-size: 36px; font-weight: 900; color: #0D1D45; text-transform: uppercase; margin-top: 4px;`;
const Grid = styled.div`display: grid; grid-template-columns: 1fr 320px; gap: 32px; @media (max-width: 1024px) { grid-template-columns: 1fr; }`;
const Sidebar = styled.div`display: flex; flex-direction: column; gap: 24px;`;
const Main = styled.div``;

const Timeline = styled.div`margin-top: 10px; position: relative; padding-left: 5px;`;
const TimelineItem = styled.div<{isLast: boolean}>`
  display: flex; position: relative; padding-bottom: ${p => p.isLast ? '0' : '30px'};
  &:not(:last-child)::after { content: ''; position: absolute; left: 4px; top: 12px; bottom: -8px; width: 2px; background: #E5E7EB; }
`;
const Dot = styled.div<{active: boolean}>`width: 10px; height: 10px; border-radius: 50%; background: ${p => p.active ? '#2CC4C0' : '#E5E7EB'}; z-index: 1; border: 2px solid white; box-shadow: 0 0 0 2px ${p => p.active ? 'rgba(44, 196, 192, 0.2)' : 'transparent'};`;
const TimelineContent = styled.div`margin-left: 20px;`;
const TimeLabel = styled.div`font-size: 10px; font-weight: 700; color: #9CA3AF; text-transform: uppercase; margin-bottom: 2px;`;
const EventLabel = styled.div`font-size: 13px; font-weight: 700; color: #0D1D45;`;

const DocList = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const DocItem = styled.div`display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #F9FAFB; border-radius: 12px; border: 1px solid #F3F4F6; transition: 0.2s; &:hover { border-color: #2CC4C0; }`;
const DocName = styled.div`font-weight: 800; font-size: 14px; color: #0D1D45;`;
const DocMeta = styled.div`font-size: 11px; color: #6B7280;`;
const FileIcon = styled.div`width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 16px; color: #0D1D45; box-shadow: 0 4px 6px rgba(0,0,0,0.05);`;

const ChatContainer = styled.div`background: #F9FAFB; border-top: 1px solid #F3F4F6;`;
const Messages = styled.div`padding: 20px; display: flex; flex-direction: column; gap: 12px;`;
const Msg = styled.div<{sent: boolean}>`
  align-self: ${p => p.sent ? 'flex-end' : 'flex-start'}; max-width: 80%;
  .bubble { padding: 10px 14px; border-radius: 12px; font-size: 13px; background: ${p => p.sent ? '#0D1D45' : 'white'}; color: ${p => p.sent ? 'white' : '#0D1D45'}; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .time { font-size: 10px; color: #9CA3AF; margin-top: 4px; text-align: ${p => p.sent ? 'right' : 'left'}; }
`;
const ChatInput = styled.div`padding: 16px; background: white; border-top: 1px solid #F3F4F6; display: flex; gap: 10px; input { flex: 1; border: 1px solid #E5E7EB; border-radius: 8px; padding: 0 12px; outline: none; font-size: 13px; }`;

const ActionBox = styled(Card)`
  background: #0D1D45; color: white; border: none; h4 { font-family: 'Barlow Condensed'; font-size: 18px; margin-bottom: 16px; text-transform: uppercase; color: #2CC4C0; }
  .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); span { color: #9CA3AF; } }
`;

const CardTitle = styled.h3`font-family: 'Barlow Condensed'; font-size: 20px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; color: #0D1D45; display: flex; align-items: center; gap: 10px;`;

const ModalOverlay = styled(motion.div)`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(13, 29, 69, 0.8); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
  .modal-card { background: white; width: 100%; max-width: 500px; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
  .modal-header { padding: 20px 24px; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center; h3 { font-family: 'Barlow Condensed'; font-size: 20px; text-transform: uppercase; color: #0D1D45; } button { background: none; border: none; color: #9CA3AF; cursor: pointer; transition: 0.2s; &:hover { color: #0D1D45; } } }
  .modal-body { padding: 24px; p { font-size: 14px; color: #6B7280; margin-bottom: 24px; } }
  .sign-preview { background: #F9FAFB; border: 1px dashed #D1D5DB; border-radius: 12px; padding: 30px; margin-bottom: 24px; text-align: center; .label { font-size: 11px; text-transform: uppercase; color: #9CA3AF; font-weight: 700; margin-bottom: 10px; } .canvas { font-family: 'Dancing Script', cursive; font-size: 32px; color: #0D1D45; min-height: 48px; } }
  .input-group { label { display: block; font-size: 12px; font-weight: 700; color: #0D1D45; margin-bottom: 8px; } input { width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid #E5E7EB; outline: none; transition: 0.2s; &:focus { border-color: #2CC4C0; box-shadow: 0 0 0 3px rgba(44, 196, 192, 0.1); } } }
  .legal-notice { margin-top: 20px; display: flex; gap: 8px; align-items: center; font-size: 11px; color: #059669; font-weight: 600; background: #ECFDF5; padding: 10px; border-radius: 8px; }
  .modal-footer { padding: 20px 24px; background: #F9FAFB; border-top: 1px solid #F3F4F6; display: flex; justify-content: flex-end; gap: 12px; }
`;

const Checklist = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  li { display: flex; gap: 10px; align-items: center; font-size: 14px; color: #374151; }
  .done { text-decoration: line-through; color: #9CA3AF; }
`;

const Note = styled.p`
  margin-top: 12px;
  font-size: 12px;
  color: #9CA3AF;
`;

export default DossierDetailPage;
