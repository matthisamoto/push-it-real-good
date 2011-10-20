PushItRealGood::Application.routes.draw do

  # root :to => 'index#index'
  root :to => 'comingsoon#comingsoon'
  
  match 'temp' => 'index#index'
  match 'user/:user' => 'page#user'
    
  resources :page
  
  devise_for :users#, :controllers => {:sessions => 'sessions'}
  
  match 'wtf' => 'page#about'
  match 'legal' => 'page#legal'
  
  match 'search' => 'utility#search'
  match 'retrieve_colors' => 'utility#get_buttons'
  
  match 'goodbyevincent' => 'vince#index'
  
  namespace :admin do
    resources :buttons
  end
  
end
