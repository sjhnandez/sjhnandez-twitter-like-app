import axios from "axios";

axios.defaults.headers.common = {
  "Content-Type": "application/json",
};

export const checkIdentity = async (body) => {
  return axios
    .post("/api/check_password", {
      screen_name: body.username,
      password: body.password
    }
    ).then((response) => {
      if(!response.data.error){
        return response.data;
      }
    })
    .catch((error) => {
      console.log(error);
    })
}


export const sendRecoverySms = async (screenName) => {
    return axios
      .post("/api/send_two_factor_auth_email", {
        screen_name: screenName,
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  };

export const verify2Fac = async (code) => {
  return axios
    .post("/api/verify_two_factor_code",
    {two_factor_auth_token: code}).then(
      (response) =>{
        localStorage.setItem("token", response.data.jwt);
        return {user: response.data.user, complete: true};
      }
    ).catch((error) => {
      console.log(error);
    })
}


