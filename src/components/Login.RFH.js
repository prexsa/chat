import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
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
    // check str if it's an email or a username
    const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const keyType = emailFormat.test(values.inputValue) ? 'email' : 'username'
    values.keyType = keyType
    // console.log('values: ', values)
    const response = await Auth.login(values)
    // console.log('response: ', response)
    if(response.data.status) {
      setError(response.data.status)
    } else {
      // console.log("fdjslkf;j: ", response.data.hasOwnProperty("username"))
      if(response.data.hasOwnProperty("username")) {
        // console.log('response: ', response.data)
        localStorage.setItem("accessToken", response.data.accessToken);
        setUser({...response.data});
        // navigate('/chat');
      } else {
        // if username has not been created, redirect user to create username
        navigate('/select-username', { state: { userID: response.data.userID }});
      }
    }
    reset({inputValue: '', password: ''})
  }

  const clearErrorMsg = useCallback(() => {
    setTimeout(() => {
      setError(null)
    }, 3000)
  }, [])

  useEffect(() => {
    clearErrorMsg()
  }, [error, clearErrorMsg])

  const onErrors = errors => console.error(errors)

  return (
    <div className="centered-cntr">
      <h3>Log in</h3>
      {error ? (
        <div className="text-danger">{error}</div>
        )
      : null}
      <form onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
        <div className="form-field floating-label-cntr">
          <input
            className="floating-input" 
            type="text" 
            placeholder="Username or Email"
            {...register("inputValue", { required: true })} 
          />
          <label className="floating-label" htmlFor="inputValue">Username or Email</label>
        </div>
        <small className="text-danger">
          {errors?.inputValue && errors.inputValue.message}
        </small>
        <div className="form-field floating-label-cntr">
          <input
            className="floating-input" 
            type={show ? "text" : "password"} 
            placeholder="Password"
            {...register("password", { required: true })} 
          />
          <label className="floating-label" htmlFor="password">Password</label>
          <FaEyeSlash className='fa-eye' onClick={() => setShow(!show)} />
        </div>
        <small className="text-danger">
          {errors?.password && errors.password.message}
        </small>
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