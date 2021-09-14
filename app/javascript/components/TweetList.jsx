import React, { useState, useContext, useEffect } from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import "../../assets/stylesheets/tweet-list.scss";
import Tweet from "./Tweet";
import New_Tweet from "./NewTweet";
import ConfirmDialog from "./ConfirmDialog";
import * as TweetService from "../helpers/tweet";
import UserContext from "../contexts/UserContext";
import * as api from "../helpers/Api";
import * as FollowService from "../helpers/Follow";

const Tweet_List = (props) => {
  const [user, setAuthState] = [
    useContext(UserContext).authState.user,
    useContext(UserContext).setAuthState,
  ];

  const [tweets, setTweets] = useState([]);
  const [followings, setFollowings] = useState([]);

  const fetchTweets = () => {
    setTweets([]);
    if (props.filter && props.filter.length > 0) {
      TweetService.search_tweets(props.filter, props.filterAtt).then(
        (tweets) => {
          setTweets(tweets.reverse());
        }
      );
    } else if (props.location.pathname === "/home") {
      TweetService.home_tweets(user.id).then((tweets) => {
        setTweets(tweets.reverse());
      });
    }
  };

  const fetchFollowings = () => {
    FollowService.followings({ account: props.user.screen_name }).then(
      (response) => {
        setFollowings(response.data);
      }
    );
  };

  useEffect(() => {
    fetchTweets();
    fetchFollowings();
  }, [props.location, props.filter, props.filterAtt]);

  function handleNewTweetAdded(evt) {
    fetchTweets();
  }

  const handleDelete = (tweet_id) => {
    console.log(tweet_id);
    TweetService.destroy(tweet_id).then((response) => {
      fetchTweets();
    });
  };

  return (
    <div className="list-tweets">
      {props.location.pathname === "/home" ? (
        <New_Tweet onNewTweet={handleNewTweetAdded} />
      ) : null}
      {
        /* {tweets
        .filter(
          (tweet) =>
            followings.find((foll) => foll.id === tweet.user.id) ||
            tweet.user.id === props.user.id
        ) */
        tweets.map((tweet) =>
          tweet.tweet ? null : (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              commentNumber={tweet.reply_count}
              retweetNumber={tweet.retweets.length}
              likeNumber={tweet.likes.length}
              likes={tweet.likes}
              retweets={tweet.retweets}
              name={tweet.user.name}
              username={tweet.user.screen_name}
              content={tweet.text}
              onDelete={handleDelete}
              isOwnTweet={tweet.user_id === user.id}
              UserPhoto={tweet.user.profile_image_url}
              handleRetweet={handleNewTweetAdded}
              isRetweet={tweet.is_retweet}
              hasImage={tweet.hasImage}
              image_url={tweet.image_url}
              tweet_ret_id={tweet.tweet_ret_id}
            />
          )
        )
      }
    </div>
  );
};

export default withRouter(Tweet_List);
