import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Auth from "../services/Auth";
import NoAuthLayout from "./NoAuth.layout";
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

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({ shouldFocusError: false });
  const [show, setShow] = useState(false);
  // const [error, setError] = useState(null);

  const [emailError, setEmailError] = useState({ hasError: false, msg: "" });
  const [passwordError, setPasswordError] = useState({
    hasError: false,
    msg: "",
  });
  const [fnameError, setFnameError] = useState({ hasError: false, msg: "" });
  const [lnameError, setLnameError] = useState({ hasError: false, msg: "" });

  const handleShow = () => setShow(!show);

  const handleOnSubmit = async (values) => {
    // console.log('onSubmit: ', values)
    // return;
    const resp = await Auth.signup(values);
    console.log("response: ", resp.data);
    if (resp.data.isSuccessful) {
      // localStorage.setItem("accessToken", resp.data.accessToken);
      // setUser(resp.data);
      navigate("/create-username", { state: { user: resp.data } });
    } else {
      setEmailError({ hasError: true, msg: resp.data.message });
    }
  };

  const onErrors = (errors) => {
    // console.log('errors: ', errors)
    const { email, password, fname, lname } = errors;

    if (email) {
      setEmailError({ hasError: true, msg: email.message });
    }
    if (password) {
      setPasswordError({ hasError: true, msg: password.message });
    }
    if (fname) {
      setFnameError({ hasError: true, msg: fname.message });
    }
    if (lname) {
      setLnameError({ hasError: true, msg: lname.message });
    }
  };

  const onFocusHandler = (e) => {
    // console.log('onFocusHandler: ', e.target.name)
    // reset the error indicators when user is focused
    if (e.target.name === "email") {
      setEmailError({ hasError: false, msg: "" });
    }
    if (e.target.name === "password") {
      setPasswordError({ hasError: false, msg: "" });
    }
    if (e.target.name === "fname") {
      setFnameError({ hasError: false, msg: "" });
    }
    if (e.target.name === "lname") {
      setLnameError({ hasError: false, msg: "" });
    }
  };

  const resetHandler = () => {
    setEmailError({ hasError: false, msg: "" });
    setLnameError({ hasError: false, msg: "" });
    setPasswordError({ hasError: false, msg: "" });
    setFnameError({ hasError: false, msg: "" });
  };

  return (
    <NoAuthLayout heading={"Sign up"} subheading={"It's quick and easy!"}>
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
            error={emailError.hasError}
            name="email"
            onFocus={onFocusHandler}
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{ top: "-7px" }}
            >
              Email
            </InputLabel>
            <OutlinedInput
              type="text"
              size="small"
              label="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            <FormHelperText id="component-error-text">
              {emailError.hasError ? emailError.msg : ""}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ margin: "20px 0" }}>
          <FormControl
            variant="outlined"
            fullWidth
            error={fnameError.hasError}
            name="fname"
            onFocus={onFocusHandler}
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{ top: "-7px" }}
            >
              First name
            </InputLabel>
            <OutlinedInput
              type="text"
              size="small"
              label="First name"
              {...register("fname", { required: "First name is required" })}
            />
            <FormHelperText id="component-error-text">
              {fnameError.hasError ? fnameError.msg : ""}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box sx={{ margin: "20px 0" }}>
          <FormControl
            variant="outlined"
            fullWidth
            error={lnameError.hasError}
            name="lname"
            onFocus={onFocusHandler}
          >
            <InputLabel
              htmlFor="outlined-adornment-password"
              sx={{ top: "-7px" }}
            >
              Last name
            </InputLabel>
            <OutlinedInput
              type="text"
              size="small"
              label="Last name"
              {...register("lname", { required: "Last name is required" })}
            />
            <FormHelperText id="component-error-text">
              {lnameError.hasError ? lnameError.msg : ""}
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              })}
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
          <Button variant="text" type="reset" onClick={resetHandler} fullWidth>
            Reset
          </Button>
        </Box>
      </Box>
      <div className="link-container">
        Already have an account? <Link to="/">Login</Link>
      </div>
    </NoAuthLayout>
  );
};

export default Signup;

/*
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
*/

/*
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
*/
