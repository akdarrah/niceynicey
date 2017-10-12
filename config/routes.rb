Rails.application.routes.draw do
  resources :tasks, only: [:index]
  devise_for :users

  namespace :api do
    resources :tasks, only: [:index, :show, :create, :update, :destroy] do
      member do
        post :complete
      end
    end
  end
end
