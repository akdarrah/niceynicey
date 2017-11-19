class Api::TasksController < ApplicationController
  before_action :authenticate_user!

  def create
    @checkpoint = Checkpoint.create_checkpoint!(current_user)
    render json: @checkpoint, status: :ok
  end

end
