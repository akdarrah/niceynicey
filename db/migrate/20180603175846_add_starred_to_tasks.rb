class AddStarredToTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :starred, :boolean, default: false, null: false
  end
end
