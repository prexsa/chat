import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate, Link } from "react-router-dom";
import * as Yup from 'yup';
import axios from 'axios';
import './Login.css';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  password: Yup.string()
    .required('Required')
});

function Signup() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="logon-container">
      <Link to="/">back</Link>
      <h2>Sign up</h2>
      <Formik
        initialValues={{
           username: '',
           password: '',
         }}
        validationSchema={SignupSchema}
        onSubmit={async (values, actions) => {
           // same shape as initial values
          actions.resetForm();
          // console.log(values);
          const response = await axios.post('http://localhost:9000/api/auth/signup', values)
          console.log('response: ', response.data)
          if(response.data.status) {
            setError(response.data.status)
          } else {
            localStorage.setItem("accessToken", response.data.accessToken)
            navigate('/chat')
          }
         }}
        >
        {({ errors, touched }) => (
           <Form>
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <Field name="username" />
              {errors.username && touched.username ? (
                <div className="feedback">{errors.username}</div>
              ) : null}
              {error}
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <Field name="password" />
              {errors.password && touched.password ? (
                <div className="feedback">{errors.password}</div>
              ) : null}
            </div>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Signup;