class Api::CheckpointsController < ApplicationController
  before_action :authenticate_user!

  def show
    @checkpoint = current_user.checkpoints.find(params[:id])
    render json: @checkpoint, status: :ok
  end

  def create
    @checkpoint = Checkpoint.create_checkpoint!(current_user)
    render json: @checkpoint, status: :ok
  end

end
