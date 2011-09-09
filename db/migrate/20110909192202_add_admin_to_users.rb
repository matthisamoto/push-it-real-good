class AddAdminToUsers < ActiveRecord::Migration
  def change
    add_column :users, :role, :string, :default => "client"
  end
end
