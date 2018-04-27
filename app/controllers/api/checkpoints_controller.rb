class Api::CheckpointsController < ApplicationController
  before_action :authenticate_user!

  def show
    @checkpoint = current_user.checkpoints.find(params[:id])
    render json: @checkpoint, status: :ok
  end

  def index
    @checkpoints = current_user.checkpoints.order("created_at desc")
    render json: @checkpoints, status: :ok
  end

end
