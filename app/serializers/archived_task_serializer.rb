class ArchivedTaskSerializer < TaskSerializer
  def children
    object.children
  end
end
