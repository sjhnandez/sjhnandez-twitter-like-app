class Tweet < ApplicationRecord
  belongs_to :user
  has_many :likes
  has_many :retweets

  validates_length_of :text, maximum: 240
  #validates :text, presence: true
  validates :user_id, presence: true

end
