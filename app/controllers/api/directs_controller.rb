module Api
  class DirectsController < ApplicationController
    protect_from_forgery with: :null_session


    def index
      directs = Direct.all
      render json: directs
    end

    def show 
      direct = Direct.find_by(id: param[:id])

      render json: direct
    end
    
    def create
      direct = Direct.new(direct_params)
      p direct 
      if direct.save
        render json: direct
      else
        render json: {error: direct.errors.messages }
      end
    end


    def get_direct_messages
      directs = User.find(params[:id]).directs
      render json: directs.as_json(include: [:user])
    end

  
    def destroy
      direct = Direct.find(params[:id])

      if direct.destroy
        render json: { success: "direct deleted!", status: :success }
      else
        render json: { error: "direct not found", status: :error }
      end
    end


    private 

    def direct_params
      params.require(:direct).permit(:user_id_from, :user_id_to, :message, :has_image, :image_url)
    end


  end
end
