FactoryGirl.define do
  factory :task do
    sequence(:label) {|n| "Task ##{n}" }
    user
    points 0
  end
end
