class PointCalculator
  attr_accessor :user, :task

  MIN  = 1
  MAX  = 10
  BIAS = 2

  DISTINCT_DAYS_PERCENT = 1.00 # 100%
  DISTINCT_DAYS_INTERVAL = 30.0 # days

  ACTUAL_DAYS_PERCENT  = 0.25 # 25%
  ACTUAL_DAYS_INTERVAL = 30.0 # days

  def initialize(user, task)
    self.user = user
    self.task = task
  end

  def calculate
    base = base_random
    (base + actual_days_bonus(base) + distinct_days_bonus(base)).round
  end

  private

  def actual_days_bonus(base)
    bonus = (actual_days_since_creation / ACTUAL_DAYS_INTERVAL) * ACTUAL_DAYS_PERCENT
    base * bonus
  end

  def actual_days_since_creation
    (task.archived_at.to_date - user.created_at.to_date).to_i
  end

  def distinct_days_bonus(base)
    bonus = (distinct_days_since_creation / DISTINCT_DAYS_INTERVAL) * DISTINCT_DAYS_PERCENT
    base * bonus
  end

  def distinct_days_since_creation
    user.tasks
      .no_checkpoint
      .group_by_day(:created_at)
      .count
      .reject{|_,count| count.zero?}
      .select{|date,_| date < task.archived_at}
      .count
  end

  def base_random
    (MIN + (MAX - MIN) * pow(rand)).round
  end

  def pow(number)
    number ** BIAS
  end

end
