import React, { useState, useRef, useContext } from "react";
import defaultUserPhoto from "../../assets/images/default-user-image.png";
import Close from "../../assets/images/Close.svg";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import TextareaAutosize from "react-textarea-autosize";
import Image from "../../assets/images/Image.svg";
import * as TweetService from "../helpers/tweet";
import * as DirectService from "../helpers/Direct";
import UserContext from "../contexts/UserContext";

import { getUploadLink, uploadFile } from "../helpers/Api";

const NewMessageModal = (props) => {
  const user = useContext(UserContext).authState.user;

  const [chip, setChip] = useState(undefined);
  const [selected, setSelected] = useState(false);
  const [image, setImage] = useState(undefined);
  const [query, setQuery] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [input, setInput] = useState("");

  const handleDelete = () => {
    console.log("delete");
    setCurrUser({});
    setSelected(false);
  };

  const handleClick = () => {
    console.log("click");
  };

  const handleSelect = () => {
    setSelected(true);
    //setCurrUser()
  };

  const handleClose = () => {
    props.onClose(true);
  };

  const handleChange = (event) => {
    event.persist();
    setInput(event.target.value);
    setDisabled(chip && (image || event.target.value.length > 0));
  };

  const imageUploader = useRef();

  const uploadImage = async (event) => {
    const file = event.target.files[0];
    console.log(file);
    setImage(file);
    setDisabled(chip && (file || input.length > 0));
  };

  const handleClickImage = (event) => {
    event.preventDefault();
    imageUploader.current.click();
  };

  const handleSearch = () => {
    console.log(query);
    TweetService.getUser(query, user.id).then((response) => {
      console.log(response);
      if (response) {
        setChip(response);
        setSelected(true);
        setDisabled(image || input.length > 0);
      }
    });
  };

  const handleDirect = () => {
    const hasImage = image !== undefined;
    const body = {
      user_id_from: user.id,
      user_id_to: chip.id,
      message: input,
      has_image: hasImage,
      image_url: image,
    };
    getUploadLink(image.name, image.type, "profile_pictures").then(
      async (response) => {
        if (response) {
          const { post_url, get_url } = response;
          await uploadFile(post_url, image);
          const body = {
            user_id_from: user.id,
            user_id_to: chip.id,
            message: input,
            has_image: hasImage,
            image_url: get_url,
          };
          DirectService.create(body).then((response) => {
            console.log(response);
            handleClose();
          });
        }
      }
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
          <button
            className="btn-close"
            className="button-filled next"
            type="button"
            onClick={handleDirect}
            disabled={!disabled}
          >
            Send
          </button>
        </div>
        <div className="content search">
          <div className="search-wrapper-header-size">
            <SearchRoundedIcon />
            <input
              autoComplete="off"
              name="query"
              onChange={(e) => {
                setQuery(e.target.value);
                //setDisabled(chip && (image || input.length > 0));
              }}
              value={query}
              placeholder="Search User"
              onKeyDown={handleKeyDown}
            />
            <button type="submit" />
          </div>
          {selected ? (
            <Chip
              icon={
                <Avatar
                  alt="Natacha"
                  src={chip.profile_image_url || defaultUserPhoto}
                />
              }
              label={chip.name}
              onClick={handleClick}
              onDelete={handleDelete}
              id="chip"
              variant="outlined"
            />
          ) : null}
          <TextareaAutosize
            maxLength="240"
            maxRows={20}
            placeholder="Add comment"
            onChange={handleChange}
            value={input}
            minRows="5"
          />
          <div className="img-zone-2">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt=""
                height="40"
                width="40"
              />
            ) : null}
          </div>
          <div className="image-add">
            <button
              id="button-image"
              className="btn-new"
              onClick={handleClickImage}
            >
              <img src={Image} alt="" />
            </button>
          </div>

          {/* <div className="card-user" onClick={handleSelect}>
            <div className="tweet-body">
              <div className="tweet-avatar">
                <img src={defaultUserPhoto} alt="" />
              </div>
              <div className="content-footer">
                <span id="tweet-name">{"User Name"}</span>
                <span id="tweet-username">{"@username"}</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
