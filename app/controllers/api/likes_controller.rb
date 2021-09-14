module Api
  class LikesController < ApplicationController
    protect_from_forgery with: :null_session

    def index
      likes = Like.all
      render json: likes
    end

    def show
      like = Like.find_by(id: params[:id])
      render json: like
    end

    def create
      like = Like.new(like_params)
      if like.save
        render json: like
      else
        render json: {error: like.errors.messages }
      end
    end

  
    def destroy
      like = Like.find(params[:id])

      if like.destroy
        render json: { success: "Like deleted!", status: :success }
      else
        render json: { error: "Like not found", status: :error }
      end
    end


    private 

    def like_params
      params.require(:like).permit(:user_id, :tweet_id)
    end

  end
end
