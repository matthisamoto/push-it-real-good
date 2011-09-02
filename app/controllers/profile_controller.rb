class ProfileController < ApplicationController
  
  def index
    
  end
  
  def user
    
  end
  
  def new
    @page = Pages.new
  end
  
  def create
    @page = Pages.new(params[:adjective])
    if @page.save
      flash[:notice] = "Successfully Created Adjective \"#{@adjective.adjective}\""
      redirect_to(:action => 'index')
    else
      render('new')
    end
  end
  
  def save
    
  end
  
  def destroy

  end
  
end
