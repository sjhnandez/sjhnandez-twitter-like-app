require 'rails_helper'

RSpec.describe Api::FollowersController, "#crear" do
  
  context "When one user wants to follow another" do
    let!(:user1) { create(:user) }
    let!(:user2) { create(:user) }

    before do
      post :create, params: {account: user1.screen_name, follower: user2.screen_name}
    end

    it "Should create the follow relation" do
      expect(JSON.parse(response.body)["user_id"]).to eq(user1.id)
    end
  end

  context "When one user wants to follow other but it does not exists" do
    let!(:user1) { create(:user) }

    it "Should raise not method error" do
      expect {  post :create, params: {account: user1.screen_name, follower: -1}}.to raise_exception(NoMethodError)
      #expect(JSON.parse(response.body)["user_id"]).to eq(user1.id)
    end
  end

  context "When both users does not exists" do
    
    it "Should raise not method error" do
      expect {  post :create, params: {account: -2, follower: -1}}.to raise_exception(NoMethodError)
      #expect(JSON.parse(response.body)["user_id"]).to eq(user1.id)
    end
  end

  context "When you want to refollow a user" do
    let!(:user1) { create(:user) }
    let!(:user2) { create(:user) }

    
    before do
      Follower.create(user_id: user1.id, following_id: user2.id)
      post :create, params: {account: user1.screen_name, follower: user2.screen_name}
    end

    it "Should raise not method error" do
      expect(JSON.parse(response.body)["message"]).to eq("already follows this user")
    end
  end

end

RSpec.describe Api::FollowersController, "#listar" do
  
  context "When you want to list the followers of a given user that doesn't have followers" do
    let!(:user) {create(:user)}

    before do
      post :follows, params: { account: user.screen_name}
    end

    it "should return a empty array" do
      expect(JSON.parse(response.body).size).to eq(0)
    end
  end

  context "When you want to list the followings of a given user that doesn't have followings" do
    let!(:user) {create(:user)}

    before do
      post :following, params: { account: user.screen_name}
    end

    it "should return a empty array" do
      expect(JSON.parse(response.body).size).to eq(0)
    end
  end

  context "When you want to list the followers of a given user" do
    let!(:user) {create(:user)}
    let!(:user2) {create(:user)}
    let!(:user3) {create(:user)}
    

    before do
      Follower.create(user_id: user2.id, following_id: user.id)
      Follower.create(user_id: user3.id, following_id: user.id)

      post :follows, params: { account: user.screen_name}
    end

    it "should return an 2 element  array" do
      expect(JSON.parse(response.body).size).to eq(2)
    end
  end

  context "When you want to list the followings of a given user" do
    let!(:user) {create(:user)}
    let!(:user2) {create(:user)}
    let!(:user3) {create(:user)}
    

    before do
      Follower.create(user_id: user.id, following_id: user2.id)
      Follower.create(user_id: user.id, following_id: user3.id)

      post :following, params: { account: user.screen_name}
    end

    it "should return an 2 element  array" do
      expect(JSON.parse(response.body).size).to eq(2)
    end
  end

  context "When you want to verify if one user follows another" do
    let!(:user) {create(:user)}
    let!(:user2) {create(:user)}
    

    before do
      Follower.create(user_id: user.id, following_id: user2.id)
      post :isfollows, params: { account: user.screen_name, followed: user2.screen_name}
    end

    it "should return the following record " do
      expect(JSON.parse(response.body).size).to eq(1)
    end
  end

  context "When you want to verify if one user follows another but it is not true" do
    let!(:user) {create(:user)}
    let!(:user2) {create(:user)}
    
    before do
      post :isfollows, params: { account: user.screen_name, followed: user2.screen_name }
    end

    it "should return the following record " do
      expect(JSON.parse(response.body)["message"]).to eq("relation not found")
    end
  end

  

end