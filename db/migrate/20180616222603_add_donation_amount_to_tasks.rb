class AddDonationAmountToTasks < ActiveRecord::Migration[5.0]
  def change
    add_column :tasks, :donation_amount, :decimal, :precision => 9, :scale => 2, default: 0.00
  end
end
