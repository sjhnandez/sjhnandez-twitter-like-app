module Api
  class SignupController < ApplicationController
    protect_from_forgery with: :null_session

    def request_confirmation
      confirmation = ConfirmationCode.create(code: rand.to_s[2..7], email: params[:email], verified: false)
      if confirmation.valid?
        ConfirmationMailer.with(email: confirmation.email, code: confirmation.code).confirmation_code.deliver_now
        render json: { success: "Confirmation request received" }
      else
        render json: { failure: "Internal server error" }
      end
    end

    def verify_code
      @code = params[:verification_code]
      @email = params[:email]
      record = ConfirmationCode.where(email: @email).sort_by(&:created_at).reverse.first
      if record.code.eql? @code
        record.verified = true
        if record.save
          render json: { success: "Email verified" }
        else
          render json: { failure: "Verification failed (1)" }
        end
      else
        render json: { failure: "Verification failed (2)" }
      end
    end

    def check_screen_name_availability
      user = User.find_by(screen_name: params[:screen_name])
      if user
        render json: { unavailable: "Username is unavailable" }
      else
        render json: { available: "Username is available" }
      end
    end

    private

    def signup_params
      params.require().permit(:verification_code, :email, :screen_name)
    end
  end
end
