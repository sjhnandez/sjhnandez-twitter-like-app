class Follower < ApplicationRecord

  belongs_to :follower,  foreign_key: :user_id, class_name: "User"

  belongs_to :followed_user, foreign_key: :following_id, class_name:"User"

end
