import React, { useState, useEffect } from "react";

const LabeledInput = (props) => {
  const [chars, setChars] = useState(0);

  useEffect(() => {
    setChars(props.value.length);
  }, [props.value]);

  const getInputComponent = (props) => {
    switch (props.type) {
      case "text":
      case "password":
      case "number":
      case "email":
        return (
          <input
            autoComplete="off"
            type={props.type}
            name={props.name}
            onChange={props.onChange}
            value={props.value}
            disabled={props.disabled}
            className={props.className}
          />
        );
      case "month":
      case "day":
      case "year":
        return (
          <select
            name={props.name}
            id={props.name}
            onChange={props.onChange}
            value={props.value}
            className={props.className}
          >
            <option hidden disabled />
            {props.options[props.type + "s"].reverse().map(([idx, value]) => {
              return (
                <option value={idx} key={idx}>
                  {value}
                </option>
              );
            })}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="labeled-input">
      <div
        className={
          "labeled-input-content" +
          (props.helperText && props.helperText.trim().length > 0
            ? " invalid-input"
            : "")
        }
      >
        {getInputComponent(props)}
        <label>{props.label}</label>
      </div>
      <span className="subtext-container">
        {props.helperText && props.helperText.trim().length > 0 ? (
          <span className="helper-text">{props.helperText}</span>
        ) : null}
        {props.chlimit ? (
          <span className="chlimit">
            {chars}/{props.chlimit}
          </span>
        ) : null}
      </span>
    </div>
  );
};

export default React.memo(
  LabeledInput,
  (prevProps, nextProps) =>
    prevProps.name === nextProps.name &&
    prevProps.value === nextProps.value &&
    prevProps.helperText === nextProps.helperText &&
    ((prevProps.options &&
      prevProps.options.months.length === nextProps.options.months.length &&
      prevProps.options.days.length === nextProps.options.days.length) ||
      !prevProps.options)
);
