import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useUserContext } from '../userContext';
import Auth from '../services/Auth';
import './Login.css';

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { setUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit: ', values)
    const response = await Auth.signup(values)
    console.log('response: ', response.data)
    if(response.data.status) {
      setError(response.data.status)
    } else {
      localStorage.setItem("accessToken", response.data.accessToken);
      setUser(response.data);
      navigate('/select-username', { state: { userID: response.data.userID }});
    }
    reset()
  }

  const onErrors = errors => console.error(errors)

  const registerOptions = {
    email: { 
      required: "Email is required",
      pattern: {
        value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Please enter a valid email',
      }
    },
    fname: { required: "First Name is required" },
    lname: { required: "Last Name is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 7,
        message: "Password must have at least 8 characters"
      }
    }
  }

  return (
    <div className="centered-cntr">
      <h3>Sign up</h3>
      <p className="heading-context">It's quick and easy!</p>
      {error ? (
        <div className="text-danger">{error}</div>
        )
      : null}
      <form onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
        <div className="form-field floating-label-cntr">
          <input
            className={`${errors?.email ? 'border border-danger red-outline-color' : ''} floating-input` }
            type="text" 
            placeholder="Email"
            {...register("email", registerOptions.email)} 
          />
          <label className="floating-label" htmlFor="email">Email</label>
        </div>
        <small className="text-danger">
          {errors?.email && errors.email.message}
        </small>
        <div className="form-field floating-label-cntr">
          <input
            className={`${errors?.fname ? 'border border-danger red-outline-color' : ''} floating-input` }
            type="text" 
            placeholder="First name"
            {...register("fname", registerOptions.fname)} 
          />
          <label className="floating-label" htmlFor="fname">First name</label>
        </div>
        <small className="text-danger">
          {errors?.fname && errors.fname.message}
        </small>
        <div className="form-field floating-label-cntr">
          <input
            className={`${errors?.lname ? 'border border-danger red-outline-color' : ''} floating-input` }
            type="text" 
            placeholder="Last name"
            {...register("lname", registerOptions.lname)} 
          />
          <label className="floating-label" htmlFor="lname">Last name</label>
        </div>
        <small className="text-danger">
          {errors?.lname && errors.lname.message}
        </small>
        <div className="form-field floating-label-cntr">
          <input
            className={`${errors?.password ? 'border border-danger red-outline-color' : ''} floating-input` }
            type={show ? "text" : "password"} 
            placeholder="Password"
            {...register("password", registerOptions.password)} 
          />
          <label className="floating-label" htmlFor="password">Password</label>
          <FaEyeSlash className='fa-eye' onClick={() => setShow(!show)} />
        </div>
        <small className="text-danger">
          {errors?.password && errors.password.message}
        </small>
        <div className="form-field marginTop20 form-group">
          <button type="submit" className="btn btn-primary btn-sm">Register</button>
          <button type="button" onClick={() => reset()} className="btn btn-link btn-sm">Reset</button>
        </div>
      </form>
      <div className="link-container">
        Already have an account? <Link to="/">Login</Link>
      </div>
    </div>
  )
}

export default Signup;