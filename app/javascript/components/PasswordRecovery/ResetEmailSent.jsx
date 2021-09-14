import React from "react";

import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";

const ResetEmailSent = () => {
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
          <h1>Check your email</h1>
          <div className="prompt">
            We've sent you an email. Click the link in the email to reset your
            password.
          </div>
          <div className="prompt-2">
            If you don't see the email, check the other places it might be, like
            your junk, spam, social, or other folders.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetEmailSent;
