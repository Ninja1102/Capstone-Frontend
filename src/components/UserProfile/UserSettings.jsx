import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPalette, FaLanguage, FaSave, FaToggleOn } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SettingsContainer = styled.div`
  max-width: 800px;
  width: 90%;
  margin: 2rem auto;
  padding: 2rem;
  background: ${props => props.theme === 'dark' ? '#1a1a1a' : '#ffffff'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const SettingSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: ${props => props.theme === 'dark' ? '#2d2d2d' : '#f5f5f5'};
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  
  svg {
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  }
`;

const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme === 'dark' ? '#444' : '#ddd'};
  background: ${props => props.theme === 'dark' ? '#333' : '#fff'};
  color: ${props => props.theme === 'dark' ? '#fff' : '#000'};
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 2rem;
  
  &:hover {
    background: #333;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2.5rem;
  font-weight: bold;
  cursor: pointer;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  padding: 0.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

const UserSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    emailUpdates: true
  });
  
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleClose = () => {
    navigate('/home/profile');
  };

  const handleSaveSettings = async () => {
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      alert('Settings saved successfully!');
      navigate('/home/profile');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <Container>
      <SettingsContainer theme={settings.theme}>
        <CloseButton theme={settings.theme} onClick={handleClose}>&times;</CloseButton>
        <Title>User Settings</Title>
        
        <SettingSection theme={settings.theme}>
          <SectionTitle theme={settings.theme}>
            <FaPalette /> Theme
          </SectionTitle>
          <OptionContainer>
            <Select 
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              theme={settings.theme}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </Select>
          </OptionContainer>
        </SettingSection>

        <SettingSection theme={settings.theme}>
          <SectionTitle theme={settings.theme}>
            <FaLanguage /> Language
          </SectionTitle>
          <OptionContainer>
            <Select 
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              theme={settings.theme}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </Select>
          </OptionContainer>
        </SettingSection>

        <SaveButton onClick={handleSaveSettings}>
          <FaSave /> Save Settings
        </SaveButton>
      </SettingsContainer>
    </Container>
  );
};

export default UserSettings;
