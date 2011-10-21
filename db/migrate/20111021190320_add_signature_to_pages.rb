class AddSignatureToPages < ActiveRecord::Migration
  def change
    add_column :pages, :signature, :string
  end
end
