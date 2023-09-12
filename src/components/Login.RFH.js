import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../userContext";
import {
  Box,
  Button,
  InputAdornment,
  OutlinedInput,
  IconButton,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Auth from "../services/Auth";
import NoAuthLayout from "./NoAuth.layout";
// import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm({
    shouldFocusError: false,
  });
  const { setUser } = useUserContext();
  const [show, setShow] = useState(false);
  const [usrNameError, setUsrNameError] = useState({
    hasError: false,
    msg: "",
  });
  const [passwordError, setPasswordError] = useState({
    hasError: false,
    msg: "",
  });

  const handleOnSubmit = async (values) => {
    console.log("onSubmit", values);
    // check str if it's an email or a username
    const emailFormat =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const keyType = emailFormat.test(values.username) ? "email" : "username";
    values.keyType = keyType;
    // console.log('values: ', values)
    const resp = await Auth.login(values);
    // console.log('resp: ', resp)
    const { data } = resp;
    // console.log('data: ', data)
    if (data.isSuccessful) {
      // console.log("fdjslkf;j: ", response.data.hasOwnProperty("username"))
      if (data.hasOwnProperty("username")) {
        // console.log('response: ', response.data)
        localStorage.setItem("accessToken", data.accessToken);
        setUser({ ...data });
        navigate("/chat");
      } else {
        // if username has not been created, redirect user to create username
        navigate("/create-username", { state: { userId: data.userId } });
      }
    } else {
      // setError(response.data.status)
      if (data.errorType === "user") {
        setUsrNameError({ hasError: true, msg: data.message });
      } else {
        setPasswordError({ hasError: true, msg: data.message });
      }
    }
    reset({ username: "", password: "" });
  };

  const handleShow = () => setShow(!show);

  const onErrors = (errors) => {
    const { password, username } = errors;
    console.log("errors: ", errors);
    // transfering controls from RHF to material-ui for feedback errors
    if (username) {
      setUsrNameError({
        hasError: true,
        msg: "Username or email is required.",
      });
    }
    if (password) {
      setPasswordError({ hasError: true, msg: "Password is required." });
    }
  };

  const onFocusHandler = (e) => {
    // console.log('onFocusHandler: ', e.target.name)
    // reset the error indicators when user is focused
    if (e.target.name === "username") {
      setUsrNameError({ hasError: false, msg: "" });
    }
    if (e.target.name === "password") {
      setPasswordError({ hasError: false, msg: "" });
    }
  };

  return (
    <NoAuthLayout
      heading={"Login"}
      subheading={"Login with your username or email"}
    >
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(handleOnSubmit, onErrors)}
      >
        <Box sx={{ margin: "20px 0" }}>
          <FormControl
            variant="outlined"
            fullWidth
            error={usrNameError.hasError}
            name="username"
            onFocus={onFocusHandler}
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{ top: "-7px" }}
            >
              Username or email
            </InputLabel>
            <OutlinedInput
              type="text"
              size="small"
              label="Username or email"
              {...register("username", { required: true })}
            />
            <FormHelperText id="component-error-text">
              {usrNameError.hasError ? usrNameError.msg : ""}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ margin: "20px 0" }}>
          <FormControl
            variant="outlined"
            fullWidth
            error={passwordError.hasError}
            name="password"
            onFocus={onFocusHandler}
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{ top: "-7px" }}
            >
              Password
            </InputLabel>
            <OutlinedInput
              type={show ? "text" : "password"}
              size="small"
              label="Password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleShow} edge="end">
                    {show ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              {...register("password", { required: true })}
            />
            <FormHelperText id="component-error-text">
              {passwordError.hasError ? passwordError.msg : ""}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ marginTop: "20px" }}>
          <Button variant="contained" type="submit" fullWidth>
            Login
          </Button>
        </Box>
        <Box sx={{ marginTop: "15px" }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </Box>
        <Box
          sx={{
            fontSize: "14px",
            marginTop: "15px",
          }}
        >
          Don't have an account? <Link to="/register">Sign up here</Link>
        </Box>
      </Box>
    </NoAuthLayout>
  );
};

export default Login;

// https://dribbble.com/shots/14223554-chat-Login-screen
// https://dribbble.com/shots/14396669-Chat-app-Login

/*
<div className="centered-cntr">
    <h3>Log in</h3>
    {error ? (
      <div className="text-danger">{error}</div>
      )
    : null}
    <form onSubmit={handleSubmit(handleOnSubmit, onErrors)}>
      <div className="form-field floating-label-cntr">
        <input
          className="floating-input" 
          type="text" 
          placeholder="Username or Email"
          {...register("inputValue", { required: true })} 
        />
        <label className="floating-label" htmlFor="inputValue">Username or Email</label>
      </div>
      <small className="text-danger">
        {errors?.inputValue && errors.inputValue.message}
      </small>
      <div className="form-field floating-label-cntr">
        <input
          className="floating-input" 
          type={show ? "text" : "password"} 
          placeholder="Password"
          {...register("password", { required: true })} 
        />
        <label className="floating-label" htmlFor="password">Password</label>
        <FaEyeSlash className='fa-eye' onClick={() => setShow(!show)} />
      </div>
      <small className="text-danger">
        {errors?.password && errors.password.message}
      </small>
      <div className="form-field marginTop20">
        <button type="submit" className="btn btn-primary btn-sm">Login</button>
      </div>
    </form>
    <Link to="/forgot-password">Forgot password?</Link>
    <div className="link-container">
      Don't have an account? <Link to="/register">Sign up here</Link>
    </div>
  </div>
*/
/*
<Box sx={{ margin: '10px 0'}}>
  <TextField
    variant="outlined"
    label="Username or email"
    type="text"
    fullWidth
    size="small"
    sx={{ margin: '15px 0' }}
    helperText={usrNameError.hasError ? usrNameError.msg : ''}
    error={usrNameError.hasError}
    // onFocus={onFocusHandler}
    {...register('username', { required: true })}
  />
</Box>
*/
