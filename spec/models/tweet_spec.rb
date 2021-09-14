require 'rails_helper'

RSpec.describe Tweet, type: :model do
  context "the minimun associations needed to test tweet" do
    describe 'associations' do
      it { should belong_to(:user).class_name("User") }
    end
    
  end
  
  context "validations of the length, presence of text and user_id" do

    describe 'validations' do
      it { should validate_presence_of(:text) }
      it { should validate_presence_of(:user_id) }
      it { should validate_length_of(:text).is_at_least(1).is_at_most(240) }
    end
    
  end
end
