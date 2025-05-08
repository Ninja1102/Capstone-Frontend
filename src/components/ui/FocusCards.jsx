"use client";
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import CommentSection from "../Feedbackform";

export const Card = React.memo(({
  card,
  index,
  hovered,
  setHovered,
  onCardClick
}) => (
  <div
    onClick={() => onCardClick(card)}
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out cursor-pointer",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}>
    {card.eventImg ? (
      <img
        src={card.eventImg}
        alt={card.eventTitle}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
        <h1 className="text-4xl font-bold text-gray-600 dark:text-gray-400">
          {card.eventTitle}
        </h1>
      </div>
    )}
    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex flex-col justify-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}>
      <h1 className=" top-5 left-5 text-white text-2xl font-bold z-10 px-4 py-2 bg-gradient-to-r from-black/80 via-black/60 to-transparent rounded-lg shadow-lg backdrop-blur-sm border border-white/10">{card.eventTitle}</h1>
        <div
        className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200 mb-4">
        {(() => {
      const date = new Date(card.eventDate);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const hour = date.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const message = `${day}${getSuffix(day)} ${month} at ${hour12}${ampm}`;
      function getSuffix(day) {
        if (day >= 11 && day <= 13) return 'th';
        const lastDigit = day % 10;
        switch (lastDigit) {
          case 1: return 'st';
          case 2: return 'nd'; 
          case 3: return 'rd';
          default: return 'th';
        }
      }
      return message;
    })()}
      </div>
      <div
        className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {card.eventDescription}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards({
  cards
}) {
  const [hovered, setHovered] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (card) => {
    setSelectedEvent(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
        {cards.map((card, index) => (
          <Card
            key={card.eventId}
            card={card}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {selectedEvent && (
        <CommentSection
          eventId={selectedEvent.eventId}
          eventData={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
