class VinceController < ApplicationController
  
  before_filter :auth_soundcloud;
  layout 'vince'
  
  def index 
    @playlist = @client.get('/playlists', :limit => 1, :user_id => '7129367' ).first.tracks
    @track = @playlist.sample
    
  end
  
end
