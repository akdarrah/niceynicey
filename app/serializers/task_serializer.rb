class TaskSerializer < ActiveModel::Serializer
  attributes :id, :label, :parent_id, :user_id, :state,
    :created_at, :updated_at, :notes

  has_many :children, serializer: TaskSerializer

  belongs_to :parent, if: -> { object.parent } do
    {
      id: object.parent.id,
      label: object.parent.label
    }
  end
end
