class CreateRetweets < ActiveRecord::Migration[6.0]
  def change
    create_table :retweets do |t|
      t.integer :user_id
      t.integer :tweet_id
      t.string :message

      t.timestamps
    end
  end
end
