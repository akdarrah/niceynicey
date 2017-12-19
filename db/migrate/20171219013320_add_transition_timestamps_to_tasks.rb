class AddTransitionTimestampsToTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :completed_at, :datetime
    add_column :tasks, :archived_at, :datetime

    Task.completed.each do |task|
      task.update_column :completed_at, task.updated_at
    end

    Task.archived.each do |task|
      task.update_column :completed_at, task.updated_at
      task.update_column :archived_at, task.updated_at
    end
  end
end
