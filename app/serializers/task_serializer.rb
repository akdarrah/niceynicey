class TaskSerializer < ActiveModel::Serializer
  attributes :id, :label, :parent_id, :user_id, :state,
    :created_at, :updated_at, :notes, :color_hex, :child_color_hex,
    :checkpoint_id, :position, :human_completed_at, :human_archived_at,
    :extended, :pinned, :descendants_count, :copied_from_task_id, :starred

  has_many :children, serializer: TaskSerializer

  belongs_to :parent, if: -> { object.parent } do
    {
      id: object.parent.id,
      label: object.parent.label,
      color_hex: object.parent.color_hex
    }
  end

  def copied_from_task_id
    if object.checkpoint_id.present?
      object.copied_from_task.try(:id)
    end
  end

  def children
    if object.checkpoint.present?
      object.children
    else
      object.children
        .no_checkpoint
        .unarchived
    end
  end

  def human_completed_at
    if object.completed_at
      object.completed_at.stamp("March 1, 1999 at 3:00 AM")
    end
  end

  def human_archived_at
    if object.archived_at
      object.archived_at.stamp("March 1, 1999 at 3:00 AM")
    end
  end

  def descendants_count
    object.descendants.count
  end

end
