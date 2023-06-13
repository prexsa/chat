import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useUserContext } from '../userContext';
import Auth from '../services/Auth';
import './Login.css';

function Username() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { register, handleSubmit, reset, formState: { errors }} = useForm();
  const { setUser } = useUserContext();
  const [error, setError] = useState(null);

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit: ', values)
    // console.log("state: ", state)
    values.userID = state.userID
    const response = await Auth.addUsername(values)
    if(response.data.status) {
      setError(response.data.status)
    } else {
      // console.log('response: ', response.data)
      localStorage.setItem("accessToken", response.data.accessToken);
      setUser({...response.data});
      navigate('/chat');
    }
    reset()
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
      <h3>Choose a username</h3>
      <p>This username will used to identify you in the app.</p>
      {error ? (
        <div className="text-danger">{error}</div>
        )
      : null}
      <form onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
        <div className="form-field floating-label-cntr">
          <input
            className="floating-input" 
            type="text" 
            placeholder="Username"
            {...register("username", { required: true })} 
          />
          <label className="floating-label" htmlFor="username">Username</label>
        </div>
        <small className="text-danger">
          {errors?.username && errors.username.message}
        </small>
        <div className="form-field marginTop20">
          <button type="submit" className="btn btn-primary btn-sm">Register</button>
        </div>
      </form>
    </div>
  )
}

export default Username;