class PageController < ApplicationController
  
  before_filter :get_count
  
  def show
    @page = Page.find(:first, :conditions => { "title_url" => params[:id] } )
    @user = User.find(:first, :conditions => { :id => @page.user_id })
    render :layout => 'page'
  end
  
  def user
    @user = User.find(:first, :conditions => { "username" => params[:user] })
    if @user
      @pages = Page.where(:user_id => @user.id)
      render :layout => 'application'
    else
      render :text => "No Such User, '#{params[:user]}'"
    end
  end
  
  def tally
    page = Page.find(:first, :conditions => { "title_url" => params[:id] } )
    unless page.increment!(:pushes)
      render :text => "Failed to tally push."
    end
    render :text => "Success."
  end
  
  def new
    #if user_signed_in?
      @page = Page.new
      @options = Style.all.collect {|p| [ p.name, p.name ] }
      render :layout => 'application'
    #else
     # redirect_to('/users/sign_in')
    #end
  end
  
  def create
    # if user_signed_in?
      @page = Page.new(params[:page])
      # @page.user_id = current_user.id
      if @page.save
        flash[:notice] = "Successfully Created Page \"#{@page.title_url}\""
        redirect_to "/page/#{@page.title_url}"
      else
        render('new')
      end
   # else
   #  redirect_to('/users/sign_in')
   # end
  end
  
  def edit
    @page = Page.new(params[:page])
    @page.user_id = current_user.id
    if @page.update
      flash[:notice] = "Successfully Created Page \"#{@page.title_url}\""
      redirect_to "/page/#{@page.title_url}"
    else
      render('new')
    end
  end
  
  def save
    
  end
  
  def destroy
    @page = Page.find(params[:id]).destroy
    flash[:notice] = "Successfully Deleted Page."
    user = "/user/#{current_user.username}"
    redirect_to user
  end
  
  def about
    render :layout => 'application'
  end
  
  def legal 
    render :layout => 'application'
  end
  
end
