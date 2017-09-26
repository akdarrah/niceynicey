class Task < ApplicationRecord
  belongs_to :parent, class_name: "Task"
  belongs_to :user
end
