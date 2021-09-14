import React from "react";

import LogoBlue from "../../assets/images/Twitter_Logo_Blue.svg";

const Loading = () => {
  return (
    <div className="loading-screen-container">
      <img src={LogoBlue} alt="logo" className="logo" />
    </div>
  );
};

export default Loading;
