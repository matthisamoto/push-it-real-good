PushItRealGood::Application.routes.draw do

  #resources :test
  root :to => 'test#show'
  
  
  
  match 'user/:user' => 'page#user'
  
  
  resources :page
  
  devise_for :users
  
  match 'wtf' => 'page#about'
  match 'legal' => 'page#legal'
  
  # match 'search(/:terms(.:format))' => 'test#search'
  # match ':controller(/:action(/:terms(.:format)))'
end
