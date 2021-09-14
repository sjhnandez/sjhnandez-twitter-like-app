import React, { useState, useEffect, useContext, useRef } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { updateUser, getUploadLink, uploadFile } from "../helpers/Api";
import { getDateOptions } from "../helpers/InputValidation";
import defaultUserPhoto from "../../assets/images/default-user-image.png";
import CameraEnhanceOutlinedIcon from "@material-ui/icons/CameraEnhanceOutlined";
import Checkbox from "@material-ui/core/Checkbox";
import { withRouter } from "react-router-dom";

import UserContext from "../contexts/UserContext";

import LabeledInput from "./LabeledInput";
import { CheckBox } from "@material-ui/icons";

const EditProfileModal = (props) => {
  const handleBack = (event) => {
    event.preventDefault();
    props.history.goBack();
  };

  const user = useContext(UserContext).authState.user;
  const setAuthState = useContext(UserContext).setAuthState;

  const [input, setInput] = useState({
    name: user.name ? user.name : "",
    description: user.description ? user.description : "",
    location: user.location ? user.location : "",
    url: user.url ? user.url : "",
    day: user.birthday ? parseInt(user.birthday.split("-")[2]) + "" : "",
    month: user.birthday ? parseInt(user.birthday.split("-")[1]) + "" : "",
    year: user.birthday ? parseInt(user.birthday.split("-")[0]) + "" : "",
    profile_image_url: user.profile_image_url
      ? user.profile_image_url
      : defaultUserPhoto,
    profile_banner_url: user.profile_banner_url
      ? user.profile_banner_url
      : null,
    enabled_2fa: user.enabled_2fa ? user.enabled_2fa : false,
  });

  const profilePictureUploader = useRef();
  const bannerUploader = useRef();

  const [dateOptions, setDateOptions] = useState(getDateOptions({}));

  const defaultError = { name: "" };
  const [errorText, setErrorText] = useState(defaultError);
  const [disableSave, setDisableSave] = useState(true);

  const limits = { name: 50, description: 160, location: 30, url: 100 };

  const uploadProfilePicture = async (event) => {
    const file = event.target.files[0];
    getUploadLink(file.name, file.type, "profile_pictures").then(
      async (response) => {
        if (response) {
          const { post_url, get_url } = response;
          await uploadFile(post_url, file);
          updateUser({
            screen_name: user.screen_name,
            profile_image_url: get_url,
          }).then((user) => {
            if (user) {
              setAuthState({
                user,
                reported: true,
              });
              setInput((prevInput) => ({
                ...prevInput,
                profile_image_url: get_url,
              }));
            }
          });
        }
      }
    );
  };

  const uploadBannerPicture = async (event) => {
    const file = event.target.files[0];
    getUploadLink(file.name, file.type, "banners").then(async (response) => {
      if (response) {
        const { post_url, get_url } = response;
        await uploadFile(post_url, file);
        updateUser({
          screen_name: user.screen_name,
          profile_banner_url: get_url,
        }).then((user) => {
          if (user) {
            setAuthState({
              user,
              reported: true,
            });
            setInput((prevInput) => ({
              ...prevInput,
              profile_banner_url: get_url,
            }));
          }
        });
      }
    });
  };

  const handleProfilePictureClick = (event) => {
    event.preventDefault();
    profilePictureUploader.current.click();
  };

  const handleBannerClick = (event) => {
    event.preventDefault();
    bannerUploader.current.click();
  };

  const handleDateChange = (event) => {
    event.persist();
    setInput((prevInput) => {
      const newInput = {
        ...prevInput,
        [event.target.name]: event.target.value,
      };
      setDateOptions(
        getDateOptions({
          day: newInput.day,
          month: newInput.month,
          year: newInput.year,
          lastSet: event.target.name,
        })
      );
      return newInput;
    });
  };

  const handleSave = () => {
    const revisedUser = {
      screen_name: user.screen_name,
      name: input.name,
      description: input.description,
      location: input.location,
      url: input.url,
      enabled_2fa: input.enabled_2fa,
    };
    revisedUser.birthday = [input.year, input.month, input.day].join("-");
    updateUser(revisedUser).then((user) => {
      if (user) {
        setAuthState({ user, reported: true });
        props.history.push("/" + user.screen_name);
      }
    });
  };

  const handleChange = (event) => {
    event.persist();
    const name = event.target.name;
    const value = event.target.value;
    if (value.length > limits[name]) {
      return;
    }
    if (name === "name") {
      setErrorText(defaultError);
    }
    if (event.target.name === "2fa") {
      setInput((prevInput) => ({
        ...prevInput,
        enabled_2fa: !prevInput.enabled_2fa,
      }));
    }
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const handleAdd2Fa = (event) => {
    event.preventDefault();
    props.history.push({
      pathname: "/settings/verify_identity",
      state: { isModal: true },
    });
  }

  useEffect(() => {
    if (input.name.length > 0 && errorText.name === "" && setDisableSave) {
      setDisableSave(false);
    } else if (input.name.length == 0 || errorText.name !== "") {
      setDisableSave(true);
    }
  
  }, [errorText, input]);

  return (
    <div className="modal-overlay">
      <input
        type="file"
        ref={profilePictureUploader}
        onChange={uploadProfilePicture}
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={bannerUploader}
        style={{ display: "none" }}
        onChange={uploadBannerPicture}
      />
      <div className="modal-container edit-profile">
        <div className="header-container border-bottom">
          <button className="nostyle-button-icon" onClick={handleBack}>
            <ArrowBackIcon />
          </button>
          <h3>Edit profile</h3>
          <button
            className="button-filled"
            disabled={disableSave}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        <div className="banner-container">
          <button className="nostyle-button-icon" onClick={handleBannerClick}>
            <CameraEnhanceOutlinedIcon className="camera-icon" />
          </button>
          <img src={input.profile_banner_url} alt="" />
        </div>
        <div className="picture-container">
          <img src={input.profile_image_url} />
          <button
            className="nostyle-button-icon"
            onClick={handleProfilePictureClick}
          >
            <CameraEnhanceOutlinedIcon className="camera-icon" />
          </button>
          <span className="prompt-2fa">Enable 2-Factor-Auth?</span>
          <Checkbox
            name="2fa"
            onClick={handleAdd2Fa}
            //checked={handleAdd2Fa}
            checked={input.enabled_2fa}
            onChange={handleChange}

          />
        </div>
        <div className="input-container">
          <div className="text-input-container">
            <LabeledInput
              type="text"
              name="name"
              label="Name"
              onChange={handleChange}
              value={input.name}
              chlimit={50}
              helperText={errorText.name}
            />
            <LabeledInput
              type="text"
              name="description"
              label="Bio"
              onChange={handleChange}
              value={input.description}
              chlimit={limits.description}
              className="description"
            />
            <LabeledInput
              type="text"
              name="location"
              label="Location"
              onChange={handleChange}
              value={input.location}
              chlimit={limits.location}
            />
            <LabeledInput
              type="text"
              name="url"
              label="Website"
              onChange={handleChange}
              value={input.url}
              chlimit={limits.url}
            />
          </div>
          <div className="date-container">
            <LabeledInput
              type="month"
              name="month"
              label="Month"
              onChange={handleDateChange}
              value={input.month}
              options={dateOptions}
            />
            <LabeledInput
              type="day"
              name="day"
              label="Day"
              onChange={handleDateChange}
              value={input.day}
              options={dateOptions}
            />
            <LabeledInput
              type="year"
              name="year"
              label="Year"
              onChange={handleDateChange}
              value={input.year}
              options={dateOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(EditProfileModal);
