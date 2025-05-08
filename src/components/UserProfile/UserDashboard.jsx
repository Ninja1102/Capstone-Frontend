import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHome, FaCalendarAlt, FaBell, FaCog, FaSignOutAlt, FaUser, FaSms, FaPhone, FaEnvelope, FaTimes, FaHouseUser, FaChartPie, FaColumns } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    sms: false,
    call: false,
    email: false
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const userId = sessionStorage.getItem('userId');
  const token = sessionStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:9997/api/residents/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUserData(data);

        const eventsResponse = await fetch(`http://localhost:9997/event/getAllEvents`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        const recentActivityData = eventsData
          .filter(event => event.userId === userId)
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(-5)
          .map(event => ({
            id: event.eventId,
            description: `Created event: ${event.eventTitle}`,
            timestamp: new Date(event.eventDate).toLocaleDateString()
          }));
        setRecentActivity(recentActivityData);

        const reminderResponse = await fetch(`http://localhost:9997/reminder/getbyUserId/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const reminderData = await reminderResponse.json();
        setReminders(reminderData);
        const notificationsData = reminderData.filter(reminder => 
          reminder.rem.needSms || reminder.rem.needCall || reminder.rem.needEmail
        ).map(reminder => ({
          id: reminder.rem.remId,
          message: `Reminder for event: ${reminder.event.eventTitle}`,
          reminderType: `${reminder.rem.needSms ? 'SMS ' : ''}${reminder.rem.needCall ? 'Call ' : ''}${reminder.rem.needEmail ? 'Email' : ''}`,
          reminderDate: new Date(reminder.event.eventDate).toLocaleDateString(),
          eventTitle: reminder.event.eventTitle
        }));
        setNotifications(notificationsData);
      
        const userEventsData = eventsData.filter(event => event.userId === userId);
        setUserEvents(userEventsData || []); 

      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, token]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleProfileClick = () => {
    navigate('/home/profile/profile', { state: { user: userData } });
  };

  // const handleSettingsClick = () => {
  //   navigate('/home/profile/settings');
  // };

  // const handleNotificationClick = () => {
  //   setShowNotificationPopup(true);
  // };

  const handleEventsClick = () => {
    setShowEvents(!showEvents);
  };

  const handleDashboardClick = () => {
    setShowEvents(false);
  };

  // const handleCheckboxChange = (type) => {
  //   setNotificationPreferences(prev => ({
  //     ...prev,
  //     [type]: !prev[type]
  //   }));
  // };

  // const handleSaveNotifications = () => {
  //   alert('Notification preferences saved: ' + 
  //         Object.entries(notificationPreferences)
  //           .filter(([_, value]) => value)
  //           .map(([key]) => key)
  //           .join(', '));
  //   setShowNotificationPopup(false);
  // };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('jwtToken');
    navigate('/');
  };

  return (
    <DashboardContainer>
      <Sidebar style={{ position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'hidden' }}>
        <Logo onClick={() => navigate('/home')}>
          <LogoImage src="/src/assets/mainlogo.jpg" alt="UnitySpace Logo" />
          UnitySpace
        </Logo>
        <SidebarMenu>
          <MenuItem onClick={() => navigate('/home')}>
            <FaHouseUser />
            Home
          </MenuItem>
          <MenuItem onClick={handleDashboardClick} active={!showEvents}>
            <FaColumns />
            Dashboard
          </MenuItem>
          <MenuItem onClick={handleEventsClick} active={showEvents}>
            <FaCalendarAlt />
            Events
          </MenuItem>
          <MenuItem onClick={handleProfileClick}>
            <FaUser />
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </MenuItem>
        </SidebarMenu>
      </Sidebar>

      <MainContent style={{ marginLeft: '280px' }}>
        <Header>
          <ProfileImage src={userData.image} alt="Profile" />
          <UserInfo>
            <h1>{userData.userName}</h1>
            <p>{userData.email}</p>
          </UserInfo>
        </Header>

        {showEvents ? (
          <>
            <h2 style={{fontSize: '20px', fontWeight: 'bold'}}>My Events</h2>
            <EventsGrid>
              {Array.isArray(userEvents) && userEvents.map((event, index) => (
                <EventCard key={index}>
                  <img src={event.eventImg} alt={event.eventName} />
                  <h3 style={{fontSize: '20px', fontWeight: 'bold'}}>{event.eventTitle}</h3>
                  <p className="date">{new Date(event.eventDate).toLocaleDateString()}</p>
                  <p>{event.eventDescription}</p>
                  {reminders.filter(r => r.eventId === event.eventId).map((reminder, rIndex) => (
                    <p key={rIndex} style={{color: '#e74c3c', marginTop: '10px'}}>
                      Reminder set for: {new Date(reminder.reminderDate).toLocaleDateString()} 
                      ({reminder.needSms ? 'SMS ' : ''}{reminder.needCall ? 'Call ' : ''}{reminder.needEmail ? 'Email' : ''})
                    </p>
                  ))}
                </EventCard>
              ))}
            </EventsGrid>
          </>
        ) : (
          <>
            <StatsGrid>
              <StatCard>
                <h3>Total Events</h3>
                <p>{events.length}</p>
              </StatCard>
              <StatCard>
                <h3>Upcoming Events</h3>
                <p>{events.filter(event => new Date(event.eventDate) > new Date()).length}</p>
              </StatCard>
              <StatCard>
                <h3>My Events</h3>
                <p>{userEvents.length}</p>
              </StatCard>
              <StatCard>
                <h3>Reminders</h3>
                <p>{reminders.filter(reminder => reminder.rem.needSms || reminder.rem.needCall || reminder.rem.needEmail).length}</p>
              </StatCard>
            </StatsGrid>

            <ContentGrid>
              <RecentActivityContainer>
                <SectionHeader>
                  <SectionTitle>Recent Activity</SectionTitle>
                </SectionHeader>
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id}>
                    <span>{activity.description}</span>
                    <span>{activity.timestamp}</span>
                  </ActivityItem>
                ))}
              </RecentActivityContainer>

              <NotificationsContainer>
                <SectionHeader>
                  <SectionTitle>Notifications</SectionTitle>
                </SectionHeader>
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id}>
                    <FaBell />
                    <div>
                      <p>{notification.message}</p>
                      <small>
                        Reminder Date: {notification.reminderDate}<br/>
                        Type: {notification.reminderType}
                      </small>
                    </div>
                  </NotificationItem>
                ))}
              </NotificationsContainer>
            </ContentGrid>
          </>
        )}
      </MainContent>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #E8EEF4;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 280px;
  background: #000000;
  color: #FFFFFF;
  padding: 25px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 40px;
  padding: 15px 0;
  border-bottom: 2px solid #333333;
  letter-spacing: 0.5px;
`;

const LogoImage = styled.img`
  height: 45px;
  width: 45px;
  border-radius: 12px;
  object-fit: cover;
`;

const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 10px 0;
  margin-top: 20px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px 20px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #FFFFFF;
  font-weight: 500;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
  background: ${props => props.active ? '#808080' : 'transparent'};
  transform: ${props => props.active ? 'translateX(5px)' : 'none'};
  box-shadow: ${props => props.active ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'};

  &:hover {
    background: #808080;
    color: #fff;
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: 20px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #fff;
    transform: ${props => props.active ? 'scaleY(1)' : 'scaleY(0)'};
    transition: transform 0.2s;
  }

  &:hover:before {
    transform: scaleY(1);
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  background: #E8EEF4;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  background: #FFFFFF;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(44, 62, 80, 0.1);
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 20px;
  object-fit: cover;
`;

const UserInfo = styled.div`
  h1 {
    font-size: 28px;
    color: #2C3E50;
    margin: 0 0 8px;
    font-weight: 700;
  }
  p {
    color: #7F8C8D;
    font-size: 16px;
    margin: 0;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: #FFFFFF;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(44, 62, 80, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: black;
  }

  h3 {
    color: #7F8C8D;
    font-size: 16px;
    margin: 0 0 15px;
    font-weight: 500;
  }

  p {
    color: #2C3E50;
    font-size: 36px;
    font-weight: 700;
    margin: 0;
  }
`;

const ActivitySection = styled.div`
  background: #FFFFFF;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(44, 62, 80, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: black;
  }

  h2 {
    margin: 0 0 25px;
    color: #2C3E50;
    font-size: 22px;
    font-weight: 700;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ActivityItem = styled.div`
  padding: 20px;
  background: #F8FAFC;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s ease;

  &:hover {
    background: #EDF2F7;
  }

  span {
    &:first-child {
      color: #2C3E50;
      font-weight: 500;
    }
    &:last-child {
      color: #7F8C8D;
      font-size: 14px;
    }
  }
`;

const NotificationPopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #FFFFFF;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(44, 62, 80, 0.15);
  z-index: 1000;
  width: 500px;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  h3 {
    margin: 0;
    color: #2C3E50;
    font-size: 24px;
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #7F8C8D;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  transition: 0.2s ease;
  
  &:hover {
    color: #2C3E50;
  }
`;

const NotificationCard = styled.div`
  background: #F8FAFC;
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .icon-text {
    display: flex;
    align-items: center;
    gap: 20px;

    svg {
      font-size: 24px;
      color: #000000;
    }

    .text {
      h4 {
        margin: 0;
        color: #2C3E50;
        font-size: 18px;
        font-weight: 600;
      }
      p {
        margin: 5px 0 0;
        color: #7F8C8D;
        font-size: 14px;
      }
    }
  }
`;

const Checkbox = styled.input`
  width: 22px;
  height: 22px;
  cursor: pointer;
  accent-color: #3498DB;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 16px;
  background: black;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 25px;
  font-size: 16px;
  font-weight: 600;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const EventCard = styled.div`
  background: #FFFFFF;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 10px;
    color: #2C3E50;
  }

  p {
    color: #7F8C8D;
    margin: 5px 0;
  }

  .date {
    color: #3498DB;
    font-weight: 600;
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 15px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-top: 40px;
`;

const RecentActivityContainer = styled.div`
  background: #FFFFFF;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const NotificationsContainer = styled.div`
  background: #FFFFFF;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  svg {
    color: #1a237e;
  }

  p {
    margin: 0;
    color: #2c3e50;
  }

  small {
    color: #7f8c8d;
  }
`;

export default UserDashboard;
