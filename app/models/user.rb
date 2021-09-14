class User < ApplicationRecord
  has_secure_password :validations => false
  validates :screen_name, presence: true, uniqueness: true
  validates :password_digest, presence: true
  has_many :tweets
  has_many :likes
  has_many :retweets
  
  has_one_attached :avatar
  
  has_many :received_follows, foreign_key: :following_id, class_name: "Follower"

  has_many :followers, through: :received_follows, source: :follower

  has_many :given_follows, foreign_key: :user_id, class_name: "Follower"

  has_many :followings, through: :given_follows, source: :followed_user

  has_many :directs, foreign_key: :user_id_to, class_name: "Direct"

  has_many :directs_sent, foreign_key: :user_id_from, class_name: "Direct"



  def generate_password_reset_token!
    self.password_reset_token = SecureRandom.urlsafe_base64
    self.password_reset_token_sent_at = Time.now.utc
    save!
  end

  def password_reset_token_valid?
    (self.password_reset_token_sent_at + 4.hours) > Time.now.utc
  end

  def generate_password_reset_pin!
    self.password_reset_pin = SecureRandom.hex(4)
    self.password_reset_pin_sent_at = Time.now.utc
    save!
  end

  def password_reset_pin_valid?
    (self.password_reset_pin_sent_at + 4.hours) > Time.now.utc
  end

  def generate_two_factor_auth_token!
    self.two_factor_auth_token = SecureRandom.hex(4)
    self.two_factor_auth_token_sent_at = Time.now.utc
    save!
  end

  def two_factor_auth_token_valid?
    puts self.two_factor_auth_token_sent_at 
    (self.two_factor_auth_token_sent_at + 5.minutes) > Time.now.utc
  end

  def update_2fa
    self.enabled_2fa = !self.enabled_2fa
    puts self.enabled_2fa
    save!
  end

end
