PushItRealGood::Application.routes.draw do

  #resources :test
  root :to => 'test#show'
  
  resources :page
  
  match 'user/:user' => 'page#user'
  
  match ':page' => 'page#index'
  
  devise_for :users
  
  # match 'search(/:terms(.:format))' => 'test#search'
  # match ':controller(/:action(/:terms(.:format)))'
end
