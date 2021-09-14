class Retweet < ApplicationRecord
  belongs_to :user
  belongs_to :tweet

  validates_length_of :message,  maximum: 240 
 

end
