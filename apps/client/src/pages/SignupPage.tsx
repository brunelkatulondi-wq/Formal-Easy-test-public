// apps/client/src/pages/SignupPage.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro invalide"),
  password: z.string().min(8, "Mot de passe de 8 caractères minimum"),
});

type SignupData = z.infer<typeof schema>;

const SignupPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: SignupData) => {
    try {
      await registerUser(data);
      toast.success("Compte créé avec succès !");
      navigate('/questionnaire');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <Container>
      <Card>
        <Title>Créer votre compte</Title>
        <Subtitle>Commencez la formalisation de votre entreprise en quelques minutes.</Subtitle>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>Nom complet</Label>
            <Input {...register('name')} placeholder="Jean Kabila" hasError={!!errors.name} />
            {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input {...register('email')} placeholder="jean@test.com" hasError={!!errors.email} />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Téléphone (WhatsApp)</Label>
            <Input {...register('phone')} placeholder="+243..." hasError={!!errors.phone} />
            {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Mot de passe</Label>
            <Input type="password" {...register('password')} placeholder="••••••••" hasError={!!errors.password} />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </FormGroup>

          <Button type="submit" variant="secondary" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer mon compte →"}
          </Button>
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
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
`;

const Title = styled.h2`
  color: #0D1D45;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 32px;
  font-weight: 900;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 14px;
  color: #374151;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 12px;
  border: 2px solid ${props => props.hasError ? '#FF0000' : '#E5E7EB'};
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  &:focus {
    border-color: #2CC4C0;
  }
`;

const ErrorText = styled.span`
  color: #FF0000;
  font-size: 12px;
  font-weight: 600;
`;

export default SignupPage;
