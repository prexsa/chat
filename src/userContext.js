import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    userId: '',
    loggedIn: null,
  });
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    // console.log('accessToken: ', accessToken)
    if (accessToken === null) return;
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, {
        headers: {
          authorization: `token ${accessToken}`,
        },
      })
      .then((response) => {
        // console.log('response: ', response.data)
        const data = response.data;
        setUser(data);
        navigate('/chat');
      })
      .catch(() => {
        // console.log('UserContext error: ', err.response.data)
        localStorage.setItem('accessToken', null);
        return;
      });
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export { UserContext, UserProvider };
