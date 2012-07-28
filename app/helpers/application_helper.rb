module ApplicationHelper
  # Return a title on a per-page basis.
  def title
    base_title = "Juitt - Share your movie library"
    if @title.nil?
      base_title
    else
      "#{base_title} | #{@title}"
    end
  end
  
  def logo
    image_tag("logo.png", :alt => "Juitt logo", :class => "round")
  end
end
