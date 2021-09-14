class CreateFollowers < ActiveRecord::Migration[6.0]
  def change
    create_table :followers do |t|
      t.integer :user_id
      t.integer :following_id

      t.timestamps
    end
  end
end
