"use client";
import React from "react";
import { AuroraBackground } from './ui/aurora-background';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { FocusCards } from './ui/FocusCards';
import { FaCalendarAlt, FaBell, FaClock, FaComments, FaRss, FaRegCalendarCheck, FaLinkedin, FaGithub, FaUserCircle, FaSun, FaMoon, FaShieldAlt, FaLock, FaHandshake, FaUsers, FaRocket, FaUserShield, FaCommentDots } from 'react-icons/fa';
import { toast } from 'react-toastify';


const LandingPage = () => {
  const navigate = useNavigate();
  const featuresSectionRef = useRef(null);
  const teamSectionRef = useRef(null);
  const homeSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleGetStarted = () => {
    const isAuthenticated = sessionStorage.getItem('token');
    if (!isAuthenticated) {
      toast.error('Please sign in or register to access this feature!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/signin');
      return;
    }
    navigate('/home');
  };

  const handleKnowMore = () => {
    featuresSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const titleVariants = {
    initial: {
      opacity: 0,
      y: -50,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 2.5,
        ease: "easeInOut",
        staggerChildren: 0.2
      },
    },
  };

  const spanVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 2.5,
        ease: "easeInOut",
      },
    },
  };

  const featureVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const handleFeatureClick = () => {
    const isAuthenticated = localStorage.getItem('token');
    if (!isAuthenticated) {
      toast.warning('Please sign in to access this feature!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HeroSection theme={theme}>
      <ContentWrapper>
      <AuroraBackground theme={theme}>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
        ref={homeSectionRef}
      >
          <Title
            variants={titleVariants}
            initial="initial"
            animate="animate"
            viewport={{ once: true }}
            theme={theme}
          >
            Welcome to{" "}
            <motion.span
              variants={spanVariants}
            >
              UnitySpace
            </motion.span>
          </Title>
          <Description
            initial={{ opacity: 0, z: -100 }}
            animate={{ opacity: 1, z: 0 }}
            transition={{ duration: 2.5, ease: "backOut" }}
            style={{ 
              perspective: 1000,
              transformStyle: "preserve-3d"
            }}
            viewport={{ once: true }}
            theme={theme}
          >
            Experience a connected community like never before. 
            UnitySpace is your digital hub for staying updated 
            on all events happening in your society. Whether 
            it's a celebration, meeting, or community initiative, 
            UnitySpace keeps you informed, engaged, and part of 
            every moment. Join your neighbors in building a 
            vibrant, united community!
          </Description>
          <ButtonContainer>
            <ThemeToggleButton
              onClick={toggleTheme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              theme={theme}
            >
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </ThemeToggleButton>
            <GetStartedButton
              onClick={handleGetStarted}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Get Started
            </GetStartedButton>
            <KnowMoreButton
              onClick={handleKnowMore}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              viewport={{ once: true }}
              theme={theme}
            >
              Know More
            </KnowMoreButton>
          </ButtonContainer>
        </motion.div>
        </AuroraBackground>

        <SectionTitle theme={theme} gradient="true">Our Features</SectionTitle>
        <FeaturesSection ref={featuresSectionRef}>
          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={true}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaCalendarAlt /> Event Management</h3>
            <p>Create, organize, and manage community events effortlessly. Set dates, venues, and track attendance all in one place.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={false}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaBell /> Smart Reminders</h3>
            <p>Never miss an important event with our intelligent reminder system. Get notifications about upcoming events and important updates.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={true}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaClock /> Event Scheduling</h3>
            <p>Plan ahead with our intuitive scheduling system. Check availability, avoid conflicts, and find the perfect time for your events.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={false}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaComments /> Community Feedback</h3>
            <p>Share your thoughts and experiences. Rate events, provide suggestions, and help shape future community gatherings.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={true}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaRss /> Real-time Updates</h3>
            <p>Stay informed with instant updates about event changes, new announcements, and community news.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={false}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaRegCalendarCheck /> Community Calendar</h3>
            <p>Access a shared calendar showing all upcoming events, making it easy to plan and participate in community activities.</p>
          </FeatureItem>
        </FeaturesSection>

        <SectionTitle theme={theme} gradient="true">Coming Soon</SectionTitle>
        <FeaturesSection>
          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={true}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaHandshake /> Community Marketplace</h3>
            <p>A dedicated space for community members to buy, sell, or exchange items and services locally.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={false}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaUsers /> Interest Groups</h3>
            <p>Create and join groups based on shared interests, hobbies, or activities within your community.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={true}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaRocket /> Mobile App</h3>
            <p>Access UnitySpace on the go with our upcoming mobile application for iOS and Android devices.</p>
          </FeatureItem>

          <FeatureItem
            variants={featureVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            isBlue={false}
            theme={theme}
            onClick={handleFeatureClick}
          >
            <h3><FaCommentDots /> Discussion Forum</h3>
            <p>Engage in meaningful conversations with community members through our dedicated discussion forum and real-time chat features.</p>
          </FeatureItem>
        </FeaturesSection>

        <SectionTitle theme={theme} ref={teamSectionRef}>Meet Our Team</SectionTitle>
        <TeamGrid>
          <TeamCard>
            <div className="content">
              <h4>Haripriya M</h4>
              <p>Developer - I</p>
            </div>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/haripriya-m-973714283/" target="_blank" rel="noopener noreferrer" className="linkedin">
                <FaLinkedin />
              </a>
              <a href="https://github.com/Ninja1102" target="_blank" rel="noopener noreferrer" className="github">
                <FaGithub />
              </a>
            </div>
          </TeamCard>

          <TeamCard>
            <div className="content">
              <h4>Jagadeesh Gandham</h4>
              <p>Developer - I</p>
            </div>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/gandham-jagadeesh-677724265/" target="_blank" rel="noopener noreferrer" className="linkedin">
                <FaLinkedin />
              </a>
              <a href="https://github.com/gandham-jagadeesh" target="_blank" rel="noopener noreferrer" className="github">
                <FaGithub />
              </a>
            </div>
          </TeamCard>
        </TeamGrid>

        <FullWidthFooter>
          <FooterContent>
            <FooterSection>
              <h3>About UnitySpace</h3>
              <p>Building stronger communities through technology and connection.</p>
            </FooterSection>
            <FooterSection>
              <h3>Quick Links</h3>
              <FooterLink onClick={() => scrollToSection(homeSectionRef)}>Home</FooterLink>
              <FooterLink onClick={() => scrollToSection(featuresSectionRef)}>Features</FooterLink>
              <FooterLink onClick={() => scrollToSection(teamSectionRef)}>Team</FooterLink>
              <FooterLink onClick={() => scrollToSection(contactSectionRef)}>Contact</FooterLink>
            </FooterSection>
            <FooterSection ref={contactSectionRef}>
              <h3>Contact Us</h3>
              <p>Email: info@unityspace.com</p>
              <p>Phone: 8608036495</p>
              <p>Phone: 9966618765</p>
            </FooterSection>
          </FooterContent>
          <FooterBottom>
            <p>&copy; 2024 UnitySpace. All rights reserved.</p>
          </FooterBottom>
        </FullWidthFooter>
      </ContentWrapper>
    </HeroSection>
  );
};

const HeroSection = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 120px 50px 0 50px;
  background: ${props => props.theme === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #e6f0ff 0%, #f5f5ff 100%)'
  };
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    padding: 80px 20px 0 20px;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  gap: 4vh;

  @media (max-width: 768px) {
    gap: 2vh;
  }
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  span {
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
    font-weight: bold;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.25rem;
  line-height: 1.75;
  color: ${props => props.theme === 'dark' ? '#e0e0e0' : '#4b5563'};
  margin-bottom: 2rem;
  text-align: center;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ThemeToggleButton = styled(motion.button)`
  padding: 1rem;
  font-size: 1.125rem;
  color: white;
  background: #000000;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
  }
`;

const GetStartedButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: #000000;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const KnowMoreButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  background: #000000;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0.5rem;
  }
`;

const FeatureItem = styled(motion.div)`
  padding: 2rem;
  background: ${props => props.theme === 'dark'
    ? 'rgba(45, 45, 45, 0.9)'
    : 'rgba(255, 255, 255, 0.95)'
  };
  border-radius: 1rem;
  text-align: left;
  box-shadow: ${props => props.theme === 'dark'
    ? '0 4px 6px rgba(0, 0, 0, 0.2)'
    : '0 4px 6px rgba(37, 99, 235, 0.1)'
  };
  margin-bottom: 1rem;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  
  h3 {
    font-size: 1.5rem;
    color: ${props => props.isBlue 
      ? '#2563eb' 
      : props.theme === 'dark' ? '#ffffff' : '#000000'
    };
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: ${props => props.theme === 'dark' 
      ? '#e0e0e0' 
      : props.isBlue ? '#4b5563' : '#000000'
    };
    line-height: 1.6;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme === 'dark'
      ? '0 25px 30px -5px rgba(0, 0, 0, 0.3), 0 15px 15px -5px rgba(0, 0, 0, 0.15)'
      : '0 25px 30px -5px rgba(37, 99, 235, 0.2), 0 15px 15px -5px rgba(37, 99, 235, 0.1)'
    };
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  background: ${props => props.gradient === "true" ? 'linear-gradient(to right, #2563eb, #4f46e5)' : 'none'};
  -webkit-background-clip: ${props => props.gradient === "true" ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.gradient === "true" ? 'transparent' : 'inherit'};

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const TeamGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1000px;
  flex-wrap: wrap;
`;

const TeamCard = styled.div`
  width: 300px;
  background: #000000;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  .content {
    text-align: center;
    margin-bottom: 1.5rem;

    h4 {
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    p {
      color: #cccccc;
      font-weight: 500;
    }
  }

  .social-links {
    display: flex;
    justify-content: center;
    gap: 1.5rem;

    a {
      font-size: 1.5rem;
      transition: color 0.3s ease;

      &.linkedin {
        color: #ffffff;
        &:hover {
          color: #0077b5;
        }
      }

      &.github {
        color: #ffffff;
        &:hover {
          color: #6e5494;
        }
      }
    }
  }
`;

const FullWidthFooter = styled.footer`
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  background: #000000;
  color: #ffffff;
  padding: 4rem 0 2rem 0;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: #ffffff;
  }

  p {
    color: #cccccc;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
`;

const FooterLink = styled.a`
  display: block;
  color: #cccccc;
  text-decoration: none;
  margin-bottom: 0.8rem;
  cursor: pointer;

  &:hover {
    color: #ffffff;
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #333333;

  p {
    color: #cccccc;
  }
`;

export default LandingPage;