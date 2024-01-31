import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { MyTextInput, MyTextInputPassword } from './TextInput';
import { useUserContext } from '../userContext';
import './Login.css';
// https://codesandbox.io/s/formik-v2-tutorial-added-textarea-ujz18?file=/src/index.js
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Too short!')
    .max(50, 'Too long!')
    .required('Required'),
  password: Yup.string().required('Required'),
});

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const [error, setError] = useState(null);

  return (
    <div className="centered-cntr">
      <h2>Log in</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validateSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          // console.log('onSubmit: ', values)
          actions.resetForm();
          /*const response = await axios.post('http://localhost:9000/api/auth/login', values, {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })*/
          const response = await axios.post(
            'http://localhost:9000/api/auth/login',
            values,
            {
              withCredentials: true,
            },
          );
          // console.log('response: ', response.data)
          if (response.data.status) {
            setError(response.data.status);
          } else {
            // console.log('response: ', response)
            localStorage.setItem('accessToken', response.data.accessToken);
            // localStorage.setItem('user', JSON.stringify(response.data))
            setUser(response.data);
            navigate('/chat');
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div>{error}</div>
            <MyTextInput label="Username" name="username" />
            <MyTextInputPassword label="Password" name="password" />
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      <div className="link-container">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </div>
    </div>
  );
}

export default Login;
