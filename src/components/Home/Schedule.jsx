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

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchAllData();
    const intervalId = setInterval(fetchAllData, 30000); // 30s

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  const fetchAllData = async () => {
    try {
      const [eventsRes, remindersRes] = await Promise.all([
        axios.get(`http://localhost:9997/event/getAllEvents`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`http://localhost:9997/reminder/getbyUserId/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const now = new Date();
      const reminderEventIds = new Set(
        remindersRes.data
          .filter(r => r.event?.eventId)
          .map(r => r.event.eventId)
      );

      const futureEvents = eventsRes.data
        .filter(e => new Date(e.eventDate) >= now)
        .map(event => {
          const eventDate = new Date(event.eventDate);
          const hasReminder = reminderEventIds.has(event.eventId);

          // Add check to exclude reminders for the event posted by the logged-in user
          const shouldShowReminder = event.userId !== userId; // Exclude own events

          return {
            id: event.eventId,
            title: event.eventTitle,
            start: eventDate,
            end: new Date(eventDate.getTime() + 60 * 60 * 1000),
            description: event.eventDescription,
            reminderSet: hasReminder && shouldShowReminder,
            allDay: false,
            eventImg: event.eventImg,
            eventData: event
          };
        });

      setEvents(futureEvents);
      setAvailableEvents(eventsRes.data.filter(e =>
        new Date(e.eventDate) >= now && !reminderEventIds.has(e.eventId) && e.userId !== userId // Exclude own events for available ones
      ));
    } catch (error) {
      console.error('Error fetching events/reminders:', error);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9997/reminder/create', {
        userId,
        eventId: newReminder.eventId,
        needSms: newReminder.needsSms,
        needCall: newReminder.needsCall,
        needEmail: newReminder.needsEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewReminder({ eventId: '', needsSms: false, needsCall: false, needsEmail: false });
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
    return {
      style: {
        backgroundColor: event.reminderSet ? '#4CAF50' : '#3174ad',
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: '0px'
      }
    };
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
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Add Reminder</h3>
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleAddReminder} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Event</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      value={newReminder.eventId}
                      onChange={(e) => setNewReminder({ ...newReminder, eventId: e.target.value })}
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
                    {['needsSms', 'needsCall', 'needsEmail'].map(field => (
                      <div key={field} className="flex items-center">
                        <input
                          type="checkbox"
                          id={field}
                          className="mr-2"
                          checked={newReminder[field]}
                          onChange={(e) => setNewReminder({ ...newReminder, [field]: e.target.checked })}
                        />
                        <label htmlFor={field} className="text-sm text-gray-700">
                          {`Send ${field.replace('needs', '')} Reminder`}
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Create Reminder
                  </button>
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
