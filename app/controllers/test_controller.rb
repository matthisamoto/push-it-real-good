class TestController < ApplicationController
  
  before_filter :auth_youtube
  
  def show
    # @track = @client.get('/resolve', :url => "http://soundcloud.com/festapush/ringtone-push-salt-n-pepa")
    @tracklist = @client.videos_by(:query => "push it", :per_page => 10)
  end
  
  def search
    # @tracks = @client.get('/tracks', :limit => "10", :q => params[:terms])
    # @keyword = params[:terms]
  end
    
end