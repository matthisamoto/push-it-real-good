class TestController < ApplicationController
  
  before_filter :auth_youtube
  
  def show
    # @track = @client.get('/resolve', :url => "http://soundcloud.com/festapush/ringtone-push-salt-n-pepa")
   @tracks = @client.videos_by(:query => "push it", :per_page => 1, :no_embed => false).videos
  end
  
  def search
    # @tracks = @client.get('/tracks', :limit => "10", :q => params[:terms])
    # @keyword = params[:terms]
    
    @tracks = @client.videos_by(:query => params[:terms], :per_page => 10, :no_embed => false).videos
    
  end
    
end