import React, { useContext, useEffect, useState } from "react";
import TweetList from "./TweetList";
import { logout, lookupUser } from "../helpers/Api";
import DashNav from "./DashNav";
import Profile from "./Profile";
import { useLocation, withRouter, Redirect } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Loading from "./Loading";
import * as FollowService from "../helpers/Follow";
import UserContext from "../contexts/UserContext";
import Messages from "./Messages";
import NewMessageModal from "./NewMessageModal";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import newMessage from "../../assets/images/New_message.svg";
import "../../assets/stylesheets/dashboard.scss";

const Dashboard = (props) => {
  const context = useContext(UserContext);
  const [authState, setAuthState] = [context.authState, context.setAuthState];
  const location = useLocation();
  const [user, setUser] = useState({ userLookup: null, reported: false });
  const [followed, setFollowed] = useState({});
  const [tempQuery, setTempQuery] = useState("");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(0);
  const [newMessageState, setNewMessageState] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleBack = () => {
    props.history.push("/home");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(tempQuery);
    props.history.push("/search");
  };

  const handleNewMessage = () => {
    setNewMessageState(true);
  };

  const handleClose = () => {
    setNewMessageState(false);
  };

  useEffect(() => {
    setTab(0);
    if (props.location.state && props.location.state.query) {
      setQuery(props.location.state.query);
      setTempQuery(props.location.state.query);
    }
    if (
      location.pathname !== "/home" &&
      location.pathname !== "/search" &&
      location.pathname !== "/messages"
    ) {
      lookupUser(location.pathname.substring(1, location.pathname.length)).then(
        (user) => {
          setUser({ userLookup: user, reported: true });
          FollowService.isFollowing({
            account: authState.user.screen_name,
            followed: user.screen_name,
          }).then((response) => {
            if (response.data.message) {
              setFollowed(null);
            } else {
              setFollowed(response);
            }
          });
        }
      );
    } else if (location.pathname === "/home") {
      setQuery("");
      setTempQuery("");
    }
  }, [location]);

  return (
    <div className="dashboard-main-container">
      <DashNav user={authState.user} />

      <div className="center-panel border-left border-right">
        {location.pathname === "/home" ? (
          <>
            <div className="header-container border-bottom">
              <h2>Home</h2>
            </div>
            <TweetList user={authState.user} />
          </>
        ) : location.pathname === "/messages" ? (
          <>
            <div className="header-container border-bottom">
              <h2>Mensajes</h2>
              <button
                className="new-messageIcon"
                id="msg-icon"
                type="text"
                onClick={handleNewMessage}
              >
                <img src={newMessage} className="" />
              </button>
            </div>
            {newMessageState ? <NewMessageModal onClose={handleClose} /> : null}
            <Messages user={authState.user} />
          </>
        ) : location.pathname === "/search" ? (
          <>
            <div className="header-container border-bottom">
              <button className="nostyle-button-icon" onClick={handleBack}>
                <ArrowBackIcon />
              </button>
              <div className="search-wrapper-header">
                <SearchRoundedIcon />
                <form onSubmit={handleSearchSubmit}>
                  <input
                    autoComplete="off"
                    name="query"
                    onChange={(e) => setTempQuery(e.target.value)}
                    value={tempQuery}
                    placeholder="Search Twitter"
                  />
                  <button type="submit" />
                </form>
              </div>
            </div>
            <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Tweets" />
              <Tab label="People" />
            </Tabs>
            <TweetList
              user={authState.user}
              filter={query}
              filterAtt={tab == 0 ? "text" : "user"}
            />
          </>
        ) : (
          (() => {
            if (
              (user.reported && user.userLookup) ||
              location.pathname === "/settings/profile"
            ) {
              return (
                <>
                  <div className="header-container border-bottom">
                    <button
                      className="nostyle-button-icon"
                      onClick={handleBack}
                    >
                      <ArrowBackIcon />
                    </button>
                    <h2>
                      {user.userLookup && user.userLookup.name
                        ? user.userLookup.name
                        : authState.user.name}
                    </h2>
                  </div>
                  <Profile user={user.userLookup} followed={followed} />
                </>
              );
            } else {
              return null;
            }
          })()
        )}
      </div>

      <div className="dashboard-right-column">
        {location.pathname !== "/search" ? (
          <div className="search-wrapper">
            <SearchRoundedIcon />
            <form onSubmit={handleSearchSubmit}>
              <input
                autoComplete="off"
                name="query"
                onChange={(e) => setTempQuery(e.target.value)}
                value={tempQuery}
                placeholder="Search Twitter"
              />
              <button type="submit" />
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default withRouter(Dashboard);
