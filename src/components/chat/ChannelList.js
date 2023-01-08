import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUserContext } from '../../userContext';
import { useSocketContext } from './socketContext';
import AddFriend from './AddFriend';

function ChannelList() {
  const navigate = useNavigate();
  // const { user } = useUserContext();
  const { username, selectChannel, logoff, friendList } = useSocketContext();
  // const username = user.username;
  // console.log('user: ', user)
  // console.log('channel: ', channel)
// console.log('username: ', username)
  const handleLogOut = () => {
    const sessionID = localStorage.getItem("sessionID");
    localStorage.removeItem("sessionID")
    localStorage.removeItem("accessToken")
    console.log('logoff')
    logoff();
    // socket.emit('logoff', sessionID)
    navigate('/')
    // window.location.reload();
  }
// console.log('friendList: ', friendList)
  return (
    <div>
      <header>
        <div>{username}</div>
      </header>
      <button className="logout-btn" onClick={handleLogOut}>logout</button>
      <h2>Chat Circle</h2>
      <AddFriend />
      {/*<button className="get-users-btn" onClick={handleGetUsers}>Get Users</button>*/}
        <ul>
        {
          friendList && friendList.map((friend, index) => {
            // console.log('friend: ', friend)
            // console.log('user: ', user)
            // console.log('channel: ', channel)
            {/*if(channel !== null && channel.userID === user.userID) {
              user.hasNewMessage = false;
            }*/}
            return (
              <li key={friend.username} onClick={() => selectChannel(friend.username)}>
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt="" />
                <div>
                  <h2>{friend.username}</h2>
                  <h3>
                    <span className={`status ${friend.connected === 'true' ? 'green' : 'orange'}`}></span>
                    offline
                  </h3>
                </div>
                <div className={`newMessages ${friend.connected === 'true' ? 'show' : 'hide'}`}>!</div>
              </li>
            )
          })
        }
        </ul>
    </div>
  )
}

export default ChannelList;