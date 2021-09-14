FactoryBot.define do
  factory :direct do
    user_id_from { 1 }
    user_id_to { 1 }
    message { "MyString" }
    has_image { false }
    image_url { "MyString" }
  end
end
