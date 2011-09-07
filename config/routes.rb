PushItRealGood::Application.routes.draw do

  root :to => 'test#show'
    
  match 'user/:user' => 'page#user'
    
  resources :page
  
  devise_for :users
  
  match 'wtf' => 'page#about'
  match 'legal' => 'page#legal'
  
  match 'search(/:terms(.:format))' => 'test#search'
  match 'retrieve_colors' => 'page#get_buttons'
  
  namespace :admin do
    resources :buttons
  end
  
end
