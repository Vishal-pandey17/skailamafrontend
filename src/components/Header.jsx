import { useState, useEffect } from 'react';
import { api } from '../services/api';

const Header = ({ currentProfile, setCurrentProfile, onProfileChange }) => {
  const [profiles, setProfiles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await api.getProfiles();
      setProfiles(data);
      if (data.length > 0 && !currentProfile) {
        setCurrentProfile(data[0]);
        onProfileChange(data[0]);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  };

  const handleProfileSelect = (e) => {
    const profileId = e.target.value;
    const profile = profiles.find(p => p._id === profileId);
    if (profile) {
      setCurrentProfile(profile);
      onProfileChange(profile);
    }
  };

  const handleAddProfile = async (e) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    try {
      const newProfile = await api.createProfile(newProfileName.trim());
      setProfiles([...profiles, newProfile]);
      setNewProfileName('');
      setShowAddForm(false);
      setCurrentProfile(newProfile);
      onProfileChange(newProfile);
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Failed to create profile');
    }
  };

  return (
    <div className="header">
      <div className="header-left">
        <h1>Event Management System</h1>
      </div>
      <div className="header-right">
        <select
          className="profile-select"
          value={currentProfile?._id || ''}
          onChange={handleProfileSelect}
        >
          <option value="">Select Current Profile</option>
          {profiles.map(profile => (
            <option key={profile._id} value={profile._id}>
              {profile.name}
            </option>
          ))}
        </select>
        <button
          className="add-profile-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + Add New User
        </button>
        {showAddForm && (
          <form className="add-profile-form" onSubmit={handleAddProfile}>
            <input
              type="text"
              className="profile-input"
              placeholder="Enter user name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              autoFocus
            />
            <button type="submit">Add</button>
            <button type="button" onClick={() => {
              setShowAddForm(false);
              setNewProfileName('');
            }}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Header;

