import React from 'react';
import styled from 'styled-components';
import { MessageCircle } from 'lucide-react';

const SupportFloat = () => {
  return (
    <FloatingButton
      href="https://wa.me/243847395433?text=Bonjour%20FormalEasy"
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle size={22} />
      <div className="text">
        <strong>Support &lt; 2h</strong>
        <span>WhatsApp</span>
      </div>
    </FloatingButton>
  );
};

const FloatingButton = styled.a`
  position: fixed;
  right: 18px;
  bottom: 18px;
  background: #25d366;
  color: white;
  border-radius: 999px;
  padding: 10px 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  z-index: 5000;
  font-size: 13px;
  .text { display: flex; flex-direction: column; line-height: 1.1; }
  strong { font-size: 12px; }
  span { font-size: 11px; opacity: 0.9; }
`;

export default SupportFloat;
