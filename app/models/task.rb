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
  scope :archived, -> { where(state: :archived) }
  scope :unarchived, -> { where.not(state: :archived) }

  def self.tasks_completed_in_last_year(user_id, parent_task_id=nil)
    base_condition = if parent_task_id.present?
      "AND (id = #{parent_task_id})"
    else
      "AND (parent_id IS NULL)"
    end

    query = <<-SQL
      WITH RECURSIVE children AS (
        SELECT id, completed_at
        FROM tasks
        WHERE (user_id = #{user_id})
          AND (checkpoint_id IS NULL)
          #{base_condition}
        UNION
          SELECT a.id, a.completed_at
          FROM tasks a
          JOIN children b ON (a.parent_id = b.id)
          WHERE a.completed_at >= '#{1.year.ago.to_formatted_s(:db)}'
      ) SELECT * FROM children WHERE children.completed_at IS NOT NULL;
    SQL

    task_ids = ActiveRecord::Base.connection.execute(query).map{|r| r['id'].to_i}

    query = <<-SQL
      SELECT extract(epoch from date_trunc('day', tasks.completed_at)) "day", count(*)
        FROM tasks
        WHERE id IN (#{task_ids.join(',')})
        GROUP BY 1
        ORDER BY 1
    SQL

    ActiveRecord::Base.connection.execute(query).inject({}) do |final, result|
      final.merge!(result["day"] => result["count"])
    end
  end


  aasm :column => :state do
    state :pending, :initial => true
    state :completed
    state :archived

    event :complete do
      transitions :from => :pending, :to => :completed

      before do
        before_complete!
      end

      after do
        after_complete!
      end
    end

    event :archive do
      transitions :from => :completed, :to => :archived

      before do
        before_archive!
      end

      after do
        after_archive!
      end
    end
  end

  def ancestors
    Array(parent) + Array(parent.try(:ancestors))
  end

  def descendants
    (children + children.map(&:descendants)).flatten
  end

  def lineage
    (ancestors + Array(self) + descendants)
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

  def before_complete!
    self.completed_at = Time.now
  end

  def after_complete!
    children.pending.each(&:complete!)
  end

  def before_archive!
    self.archived_at = Time.now
  end

  def after_archive!
    children.completed.each(&:archive!)
  end

  def parent_must_be_pending
    if pending? && checkpoint.blank? && parent.present? && !parent.pending?
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
