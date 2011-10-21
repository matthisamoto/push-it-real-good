class IndexController < ApplicationController
  
  before_filter :get_count
  
  def index
    @top_ten = Page.find(:all, :limit => 10, :order => "pages.pushes DESC" )
    @feature = Page.find(:all).sample
  end
    
end
