class PageController < ApplicationController
  
  before_filter :get_count
  
  def connect
    render :partial => 'connect'
  end
  
  def list 
    @count = Page.count
    @latest = Page.find(:all, :limit => 25, :order => "pages.created_at DESC" )
    @greatest = Page.find(:all, :limit => 25, :order => "pages.pushes DESC" )
    render :layout => 'application'
  end
  
  def check_for_url
    result = "pass"
    if Page.exists?( :title_url => params[:title_url] )
      result = "fail"
    elsif params[:title_url] == "new"
      result = "fail"
    end
    render :json => { "result" => result }
  end
  
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
    @page = Page.new
    @options = Style.all.collect {|p| [ p.name.upcase, p.name.upcase ] }
    @action = params['action']
    render :layout => 'application'
  end
  
  def create
    if Page.exists?( :title_url => params[:page][:title_url] )
      render :text => "This url is unavailable and somehow slipped past our validation"
    else
      @page = Page.new(params[:page])
      if @page.save
        flash[:notice] = "Successfully Created Page \"#{@page.title_url}\""
        redirect_to "/page/#{@page.title_url}"
      else
        render('new')
      end
    end
  end
  
  def offensive
    @page = Page.find(:first, :conditions => { :title_url => params[:id] } )
    
    if @page.update_attributes( :offensive => "true" )
    else
      render :text => "fail"
    end
    render :text => "success"
  end
  
  def save
    
  end
  
  def destroy
    @page = Page.find(params[:id]).destroy
    flash[:notice] = "Successfully Deleted Page."
    redirect_to "/gallery"
  end
  
  def about
    render :layout => 'application'
  end
  
  def legal 
    render :layout => 'application'
  end
  
end
