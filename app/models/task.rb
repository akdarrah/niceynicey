class Task < ApplicationRecord
  include AASM

  belongs_to :parent, class_name: "Task", optional: true
  belongs_to :user

  aasm :column => :state do
    state :pending, :initial => true
    state :completed

    event :complete do
      transitions :from => :pending, :to => :completed
    end
  end

end
