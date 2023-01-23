import { io } from "socket.io-client";

// const URL = "http://localhost:9000";
const URL = process.env.REACT_APP_SERVER_URL;
/*const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});*/

/*socket.onAny((event, ...args) => {
  // console.log(event, args)
});*/

const socket = accessToken =>
  new io(URL, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: accessToken,
    }
  });


export default socket;