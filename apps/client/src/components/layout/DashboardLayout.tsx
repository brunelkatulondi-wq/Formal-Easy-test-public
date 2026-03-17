// apps/client/src/components/layout/DashboardLayout.tsx
import React from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  ShieldCheck, 
  MessageSquare, 
  Settings, 
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../ui/Logo';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'GERANT';

  const menuItems = isAdmin ? [
    { label: 'Pipeline Admin', icon: LayoutDashboard, path: '/admin' },
    { label: 'Utilisateurs', icon: User, path: '/admin/users' },
    { label: 'Coffre-Fort', icon: ShieldCheck, path: '/dashboard/vault' },
    { label: 'Messagerie', icon: MessageSquare, path: '/dashboard/chat' },
    { label: 'Mon Profil', icon: User, path: '/dashboard/profile' },
  ] : [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Coffre-Fort', icon: ShieldCheck, path: '/dashboard/vault' },
    { label: 'Messagerie', icon: MessageSquare, path: '/dashboard/chat' },
    { label: 'Mon Profil', icon: User, path: '/dashboard/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container>
      {/* Sidebar Desktop */}
      <Sidebar>
        <SidebarHeader>
          <Logo size={20} />
        </SidebarHeader>
        
        <Nav>
          {menuItems.map((item) => (
            <NavItem 
              key={item.path} 
              to={item.path} 
              active={location.pathname === item.path ? 1 : 0}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavItem>
          ))}
        </Nav>

        <SidebarFooter>
          <UserBrief>
            <Avatar>{user?.name?.[0] || 'U'}</Avatar>
            <UserInfo>
              <UserName>{user?.name}</UserName>
              <UserRole>{user?.role}</UserRole>
            </UserInfo>
          </UserBrief>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

      <MainContent>
        <TopBar>
          <MobileMenuToggle onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </MobileMenuToggle>
          <PageIndicator>FormalEasy DRC / {menuItems.find(i => i.path === location.pathname)?.label}</PageIndicator>
        </TopBar>
        
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <MobileOverlay onClick={() => setIsMobileMenuOpen(false)}>
          <MobileSidebar onClick={e => e.stopPropagation()}>
            <X size={24} className="close" onClick={() => setIsMobileMenuOpen(false)} />
            <div style={{marginBottom: '40px'}}><Logo size={20} /></div>
            {menuItems.map((item) => (
              <NavItem 
                key={item.path} 
                to={item.path} 
                active={location.pathname === item.path ? 1 : 0}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavItem>
            ))}
            <LogoutButtonMobile onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>
              <LogOut size={18} />
              <span>Déconnexion</span>
            </LogoutButtonMobile>
          </MobileSidebar>
        </MobileOverlay>
      )}
    </Container>
  );
};

// Styles
const Container = styled.div`display: flex; min-height: 100vh; background: #F9FAFB;`;

const Sidebar = styled.aside`
  width: 260px; background: #0D1D45; color: white; display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
  @media (max-width: 1024px) { display: none; }
`;

const SidebarHeader = styled.div`padding: 30px; border-bottom: 1px solid rgba(255,255,255,0.05);`;

const Nav = styled.nav`flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 8px;`;

const NavItem = styled(Link)<{ active: number }>`
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px;
  text-decoration: none; color: ${p => p.active ? 'white' : '#9CA3AF'};
  background: ${p => p.active ? '#2CC4C0' : 'transparent'};
  font-weight: 600; font-size: 14px; transition: 0.2s;
  &:hover { background: ${p => p.active ? '#2CC4C0' : 'rgba(255,255,255,0.05)'}; color: white; }
`;

const SidebarFooter = styled.div`padding: 20px; border-top: 1px solid rgba(255,255,255,0.05);`;

const UserBrief = styled.div`display: flex; align-items: center; gap: 12px; margin-bottom: 20px;`;
const Avatar = styled.div`width: 36px; height: 36px; border-radius: 50%; background: #2CC4C0; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; color: #0D1D45;`;
const UserInfo = styled.div`display: flex; flex-direction: column;`;
const UserName = styled.span`font-size: 14px; font-weight: 700; color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;`;
const UserRole = styled.span`font-size: 10px; font-weight: 800; color: #2CC4C0; text-transform: uppercase; letter-spacing: 1px;`;

const LogoutButton = styled.button`
  width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none;
  background: transparent; color: #FF4D4D; cursor: pointer; border-radius: 10px;
  font-weight: 600; font-size: 14px; transition: 0.2s;
  &:hover { background: rgba(255, 77, 77, 0.1); }
`;

const MainContent = styled.main`flex: 1; display: flex; flex-direction: column;`;

const TopBar = styled.header`
  height: 70px; background: white; border-bottom: 1px solid #F3F4F6;
  display: flex; align-items: center; padding: 0 40px; justify-content: space-between;
`;

const MobileMenuToggle = styled.button`display: none; background: none; border: none; color: #0D1D45; @media (max-width: 1024px) { display: block; }`;
const PageIndicator = styled.div`font-size: 13px; font-weight: 700; color: #6B7280; text-transform: uppercase; letter-spacing: 1px;`;

const ContentArea = styled.div`padding: 40px; flex: 1; @media (max-width: 768px) { padding: 20px; }`;

const MobileOverlay = styled.div`position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2000;`;
const MobileSidebar = styled.div`
  width: 280px; height: 100%; background: #0D1D45; padding: 40px 20px; display: flex; flex-direction: column; position: relative;
  .close { position: absolute; top: 20px; right: 20px; color: white; cursor: pointer; }
`;

const LogoutButtonMobile = styled.button`
  margin-top: auto;
  display: flex; align-items: center; gap: 10px; padding: 12px 14px;
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  background: rgba(255, 77, 77, 0.1); color: #FFB3B3; font-weight: 700;
  cursor: pointer; transition: 0.2s;
  &:hover { background: rgba(255, 77, 77, 0.2); }
`;

export default DashboardLayout;
