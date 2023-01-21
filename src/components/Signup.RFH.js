import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useUserContext } from '../userContext';
import './Login.css';

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { setUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values) => {
    console.log('onSubmit: ', values)
    const response = await axios.post('http://localhost:9000/api/auth/signup', values, {
      withCredentials: true
    })
    console.log('response: ', response.data)
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
    password: {
      required: "Password is required",
      minLength: {
        value: 7,
        message: "Password must have at least 8 characters"
      }
    }
  }

  return (
    <div className="logon-container">
      <h2>Sign up</h2>
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
          <button type="submit" className="btn btn-primary btn-sm">Register</button>
        </div>
      </form>
      <div className="link-container">
        Already have an account? <Link to="/">Login</Link>
      </div>
    </div>
  )
}

export default Signup;