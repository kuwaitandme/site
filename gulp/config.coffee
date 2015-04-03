module.exports =
  coffee:
    dest:              'public/javascripts/build'
    src:               'assets/javascripts/entry.coffee'
    targetFilename:    'app.js'
    targetFilenameMin: 'app.min.js'

  sass:
    dest:              'public/stylesheets/build'
    src:               'assets/stylesheets/style.sass'
    targetFilename:    'style.css'
    targetFilenameMin: 'style.min.css'

  jade:
    dest:              'public/javascripts/build'
    src:               'assets/jade/**/*.jade'
    targetFilename:    'template.js'
    targetFilenameMin: 'template.min.js'

  watch:
    jsPattern:         'assets/javascripts/**/*.coffee'
    cssPattern:        'assets/stylesheets/**/*.{sass,scss}'
    jadePattern:       'assets/jade/**/*.jade'

  docs:
    hostname:           'http://localhost:8000'
    backend:
      dest:              'docs/backend'
      src:               'server/**/*.coffee'
    frontend:
      dest:              'docs/frontend'
      src:               'assets/javascripts/**/*.coffee'