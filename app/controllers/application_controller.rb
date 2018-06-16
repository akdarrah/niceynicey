class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  around_action :set_time_zone, if: :current_user

  def authenticate_admin_user!
    if current_user.blank? || !current_user.admin?
      redirect_to root_url
    end
  end

  def after_sign_in_path_for(resource)
    stored_location_for(resource) || tasks_path
  end

  private

  def set_time_zone(&block)
    Time.use_zone(current_user.time_zone, &block)
  end
end
