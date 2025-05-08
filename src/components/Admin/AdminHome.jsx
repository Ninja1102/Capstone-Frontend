import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaBell,
  FaComments,
  FaUserClock,
  FaBuilding,
  FaClipboardList,
  FaShieldAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import axios from "axios";


const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalEvents: 0,
    activeResidents: 0,
    pendingApprovals: 0,
  });

  const [notifications, setNotifications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const token = sessionStorage.getItem('jwtToken');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    if (!token || userId !== '681c32fccc57fc42d81613c2') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const residentsResponse = await axios.get(
          "http://localhost:9997/api/residents/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const totalResidents = residentsResponse.data.length;
        const activeResidents = residentsResponse.data.filter(
          (resident) => resident.status === "APPROVED"
        ).length;
        const pendingApprovals = residentsResponse.data.filter(
          (resident) => resident.status === "PENDING"
        ).length;

        const eventsResponse = await axios.get(
          "http://localhost:9997/event/getAllEvents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const totalEvents = eventsResponse.data.length;

        setStats({
          totalResidents,
          totalEvents,
          activeResidents,
          pendingApprovals,
        });

        const notificationsList = [
          ...residentsResponse.data
            .filter((resident) => resident.status === "PENDING")
            .map((resident) => ({
              id: `resident-${resident.userId}`,
              message: `New registration request from ${resident.userName}`,
            })),
          // ...eventsResponse.data
          //   .filter((event) => new Date(event.eventDate) > new Date())
          //   .map((event) => ({
          //     id: `event-${event.id}`,
          //     message: `Upcoming event: ${event.eventTitle}`,
          //     timestamp: new Date(event.eventDate).toLocaleString(),
          //   })),
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setNotifications(notificationsList.slice(0, 5));

        const activityList = [
          ...residentsResponse.data.map(resident => ({
            id: `activity-resident-${resident.userId}`,
            description: `Resident ${resident.userName} ${resident.status === 'ACTIVE' ? 'activated' : 'registered'}`,
            timestamp: new Date(resident.createdAt).toLocaleString()
          })),
          ...eventsResponse.data.map((event) => ({
            id: `activity-event-${event.id}`,
            description: `New event created: ${event.eventTitle}`,
            timestamp: new Date(event.eventDate).toLocaleString()
          }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setRecentActivity(activityList.slice(-5));

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        if (error.response && error.response.status === 401) {
          navigate("/");
        }
      }
    };

    fetchData();
  }, [navigate, token]);

  return (
    <PageWrapper>
      {/* <AdminNavBar/> */}
      <DashboardContainer>
        <DashboardHeader>
          <h1>Admin Dashboard</h1>
        </DashboardHeader>

        <StatsGrid>
          <StatCard onClick={() => navigate("/admin/users")}>
            <StatIcon>
              <FaUsers />
            </StatIcon>
            <StatInfo>
              <h3>{stats.totalResidents}</h3>
              <p>Total Residents</p>
            </StatInfo>
          </StatCard>

          <StatCard onClick={() => navigate("/admin/events")}>
            <StatIcon>
              <FaCalendarAlt />
            </StatIcon>
            <StatInfo>
              <h3>{stats.totalEvents}</h3>
              <p>Total Events</p>
            </StatInfo>
          </StatCard>

          <StatCard
            onClick={() =>
              navigate("/admin/users", { state: { activeTab: "active" } })
            }
          >
            <StatIcon>
              <FaChartLine />
            </StatIcon>
            <StatInfo>
              <h3>{stats.activeResidents}</h3>
              <p>Active Residents</p>
            </StatInfo>
          </StatCard>

          <StatCard
            onClick={() =>
              navigate("/admin/users", { state: { activeTab: "inactive" } })
            }
          >
            <StatIcon>
              <FaUserClock />
            </StatIcon>
            <StatInfo>
              <h3>{stats.pendingApprovals}</h3>
              <p>Pending Approvals</p>
            </StatInfo>
          </StatCard>
        </StatsGrid>

        <ContentGrid>
          <RecentActivityContainer>
            <SectionHeader>
              <SectionTitle>Recent Activity</SectionTitle>
            </SectionHeader>
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id}>
                <p>{activity.description}</p>
                <small>{activity.timestamp}</small>
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
                  <small>{notification.timestamp}</small>
                </div>
              </NotificationItem>
            ))}
          </NotificationsContainer>
        </ContentGrid>
      </DashboardContainer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  background: #f0f2f5;
  min-height: 100vh;
  margin-top: -30px;
`;

const DashboardContainer = styled.div`
  padding: 30px 40px;
  margin-top: 80px; // Space for navbar
  background: #f0f2f5;
  min-height: calc(100vh - 80px);
  color: #2c3e50;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  background: #ffffff;
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a237e;
    margin: 0;
    background: linear-gradient(45deg, #1a237e, #3949ab);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border-left: 5px solid #1a237e;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(26, 35, 126, 0.1) 100%
    );
    pointer-events: none;
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: #1a237e;
  background: rgba(26, 35, 126, 0.1);
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  ${StatCard}:hover & {
    transform: scale(1.1);
    background: rgba(26, 35, 126, 0.2);
  }
`;

const StatInfo = styled.div`
  h3 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
    color: #1a237e;
    transition: all 0.3s ease;
  }
  p {
    margin: 5px 0 0;
    color: #666;
    font-size: 1rem;
    font-weight: 500;
  }

  ${StatCard}:hover & h3 {
    transform: scale(1.05);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-top: 30px;
`;

const NotificationsContainer = styled.div`
  background: #ffffff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const NotificationItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8f9fa;
    border-radius: 8px;
    transform: translateX(5px);
  }

  svg {
    color: #1a237e;
    font-size: 1.2rem;
  }
`;

const RecentActivityContainer = styled.div`
  background: #ffffff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const ActivityItem = styled.div`
  padding: 15px;
  border-left: 4px solid #1a237e;
  margin: 10px 0;
  background: #f8f9fa;
  border-radius: 0 8px 8px 0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    background: #f0f2f5;
  }

  p {
    margin: 0;
    color: #2c3e50;
    font-weight: 500;
  }

  small {
    color: #666;
    font-size: 0.85rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #eef2f7;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a237e;
  margin: 0;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 50px;
    height: 3px;
    background: #1a237e;
    border-radius: 2px;
  }
`;

export default AdminHome;
