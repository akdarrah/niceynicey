class Task < ApplicationRecord
  attr_accessor :copied_from

  include AASM

  COLORS = [
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

  has_many :task_copies_as_original, foreign_key: :original_task_id, class_name: "TaskCopy"
  has_many :task_copies, through: :task_copies_as_original, source: :copied_task

  has_one :task_copies_as_copied, foreign_key: :copied_task_id, class_name: "TaskCopy"
  has_one :copied_from_task, through: :task_copies_as_copied, source: :original_task

  validates :user, :label, :color_hex, presence: true
  validate :parent_must_be_pending
  validate :zero_points_unless_archived_original
  validates :color_hex, color: true

  before_validation :set_color_hex_on_create, on: :create
  before_validation :set_color_hex_on_update, on: :update
  after_save :propagated_color_hex_changes_to_children

  has_many :children,
    -> { order(position: :asc) },
    class_name: "Task",
    foreign_key: :parent_id,
    dependent: :destroy

  acts_as_list scope: [:user_id, :parent_id, :checkpoint_id, state: [:pending, :completed]]

  scope :top_level, -> { where(parent_id: nil) }
  scope :position_order, -> { order(position: :asc) }
  scope :no_checkpoint, -> { where(checkpoint_id: nil) }
  scope :pending, -> { where(state: :pending) }
  scope :completed, -> { where(state: :completed) }
  scope :archived, -> { where(state: :archived) }
  scope :unarchived, -> { where.not(state: :archived) }

  def self.recursive_query(direction, user_id, parent_task_id=nil)
    base_condition = if parent_task_id.present?
        "(tasks.id = #{parent_task_id})"
      else
        "(tasks.parent_id IS NULL)"
      end

    join_condition = case direction
      when :descendant
        "(a.parent_id = b.id)"
      when :ancestor
        "(a.id = b.parent_id)"
      else
        raise "Direction not supported"
      end

    post_condition = if parent_task_id.present?
        "(children.id != #{parent_task_id.to_i})"
      else
        "(children.parent_id IS NOT NULL)"
      end

    query = <<-SQL
      WITH RECURSIVE children AS (
        SELECT id, parent_id
        FROM tasks
        WHERE (tasks.user_id = #{user_id})
          AND #{base_condition}
        UNION
          SELECT a.id, a.parent_id
          FROM tasks a
          JOIN children b ON #{join_condition}
      ) SELECT *
          FROM children
          WHERE #{post_condition};
    SQL

    ActiveRecord::Base.connection.execute(query).map{|r| r['id'].to_i}
  end

  def self.descendant_ids(user_id, parent_task_id=nil)
    Task.recursive_query(:descendant, user_id, parent_task_id)
  end

  def self.ancestor_ids(user_id, parent_task_id=nil)
    Task.recursive_query(:ancestor, user_id, parent_task_id)
  end

  def self.task_ids_completed_in_last_year_grouped_by_day(user_id, parent_task_id=nil)
    descendant_ids = Task.descendant_ids(user_id, parent_task_id)

    non_descendant_ids = if parent_task_id.present?
      Array(parent_task_id)
    else
      User.find(user_id).projects.pluck(:id)
    end

    task_ids = Task.where(id: (descendant_ids + non_descendant_ids))
      .no_checkpoint
      .where(["completed_at >= ?", 1.year.ago])
      .pluck(:id)

    return {} if task_ids.blank?

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

    event :reopen do
      transitions :from => :completed, :to => :pending

      before do
        before_reopen!
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
    Task.where(id: Task.ancestor_ids(user_id, self.id))
  end

  def descendants
    Task.where(id: Task.descendant_ids(user_id, self.id))
  end

  def lineage
    (ancestors + Array(self) + descendants)
  end

  def dup_with_children(&block)
    criteria_passed = (block_given? ? yield(self) : true)

    if criteria_passed
      duplicate = dup
      duplicate.copied_from = self

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
    self.extended = false
    self.completed_at = Time.now
  end

  def after_complete!
    children.pending.each(&:complete!)
  end

  def before_reopen!
    self.extended = true
    self.completed_at = nil
  end

  def before_archive!
    self.archived_at = Time.now
    self.points = calculate_points
  end

  def after_archive!
    children.completed.each(&:archive!)
  end

  def parent_must_be_pending
    if pending? && checkpoint.blank? && parent.present? && !parent.pending?
      errors.add(:parent, "must be pending")
    end
  end

  def zero_points_unless_archived_original
    if points.nonzero? && (!archived? || checkpoint.present?)
      errors.add(:points, "must be zero")
    end
  end

  def calculate_points
    PointCalculator.new(user, self).calculate
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
