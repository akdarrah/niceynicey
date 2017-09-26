class Task < ApplicationRecord
  include AASM

  belongs_to :parent, class_name: "Task"
  belongs_to :user

  aasm do
    state :pending, :initial => true
    state :completed

    event :complete do
      transitions :from => :pending, :to => :completed
    end
  end

end
