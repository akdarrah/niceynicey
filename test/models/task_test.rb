require 'test_helper'

class TaskTest < ActiveSupport::TestCase

  def setup
    @task = create(:task)
  end

  # State Machine

  test "initial state is pending" do
    assert @task.pending?
  end

  test "tasks can be completed" do
    @task.complete!
    assert @task.completed?
  end

  test "a completed task can NOT be completed" do
    @task.complete!
    assert @task.completed?

    assert_raises AASM::InvalidTransition do
      @task.complete!
    end
  end

  # Children

  test "a task completes its children when completed" do
    child = create(:task, parent: @task)

    assert @task.pending?
    assert child.pending?

    assert @task.complete!

    assert @task.reload.completed?
    assert child.reload.completed?
  end

  test "a completed child task is NOT completed again" do
    child = create(:task, state: :completed, parent: @task)

    assert @task.pending?
    assert child.completed?

    assert_nothing_raised AASM::InvalidTransition do
      assert @task.complete!
    end

    assert @task.reload.completed?
    assert child.reload.completed?
  end

  test "a task completes its grand-children when completed" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert @task.pending?
    assert child.pending?
    assert grand.pending?

    assert @task.complete!

    assert @task.reload.completed?
    assert child.reload.completed?
    assert grand.reload.completed?
  end

  # Task#parent_must_be_pending

  test "parent task must be pending to add a child task" do
    assert @task.pending?

    child = @task.children.build(user: @task.user, label: "Test")
    assert child.valid?

    @task.children.clear
    @task.complete!

    child = @task.children.build(user: @task.user, label: "Test")
    refute child.valid?
  end

  test "parent only has to be open on creation" do
    assert @task.pending?

    child = @task.children.build(user: @task.user, label: "Test")
    assert child.save!

    @task.complete!
    assert child.valid?
  end

  # Task#dup_with_children

  test "returns a dup of itself with duplicate children" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert @task.persisted?
    assert_equal 1, @task.children.count
    assert_equal child, @task.children.first

    assert child.persisted?
    assert_equal 1, child.children.count
    assert_equal grand, child.children.first

    assert grand.persisted?
    assert_equal 0, grand.children.count

    duplicate = @task.dup_with_children

    assert duplicate.new_record?
    assert_equal @task.label, duplicate.label
    assert_equal @task.parent_id, duplicate.parent_id
    assert_equal @task.user_id, duplicate.user_id
    assert_equal @task.state, duplicate.state
    assert_equal @task.position, duplicate.position
    assert_equal @task.notes, duplicate.notes
    assert_equal @task.color_hex, duplicate.color_hex

    assert_equal 1, duplicate.children.length
    duplicate_child = duplicate.children.first

    assert duplicate_child.new_record?
    assert_equal child.label, duplicate_child.label
    assert_equal child.parent_id, duplicate_child.parent_id
    assert_equal child.user_id, duplicate_child.user_id
    assert_equal child.state, duplicate_child.state
    assert_equal child.position, duplicate_child.position
    assert_equal child.notes, duplicate_child.notes
    assert_equal child.color_hex, duplicate_child.color_hex

    assert_equal 1, duplicate_child.children.length
    duplicate_grand = duplicate_child.children.first

    assert duplicate_grand.new_record?
    assert_equal grand.label, duplicate_grand.label
    assert_equal grand.parent_id, duplicate_grand.parent_id
    assert_equal grand.user_id, duplicate_grand.user_id
    assert_equal grand.state, duplicate_grand.state
    assert_equal grand.position, duplicate_grand.position
    assert_equal grand.notes, duplicate_grand.notes
    assert_equal grand.color_hex, duplicate_grand.color_hex

    assert_equal 0, duplicate_grand.children.length
  end

  # Task#completed_or_has_completed_child?

  test "returns FALSE if task is NOT completed" do
    assert @task.pending?
    assert @task.children.blank?

    refute @task.completed_or_has_completed_child?
  end

  test "returns TRUE if task IS completed" do
    @task.complete!

    assert @task.completed?
    assert @task.children.blank?

    assert @task.completed_or_has_completed_child?
  end

  test "returns FALSE if child is NOT completed" do
    child = create(:task, parent: @task)

    assert @task.pending?
    assert child.pending?

    refute @task.completed_or_has_completed_child?
    refute child.completed_or_has_completed_child?
  end

  test "returns TRUE if child IS completed" do
    child = create(:task, parent: @task)
    child.complete!

    assert @task.pending?
    assert child.completed?

    assert @task.completed_or_has_completed_child?
    assert child.completed_or_has_completed_child?
  end

end
