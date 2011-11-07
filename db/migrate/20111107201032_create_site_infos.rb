class CreateSiteInfos < ActiveRecord::Migration
  def change
    create_table :site_infos do |t|

      t.timestamps
    end
  end
end
