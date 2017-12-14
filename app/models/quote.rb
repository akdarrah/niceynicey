class Quote < ApplicationRecord
  validates :body, :author, presence: true
end
