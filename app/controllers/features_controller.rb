class FeaturesController < ApplicationController
  
  skip_before_action :verify_authenticity_token
  
  def index
    @core_features = Feature.where("feature_type ='Core'")
    @supporting_features = Feature.where("feature_type ='Support'")
    
    json = {"core_features" => @core_features, "supporting_features" => @supporting_features}
    respond_to do |format|
        format.html
        format.json { render json: json }
      end
  end
  
  def create
        @feature = Feature.new(feature_params)

        if @feature.save
          render json: @feature
        else
          render json: @feature.errors, status: :unprocessable_entity
        end
  end
  
  def destroy
      @feature = Feature.find(params[:id])
      @feature.destroy
      render json: @feature
  end
  
  def update
    @feature = Feature.find(params[:id])
   
      if @feature.update(feature_params)
        render json: @feature
      else
        render json: @feature.errors, status: :unprocessable_entity
      end
   
  end

      private

        def feature_params
          params.permit(:id, :title, :description, :feature_type)
        end
 
end
