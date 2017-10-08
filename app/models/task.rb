class Task < ApplicationRecord
  include AASM

  belongs_to :parent, class_name: "Task", optional: true
  belongs_to :user

  has_many :children, class_name: "Task", foreign_key: :parent_id, dependent: :destroy

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

  def as_json(options={})
    super(:include =>[:children])
  end

  private

  def complete_children!
    children.each(&:complete!)
  end

end
