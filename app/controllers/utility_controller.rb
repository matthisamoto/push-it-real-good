class UtilityController < ApplicationController
  
  before_filter :auth_soundcloud
  
  def get_buttons
    @options = Button.find(:all, :conditions => { :style_name => params[:style] } ).collect {|p| [ p.color.upcase, p.filename.downcase ]}
    render :partial => 'color_select'
  end
  
  def search
    @tracks = @client.get('/_api', :limit => "10", :q => params[:term])
    @keyword = params[:term]
    render :partial => 'search'
  end
  
end
