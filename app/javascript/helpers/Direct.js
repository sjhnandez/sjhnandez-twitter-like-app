import axios from "axios";
const BASE_URL = "/api/directs";
const GET_URL = "/api/get_direct_messages";


const token = localStorage.getItem("token");

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


export const getDirectMessages = async (body) => {
  return axios.post(
    GET_URL, body, {
      headers: { Authorization: "Bearer " + token },
    }
  ).then(
    (response) => {
      return response.data;
    }
  ).catch(
    (error) => {
      return error;
    }
  )
}

export const create = async (body) => {
  return axios.post(
    BASE_URL, body,{
      headers: { Authorization: "Bearer " + token }
    }
  ).then(
    response => {
      return response.data;
    }
  ).catch(
    error => {
      return error;
    }
  )
}

