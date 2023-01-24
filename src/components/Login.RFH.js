import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useUserContext } from '../userContext';
import './Login.css';

const EXPRESS_ENDPOINT = `http://localhost:9000`;
// console.log(process.env.REACT_APP_SERVER_URL)
function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors }} = useForm();
  const { setUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values) => {
    console.log('onSubmit: ', values)
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, values, {
      withCredentials: true
    })
    /*const response = await axios.post(`${EXPRESS_ENDPOINT}/api/auth/login`, values, {
      withCredentials: true
    })*/
    if(response.data.status) {
      setError(response.data.status)
    } else {
      localStorage.setItem("accessToken", response.data.accessToken);
      setUser(response.data);
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
    <div className="logon-container">
      <h2>Log in</h2>
      {error ? (
        <div className="text-danger">{error}</div>
        )
      : null}
      <form onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
        <div className="form-field">
          <label className="input-label" htmlFor="username">Username</label>
          <input className="text-input" type="text" name="username" {...register("username", registerOptions.username)} />
          <small className="text-danger">
            {errors?.username && errors.username.message}
          </small>
        </div>
        <div className="form-field">
          <label className="input-label" htmlFor="password">Password</label>
          <input className="text-input" type="text" name="password" {...register("password", registerOptions.password)} />
          <FaEyeSlash className='password-svg' onClick={() => setShow(!show)} />
          <small className="text-danger">
            {errors?.password && errors.password.message}
          </small>
        </div>
        <div className="form-field marginTop20">
          <button type="submit" className="btn btn-primary btn-sm">Login</button>
        </div>
      </form>
      <div className="link-container">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </div>
    </div>
  )
}

export default Login;