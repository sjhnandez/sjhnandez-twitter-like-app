import React from "react";

import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";

const ResetComplete = (props) => {
  return (
    <div className="password-reset-main-container">
      <div className="header-container">
        <div className="box-center">
          <img src={TwitterLogo} alt="logo" className="header-logo" />
          <span>Password Reset</span>
        </div>
      </div>
      <div className="reset-complete">
        <div className="box-center">
          <h1>You’re all set. You've successfully changed your password.</h1>
          <span>
            <button
              className="nostyle-button"
              onClick={() => {
                props.history.push("/home");
              }}
            >
              Continue to Twitter
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetComplete;
