class ApplicationController < ActionController::Base
  
  protect_from_forgery
  
  require 'youtube_it'
  
  private
     
     # def auth_soundcloud
       # @client = Soundcloud.new(:client_id => "72325d0b84c6a7f4bbef4dd86c0a5309", :client_secret => "9e8d9f3e3559588aaf724007c69172ab" )
     # end
     
     def auth_youtube
      @client = YouTubeIt::Client.new(:dev_key => "AI39si5Vm80KPZDO6bjiL_luaCHqI0x1pXacRYATL77TcoMoH6VOr7bijEc4sJ3RZPSBeskaEK_NFH7wNeMyqY0jY_y9WYxM7g")
     end
end
