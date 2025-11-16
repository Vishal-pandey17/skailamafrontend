import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { getTimezones } from '../utils/timezone';

const CreateEvent = ({ onEventCreated }) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('UTC');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const timezones = getTimezones();

  useEffect(() => {
    loadProfiles();
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setShowAddUser(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

 // In the handleAddUser function, update it to:
const handleAddUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newUserName.trim()) return;

    try {
      // Use UTC as default timezone when creating from CreateEvent
      const newProfile = await api.createProfile(newUserName.trim(), 'UTC');
      setProfiles([...profiles, newProfile]);
      setSelectedProfiles([...selectedProfiles, newProfile._id]);
      setNewUserName('');
      setShowAddUser(false);
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (selectedProfiles.length === 0) {
      setError('Please select at least one profile');
      return;
    }

    if (!startDate || !startTime || !endDate || !endTime) {
      setError('Please fill all date and time fields');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      setError('End date/time must be after start date/time');
      return;
    }

    if (endDateTime < new Date()) {
      setError('End date/time cannot be in the past');
      return;
    }

    setLoading(true);
    try {
      await api.createEvent({
        profiles: selectedProfiles,
        timezone,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString()
      });

      // Reset form
      setSelectedProfiles([]);
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setTimezone('UTC');
      setError('');
      setDropdownOpen(false);
      setShowAddUser(false);

      if (onEventCreated) {
        onEventCreated();
      }
    } catch (error) {
      setError(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event">
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        {/* ---------------- PROFILE DROPDOWN WITH CHECKBOXES ---------------- */}
        <div className="form-group">
          <label>Profiles (Select Multiple)</label>

          <div className="multi-select-dropdown" ref={dropdownRef}>
            <div
              className="dropdown-header"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedProfiles.length === 0
                ? 'Select Profiles...'
                : `${selectedProfiles.length} Selected`}
              <span className="arrow">{dropdownOpen ? '▲' : '▼'}</span>
            </div>

            {dropdownOpen && (
              <div 
                className="dropdown-menu"
                onClick={(e) => e.stopPropagation()}
              >
                {profiles.map((profile) => (
                  <label key={profile._id} className="dropdown-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedProfiles.includes(profile._id)}
                      onChange={() => handleProfileToggle(profile._id)}
                    />
                    {profile.name}
                  </label>
                ))}

                <button
                  type="button"
                  className="add-profile-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAddUser(!showAddUser);
                  }}
                >
                  + Add New User
                </button>

                {showAddUser && (
                  <form 
                    className="add-profile-form" 
                    onSubmit={handleAddUser}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      className="profile-input"
                      placeholder="Enter user name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      autoFocus
                    />
                    <button type="submit">Add</button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowAddUser(false);
                        setNewUserName('');
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ---------------- TIMEZONE ---------------- */}
        <div className="form-group">
          <label>Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        {/* ---------------- START DATE & TIME ---------------- */}
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

        {/* ---------------- END DATE & TIME ---------------- */}
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

        <button type="submit" className="create-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;