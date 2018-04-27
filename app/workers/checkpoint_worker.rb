class CheckpointWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)

    if user.tasks.no_checkpoint.completed.exists?
      Checkpoint.create_checkpoint!(user)
    end
  end
end
