class AddTimeZoneToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :time_zone, :string, default: 'Eastern Time (US & Canada)', null: false
  end
end
