import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaEnvelope, FaCamera } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profilePhoto: null
  });

  const [countryCode, setCountryCode] = useState("+91");
  const [phoneError, setPhoneError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [githubImageUrl, setGithubImageUrl] = useState(null);
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:9997/api/residents/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setFormData({
          fullName: data?.userName || '',
          email: data?.email || '',
          phone: data?.phoneNumber ? data?.phoneNumber.slice(3) : '',
          profilePhoto: data?.image || null
        });
      } catch(error) {
        console.error('Error fetching user data:', error);
        toast.error("Error fetching user data");
      }
    };
    
    fetchUserData();
  }, [userId, token]);

  

  const countryPhoneLengths = {
    "+1": 10,
    "+44": 10,
    "+91": 10,
    "+86": 11,
    "+81": 10,
    "+82": 10,
    "+61": 9,
    "+33": 9,
    "+49": 11,
  };

  const validatePhone = (phoneNumber, selectedCountryCode) => {
    const exactLength = countryPhoneLengths[selectedCountryCode];
    return phoneNumber.length === exactLength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= countryPhoneLengths[countryCode]) {
      setFormData(prevState => ({
        ...prevState,
        phone: value
      }));
      setPhoneError("");
    }
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result;
        setPhotoPreview(result);
        setFormData(prevState => ({
          ...prevState,
          profilePhoto: reader.result
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone, countryCode)) {
      setPhoneError(`Phone number must be exactly ${countryPhoneLengths[countryCode]} digits for ${countryCode}`);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:9997/api/residents/update/${userId}`, {
        email: formData.email,
        phoneNumber: countryCode + formData.phone,
        image: formData.profilePhoto
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Successfully updated profile!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      navigate('/home/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleClose = () => {
    navigate('/home/profile');
  };

  return (
    <Container>
      <FormContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        <Title>Update Your Profile</Title>
        <StyledForm onSubmit={handleSubmit}>
          <ProfilePhotoContainer>
            <PhotoPreview>
              <img src={photoPreview || '/default-avatar.png'} alt="Profile Preview" />
            </PhotoPreview>
            <PhotoUploadButton htmlFor="photo-upload">
              <FaCamera /> Change Photo
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </PhotoUploadButton>
          </ProfilePhotoContainer>

          <FormGroup>
            <Label>
              <FaUser /> Username
            </Label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FaEnvelope /> Email Address
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FaPhone /> Phone Number
            </Label>
            <PhoneInputContainer>
              <StyledCountrySelect
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  setPhoneError("");
                }}
              >
                <option value="+1">+1 (USA/Canada)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (India)</option>
                <option value="+86">+86 (China)</option>
                <option value="+81">+81 (Japan)</option>
                <option value="+82">+82 (South Korea)</option>
                <option value="+61">+61 (Australia)</option>
                <option value="+33">+33 (France)</option>
                <option value="+49">+49 (Germany)</option>
              </StyledCountrySelect>
              <StyledPhoneInput
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder={`${countryPhoneLengths[countryCode]} digits`}
                maxLength={countryPhoneLengths[countryCode]}
                required
              />
            </PhoneInputContainer>
            {phoneError && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{phoneError}</div>}
          </FormGroup>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Profile
          </SubmitButton>
        </StyledForm>
      </FormContainer>
    </Container>
  );
};

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

const FormContainer = styled(motion.div)`
  max-width: 500px;
  width: 90%;
  margin: 2rem auto;
  padding: 2.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  max-height: 80vh;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
    
    &:hover {
      background: #666;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  
  &:hover {
    color: #000;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: #000000;
    border-radius: 2px;
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #000000;
  }
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const StyledCountrySelect = styled.select`
  width: 140px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`;

const StyledPhoneInput = styled(Input)`
  flex: 1;
`;

const ProfilePhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const PhotoPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #000000;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PhotoUploadButton = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 20px;
  background: #000000;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333333;
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.1rem;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 14px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: #333333;
    transform: translateY(-1px);
  }
`;

export default UserDetails;
