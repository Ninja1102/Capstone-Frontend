import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion } from 'framer-motion';
import AdminNavBar from '../Admin/AdminNavBar';

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #e8eaf6;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  margin-top: 4rem;
`;

const Header = styled.div`
  background-color: #1a237e;
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 6px 12px rgba(0,0,0,0.2);
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 3rem;
  width: 100%;
  max-width: 1300px;
`;

const LeftSection = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #c5cae9;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const WelcomeText = styled.h1`
  font-size: 2rem;
  color: #1a237e;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #303f9f;
`;

const RightSection = styled.div`
  flex: 2;
`;

const FeedbackCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const Title = styled.h2`
  color: #1a237e;
  margin-bottom: 1.5rem;
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FeedbackItem = styled(motion.div)`
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 10px;
  border-left: 5px solid #1a237e;
`;

const UserInfo = styled.div`
  font-weight: bold;
  color: #333;
`;

const Message = styled.p`
  font-style: italic;
  margin: 5px 0;
`;

const EventTag = styled.div`
  color: #666;
  font-size: 0.95rem;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 4rem;
  z-index: 1000;
  background-color: #1a237e;
`;

const NoData = styled.p`
  text-align: center;
  color: #999;
`;

const PaginationControls = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const PageButton = styled.button`
  background: #1a237e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

// Component Logic
const AdminFeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        const headers = { Authorization: token };
        const response = await axios.get('http://localhost:9997/feedback/get-feedbacks', { headers });
        setFeedbackList(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentFeedback = feedbackList.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(feedbackList.length / itemsPerPage);

  return (
    <PageWrapper>
      <AdminNavBar />
      <ContentWrapper>
        <Header>
          <h1>Resident Feedback</h1>
        </Header>
        <PageContainer>
          <ContentContainer>
            <LeftSection>
              <WelcomeText>User Feedback</WelcomeText>
              <Description>Read what our community has to say</Description>
            </LeftSection>
            <RightSection>
              <FeedbackCard>
                <Title>Feedback Messages</Title>
                <FeedbackList>
                  {currentFeedback.length > 0 ? (
                    currentFeedback.map((fb) => (
                      <FeedbackItem key={fb._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                        {/* <UserInfo>User ID: {fb.userId}</UserInfo> */}
                        <UserInfo>User Name: {fb.userName}</UserInfo>
                        <Message>"{fb.feedbackMessage?.trim()}"</Message>
                        <EventTag>Event Title: {fb.eventTitle}</EventTag>
                      </FeedbackItem>
                    ))
                  ) : (
                    <NoData>No feedback available.</NoData>
                  )}
                </FeedbackList>
                {feedbackList.length > itemsPerPage && (
                  <PaginationControls>
                    <PageButton onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                      Prev
                    </PageButton>
                    <PageButton onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>
                      Next
                    </PageButton>
                  </PaginationControls>
                )}
              </FeedbackCard>
            </RightSection>
          </ContentContainer>
        </PageContainer>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AdminFeedbackPage;
