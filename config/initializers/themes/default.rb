::Spina::Theme.register do |theme|

  theme.name = 'default'
  theme.title = 'Default Theme'

  theme.page_parts = [{
    name:           'text',
    title:          'Text',
    partable_type:  'Spina::Text'
  }, {
    name:             'portfolio', # added this hash
    title:            'Portfolio',
    partable_type:    'Spina::Text'
  }, {
    name:             'line_test', # added this hash
    title:            'Line',
    partable_type:    'Spina::Line'
  }, {
    name:             'photo_test', # added this hash
    title:            'Photo',
    partable_type:    'Spina::Photo'
  }, {
    name:             'photo_collection_test', # added this hash
    title:            'Photo Collection',
    partable_type:    'Spina::PhotoCollection'
  }]

  theme.view_templates = [{
    name:       'homepage',
    title:      'Homepage',
    page_parts: ['text', 'portfolio', 'line_test', 'photo_test', 'photo_collection_test']
  }, {
    name: 'show',
    title:        'Default',
    description:  'A simple page',
    usage:        'Use for your content',
    page_parts:   ['text', 'portfolio', 'line_test', 'photo_test', 'photo_collection_test']
  }]

  theme.custom_pages = [{
    name:           'homepage',
    title:          'Homepage',
    deletable:      false,
    view_template:  'homepage'
  }]

  theme.navigations = [{
    name: 'mobile',
    label: 'Mobile'
  }, {
    name: 'main',
    label: 'Main navigation',
    auto_add_pages: true
  }]

end
