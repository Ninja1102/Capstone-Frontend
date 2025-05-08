import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import "../../CSS/cardStyles.css";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import mainLogo from "../../assets/mainlogo.jpg?url";
import { motion } from 'framer-motion';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [profileImage, setProfileImage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [box, setBox] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("jwtToken");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9997/api/residents/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.data;
        setProfileImage(data.image);
        setUserName(data.userName);
        setUserEmail(data.email);
        setUserPhone(data.phoneNumber);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("jwtToken");
    navigate("/");
  };

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMyAccount = () => {
    navigate("/home/profile");
    setDropdownOpen(false);
  };

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [checkboxValues, setCheckboxValues] = useState({
    needsms: false,
    needcall: false,
    needemail: false,
  });

  const [shouldRefetch, setShouldRefetch] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9997/api/alert/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCards(response.data);
        console.log("asmdcb", response.data)
      } catch (error) {
        setCards([]);
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, [shouldRefetch]);

  const handleCheckboxChange = ({ target: { name, checked } }) => {
    setCheckboxValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSetRem = async (eventid) => {
    if(!box) {
      setShowConfirmation(true);
      return;
    }
    try {
      const baseUrl = "http://localhost:9997/reminder/create";
      console.log(checkboxValues);
      await axios.post(
        `${baseUrl}`,
        {
          userId,
          eventId: eventid,
          needSms: checkboxValues.needsms,
          needCall: checkboxValues.needcall,
          needEmail: checkboxValues.needemail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleIgnore(eventid);
    } catch (error) {
      console.error("Error marking alert as seen:", error);
    }
  };

  const handleIgnore = async (eventid) => {
    try {
      const headers = { Authorization: token };
      const baseUrl = "http://localhost:9997/api/alert";

      await axios.put(`${baseUrl}/seen/${userId}/${eventid}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCheckboxValues({
        needsms: false,
        needcall: false,
        needemail: false,
      });
      setShouldRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error marking alert as seen:", error);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCardClick = (index) => {
    setCurrentCardIndex(index);
  };

  const getCardClass = (index) => {
    if (index === currentCardIndex) {
      return "card card--current";
    } else if (
      index === currentCardIndex + 1 ||
      (currentCardIndex === cards.length - 1 && index === 0)
    ) {
      return "card card--next";
    } else {
      return "card card--out";
    }
  };

  return (
    <>
      <Nav>
        <Logo onClick={handleLogoClick}>
          <LogoImage src={mainLogo} alt="UnitySpace Logo" />
          <LogoTitle>UnitySpace</LogoTitle>
        </Logo>
        <NavLinks>
          <NavLink onClick={() => {
            navigate('/home');
            setTimeout(() => {
              const element = document.getElementById("home-section");
              if(element) element.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}>
            Home
          </NavLink>
          <NavLink onClick={() => {
            navigate('/home');
            setTimeout(() => {
              const element = document.getElementById("events-section");
              if(element) element.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}>
            Events
          </NavLink>
          <NavLink onClick={() => {
            navigate('/home');
            setTimeout(() => {
              const element = document.getElementById("schedules-section");
              if(element) element.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}>
            Schedules
          </NavLink>
          <NavLink onClick={() => {
            navigate('/home');
            setTimeout(() => {
              const element = document.getElementById("feedback-section");
              if(element) element.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}>
            Reviews
          </NavLink>
        </NavLinks>

        <ProfileSection ref={dropdownRef}>
          <ProfileImage
            src={profileImage}
            alt="Profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          <ChevronIcon
            isopen={dropdownOpen ? "true" : "false"}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          <Dropdown isopen={dropdownOpen ? "true" : "false"}>
            <DropdownUserName>{userName || "User"}</DropdownUserName>
            <DropdownItem onClick={handleMyAccount}>My Account</DropdownItem>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </Dropdown>
        </ProfileSection>
      </Nav>
      {showConfirmation && (
        <ConfirmationContainer>
          <ConfirmationBox
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Confirmation</h2>
            <p>You will receive updates on:</p>
            <ContactInfo>
              {userPhone && <p>Phone: {userPhone}</p>}
              {userEmail && <p>Email: {userEmail}</p>}
            </ContactInfo>
            <p>Want to update your contact details?</p>
            <ButtonGroup>
              <UpdateButton onClick={() => navigate('/home/profile/profile')}>
                Update Profile
              </UpdateButton>
              <CloseButton onClick={() => {setShowConfirmation(false); setBox(true)}}>
                Close
              </CloseButton>
            </ButtonGroup>
          </ConfirmationBox>
        </ConfirmationContainer>
      )}
      {cards.length > 0 && (
        <ul
          className="cards"
          style={{
            position: "fixed",
            left: "33%",
            zIndex: 10,
            top: "15%",
          }}
        >
          {cards.map((card, index) => (
            <li
              key={index}
              className={getCardClass(index)}
              onClick={() => handleCardClick(index)}
            >
              <h1 style={{ marginTop: "-14px" }}>{card.eventTitle}</h1>

              <img
                src={card.eventImg}
                alt={card.title}
                className="card-image"
              />

              <p>{card.eventDescription}</p>

              <p>
                {(() => {
                  const date = new Date(card.eventDate);

                  const day = date.getDate();

                  const month = date.toLocaleString("default", {
                    month: "short",
                  });

                  const hour = date.getHours();

                  const ampm = hour >= 12 ? "PM" : "AM";

                  const hour12 = hour % 12 || 12;

                  const message = `${day}${getSuffix(
                    day
                  )} ${month} at ${hour12}${ampm}`;

                  function getSuffix(day) {
                    if (day >= 11 && day <= 13) return "th";

                    const lastDigit = day % 10;

                    switch (lastDigit) {
                      case 1:
                        return "st";

                      case 2:
                        return "nd";

                      case 3:
                        return "rd";

                      default:
                        return "th";
                    }
                  }

                  return message;
                })()}
              </p>

              <div
                className="checkbox-container"
                style={{
                  display: "flex",

                  justifyContent: "center",

                  gap: "30px",

                  margin: "20px 0",
                }}
              >
                <label
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "8px",

                    fontSize: "16px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="needsms"
                    checked={checkboxValues.needsms}
                    onChange={handleCheckboxChange}
                    style={{
                      width: "18px",

                      height: "18px",

                      cursor: "pointer",
                    }}
                  />
                  SMS
                </label>

                <label
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "8px",

                    fontSize: "16px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="needcall"
                    checked={checkboxValues.needcall}
                    onChange={handleCheckboxChange}
                    style={{
                      width: "18px",

                      height: "18px",

                      cursor: "pointer",
                    }}
                  />
                  Call
                </label>

                <label
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: "8px",

                    fontSize: "16px",
                  }}
                >
                  <input
                    type="checkbox"
                    name="needemail"
                    checked={checkboxValues.needemail}
                    onChange={handleCheckboxChange}
                    style={{
                      width: "18px",

                      height: "18px",

                      cursor: "pointer",
                    }}
                  />
                  Email
                </label>
              </div>

              <div
                style={{
                  display: "flex",

                  justifyContent: "center",

                  gap: "20px",

                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => handleSetRem(card.eventId)}
                  style={{
                    padding: "10px 25px",

                    fontSize: "16px",

                    fontWeight: "bold",

                    border: "none",

                    borderRadius: "5px",

                    cursor: "pointer",

                    backgroundColor: "#4CAF50",

                    color: "white",

                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#45a049")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#4CAF50")
                  }
                >
                  Submit
                </button>

                <button
                  onClick={() => handleIgnore(card.eventId)}
                  style={{
                    padding: "10px 25px",

                    fontSize: "16px",

                    fontWeight: "bold",

                    border: "none",

                    borderRadius: "5px",

                    cursor: "pointer",

                    backgroundColor: "#f44336",

                    color: "white",

                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#da190b")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#f44336")
                  }
                >
                  Ignore
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
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
  color: #ffffff;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const LogoTitle = styled.span`
  font-size: 26px;
  font-weight: bold;
  color: #ffffff;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
`;

const NavLink = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -3px;
    left: 0;
    background-color: #ffffff;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const ProfileSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const ChevronIcon = styled(FaChevronDown)`
  color: #ffffff;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isopen === "true" ? "rotate(180deg)" : "rotate(0)")};
`;

const Dropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  display: ${(props) => (props.isopen === "true" ? "block" : "none")};
  min-width: 200px;
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #f5f5f5;
  }
`;

const DropdownUserName = styled.div`
  padding: 10px 20px;
  color: #333;
  font-weight: bold;
  border-bottom: 1px solid #eee;
`;

const SettingsSubmenu = styled.div`
  padding: 10px 0;
  border-top: 1px solid #eee;
`;

const ConfirmationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ConfirmationBox = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;

  h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    margin: 0.5rem 0;
    color: #666;
  }
`;

const ContactInfo = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 5px;

  p {
    margin: 0.5rem 0;
    color: #333;
    font-weight: 500;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const UpdateButton = styled.button`
  padding: 0.5rem 1rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }
`;

const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background: #da190b;
  }
`;

export default NavBar;
