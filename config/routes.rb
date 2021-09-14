Rails.application.routes.draw do
  root "pages#index"

  namespace :api do
    resources :users, param: :screen_name
    resources :tweets, param: :id
    resources :likes, param: :id
    resources :retweets, param: :id
    resources :followers, param: :id
    resources :directs, param: :id

    post "tweets/my_tweets", to: "tweets#my_tweets"
    post "tweets/home_tweets", to: "tweets#home_tweets"
    post "/login", to: "auth#login"
    post "/check_auth", to: "auth#check_auth"
    post "/check_password", to: "auth#check_password"
    post "/request_confirmation", to: "signup#request_confirmation"
    post "/verify_code", to: "signup#verify_code"
    post "/users/check_screen_name_availability", to: "signup#check_screen_name_availability"
    post "/find_user_for_reset", to: "password_reset#find_user_for_reset"
    post "/send_recovery_email", to: "password_reset#send_recovery_email"
    post "/verify_reset_token", to: "password_reset#verify_reset_token"
    post "/send_recovery_sms", to: "password_reset#send_recovery_sms"
    post "/send_two_factor_auth_email", to: "two_factor_auth#send_two_factor_auth_email"
    post "/verify_two_factor_code", to: "two_factor_auth#verify_two_factor_code"
    post "/verify_reset_pin", to: "password_reset#verify_reset_pin"
    get "/upload", to: "s3#set_s3_direct_post"
    post "/get_followers", to: "followers#follows"
    post "/get_followings", to: "followers#following"
    post "/follows", to: "followers#isfollows"
    post "/get_direct_messages", to: "directs#get_direct_messages"
    post "/tweets/search_tweets", to: "tweets#search_tweets"
    post "/get_users_follow", to: "users#get_users_follow"
  end

  get "*path", to: "pages#index", via: :all
end
