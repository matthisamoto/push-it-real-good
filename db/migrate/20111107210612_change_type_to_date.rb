class ChangeTypeToDate < ActiveRecord::Migration
  def up
    change_table :pages do |t|
      t.change :feature_time, :date
    end
  end

  def down
    change_table :pages do |t|
      t.change :feature_time, :datetime
    end
  end
end
