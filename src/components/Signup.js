import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import * as Yup from 'yup';
import axios from 'axios';
import { MyTextInput, MyTextInputPassword } from './TextInput';
import './Login.css';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  password: Yup.string().required('Required'),
});

function Signup() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="logon-container">
      {/*<div className="signup-header">
        <Link to="/" className="back-svg"><FaArrowLeft /></Link>
      </div>*/}
      <h2>Sign up</h2>
      <div>{error}</div>
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
          const response = await axios.post(
            'http://localhost:9000/api/auth/signup',
            values,
          );
          console.log('response: ', response.data);
          if (response.data.status) {
            setError(response.data.status);
          } else {
            localStorage.setItem('accessToken', response.data.accessToken);
            navigate('/chat');
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <MyTextInput label="Username" name="username" />
            <MyTextInputPassword label="Password" name="password" />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      <div className="link-container">
        Already have an account? <Link to="/">Login</Link>
      </div>
    </div>
  );
}

export default Signup;
/*
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
*/
