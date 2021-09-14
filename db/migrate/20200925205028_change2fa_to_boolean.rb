class Change2faToBoolean < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :enabled_2fa, "boolean USING CAST(enabled_2fa AS boolean)"
  end
end
