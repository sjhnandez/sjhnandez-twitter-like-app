class CreateTweets < ActiveRecord::Migration[6.0]
  def change
    create_table :tweets do |t|
      t.string :text
      t.belongs_to :user, null: false, foreign_key: true
      t.boolean :is_retweet
      t.boolean :hasImage
      t.string  :image_url
      t.integer :tweet_ret_id

      t.timestamps
    end
  end
end
