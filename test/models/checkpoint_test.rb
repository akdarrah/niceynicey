require 'test_helper'

class CheckpointTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
  end

  # Checkpoint#create_checkpoint!

  test "pending tasks are NOT saved in a checkpoint" do
    task = create(:task, user: @user)
    assert task.pending?

    assert_raises ActiveRecord::RecordInvalid do
      Checkpoint.create_checkpoint!(@user)
    end
  end

  test "completed tasks ARE saved in a checkpoint" do
    task = create(:task, user: @user)
    task.complete!
    assert task.completed?

    checkpoint = Checkpoint.create_checkpoint!(@user)
    assert_equal 1, checkpoint.tasks.count

    assert task.reload.archived?
  end

  test "pending tasks with completed children ARE saved in a checkpoint" do
    task = create(:task, user: @user)
    assert task.pending?

    child = create(:task, user: @user, parent: task)
    child.complete!
    assert child.completed?

    checkpoint = Checkpoint.create_checkpoint!(@user)
    assert_equal 2, checkpoint.tasks.count

    checkpoint_task = checkpoint.tasks.first
    refute_equal task, checkpoint_task
    assert_equal checkpoint, checkpoint_task.checkpoint

    assert_equal 1, checkpoint_task.children.count
    checkpoint_child =  checkpoint_task.children.first
    assert_equal checkpoint, checkpoint_child.checkpoint

    assert task.reload.pending?
    assert child.reload.archived?
  end

  test "tasks with a checkpoint_id are NOT saved in a new checkpoint" do
    task = create(:task, user: @user, checkpoint_id: 5)
    task.complete!
    assert task.completed?

    assert_raises ActiveRecord::RecordInvalid do
      checkpoint = Checkpoint.create_checkpoint!(@user)
    end
  end

end
