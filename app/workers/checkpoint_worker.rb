class CheckpointWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)
    Checkpoint.create_checkpoint!(user)
  end
end
