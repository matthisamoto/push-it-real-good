module AdminHelper

def iphone?
  request.env["HTTP_USER_AGENT"] && request.env["HTTP_USER_AGENT"][/(iPhone|iPod|iPad)/]
end

def ie?
  request.env["HTTP_USER_AGENT"] && request.env["HTTP_USER_AGENT"][/(MSIE)/]
end

def android?
  request.env["HTTP_USER_AGENT"] && request.env["HTTP_USER_AGENT"][/(Android)/]
end

end
