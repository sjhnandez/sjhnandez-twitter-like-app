class Add2faToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :enabled_2fa, :string
  end
end
