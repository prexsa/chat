import { useState } from 'react';
import { useField } from "formik";
import { FaEyeSlash } from 'react-icons/fa';
import './Login.css'

const MyTextInput = ({label, ...props}) => {
  const [field, meta] = useField(props);
  return (
    <div className="form-field">
      <label className="input-label" htmlFor={props.id || props.name}>{label}</label>
      <input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error feedback">{meta.error}</div>
      ) : null}
    </div>
  )
}

const MyTextInputPassword = ({label, ...props}) => {
  const [show, setShow] = useState(false);
  const [field, meta] = useField(props);
  return (
    <div className="form-field">
      <label className="input-label" htmlFor={props.id || props.name}>{label}</label>
      <input type={show ? "text" : "password"} className="text-input" {...field} {...props} />
      <FaEyeSlash className='password-svg' onClick={() => setShow(!show)} />
      {meta.touched && meta.error ? (
        <div className="error feedback">{meta.error}</div>
      ) : null}
    </div>
  )
}

export { MyTextInput, MyTextInputPassword };