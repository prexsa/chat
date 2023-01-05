import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors }} = useForm();
  // const [inputVal, setInputVal] = useState('');
  // const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [responseErrors, setResponseErrors] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false);
  /*const [normal, setNormal] = useState('');
  const [debounced, setDebounced] = useState('');
  const [throttled, setThrottled] = useState('');*/

  /*const handleOnChange = (e) => {
    setInputVal(e.target.value);
    const val = e.target.value
    /*setNormal(val)
    debounceHandler(val)
    throttleHandler(val)*/
    /*setCredentials({...credentials, [e.target.name]: e.target.value})
  }*/

  const onSubmit = async (data) => {
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
      if(err) {
        // console.log('err response: ', err.response.data)
        setResponseErrors({...responseErrors, password: err.response.data.message })
      }
    }
  }

  const onSubmitUsername = (data) => {
    console.log(data)
    navigate('/chat', { state: { username: data.username, password: 'testing' }})
  }

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter a username"
            // value={inputVal}
            id="username"
            // onChange={handleOnChange}
            {...register("username", {
              required: "required"
            })}
          />
          {errors.username && <span role="alert">{errors.username.message}</span>}
        </div>
        {/*<div className="form-field">
          <label htmlFor="username">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            // value={inputVal}
            id="password"
            // onChange={handleOnChange}
            {...register("password", {
              required: "required"
            })}
          />
          <div>
            <input type="checkbox" onClick={handleShowPassword} />Show password
          </div>
          {errors.password && <span role="alert">{errors.password.message}</span>}
          {responseErrors.password && <span role="alert">{responseErrors.password}</span>}
        </div>*/}
        <button type="submit">Log in</button>
      </form>
      <button onClick={handleGetAllUsers}>get all users</button>
      <button onClick={handleClear}>clear</button>
      <button onClick={handleRedis}>redis</button>
      <button onClick={handleRedisGet}>redis-get</button>
      <button onClick={deleteMongodbMsgCollection}>mongdb-clear</button>
      <br />
      <Link to="/register">register</Link>
    </div>
  )
}

export default Login;
{/*<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
  <p>normal: {normal}</p>
  <p>debounce: {debounced}</p>
  <p>throttle: {throttled}</p>
</div>*/}

/*  const debounce = (cb, delay = 1000) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

  const throttle = (cb, delay = 1000) => {
    let shouldWait = false;
    let waitingArgs;
    const timeoutFunc = () => {
      if(waitingArgs == null) {
        shouldWait = false;
      } else {
        cb(...waitingArgs);
        waitingArgs = null;
        setTimeout(timeoutFunc, delay);
      }
    }

    return (...args) => {
      if(shouldWait) {
        waitingArgs = args;
        return;
      }

      cb(...args);
      shouldWait = true;
      setTimeout(timeoutFunc, delay)
    }
  }

  const debounceHandler = useMemo(
    () => debounce(val => {
      setDebounced(val)
    })
  , [])

  const throttleHandler = useMemo(
    () => throttle(val => {
      setThrottled(val)
    })
  , [])*/