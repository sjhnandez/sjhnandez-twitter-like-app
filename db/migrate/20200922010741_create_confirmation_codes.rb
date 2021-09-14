class CreateConfirmationCodes < ActiveRecord::Migration[6.0]
  def change
    create_table :confirmation_codes do |t|
      t.string :email
      t.string :code

      t.timestamps
    end
  end
end
