FactoryGirl.define do
  factory :task do
    sequence(:label) {|n| "Task ##{n}" }
    user
  end
end
