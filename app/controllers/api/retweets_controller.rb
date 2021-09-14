module Api
  class RetweetsController < ApplicationController
    protect_from_forgery with: :null_session

    def index
      retweets = Retweet.all
      render json: retweets
    end

    def show 
      retweet = Retweet.find_by(id: param[:id])

      render json: retweet
    end
    
    def create
      retweet = Retweet.new(retweet_params)

      if retweet.save
        tweet = Tweet.new(
          text: params[:message], 
          user_id: params[:user_id],
          is_retweet: true,
          hasImage: params[:has_image],
          image_url: params[:image_url],
          tweet_ret_id: retweet.tweet_id
        )
        if tweet.save
          render json: {"retweet": retweet, "tweet": tweet }
        
        else
          render json: {error: tweet.errors.messages }
        end
      else
        render json: {error: retweet.errors.messages }
      end
    end

  
    def destroy
      retweet = Retweet.find(params[:id])

      if retweet.destroy
        render json: { success: "retweet deleted!", status: :success }
      else
        render json: { error: "retweet not found", status: :error }
      end
    end


    private 

    def retweet_params
      params.require(:retweet).permit(:user_id, :tweet_id, :message, :has_image, :image_url)
    end


  end
end