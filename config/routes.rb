PushItRealGood::Application.routes.draw do
  resources :test
  root :to => 'test#show'
  match 'search(/:terms(.:format))' => 'test#search'
  match ':controller(/:action(/:terms(.:format)))'
end
