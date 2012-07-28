class AddDetailsToMicroposts < ActiveRecord::Migration
  def change
    add_column :microposts, :poster_src, :string

    add_column :microposts, :data_json, :string

    add_column :microposts, :magnet_link, :string

  end
end
