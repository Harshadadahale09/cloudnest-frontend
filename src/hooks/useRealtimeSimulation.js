import { useState, useEffect, useCallback } from 'react';

// Simulated WebSocket-like real-time events
const eventTypes = ['file_added', 'file_deleted', 'file_modified', 'user_joined', 'user_left'];

export const useRealtimeSimulation = (options = {}) => {
  const { 
    enabled = true, 
    interval = 10000,
    onEvent = () => {} 
  } = options;

  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [eventCount, setEventCount] = useState(0);

  // Simulate connection
  useEffect(() => {
    if (!enabled) return;

    // Simulate WebSocket connection delay
    const connectionTimeout = setTimeout(() => {
      setConnected(true);
      console.log('[WebSocket Simulation] Connected');
    }, 1000);

    return () => {
      clearTimeout(connectionTimeout);
      setConnected(false);
      console.log('[WebSocket Simulation] Disconnected');
    };
  }, [enabled]);

  // Simulate incoming events
  useEffect(() => {
    if (!connected || !enabled) return;

    const eventInterval = setInterval(() => {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
        payload: generateEventPayload(eventType),
      };

      setLastEvent(event);
      setEventCount(prev => prev + 1);
      onEvent(event);

      console.log('[WebSocket Simulation] Event received:', event);
    }, interval);

    return () => clearInterval(eventInterval);
  }, [connected, enabled, interval, onEvent]);

  // Send simulated message
  const send = useCallback((message) => {
    if (!connected) {
      console.warn('[WebSocket Simulation] Cannot send - not connected');
      return false;
    }
    console.log('[WebSocket Simulation] Sending:', message);
    return true;
  }, [connected]);

  // Reconnect simulation
  const reconnect = useCallback(() => {
    setConnected(false);
    setTimeout(() => setConnected(true), 1000);
  }, []);

  return {
    connected,
    lastEvent,
    eventCount,
    send,
    reconnect,
  };
};

// Generate realistic payloads for different event types
function generateEventPayload(eventType) {
  const users = ['alice@example.com', 'bob@example.com', 'carol@example.com'];
  const files = ['Document.pdf', 'Image.png', 'Spreadsheet.xlsx', 'Presentation.pptx'];

  switch (eventType) {
    case 'file_added':
      return {
        fileName: files[Math.floor(Math.random() * files.length)],
        addedBy: users[Math.floor(Math.random() * users.length)],
        size: Math.floor(Math.random() * 10000) + 'KB',
      };
    case 'file_deleted':
      return {
        fileName: files[Math.floor(Math.random() * files.length)],
        deletedBy: users[Math.floor(Math.random() * users.length)],
      };
    case 'file_modified':
      return {
        fileName: files[Math.floor(Math.random() * files.length)],
        modifiedBy: users[Math.floor(Math.random() * users.length)],
        changes: ['content', 'permissions', 'name'][Math.floor(Math.random() * 3)],
      };
    case 'user_joined':
    case 'user_left':
      return {
        user: users[Math.floor(Math.random() * users.length)],
      };
    default:
      return {};
  }
}

export default useRealtimeSimulation;
