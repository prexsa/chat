import { io } from "socket.io-client";

const URL = process.env.REACT_APP_SERVER_URL;

const socket = (accessToken) =>
  new io(URL, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: accessToken,
    },
  });

export default socket;
