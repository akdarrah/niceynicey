Rails.application.routes.draw do
  root to: 'marketing#index'

  get '/checkpoints', to: redirect('/archives')
  get '/checkpoints/:id', to: redirect('/archives/%{id}')

  resources :marketing, only: [:index]
  resources :tasks, only: [:index, :show, :destroy]
  resources :checkpoints, :path => :archives, only: [:index, :show]
  devise_for :users

  namespace :api do
    resources :checkpoints, only: [:create, :index, :show] do
      resources :tasks, only: [:index]
    end
    resources :tasks, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get :analytics
      end
      member do
        get :analytics
        post :complete
        post :reopen
      end
    end
  end
end
