set :application, "pushitrealgood"
set :repository,  "git@github.com:matthisamoto/push-it-real-good.git"

set :default_environment, {
  'PATH' => "/home/matt/.rvm/rubies/ruby-1.9.2-p180/bin:/home/matt/.rvm/gems/ruby-1.9.2-p180/bin:$PATH",
  'RUBY_VERSION' => 'ruby 1.9.2',
  'GEM_HOME'     => '/home/matt/.rvm/gems/ruby-1.9.2-p180/',
  'GEM_PATH'     => '/home/matt/.rvm/gems/ruby-1.9.2-p180/',
  'BUNDLE_PATH'  => '/home/matt/.rvm/gems/ruby-1.9.2-p180/'
}

set :scm, :git
set :branch, 'master'
set :user, 'matt'

set :use_sudo, false
set :deploy_to, "/home/matt/sites/pushitstage"
set :deploy_via, :copy
set :copy_remote_dir, "/home/matt/sites/pushitstage/tmp"
set :copy_exclude, [".git"]

role :web, 'matthisamoto.com/pushitstage'                          # Your HTTP server, Apache/etc
role :app, 'matthisamoto.com/pushitstage'                          # This may be the same as your `Web` server
role :db,  'matthisamoto.com/pushitstage', :primary => true # This is where Rails migrations will run


namespace :deploy do
  task :start do ; end
  task :stop do ; end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
  end
end