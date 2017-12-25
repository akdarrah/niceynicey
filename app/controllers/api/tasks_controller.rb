class Api::TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :edit, :update, :destroy, :complete]
  before_action :find_checkpoint, only: [:index]

  def index
    @tasks = if @checkpoint.present?
      @checkpoint.tasks
        .top_level
        .position_order
    else
      current_user.tasks
        .top_level
        .position_order
        .no_checkpoint
        .unarchived
    end

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
    render json: Task.task_ids_completed_in_last_year_grouped_by_day(current_user.id, @task.try(:id))
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task)
      .permit(:label, :parent_id, :state, :position, :notes, :color_hex)
  end

  def find_checkpoint
    @checkpoint = current_user.checkpoints.find_by_id(params[:checkpoint_id])
  end

end
