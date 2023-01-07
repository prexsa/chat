import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useUserContext } from '../userContext';
import './Login.css';

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  password: Yup.string()
    .required('Required')
});

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  /*const onSubmit = async (data) => {
    // e.preventDefault();
    // const response = await axios.post('http://localhost:9000/api/login', {username: inputVal})
    try {
      const response = await axios.post('http://localhost:9000/api/auth/login', data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      // console.log('response: ', response)
      localStorage.setItem("accessToken", response.data.accessToken)
      navigate('/chat', { state: { username: response.data.username }})
    } catch(err) {
      console.log('resp error: ', err)
    }
  }

  const onSubmitUsername = (data) => {
    console.log(data)
    navigate('/chat', { state: { username: data.username, password: 'testing' }})
  }*/

  const handleClear = async (e) => {
    e.preventDefault();
    const response = await axios.get('http://localhost:9000/api/clear')
    console.log('response: ', response.data)
  }

  const handleGetAllUsers = async (e) => {
    e.preventDefault();
    const response = await axios.get('http://localhost:9000/api/get-users')
    // console.log('response: ', response.data.users)
  }

  const handleRedis = async () => {
    axios.post('http://localhost:9000/api/redis')
  }

  const handleRedisGet = async () => {
    axios.get('http://localhost:9000/api/redis-get')
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const deleteMongodbMsgCollection = () => {
    axios.get('http://localhost:9000/api/mongdb-collection-clear')
  }

  return (
    <div className="logon-container">
      <h2>Log in</h2>
      <Formik
        initialValues={{ username: '', password: ''}}
        validateSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          // console.log('onSubmit: ', values)
          actions.resetForm();
          /*const response = await axios.post('http://localhost:9000/api/auth/login', values, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })*/
          const response = await axios.post('http://localhost:9000/api/auth/login', values, {
            withCredentials: true
          })
          if(response.data.status) {
            setError(response.data.status)
          } else {
            // console.log('response: ', response)
            // localStorage.setItem("accessToken", response.data.accessToken)
            setUser(response.data)
            navigate('/chat')
          }
        }}
      >
      {({ errors, touched }) => (
        <Form>
          <div>{error}</div>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <Field name="username" />
            {errors.username && touched.username ? (
              <div className="feedback">{errors.username}</div>
            ) : null}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <Field name="password" />
            {errors.password && touched.password ? (
              <div className="feedback">{errors.password}</div>
            ) : null}
          </div>
          <button type="submit">Submit</button>
        </Form>
      )}
      </Formik>
      {/*<button onClick={handleGetAllUsers}>get all users</button>
      <button onClick={handleClear}>clear</button>
      <button onClick={handleRedis}>redis</button>
      <button onClick={handleRedisGet}>redis-get</button>
      <button onClick={deleteMongodbMsgCollection}>mongdb-clear</button>
      <br />*/}
      <Link to="/register">register</Link>
    </div>
  )
}

export default Login;
