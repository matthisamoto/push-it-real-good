class AdminController < ApplicationController
  
  def index
    
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
  
  
  
end
