class CreateCheckpoints < ActiveRecord::Migration[5.0]
  def change
    create_table :checkpoints do |t|
      t.integer :user_id

      t.timestamps
    end

    add_index :checkpoints, :user_id

    add_column :tasks, :checkpoint_id, :integer
    add_index :tasks, :checkpoint_id
  end
end
