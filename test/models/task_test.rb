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

end
