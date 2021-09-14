import axios from "axios";

axios.defaults.headers.common = {
  "Content-Type": "application/json",
};

export const login = async (userid, password) => {
  return axios
    .post("/api/login", {
      login_id: userid,
      password: password,
    })
    .then((response) => {
      if (response.data.user && response.data.jwt) {
        localStorage.setItem("token", response.data.jwt);
        return {
          user: response.data.user,
          completed: true,
        };
      } else if (response.data.user) {
        return {
          user: response.data.user,
        };
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const autoLogin = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    return await axios
      .post(
        "/api/check_auth",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((response) => {
        if (!response.data.error) {
          return response.data;
        }
      });
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const requestConfirmation = async (email) => {
  return axios
    .post("/api/request_confirmation", {
      email,
    })
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });
};

export const verifyCode = async (code, email) => {
  return axios
    .post("/api/verify_code", {
      verification_code: code,
      email,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const checkScreenNameAvailability = async (screenName) => {
  return axios
    .post("/api/users/check_screen_name_availability", {
      screen_name: screenName,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createUser = async (
  name,
  phone,
  email,
  day,
  month,
  year,
  screenName,
  password,
  passwordConfirmation
) => {
  return axios
    .post("/api/users", {
      user: {
        screen_name: screenName.substring(1, screenName.length),
        name,
        phone,
        email,
        birthday: [year, month, day].join("-"),
        password,
        password_confirmation: passwordConfirmation,
      },
    })
    .then((response) => {
      localStorage.setItem("token", response.data.jwt);
      return response.data.user;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const findUserForReset = async (userid) => {
  return axios
    .post("/api/find_user_for_reset", {
      login_id: userid,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const sendRecoveryEmail = async (screenName) => {
  return axios
    .post("/api/send_recovery_email", {
      screen_name: screenName,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const sendRecoverySms = async (screenName) => {
  return axios
    .post("/api/send_recovery_sms", {
      screen_name: screenName,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const verifyResetToken = async (reset_token) => {
  return axios
    .post("/api/verify_reset_token", {
      reset_token,
    })
    .then((response) => {
      return response.data.user;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const verifyResetPin = async (reset_pin) => {
  return axios
    .post("/api/verify_reset_pin", {
      reset_pin,
    })
    .then((response) => {
      return response.data.user;
    })
    .catch((error) => {
      console.log(error);
    });
};

export const changePassword = async (
  screen_name,
  password,
  password_confirmation
) => {
  return axios
    .patch("/api/users/" + screen_name, {
      user: { password, password_confirmation },
    })
    .then((response) => {
      if (response.data.user) {
        localStorage.setItem("token", response.data.jwt);
        return response.data.user;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const lookupUser = async (pathname) => {
  return axios
    .get("/api/users/" + pathname)
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    })
    .catch((error) => {});
};

export const updateUser = async (user) => {
  return axios
    .patch("/api/users/" + user.screen_name, {
      user,
    })
    .then((response) => {
      if (response.data.user) {
        return response.data.user;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUploadLink = async (filename, fileType, directory) => {
  return axios
    .get("/api/upload", { params: { filename, fileType, directory } })
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    });
};

export const uploadFile = async (url, file) => {
  const options = {
    headers: { "Content-Type": file.type, acl: "public-read" },
  };
  await axios.put(url, file, options);
};
