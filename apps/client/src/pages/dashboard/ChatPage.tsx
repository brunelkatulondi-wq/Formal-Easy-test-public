// apps/client/src/pages/dashboard/ChatPage.tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { MessageSquare, Send, User, Search, Phone, MoreVertical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const ChatPage = () => {
  const { user } = useAuth();
  const [selectedDossier, setSelectedDossier] = React.useState<any>(null);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputText, setInputText] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Charger les dossiers (conversations)
  const { data: dossiers, isLoading: loadingDossiers } = useQuery({
    queryKey: ['chat-dossiers'],
    queryFn: async () => {
      const url = user?.role === 'ADMIN' || user?.role === 'GERANT' ? '/api/admin/dossiers' : '/api/dossiers/me';
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      return data;
    },
    enabled: !!user
  });

  // Charger les messages du dossier sélectionné
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedDossier) return;
      try {
        const { data } = await axios.get(`/api/chat/${selectedDossier.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setMessages(data);
      } catch (err) {
        console.error("Erreur chargement messages", err);
      }
    };
    fetchMessages();
  }, [selectedDossier]);

  // Socket.io
  useEffect(() => {
    if (!selectedDossier) return;
    // @ts-ignore
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
    socket.emit('join-dossier', selectedDossier.id);

    socket.on('event', (data: any) => {
      if (data.type === 'NEW_MESSAGE') {
        setMessages(prev => [...prev, data.message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedDossier]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedDossier) return;
    try {
      await axios.post('/api/chat', {
        dossierId: selectedDossier.id,
        content: inputText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setInputText('');
    } catch (err) {
      toast.error("Échec de l'envoi");
    }
  };

  return (
    <DashboardLayout>
      <Header>
        <Title>Messagerie Directe</Title>
        <Subtitle>Échangez en temps réel avec nos formalistes et votre agent terrain assigné.</Subtitle>
      </Header>

      <ChatContainer>
        <Sidebar>
          <SearchWrapper>
            <Search size={16} />
            <input type="text" placeholder="Rechercher un dossier..." />
          </SearchWrapper>
          <ContactList>
            {loadingDossiers ? (
              <div style={{padding: '20px', textAlign: 'center', color: '#9CA3AF'}}>Chargement...</div>
            ) : dossiers?.length === 0 ? (
              <div style={{padding: '20px', textAlign: 'center', color: '#9CA3AF'}}>Aucun dossier actif.</div>
            ) : dossiers?.map((d: any) => (
              <ContactItem 
                key={d.id} 
                active={selectedDossier?.id === d.id}
                onClick={() => setSelectedDossier(d)}
              >
                <Avatar>{d.companyName[0]}</Avatar>
                <ContactInfo>
                  <div className="name">{d.companyName}</div>
                  <div className="msg">{d.reference} • {d.status}</div>
                </ContactInfo>
              </ContactItem>
            ))}
          </ContactList>
        </Sidebar>

        <MainChat>
          {selectedDossier ? (
            <>
              <ChatHeader>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <Avatar>{selectedDossier.companyName[0]}</Avatar>
                  <div>
                    <ChatName>{selectedDossier.companyName}</ChatName>
                    <Status>Réf: {selectedDossier.reference} • En ligne</Status>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <IconButton title="Appeler (bientôt disponible)"><Phone size={20} /></IconButton>
                  <IconButton><MoreVertical size={20} /></IconButton>
                </div>
              </ChatHeader>

              <MessagesArea>
                 {messages.length === 0 ? (
                   <div style={{textAlign: 'center', marginTop: '40px', color: '#9CA3AF'}}>
                     Début de la conversation pour {selectedDossier.companyName}.
                   </div>
                 ) : messages.map((msg) => (
                   <Message key={msg.id} sent={msg.userId === user?.id}>
                      <div className="bubble">{msg.content}</div>
                      <div className="time">
                        {msg.user?.name} • {new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                   </Message>
                 ))}
                 <div ref={messagesEndRef} />
              </MessagesArea>

              <ChatInput>
                 <input 
                   type="text" 
                   placeholder="Écrivez votre message ici..." 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                 />
                 <Button variant="secondary" size="md" onClick={handleSend}><Send size={18} /></Button>
              </ChatInput>
            </>
          ) : (
            <EmptyChat>
              <MessageSquare size={48} />
              <h3>Sélectionnez une conversation</h3>
              <p>Choisissez un dossier dans la liste à gauche pour discuter avec un expert.</p>
            </EmptyChat>
          )}
        </MainChat>
      </ChatContainer>
    </DashboardLayout>
  );
};

// Styles
const Header = styled.div`margin-bottom: 32px;`;
const Title = styled.h1`font-family: 'Barlow Condensed'; font-size: 32px; font-weight: 900; color: #0D1D45; text-transform: uppercase;`;
const Subtitle = styled.p`color: #6B7280; font-size: 16px;`;

const ChatContainer = styled(Card)`
  display: grid; grid-template-columns: 320px 1fr; padding: 0; overflow: hidden; height: calc(100vh - 250px);
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const Sidebar = styled.div`border-right: 1px solid #F3F4F6; display: flex; flex-direction: column;`;
const SearchWrapper = styled.div`
  padding: 20px; border-bottom: 1px solid #F3F4F6; position: relative; display: flex; align-items: center; color: #9CA3AF;
  svg { position: absolute; left: 32px; }
  input { width: 100%; padding: 10px 10px 10px 42px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; outline: none; font-size: 14px; }
`;

const ContactList = styled.div`flex: 1; overflow-y: auto;`;
const ContactItem = styled.div<{active?: boolean}>`
  display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; border-bottom: 1px solid #F9FAFB;
  background: ${p => p.active ? 'rgba(44, 196, 192, 0.05)' : 'white'};
  &:hover { background: #F9FAFB; }
`;

const Avatar = styled.div`width: 40px; height: 40px; border-radius: 50%; background: #2CC4C0; color: #0D1D45; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; flex-shrink: 0;`;

const ContactInfo = styled.div`
  flex: 1; min-width: 0;
  .name { font-weight: 700; color: #0D1D45; font-size: 14px; margin-bottom: 2px; }
  .msg { font-size: 12px; color: #6B7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;
const Time = styled.div`font-size: 10px; color: #9CA3AF; font-weight: 600;`;

const MainChat = styled.div`display: flex; flex-direction: column; background: #F9FAFB;`;
const ChatHeader = styled.div`padding: 16px 24px; background: white; border-bottom: 1px solid #F3F4F6; display: flex; justify-content: space-between; align-items: center;`;
const ChatName = styled.div`font-weight: 800; color: #0D1D45; font-size: 16px;`;
const Status = styled.div`font-size: 11px; color: #059669; font-weight: 700;`;
const IconButton = styled.button`background: none; border: none; color: #6B7280; cursor: pointer; &:hover { color: #0D1D45; }`;

const MessagesArea = styled.div`flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;`;

const Message = styled.div<{sent: boolean}>`
  align-self: ${p => p.sent ? 'flex-end' : 'flex-start'}; max-width: 70%;
  .bubble { 
     padding: 12px 16px; border-radius: 12px; font-size: 14px; line-height: 1.5;
     background: ${p => p.sent ? '#0D1D45' : 'white'}; 
     color: ${p => p.sent ? 'white' : '#0D1D45'};
     box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .time { font-size: 10px; color: #9CA3AF; margin-top: 4px; text-align: ${p => p.sent ? 'right' : 'left'}; font-weight: 600; }
`;

const ChatInput = styled.div`padding: 20px; background: white; border-top: 1px solid #F3F4F6; display: flex; gap: 12px; input { flex: 1; padding: 12px 16px; border-radius: 10px; border: 1px solid #E5E7EB; outline: none; &:focus { border-color: #2CC4C0; } }`;

const EmptyChat = styled.div`
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; color: #9CA3AF; text-align: center;
  svg { margin-bottom: 20px; opacity: 0.2; color: #0D1D45; }
  h3 { font-family: 'Barlow Condensed'; font-size: 24px; font-weight: 800; color: #0D1D45; margin-bottom: 8px; text-transform: uppercase; }
  p { font-size: 14px; max-width: 300px; }
`;

export default ChatPage;
