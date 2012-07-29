class MicropostsController < ApplicationController
  before_filter :authenticate, :only => [:create, :destroy]

  def create
    @micropost  = current_user.microposts.build(params[:micropost])
    if @micropost.save
      flash[:success] = "Your Juitt was succesfully posted!"
      redirect_to root_path
    else
      flash[:error] = "Error trying to fetch data from link, please try another one!"
      @feed_items = current_user.feed.paginate(:page => params[:page])
      render 'pages/home'
    end
  end

  def destroy
  end
end