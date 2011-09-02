class PageController < ApplicationController
  
  def index
    @page = Page.find(:first, :conditions => { "title_url" => params[:page] } )
  end
  
  def new
    @page = Page.new
  end
  
  def create
    @page = Page.new(params[:page], :user_id => current_user.id)
    if @page.save
      flash[:notice] = "Successfully Created Page \"#{@page.title_url}\""
      redirect_to("/#{@page.title_url}")
    else
      render('new')
    end
  end
  
  def save
    
  end
  
  def destroy

  end
  
end
