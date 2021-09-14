class AddVerifiedToConfirmationCodes < ActiveRecord::Migration[6.0]
  def change
    add_column :confirmation_codes, :verified, :boolean
  end
end
