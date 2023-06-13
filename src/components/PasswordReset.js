import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import Auth from '../services/Auth';

function PasswordReset() {
  const navigate = useNavigate()
  const [queryParameters] = useSearchParams();
  const userId = queryParameters.get('userId')
  const expireTime = queryParameters.get('expireTime')
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false)
  const {
    register, handleSubmit, reset, getValues, watch, formState: { errors }
  } = useForm({ mode: 'onChange' });

  const checkExpireTime = useCallback((time) => {
    // check if time to reset password has expired
    // if expired redirect user to forgot password link
    const currentTime = new Date().getTime();
    // console.log({ currentTime, expireTime: Number(time) })
    if(currentTime > Number(time)) {
      setIsTimeExpired(true)
      setTimeout(() => {
        navigate('/forgot-password')
      }, 4000)
    }
  }, [navigate])

  useEffect(() => {
    // console.log('hel')
    checkExpireTime(expireTime)
  }, [expireTime, checkExpireTime])

  const handleOnSubmit = async (values) => {
    const resp = await Auth.updatePassword({ ...values, userId })
    // console.log({ resp })
    const {data: { status }} = resp;
    if(status === "success") {
      reset({ password: '', duplicate: '' })
      setIsUpdateSuccessful(true)
      setTimeout(() => {
        navigate('/')
      }, 4000)
    }
  }

  const onErrors = errors => console.log({ errors })
  // console.log({ userId, expireTime })
  if(isTimeExpired) {
    return (
      <div className="centered-cntr">
        <small className={`text-danger error-feedback-sm`}>
          Time has expired for password reset, redirecting...
        </small>
        <div className="link-container">
          <Link to="/">Back to login</Link>
        </div>
      </div>
    )
  } else if (isUpdateSuccessful) {
    return (
      <div className="centered-cntr">
        <small className={`text-success error-feedback-sm`}>
          Password has been updated, redirecting to login screen.
        </small>
        <div className="link-container">
          <Link to="/">Back to login</Link>
        </div>
      </div>
    )
  } else {
    return (
      <div className="centered-cntr">
        <h3 className="heading">Password Reset</h3>
        <p className="heading-context">Lets update your password</p>
        <form className="form-cntr" onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
          <div className="form-field floating-label-cntr">
            <input
              className="floating-input" 
              id="password"
              type="text" 
              name="password" 
              placeholder="New password"
              {...register("password", { required: true, minLength: 5 })} 
            />
            <label className="floating-label" htmlFor="username">Password</label>
          </div>
          <small className={`text-danger error-feedback-sm`}>
            {errors?.password?.type === "required" && ("This field is required")}
            {errors?.password?.type === "minLength" && ("Password cannot be less than 5 characters.")}
          </small>
          <div className="form-field floating-label-cntr">
            <input
              className="floating-input" 
              id="password"
              type="text" 
              name="duplicate" 
              placeholder="Re-enter password"
              {...register("duplicate", { required: true })} 
            />
            <label className="floating-label" htmlFor="username">Re-enter Password</label>
          </div>
          {/* errors will return when field valiation fails */}
          {/* here we watch both password and duplicate fields and if not matched, triggers validation */}
          <small className={`text-danger error-feedback-sm`}>
            {watch("duplicate") !== watch("password") && getValues("duplicate") ? ("Passwords do not match") : null}
          </small>
          <div className="form-field marginTop20">
            <button 
              type="submit" 
              disabled={!(watch("password") !== '' && watch("duplicate") !== '' && watch("password") === watch("duplicate"))} 
              className="btn btn-primary btn-sm">Submit</button>
          </div>
        </form>
        <div className="link-container">
          <Link to="/">Back to login</Link>
        </div>
      </div>
    )
  }
}


export default PasswordReset;