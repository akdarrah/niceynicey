class Task < ApplicationRecord
  include AASM

  COLORS = [
    "#b60205",
    "#d93f0b",
    "#fbca04",
    "#0e8a16",
    "#006b75",
    "#1d76db",
    "#0052cc",
    "#5319e7",
    "#e99695",
    "#f9d0c4",
    "#fef2c0",
    "#c2e0c6",
    "#bfdadc",
    "#c5def5",
    "#bfd4f2",
    "#d4c5f9"
  ]

  belongs_to :parent, class_name: "Task", optional: true
  belongs_to :checkpoint, optional: true
  belongs_to :user

  validates :user, :label, :color_hex, presence: true
  validate :parent_must_be_pending
  validates :color_hex, color: true

  before_validation :set_color_hex_on_create, on: :create
  before_validation :set_color_hex_on_update, on: :update
  after_save :propagated_color_hex_changes_to_children

  has_many :children,
    -> { order(position: :asc) },
    class_name: "Task",
    foreign_key: :parent_id,
    dependent: :destroy

  acts_as_list scope: :parent_id

  scope :top_level, -> { where(parent_id: nil) }
  scope :position_order, -> { order(position: :asc) }
  scope :no_checkpoint, -> { where(checkpoint_id: nil) }
  scope :pending, -> { where(state: :pending) }
  scope :completed, -> { where(state: :completed) }
  scope :unarchived, -> { where.not(state: :archived) }

  aasm :column => :state do
    state :pending, :initial => true
    state :completed
    state :archived

    event :complete do
      transitions :from => :pending, :to => :completed

      after do
        complete_children!
      end
    end

    event :archive do
      transitions :from => :completed, :to => :archived
    end
  end

  def ancestors
    Array(parent) + Array(parent.try(:ancestors))
  end

  def dup_with_children(&block)
    criteria_passed = (block_given? ? yield(self) : true)

    if criteria_passed
      duplicate = dup

      children.each do |child|
        duplicate_child = child.dup_with_children(&block)

        if duplicate_child.present?
          duplicate.children << duplicate_child
        end
      end

      duplicate
    end
  end

  def completed_or_has_completed_child?
    completed? ||
      children.detect(&:completed_or_has_completed_child?).present?
  end

  def traverse(&block)
    yield(self)

    children.each do |child|
      child.traverse(&block)
    end
  end

  def child_color_hex
    color_hex.paint.darken(5).to_s
  end

  private

  def complete_children!
    children.pending.each(&:complete!)
  end

  def parent_must_be_pending
    if !completed? && checkpoint.blank? && parent.present? && !parent.pending?
      errors.add(:parent, "must be pending")
    end
  end

  def set_color_hex_on_create
    self.color_hex ||= (parent.present? ? parent.child_color_hex : COLORS.sample)
  end

  def set_color_hex_on_update
    if parent_id_changed?
      self.color_hex = (parent.present? ? parent.child_color_hex : COLORS.sample)
    end
  end

  def propagated_color_hex_changes_to_children
    if color_hex_changed? && color_hex_was.present?
      children.each do |child|
        child.color_hex = child.parent.child_color_hex
        child.save!
      end
    end
  end

end
