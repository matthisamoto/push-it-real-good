class AddTrackAndSignatureToPage < ActiveRecord::Migration
  def change
    add_column :pages, :pushes, :integer, :default => 0
  end
end
