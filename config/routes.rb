Rails.application.routes.draw do
  resources :tasks, only: [:index, :show, :destroy]
  resources :checkpoints, only: [:index, :show]
  devise_for :users

  namespace :api do
    resources :checkpoints, only: [:create, :index, :show]
    resources :tasks, only: [:index, :show, :create, :update, :destroy] do
      member do
        post :complete
      end
    end
  end
end
