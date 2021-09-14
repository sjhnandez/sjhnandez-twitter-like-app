class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :screen_name
      t.string :email
      t.integer :phone
      t.string :location
      t.string :url
      t.string :description
      t.integer :followers_count
      t.integer :friends_count
      t.string :profile_banner_url
      t.string :profile_image_url
      t.string :password_digest

      t.timestamps
    end
  end
end
