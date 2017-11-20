class CheckpointSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :created_at, :updated_at

  has_many :tasks, serializer: ArchivedTaskSerializer

  def tasks
    object.tasks
      .top_level
      .position_order
  end
end
