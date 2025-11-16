const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
    getProfiles: async () => {
        const res = await fetch(`${API_BASE_URL}/profiles`);
        return res.json();
    },

    createProfile: async (name, timezone) => {
        const res = await fetch(`${API_BASE_URL}/profiles`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify({name, timezone: timezone || 'UTC'})
        });
        return res.json();
    },

    updateProfile: async (id, timezone) => {
        const res = await fetch(`${API_BASE_URL}/profiles/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({timezone})
        });
        return res.json();
    },

    getEvents: async(profileId) => {
        const url = profileId
        ? `${API_BASE_URL}/events/profile/${profileId}`
        : `${API_BASE_URL}/events`;

        const res = await fetch(url);
        return res.json();
    },

    createEvent: async(eventData) => {
        const res = await fetch(`${API_BASE_URL}/events`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(eventData)
        });
        return res.json();
    },

    updateEvent: async (id, eventData) => {
        const res = await fetch(`${API_BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(eventData)
        });
        return res.json();
    },

    getEvent: async(id) => {
       const res = await fetch(`${API_BASE_URL}/events/${id}`);
       return res.json();
    }
};