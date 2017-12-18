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

  test "Grand tasks are marked as archived when their parent is archived" do
    task = create(:task, user: @user)

    child = create(:task, user: @user, parent: task)
    grand = create(:task, user: @user, parent: child)

    child.complete!

    assert child.reload.completed?
    assert grand.reload.completed?

    Checkpoint.create_checkpoint!(@user)

    assert task.reload.pending?
    assert child.reload.archived?
    assert grand.reload.archived?
  end

  # With parent_task_id
  test "Checkpoint can be scoped by parent_task_id" do
    task = create(:task, user: @user)

    child = create(:task, user: @user, parent: task)
    grand = create(:task, user: @user, parent: child)
    great_grand = create(:task, user: @user, parent: grand)

    other_child = create(:task, user: @user, parent: task)
    other_grand = create(:task, user: @user, parent: other_child)

    child.complete!

    assert task.reload.pending?
    assert child.reload.completed?
    assert grand.reload.completed?
    assert great_grand.reload.completed?
    assert other_child.reload.pending?
    assert other_grand.reload.pending?

    checkpoint = Checkpoint.create_checkpoint!(@user, child.id)

    assert task.reload.pending?
    assert child.reload.completed?
    assert grand.reload.archived?
    assert great_grand.reload.archived?
    assert other_child.reload.pending?
    assert other_grand.reload.pending?

    assert_equal 4, checkpoint.tasks.count

    checkpoint_task = checkpoint.tasks.top_level.first
    checkpoint_child = checkpoint_task.children.first
    checkpoint_grand = checkpoint_child.children.first
    checkpoint_great_grand = checkpoint_grand.children.first

    assert checkpoint_task.pending?
    assert checkpoint_child.completed?
    assert checkpoint_grand.completed?
    assert checkpoint_great_grand.completed?
  end

  test "when parent_task_id does not belong to the user" do
    other_user = create(:user)

    task = create(:task, user: @user)
    child = create(:task, user: @user, parent: task)
    grand = create(:task, user: @user, parent: child)

    child.complete!

    assert_raises ActiveRecord::RecordInvalid do
      Checkpoint.create_checkpoint!(other_user, child.id)
    end
  end

end
