class CreateDirects < ActiveRecord::Migration[6.0]
  def change
    create_table :directs do |t|
      t.integer :user_id_from
      t.integer :user_id_to
      t.string :message
      t.boolean :has_image
      t.string :image_url

      t.timestamps
    end
  end
end
