import axios from 'axios';

// let SERVER_ENDPOINT = '';

/*if (process.env.NODE_ENV === 'development') {
} else {
  SERVER_ENDPOINT = process.env.CLIENT_URL;
}*/
// [context.production];
const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_URL;
const AC_ALLOW_ORIGIN = process.env.AC_ALLOW_ORIGIN;
/*
, {
    withCredentials: true,
    origin: SERVER_ENDPOINT,
  }
*/

const login = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/login`, values, {
    headers: {
      'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
    },
  });
};

const signup = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/signup`, values, {
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
    },
  });
};

const addUsername = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/add-username`, values, {
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
    },
  });
};

const userExist = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/pw-reset`, values, {
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
    },
  });
};

const updatePassword = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/update-pw`, values, {
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
    },
  });
};

const getUserProfile = async (userId) => {
  // console.log('userId: ', userId)
  return await axios.post(
    `${SERVER_ENDPOINT}/api/auth/get-profile`,
    { userId },
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
      },
    },
  );
};

const updateUserProfile = async (values) => {
  return await axios.post(
    `${SERVER_ENDPOINT}/api/auth/update-profile`,
    values,
    {
      withCredentials: true,
      headers: {
        'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
      },
    },
  );
};

const sendEmail = async (values) => {
  // console.log('values; ', values);
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/send-email`, values, {
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': AC_ALLOW_ORIGIN,
    },
  });
};

const AuthServices = {
  login,
  signup,
  addUsername,
  userExist,
  updatePassword,
  getUserProfile,
  updateUserProfile,
  sendEmail,
};

export default AuthServices;
