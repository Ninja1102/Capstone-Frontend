import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const CommentSection = ({ eventId, eventData, isOpen, onClose }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9997/feedback/get-feedback-by-eventId/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(1,response.data);

        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setMessage("Error loading comments. Please try again.");
      }
    };

    if (isOpen && eventId) {
      fetchComments();
    }
  }, [isOpen, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9997/feedback/create-feedback",
        {
          userId,
          eventId,
          feedbackMessage: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response1 = await fetch(`http://localhost:9997/api/residents/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response1.json();
    
      setComment("");
      setMessage("Comment posted successfully!");

      setTimeout(() => {
        setMessage("");
      }, 1000);
      setComments(prevComments => [...prevComments, {...response.data, userName: data.userName}]);
    } catch (error) {
      console.error("Error posting comment:", error);
      setMessage("Error posting comment. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <CommentContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ContentWrapper
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <EventImageSection>
            <EventImageWrapper>
              <EventImage
                src={eventData.eventImg || "default-event-image.jpg"}
                alt={eventData.eventTitle}
              />
            </EventImageWrapper>
            <EventTitle>{eventData.eventTitle}</EventTitle>
            <EventDate>
              {new Date(eventData.eventDate).toLocaleDateString()}
            </EventDate>
          </EventImageSection>

          <CommentingSection>
            <SectionHeader>
              <SectionTitle>Comments</SectionTitle>
              <CommentCount
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </CommentCount>
            </SectionHeader>
            <AnimatePresence>
              {message && (
                <MessageText
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {message}
                </MessageText>
              )}
            </AnimatePresence>
            <CommentsList>
              {comments.map((comment, index) => (
                <CommentItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CommentText>{comment.feedbackMessage}</CommentText>
                  <CommentAuthor>Posted by: {comment.userName}</CommentAuthor>
                </CommentItem>
              ))}
            </CommentsList>

            <CommentForm onSubmit={handleSubmit}>
              <CommentInput
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                required
              />
              <SubmitButton
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Post Comment
              </SubmitButton>
            </CommentForm>
          </CommentingSection>
        </ContentWrapper>
      </CommentContainer>
    </AnimatePresence>
  );
};

const CommentContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const EventImageSection = styled.div`
  flex: 0 0 40%;
  padding: 2.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const EventImageWrapper = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EventTitle = styled.h2`
  font-size: 1.8rem;
  margin: 1.5rem 0;
  color: #1a1a1a;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const EventDate = styled.p`
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
  background: rgba(255,255,255,0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CommentingSection = styled.div`
  flex: 0 0 60%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  background: white;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #1a1a1a;
  font-weight: 700;
  border-bottom: 3px solid #000000;
  padding-bottom: 0.5rem;
`;

const CommentCount = styled(motion.div)`
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

const MessageText = styled(motion.div)`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  color: #000000;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const CommentsList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 1rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #000000;
    border-radius: 4px;
  }
`;

const CommentItem = styled(motion.div)`
  padding: 1.2rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateX(5px);
    background: #f0f4f8;
  }
`;

const CommentText = styled.p`
  margin-bottom: 0.8rem;
  color: #1a1a1a;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const CommentAuthor = styled.p`
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  font-weight: 500;
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
`;

const CommentInput = styled.textarea`
  padding: 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 30px;
  resize: none;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.2);
    background: white;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  align-self: flex-end;
  letter-spacing: 0.5px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.3);
    transform: rotate(90deg);
  }
`;

export default CommentSection;
