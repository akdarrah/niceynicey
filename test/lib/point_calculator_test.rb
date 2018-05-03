require 'test_helper'

class PointCalculatorTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @task = create(:task, user: @user)

    @point_calculator = PointCalculator.new(@user, @task)
  end

  # PointCalculator#calculate

  test "no bonuses returns bare points" do
    @point_calculator.stubs(:actual_days_since_creation).returns(0)
    @point_calculator.stubs(:distinct_days_since_creation).returns(0)
    @point_calculator.stubs(:base_random).returns(10)

    assert_equal 10, @point_calculator.calculate
  end

  test "after 15 days of usage, points are fifty percent larger" do
    @point_calculator.stubs(:actual_days_since_creation).returns(0)
    @point_calculator.stubs(:distinct_days_since_creation).returns(15)
    @point_calculator.stubs(:base_random).returns(10)

    assert_equal 15, @point_calculator.calculate
  end

  test "after 30 days of usage, points are doubled" do
    @point_calculator.stubs(:actual_days_since_creation).returns(0)
    @point_calculator.stubs(:distinct_days_since_creation).returns(30)
    @point_calculator.stubs(:base_random).returns(10)

    assert_equal 20, @point_calculator.calculate
  end

  test "after 60 days of usage, points are tripled" do
    @point_calculator.stubs(:actual_days_since_creation).returns(0)
    @point_calculator.stubs(:distinct_days_since_creation).returns(60)
    @point_calculator.stubs(:base_random).returns(10)

    assert_equal 30, @point_calculator.calculate
  end

  test "after 30 days, points are 25% larger" do
    @point_calculator.stubs(:actual_days_since_creation).returns(30)
    @point_calculator.stubs(:distinct_days_since_creation).returns(0)
    @point_calculator.stubs(:base_random).returns(10)

    assert_equal 13, @point_calculator.calculate
  end

  test "after 60 days, points are 50% larger" do
    @point_calculator.stubs(:actual_days_since_creation).returns(60)
    @point_calculator.stubs(:distinct_days_since_creation).returns(0)
    @point_calculator.stubs(:base_random).returns(10)

    assert_equal 15, @point_calculator.calculate
  end

  test "both bonuses are applied after 30 days" do
    @point_calculator.stubs(:actual_days_since_creation).returns(30)
    @point_calculator.stubs(:distinct_days_since_creation).returns(30)
    @point_calculator.stubs(:base_random).returns(10)

    assert_equal 23, @point_calculator.calculate
  end

end
