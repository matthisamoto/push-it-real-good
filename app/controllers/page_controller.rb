class PageController < ApplicationController
  
  def index
    @page = Page.find(:first, :conditions => { "title_url" => params[:page] } )
  end
  
  def show
    @page = Page.find(:first, :conditions => { "title_url" => params[:id] } )
    render :layout => 'page'
  end
  
  def user
    user = User.find(:first, :conditions => { "username" => params[:user] })
    @pages = Page.where(:user_id => user.id)
    render :layout => 'application'
  end
  
  def new
    @page = Page.new
    render :layout => 'application'
  end
  
  def create
    @page = Page.new(params[:page])
    @page.user_id = current_user.id
    if @page.save
      flash[:notice] = "Successfully Created Page \"#{@page.title_url}\""
      redirect_to("/page/#{@page.title_url}")
    else
      render('new')
    end
  end
  
  def save
    
  end
  
  def destroy

  end
  
  def about
    render :layout => 'application'
  end
  
  def legal 
    render :layout => 'application'
  end
  
end
