source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'rails', '~> 5.0.2'
gem 'pg'
gem 'puma', '~> 3.0'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.2'
gem 'jquery-rails'
gem 'turbolinks', '~> 5'
gem 'jbuilder', '~> 2.5'
gem 'wombat'
gem 'aasm'
gem 'bootstrap', '~> 4.0.0.beta'
gem "font-awesome-rails"
gem "active_model_serializers"
gem 'chroma'
gem 'stamp'
gem 'missing_validators'

gem 'html-pipeline'
gem 'commonmarker'

gem 'gon'
gem 'acts_as_list', '~> 0.9.10'
gem 'devise'
gem 'haml'
gem 'simple_form'
gem 'uuid'

gem 'angularjs-rails'
gem 'angular-rails-templates'
gem 'angular_rails_csrf'

gem 'activeadmin'

gem 'sidekiq'
gem "sidekiq-cron", "~> 0.6.3"
gem 'groupdate'

group :development, :test  do
  gem 'factory_girl'
  gem 'awesome_print'
  gem 'pry'
  gem 'pry-remote' #enables us to use pry with pow
  gem 'pry-rails'
  gem 'pry-byebug'
  gem 'pry-rescue'
  gem 'pry-stack_explorer'
  gem 'pry-doc'
  gem 'mocha'
  gem 'minitest-rails'
  gem 'minitest-focus'
  gem 'minitest-stub-const'
  gem 'bullet'
  gem 'i18n-tasks'
  gem 'coveralls'
  gem 'rubocop', '>= 0.49.1', require: false
  gem 'bundler-audit'
  gem 'rake'
end

group :development do
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '~> 3.0.5'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
