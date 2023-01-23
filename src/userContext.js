import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    // const user = JSON.parse(localStorage.getItem('user'));
    // console.log('user: ', user)
    // setUser(user)
    // console.log('accessToken: ', accessToken)
    if(accessToken === null) {
      navigate('/');
      return;
    }
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, {
      headers: {
        'authorization': `token ${accessToken}`
      }
    }).then(response => {
      // console.log('response: ', response)
      const data = response.data;
      // console.log('data: ', data)
      setUser(data)
      navigate('/chat')
    }).catch(err => {
      // console.log('UserContext error: ', err.response.data)
      localStorage.setItem("accessToken", null)
      return;
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => {
  return useContext(UserContext);
}

export { UserContext, UserProvider }