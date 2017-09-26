require "test_helper"

describe TasksController do
  let(:task) { tasks :one }

  it "gets index" do
    get tasks_url
    value(response).must_be :success?
  end

  it "gets new" do
    get new_task_url
    value(response).must_be :success?
  end

  it "creates task" do
    expect {
      post tasks_url, params: { task: { label: task.label, parent_id: task.parent_id, state: task.state } }
    }.must_change "Task.count"

    must_redirect_to task_path(Task.last)
  end

  it "shows task" do
    get task_url(task)
    value(response).must_be :success?
  end

  it "gets edit" do
    get edit_task_url(task)
    value(response).must_be :success?
  end

  it "updates task" do
    patch task_url(task), params: { task: { label: task.label, parent_id: task.parent_id, state: task.state } }
    must_redirect_to task_path(task)
  end

  it "destroys task" do
    expect {
      delete task_url(task)
    }.must_change "Task.count", -1

    must_redirect_to tasks_path
  end
end
