module ApplicationHelper
  
  def iphone?
    request.env["HTTP_USER_AGENT"] && request.env["HTTP_USER_AGENT"][/(iPhone|iPod|iPad)/]
  end
  
  def ie?
    request.env["HTTP_USER_AGENT"] && request.env["HTTP_USER_AGENT"][/(MSIE)/]
  end
  
  def android?
    request.env["HTTP_USER_AGENT"] && request.env["HTTP_USER_AGENT"][/(Android)/]
  end
  
  def admin?
    if user_signed_in?
      if !current_user.admin?
      end
    end
    return true
  end
  
end
