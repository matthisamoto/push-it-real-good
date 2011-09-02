class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      t.string :sound_url
      t.string :button_url
      t.string :title_url
      t.text :tagline
      t.integer :user_id

      t.timestamps
    end
  end
end
