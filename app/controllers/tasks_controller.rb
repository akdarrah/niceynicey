class TasksController < ApplicationController
  before_action :authenticate_user!

  def index
    @tasks = current_user.tasks.top_level.position_order
    @tasks = ActiveModel::SerializableResource.new(@tasks.to_a).to_json
  end

end
