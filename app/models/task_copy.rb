class TaskCopy < ApplicationRecord
  belongs_to :checkpoint
  belongs_to :original_task, class_name: "Task"
  belongs_to :copied_task, class_name: "Task"

  validates :checkpoint, :original_task, :copied_task, presence: true
end
