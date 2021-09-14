import axios from "axios";
const BASE_URL = "/api/followers";
const token = localStorage.getItem("token");


export const create  =  async (body) => {
  return axios
    .post(
      BASE_URL,
      {
        account: body.account,
        follower: body.follower,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then((response) => {
      if (response) {
        return response;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};


export const followers = async (body) => {
  return axios
    .post(
      "/api/get_followers",
      {
        account: body.account,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then((response) => {
      if (response) {
        return response;
      }
    })
    .catch((error) => {
      console.log(error);
    }
  );
}

export const followings = async (body) => {
  return axios
    .post(
      "/api/get_followings",
      {
        account: body.account,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then((response) => {
      if (response) {
        return response;
      }
    })
    .catch((error) => {
      console.log(error);
    }
  );
}

export const isFollowing = async (body) => {
  return axios
    .post(
      "/api/follows",
      {
        account: body.account,
        followed: body.followed,
      },
      {
        headers: { Authorization: "Bearer " + token },
      }
    )
    .then((response) => {
      if (response) {
        return response;
      }
    })
    .catch((error) => {
      console.log(error);
    }
  );
}


export const destroy = async (follow_id) => {
  return axios
    .delete(BASE_URL + `/${follow_id}`, {
      headers: { Authorization: "Bearer " + token },
    })
    .then((response) => {
      if (response) {
        return response;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

