import React, { useState, useEffect } from 'react';
import { PlusCircle, X } from 'lucide-react';
import axios from 'axios';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CommentSection from '../Feedbackform';

const localizer = momentLocalizer(moment);

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newReminder, setNewReminder] = useState({
    eventId: '',
    needsSms: false,
    needsCall: false, 
    needsEmail: false
  });

  const token = sessionStorage.getItem('jwtToken');
  const userId = sessionStorage.getItem('userId');


    const fetchAllData = async () => {
      try {
        // Get all events
        const eventsResponse = await axios.get(`http://localhost:9997/event/getAllEvents`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const reminderResponse = await axios.get(`http://localhost:9997/reminder/getbyUserId/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const reminderEventIds = new Set(
          reminderResponse.data
            .filter(reminder => reminder.event && reminder.event.eventId) // Filter out nulls or missing eventId
            .map(reminder => reminder.event.eventId)
        );
        
        const formattedEvents = eventsResponse.data.map(event => {
          const eventDate = new Date(event.eventDate);
          const hasReminder = reminderEventIds.has(event.eventId);
          return {
            id: event.eventId,
            title: event.eventTitle,
            start: eventDate,
            end: new Date(eventDate.setHours(eventDate.getHours() + 1)),
            description: event.eventDescription,
            reminderSet: hasReminder,
            allDay: false,
            eventImg: event.eventImg,
            eventData: event
          };
        });
        setEvents(formattedEvents);

        const currentDate = new Date();
        const availableEvents = eventsResponse.data.filter(event => {
          const eventDate = new Date(event.eventDate);
          return !reminderEventIds.has(event.eventId) && eventDate >= currentDate;
        });
        setAvailableEvents(availableEvents);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:9997/reminder/create',
        {
          userId,
          eventId: newReminder.eventId,
          needSms: newReminder.needsSms,
          needCall: newReminder.needsCall,
          needEmail: newReminder.needsEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      

      setNewReminder({
        eventId: '',
        needsSms: false,
        needsCall: false,
        needsEmail: false
      });
      setShowAddReminder(false);
      

      fetchAllData();

    } catch (error) {
      console.error("Error creating reminder:", error);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowComments(true);
  };

  const eventStyleGetter = (event) => {
    if (event.reminderSet) {
      return {
        style: {
          backgroundColor: '#4CAF50',
          borderRadius: '5px',
          opacity: 0.8,
          color: 'white',
          border: '0px',
          display: 'block'
        }
      };
    }
    return {};
  };

  const formats = {
    eventTimeRangeFormat: () => null,
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, 'HH:mm', culture),
  };

  return (
    <div className="flex flex-col items-center mt-16 w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black drop-shadow-sm underline">Schedule</h2>

          <button 
            onClick={() => setShowAddReminder(true)}
            className="flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Reminder
          </button>
        </div>

        <div className="h-[75vh] rounded-xl overflow-hidden shadow-inner bg-white">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            className="p-4"
            eventPropGetter={eventStyleGetter}
            formats={formats}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        <div className="mt-4 text-sm text-gray-600 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#4CAF50] rounded"></div>
            <span>Events with reminder</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#3174ad] rounded"></div>
            <span>Events without reminder</span>
          </div>
        </div>

        {/* Comments Modal */}
        {selectedEvent && (
          <CommentSection 
            eventId={selectedEvent.id}
            eventData={selectedEvent.eventData}
            isOpen={showComments}
            onClose={() => {
              setShowComments(false);
              setSelectedEvent(null);
            }}
          />
        )}

        {/* Add Reminder Modal */}
        {showAddReminder && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-[500px]">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">Add Reminder</h3>
                  <button 
                    onClick={() => setShowAddReminder(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleAddReminder} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Event</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={newReminder.eventId}
                      onChange={(e) => setNewReminder({...newReminder, eventId: e.target.value})}
                      required
                    >
                      <option value="">Select an event</option>
                      {availableEvents.map(event => (
                        <option key={event.eventId} value={event.eventId}>
                          {event.eventTitle} - {new Date(event.eventDate).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="needsSms"
                        className="mr-2"
                        checked={newReminder.needsSms}
                        onChange={(e) => setNewReminder({...newReminder, needsSms: e.target.checked})}
                      />
                      <label htmlFor="needsSms" className="text-sm text-gray-700">Send SMS Reminder</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="needsCall"
                        className="mr-2"
                        checked={newReminder.needsCall}
                        onChange={(e) => setNewReminder({...newReminder, needsCall: e.target.checked})}
                      />
                      <label htmlFor="needsCall" className="text-sm text-gray-700">Send Call Reminder</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="needsEmail"
                        className="mr-2"
                        checked={newReminder.needsEmail}
                        onChange={(e) => setNewReminder({...newReminder, needsEmail: e.target.checked})}
                      />
                      <label htmlFor="needsEmail" className="text-sm text-gray-700">Send Email Reminder</label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
                    <button 
                      type="submit"
                      className="w-full sm:w-1/2 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
                    >
                      Create Reminder
                    </button>
                    <button 
                      type="button" 
                      className="w-full sm:w-1/2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setShowAddReminder(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;