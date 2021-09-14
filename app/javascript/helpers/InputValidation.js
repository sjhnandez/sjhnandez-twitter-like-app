import moment from "moment";
import { array } from "prop-types";

export const validateForm = (form) => {
  let errors = new Map();
  Object.values(form.target).forEach((element) => {
    if (
      element.tagName === "INPUT" ||
      element.name === "instructions" ||
      element.name === "description"
    ) {
      if (!validateInput(element)) {
        switch (element.name) {
          case "email":
            errors.set(element.name, "Please enter a valid email.");
            break;
          case "phone":
            errors.set(element.name, "Please enter a valid phone number.");
            break;
          default:
        }
      }
    }
  });

  return errors;
};

export const validateInput = (input) => {
  const inputType = input.name;
  let inputValue = input.value;
  // regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const rePhone = /^[0-9]{10}$/;
  const reUsername = /^@?(\w){1,15}$/;

  switch (inputType) {
    case "name":
      return inputValue.trim().length > 0 ? "" : "What's your name?";
    case "email":
      return re.test(inputValue) ? "" : "Please enter a valid email.";
    case "phone":
      return rePhone.test(inputValue)
        ? ""
        : "Please enter a valid phone number.";
    case "password":
      return inputValue.length > 5 ? "" : "Please enter a valid password.";
    case "screenName":
      return reUsername.test(inputValue)
        ? ""
        : "Please enter a valid username.";
    default:
  }
};

export const getDateOptions = (date) => {
  moment.locale("en");
  const allMonths = moment.months().map((month, idx) => [idx + 1, month]);
  const allDays = [...Array(31).keys()].map((day) => [day + 1, day + 1]);
  let possibleDates = {
    years: [...Array(moment().year() - 1900).keys()].map((year, idx) => [
      year + 1900,
      year + 1900,
    ]),
    months: allMonths,
    days: allDays,
  };
  const selectedYear = date.year ? date.year : 2020;

  let filteredDays = allDays.filter(
    ([n, day]) =>
      n <= new Date(selectedYear, date.month ? date.month : 0, 0).getDate()
  );
  possibleDates = {
    ...possibleDates,
    days: filteredDays,
  };
  if (date.lastSet === "day") {
    let filteredMonths = allMonths.filter(
      ([n, month]) =>
        new Date(selectedYear, n, 0).getDate() >= (date.day ? date.day : 0)
    );
    possibleDates = {
      ...possibleDates,
      months: filteredMonths,
    };
  }

  return possibleDates;
};

export const dateToString = (day, month, year) => {
  return moment([year, month, day].join("-")).format("MMMM DD, YYYY");
};
