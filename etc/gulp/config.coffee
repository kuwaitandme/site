module.exports =
  coffee:
    dest: "var/public/javascripts"
    src: "src/client/entry.coffee"
    targetFilename: "app.js"
    targetFilenameMin: "app.js"

  sass:
    dest: "var/public/stylesheets"
    src: "src/client/style.sass"
    targetFilename: "style.css"
    targetFilenameMin: "style.css"

  jade:
    dest: "var/public/javascripts"
    src: "src/client/**/*.jade"
    targetFilename: "templates.js"
    targetFilenameMin: "templates.js"

  watch:
    jsPattern: "src/client/**/*.coffee"
    cssPattern: "src/client/**/*.{sass,scss}"
    jadePattern: "src/client/**/*.jade"
    serverPattern: "src/server/views/components/footer-scripts/*.coffee"

  docs:
    hostname: "http://localhost:8000"
    backend:
      dest: "docs/backend"
      src: "src/server/**/*.coffee"
    frontend:
      dest: "docs/frontend"
      src: "src/client/javascripts/**/*.coffee"

  server:
    footer:
      dest: "src/server/views/components/footer-scripts"
      filenameMin: "main.min.js"
      src: "src/server/views/components/footer-scripts/*.coffee"
    db:
      dest: "src/server/db"
      filename: "populate.js"
      src: "src/server/db/*.coffee"

  bower:
    dest: "var/public/javascripts/"
    targetFilename: "libraries.js"
