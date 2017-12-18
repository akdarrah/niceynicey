class Checkpoint < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validates :tasks, presence: true

  def self.create_checkpoint!(user, parent_task_id=nil)
    parent_task = user.tasks
      .no_checkpoint
      .where(id: parent_task_id)
      .first

    eligible_task_ids = if parent_task.present?
      parent_task.lineage.map(&:id)
    else
      user.tasks.pluck(:id)
    end

    qualifying_tasks = user.tasks
      .top_level
      .no_checkpoint
      .select(&:completed_or_has_completed_child?)

    checkpoint = user.checkpoints.new

    transaction do
      qualifying_tasks.each do |qualifying_task|
        duplicate = qualifying_task.dup_with_children do |duplicating_task|
          duplicating_task.completed_or_has_completed_child? &&
            eligible_task_ids.include?(duplicating_task.id)
        end

        next if duplicate.blank?

        qualifying_task.traverse do |task|
          if task.completed? && eligible_task_ids.include?(task.id) && task.id != parent_task_id
            task.archive!
          end
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
