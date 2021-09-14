class ConfirmationMailer < ApplicationMailer
  def confirmation_code
    @email = params[:email]
    @code = params[:code]
    mail(to: @email, subject: "#{@code} is your Twitter-Like-App verification code")
  end

  def two_factor_confirmation_code
    @email = params[:email]
    @code = params[:code]
    mail(to: @email, subject: "#{@code} is your Twitter-Like-App verification code")
  end
end
