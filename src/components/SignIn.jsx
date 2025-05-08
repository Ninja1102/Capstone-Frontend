import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SignInForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9997/auth/validate/user",
        {
          userName: username,
          password: password,
        }
      );
      if (!response.data || !response.data.token || !response.data.userId) {
        throw new Error('Invalid response from server');
      }

      const { token, userId } = response.data;
      sessionStorage.setItem("jwtToken", token);
      sessionStorage.setItem("userId", userId);

      try{
      const user = await axios.get(`http://localhost:9997/api/residents/${userId}`,
        {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
      );
      const userStatus = user.data.status;
      if(userStatus === "APPROVED"){ 
        toast.success("Sign in successful! Redirecting to your dashboard...", {
          position: "top-right",
          autoClose: 2000,
        });
  
        setTimeout(() => {
          if(username.toLowerCase() === "admin"){
            navigate("/admin");
          }else{
            navigate("/home");
          }
        }, 1000);
      }
    }catch(error){
      toast.error('You are not approved yet. Please wait for approval.', {
        position: "top-right",
        autoClose: 5000
      });
        }
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response) {
        // Handle different HTTP error codes
        switch (err.response.status) {
          case 400:
            setError('Username or password is incorrect');
            break;
          case 500:
            setError('Internal server error. Please try again later.');
            break;
          default:
            setError('Username or password is incorrect');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Container>
      <BackgroundOverlay>
        <FormCard>
          <Title>Welcome Back! to UnitySpace</Title>
          <Form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
            <FormField>
              <Label htmlFor="username">Username</Label>
              <div className="group relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="peer"
                />
                <span className="pointer-events-none absolute -top-7 left-0 opacity-0 transition-opacity peer-hover:opacity-100 bg-gray-700 text-white p-2 rounded text-sm">
                  Enter your registered username
                </span>
              </div>
            </FormField>

            <FormField>
              <Label htmlFor="password">Password</Label>
              <div className="group relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="peer"
                />
                <span className="pointer-events-none absolute -top-7 left-0 opacity-0 transition-opacity peer-hover:opacity-100 bg-gray-700 text-white p-2 rounded text-sm">
                  Enter your secure password
                </span>
              </div>
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormField>
            <Button type="submit">Sign In</Button>
          </Form>
          <RegisterText>
            First time user? <Link to="/register">Register here</Link>
          </RegisterText>
        </FormCard>
      </BackgroundOverlay>
      <ToastContainer />
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3') center/cover;
  font-family: 'Poppins', sans-serif;
`;

const BackgroundOverlay = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 28px;
  letter-spacing: 0.5px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  
  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  font-size: 14px;
  margin-top: 5px;
  font-family: 'Inter', sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  
  &:hover {
    background: #333333;
  }
`;

const RegisterText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  
  a {
    color: #000000;
    text-decoration: none;
    font-weight: bold;
    font-family: 'Inter', sans-serif;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default SignInForm;
