import { useContext, useRef, useEffect, useState } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import Chatbox from './Chatbox';
import { useUserContext } from '../../userContext';
import { MessagesContext, FriendContext, SocketContext } from './Chat';
import VerticallyCenteredModal from '../VerticallyCenteredModal'

function MessagePanel() {
  const bottomRef = useRef(null);
  const { user } = useUserContext();
  const { messages, feedback } = useContext(MessagesContext);
  const { channel, setFriendList, setChannel } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);
  const [picture, setPicture] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [images, setImages] = useState([])
  const [imageIndex, setImageIndex] = useState(0)
// console.log('messages; ', messages)
// console.log('user; ', user)
  useEffect(() => {
    // console.log('picture: ', picture)
    // bottomRef.current?.scrollIntoView({block: "end", behavior: 'smooth'});
    bottomRef.current?.scrollIntoView(false);
  }, [messages, feedback, picture])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({block: 'end', inline: 'nearest'});
  }, [channel])

  /*const handleClearPicture = () => {
    console.log('handleClearPicture; ')
    setPicture(null)
  }*/

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

  const handleRemoveChannel = () => {
    console.log('channel: ', channel)
    console.log('user: ', user)
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
        channelId: channel.userId,
        channelname: channel.username
      }
    })
    setChannel({ userId: "" })
  }

  return (
    <>
      {
        channel.userId === "" ?
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
          <header>
            <FaUserCircle className="channel-img" />
            <h2>{channel.username}</h2>
            <div className="message-chanel-actions">
              <div className="leave-icon-container">
                <span data-text="Leave chat" className="tooltip-text bottom left">
                  <FaTimes className="leave-icon" onClick={handleRemoveChannel} />
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
                        <FaUserCircle />
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
                          (isYou) ? null : <div className="chat-username-txt">{channel.username}</div>
                        }
                      </div>
                    </li>
                  )
                })
              }
              <li ref={bottomRef}></li>
              <li ref={bottomRef} className="you">
                <div className=" icon-message-container flex-direction-row">
                  <img className="file-upload-image" src={picture && picture} alt="" />
                </div>
              </li>
              <li ref={bottomRef}>{feedback ? `${user.username} is typing...` : ''}</li>
            </ul>
          </div>
          <footer>
            <Chatbox userId={channel.userId} from={user.userId} picture={picture} handleSetPicture={setPicture} />
          </footer>
        </div>
      }
    </>
  )
}

export default MessagePanel;