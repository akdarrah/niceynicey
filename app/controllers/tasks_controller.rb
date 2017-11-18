class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
    @tasks = current_user.tasks.top_level.position_order
    @tasks = ActiveModel::SerializableResource.new(@tasks.to_a).to_json
  end

  def show
  end

  def destroy
    @task = current_user.tasks.find(params[:id])
    @task.destroy

    redirect_to tasks_path
  end

end
