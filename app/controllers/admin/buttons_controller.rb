class Admin::ButtonsController < ApplicationController
  
  before_filter :authenticate_user!, :admin?
  layout "admin"
  
  def index 
    @styles = Style.find(:all)
    @buttons = Button.find(:all)
  end
  
  def new
    @style = Style.new
    @button = Button.new
    @options = Style.all.collect {|p| [ p.name, p.name ] }
    @options << ["Add New","new"]
  end
  
  def create
    @style = Style.find(:first, :conditions => {:name => params[:button][:style_name]})
    if !@style
      @style = Style.new()
      @style.name = params[:button][:style_name]
      @style.save
    end
    stylename = params[:button][:style_name]
    color = params[:button][:color]
    @button = Button.new(params[:button])
    @button.filename = "#{stylename.downcase}_#{color.downcase}"
    @button.save
    redirect_to(admin_buttons_path)
  end
  
  def destroy
    button = Button.find(params[:id])
    stylename = button.style_name
    button.destroy
    style = Style.find(:first, :conditions => {:name => stylename})
    style.destroy unless Button.find(:first, :conditions => {:style_name => stylename})
    redirect_to(admin_buttons_path)
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
