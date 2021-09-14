import React, { useContext, useState, useEffect } from "react";
import defaultUserPhoto from "../../assets/images/default-user-image.png";
import moment from "moment";
import DateRangeIcon from "@material-ui/icons/DateRange";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import LinkOutlinedIcon from "@material-ui/icons/LinkOutlined";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tweet from "./Tweet";
import * as TweetService from "../helpers/tweet";
import { withRouter, Link, Route } from "react-router-dom";
import Followings from "./Following";
import Followers from "./Followers";
import UserContext from "../contexts/UserContext";
import * as FollowService from "../helpers/Follow";

const Profile = (props) => {
  const authedUser = useContext(UserContext).authState.user;
  const user = props.user ? props.user : authedUser;
  const [tab, setTab] = useState(0);
  const [isFollowed, setFollowed] = useState();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const [tweets, setTweets] = useState([]);

  const fetchTweets = () => {
    TweetService.index().then((tweets) => {
      setTweets(tweets.reverse());
      console.log(tweets);
    });
  };

  const fetchIsFollowing = () => {
    FollowService.isFollowing({
      account: authedUser.screen_name,
      followed: props.user.screen_name,
    }).then((response) => {
      console.log("effect", response);
      if (response.data.message) {
        setFollowed(null);
      } else {
        setFollowed(response.data[0]);
      }
    });
  };

  const fetchFollowers = () => {
    FollowService.followers({ account: props.user.screen_name }).then(
      (response) => {
        console.log("Followers: ", response.data.length);
        setFollowersCount(response.data.length);
      }
    );
  };

  const fetchFollowings = () => {
    FollowService.followings({ account: props.user.screen_name }).then(
      (response) => {
        console.log("Followings: ", response.data.length);
        setFollowingsCount(response.data.length);
      }
    );
  };

  useEffect(() => {
    fetchTweets();
    fetchIsFollowing();
    fetchFollowers();
    fetchFollowings();
  }, []);

  const handleDelete = (tweet_id) => {
    TweetService.destroy(tweet_id).then((response) => {
      fetchTweets();
    });
  };

  const handleEditProfile = (event) => {
    event.preventDefault();
    props.history.push({
      pathname: "/settings/profile",
      state: { isModal: true },
    });
  };

  const handleFollow = (event) => {
    event.preventDefault();
    if (authedUser && authedUser.screen_name == user.screen_name) {
      return null;
    } else {
      if (isFollowed) {
        FollowService.isFollowing({
          account: authedUser.screen_name,
          followed: user.screen_name,
        }).then((response) => {
          console.log("response", response);
          FollowService.destroy(response.data[0].id).then((res) => {
            console.log(res);
            setFollowed(false);
          });
        });
        event.currentTarget.style.backgroundColor = "transparent";
      } else {
        FollowService.create({
          account: authedUser.screen_name,
          follower: user.screen_name,
        }).then((res) => {
          console.log(res);
          setFollowed(true);
        });
        event.currentTarget.style.backgroundColor = "rgba(29,161,242,0.9)";
      }
    }
  };

  const handleFollowView = () => {
    setTab(1);
  };

  return (
    <div className="profile-main-container">
      {location.pathname === "/" + user.screen_name ? (
        <div>
          <div className="banner">
            <img src={user.profile_banner_url} />
          </div>
          <div className="info">
            <div className="button-image-container">
              <div className="image">
                <img
                  src={
                    user.profile_image_url
                      ? user.profile_image_url
                      : defaultUserPhoto
                  }
                />
              </div>
              {authedUser && authedUser.screen_name == user.screen_name ? (
                <button className="button-outlined" onClick={handleEditProfile}>
                  Edit profile
                </button>
              ) : isFollowed ? (
                <button
                  className="button-filled"
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
              ) : (
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
              )}
            </div>
            <h3>{user.name}</h3>
            <div>{"@" + user.screen_name}</div>
            <div className="bio">{user.description}</div>
            <div className="personal-info">
              {user?.location && (
                <span className="icon-text">
                  <LocationOnOutlinedIcon className="icon" />
                  <span>{user.location}</span>
                </span>
              )}
              {user?.url && (
                <span className="icon-text">
                  <LinkOutlinedIcon className="icon" />
                  <a
                    href={"https://" + user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {user.url}
                  </a>
                </span>
              )}
              <span className="icon-text">
                <DateRangeIcon className="icon" />
                Joined {moment(user.created_at).format("MMM YYYY")}
              </span>
            </div>
            <div className="follow-box">
              <div className="follow">
                <span className="follow-number">{followingsCount}</span>{" "}
                Followings
              </div>
              <div className="follow">
                <span className="follow-number">{followersCount}</span>{" "}
                Followers
              </div>
            </div>
          </div>
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Tweets" />
            <Tab label="Followings" />
            <Tab label="Followers" />
          </Tabs>
          <div className="tweet-container">
            {(() => {
              if (tab == 0) {
                return tweets.map((tweet) => {
                  if (tweet.user.screen_name === user.screen_name) {
                    return (
                      <Tweet
                        key={tweet.id}
                        id={tweet.id}
                        commentNumber={tweet.reply_count}
                        retweetNumber={tweet.retweets.length}
                        likeNumber={tweet.likes.length}
                        likes={tweet.likes}
                        retweets={tweet.retweets}
                        name={tweet.user.name}
                        username={tweet.user.screen_name}
                        content={tweet.text}
                        onDelete={handleDelete}
                        isOwnTweet={tweet.user_id === user.id}
                        UserPhoto={tweet.user.profile_image_url}
                        isRetweet={tweet.is_retweet}
                        hasImage={tweet.hasImage}
                        image_url={tweet.image_url}
                        tweet_ret_id={tweet.tweet_ret_id}
                      />
                    );
                  }
                });
              } else if (tab == 1) {
                return (
                  <div>
                    <Followings user={user} />
                  </div>
                );
              } else {
                return (
                  <div>
                    <Followers user={user} />
                  </div>
                );
              }
            })()}
          </div>
        </div>
      ) : (
        () => {
          console.log("path: ", location.pathname);
          console.log("result: ", "/" + user.screen_name + "/followings");
          if (location.pathname === "/" + user.screen_name + "/followings") {
            console.log("entra en followings");
            return (
              <div>
                <h2>followings</h2>
                <Followings user={user} />
              </div>
            );
          } else if (
            location.pathname ===
            "/" + user.screen_name + "/followers"
          ) {
            return (
              <div>
                <Followers />
              </div>
            );
          } else {
            return (
              <div>
                <h2>none</h2>
              </div>
            );
          }
        }
      )}
    </div>
  );
};

export default withRouter(Profile);
