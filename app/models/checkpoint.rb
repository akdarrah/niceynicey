class Checkpoint < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validates :tasks, presence: true

  # parent_task = user.tasks
  #   .no_checkpoint
  #   .where(id: parent_task_id)
  #   .first
  #
  # eligible_task_ids = if parent_task.present?
  #   parent_task.lineage.map(&:id)
  # else
  #   user.tasks.pluck(:id)
  # end


  def self.create_checkpoint!(user, parent_task_id=nil)
    qualifying_tasks = user.tasks
      .top_level
      .no_checkpoint
      .select(&:completed_or_has_completed_child?)

    checkpoint = user.checkpoints.new

    transaction do
      qualifying_tasks.each do |qualifying_task|
        duplicate = qualifying_task.dup_with_children do |duplicating_task|
          duplicating_task.completed_or_has_completed_child?
        end

        qualifying_task.traverse do |task|
          task.archive! if task.completed?
        end

        duplicate.traverse do |task|
          task.checkpoint = checkpoint
        end

        checkpoint.tasks << duplicate
      end

      checkpoint.save!
    end

    checkpoint
  end
  
end
