import { io } from "socket.io-client";

const URL = "http://localhost:9000";
const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  // console.log(event, args)
});
/*
const socket = user =>
  // console.log('user: ', user)
  new io(URL, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: user.accessToken,
    }
  });
*/

export default socket;