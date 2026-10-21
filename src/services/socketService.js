import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SERVER_URL;

// Initialize outside the component cycle
export const socketService = (token) =>
  new io(SOCKET_URL, {
    autoConnect: false, // Defer connection until explicit invocation
    transports: ['websocket'], // Restrict to WebSockets for better development scalability
    withCredentials: true,
    auth: {
      token: token,
    },
  });
