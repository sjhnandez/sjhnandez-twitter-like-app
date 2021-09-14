import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";

import { logout } from "../helpers/Api";
import UserContext from "../contexts/UserContext";

const DashNav = (props) => {
  const setAuthState = useContext(UserContext).setAuthState;

  const handleLogout = () => {
    logout();
    setAuthState({ user: null, reported: true });
  };
  return (
    <div className="dash-nav">
      <div className="button-container">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button className="nostyle-button-icon">
            <HomeOutlinedIcon className="nav-icon" />
            <h2>Home</h2>
          </button>
        </Link>
      </div>
      <div className="button-container">
        <Link to="/messages" style={{ textDecoration: "none" }}>
          <button className="nostyle-button-icon">
            <MailOutlineIcon className="nav-icon" />
            <h2>Messages</h2>
          </button>
        </Link>
      </div>
      <div className="button-container">
        <Link
          to={"/" + props.user.screen_name}
          style={{ textDecoration: "none" }}
        >
          <button className="nostyle-button-icon">
            <PersonOutlineOutlinedIcon className="nav-icon" />
            <h2>Profile</h2>
          </button>
        </Link>
      </div>
      <div className="button-container">
        <button className="nostyle-button-icon" onClick={handleLogout}>
          <ExitToAppOutlinedIcon className="nav-icon" />
          <h2>Log out</h2>
        </button>
      </div>
    </div>
  );
};

export default DashNav;
