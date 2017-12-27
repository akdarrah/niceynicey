class CreateTaskCopies < ActiveRecord::Migration[5.0]
  def change
    create_table :task_copies do |t|
      t.integer :checkpoint_id
      t.integer :original_task_id
      t.integer :copied_task_id

      t.timestamps
    end

    add_index :task_copies, :checkpoint_id
    add_index :task_copies, :original_task_id
    add_index :task_copies, :copied_task_id
  end
end
