import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { getTimezones } from '../utils/timezone';

const EditEventModal = ({ event, onClose, onUpdate }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const timezones = getTimezones();

  useEffect(() => {
    loadProfiles();
    if (event) {
      setSelectedProfiles(event.profiles.map(p => p._id || p));
      setTimezone(event.timezone || 'UTC');
      
      const start = new Date(event.startDateTime);
      const end = new Date(event.endDateTime);
      
      setStartDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
      setEndDate(end.toISOString().split('T')[0]);
      setEndTime(end.toTimeString().slice(0, 5));
    }
  }, [event]);

  const loadProfiles = async () => {
    try {
      const data = await api.getProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles(prev =>
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setError('End date/time must be after start date/time');
      return;
    }

    setLoading(true);
    try {
      await api.updateEvent(event._id, {
        profiles: selectedProfiles,
        timezone,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString()
      });

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      setError(error.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Event</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Profiles (Select Multiple)</label>
            <div className="profiles-list">
              {profiles.map(profile => (
                <label key={profile._id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedProfiles.includes(profile._id)}
                    onChange={() => handleProfileToggle(profile._id)}
                  />
                  <span>{profile.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date & Time</label>
            <div className="datetime-group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>End Date & Time</label>
            <div className="datetime-group">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
                required
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;