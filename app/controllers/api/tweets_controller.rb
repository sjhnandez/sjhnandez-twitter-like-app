module Api
  class TweetsController < ApplicationController
    protect_from_forgery with: :null_session

    def index
      tweets = Tweet.all
      render json: tweets.as_json(include: [:user, :likes, :retweets])
    end

    def my_tweets
      tweets = Tweet.where(:user_id => params[:user_id])
      render json: tweets
    end

    def home_tweets
      user = User.find(params[:user_id])
      followings = user.followings
      response = []

      user.tweets.as_json(include: [:user, :likes, :retweets]).each do |tweet|
        response.push(tweet)
      end
      if user.retweets.as_json(include: [:user, :tweet]).length > 0
        user.retweets.as_json(include: [:user, :tweet]).each do |tweet|
          response.push(tweet)
        end
      end
      followings.each do |following|
        if following.tweets.as_json(include: [:user]).length > 0
          following.tweets.as_json(include: [:user, :likes, :retweets]).each do |tweet|
            response.push(tweet)
          end
        end
        if following.retweets.as_json(include: [:user, :tweet]).length > 0
          following.retweets.as_json(include: [:user, :tweet]).each do |tweet|
            response.push(tweet)
          end
        end
      end

      render json: response
    end

    def search_tweets
      if tweet_params[:filter_attribute] == "text"
        tweets = Tweet.where("lower(text) LIKE lower(?)", "%#{tweet_params[:filter]}%")
      elsif tweet_params[:filter_attribute] == "user"
        tweets = Tweet.joins(:user).where("lower(users.name) LIKE lower(?)", "%#{tweet_params[:filter]}%")
      end

      render json: tweets.as_json(include: [:user, :likes, :retweets])
    end

    def show
      tweet = Tweet.find_by(id: params[:id])
      render json: tweet.as_json(include: [:user])
    end

    def create
      tweet = Tweet.new(tweet_params)
      if tweet.save
        render json: tweet
      else
        render json: { error: tweet.errors.messages }
      end
    end

    def destroy
      tweet = Tweet.find(params[:id])

      if tweet.destroy
        render json: { success: "Tweet deleted!" }
      else
        render json: { error: "Tweet not found" }
      end
    end

    private

    def tweet_params
      params.require(:tweet).permit(:text, :user_id, :is_retweet, :hasImage, :image_url, :tweet_ret_id, :filter, :filter_attribute)
    end
  end
end
