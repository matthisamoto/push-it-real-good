class AdminController < ApplicationController
  
  before_filter :authenticate_user!, :admin?
  
  def index
    redirect_to '/users/sign_in'
  end
  
  def buttons 
    @styles = Style.find(:all)
    @buttons = Button.find(:all)
  end
  
  def new_button
    @style = Style.new
    @button = Button.new
  end
  
  def save_button
    @button = Button.new(params[:button])
    @button.save
    redirect_to("/admin/buttons")
  end
  
  def delete_button
    @button = Button.new(params[:button])
  end
  
  def destroy_button
    @button = Button.new(params[:button])
    @button.save
    redirect_to("/admin/buttons")
  end
  
  private
    def admin?
      if user_signed_in?
        if !current_user.admin?
          flash[:notice] = 'You do not have access to this section.'
          redirect_to('/users/sign_in')
        end
      end
    end
  
end
