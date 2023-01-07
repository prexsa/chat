import { useState } from 'react';
import { SocketProvider } from './socketContext';
import Chat from './Chat';

function ChatProvider() {
  return (
    <SocketProvider>
      <Chat />
    </SocketProvider>
  )
}

export default ChatProvider;

// https://codepen.io/robinllopis/pen/mLrRRB
// https://www.freecodecamp.org/news/build-a-realtime-chat-app-with-react-express-socketio-and-harperdb/