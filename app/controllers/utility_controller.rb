class UtilityController < ApplicationController
  
  before_filter :auth_soundcloud
  
  def get_buttons
    @options = Button.find(:all, :conditions => { :style_name => params[:style] } ).collect {|p| [ p.color.upcase, p.filename.downcase ]}
    render :partial => 'color_select'
  end
  
  def search
    @tracks = @client.get('/tracks', :limit => "10", :offset => params[:offset], :q => params[:q], :filter => "streamable");
    @keyword = params[:q]
    render :partial => 'search'
    # render :text => params[:q]
  end
  
end
