import axios from 'axios';

let SERVER_ENDPOINT = ''

if(process.env.NODE_ENV === 'development') {
  SERVER_ENDPOINT = process.env.REACT_APP_SERVER_URL
} else {
  SERVER_ENDPOINT = process.env.CLIENT_URL
}

const login = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/login`, values, {
      withCredentials: true
    })
}

const signup = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/signup`, values, {
      withCredentials: true
    })
}

const addUsername = async (values) => {
  return await axios.post(`${SERVER_ENDPOINT}/api/auth/add-username`, values, {
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
  signup,
  addUsername,
  userExist,
  updatePassword
}

export default AuthServices;