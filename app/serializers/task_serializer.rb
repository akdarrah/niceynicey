class TaskSerializer < ActiveModel::Serializer
  attributes :id, :label, :parent_id, :user_id, :state,
    :created_at, :updated_at

  has_many :children, serializer: TaskSerializer
end
