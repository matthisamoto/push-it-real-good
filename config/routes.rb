PushItRealGood::Application.routes.draw do

  root :to => 'index#index'
    
  match 'user/:user' => 'page#user'
    
  resources :page
  
  devise_for :users
  
  match 'wtf' => 'page#about'
  match 'legal' => 'page#legal'
  
  match 'search' => 'utility#search'
  match 'retrieve_colors' => 'utility#get_buttons'
  
  namespace :admin do
    resources :buttons
  end
  
end
