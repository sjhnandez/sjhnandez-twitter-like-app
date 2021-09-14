module Api
  class FollowersController < ApplicationController
    protect_from_forgery with: :null_session

    
    def index
      followers = Follower.all
      render json: followers
    end

    def create
      orig = User.find_by(screen_name: params[:account])
      origin = orig.id
      dest = User.find_by(screen_name: params[:follower])
      destiny = dest.id
      if orig.followings.exists?(destiny)
        render json: {message: "already follows this user"}
      else
        follow = Follower.create(user_id: origin, following_id: destiny)
        if follow.save
          #ACTIVAR ANTES DE MANDAR LA ENTREGA
          FollowMailer.with(email: dest.email, origin: orig.name ).follow_mail.deliver_now
          render json: follow, message: :success
        else
          render json: { error: tweet.errors.messages }
        end

      end
    end


    def follows
      target = User.find_by(screen_name: params[:account])
      render json: target.followers
    end

    def following
      target = User.find_by(screen_name: params[:account])
    
      render json: target.followings
    end

    def isfollows
      user = User.find_by(screen_name: params[:account])
      followed = User.find_by(screen_name: params[:followed])
      if user.followings.exists?(followed.id)
        render json: Follower.where(user_id: user, following_id: followed)
      else
        render json: {message: "relation not found"}
      end
    end

    def destroy
      follow = Follower.find(params[:id]);
      if follow.destroy
        render json: { success: "follow deleted!" }
      else
        render json: { error: follow.errors.messages }
      end
    end


    def followers_params
      params.require(:follower).permit(:account, :follower)
    end

  end
end
