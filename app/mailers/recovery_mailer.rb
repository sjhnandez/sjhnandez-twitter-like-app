class RecoveryMailer < ApplicationMailer
  def password_reset_link
    @email = params[:email]
    @link = params[:link]
    puts @email
    puts @link
    mail(to: @email, subject: "Password reset request")
  end
end
