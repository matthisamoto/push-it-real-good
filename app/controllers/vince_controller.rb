class VinceController < ApplicationController
  
  before_filter :auth_soundcloud;
  
  def index 
    # @user = @client.get('/users', :username => 'Ben Eckerson' )
    @playlist = @client.get('/playlists', :limit => 1, :user_id => '7129367' ).first.tracks
    @track = @playlist.sample
    
  end
  
end
