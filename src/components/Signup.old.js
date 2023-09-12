import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Login.css";

function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  // const [user, setUser] = useState({ email: "", username: "", password: "" });

  const onSubmit = async (data) => {
    // e.preventDefault();
    console.log("data: ", data);
    const response = await axios.post(
      "http://localhost:9000/api/auth/signup",
      data,
    );
    console.log("response: ", response);
    localStorage.setItem("accessToken", response.data.accessToken);
    navigate("/chat", { state: { username: response.data.username } });
  };

  /*const handleOnChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }*/

  const handleEmailCheck = async (e) => {
    const value = e.target.value;
    console.log("value: ", value);
    // const response = await axios.post()
  };

  return (
    <div className="logon-container">
      <Link to="/">back</Link>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email", {
              required: "required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            })}
          />
          {errors.email && <span role="alert">{errors.email.message}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: "required",
            })}
          />
          {errors.username && (
            <span role="alert">{errors.username.message}</span>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "required",
              minLength: {
                value: 5,
                message: "Min length is 5",
              },
            })}
          />
          {errors.password && (
            <span role="alert">{errors.password.message}</span>
          )}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Signup;

// https://time2hack.com/form-with-react-html5-validations/
// https://medium.com/nerd-for-tech/how-to-build-forms-with-multiple-input-fields-using-react-hooks-677da2b851aa

// https://www.uplabs.com/posts/chat-screen-ui-d53811c5-e463-4689-b123-c26973927f3c?utm_source=extension&utm_medium=click&utm_campaign=muzli

// https://react-hook-form.com/advanced-usage
