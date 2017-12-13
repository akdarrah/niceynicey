class TaskSerializer < ActiveModel::Serializer
  attributes :id, :label, :parent_id, :user_id, :state,
    :created_at, :updated_at, :notes, :color_hex, :child_color_hex,
    :checkpoint_id, :position

  has_many :children, serializer: TaskSerializer

  belongs_to :parent, if: -> { object.parent } do
    {
      id: object.parent.id,
      label: object.parent.label,
      color_hex: object.parent.color_hex
    }
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
end
