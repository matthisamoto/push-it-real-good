class IndexController < ApplicationController
  
  before_filter :get_count
  
  def index
    @top_ten = Page.find(:all, :limit => 6, :order => "pages.pushes DESC" )
    @feature = Page.find(:first, :conditions => { :feature_time => Date.today })
    @most_recent = Page.find(:first, :order => "created_at DESC" )
  end
    
end
