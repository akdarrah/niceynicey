Rails.application.routes.draw do
  root to: 'tasks#index'

  resources :tasks, only: [:index, :show, :destroy]
  resources :checkpoints, only: [:index, :show]
  devise_for :users

  namespace :api do
    resources :checkpoints, only: [:create, :index, :show]
    resources :tasks, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get :analytics
      end
      member do
        get :analytics
        post :complete
      end
    end
  end
end
