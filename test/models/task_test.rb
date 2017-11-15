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

end
