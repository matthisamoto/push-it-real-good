class TestController < ApplicationController
  
  before_filter :auth_soundcloud
  
  def show
    @track = @client.get('/resolve', :url => "http://soundcloud.com/festapush/ringtone-push-salt-n-pepa")
  end
  
  def search
    @tracks = @client.get('/tracks', :limit => "10", :q => params[:terms])
    @keyword = params[:terms]
  end

end