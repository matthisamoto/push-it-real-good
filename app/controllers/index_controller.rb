class IndexController < ApplicationController
  
  def index
    @count = Page.count
  end
    
end
