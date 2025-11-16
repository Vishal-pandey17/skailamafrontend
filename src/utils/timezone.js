
// Get all timezones
export const getTimezones = () => {
    return Intl.supportedValuesOf('timeZone');
  };
  
  // Format date in specific timezone
  export const formatDateInTimezone = (date, timezone) => {
    if (!date) return '';
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(d);
  };
  
  // Convert date to ISO string for a specific timezone
  export const convertToTimezoneISO = (dateString, timezone) => {
    // Parse the date string as if it's in the given timezone
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;
  
    // Create ISO string
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  };