import React, { useState } from "react";
import { findUserForReset } from "../../helpers/Api";

import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";
import SimpleInput from "../SimpleInput";

const BeginReset = (props) => {
  const [userid, setUserid] = useState("");

  const handleChange = (event) => {
    setUserid(event.target.value);
  };

  const handleSubmit = () => {
    findUserForReset(userid).then((response) => {
      if (response.phone_hint) {
        props.history.push({
          pathname: "/send_password_reset",
          state: {
            name: response.name,
            screenName: response.screen_name,
            phoneHint: response.phone_hint,
            emailHint: response.email_hint,
            profileImg: response.profile_image_url,
          },
        });
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
      <div className="begin-reset">
        <div className="box-center">
          <h1>Find your Twitter account</h1>
          <span className="prompt">
            Enter your email, phone number or username.
          </span>
          <SimpleInput onChange={handleChange} />
          <button className="button-filled" onClick={handleSubmit}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeginReset;
