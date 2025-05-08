import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Navigationbar = ({ theme }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Nav theme={theme}>
      <LogoContainer onClick={handleLogoClick}>
        <LogoImage src="/src/assets/mainlogo.jpg" alt="UnitySpace Logo" />
        <Logo theme={theme}>UnitySpace</Logo>
      </LogoContainer>
      <ButtonGroup>
        <Button className="signin" theme={theme} onClick={handleSignIn}>Sign In</Button>
        <Button className="register" theme={theme} onClick={handleRegister}>Register</Button>
      </ButtonGroup>
    </Nav>
  );
};

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
  background: #000000;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-weight: ${props => props.theme === 'dark' ? 'bold' : 'normal'};
  
  &.signin {
    background: transparent;
    border: 2px solid #ffffff;
    color: #ffffff;
    
    &:hover {
      background: #ffffff;
      color: #000000;
    }
  }
  
  &.register {
    background: transparent;
    border: 2px solid #ffffff;
    color: #ffffff;
    
    &:hover {
      background: #ffffff;
      color: #000000;
    }
  }
`;

export default Navigationbar;
