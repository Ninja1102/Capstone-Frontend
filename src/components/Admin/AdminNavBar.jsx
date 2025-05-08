import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaUserCircle, FaMoon, FaSun, FaBell, FaLanguage } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHome from '../Admin/AdminHome';
import UserPage from '../Admin/UserPage';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  transition: all 0.3s ease-in-out;
  z-index: 1000;
  background: ${props => props.$theme === 'dark' ? '#333' : '#ffffff'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#000000'};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  height: 40px;
  width: auto;
`;

const LogoTitle = styled.span`
  font-size: 26px;
  font-weight: bold;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#000000'};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const NavLink = styled.div`
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#000000'};
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: ${props => props.$isActive ? '2px solid currentColor' : 'none'};
  padding-bottom: 3px;

  &:hover {
    opacity: 0.8;
  }
`;

const AdminSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const ProfileImage = styled(FaUserCircle)`
  width: 40px;
  height: 40px;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#666'};
`;

const ChevronIcon = styled(FaChevronDown)`
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#333'};
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: ${props => props.$theme === 'dark' ? '#444' : 'white'};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  min-width: 200px;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: ${props => props.$theme === 'dark' ? '#ffffff' : '#333'};
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background: ${props => props.$theme === 'dark' ? '#555' : '#f5f5f5'};
  }
`;

const SettingsSubmenu = styled.div`
  padding: 10px 0;
  border-top: 1px solid ${props => props.$theme === 'dark' ? '#555' : '#eee'};
`;

const AdminNavBar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const currentPath = window.location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('userId');
    navigate('/');
  };

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogoClick = () => {
    navigate('/admin');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const toggleNotifications = () => {
    const newNotificationState = !notifications;
    setNotifications(newNotificationState);
    toast.success(`Notifications turned ${newNotificationState ? 'on' : 'off'}`);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <>
      <Nav $scrolled={scrolled} $theme={theme}>
        <Logo onClick={handleLogoClick}>
          <LogoImage src="/src/assets/mainlogo.jpg" alt="UnitySpace Logo" />
          <LogoTitle $theme={theme}>UnitySpace</LogoTitle>
        </Logo>

        <NavLinks>
          <NavLink 
            onClick={() => {
              navigate('/admin');
              return <AdminHome />;
            }}
            $isActive={currentPath === '/admin'}
            $theme={theme}
          >
            Home
          </NavLink>
          <NavLink 
            onClick={() => navigate('/admin/events')} 
            $isActive={currentPath === '/admin/events'}
            $theme={theme}
          >
            Events
          </NavLink>
          <NavLink 
            onClick={() => {
              navigate('/admin/users');
              return <UserPage />;
            }}
            $isActive={currentPath === '/admin/users'}
            $theme={theme}
          >
            Users
          </NavLink>
          <NavLink
            onClick={() => navigate('/admin/analytics')}
            $isActive={currentPath === '/admin/analytics'}
            $theme={theme}
          >
            Analytics
          </NavLink>
          <NavLink
            onClick={() => navigate('/admin/feedback')}
            $isActive={currentPath === '/admin/feedback'}
            $theme={theme}
          >
            Feedback
          </NavLink>
        </NavLinks>

        <AdminSection onClick={handleDropdownClick}>
          <ProfileImage $theme={theme} />
          <ChevronIcon $isOpen={dropdownOpen} $theme={theme} />
          <Dropdown $isOpen={dropdownOpen} $theme={theme}>
            <DropdownItem onClick={() => navigate('/admin')} $theme={theme}>
              <FaUserCircle /> Profile
            </DropdownItem>
            {/* <SettingsSubmenu $theme={theme}>
              <DropdownItem onClick={toggleTheme} $theme={theme}>
                {theme === 'light' ? <FaMoon /> : <FaSun />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </DropdownItem>
              <DropdownItem onClick={toggleNotifications} $theme={theme}>
                <FaBell />
                Notifications {notifications ? 'On' : 'Off'}
              </DropdownItem>
              <DropdownItem onClick={toggleLanguage} $theme={theme}>
                <FaLanguage />
                Language: {language === 'en' ? 'English' : 'Español'}
              </DropdownItem>
            </SettingsSubmenu> */}
            <DropdownItem onClick={handleLogout} $theme={theme}>
              Logout
            </DropdownItem>
          </Dropdown>
        </AdminSection>
      </Nav>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AdminNavBar;
