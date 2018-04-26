class UsersController < ApplicationController
  before_action :authenticate_user!

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    @user.attributes = user_params

    if @user.save
      redirect_to root_url
    else
      render action: :edit
    end
  end

  private

  def user_params
    params.require(:user)
      .permit(:email, :time_zone)
  end

end
