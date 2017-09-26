class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.string :label
      t.integer :parent_id
      t.integer :user_id
      t.string :state

      t.timestamps
    end

    add_index :tasks, :parent_id
    add_index :tasks, :user_id
  end
end
