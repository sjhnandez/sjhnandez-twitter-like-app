module Api
  class S3Controller < ApplicationController
    def set_s3_direct_post
      filename = params[:filename]
      file_type = params[:fileType]
      directory = params[:directory]
      random_path = SecureRandom.uuid
      key = "uploads/#{directory}/#{random_path}/#{filename}"

      signer = Aws::S3::Presigner.new
      post_url = signer.presigned_url(:put_object, bucket: Rails.application.credentials.aws[:bucket], key: key, acl: "public-read", content_type: file_type)
      get_url = "https://#{Rails.application.credentials.aws[:bucket]}.s3.amazonaws.com/#{key}"
      render json: { post_url: post_url,
                     get_url: get_url }
    end
  end
end
