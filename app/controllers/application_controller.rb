class ApplicationController < ActionController::Base
  
  protect_from_forgery
  
  def get_count
    @count = Page.count
  end
  
  private
     
     def auth_soundcloud
       @client = Soundcloud.new(:client_id => "8415d419022eb58d9e2b49997ad6b1ba", :client_secret => "3f46e6df2aaea3c8da43e995dd1aaf70" )
     end
     
      def after_sign_in_path_for(resource)
        root_path # <- Path you want to redirect the user to after signup
      end

      def after_sign_up_path_for(resource)
        root_path # <- Path you want to redirect the user to after signup
      end

  layout :layout_by_resource

  protected

  def layout_by_resource
    if devise_controller?
      "registration"
    else
      "application"
    end
  end
  
end