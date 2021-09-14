import React, { useState, useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import * as DirectService from "../helpers/Direct";
import "../../assets/stylesheets/messages.scss";

const Messages = (props) => {
  const [user, setAuthState] = [
    useContext(UserContext).authState.user,
    useContext(UserContext).setAuthState,
  ];
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    console.log(user);
    DirectService.getDirectMessages({ id: user.id }).then((response) => {
      console.log(response);
      setMessages(response);
    });
  }, []);

  return (
    <div className="messages-main-container">
      {messages.map((message) => {
        return (
          <div className="tweet-retweet">
            <div className="tweet-box">
              <div className="tweet-body">
                <div className="tweet-avatar">
                  <img
                    src={message.user?.profile_image_url || defaultUserPhoto}
                    alt=""
                  />
                </div>
                <div className="content-footer">
                  <div className="tweet-header">
                    <span id="tweet-name">
                      {message.user?.name || "User Name"}
                    </span>
                    <span id="tweet-username">
                      {"@" + message.user?.screen_name || "@username"}
                    </span>
                  </div>
                  <div className="tweet-text">
                    <p style={{ backgroundColor: "transparent" }}>
                      {message.message || "tweet_content"}
                    </p>
                  </div>
                  {message.has_image ? (
                    <div className="tweet-img">
                      <img src={message.image_url} alt="" />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
