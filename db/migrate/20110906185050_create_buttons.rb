class CreateButtons < ActiveRecord::Migration
  def change
    create_table :buttons do |t|
      t.string :style_id
      t.string :style_name
      t.string :color
      t.string :filename
      t.timestamps
    end
  end
end
