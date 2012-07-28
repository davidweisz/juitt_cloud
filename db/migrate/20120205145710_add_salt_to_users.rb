class AddSaltToUsers < ActiveRecord::Migration
  def change
    add_column :users, :salt, :string
  end
  def self.down
    remove_column :users, :salt
  end
end
