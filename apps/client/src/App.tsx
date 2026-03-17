import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
const LandingPage = React.lazy(() => import('./pages/landing/LandingPage'));
const PricingPage = React.lazy(() => import('./pages/PricingPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const FAQPage = React.lazy(() => import('./pages/FAQPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const QuestionnairePage = React.lazy(() => import('./pages/QuestionnairePage'));
const PaymentSuccessPage = React.lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentCancelPage = React.lazy(() => import('./pages/PaymentCancelPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const ClientDashboard = React.lazy(() => import('./pages/dashboard/ClientDashboard'));
const DossierDetailPage = React.lazy(() => import('./pages/dashboard/DossierDetailPage'));
const AdminDashboard = React.lazy(() => import('./pages/dashboard/AdminDashboard'));
const VaultPage = React.lazy(() => import('./pages/dashboard/VaultPage'));
const ProfilePage = React.lazy(() => import('./pages/dashboard/ProfilePage'));
const ChatPage = React.lazy(() => import('./pages/dashboard/ChatPage'));
const AdminUsersPage = React.lazy(() => import('./pages/dashboard/AdminUsersPage'));
import SupportFloat from './components/SupportFloat';

// Placeholder Pages
import LoginPage from './pages/LoginPage';
import { Suspense } from 'react';
import CookieBanner from './components/CookieBanner';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, loading } = useAuth();
  
  // Affichage console pour aider au diagnostic (F12 dans le navigateur)
  React.useEffect(() => {
    if (user) {
      console.log(`[ACL] Utilisateur connecté: ${user.email}, Rôle: ${user.role}`);
      if (roles) console.log(`[ACL] Rôles autorisés pour cette route: ${roles.join(', ')}`);
    }
  }, [user, roles]);

  if (loading) return (
    <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D1D45', color: 'white', fontFamily: 'Barlow'}}>
      Chargement de votre session...
    </div>
  );
  
  if (!user) {
    console.log("[ACL] Aucun utilisateur trouvé, redirection vers /login");
    return <Navigate to="/login" />;
  }
  
  if (roles && !roles.includes(user.role)) {
    console.warn(`[ACL] Accès refusé: le rôle "${user.role}" n'est pas autorisé ici.`);
    // Si l'utilisateur est admin mais sur une page client, on redirige vers /admin au lieu de /
    if (user.role === 'ADMIN' || user.role === 'GERANT') return <Navigate to="/admin" />;
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
        <Suspense fallback={<div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0D1D45',color:'white'}}>Chargement...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route 
            path="/questionnaire" 
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <QuestionnairePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['ADMIN', 'GERANT']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/vault" 
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <VaultPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/profile" 
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/chat" 
            element={
              <ProtectedRoute roles={['CLIENT']}>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/dossier/:id" 
            element={
              <ProtectedRoute roles={['CLIENT', 'ADMIN', 'GERANT']}>
                <DossierDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        <Toaster position="top-right" />
        <SupportFloat />
        <CookieBanner />
      </BrowserRouter>
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
