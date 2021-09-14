import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../../assets/stylesheets/tweet.scss";

/* Images */
import defaultUserPhoto from "../../assets/images/default-user-image.png";
import CommentIcon from "../../assets/images/Comment_Icon.svg";
import RetweetIcon from "../../assets/images/Retweet_Icon.svg";
import LikeIcon from "../../assets/images/Like_Icon.svg";
import SaveIcon from "../../assets/images/Save_Icon.svg";
import CommentIconSelected from "../../assets/images/Comment_Icon_Selected.svg";
import RetweetIconSelected from "../../assets/images/Retweet_Icon_Selected.svg";
import LikeIconSelected from "../../assets/images/Like_Icon_Selected.svg";
import SaveIconSelected from "../../assets/images/Save_Icon_Selected.svg";
import LikeIconFilled from "../../assets/images/Like_Icon_filled.svg";
import TrashIcon from "../../assets/images/Trash_icon.svg";
import ArrowDownIcon from "../../assets/images/Arrow_down.svg";
import ConfirmDialog from "./ConfirmDialog";
import RetweetModal from "./RetweetModal";

import * as TweetService from "../helpers/tweet";
import UserContext from "../contexts/UserContext";

import { getUploadLink, uploadFile } from "../helpers/Api";

const Tweet = (props) => {
  const hashtagRegex = /(#[\w_-]+)/;
  const mentionRegex = /(@[\w_-]+)/;

  const [menuState, setMenuState] = useState(0);
  const [likes, setLikes] = useState(props.likes);
  const [retweets, setRetweets] = useState(props.retweets);
  const [likeIc, setLikeIc] = useState(LikeIcon);
  const [likeIcSel, setLikeIcSel] = useState(LikeIconSelected);
  const [retweetIc, setRetweetIc] = useState(RetweetIcon);
  const [likeNumber, setLikeNumber] = useState(props.likeNumber);
  const [retweetNumber, setRetweetNumber] = useState(props.retweetNumber);
  const [commentNumber, setCommentNumber] = useState(props.commentNumber);
  const [alreadyRetw, setAlreadyRetw] = useState(false);
  const [secondTweet, setSecondTweet] = useState("");
  const [contentComponents, setContentComponents] = useState();
  const [contentComponentsRetweet, setContentComponentsRetweet] = useState();

  const [isRetweetSelected, setIsRetweetSelected] = useState(false);

  const [user, setAuthState] = [
    useContext(UserContext).authState.user,
    useContext(UserContext).setAuthState,
  ];

  useEffect(() => {
    const found = props.likes.find((like) => like.user_id === user.id);
    if (found) {
      setLikeIc(LikeIconFilled);
      setLikeIcSel(LikeIconFilled);
    }
    const foundRetw = props.retweets.filter(
      (retweet) => retweet.user_id === user.id
    );
    for (let i = 0; i < foundRetw.length; i++) {
      const ret = foundRetw[i];
      if (ret && ret.message?.length === 0) {
        setAlreadyRetw(true);
        setRetweetIc(RetweetIconSelected);
      }
    }

    if (props.isRetweet && props.tweet_ret_id) {
      TweetService.getTweet(props.tweet_ret_id).then((response) => {
        setSecondTweet(response);
        const split = response.text.split(" ");
        const contentComponents2 = [];
        split.forEach((element, idx) => {
          if (hashtagRegex.test(element)) {
            contentComponents2.push(
              <Link
                to={{ pathname: "/search", state: { query: element } }}
                key={idx}
              >
                {element + " "}
              </Link>
            );
          } else if (mentionRegex.test(element)) {
            contentComponents2.push(
              <Link to={{ pathname: `/${element.substr(1)}` }} key={idx}>
                {element + " "}
              </Link>
            );
          } else {
            contentComponents2.push(<span key={idx}>{element + " "}</span>);
          }
        });
        setContentComponentsRetweet(contentComponents2);
      });
    }
    const split = props.content.split(" ");
    const contentComponents = [];
    split.forEach((element, idx) => {
      if (hashtagRegex.test(element)) {
        contentComponents.push(
          <Link
            to={{ pathname: "/search", state: { query: element } }}
            key={idx}
          >
            {element + " "}
          </Link>
        );
      } else if (mentionRegex.test(element)) {
        contentComponents.push(
          <Link to={{ pathname: `/${element.substr(1)}` }} key={idx}>
            {element + " "}
          </Link>
        );
      } else {
        contentComponents.push(<span key={idx}>{element + " "}</span>);
      }
    });
    setContentComponents(contentComponents);

    //setLikeNumber(props.likeNumber);
  }, []);

  const handleMenu = () => {
    if (menuState) {
      setMenuState(0);
    } else {
      setMenuState(1);
    }
  };

  const handleLike = () => {
    const found = likes.find((like) => like.user_id === user.id);
    const idx = likes.findIndex((like) => like.user_id === user.id);
    if (found) {
      TweetService.removeLike(found.id).then((response) => {
        setLikeIc(LikeIcon);
        setLikeIcSel(LikeIconSelected);
        setLikeNumber(likeNumber - 1);
        const aux = likes;
        aux.splice(idx, 1);
        setLikes(aux);
      });
    } else {
      TweetService.createLike({
        user_id: user.id,
        tweet_id: props.id,
      }).then((response) => {
        setLikeIc(LikeIconFilled);
        setLikeIcSel(LikeIconFilled);
        setLikeNumber(likeNumber + 1);
        const aux = likes;
        aux.push(response);
        setLikes(aux);
      });
    }
  };

  const handleCloseRetweet = (res) => {
    setIsRetweetSelected(false);
    if (res.state) {
      if (res.hasImage) {
        const image = res.image;
        getUploadLink(image.name, image.type, "profile_pictures").then(
          async (response) => {
            if (response) {
              const { post_url, get_url } = response;
              await uploadFile(post_url, image);
              TweetService.createRetweet({
                user_id: user.id,
                tweet_id: props.id,
                message: res.message,
                has_image: true,
                image_url: get_url,
              }).then((response) => {
                props.onNewTweet(e);
              });
            }
          }
        );
      } else {
        TweetService.createRetweet({
          user_id: user.id,
          tweet_id: props.id,
          message: res.message,
        }).then((response) => {
          if (res.message.length === 0) {
            setAlreadyRetw(true);
            setRetweetIc(RetweetIconSelected);
          }
          setRetweetNumber(retweetNumber + 1);
          const aux = retweets;
          aux.push(response);
          setRetweets(aux);
        });
        props.handleRetweet(true);
        setRetweetIc(RetweetIconSelected);
      }
    }
  };

  const handleDeletion = (id) => {
    props.onDelete(id);
  };

  const handleOption = (event) => {
    setMenuState(0);
    if (event.currentTarget.name === "confirmation") {
      handleDeletion(props.id);
    }
  };

  const handleRetweet = () => {
    setIsRetweetSelected(true);
  };

  return (
    <div className="tweet-view-main-container border-bottom">
      <div
        className="tweet"
        onClick={() => {
          console.log("clicked");
        }}
      >
        <div className="tweet-body">
          <Link
            style={{
              textDecoration: "none",
              color: "unset",
              backgroundColor: "transparent",
            }}
            to={{ pathname: "/" + props.username }}
          >
            <div className="tweet-avatar">
              <img src={props.UserPhoto || defaultUserPhoto} alt="" />
            </div>
          </Link>
          <div className="content-footer">
            <div className="tweet-header">
              <Link
                style={{
                  textDecoration: "none",
                  color: "unset",
                  backgroundColor: "transparent",
                }}
                to={{ pathname: "/" + props.username }}
              >
                <span id="tweet-name">{props.name || "User Name"}</span>
              </Link>
              <Link
                style={{
                  textDecoration: "none",
                  color: "unset",
                  backgroundColor: "transparent",
                }}
                to={{ pathname: "/" + props.username }}
              >
                <span id="tweet-username">
                  {"@" + props.username || "@username"}
                </span>
              </Link>
              {props.isOwnTweet ? (
                <button
                  className="btn-outline-icons corner-btn"
                  onClick={handleMenu}
                >
                  <img className="tweet-icon arrow" src={TrashIcon} alt="" />
                </button>
              ) : (
                <button
                  className="btn-outline-icons corner-btn"
                  onClick={handleMenu}
                >
                  <img
                    className="tweet-icon arrow"
                    src={ArrowDownIcon}
                    alt=""
                  />
                </button>
              )}
            </div>
            <div className="tweet-text">
              <p style={{ backgroundColor: "transparent" }}>
                {contentComponents}
              </p>
            </div>
            {/* IMAGEEEEEEEEEEEEEEEEEEEE */}
            {props.hasImage && props.image_url ? (
              <div className="tweet-img">
                <img src={props.image_url} alt="" />
              </div>
            ) : null}
            {/* RETWEEEETTTTTTTTTTTTTTTTT */}
            {props.isRetweet ? (
              <div className="tweet-retweet">
                <div className="tweet-box">
                  <div className="tweet-body">
                    <div className="tweet-avatar">
                      <img
                        src={
                          secondTweet?.user?.profile_image_url ||
                          defaultUserPhoto
                        }
                        alt=""
                      />
                    </div>
                    <div className="content-footer">
                      <div className="tweet-header">
                        <span id="tweet-name">
                          {secondTweet?.user?.name || "User Name"}
                        </span>
                        <span id="tweet-username">
                          {"@" + secondTweet?.user?.screen_name || "@username"}
                        </span>
                      </div>
                      <div className="tweet-text">
                        <p style={{ backgroundColor: "transparent" }}>
                          {contentComponentsRetweet || "tweet_content"}
                        </p>
                      </div>

                      {secondTweet.hasImage ? (
                        <div className="tweet-img">
                          <img src={secondTweet?.image_url} alt="" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {/* ENDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD */}
            <div className="tweet-footer">
              <div className="tweet-icon-box">
                <button
                  className="btn btn-outline-icons comment"
                  onMouseEnter={(e) =>
                    (e.currentTarget.firstChild.src = CommentIconSelected)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.firstChild.src = CommentIcon)
                  }
                >
                  <img src={CommentIcon} alt="comment" className="tweet-icon" />
                </button>

                <span className="icon-number">
                  {" "}
                  {commentNumber > 0 ? commentNumber : ""}{" "}
                </span>
              </div>
              <div className="tweet-icon-box">
                <button
                  className="btn btn-outline-icons retweet"
                  onClick={handleRetweet}
                  onMouseEnter={(e) =>
                    (e.currentTarget.firstChild.src = RetweetIconSelected)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.firstChild.src = retweetIc)
                  }
                >
                  <img src={retweetIc} alt="comment" className="tweet-icon" />
                </button>

                <span className="icon-number">
                  {" "}
                  {retweetNumber > 0 ? retweetNumber : ""}{" "}
                </span>
                {isRetweetSelected ? (
                  <RetweetModal
                    UserPhoto={props.UserPhoto}
                    name={props.name}
                    username={props.username}
                    content={props.content}
                    handleClose={handleCloseRetweet}
                    isAlreadyRetweeated={alreadyRetw}
                  />
                ) : null}
              </div>
              <div className="tweet-icon-box">
                <button
                  className="btn btn-outline-icons like"
                  onClick={handleLike}
                  onMouseEnter={(e) =>
                    (e.currentTarget.firstChild.src = likeIcSel)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.firstChild.src = likeIc)
                  }
                >
                  <img src={likeIc} alt="comment" className="tweet-icon" />
                </button>
                <span className="icon-number">
                  {" "}
                  {likeNumber > 0 ? likeNumber : ""}{" "}
                </span>
              </div>
              <div className="tweet-icon-box">
                <button
                  className="btn btn-outline-icons save"
                  onMouseEnter={(e) =>
                    (e.currentTarget.firstChild.src = SaveIconSelected)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.firstChild.src = SaveIcon)
                  }
                >
                  <img src={SaveIcon} alt="comment" className="tweet-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {menuState ? (
        props.isOwnTweet ? (
          <div className="modalName">
            <ConfirmDialog className="ModalName" onChange={handleOption} />
          </div>
        ) : null
      ) : null}
    </div>
  );
};

export default Tweet;
