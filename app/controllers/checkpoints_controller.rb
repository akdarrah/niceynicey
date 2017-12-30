class CheckpointsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_quote

  def show
  end

  def index
  end

  private

  def find_quote
    gon.quote = Quote.order('random()').first
  end

end
