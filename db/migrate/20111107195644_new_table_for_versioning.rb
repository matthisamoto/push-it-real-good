class NewTableForVersioning < ActiveRecord::Migration
  def change
    create_table :site_info do |t|
      t.string :version
      t.integer :button_of_the_day_index
      
      t.timestamps
    end
    
    add_column :pages, :feature_time, :datetime
    add_column :pages, :offensive, :string, :default => "false"
  end
end
