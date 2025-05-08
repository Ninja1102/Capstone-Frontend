import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [usernameError, setUsernameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

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

  // const handleVerifyClick = () => {
  //   if (!validatePhone(phone, countryCode)) {
  //     setPhoneError(`Phone number must be exactly ${countryPhoneLengths[countryCode]} digits for ${countryCode}`);
  //     return;
  //   }
  //   setShowOtpField(true);
  //   toast.info("OTP sent to your phone number!", {
  //     position: "top-right",
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setPhoneError("");

    if (!validatePhone(phone, countryCode)) {
      setPhoneError(`Phone number must be exactly ${countryPhoneLengths[countryCode]} digits for ${countryCode}`);
      return;
    }

    try {
      const registerResponse = await axios.post(
        "http://localhost:9997/auth/register",
        {
          userName: username,
          password: password,
          role: "Resident",
        }
      );
      const validateResponse = await axios.post(
        "http://localhost:9997/auth/validate/user",
        {
          userName: username,
          password: password,
        }
      );
      const { token, userId } = validateResponse.data;
      
      const response = await axios.put(
        `http://localhost:9997/api/residents/update/${userId}`,
        {
          email: email,
          phoneNumber: countryCode + phone,
          image: "",
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      toast.success("Registration successful! Redirecting to sign in...", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      console.error("Error during registration:", err);

      if (err.response) {
        switch (err.response.status) {
          case 400:
            toast.error(
              "Invalid registration details. Please check your input.",
              {
                position: "top-right",
              }
            );
            break;
          case 500:
            toast.error("Name is already taken. Please try another name.", {
              position: "top-right",
            });
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const submitButton = document.querySelector('button[type="submit"]');
      submitButton.click();
    }
  };

  return (
    <Container>
      <ToastContainer />
      <LeftSection>
        <WelcomeText style={{fontSize: "3.5rem",fontWeight: "700",fontFamily: "'Poppins', sans-serif"}}>Welcome to Our Community</WelcomeText>
        <Description style={{fontSize: "1.2rem",lineHeight: "1.6",fontFamily: "'Poppins', sans-serif",textAlign:"center",fontWeight:"bold",color:"#ffffff"}}>- Join us to connect, share and grow together -</Description>
      </LeftSection>
      <RightSection>
        <FormCard>
          <Logo style={{fontSize: "24px",color:"#000000"}}>UnitySpace</Logo>
          <Title>Create Account</Title>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Username</Label>
              <StyledInput
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError("");
                }}
                onKeyPress={handleKeyPress}
                required
              />
              {usernameError && <ErrorText>{usernameError}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <Label>Email Address</Label>
              <StyledInput
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Phone Number</Label>
              <PhoneInputContainer>
                <StyledCountrySelect
                  value={countryCode}
                  onChange={(e) => {
                    setCountryCode(e.target.value);
                    setPhoneError("");
                  }}
                >
                  <option value="+91">+91 (India)</option>
                  <option value="+1">+1 (USA/Canada)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+86">+86 (China)</option>
                  <option value="+81">+81 (Japan)</option>
                  <option value="+82">+82 (South Korea)</option>
                  <option value="+61">+61 (Australia)</option>
                  <option value="+33">+33 (France)</option>
                  <option value="+49">+49 (Germany)</option>
                </StyledCountrySelect>
                <StyledPhoneInput
                  type="tel"
                  placeholder={`${countryPhoneLengths[countryCode]} digits`}
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= countryPhoneLengths[countryCode]) {
                      setPhone(value);
                      setPhoneError("");
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  maxLength={countryPhoneLengths[countryCode]}
                  required
                />
              </PhoneInputContainer>
            </InputGroup>

            <InputGroup>
              <Label>Password</Label>
              <StyledInput
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                required
              />
            </InputGroup>

            <RegisterButton type="submit" style={{backgroundColor:"#000000",color:"#ffffff"}}>Create Account</RegisterButton>
          </Form>
          <SignInText>
            Already have an account? <StyledLink to="/signin" style={{color:"#000000"}}>Sign in</StyledLink>
          </SignInText>
        </FormCard>
      </RightSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 60px); /* Subtract navbar height */
  margin-top: 60px; /* Add margin equal to navbar height */
  background: #f5f5f5;
`;

const LeftSection = styled.div`
  flex: 1;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3') center/cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  color: white;

  @media (max-width: 968px) {
    display: none;
  }
`;

const WelcomeText = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 32px;
  font-family: 'Montserrat', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', sans-serif;
`;

const StyledInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const StyledCountrySelect = styled.select`
  width: 140px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const StyledPhoneInput = styled(StyledInput)`
  flex: 1;
`;

const RegisterButton = styled.button`
  padding: 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  margin-top: 8px;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
`;

const SignInText = styled.p`
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
`;

const StyledLink = styled(Link)`
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  font-family: 'Inter', sans-serif;
`;

export default RegisterForm;
