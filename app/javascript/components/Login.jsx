import React, { useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";

import LabeledInput from "./LabeledInput";
import * as api from "../helpers/Api";
import UserContext from "../contexts/UserContext";

import TwitterLogo from "../../assets/images/Twitter_Logo_White.svg";


const Login = (props) => {
  const [input, setInput] = useState({ userid: "", password: "" });
  const setAuthState = useContext(UserContext).setAuthState;

  const handleChange = (event) => {
    event.persist();
    setInput((prevInput) => ({
      ...prevInput,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.login(input.userid, input.password).then((response) => {
      if(response.completed){
        setAuthState({ user: response.user, reported: true });
      }
      else{
        props.history.push({
          pathname: "/login_verification",
          state: response.user,
        });
      }
    });
  };

  return (
    <div>
      <div className="login-main-container">
        <img src={TwitterLogo} alt="logo" className="logo" />
        <h2>Log in to twitter</h2>
        <LabeledInput
          type="text"
          name="userid"
          label="Phone, email or username"
          onChange={handleChange}
          value={input.userid}
        />
        <LabeledInput
          type="password"
          name="password"
          label="Password"
          onChange={handleChange}
          value={input.password}
        />
        <button
          className="button-filled"
          onClick={handleSubmit}
          disabled={
            input.password.trim().length == 0 || input.userid.trim().length == 0
          }
        >
          Log in
        </button>
        <span className="subtext-container">
          <Link style={{ textDecoration: "none" }} to="begin_password_reset">
            <span>Forgot password?</span>
          </Link>{" "}
          ·{" "}
          <button className="nostyle-button">
            <Link
              style={{ textDecoration: "none", color: "unset" }}
              to={{ pathname: "/signup", state: { isModal: true } }}
            >
              Sign up for twitter.
            </Link>
          </button>
        </span>
      </div>
    </div>
  );
};

export default withRouter(Login);
