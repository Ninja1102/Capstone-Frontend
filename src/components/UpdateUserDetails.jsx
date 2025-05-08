import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaEnvelope, FaCamera } from 'react-icons/fa';

const UpdateUserDetails = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profilePhoto: null
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prevState => ({
        ...prevState,
        profilePhoto: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <ProfilePhotoContainer>
          <PhotoPreview>
            <img src={photoPreview || '/default-avatar.png'} alt="Profile Preview" />
          </PhotoPreview>
          <PhotoUploadButton>
            <FaCamera /> Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
          </PhotoUploadButton>
        </ProfilePhotoContainer>

        <FormGroup>
          <Label>
            <FaUser /> Full Name
          </Label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
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
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
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
  );
};

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 70px;
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
  font-weight: 500;
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${props => props.theme === 'dark' ? '#2d2d2d' : 'white'};
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#000000'};
`;

const ProfilePhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const PhotoPreview = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #4f46e5;
  position: relative;
  
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
  padding: 0.5rem 1rem;
  background: #4f46e5;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #3c3799;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, #2563eb, #4f46e5);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default UpdateUserDetails;
