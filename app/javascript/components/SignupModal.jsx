import React, { useState, useMemo, useEffect } from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Checkbox from "@material-ui/core/Checkbox";
import {
  requestConfirmation,
  verifyCode,
  checkScreenNameAvailability,
  createUser,
} from "../helpers/Api";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import LabeledInput from "./LabeledInput";

import {
  validateInput,
  getDateOptions,
  dateToString,
} from "../helpers/InputValidation";

import TwitterLogo from "../../assets/images/Twitter_Logo_White.svg";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SignupModal = (props) => {
  const [input, setInput] = useState({
    name: "",
    phone: "",
    email: "",
    day: "",
    month: "",
    year: "",
    screenName: "@",
    password: "",
    passwordConfirmation: "",
  });

  const section1Inputs = ["name", "phone", "email", "day", "month", "year"];

  const [allowTracking, setAllowTracking] = useState(false);

  const [verificationCode, setVerificationCode] = useState("");

  const [dateOptions, setDateOptions] = useState(getDateOptions({}));

  //Red text under input
  const defaultHelperText = {
    name: "",
    phone: "",
    email: "",
    screenName: "",
  };

  const [errorText, setErrorText] = useState(defaultHelperText);

  //Switch between phone/email
  const [showingPhone, setShowingPhone] = useState(true);

  const [validationTimer, setValidationTimer] = useState({});

  const [disabledSend, setDisabledSend] = useState(true);

  const [section, setSection] = useState(0);

  const [codeSent, setCodeSent] = useState(false);

  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
  });

  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleBack = (event) => {
    event.preventDefault();
    if (section == 0) {
      props.history.goBack();
    } else {
      if (section == 4) {
        setSection((prevSection) => prevSection - 2);
      } else {
        setSection((prevSection) => prevSection - 1);
      }
    }
  };

  const handleNext = async (event) => {
    if (section == 3 || (section == 5 && showingPhone)) {
      const request = await verifyCode(verificationCode, input.email);
      if (request.success) {
        setEmailConfirmed(true);
        setSection((prevSection) => prevSection + 1);
      } else {
        setAlert({
          message: "The code you entered is incorrect. Please try again.",
          open: true,
        });
      }
    } else {
      if (section == 2 && (!input.email || emailConfirmed)) {
        setSection((prevSection) => prevSection + 2);
      } else {
        setSection((prevSection) => prevSection + 1);
      }
    }
  };

  const handleSubmit = () => {
    checkScreenNameAvailability(input.screenName).then((response) => {
      if (response.available) {
        createUser(
          input.name,
          input.phone,
          input.email,
          input.day,
          input.month,
          input.year,
          input.screenName,
          input.password,
          input.passwordConfirmation
        ).then((user) => {
          if (user) {
            props.history.push("/");
          } else {
            setAlert({
              message: "Internal error. Please try again",
              open: true,
            });
          }
        });
      } else {
        setAlert({
          message: "That username is unavailable. Try another one",
          open: true,
        });
      }
    });
  };

  useEffect(() => {
    setDisabledSend(() => {
      switch (section) {
        case 0:
          return (
            !Object.keys(input).every(
              (key) =>
                (input[key] && input[key].length > 0) ||
                (showingPhone && key === "email") ||
                (!showingPhone && key === "phone") ||
                !section1Inputs.includes(key)
            ) ||
            Object.values(errorText).some(
              (errorText) => errorText && errorText.length > 0
            ) ||
            !Object.keys(validationTimer).every(
              (key) => validationTimer[key].finished
            )
          );
        case 1:
          return false;
        case 2:
          return false;
        case 3:
          return verificationCode.length == 0;
        case 4:
          return (
            (showingPhone && input.email.length == 0) ||
            (!showingPhone && input.phone.length == 0) ||
            Object.values(errorText).some(
              (errorText) => errorText && errorText.length > 0
            ) ||
            !Object.keys(validationTimer).every(
              (key) => validationTimer[key].finished
            )
          );
        case 5:
          return showingPhone ? verificationCode.length == 0 : false;
        default:
          return true;
      }
    });
  }, [input, errorText, validationTimer, verificationCode, section]);

  const handleChange = (event) => {
    event.persist();
    //Char limit
    if (event.target.name === "name" && event.target.value.length > 50) {
      return;
    } else if (event.target.name === "email") {
      setEmailConfirmed(false);
    }
    setInput((prevInput) => {
      return {
        ...prevInput,
        [event.target.name]:
          event.target.name === "screenName" &&
          event.target.value.charAt(0) !== "@"
            ? "@" + event.target.value
            : event.target.value,
      };
    });
    if (validationTimer[event.target.name]) {
      clearTimeout(validationTimer[event.target.name].timer);
    }
    if (
      event.target.name === "name" ||
      event.target.value.length > 0 ||
      event.target.name === "screenName"
    ) {
      setErrorText((prevText) => {
        return { ...prevText, [event.target.name]: "" };
      });

      //Checks if name/username is empty right away, else sets up timer
      if (
        event.target.value.length == 0 ||
        (event.target.name === "screenName" && event.target.value.length == 1)
      ) {
        setErrorText((prevText) => {
          return {
            ...prevText,
            [event.target.name]: validateInput(event.target),
          };
        });
      } else {
        setValidationTimer((prevTimers) => {
          const timer = {
            timer: setTimeout(() => {
              setErrorText((prevText) => {
                return event.target.name === "passwordConfirmation"
                  ? {
                      ...prevText,
                      [event.target.name]:
                        event.target.value === input.password
                          ? ""
                          : "Both passwords must be identical",
                    }
                  : {
                      ...prevText,
                      [event.target.name]: validateInput(event.target),
                    };
              });
              timer.finished = true;
            }, 500),
            finished: false,
          };
          return {
            ...prevTimers,
            [event.target.name]: timer,
          };
        });
      }
    }
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

  const handleCheckboxChange = (event) => {
    setAllowTracking((prevInput) => !prevInput);
  };

  const handleCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  useEffect(() => {
    if (
      !codeSent &&
      ((!showingPhone && section == 3) || (showingPhone && section == 5))
    ) {
      requestConfirmation(input.email);
      setCodeSent(true);
    }
  }, [section]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {section != 2 ? (
          <>
            <div className="header-container">
              {section == 6 || (section == 5 && !showingPhone) ? null : (
                <button className="nostyle-button-icon" onClick={handleBack}>
                  <ArrowBackIcon />
                </button>
              )}
              <img src={TwitterLogo} alt="logo" className="logo"></img>
              {section == 6 || (section == 5 && !showingPhone) ? null : (
                <button
                  className={"button-filled"}
                  disabled={disabledSend}
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
            <div className="form-container">
              {(() => {
                if (section == 0) {
                  return (
                    <>
                      <h2>Create your account</h2>
                      <LabeledInput
                        type="text"
                        name="name"
                        label="Name"
                        onChange={handleChange}
                        value={input.name}
                        chlimit={50}
                        helperText={errorText.name}
                      />
                      {showingPhone ? (
                        <LabeledInput
                          type="text"
                          name="phone"
                          label="Phone"
                          onChange={handleChange}
                          value={input.phone}
                          helperText={errorText.phone}
                        />
                      ) : (
                        <LabeledInput
                          type="email"
                          name="email"
                          label="Email"
                          onChange={handleChange}
                          value={input.email}
                          helperText={errorText.email}
                        />
                      )}
                      <button
                        className="nostyle-button"
                        onClick={() => {
                          setShowingPhone((bvalue) => !bvalue);
                          setInput((input) => {
                            return { ...input, phone: "", email: "" };
                          });
                          setErrorText((text) => {
                            return { ...text, phone: "", email: "" };
                          });
                          if (validationTimer.phone) {
                            clearTimeout(validationTimer.phone.timer);
                          }
                          if (validationTimer.email) {
                            clearTimeout(validationTimer.email.timer);
                          }
                        }}
                      >
                        Use {showingPhone ? "email" : "phone"} instead
                      </button>
                      <h4>Date of birth</h4>
                      <span className="notice">
                        This will not be shown publicly. Confirm your own age,
                        even if this account is for a business, a pet, or
                        something else.
                      </span>
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
                    </>
                  );
                } else if (section == 1) {
                  return (
                    <div className="section-2">
                      <h2>Customize your experience</h2>
                      <h3>
                        Track where you see twitter content across the web
                      </h3>
                      <div className="notice-container">
                        <div>
                          Twitter uses this data to personalize your experience.
                          This web browsing history will never be stored with
                          your name, email, or phone number.
                        </div>
                        <Checkbox
                          name="tracking"
                          checked={allowTracking}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                      <span className="help-text">
                        For more details about these settings, visit the{" "}
                      </span>
                      <span>
                        <button className="nostyle-button">Help center.</button>
                      </span>
                    </div>
                  );
                } else if (section == 3 || (section == 5 && showingPhone)) {
                  return (
                    <div className="section-4">
                      <h2>We sent you a code</h2>
                      <span>Enter it below to verify {input.email}.</span>
                      <LabeledInput
                        type="text"
                        name="code"
                        label="Verification code"
                        onChange={handleCodeChange}
                        value={verificationCode}
                      />
                      <button className="nostyle-button">
                        Didn't receive email?
                      </button>
                    </div>
                  );
                } else if (section == 4 && !showingPhone) {
                  return (
                    <div className="section-5">
                      <h2>Add a phone number</h2>
                      <LabeledInput
                        type="number"
                        name="phone"
                        label="Your phone number"
                        onChange={handleChange}
                        value={input.phone}
                        helperText={errorText.phone}
                      />
                    </div>
                  );
                } else if (section == 4 && showingPhone) {
                  return (
                    <div className="section-5">
                      <h2>Add an email address</h2>{" "}
                      <LabeledInput
                        type="text"
                        name="email"
                        label="Your email address"
                        onChange={handleChange}
                        value={input.email}
                        helperText={errorText.email}
                      />
                    </div>
                  );
                } else if (section == 5 || section == 6) {
                  return (
                    <div className="section-6">
                      <h2>You're almost there!</h2>{" "}
                      <span className="info">
                        Choose a unique username - others will use it to find
                        you on Twitter.
                      </span>
                      <LabeledInput
                        type="text"
                        name="screenName"
                        label="Your username"
                        onChange={handleChange}
                        value={input.screenName}
                        helperText={errorText.screenName}
                      />
                      <span className="info">
                        Choose a secure password, and make sure to never share
                        it with anyone.
                      </span>
                      <LabeledInput
                        type="password"
                        name="password"
                        label="Password"
                        onChange={handleChange}
                        value={input.password}
                        helperText={errorText.password}
                      />
                      <LabeledInput
                        type="password"
                        name="passwordConfirmation"
                        label="Confirm your password"
                        onChange={handleChange}
                        value={input.passwordConfirmation}
                        helperText={errorText.passwordConfirmation}
                      />
                      <button className="button-filled" onClick={handleSubmit}>
                        Dive in
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          </>
        ) : (
          <div className="section-3">
            <div className="header-container">
              <button className="nostyle-button-icon" onClick={handleBack}>
                <ArrowBackIcon />
              </button>
              <h3>Step 3 of 5</h3>
            </div>
            <div className="form-container">
              <h2>Create your account</h2>
              <LabeledInput
                disabled
                type="text"
                name="name"
                label="Name"
                onChange={handleChange}
                value={input.name}
                helperText={errorText.name}
              />
              {showingPhone ? (
                <LabeledInput
                  disabled
                  type="text"
                  name="phone"
                  label="Phone"
                  onChange={handleChange}
                  value={input.phone}
                  helperText={errorText.phone}
                />
              ) : (
                <LabeledInput
                  disabled
                  type="email"
                  name="email"
                  label="Email"
                  onChange={handleChange}
                  value={input.email}
                  helperText={errorText.email}
                />
              )}
              <LabeledInput
                disabled
                type="text"
                name="date"
                label="Birthday"
                onChange={handleChange}
                value={dateToString(input.day, input.month, input.year)}
                helperText={errorText.name}
              />
              <div className="notice">
                By signing up, you agree to the{" "}
                <button className="nostyle-button">Terms of Service</button> and{" "}
                <button className="nostyle-button">Privacy Policy</button>,
                including <button className="nostyle-button">Cookie use</button>
                . Others will be able to find you by email or phone number when
                provided ·{" "}
                <button className="nostyle-button">Privacy Options</button>
              </div>
              <button className="button-filled" onClick={handleNext}>
                Sign up
              </button>
            </div>
          </div>
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alert.open}
        onClose={closeAlert}
        key="topcenter"
      >
        <Alert severity="error" onClose={closeAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignupModal;
