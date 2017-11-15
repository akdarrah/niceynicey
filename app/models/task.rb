class Task < ApplicationRecord
  include AASM

  COLORS = [
    "#001f3f",
    "#0074D9",
    "#7FDBFF",
    "#39CCCC",
    "#3D9970",
    "#2ECC40",
    "#01FF70",
    "#FFDC00",
    "#FF851B",
    "#FF4136",
    "#85144b",
    "#F012BE",
    "#B10DC9"
  ]

  belongs_to :parent, class_name: "Task", optional: true
  belongs_to :user

  validates :user, :label, :color_hex, presence: true
  validate :parent_must_be_pending, on: :create

  before_validation :set_temporary_color_hex
  before_validation :set_color_hex_from_parent

  has_many :children,
    -> { order(position: :asc) },
    class_name: "Task",
    foreign_key: :parent_id,
    dependent: :destroy

  acts_as_list scope: :parent_id

  scope :top_level, -> { where(parent_id: nil) }
  scope :position_order, -> { order(position: :asc) }
  scope :pending, -> { where(state: :pending) }

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

  def rendered_notes
    filter = HTML::Pipeline::MarkdownFilter.new(notes.to_s)
    filter.call
  end

  private

  def complete_children!
    children.pending.each(&:complete!)
  end

  def parent_must_be_pending
    if parent.present? && !parent.pending?
      errors.add(:parent, "must be pending")
    end
  end

  def set_temporary_color_hex
    if parent.blank?
      self.color_hex ||= COLORS.sample
    end
  end

  def set_color_hex_from_parent
    if parent.present?
      self.color_hex ||= parent.color_hex.paint.darken(5)
    end
  end

end
