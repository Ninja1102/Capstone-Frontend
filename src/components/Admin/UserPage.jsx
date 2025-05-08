import { useState, useEffect } from 'react';
import styled from 'styled-components';
import AdminNavBar from '../Admin/AdminNavBar';
import { FaSearch, FaFilter, FaEdit, FaTrash, FaUserPlus, FaSortAmountDown, FaChartBar, FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const token = sessionStorage.getItem('jwtToken');
  const [newUser, setNewUser] = useState({
    username: '',
    password: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9997/api/residents/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
      
      const total = response.data.length;
      const pending = response.data.filter(user => user.status === 'PENDING').length;
      const approved = response.data.filter(user => user.status === 'APPROVED').length;
      const rejected = response.data.filter(user => user.status === 'REJECTED').length;
      
      setStats({
        totalUsers: total,
        pendingUsers: pending,
        approvedUsers: approved,
        rejectedUsers: rejected
      });
    } catch (error) {
      console.error('Error fetching residents data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(user => {
        if (activeTab === 'active') return user.status === 'APPROVED';
        if (activeTab === 'inactive') return user.status === 'PENDING';
        if (activeTab === 'rejected') return user.status === 'REJECTED';
        return true;
      });
    }
    
    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.userName?.localeCompare(b.userName);
      return 0;
    });
    
    setFilteredUsers(filtered);
  }, [searchTerm, users, activeTab, sortBy]);

  const handleEdit = async (userId, action) => {
    const param = action ? "APPROVE" : "REJECT";
    try {
      const response = await axios.put(`http://localhost:9997/api/residents/action/${userId}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          action: param
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`http://localhost:9997/api/residents/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rp = await axios.post("http://localhost:9997/auth/register", {
        userName: newUser.username,
        password: newUser.password,
        role: "RESIDENT"
      });
      
      console.log(rp);
      setShowModal(false);
      fetchData();
      setNewUser({ username: '', password: ''});
    } catch (err) {
      console.error("Error during registration:", err);
    }
  };

  return (
    <>
      <AdminNavBar />
      <PageContainer>
        <StatsContainer>
          <StatCard>
            <h4>Total Users</h4>
            <p>{stats.totalUsers}</p>
          </StatCard>
          <StatCard>
            <h4>Pending Users</h4>
            <p>{stats.pendingUsers}</p>
          </StatCard>
          <StatCard>
            <h4>Approved Users</h4>
            <p>{stats.approvedUsers}</p>
          </StatCard>
          <StatCard>
            <h4>Rejected Users</h4>
            <p>{stats.rejectedUsers}</p>
          </StatCard>
        </StatsContainer>

        <ControlsContainer>
          <SearchBar>
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <ButtonGroup>
            <ActionButton onClick={() => setSortBy('name')}>
              <FaSortAmountDown />
              Sort by Name
            </ActionButton>
            <ActionButton $variant="primary" onClick={() => setShowModal(true)}>
              <FaUserPlus />
              Add User
            </ActionButton>
          </ButtonGroup>
        </ControlsContainer>

        <TabContainer>
          <TabList>
            <Tab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Users</Tab>
            <Tab $active={activeTab === 'active'} onClick={() => setActiveTab('active')}>Approved</Tab>
            <Tab $active={activeTab === 'inactive'} onClick={() => setActiveTab('inactive')}>Pending</Tab>
            <Tab $active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')}>Rejected</Tab>
          </TabList>
        </TabContainer>

        <UserGrid>
          {filteredUsers.map(user => (
            <UserCard key={user.userId}>
              <UserActions>
                {user.status === 'PENDING' && (
                  <>
                    <CardActionButton $approve onClick={() => handleEdit(user.userId, true)}>
                      <FaCheck />
                    </CardActionButton>
                    <CardActionButton onClick={() => handleEdit(user.userId, false)}>
                      <FaTimes />
                    </CardActionButton>
                  </>
                )}
                {/* <CardActionButton $delete onClick={() => handleDelete(user.userId)}>
                  <FaTrash />
                </CardActionButton> */}
              </UserActions>
              <UserAvatar>
                {user.userName?.charAt(0)}
              </UserAvatar>
              <UserInfo>
                <UserName>{user.userName}</UserName>
                <UserDetail>{user.email}</UserDetail>
                <UserDetail>{user.phoneNumber}</UserDetail>
                <UserDetail>Role: {user.role}</UserDetail>
                <UserStatus $active={user.status === 'APPROVED'}>
                  {user.status}
                </UserStatus>
              </UserInfo>
            </UserCard>
          ))}
        </UserGrid>

        {showModal && (
          <Modal>
            <FormCard>
              <h2>Add New User</h2>
              <Form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required
                />
                <ButtonGroup>
                  <ActionButton type="submit" $variant="primary">
                    Register User
                  </ActionButton>
                  <ActionButton type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </ActionButton>
                </ButtonGroup>
              </Form>
            </FormCard>
          </Modal>
        )}
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  padding: 90px 50px 50px;
  background: #f0f2f5;
  min-height: 100vh;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: #ffffff;
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 20px;
  width: 300px;
  border: 1px solid #eef2f7;

  input {
    border: none;
    outline: none;
    margin-left: 10px;
    width: 100%;
    background: transparent;
    color: #2c3e50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$variant === 'primary' ? '#1a237e' : '#3949ab'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(26,35,126,0.2);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: #ffffff;
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  border-left: 5px solid #1a237e;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  h4 {
    color: #666;
    margin: 0;
    font-size: 1rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a237e;
    margin: 0;
  }
`;

const TabContainer = styled.div`
  margin-bottom: 30px;
  background: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
`;

const TabList = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 2px solid #eef2f7;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${props => props.$active ? '#1a237e' : '#666'};
  border-bottom: 2px solid ${props => props.$active ? '#1a237e' : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    color: #1a237e;
  }
`;

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

const UserCard = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 15px;
  transition: all 0.3s ease;
  position: relative;
  border-left: 5px solid #1a237e;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const UserActions = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
`;

const CardActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  padding: 8px;
  position: relative;

  &:hover {
    color: ${props => props.$delete ? '#f44336' : '#1a237e'};
    transform: scale(1.1);
  }

  &:hover::after {
    content: '${props => props.$delete ? 'Delete User' : props.$approve ? 'Approve User' : 'Reject User'}';
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
  }
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(26,35,126,0.1);
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #1a237e;
`;

const UserInfo = styled.div`
  text-align: center;
`;

const UserName = styled.h3`
  margin: 0 0 5px;
  color: #1a237e;
  font-size: 1.1rem;
`;

const UserDetail = styled.p`
  margin: 3px 0;
  color: #666;
  font-size: 0.85rem;
`;

const UserStatus = styled.span`
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  background: ${props => props.$active ? 'rgba(26,35,126,0.1)' : '#ffebee'};
  color: ${props => props.$active ? '#1a237e' : '#f44336'};
  margin-top: 5px;
  display: inline-block;
  font-weight: 500;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;

  h2 {
    color: #1a237e;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 2px rgba(26,35,126,0.1);
  }
`;

export default UserPage;