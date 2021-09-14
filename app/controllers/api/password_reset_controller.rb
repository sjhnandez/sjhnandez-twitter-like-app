module Api
  class PasswordResetController < ApplicationController
    protect_from_forgery with: :null_session

    require "twilio-ruby"

    def find_user_for_reset
      user = find_user(params[:login_id])
      if user
        strarr = user.email.split("@")
        email_hint = strarr[0][0, 2] + strarr[0][2..-1].tr("^ ", "*") + "@" + strarr[1][0] + strarr[1][1..-1].tr("^.", "*")
        render json: { name: user.name, screen_name: user.screen_name, phone_hint: user.phone[-2, 2], email_hint: email_hint, profile_image_url: user.profile_image_url }
      else
        render json: { failure: "User not found" }
      end
    end

    def send_recovery_email
      user = User.find_by(screen_name: params[:screen_name])
      if user
        user.generate_password_reset_token!
        RecoveryMailer.with(email: user.email, link: request.base_url + "/reset_password?token=" + user.password_reset_token).password_reset_link.deliver_now
        render json: { success: "Password reset email sent" }
      else
        render json: { failure: "User not found" }
      end
    end

    def send_recovery_sms
      puts Rails.application.credentials.twilio_account_sid
      user = User.find_by(screen_name: params[:screen_name])
      if user
        user.generate_password_reset_pin!
        client = Twilio::REST::Client.new(Rails.application.credentials.twilio_account_sid, Rails.application.credentials.twilio_auth_token)
        client.messages.create({
          from: Rails.application.credentials.twilio_phone_number,
          to: "+57" + user.phone,
          body: "#{user.password_reset_pin} is your confirmation code to reset your Twitter password. Don't reply to this message with your code.",
        })
        render json: { success: "Password reset email sent" }
      else
        render json: { failure: "User not found" }
      end
    end

    def verify_reset_token
      token = params[:reset_token]
      user = User.find_by(password_reset_token: token)
      if user && user.password_reset_token_valid?
        render json: { user: user }
      else
        render json: { failure: "Invalid token" }
      end
    end

    def verify_reset_pin
      token = params[:reset_pin]
      user = User.find_by(password_reset_pin: token)
      if user && user.password_reset_pin_valid?
        render json: { user: user }
      else
        render json: { failure: "Invalid pin" }
      end
    end

    private

    def password_reset_params
      params.permit(:login_id, :reset_token, :password, :password_confirmation, :email)
    end
  end
end
