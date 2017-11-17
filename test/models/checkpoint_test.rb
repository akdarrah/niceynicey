require 'test_helper'

class CheckpointTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
  end

  # Checkpoint#new_checkpoint

  test "pending tasks are NOT saved in a checkpoint" do
    task = create(:task, user: @user)
    assert task.pending?

    checkpoint = Checkpoint.new_checkpoint(@user)
    assert_equal 0, checkpoint.tasks.length
    refute checkpoint.valid?
  end

  test "completed tasks ARE saved in a checkpoint" do
    task = create(:task, user: @user)
    task.complete!
    assert task.completed?

    checkpoint = Checkpoint.new_checkpoint(@user)
    assert_equal 1, checkpoint.tasks.length
    assert checkpoint.valid?
  end

  test "pending tasks with completed children ARE saved in a checkpoint" do
    task = create(:task, user: @user)
    assert task.pending?

    child = create(:task, user: @user, parent: task)
    child.complete!
    assert child.completed?

    checkpoint = Checkpoint.new_checkpoint(@user)
    assert checkpoint.valid?
    assert checkpoint.save!

    assert_equal 2, checkpoint.tasks.count

    checkpoint_task = checkpoint.tasks.first
    refute_equal task, checkpoint_task
    assert_equal checkpoint, checkpoint_task.checkpoint

    assert_equal 1, checkpoint_task.children.count
    checkpoint_child =  checkpoint_task.children.first
    assert_equal checkpoint, checkpoint_child.checkpoint
  end

  test "tasks with a checkpoint_id are NOT saved in a new checkpoint" do
    assert_equal 0, @user.tasks.count

    task = create(:task, user: @user)
    task.complete!
    assert task.completed?

    checkpoint = Checkpoint.new_checkpoint(@user)
    assert checkpoint.valid?
    assert checkpoint.save!
    assert_equal 1, checkpoint.tasks.count

    assert_equal 2, @user.tasks.count

    checkpoint = Checkpoint.new_checkpoint(@user)
    assert checkpoint.valid?
    assert checkpoint.save!
    assert_equal 1, checkpoint.tasks.count

    assert_equal 3, @user.tasks.count
  end

end
