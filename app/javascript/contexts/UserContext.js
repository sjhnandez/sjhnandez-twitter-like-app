import { createContext } from "react";

const defaultUser = {
  currentUser: null,
  stateReported: false,
};

const UserContext = createContext({
  user: defaultUser,
});

export default UserContext;
