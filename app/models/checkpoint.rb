class Checkpoint < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validates :tasks, presence: true

  def self.create_checkpoint!(user)
    checkpoint = user.checkpoints.new

    transaction do
      qualifying_tasks = user.tasks
        .top_level
        .no_checkpoint
        .select(&:completed_or_has_completed_child?)

      qualifying_tasks = qualifying_tasks.map do |task|
        duplicate = task.dup_with_children do |duplicating_task|
          duplicating_task.completed_or_has_completed_child?
        end

        duplicate.traverse do |task|
          task.checkpoint = checkpoint
        end

        duplicate
      end

      qualifying_tasks.each do |qualifying_task|
        checkpoint.tasks << qualifying_task
      end

      checkpoint.save!
    end

    checkpoint
  end
end
