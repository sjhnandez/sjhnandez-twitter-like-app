class ApplicationController < ActionController::Base
  def encode_token(payload)
    require "jwt"
    JWT.encode(payload, "tokensecret")
  end

  def active_session
    auth_header = request.headers["Authorization"]
    if auth_header
      token = auth_header.split(" ")[1]
      begin
        decoded = JWT.decode(token, "tokensecret", true, algorithm: "HS256")

        #decoded[0] is the payload, decoded[1] is the header
        user_id = decoded[0]["user_id"]
        User.find_by(id: user_id)
      rescue => exception
        puts exception
        nil
      end
    end
  end

  def require_login
    unless active_session
      render json: { message: "You need to be logged in" }, status: :unauthorized
    end
  end

  def find_user(login_id)
    user = User.find_by(screen_name: login_id)
    if !user
      user = User.find_by(phone: login_id)
      if !user
        user = User.find_by(email: login_id)
      end
    end
    return user
  end
end
