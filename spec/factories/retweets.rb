FactoryBot.define do
  factory :retweet do
    user_id { 1 }
    tweet_id { 1 }
    message { "MyString" }
  end
end
