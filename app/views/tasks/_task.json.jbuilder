json.extract! task, :id, :label, :parent_id, :state, :created_at, :updated_at
json.url task_url(task, format: :json)
