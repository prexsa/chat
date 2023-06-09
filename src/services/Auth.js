import axios from 'axios';

let SERVER_ENDPOINT = ''

if(process.env.NODE_ENV === 'development') {
  SERVER_ENDPOINT = process.env.REACT_APP_SERVER_URL
} else {
  SERVER_ENDPOINT = process.env.CLIENT_URL
}

const login = async (values) => {
  return await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/signup`, values, {
      withCredentials: true
    })
}

const userExist = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/pw-reset`, values, {
    withCredentials: true
  })
}

const updatePassword = async (values) =>{
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/update-pw`, values, {
    withCredentials: true
  })
}

const AuthServices = {
  login,
  userExist,
  updatePassword
}

export default AuthServices;