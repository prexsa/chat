import { useContext, useRef, useEffect, useState } from 'react';
import { useUserContext } from '../../userContext';
import { MessagesContext, FriendContext, SocketContext } from './Chat';
import VerticallyCenteredModal from '../VerticallyCenteredModal';
import Chatbox from './Chatbox';
import AddToGroup from './AddToGroup';
import TitleForm from './TitleForm';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function MessagePanel({ isGroup }) {
  const bottomRef = useRef(null);
  const { user } = useUserContext();
  const { messages, feedback } = useContext(MessagesContext);
  const { channel, setFriendList, setChannel } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [picture, setPicture] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [toggleExpand, setToggleExpand] = useState(false);
// console.log('messages; ', messages)
// console.log('user; ', user)
  // console.log('channel; ', channel)
  useEffect(() => {
    // console.log('picture: ', picture)
    // bottomRef.current?.scrollIntoView({block: "end", behavior: 'smooth'});
    bottomRef.current?.scrollIntoView(false);
  }, [messages, feedback, picture])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({block: 'end', inline: 'nearest'});
  }, [])
// console.log('channel: ', channel)
  const extractAllImagesFromMessages = async (selectedImgSrc) => {
    const images = await messages.filter(message => (message.hasOwnProperty('isImage') === true));
    let index = 0;
    for(let [key, value] of images.entries()) {
      if(value.content === selectedImgSrc) {
        index = key;
        break;
      }
    }
    setImages(images)
    setImageIndex(index)
  }

  const displayModal = (imgSrc) => {
    // console.log('displayModal; ')
    setShowModal(true)
    // setImages([imgSrc])
    extractAllImagesFromMessages(imgSrc)
  }

  const handleLeaveGroup = () => {
    console.log('channel: ', channel)
    console.log('user: ', user)
    /*
      if userId belongs to owner, block
    */

    if(channel.owner === user.userId) {
      console.log('matched')
      return;
    }

    socket.emit('leave_group', {
        userId: user.userId,
        channelId: channel?.roomId,
    }, ({ resp }) => {
      const { channelId } = resp
      setFriendList(prevFriends => {
        return [...prevFriends].filter((friend) => friend.roomId !== channelId)
      })
      // console.log('resp: ', resp)
    })
  }

  const handleRemoveChannel = () => {
    // console.log('channel: ', channel)
    // console.log('user: ', user)
    // if(channel.userID === '') return
    // remove channel from your friend's list
    setFriendList(prevFriends => {
      // console.log('prevFriends: ', prevFriends)
      if(prevFriends === undefined) return
      let index = null;
      for(const [key, { userId, username }] of [...prevFriends].entries()) {
        if(userId === channel.userId && username === channel.username) {
          index = key
        }
      }
      const updatedFriendsList = prevFriends.slice(0, index).concat(prevFriends.slice(index + 1))
      return updatedFriendsList
    })
    socket.connect()
    socket.emit('remove_channel', {
      user: {
        userId: user.userId,
        username: user.username 
      }, 
      channel: {
        channelId: channel?.userId || channel?.roomId,
        channelname: channel.username
      },
      isGroup
    })
    setChannel({ userId: "" })
  }
  
  return (
    <>
      {
        channel.userId === "" || channel.roomId === "" ?
        <div className="message-panel-container">
          <h2>Choose a conversation</h2>
          <h3>Click on an existing chat or click "New Chat" to create a new conversation</h3>
        </div>
        :
        <div className="message-panel-container">
          { /* The Modal */ }
          <VerticallyCenteredModal
            show={showModal}
            onHide={() => setShowModal(false)}
            images={images}
            activeindex={imageIndex}
          />
          <header className={`${toggleExpand ? "message-panel-header expand" : 'message-panel-header'}`}>
            <AddToGroup />
            <AccountCircleIcon className="channel-img" />
            <TitleForm 
              toggleExpand={toggleExpand}
              setToggleExpand={setToggleExpand}
            />
            <div className="message-chanel-actions">
              {/*<MoreVertIcon />*/}
              <div className="leave-icon-container">
              {
                // remove option for owner to leave their own group
                channel.isGroup &&
                <span data-text="Leave chat" className="tooltip-text bottom left">
                  <ExitToAppIcon className="leave-icon" onClick={handleLeaveGroup} />
                </span>
              }
                <span data-text="Delete" className="tooltip-text bottom left">
                  <CloseIcon className="leave-icon" onClick={handleRemoveChannel} />
                </span>
              </div>
            </div>
          </header>
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
          <footer>
            <Chatbox 
              userId={channel?.userId || channel?.roomId} 
              from={user.userId} 
              isGroup={channel?.isGroup}
              picture={picture} 
              handleSetPicture={setPicture} 
            />
          </footer>
        </div>
      }
    </>
  )
}

export default MessagePanel;