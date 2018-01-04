class AddPinnedToTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :pinned, :boolean, default: false, nil: false
  end
end
