class AddTrackInfoToPages < ActiveRecord::Migration
  def change
    add_column :pages, :track_name, :string
    add_column :pages, :track_url, :string
    add_column :pages, :track_author, :string
    add_column :pages, :track_author_url, :string
  end
end
