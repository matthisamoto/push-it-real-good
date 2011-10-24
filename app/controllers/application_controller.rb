class ApplicationController < ActionController::Base
  
  protect_from_forgery
  
  def get_count
    @count = Page.count
  end
  
  def admin?
    if user_signed_in?
      if !current_user.admin?
        flash[:notice] = 'You do not have access to this section.'
        redirect_to('/users/sign_in')
      end
    end
  end
  
  private
     
     def auth_soundcloud
       @client = Soundcloud.new(:client_id => "72325d0b84c6a7f4bbef4dd86c0a5309", :client_secret => "9e8d9f3e3559588aaf724007c69172ab" )
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
