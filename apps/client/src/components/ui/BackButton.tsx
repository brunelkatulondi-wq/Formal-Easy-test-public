import React from 'react';
import { ArrowLeft } from 'lucide-react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC<{ label?: string }> = ({ label = 'Retour' }) => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(-1)}>
      <ArrowLeft size={16} />
      <span>{label}</span>
    </Button>
  );
};

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #E5E7EB;
  color: #0D1D45;
  font-weight: 700;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: 0.2s;
  &:hover { border-color: #2cc4c0; color: #2cc4c0; }
`;

export default BackButton;
