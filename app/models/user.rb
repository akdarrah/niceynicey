class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :projects, -> { where(parent_id: nil) }, class_name: 'Task'
  has_many :tasks, dependent: :destroy
  has_many :checkpoints, dependent: :destroy

  def donation_amount
    tasks
      .no_checkpoint
      .sum(:donation_amount)
      .to_f
  end
end
