PushItRealGood::Application.routes.draw do

  root :to => 'index#index'
  
  match 'user/:user' => 'page#user'
    
  resources :page
  
  match 'tally' => 'page#tally'
  
  devise_for :users #, :controllers => {:sessions => 'sessions'}
  
  match 'test_url' => 'page#check_for_url'
  match 'gallery' => 'page#list'
  match 'about' => 'page#about'
  match 'legal' => 'page#legal'
  
  match 'search' => 'utility#search'
  match 'retrieve_colors' => 'utility#get_buttons'
  
  match 'goodbyevincent' => 'vince#index'
  
  match 'admin' => 'admin#index'
  
  namespace :admin do
    resources :buttons
  end
  
end
