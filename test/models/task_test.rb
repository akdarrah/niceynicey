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

end
