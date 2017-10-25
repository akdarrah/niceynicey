class Api::TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [:show, :edit, :update, :destroy, :complete]

  def index
    @tasks = current_user.tasks
    render json: @tasks, status: :ok
  end

  def show
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

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:label, :parent_id, :state, :position)
  end

end
