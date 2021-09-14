import axios from "axios";
const BASE_URL = "/api/tweets";
const LIKE_URL = "/api/likes";
const RETWEET_URL = "/api/retweets";

const token = localStorage.getItem("token");

/* export const index = async (userid) => {
    return axios
      .post(BASE_URL + '/my_tweets/',{
          user_id: userid
      },
      {
        headers: { Authorization: "Bearer " + token,}
      })
      .then((response) => {
        if (response) {
          return response;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }; */

export const index = async () => {
  return axios
    .get(BASE_URL)
    .then((response) => {
      if (response) {
        return response.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const create = async (body) => {
  return axios
    .post(
      BASE_URL,
      {
        text: body.text,
        user_id: body.user_id,
        is_retweet: false,
        hasImage: body.hasImage,
        image_url: body.image_url,
        tweet_ret_id: "",
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

export const getTweet = async (tweet_id) => {
  return axios
    .get(BASE_URL + `/${tweet_id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const destroy = async (tweet_id) => {
  return axios
    .delete(BASE_URL + `/${tweet_id}`, {
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

export const home_tweets = async (user_id) => {
  return axios
    .post("/api/tweets/home_tweets", {
      user_id: user_id,
    })
    .then((response) => {
      if (response) {
        return response.data.sort((a, b) =>
          a.created_at > b.created_at ? 1 : -1
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const search_tweets = async (filter, filter_attribute) => {
  return axios
    .post("/api/tweets/search_tweets", {
      tweet: { filter, filter_attribute },
    })
    .then((response) => {
      if (response) {
        return response.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createLike = async (body) => {
  return axios
    .post(LIKE_URL, body)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const removeLike = async (like_id) => {
  return axios
    .delete(LIKE_URL + `/${like_id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const createRetweet = async (body) => {
  return axios
    .post(RETWEET_URL, body)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const removeRetweet = async (retweet_id) => {
  return axios
    .delete(RETWEET_URL + `/${retweet_id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

export const getUser = async (user_screnname, id) => {
  return axios.post(
    "/api/get_users_follow",
    {
      "id": id,
      "screen_name": user_screnname,
    }
  ).then(
    (response) => {
      return response.data;
    }
  ).catch(
    error =>{
      return error;
    } 
  )
}