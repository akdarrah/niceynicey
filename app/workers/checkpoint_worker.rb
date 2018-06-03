class CheckpointWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find(user_id)

    user.tasks.where(starred: true).update_all(starred: false)

    if user.tasks.no_checkpoint.completed.exists?
      Checkpoint.create_checkpoint!(user)
    end
  end
end
