import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useUserContext } from '../../userContext';
import { FriendContext } from './Main';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerticallyCenteredModal from '../VerticallyCenteredModal';
import Chatbox from './Chatbox';
import AddToGroup from './AddToGroup';
import TitleForm from './TitleForm';
import MessagePanel from './MessagePanel';
import LeaveChat from './LeaveChat';

const Chat = ({ isGroup }) => {
  const { user } = useUserContext();
  const { channel } = useContext(FriendContext);
  // const [picture, setPicture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [toggleExpand, setToggleExpand] = useState(false);

  // console.log('channel: ', channel)
  const extractAllImagesFromMessages = async (selectedImgSrc, messages) => {
    const images = await messages.filter(
      (message) => message.hasOwn('isImage') === true,
    );
    let index = 0;
    for (let [key, value] of images.entries()) {
      if (value.content === selectedImgSrc) {
        index = key;
        break;
      }
    }
    setImages(images);
    setImageIndex(index);
  };

  if (channel.userId === '' || channel.roomId === '') {
    return (
      <div className="message-panel-container">
        <h2>Choose a conversation</h2>
        <h3>
          Click on an existing chat or click &quot;New Chat&quot; to create a
          new conversation
        </h3>
      </div>
    );
  }

  return (
    <div className="message-panel-container">
      {/* The Modal */}
      <VerticallyCenteredModal
        show={showModal}
        onHide={() => setShowModal(false)}
        images={images}
        activeindex={imageIndex}
      />
      <header
        className={`${
          toggleExpand ? 'message-panel-header expand' : 'message-panel-header'
        }`}
      >
        <LeaveChat isGroup={isGroup} />
        {isGroup && <AddToGroup />}
        <AccountCircleIcon className="channel-img" />
        <TitleForm
          toggleExpand={toggleExpand}
          setToggleExpand={setToggleExpand}
        />
        {/*<p style={{ marginLeft: "auto" }}>
          id: {channel?.userId || channel?.roomId}
        </p>*/}
      </header>
      <MessagePanel
        user={user}
        channel={channel}
        // picture={picture}
        isGroup={isGroup}
        setShowModal={setShowModal}
        extractAllImagesFromMessages={extractAllImagesFromMessages}
      />
      <footer>
        <Chatbox
          userId={channel?.userId || channel?.roomId}
          from={user.userId}
          isGroup={channel?.isGroup}
          // picture={picture}
          // handleSetPicture={setPicture}
        />
      </footer>
    </div>
  );
};

Chat.propTypes = {
  isGroup: PropTypes.bool,
};

export default Chat;
/*
  <div className="message-box-container">
    <ul className="chat">
      {
        messages.map((message, idx) => {
          // console.log('message: ', message)
          // check message if isImage key exist
          const isYou = message.from === null || message.from === user.userId;
          return (
            <li
              key={idx}
              className={`${isYou ? 'you' : ''}`}
            >
              <div className={`icon-message-container ${isYou ? "flex-direction-row-reverse" : "flex-direction-row"}`}>
                <AccountCircleIcon />
                <div className="message-container">
                  <div>
                  {
                    message.hasOwnProperty('isImage') ?
                    <img 
                      className="file-upload-image" 
                      src={message.content} 
                      alt="" 
                      onClick={() => displayModal(message.content)} 
                    />
                    :            
                    message.content
                  }
                  </div>
                </div>
              </div>
              <div>
                {
                  (isYou) ? 
                  null 
                  : 
                  <div className="chat-username-txt">{isGroup ? message.username : channel.username}</div>
                }
              </div>
            </li>
          )
        })
      }
      <li className="you">
        <div className=" icon-message-container flex-direction-row">
          <img className="file-upload-image" src={picture && picture} alt="" />
        </div>
      </li>
      <li ref={bottomRef} className="feedback-typing">
        {feedback ? `typing...` : ''}
      </li>
      <li ref={bottomRef}></li>
    </ul>
  </div>
*/
