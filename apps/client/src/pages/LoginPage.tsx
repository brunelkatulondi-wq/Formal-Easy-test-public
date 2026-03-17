// apps/client/src/pages/LoginPage.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const user = await login(data.email, data.password);
      toast.success("Bon retour parmi nous !");
      
      if (user.role === 'ADMIN' || user.role === 'GERANT') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error("Identifiants incorrects");
    }
  };

  return (
    <Container>
      <Card>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
           <Logo size={24} />
        </div>
        <Title>Bon retour</Title>
        <Subtitle>Accédez à votre espace sécurisé pour suivre vos dossiers.</Subtitle>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Email professionnel</Label>
            <InputWrapper>
               <Mail size={18} color="#9CA3AF" />
               <input {...register('email')} placeholder="jean@test.com" type="email" required />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Mot de passe</Label>
            <InputWrapper>
               <Lock size={18} color="#9CA3AF" />
               <input type="password" {...register('password')} placeholder="••••••••" required />
            </InputWrapper>
          </FormGroup>

          <Button type="submit" variant="secondary" fullWidth disabled={isSubmitting} style={{marginTop: '10px'}}>
            {isSubmitting ? "Connexion..." : "Se connecter →"}
          </Button>

          <FooterText>
            Pas encore de compte ? <Link to="/signup">Créer une entreprise</Link>
          </FooterText>
        </Form>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0D1D45;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 48px;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  color: #0D1D45;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 13px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  background: #F9FAFB;
  transition: 0.2s;
  input { border: none; background: transparent; outline: none; width: 100%; font-size: 15px; }
  &:focus-within {
    border-color: #2CC4C0;
    background: white;
    box-shadow: 0 0 0 4px rgba(44, 186, 184, 0.1);
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6B7280;
  a { color: #2CC4C0; font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } }
`;

export default LoginPage;
