import React, { useState, useContext } from "react";
import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";
import LabeledInput from "../LabeledInput";
import UserContext from "../../contexts/UserContext"
import * as TwoFactorService from "../../helpers/TwoFactor";

import { withRouter } from "react-router-dom";
 

const ConfirmPasswordModal = (props) => {
  const [password, setPassword] = useState("");
  const user = useContext(UserContext).authState.user;
  const setAuthState = useContext(UserContext).setAuthState;
  const [wrongPass, setWrongPass] = useState(false);
  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCancelChange = (event) =>{
    event.preventDefault();
    props.history.goBack();

  }

  const handleActivationChange = (event) =>{
    event.preventDefault();
    TwoFactorService.checkIdentity(
        {
            username: user.screen_name,
            password:password
        }).then(
        (response) => {
            if(response){
                setAuthState({user: response.user , reported: true });
                props.history.push("/"+ user.screen_name);
            }
            else{
              setWrongPass(true);
            }
        }
    )
  }

  return (
    <div className="body-container">
      <div className="confirm-password-dialog-main-container">
        <div className="header">
          <div className="header-inital"></div>
          <div className="header-img">
            <img src={TwitterLogo} height="25" />
          </div>
          <div className="header-btn">
            {password.length === 0 ? (
              <button className="btn-outlined"
                name="cancel"
                onClick={handleCancelChange}
              >
                <span>Cancel</span>
              </button>
            ) : (
              <button className="btn-outlined"
                name="next"
                onClick={handleActivationChange}
              >
                <span>Activate</span>
              </button>
            )}
          </div>
        </div>
        <div className="content">
          <div className="content-header">
            <h2>Verify your password</h2>
            <span>Re-enter your Twitter password to continue.</span>
          </div>
          <div className="content-input">
            <LabeledInput
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={handleChange}
            />
          </div>
        </div>
        { wrongPass ? 
        
        <div className="alert">
          <div className="alert-box">
            <span>Incorrect password</span>
          </div>
        </div>
        : ""}
      </div>
    </div>
  );
};

export default withRouter(ConfirmPasswordModal);
