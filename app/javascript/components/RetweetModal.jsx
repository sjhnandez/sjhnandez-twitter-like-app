import React, { useState, useContext, useRef } from "react";

import Tweet from "./Tweet";
import TextareaAutosize from "react-textarea-autosize";
import { CircularProgressbar } from "react-circular-progressbar";
import defaultUserPhoto from "../../assets/images/default-user-image.png";

import Close from "../../assets/images/Close.svg";
import "../../assets/stylesheets/retweet-modal.scss";
import UserContext from "../contexts/UserContext";
import Image from "../../assets/images/Image.svg";

const RetweetModal = (props) => {
  const user = useContext(UserContext).authState.user;
  const [disabled, setDisabled] = useState(props.isAlreadyRetweeated);
  const defaultInput = "";
  const [input, setInput] = useState(defaultInput);
  const [image, setImage] = useState("");

  const handleChange = (event) => {
    event.persist();
    setInput(event.target.value);
    setDisabled(props.isAlreadyRetweeated && event.target.value.length === 0);
  };

  const handleClose = () => {
    props.handleClose({ state: false, message: undefined });
  };

  const handleRetweet = () => {
    if (image) {
      props.handleClose({
        state: true,
        message: input,
        hasImage: true,
        image: image,
      });
    } else {
      props.handleClose({
        state: true,
        message: input,
        hasImage: false,
        image: undefined,
      });
    }
  };

  const imageUploader = useRef();

  const uploadImage = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    setImage(file);
  };

  const handleClickImage = (event) => {
    event.preventDefault();
    imageUploader.current.click();
  };

  return (
    <div className="retweet-modal">
      <input
        type="file"
        ref={imageUploader}
        onChange={uploadImage}
        style={{ display: "none" }}
      />
      <div className="card">
        <div className="header">
          <button className="btn-close" type="button" onClick={handleClose}>
            <img src={Close} alt="" />
          </button>
        </div>
        <div className="content">
          <div className="new-tweet">
            <div className="tweet-avatar">
              <img
                src={user?.profile_image_url || defaultUserPhoto}
                alt="ppicture"
              />
            </div>
            <div className="tweet-content">
              <TextareaAutosize
                maxLength="240"
                maxRows={20}
                placeholder="Add comment"
                onChange={handleChange}
                value={input}
                minRows="1"
              />
            </div>
          </div>
          <div className="img-zone">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                height="20"
                width="20"
              />
            ) : null}
          </div>
          <div className="tweet-cont">
            <div className="tweet-box">
              <div className="tweet-body">
                <div className="tweet-avatar">
                  <img src={props.UserPhoto || defaultUserPhoto} alt="" />
                </div>
                <div className="content-footer">
                  <div className="tweet-header">
                    <span id="tweet-name">{props.name || "User Name"}</span>
                    <span id="tweet-username">
                      {"@" + props.username || "@username"}
                    </span>
                  </div>
                  <div className="tweet-text">
                    <p style={{ backgroundColor: "transparent" }}>
                      {props.content || "tweet_content"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-cont">
            <div className="btn-area">
              <button id="button-image" onClick={handleClickImage}>
                <img src={Image} alt="" />
              </button>
              <div className="progress-container">
                <CircularProgressbar
                  className={
                    "progress-bar" + (input.length >= 220 ? " warning" : "")
                  }
                  value={(input.length / 240) * 100}
                  text={input.length >= 220 ? 240 - input.length : ""}
                />
              </div>

              <button
                type="button"
                className="button-filled retweeet"
                onClick={handleRetweet}
                disabled={disabled}
              >
                Retweet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetweetModal;
