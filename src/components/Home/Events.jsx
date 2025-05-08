import { useNavigate } from "react-router-dom";
import { FocusCards } from "../ui/FocusCards";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaFilter, FaSearch, FaSortAmountDown, FaTimes } from "react-icons/fa";
import EventForm from "../EventForm";

export default function Events() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("jwtToken");
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'upcoming', or 'past'
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9997/event/getAllEvents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.data;
        setCards(data);
        setFilteredCards(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  const handleadd = () => {
    navigate('/create-event')
  }

  useEffect(() => {
    let filtered = [...cards];
    const currentDate = new Date();
    
    if (timeFilter !== 'all') {
      filtered = filtered.filter(card => {
        const eventDate = new Date(card.eventDate);
        if (timeFilter === 'upcoming') {
          return eventDate >= currentDate;
        } else {
          return eventDate < currentDate;
        }
      });
    }
    
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(card => {
        const eventDate = new Date(card.eventDate);
        return eventDate.getMonth() === parseInt(selectedMonth);
      });
    }
    
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredCards(filtered);
  }, [selectedMonth, searchTerm, cards, sortOrder, timeFilter]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div style={{ marginTop: "80px" }}>
      {/* {showEventForm && (
        <Modal onClick={() => setShowEventForm(false)}>
          <ScrollableEventForm onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setShowEventForm(false)}>
              <FaTimes />
            </CloseButton>
            <EventForm />
          </ScrollableEventForm>
        </Modal>
      )} */}
      
      <TopControls>
        <SearchContainer>
          <FaSearch color="#666" />
          <SearchInput 
            type="text" 
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <AddEventButton onClick={handleadd}>Add an Event</AddEventButton>

        <SortButton onClick={toggleSortOrder}>
          <FaSortAmountDown />
          {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
        </SortButton>
        
        <FilterContainer>
          <FaFilter color="#666" />
          <FilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Events</option>
            <option value="past">Past Events</option>
          </FilterSelect>
          <FilterSelect value={selectedMonth} onChange={handleMonthChange}>
            <option value="all">Filter by Month</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </FilterSelect>
        </FilterContainer>
      </TopControls>
      <FocusCards cards={filteredCards} />
    </div>
  );
}

const EventsContainer = styled.div`
  margin-top: 140px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0 20px;
`;

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: #f8f9fa;
  padding: 15px 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #ddd;
  min-width: 250px;

  &:focus-within {
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  padding: 4px 8px;
  font-size: 16px;
  width: 100%;
  margin-left: 8px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterSelect = styled.select`
  padding: 12px 20px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 16px;
  cursor: pointer;
  background: white;
  min-width: 200px;
  color: #444;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #000000;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
  }

  &:hover {
    border-color: #999;
  }

  option {
    padding: 10px;
    background: white;
    color: #444;
  }
`;

const AddEventButton = styled.button`
  padding: 12px 24px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background: #333333;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
  }
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

const ScrollableEventForm = styled.div`
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  border-radius: 10px;
  padding: 20px;
  
  /* Custom scrollbar styles */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  z-index: 1;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;
