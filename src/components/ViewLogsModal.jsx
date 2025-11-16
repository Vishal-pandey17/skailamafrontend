import { formatDateInTimezone } from '../utils/timezone';

const ViewLogsModal = ({ event, onClose }) => {
  if (!event) return null;

  const eventTimezone = event.timezone || 'UTC';
  const createdAt = formatDateInTimezone(event.createdAt, eventTimezone);
  const updatedAt = formatDateInTimezone(event.updatedAt, eventTimezone);

  const logs = [
    {
      action: 'Event Created',
      timestamp: createdAt,
      timezone: eventTimezone
    },
    ...(event.updatedAt && event.updatedAt !== event.createdAt ? [{
      action: 'Event Updated',
      timestamp: updatedAt,
      timezone: eventTimezone
    }] : [])
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Event Logs</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="logs-content">
          <div className="log-item">
            <strong>Event ID:</strong> {event._id}
          </div>
          <div className="log-item">
            <strong>Profiles:</strong> {event.profiles.map(p => p.name || p).join(', ')}
          </div>
          <div className="log-item">
            <strong>Timezone:</strong> {eventTimezone}
          </div>
          {logs.map((log, index) => (
            <div key={index} className="log-item">
              <strong>{log.action}:</strong> {log.timestamp} ({log.timezone})
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewLogsModal;