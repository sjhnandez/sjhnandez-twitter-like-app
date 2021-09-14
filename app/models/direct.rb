class Direct < ApplicationRecord
  belongs_to :user,  foreign_key: :user_id_from, class_name: "User"
  
end
