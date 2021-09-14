FactoryBot.define do
  
  factory :tweet do
    association :user, factory: :user
    
    sequence(:text) {Faker::Name.unique.name}
    sequence(:user_id) {user.id}
    sequence(:reply_count) {0}
    sequence(:retweet_count) {0}
    sequence(:favorite_count) {0}
    created_at {Time.now}
    updated_at {Time.now}

  end

end
