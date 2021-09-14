import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "../../assets/stylesheets/new-tweet.scss";
import defaultUserPhoto from "../../assets/images/default-user-image.png";
import { CircularProgressbar } from "react-circular-progressbar";
import "../../assets/stylesheets/circular-progressbar.scss";
import TextareaAutosize from "react-textarea-autosize";
import Image from "../../assets/images/Image.svg";

import * as Tweet from "../helpers/tweet.js";
import UserContext from "../contexts/UserContext";

import { getUploadLink, uploadFile } from "../helpers/Api";

const New_Tweet = (props) => {
  const defaultInput = "";
  const [input, setInput] = useState(defaultInput);
  const handleChange = (event) => {
    event.persist();
    setInput(event.target.value);
  };
  const [image, setImage] = useState("");
  const user = useContext(UserContext).authState.user;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (image) {
      getUploadLink(image.name, image.type, "profile_pictures").then(
        async (response) => {
          if (response) {
            const { post_url, get_url } = response;
            await uploadFile(post_url, image);
            console.log("get_url", get_url);
            Tweet.create({
              user_id: user.id,
              text: input,
              hasImage: true,
              image_url: get_url,
            }).then((response) => {
              setInput(defaultInput);
              setImage(undefined);
              props.onNewTweet(e);
            });
          }
        }
      );
    } else {
      console.log(input);
      Tweet.create({
        user_id: user.id,
        text: input,
        hasImage: false,
        image_url: "",
      }).then((response) => {
        setInput(defaultInput);
        props.onNewTweet(e);
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
    <div className="new-tweet-main-container">
      <input
        type="file"
        ref={imageUploader}
        onChange={uploadImage}
        style={{ display: "none" }}
      />
      <Link
        style={{
          textDecoration: "none",
          color: "unset",
          backgroundColor: "transparent",
        }}
        to={{ pathname: "/" + user.screen_name }}
      >
        <div className="tweet-avatar">
          <img
            src={user?.profile_image_url || defaultUserPhoto}
            alt="ppicture"
          />
        </div>
      </Link>
      <div className="tweet-content">
        <TextareaAutosize
          maxLength="240"
          maxRows={7}
          placeholder="What's happening?"
          className="border-bottom"
          onChange={handleChange}
          value={input}
          minRows="1"
        />
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
        <div className="btn-area">
          <button id="button-image" onClick={handleClickImage}>
            <img src={Image} alt="" />
          </button>
          {input.length > 0 ? (
            <>
              <div className="progress-container">
                <CircularProgressbar
                  className={
                    "progress-bar" + (input.length >= 220 ? " warning" : "")
                  }
                  value={(input.length / 240) * 100}
                  text={input.length >= 220 ? 240 - input.length : ""}
                />
              </div>
              <div className="divider" />
            </>
          ) : null}

          <button
            className="button-filled"
            onClick={(event) => {
              handleSubmit(event);
            }}
            disabled={input.length == 0}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
};

export default New_Tweet;
