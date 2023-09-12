import { useContext, useEffect, useRef } from "react";
import { MessagesContext } from "./Main";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const MessagePanel = ({
  user,
  channel,
  picture,
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
  }, [messages, feedback, picture]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
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
        {messages.map((message, idx) => {
          // console.log('message: ', message)
          // check message if isImage key exist
          const isYou = message.from === null || message.from === user.userId;
          return (
            <li key={idx} className={`${isYou ? "you" : ""}`}>
              <div
                className={`icon-message-container ${
                  isYou ? "flex-direction-row-reverse" : "flex-direction-row"
                }`}
              >
                <AccountCircleIcon />
                <div className="message-container">
                  <div>
                    {message.hasOwnProperty("isImage") ? (
                      <img
                        className="file-upload-image"
                        src={message.content}
                        alt=""
                        onClick={() => displayModal(message.content)}
                      />
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
        <li className="you">
          <div className=" icon-message-container flex-direction-row">
            <img
              className="file-upload-image"
              src={picture && picture}
              alt=""
            />
          </div>
        </li>
        <li ref={bottomRef} className="feedback-typing">
          {feedback ? `typing...` : ""}
        </li>
        <li ref={bottomRef}></li>
      </ul>
    </div>
  );
};

export default MessagePanel;
