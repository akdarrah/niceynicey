class AddExtendedToTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :extended, :boolean, default: true, nil: false
  end
end
