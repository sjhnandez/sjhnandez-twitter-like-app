import React, { useEffect, useState, useContext } from "react";
import defaultUserPhoto from "../../assets/images/default-user-image.png";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import * as FollowService from "../helpers/Follow";

const FollowCard = (props) => {
  const authedUser = useContext(UserContext).authState.user;

  const [follow, setFollowed] = useState(false);
  const [followsYou, setFollowsYou] = useState(false);

  const handleFollow = (event) => {
    event.preventDefault();
    if (authedUser && authedUser.screen_name == props.username) {
      return null;
    } else {
      if (follow) {
        event.currentTarget.style.backgroundColor = "transparent";
        FollowService.isFollowing({
          account: authedUser.screen_name,
          followed: props.username,
        }).then((response) => {
          console.log("response", response);
          FollowService.destroy(response.data[0].id).then((res) => {
            console.log("change to false", res);
            setFollowed(false);
          });
        });
      } else {
        event.currentTarget.style.backgroundColor = "transparent";
        FollowService.create({
          account: authedUser.screen_name,
          follower: props.username,
        }).then((res) => {
          console.log("change to true", res);
          setFollowed(true);
        });
      }
    }
    event.currentTarget.style.backgroundColor = "transparent";
  };

  useEffect(() => {
    FollowService.isFollowing({
      account: authedUser.screen_name,
      followed: props.username,
    }).then((response) => {
      console.log("effect", response);
      if (response.data.message) {
        setFollowed(false);
      } else {
        setFollowed(true);
      }
    });
    FollowService.isFollowing({
      account: props.username,
      followed: authedUser.screen_name,
    }).then((response) => {
      if (response.data.message) {
        setFollowsYou(false);
      } else {
        setFollowsYou(true);
      }
    });
  }, []);

  return (
    <div className="follow-card-view-main-container border-bottom">
      <div className="follow-card">
        <div className="follow-card-body">
          <Link
            style={{
              textDecoration: "none",
              color: "unset",
              backgroundColor: "transparent",
            }}
            to={{ pathname: "/" + props.username }}
          >
            <div className="follow-avatar">
              <img src={props.UserPhoto || defaultUserPhoto} alt="" />
            </div>
          </Link>
          <div className="content-footer">
            <div className="follow-card-header">
              <div className="follow-card-names">
                <Link
                  style={{
                    textDecoration: "none",
                    color: "unset",
                    backgroundColor: "transparent",
                  }}
                  to={{ pathname: "/" + props.username }}
                >
                  <span id="follow-card-name">{props.name || "User Name"}</span>
                </Link>
                <div className="follows-you">
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "unset",
                      backgroundColor: "transparent",
                    }}
                    to={{ pathname: "/" + props.username }}
                  >
                    <span id="follow-card-username">
                      {"@" + props.username || "@username"}
                    </span>
                  </Link>
                  {followsYou ? (
                    <div className="message">
                      <span>Follows you</span>
                    </div>
                  ) : null}
                </div>
              </div>
              {props.username === authedUser.screen_name ? null : !follow ? (
                <button
                  className="btn-corner button-outlined"
                  onClick={handleFollow}
                  onMouseEnter={(e) => {
                    (e.currentTarget.style.backgroundColor =
                      "rgba($color: #1da1f2, $alpha: 0.4)"),
                      (e.currentTarget.style.borderColor = "#1da1f2");
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget.style.backgroundColor =
                      "rgba($color: #1da1f2, $alpha: 0.2)"),
                      (e.currentTarget.style.borderColor = "#1da1f2");
                  }}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn-corner button-filled"
                  onClick={handleFollow}
                  onMouseEnter={(e) => {
                    (e.currentTarget.textContent = "Unfollow"),
                      (e.currentTarget.style.backgroundColor =
                        "rgb(202,32,85)"),
                      (e.currentTarget.style.borderColor = "rgb(202,32,85)");
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.textContent = "Following";
                    (e.currentTarget.style.backgroundColor =
                      "rgba(29, 161, 242, 0.9)"),
                      (e.currentTarget.style.borderColor =
                        "rgba(29,161,242,0.9)");
                  }}
                >
                  Following
                </button>
              )}
            </div>
            <div className="tweet-text">
              <p style={{ backgroundColor: "transparent" }}>
                {props.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowCard;
