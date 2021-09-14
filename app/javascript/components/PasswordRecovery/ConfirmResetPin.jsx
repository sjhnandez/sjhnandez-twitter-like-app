import React, { useState } from "react";
import SimpleInput from "../SimpleInput";

import { verifyResetPin } from "../../helpers/Api";

import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";

const ConfirmResetPin = (props) => {
  const [code, setCode] = useState("");

  const handleChange = (event) => {
    setCode(event.target.value);
  };

  const handleSubmit = () => {
    verifyResetPin(code).then((user) => {
      if (user) {
        props.history.push({ pathname: "reset_password", state: { user } });
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
      <div className="confirm-pin">
        <div className="box-center">
          <h1>Check your phone</h1>
          <span>
            We've texted a confirmation code to the phone number ending in{" "}
            <b>{props.location.state.phoneHint}</b>. Once you get the code,
            enter it below to reset your password.
          </span>
          <SimpleInput
            onChange={handleChange}
            placeholder="Enter your code here"
          />
          <button className="button-filled" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmResetPin;
