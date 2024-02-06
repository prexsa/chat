import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MessagesContext } from './Main';
import { Box, Typography, List, ListItem } from '@mui/material';
// import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';

const MessagePanel = ({
  user,
  channel,
  // picture,
  isGroup,
  setShowModal,
  extractAllImagesFromMessages,
}) => {
  const bottomRef = useRef(null);
  const { messages, feedback } = useContext(MessagesContext);

  useEffect(() => {
    // console.log('picture: ', picture)
    // bottomRef.current?.scrollIntoView({block: "end", behavior: 'smooth'});
    bottomRef.current?.scrollIntoView(false);
  }, [messages, feedback]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end', inline: 'nearest' });
  }, []);

  const displayModal = (imgSrc) => {
    // console.log('displayModal; ')
    setShowModal(true);
    // setImages([imgSrc])
    extractAllImagesFromMessages(imgSrc, messages);
  };

  return (
    <div className="message-box-container">
      <ul className="chat">
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  justifyContent: 'flex-start',
                  columnGap: '5px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: '#424242', fontSize: '1rem' }}
                >
                  Theresa Hudson
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: 14, color: '#9e9e9e' }}
                >
                  at 10:30 AM
                </Typography>
              </Box>
              <Typography variant="subtitles1" sx={{ color: '#616161' }}>
                Can&apos;t wait for dinner tonight, I&apos;m soo hungry!!!
              </Typography>
            </Box>
          </ListItem>

          <ListItem
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              columnGap: '5px',
            }}
          >
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  justifyContent: 'flex-end',
                  columnGap: '5px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: '#2196f3', fontSize: '1rem' }}
                >
                  You
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: 14, color: '#9e9e9e' }}
                >
                  at 10:30 AM
                </Typography>
              </Box>
              <Typography variant="subtitles1" sx={{ color: '#616161' }}>
                Can&apos;t wait for dinner tonight, I&apos;m soo hungry!!!
              </Typography>
            </Box>
            <ListItemAvatar>
              <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
          </ListItem>
        </List>
        {messages.map((message, idx) => {
          // console.log("message: ", message);
          // check message if isImage key exist
          const isYou = message.from === null || message.from === user.userId;
          return (
            <li key={idx} className={`${isYou ? 'you' : ''}`}>
              <div
                className={`icon-message-container ${
                  isYou ? 'flex-direction-row-reverse' : 'flex-direction-row'
                }`}
              >
                <AccountCircleIcon />
                <div className="message-container">
                  <div>
                    {message.hasOwn('isImage') ? (
                      message.urlLinkWorks ? (
                        <img
                          className="file-upload-image"
                          src={message.content}
                          alt=""
                          onClick={() => displayModal(message.content)}
                        />
                      ) : (
                        <>
                          <ImageNotSupportedIcon />
                          <Box sx={{ color: '#808080', fontSize: '10px' }}>
                            Image not available
                          </Box>
                        </>
                      )
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
              <div>
                {isYou ? null : (
                  <div className="chat-username-txt">
                    {isGroup ? message.username : channel.username}
                  </div>
                )}
              </div>
            </li>
          );
        })}
        {/*<li className="you">
          <div className=" icon-message-container flex-direction-row">
            <img
              className="file-upload-image"
              src={picture && picture}
              alt=""
            />
          </div>
        </li>*/}
        <li ref={bottomRef} className="feedback-typing">
          {feedback ? `typing...` : ''}
        </li>
        <li ref={bottomRef}></li>
      </ul>
    </div>
  );
};

MessagePanel.propTypes = {
  user: PropTypes.object,
  channel: PropTypes.string,
  isGroup: PropTypes.bool,
  setShowModal: PropTypes.func,
  extractAllImagesFromMessages: PropTypes.func,
};

export default MessagePanel;
