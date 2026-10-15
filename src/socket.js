import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_SERVER_URL;

// Initialize outside the component cycle
export const socket = (accessToken) =>
  new io(URL, {
    autoConnect: false, // Defer connection until explicit invocation
    transports: ['websocket'], // Restrict to WebSockets for better development scalability
    withCredentials: true,
    auth: {
      token: accessToken,
    },
  });
