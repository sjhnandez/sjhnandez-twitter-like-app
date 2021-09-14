import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { sendRecoveryEmail, sendRecoverySms } from "../../helpers/Api";

import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";
import DefaultImage from "../../../assets/images/Default_PPicture.svg";

const SendReset = (props) => {
  const [phoneSelected, setPhoneSelected] = useState(true);

  const handleChange = () => {
    setPhoneSelected((prevSelection) => !prevSelection);
  };

  const handleSubmit = () => {
    if (!phoneSelected) {
      sendRecoveryEmail(props.location.state.screenName).then((response) => {
        if (response.success) {
          props.history.push({
            pathname: "/reset_email_sent",
            state: { emailHint: props.location.state.emailHint },
          });
        }
      });
    } else {
      sendRecoverySms(props.location.state.screenName).then((response) => {
        if (response.success) {
          props.history.push({
            pathname: "/confirm_pin_reset",
            state: { phoneHint: props.location.state.phoneHint },
          });
        }
      });
    }
  };

  if (props.location.state) {
    return (
      <div className="password-reset-main-container">
        <div className="header-container">
          <div className="box-center">
            <img src={TwitterLogo} alt="logo" className="header-logo" />
            <span>Password Reset</span>
          </div>
        </div>
        <div className="send-reset">
          <div className="box-center">
            <h1>How do you want to reset your password?</h1>
            <div className="profile-container">
              <img
                src={props.location.state.profileImg || DefaultImage}
                alt="profilep"
              />
              <div>
                <div className="name">{props.location.state.name}</div>
                <div>{"@" + props.location.state.screenName}</div>
              </div>
            </div>
            <span className="prompt">
              We found the following information associated with your account.
            </span>
            <div className="radio-container">
              <input
                type="radio"
                onChange={handleChange}
                checked={phoneSelected}
              />
              <span>
                Text a confirmation code to my phone ending in{" "}
                <b>{props.location.state.phoneHint}</b>
              </span>
            </div>
            <div className="radio-container">
              <input
                type="radio"
                onChange={handleChange}
                checked={!phoneSelected}
              />
              <span>
                Email a link to <b>{props.location.state.emailHint}</b>
              </span>
            </div>
            <button className="button-filled" onClick={handleSubmit}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to="begin_password_reset" />;
  }
};

export default SendReset;
