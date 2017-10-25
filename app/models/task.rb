class Task < ApplicationRecord
  include AASM

  belongs_to :parent, class_name: "Task", optional: true
  belongs_to :user

  has_many :children,
    -> { order(position: :asc) },
    class_name: "Task",
    foreign_key: :parent_id,
    dependent: :destroy

  acts_as_list scope: :parent_id

  scope :top_level, -> { where(parent_id: nil) }
  scope :position_order, -> { order(position: :asc) }

  aasm :column => :state do
    state :pending, :initial => true
    state :completed

    event :complete do
      transitions :from => :pending, :to => :completed

      after do
        complete_children!
      end
    end
  end

  private

  def complete_children!
    children.each(&:complete!)
  end

end
