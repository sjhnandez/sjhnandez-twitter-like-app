require 'rails_helper'

RSpec.describe Api::TweetsController, "#crear" do
  context " When Tweet is empty " do
    let(:user) { create(:user) }
    before do
      post :create, params: { tweet: { text: "", user_id: user.id, reply_count: 0, retweet_count: 0, favorite_count: 0 }}
    end

    it "Should tell that tweet is empty" do
      expect(JSON.parse(response.body)["error"]["text"][0]).to eq("is too short (minimum is 1 character)") 
    end
  end

  context "When user is logged in" do
    let(:user) { create(:user) }
    before do
      post :create, params: { tweet: { text: "this is a test text", user_id: user.id, reply_count: 0, retweet_count: 0, favorite_count: 0 }}
    end

    it "Should create a new tweet" do
      expect(JSON.parse(response.body)["text"]).to eq("this is a test text") 
    end
  end

  context "When user is not  logged in" do
    before do
      post :create, params: { tweet: { text: "this is a test text", user_id: 1, reply_count: 0, retweet_count: 0, favorite_count: 0 }}
    end

    it "Should not create a new tweet and tell that user is missing" do
      expect(JSON.parse(response.body)["error"]).to eq("user"=>["must exist"]) 
    end
  end

  context " When param is missing" do
    let(:user) { create(:user) }
    before do
      post :create, params: { tweet: { text: "ab", reply_count: 0, retweet_count: 0, favorite_count: 0 }}
    end

    it "Should tell that tweet is empty" do
      expect(JSON.parse(response.body)["error"]["user_id"][0]).to eq("can't be blank") 
    end
  end


end

RSpec.describe Api::TweetsController, "#listar" do
  context "When you list all tweets" do
    let!(:tweet) {create_list(:tweet, 10)}
    before do
      get :index
    end

    it "should return ten tweets" do
      expect(JSON.parse(response.body).size).to eq(10) 
    end

  end

  context "When you list only one tweet" do
    let!(:tweet) {create(:tweet)}
    before do
      get :show,  params: { id: tweet.id }
    end

    it "should return one tweets" do
      expect(JSON.parse(response.body)["id"]).to eq(tweet.id) 
    end
  end

  context "When you list only your tweets" do 
    let!(:tweet) {create_list(:tweet,12)}

    before do
      post :my_tweets , params: {user_id: tweet[0].user_id}
    end
    
    it "should return 1 tweet" do
      expect(JSON.parse(response.body).size).to eq(1) 
    end
  end

  context "When you list only your tweets but user not found" do 
    let!(:tweet) {create_list(:tweet,12)}

    before do
      post :my_tweets , params: {user_id: -1}
    end
    
    it "should return 0 tweet" do
      expect(JSON.parse(response.body).size).to eq(0) 
    end
  end


  context "When you want to fetch own tweets + followings tweets" do
    let!(:user) {create(:user)}
    let!(:user2) {create(:user)}
    let!(:user3) {create(:user)}
    let!(:user4) {create(:user)}
    let!(:user5) {create(:user)}
    
    before do
      Tweet.create(text: "this is a tweet by #{user.id} ", user_id: user.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user2.id} ", user_id: user2.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user3.id} ", user_id: user3.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user4.id} ", user_id: user4.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user5.id} ", user_id: user5.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is another tweet by #{user.id} ", user_id: user.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Follower.create(user_id: user.id, following_id: user2.id)
      Follower.create(user_id: user.id, following_id: user3.id)
      Follower.create(user_id: user.id, following_id: user4.id)

      post :home_tweets, params: {user_id: user.id}
    end

    it "Should return 5 tweets" do
      expect(JSON.parse(response.body).size).to eq(5)
    end
    
  end

  context "When you want to fetch own tweets + followings tweets but you dont follow any account" do
    let!(:user) {create(:user)}
    let!(:user2) {create(:user)}
    let!(:user3) {create(:user)}
    let!(:user4) {create(:user)}
    let!(:user5) {create(:user)}
    
    before do
      Tweet.create(text: "this is a tweet by #{user.id} ", user_id: user.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user2.id} ", user_id: user2.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user3.id} ", user_id: user3.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user4.id} ", user_id: user4.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is a tweet by #{user5.id} ", user_id: user5.id, reply_count: 0, retweet_count: 0, favorite_count: 0)
      Tweet.create(text: "this is another tweet by #{user.id} ", user_id: user.id, reply_count: 0, retweet_count: 0, favorite_count: 0)

      post :home_tweets, params: {user_id: user.id}
    end

    it "Should return 2 tweets" do
      expect(JSON.parse(response.body).size).to eq(2)
    end

  end

end

RSpec.describe Api::TweetsController, "#eliminar" do

  context "When you want to delete one tweet" do
    let!(:tweet) {create(:tweet)}

    before do
      delete :destroy, params: {id: tweet.id}
    end

    it "Should return success delete" do
      expect(JSON.parse(response.body)["success"]).to eq("Tweet deleted!")
    end

  end

  context "When you want to delete one tweet but it does not exists" do
    let!(:tweet) {create(:tweet)}

    it "Should return success delete" do
      expect { delete :destroy, params: {id: -1} }.to raise_exception(ActiveRecord::RecordNotFound)
    end
    
  end

end