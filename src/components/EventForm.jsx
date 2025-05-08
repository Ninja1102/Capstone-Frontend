import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';

const EventForm = () => {
  const navigate = useNavigate();
  const[i, setI] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    imageUrl: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result;
        setImagePreview(result);
        setFormData(prevState => ({
          ...prevState,
          imageUrl: result
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date(formData.date);
    const localDateTime = formData.date;
    setI(i+1);

    try {
      const token = sessionStorage.getItem('jwtToken');
      const userId = sessionStorage.getItem('userId');
      const headers = { Authorization: token };

      const response = await axios.post('http://localhost:9997/event/add',
        {
          eventTitle: formData.title,
          eventDescription: formData.description,
          eventDate: localDateTime,
          eventImg: formData.imageUrl,
          userId: userId
        },
        { headers }
      );
      navigate('/home');
    } catch(error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <LeftSection>
          <WelcomeText>Create Memorable Events</WelcomeText>
          <Description>Plan and organize amazing events for our community</Description>
        </LeftSection>
        <RightSection>
          <FormCard>
            <Title>Create Event</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Event Title</Label>
                <Input
                  type="text"
                  placeholder="Enter event title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Event Description</Label>
                <TextArea
                  placeholder="Enter event description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Event Date & Time</Label>
                <Input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Event Image</Label>
                <ImageUploadContainer>
                  <ImagePreviewContainer>
                    <img src={imagePreview || '/default-event.png'} alt="Event Preview" />
                  </ImagePreviewContainer>
                  <PhotoUploadButton htmlFor="image-upload">
                    <FaCamera /> Upload Event Image
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </PhotoUploadButton>
                </ImageUploadContainer>
              </FormGroup>

              <Button type="submit">Create Event</Button>
            </Form>
          </FormCard>
        </RightSection>
      </ContentContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 90%;
  max-width: 1200px;
  min-height: 600px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  margin-top: 60px; // Added to account for navbar
`;

const LeftSection = styled.div`
  flex: 1;
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3') center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  color: white;

  @media (max-width: 968px) {
    display: none;
  }
`;

const WelcomeText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  font-family: 'Poppins', sans-serif;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  font-family: 'Poppins', sans-serif;
`;

const RightSection = styled.div`
  flex: 1;
  padding: 40px;
  background: white;
  display: flex;
  align-items: flex-start; // Changed from center to flex-start
  justify-content: center;
  overflow-y: auto; // Added scrolling for right section
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  font-family: 'Poppins', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 14px;
  min-height: 120px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #ddd;
`;

const ImagePreviewContainer = styled.div`
  width: 200px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #000000;
  
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
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333333;
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  padding: 12px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333333;
    transform: translateY(-2px);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

export default EventForm;