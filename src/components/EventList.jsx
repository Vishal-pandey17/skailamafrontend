import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { formatDateInTimezone } from '../utils/timezone';
import EditEventModal from './EditEventModal';
import ViewLogsModal from './ViewLogsModal';

const EventList = ({ currentProfile, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState(null);
  const [viewLogsEvent, setViewLogsEvent] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');

  useEffect(() => {
    if (currentProfile) {
      // Set profile timezone when profile changes
      setSelectedTimezone(currentProfile.timezone || 'UTC');
      loadEvents();
    }
  }, [currentProfile, refreshTrigger]);

  const loadEvents = async () => {
    if (!currentProfile) return;

    setLoading(true);
    try {
      const data = await api.getEvents(currentProfile._id);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditEvent(event);
  };

  const handleViewLogs = (event) => {
    setViewLogsEvent(event);
  };

  const handleEventUpdated = () => {
    loadEvents();
    setEditEvent(null);
  };

  if (!currentProfile) {
    return (
      <div className="event-list">
        <h2>Events View in Timezone</h2>
        <p>Please select a profile to view events</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      <div className="event-list-header">
        <h2>Events View in Timezone</h2>

        {/* USER SPECIFIC TIMEZONE DISPLAY */}
        <div className="timezone-selector">
          <label>Timezone: </label>
          <input
            type="text"
            className="timezone-display"
            value={selectedTimezone}
            disabled
          />
        </div>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found for this profile</p>
      ) : (
        <div className="events-container">
          {events.map(event => {
            const startDateTime = formatDateInTimezone(event.startDateTime, selectedTimezone);
            const endDateTime = formatDateInTimezone(event.endDateTime, selectedTimezone);
            const createdAt = formatDateInTimezone(event.createdAt, selectedTimezone);
            const updatedAt = formatDateInTimezone(event.updatedAt, selectedTimezone);

            // Profile names
            const profileNames = event.profiles
              .map(p => (typeof p === 'object' ? p.name || 'Unknown' : 'Unknown'))
              .join(', ');

            return (
              <div key={event._id} className="event-card">
                <div className="event-header">
                  <h3>{profileNames}</h3>
                  <div className="event-actions">
                    <button className="edit-btn" onClick={() => handleEdit(event)}>
                      Edit
                    </button>
                    <button className="logs-btn" onClick={() => handleViewLogs(event)}>
                      View Logs
                    </button>
                  </div>
                </div>

                <div className="event-details">
                  <p><strong>Start:</strong> {startDateTime}</p>
                  <p><strong>End:</strong> {endDateTime}</p>
                  <p><strong>Created On:</strong> {createdAt}</p>
                  <p><strong>Updated On:</strong> {updatedAt}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editEvent && (
        <EditEventModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onUpdate={handleEventUpdated}
        />
      )}

      {viewLogsEvent && (
        <ViewLogsModal
          event={viewLogsEvent}
          onClose={() => setViewLogsEvent(null)}
        />
      )}
    </div>
  );
};

export default EventList;
