import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from '../components/chat/Sidebar';
import MainChat from '../components/chat/MainChat';

import chats from './MockChatData.json';

export default function Chat() {
  const [activeChat, setActiveChat] = useState(null);
  // Storing messages in a dictionary keyed by chat ID
  const [allMessages, setAllMessages] = useState({});

  // Load mock data into state
  useEffect(() => {
    chats.map((chat) => {
      setAllMessages((prev) => ({
        ...prev,
        [chat.id]: [...chat.messages],
      }));
    });
  }, []);

  const handleSetActiveChat = (selectedChatIndex) =>
    setActiveChat(selectedChatIndex);

  // Get messages specifically for the active chat
  const currentMessages = activeChat ? allMessages[activeChat.id] || [] : [];

  const handleSendMessage = (text) => {
    const newMessage = {
      text: text,
      date: Date.now().toString(),
      sender: 'user',
    };
    setAllMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage],
    }));
  };
  // console.log({ currentMessages, activeChat });
  return (
    <Box sx={{ backgroundColor: '#f5f8fe' }}>
      <Grid
        container
        sx={{
          height: '100vh',
          borderRadius: '10px',
          border: '1px solid',
          borderColor: 'divider',
          marginLeft: '15px',
          backgroundColor: '#fafcfe',
        }}
      >
        <Grid
          size={4}
          sx={{
            borderRight: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          }}
        >
          <Sidebar chatlist={chats} selectActiveChat={handleSetActiveChat} />
        </Grid>
        <Grid size={8}>
          <MainChat
            activeChat={activeChat}
            onSendMessage={handleSendMessage}
            messages={currentMessages}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
