class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :find_quote

  def index
  end

  def show
  end

  def destroy
    @task = current_user.tasks.find(params[:id])
    @task.destroy

    redirect_to tasks_path
  end

  private

  def find_quote
    gon.quote = Quote.order('random()').first
  end

end
