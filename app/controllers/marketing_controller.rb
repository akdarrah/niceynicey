class MarketingController < ApplicationController
  before_action :redirect_signed_in_users

  layout "marketing"

  def index
  end

  private

  def redirect_signed_in_users
    if current_user.present?
      redirect_to tasks_url
    end
  end

end
