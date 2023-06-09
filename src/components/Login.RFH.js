import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaEyeSlash, FaRocketchat } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useUserContext } from '../userContext';
import Auth from '../services/Auth';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors }} = useForm();
  const { setUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit: ', values)
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, values, {
      withCredentials: true
    })
    if(response.data.status) {
      setError(response.data.status)
    } else {
      // console.log('response: ', response.data)
      localStorage.setItem("accessToken", response.data.accessToken);
      setUser({...response.data});
      navigate('/chat');
    }
    reset({username: '', password: ''})
  }

  const onErrors = errors => console.error(errors)

  const registerOptions = {
    username: { required: "Username is required" },
    password: { required: "Password is required" }
  }

  return (
    <div className="centered-cntr">
      <h3>Log in</h3>
      {error ? (
        <div className="text-danger">{error}</div>
        )
      : null}
      <form onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
        <div className="form-field">
          <label className="input-label" htmlFor="username">Username</label>
          <input 
            className="text-input" 
            type="text" 
            name="username" 
            placeholder="Username"
            {...register("username", registerOptions.username)} 
          />
          <small className="text-danger">
            {errors?.username && errors.username.message}
          </small>
        </div>
        <div className="form-field">
          <label className="input-label" htmlFor="password">Password</label>
          <div className="password-cntr">
            <input 
              className="text-input" 
              type="text" 
              name="password" 
              {...register("password", registerOptions.password)} 
              />
            <FaEyeSlash className='fa-eye' onClick={() => setShow(!show)} />
            <small className="text-danger">
              {errors?.password && errors.password.message}
            </small>
          </div>
        </div>
        <div className="form-field marginTop20">
          <button type="submit" className="btn btn-primary btn-sm">Login</button>
        </div>
      </form>
      <Link to="/forgot-password">Forgot password?</Link>
      <div className="link-container">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </div>
    </div>
  )
}

export default Login;

// https://dribbble.com/shots/14223554-chat-Login-screen
// https://dribbble.com/shots/14396669-Chat-app-Login