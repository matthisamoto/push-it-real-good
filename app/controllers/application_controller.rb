class ApplicationController < ActionController::Base
  protect_from_forgery
  
  private
       def auth_soundcloud
       @client = Soundcloud.new(:client_id => "72325d0b84c6a7f4bbef4dd86c0a5309", :client_secret => "9e8d9f3e3559588aaf724007c69172ab" )
     end
end
