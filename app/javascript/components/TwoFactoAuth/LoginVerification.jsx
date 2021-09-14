import React, {useState, useEffect, useContext} from "react";
import TwitterLogo from "../../../assets/images/Twitter_Logo_White.svg";
import defaultImage from "../../../assets/images/default-user-image.png";
import SimpleInput from "../SimpleInput"
import UserContext from "../../contexts/UserContext";

import * as TwoFactorService from "../../helpers/TwoFactor";

const LoginVerification = (props) =>{

    const [number, setNumber] = useState();
    const [user, setUser] = useState();
    const [code, setCode] = useState();
    const setAuthState = useContext(UserContext).setAuthState;

    
    useEffect(() => {
        const usAux = props.location.state;
        if(!props.location.state){
            props.history.push({
                pathname: "/login",
            });   
        }
        else{
            setUser(usAux);
            setNumber(usAux.phone.substring(
                usAux.phone.length-2));

            TwoFactorService.sendRecoverySms(usAux.screen_name).then(
                (response) => {
                    console.log(response);
                }
            );
        }
    }, []);
    
    const handleSubmit = () =>{
        TwoFactorService.verify2Fac(code).then(
            (response) =>{
                if(response.complete){
                    setAuthState({ user: response.user, reported: true });
                    props.history.push({
                      pathname: "/home",
                  }); 
                }
            }
        )
    }

    const handleChange = (event) =>{
        setCode(event.target.value);
    }

    return (
        <div className="login-ver-main-container">
      <div className="header-container">
        <div className="box-center">
          <img src={TwitterLogo} alt="logo" className="header-logo" />
          <span>Two factor authentication</span>
        </div>
      </div>
      <div className="content">
        <div className="box-center">
          <h1>Log in with Email</h1>
          
          <div className="card">
            <div className="card-img">
              <img src={user?.profile_image_url || defaultImage} className="avatar"/>
            </div>
            <div className="card-header">
              <span className="name" >{user?.name}</span>
              <span className="screenname">{user?.screen_name}</span>
            </div>
          </div>
          <div className="message">
            <span>
                Check your email and enter the authentication code below
                to log in to Twitter. The code will expire in 5 minutes.
            </span>

          </div>
          <SimpleInput 
            placeholder="Verification code"
            onChange={handleChange}
          />
            <button 
                className="button-filled" 
                id="login-btn"  
                onClick={handleSubmit}  
            >
                Log in
            </button>
        </div>
      </div>
    </div>
    );
};

export default LoginVerification;