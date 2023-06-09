import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { FaLock } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Auth from '../services/Auth';
import './Login.css';

/* Check if string is email */
function checkIfEmail(str) {
  // Regular expression to check if string is email
  const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;

  return regexExp.test(str);
}

function ForgotPassword() {
  const navigate = useNavigate();
  const { register, watch, handleSubmit, reset} = useForm();
  const [isBtnDisabled, setBtnDisabled] = useState(true);
  const [feedback, setFeedback] = useState({ success: null, msg: "" })

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // console.log({ value, name, type })
      if(value.username !== "") {
        setBtnDisabled(false)
      } else {
        setBtnDisabled(true)
      }
    })
    return () => subscription.unsubscribe();
  }, [watch])

  const handleOnSubmit = async (values) => {
    console.log({ values })
    const value = values.username
    const keyType =  checkIfEmail(value) ? 'email' : 'username'

    const payload = {
      keyType,
      value 
    }

    const resp = await Auth.userExist(payload)
    // console.log({ resp })
    const { data } = resp;
    console.log("data: ", data)
    if(data.status === 'success') {
      setFeedback({ success: true, msg: 'An email has been sent with a link to reset your password'})
    } else {
      setFeedback({ success: false, msg: "Username or email does not match our records."})
    }
    // reset({ username: '' })
    resetForm()
  }

  const resetForm = () => {
    reset({ username: '' })
    setTimeout(() => {
      navigate('/')
    }, 3000) 
  }

  const onErrors = errors => console.log({ errors })

  return (
    <div className="centered-cntr">
      <FaLock className="fa-lock" />
      <h3 className="heading">Trouble logging in?</h3>
      <p className="heading-context">Enter your email or username and we'll send you a link to get back into your account.</p>
      <form className="form-cntr" onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
        <div className="form-field floating-label-cntr">
          <input
            className="floating-input" 
            type="text" 
            name="username" 
            placeholder="Username or Email"
            {...register("username")} 
          />
          <label className="floating-label" htmlFor="username">Username or Email</label>
        </div>
        <small className={`${feedback.success ? 'text-success' : 'text-danger'} error-feedback-sm`}>
          {feedback.msg}
        </small>
        <div className="form-field marginTop20">
          <button type="submit" disabled={isBtnDisabled} className="btn btn-primary btn-sm">Send link</button>
        </div>
      </form>
      <div className="link-container">
        <Link to="/">Back to login</Link>
      </div>
    </div>
  )
}

export default ForgotPassword;

// https://medium.com/@TusharKanjariya/input-floating-labels-using-only-pure-css-80d5f99831e3