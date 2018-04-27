class MidnightWorker
  include Sidekiq::Worker

  def perform
    sleep 10

    midnight_time_zones = ActiveSupport::TimeZone.all.select do |time|
      time.now.hour.zero?
    end.map(&:name)

    User.where(["time_zone IN (?)", midnight_time_zones]).pluck(:id).each do |user_id|
      CheckpointWorker.perform_async(user_id)
    end
  end
end
