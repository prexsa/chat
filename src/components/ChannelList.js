import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSocketContext } from '../socketContext';

function ChannelList() {
  const navigate = useNavigate();
  const { user, users, channel, selectChannel, logoff } = useSocketContext();
  const username = user.username;
  // console.log('users: ', users)
  // console.log('channel: ', channel)

  const handleLogOut = () => {
    const sessionID = localStorage.getItem("sessionID");
    // localStorage.removeItem("sessionID")
    console.log('logoff')
    logoff();
    // socket.emit('logoff', sessionID)
    navigate('/')
    // window.location.reload();
  }

  return (
    <div>
      <header>
        <div>{username}</div>
      </header>
      <button className="logout-btn" onClick={handleLogOut}>logout</button>
      <h2>Chat Circle</h2>
      {/*<button className="get-users-btn" onClick={handleGetUsers}>Get Users</button>*/}
        <ul>
        {
          users && users.map((user, index) => {
            // console.log('user: ', user)
            // console.log('channel: ', channel)
            {/*if(channel !== null && channel.userID === user.userID) {
              user.hasNewMessage = false;
            }*/}
            return (
              <li key={user.userID} onClick={() => selectChannel(user)}>
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" />
                <div>
                  <h2>{user.username}</h2>
                  <h3>
                    <span className={`status ${user.connected ? 'green' : 'orange'}`}></span>
                    offline
                  </h3>
                </div>
                <div className={`newMessages ${user.hasNewMessage ? 'show' : 'hide'}`}>!</div>
              </li>
            )
          })
        }
        </ul>
    </div>
  )
}

export default ChannelList;