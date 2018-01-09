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

  test "tasks is NOT extended when completed" do
    @task.update_column :extended, true
    @task.complete!

    assert @task.completed?
    refute @task.extended?
  end

  test "a completed task can NOT be completed" do
    @task.complete!
    assert @task.completed?

    assert_raises AASM::InvalidTransition do
      @task.complete!
    end
  end

  test "a pending task can NOT be archived" do
    assert @task.pending?

    assert_raises AASM::InvalidTransition do
      @task.archive!
    end
  end

  test "a completed task CAN be archived" do
    @task.complete!
    assert @task.completed?

    assert @task.archive!
    assert @task.archived?
  end

  test "a pending task cannot be reopened" do
    assert @task.pending?

    assert_raises AASM::InvalidTransition do
      @task.reopen!
    end
  end

  test "a completed task CAN be reopened" do
    assert @task.completed_at.blank?

    @task.complete!

    assert @task.reload.completed?
    assert @task.reload.completed_at.present?

    @task.reopen!
    assert @task.reload.pending?
    assert @task.reload.completed_at.blank?
  end

  test "tasks are extended when reopened" do
    @task.update_column :extended, false

    @task.complete!
    @task.reopen!

    assert @task.reload.extended?
  end

  test "a completed task cannot be reopened if the parent is completed" do
    child = create(:task, parent: @task)

    @task.complete!

    assert @task.reload.completed?
    assert child.reload.completed?

    refute child.reopen!
    assert child.reload.completed?
  end

  test "an archived task cannot be reopened" do
    @task.complete!
    @task.archive!
    assert @task.reload.archived?

    assert_raises AASM::InvalidTransition do
      @task.reopen!
    end
  end

  # Children

  test "a task completes its children when completed" do
    child = create(:task, parent: @task)

    assert @task.completed_at.blank?
    assert child.completed_at.blank?

    assert @task.pending?
    assert child.pending?

    assert @task.complete!

    assert @task.reload.completed?
    assert child.reload.completed?

    assert @task.reload.completed_at.present?
    assert child.reload.completed_at.present?
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

  test "a task archives it's children when it is archived" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert @task.pending?
    assert @task.complete!

    assert @task.archived_at.blank?
    assert child.archived_at.blank?
    assert grand.archived_at.blank?

    assert @task.reload.completed?
    assert child.reload.completed?
    assert grand.reload.completed?

    assert @task.archive!

    assert @task.reload.archived?
    assert child.reload.archived?
    assert grand.reload.archived?

    assert @task.archived_at.present?
    assert child.archived_at.present?
    assert grand.archived_at.present?
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

  test "parent does not have to be pending if checkpoint is present" do
    @task.complete!
    assert @task.completed?

    child = @task.children.build(user: @task.user, label: "Test")
    refute child.valid?

    @task.children.clear

    @checkpoint = build(:checkpoint)
    child = @task.children.build(user: @task.user, label: "Test", checkpoint: @checkpoint)
    assert child.valid?
  end

  test "A task cannot be moved under a completed parent" do
    @task.complete!
    assert @task.completed?

    child = create(:task)
    assert child.valid?

    child.parent_id = @task.id
    refute child.valid?
  end

  test "An archived task is allowed to be under an archived parent" do
    child = create(:task, parent: @task)

    @task.complete!

    assert @task.reload.completed?
    assert child.reload.completed?

    @task.archive!

    assert @task.reload.archived?
    assert child.reload.archived?
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

  test "block can be passed to determine to keep task or not" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)
    pending_sibling = create(:task, parent: @task)

    child.reload.complete!

    assert @task.pending?
    assert child.completed?
    assert grand.reload.completed?
    assert pending_sibling.pending?

    duplicate = @task.dup_with_children do |task|
      task.completed_or_has_completed_child?
    end

    assert_equal 2, @task.children.length
    assert_equal 1, duplicate.children.length

    assert duplicate.children.all?(&:completed?)
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

  # Task#traverse

  test "traverses through structure calling block" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    Task.any_instance.expects(:testing).times(3)

    @task.traverse do |task|
      task.testing
    end
  end

  # Task Colors

  test "A new project level task is automatically given a color" do
    user = create(:user)
    color = "#001f3f"

    Task.stub_const(:COLORS, ["#001f3f"]) do
      task = Task.create!(label: "Project", user: user)
      assert_equal color, task.color_hex
    end
  end

  test "A new child sub-task is given a color darker than it's parent" do
    user = create(:user)
    color = @task.child_color_hex

    child = Task.create!(label: "Project", user: user, parent: @task)
    assert_equal color, child.color_hex
  end

  test "color_hex changes are propagated to tasks children" do
    new_task_color = "#001f3f"
    new_child_color = "#001225"
    new_grand_color = "#00060b"

    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert_not_equal new_task_color, @task.color_hex

    @task.color_hex = new_task_color
    @task.save!

    assert_equal new_task_color, @task.reload.color_hex
    assert_equal new_child_color, child.reload.color_hex
    assert_equal new_grand_color, grand.reload.color_hex
  end

  test "when parent changes and task is now a project" do
    new_task_color = "#001f3f"
    new_child_color = "#001225"

    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert_not_equal new_task_color, child.color_hex
    assert_not_equal new_child_color, grand.color_hex

    Task.stub_const(:COLORS, [new_task_color]) do
      child.parent = nil
      child.save!
    end

    assert_equal new_task_color, child.reload.color_hex
    assert_equal new_child_color, grand.reload.color_hex
  end

  test "when parent changes and task is now nested under a new parent" do
    new_task_color = "#001f3f"
    new_child_color = "#001225"
    new_grand_color = "#00060b"

    @task.update_column :color_hex, new_task_color

    child = create(:task)
    grand = create(:task, parent: child)

    assert_not_equal new_child_color, child.color_hex
    assert_not_equal new_grand_color, grand.color_hex

    child.parent = @task
    child.save!

    assert_equal new_child_color, child.reload.color_hex
    assert_equal new_grand_color, grand.reload.color_hex
  end

  # Task#ancestors

  test "a project-level task has no ancestors" do
    assert_nil @task.parent
    assert_equal [], @task.ancestors
  end

  test "a task with a project-level parent returns the parent" do
    child = create(:task, parent: @task)
    assert_equal [@task], child.ancestors
  end

  test "a task that is deeply nested returns tasks up-to project level" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert_equal [child.id, @task.id].sort, grand.ancestors.map(&:id).sort
  end

  # Task#descendants

  test "a task with no children has no descendants" do
    assert @task.children.blank?
    assert_equal [], @task.descendants
  end

  test "a task with children has descendants" do
    child = create(:task, parent: @task)
    assert_equal [child], @task.descendants
  end

  test "children tasks of a child task are included" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert_equal [child, grand], @task.descendants
  end

  # Task#lineage

  test "returns ancestors, self, and descendants" do
    child = create(:task, parent: @task)
    grand = create(:task, parent: child)

    assert_equal [@task, child, grand], child.lineage
  end

  # Task#task_ids_completed_in_last_year_grouped_by_day

  test "returns nothing when there are no completed tasks" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    assert Task.task_ids_completed_in_last_year_grouped_by_day(@user.id).empty?
  end

  test "returns data when sub-task is completed" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    child.complete!

    assert @task.pending?
    assert child.completed?

    total_count = Task.task_ids_completed_in_last_year_grouped_by_day(@user.id).values.sum
    assert_equal 1, total_count
  end

  test "Only returns tasks completed in last year" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    child.complete!
    child.update_column :completed_at, 2.year.ago

    assert @task.pending?
    assert child.completed?

    assert Task.task_ids_completed_in_last_year_grouped_by_day(@user.id).empty?
  end

  test "returns data when project is completed" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    @task.complete!

    assert @task.reload.completed?
    assert child.reload.completed?

    total_count = Task.task_ids_completed_in_last_year_grouped_by_day(@user.id).values.sum
    assert_equal 2, total_count
  end

  test "Given a parent_task_id, returns nothing when there are no completed sub-tasks" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    assert Task.task_ids_completed_in_last_year_grouped_by_day(@user.id, @task.id).empty?
  end

  test "Given a parent_task_id, returns data when there are are completed sub-tasks" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    child.complete!

    assert @task.reload.pending?
    assert child.reload.completed?

    total_count = Task.task_ids_completed_in_last_year_grouped_by_day(@user.id, @task.id).values.sum
    assert_equal 1, total_count
  end

  test "Given a parent_task_id, Only returns data when there are are completed sub-tasks in the last year" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    child.complete!
    child.update_column :completed_at, 2.year.ago

    assert @task.reload.pending?
    assert child.reload.completed?

    assert Task.task_ids_completed_in_last_year_grouped_by_day(@user.id, @task.id).empty?
  end

  test "Given a parent_task_id, returns correct data when parent_task_id is completed" do
    @user = create(:user)

    @task.update_column :user_id, @user.id
    child = create(:task, parent: @task, user: @user)

    @task.complete!

    assert @task.reload.completed?
    assert child.reload.completed?

    total_count = Task.task_ids_completed_in_last_year_grouped_by_day(@user.id, @task.id).values.sum
    assert_equal 2, total_count
  end

end
