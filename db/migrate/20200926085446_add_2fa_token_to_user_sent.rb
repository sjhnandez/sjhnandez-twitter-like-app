class Add2faTokenToUserSent < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :two_factor_auth_token_sent_at, :datetime
  end
end
