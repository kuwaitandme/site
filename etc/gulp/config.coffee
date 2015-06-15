module.exports =
  coffee:
    dest: "var/public/build"
    src: "src/client/entry.coffee"
    targetFilename: "app.js"
    targetFilenameMin: "app.js"

  sass:
    dest: "var/public/build"
    src: "src/client/style.sass"
    targetFilename: "style.css"
    targetFilenameMin: "style.css"

  md5:
    src: "var/public/build/*.{js,css}"
    dest: "var/public/build/md5"

  checksum:
    src: "var/public/build/*.{js,css}"
    filename: "checksums"
    hash: "md5"
    dest: "var/public/build"


  minify:
    jsSrc: "var/public/build/*.js"
    jsDest: "var/public/build/"


  jade:
    dest: "var/public/build"
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
    dest: "var/public/build/"
    targetFilename: "libraries.js"
