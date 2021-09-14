import React, { useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";

import * as api from "../helpers/Api";
import UserContext from "../contexts/UserContext";

import LabeledInput from "./LabeledInput";

import "../../assets/stylesheets/home.scss";

import TwitterLogo from "../../assets/images/Twitter_Logo_White.svg";

const Home = (props) => {
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
      <div className="homepage-main-container">
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <LabeledInput
              type="text"
              name="userid"
              label="Phone, email or username"
              onChange={handleChange}
              value={input.userid}
            />
            <div className="password-container">
              <LabeledInput
                type="password"
                name="password"
                label="Password"
                onChange={handleChange}
                value={input.password}
              />
              <div>
                <Link
                  style={{ textDecoration: "none" }}
                  to="begin_password_reset"
                >
                  <span>Forgot password?</span>
                </Link>
              </div>
            </div>
            <button type="submit" className="button-outlined">
              Log in
            </button>
          </div>
        </form>
        <div className="mid-container">
          <img src={TwitterLogo} alt="logo" className="logo" />
          <h1>See what's happening in the world right now</h1>
          <div>
            <h4>Join Twitter today.</h4>

            <Link
              style={{
                textDecoration: "none",
                color: "unset",
              }}
              to={{ pathname: "/signup", state: { isModal: true } }}
            >
              <button className="button-filled">Sign up</button>
            </Link>

            <button
              className="button-outlined"
              onClick={() => {
                props.history.push("login");
              }}
            >
              Log in
            </button>
          </div>
        </div>
        <div className="footer-container">
          {/*           <Link style={{ textDecoration: "none", color: "inherit" }}>
            About
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Help Center
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Terms
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Privacy policy
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Cookies
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Ads info
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>Blog</Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Status
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>Jobs</Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Brand
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Advertise
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Marketing
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Businesses
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Developers
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Directory
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            Settings
          </Link>
          <Link style={{ textDecoration: "none", color: "inherit" }}>
            &copy; 2020 Twitter, Inc.
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Home);
