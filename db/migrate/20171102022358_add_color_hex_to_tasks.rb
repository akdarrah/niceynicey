class AddColorHexToTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :color_hex, :string
  end
end
