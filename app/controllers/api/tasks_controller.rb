class Api::TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :edit, :update, :destroy, :complete]

  def index
    @tasks = current_user.tasks
      .top_level
      .position_order
      .no_checkpoint
      .unarchived

    render json: @tasks, status: :ok
  end

  def show
    @task = current_user.tasks.find(params[:id])
    render json: @task, status: :ok
  end

  def create
    @task = current_user.tasks.new(task_params)

    if @task.save
      render json: @task, status: :created
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def update
    if @task.update(task_params)
      render json: @task, status: :ok
    else
      render json: @task.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @task.destroy
    render json: @task, status: :ok
  end

  def complete
    @task.complete!
    render json: @task, status: :ok
  end

  def analytics
    @task = current_user.tasks.find_by_id(params[:id])
    render json: Task.tasks_completed_in_last_year(current_user.id, @task.try(:id))
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task)
      .permit(:label, :parent_id, :state, :position, :notes, :color_hex)
  end

end
