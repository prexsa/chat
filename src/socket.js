import { io } from "socket.io-client";

const URL = "http://localhost:9000";
// const socket = io(URL, { autoConnect: false });
const socket = io(URL);

socket.onAny((event, ...args) => {
  // console.log(event, args)
});

export default socket;