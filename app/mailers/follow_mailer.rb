class FollowMailer < ApplicationMailer
  def follow_mail
    @email = params[:email]
    @follow = params[:origin]
    puts @email
    puts @link
    mail(to: @email, subject: "Someone is following you")
  end
end
