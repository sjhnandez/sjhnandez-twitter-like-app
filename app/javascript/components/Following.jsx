import React, { useEffect, useState } from "react";
import FollowCard from "./FollowCard";
import * as FollowService from "../helpers/Follow";

const Followings = (props) => {
  const [followings, setFollowings] = useState([]);

  const fetchFollowings = () => {
    console.log(props.user);
    FollowService.followings({ account: props.user.screen_name }).then(
      (response) => {
        console.log(response);
        setFollowings(response.data);
        console.log("foll", followings);
      }
    );
  };

  useEffect(() => {
    fetchFollowings();
  }, []);

  return (
    <div>
      {followings.map((following) => (
        <FollowCard
          key={following.id}
          username={following.screen_name}
          UserPhoto={following.profile_image_url}
          name={following.name}
          description={following.description}
        />
      ))}
    </div>
  );
};

export default Followings;
