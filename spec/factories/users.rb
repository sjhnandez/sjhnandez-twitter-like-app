FactoryBot.define do
  
  factory :user do
    sequence(:name) {Faker::Name.unique.name}
    sequence(:screen_name) {Faker::Name.first_name}
    sequence(:email) {|n| "fabioz#{n}@uninorte.edu.co" }
    sequence(:phone) {"3043479853"}
    sequence(:followers_count) {0}
    sequence(:friends_count) {0}
    sequence(:password_digest) {|n| "password#{n}"}
    sequence(:birthday) {Faker::Date.in_date_period}
    created_at {Time.now}
    updated_at {Time.now}

  end

end