class AddSprintToFeatures < ActiveRecord::Migration
  def change
    add_column :features, :sprint, :string
  end
end
