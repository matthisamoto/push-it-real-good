class PageController < ApplicationController
  
  before_filter :get_count
  
  def list 
    @count = Page.count
    @pages = @top_ten = Page.find(:all, :limit => 25, :order => "pages.created_at DESC" )
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
    redirect_to "/gallery"
  end
  
  def about
    render :layout => 'application'
  end
  
  def legal 
    render :layout => 'application'
  end
  
end
