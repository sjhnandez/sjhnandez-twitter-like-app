module Api
  class AuthController < ApplicationController
    protect_from_forgery with: :null_session

    def login
      user = find_user(params[:login_id])
      if user && user.authenticate(params[:password])
        puts user.enabled_2fa
        if user.enabled_2fa
          render json: { user: user, success: "confirmed #{user.screen_name}, missing 2 verification" }
        else 
          payload = { user_id: user.id }
          token = encode_token(payload)
          render json: { user: user, jwt: token, success: "Logged in as #{user.screen_name}" }
        end
      else
        render json: { failure: "Login failed" }
      end
    end

    def check_password
      user = User.find_by(screen_name: params[:screen_name])
      if user && user.authenticate(params[:password])
        user.update_2fa
        render json: {user: user, success: "confirmed identity"}
      else
        render json: { error: "password incorrect"}
      end
    end

    def check_auth
      if active_session
        render json: active_session
      else
        render json: { error: "No active session" }
      end
    end

    private

    def login_params
      params.require(:user, :password).permit(:login_id)
    end
  end
end
