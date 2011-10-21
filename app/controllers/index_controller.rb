class IndexController < ApplicationController
  
  before_filter :get_count
  
  def index
    @top_ten = Page.order("pages.pushes DESC", :limit => 10)
    @feature = Page.find(:all).sample
  end
    
end
