class MicropostsController < ApplicationController
  before_filter :authenticate, :only => [:create, :destroy]

  def create
    @micropost  = current_user.microposts.build(params[:micropost])
    if @micropost.save
      flash[:success] = "Your Juitt was succesfully posted!"
      redirect_to root_path
    else
      @feed_items = []
      render 'pages/home'
    end
  end

  def destroy
  end
end