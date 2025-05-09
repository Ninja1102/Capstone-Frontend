import { useNavigate } from "react-router-dom";
import { FocusCards } from "../ui/FocusCards";
import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";

export default function Events() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("jwtToken");

  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

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
        const currentDate = new Date();

        // Exclude past events
        const upcomingEvents = data.filter((card) => new Date(card.eventDate) >= currentDate);
        setCards(upcomingEvents);
        setFilteredCards(upcomingEvents);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...cards];

    if (selectedMonth !== "all") {
      filtered = filtered.filter((card) => {
        const eventDate = new Date(card.eventDate);
        return eventDate.getMonth() === parseInt(selectedMonth);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (card) =>
          card.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.eventDate);
      const dateB = new Date(b.eventDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredCards(filtered);
    setCurrentPage(1); // Reset to first page on new filter
  }, [selectedMonth, searchTerm, cards, sortOrder]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleAddEvent = () => {
    navigate("/create-event");
  };

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  return (
    <div style={{ marginTop: "80px" }}>
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

        <AddEventButton onClick={handleAddEvent}>Add an Event</AddEventButton>

        <SortButton onClick={toggleSortOrder}>
          <FaSortAmountDown />
          {sortOrder === "asc" ? "Oldest First" : "Newest First"}
        </SortButton>

        <FilterContainer>
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

      <FocusCards cards={currentCards} />

      {totalPages > 1 && (
        <Pagination>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &laquo; Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </Pagination>
      )}
    </div>
  );
}

// Styled Components
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
`;

const AddEventButton = styled.button`
  padding: 12px 24px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #333333;
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

  &:hover {
    background: #f0f0f0;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  gap: 20px;

  button {
    padding: 8px 16px;
    border: none;
    background: #000;
    color: white;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background: #333;
    }
  }

  span {
    font-size: 16px;
  }
`;
