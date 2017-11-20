class ArchivedTaskSerializer < TaskSerializer
  has_many :children, serializer: ArchivedTaskSerializer

  def children
    object.children
  end
end
