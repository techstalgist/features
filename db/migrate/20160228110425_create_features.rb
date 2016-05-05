class CreateFeatures < ActiveRecord::Migration
  def change
    create_table :features do |t|
      t.text :title
      t.text :description
      t.text :type

      t.timestamps null: false
    end
  end
end
