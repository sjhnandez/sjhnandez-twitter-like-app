import React, { useState, useEffect, useContext } from "react";
import { verifyResetToken, changePassword } from "../../helpers/Api";
import { Redirect } from "react-router-dom";
import qs from "qs";
import Loading from "../Loading";
import SimpleInput from "../SimpleInput";
import UserContext from "../../contexts/UserContext";

import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";
import DefaultImage from "../../../assets/images/Default_PPicture.svg";

const ResetPassword = (props) => {
  const token = qs.parse(props.location.search, { ignoreQueryPrefix: true })
    .token;

  const [userState, setUserState] = useState({ user: null, reported: false });

  const setAuthState = useContext(UserContext).setAuthState;

  useEffect(() => {
    if (token) {
      verifyResetToken(token).then((user) => {
        setUserState({ user, reported: true });
      });
    } else if (props.location.state.user) {
      setUserState({ user: props.location.state.user, reported: true });
    }
  }, []);

  const [input, setInput] = useState({
    password: "",
    passwordConfirmation: "",
  });

  if (userState.user) {
    const handleChange = (event) => {
      event.persist();
      setInput((prevInput) => ({
        ...prevInput,
        [event.target.name]: event.target.value,
      }));
    };

    const handleSubmit = () => {
      changePassword(
        userState.user.screen_name,
        input.password,
        input.passwordConfirmation
      ).then((user) => {
        if (user) {
          setAuthState({ user, reported: true });
          props.history.push("/password_reset_complete");
        }
      });
    };

    return (
      <div className="password-reset-main-container">
        <div className="header-container">
          <div className="box-center">
            <img src={TwitterLogo} alt="logo" className="header-logo" />
            <span>Password Reset</span>
          </div>
        </div>
        <div className="reset-email-sent">
          <div className="box-center">
            <h1>Reset your password</h1>
            <div className="profile-container">
              <img src={DefaultImage} alt="profilep" />
              <div>
                <div className="name">{userState.user.name}</div>
                <div>{"@" + userState.user.screen_name}</div>
              </div>
            </div>
            <div className="info">
              Strong passwords include numbers, letters, and punctuation marks.
            </div>
            <b>Type your new password</b>
            <SimpleInput
              onChange={handleChange}
              type="password"
              name="password"
            />
            <b>Type your new password one more time</b>
            <SimpleInput
              onChange={handleChange}
              type="password"
              name="passwordConfirmation"
            />
            <div className="info">
              Resetting your password will log you out of all your active
              Twitter sessions.
            </div>
            <button className="button-filled" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  } else if (!userState.reported) {
    return <Loading />;
  } else {
    return <Redirect to="/begin_password_reset" />;
  }
};

export default ResetPassword;
