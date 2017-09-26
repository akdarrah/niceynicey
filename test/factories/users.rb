FactoryGirl.define do
  factory :user do
    sequence(:email) {|n| "user_#{n}@gmail.com" }
    password "testingg"
  end
end
