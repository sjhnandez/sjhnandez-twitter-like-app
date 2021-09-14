module Api
  class TwoFactorAuthController < ApplicationController
    protect_from_forgery with: :null_session
    
    require "twilio-ruby"    

    def send_two_factor_auth_email
        puts Rails.application.credentials.twilio_account_sid
        user = User.find_by(screen_name: params[:screen_name])
        if user
            user.generate_two_factor_auth_token!
            ConfirmationMailer.with(email: user.email, code: user.two_factor_auth_token).two_factor_confirmation_code.deliver_now

            #client = Twilio::REST::Client.new(Rails.application.credentials.twilio_account_sid, Rails.application.credentials.twilio_auth_token)
            #client.messages.create({
            #from: Rails.application.credentials.twilio_phone_number,
            #to: "+57" + user.phone,
            #body: "#{user.two_factor_auth_token} is your device verification code. Don't reply to this message with your code.",
            #})
            render json: { success: "2 factor auth code  sent" }
        else
            render json: { failure: "User not found" }
        end
    end

    def verify_two_factor_code
      token = params[:two_factor_auth_token]
      user = User.find_by(two_factor_auth_token: token)
      puts user.screen_name
      if user && user.two_factor_auth_token_valid?
        payload = { user_id: user.id }
        token = encode_token(payload)
        render json: { user: user, jwt: token, success: "Logged in as #{user.screen_name}" }
      else
        render json: { failure: "Invalid token" }
      end
    end
    
  end
end
