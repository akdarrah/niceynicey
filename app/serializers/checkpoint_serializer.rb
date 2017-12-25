class CheckpointSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :created_at, :updated_at,
    :completed_tasks_count, :human_completed_at

  def completed_tasks_count
    object.tasks.completed.count
  end

  def human_completed_at
    object.created_at.stamp("March 1, 1999 at 3:00 AM")
  end
end
