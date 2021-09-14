class Add2faTokenToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :two_factor_auth_token, :string
  end
end
