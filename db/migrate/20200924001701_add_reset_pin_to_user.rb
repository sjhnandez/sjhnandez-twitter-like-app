class AddResetPinToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :password_reset_pin, :string
    add_column :users, :password_reset_pin_sent_at, :datetime
  end
end
