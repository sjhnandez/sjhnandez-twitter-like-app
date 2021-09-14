import React, { useState, useEffect } from "react";
import * as FollowService from "../helpers/Follow";

import FollowCard from "./FollowCard";

const Followers = (props) => {
  const [followers, setFollowers] = useState([]);

  const fetchFollowers = () => {
    FollowService.followers({ account: props.user.screen_name }).then(
      (response) => {
        console.log("Followers: ", response.data);
        setFollowers(response.data);
      }
    );
  };

  useEffect(() => {
    fetchFollowers();
  }, []);

  return (
    <div>
      {followers.map((follower) => (
        <FollowCard
          key={follower.id}
          username={follower.screen_name}
          UserPhoto={follower.profile_image_url}
          name={follower.name}
        />
      ))}
    </div>
  );
};

export default Followers;
