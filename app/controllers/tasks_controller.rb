class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
  end

  def show
  end

  def destroy
    @task = current_user.tasks.find(params[:id])
    @task.destroy

    redirect_to tasks_path
  end

end
