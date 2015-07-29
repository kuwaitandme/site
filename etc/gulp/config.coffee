module.exports =
  coffee:
    dest: "src/public/build"
    src: "src/client/app.coffee"
    targetFilename: "app.js"
    targetFilenameMin: "app.js"

  sass:
    dest: "src/public/build"
    src: "src/client/style.sass"
    targetFilename: "style.css"
    targetFilenameMin: "style.css"

  md5:
    src: "src/public/build/*.{js,css}"
    dest: "src/public/build/md5"

  checksum:
    src: "src/public/build/*.{js,css}"
    filename: "checksums"
    hash: "md5"
    dest: "src/public/build"


  minify:
    jsSrc: "src/public/build/*.js"
    jsDest: "src/public/build/"


  jade:
    dest: "src/public/build"
    src: "src/client/**/*.jade"
    targetFilename: "templates.js"
    targetFilenameMin: "templates.js"

  watch:
    coffeePattern: "src/client/**/*.coffee"
    jadePattern: "src/client/**/*.jade"
    sassPattern: "src/client/**/*.{sass,scss}"
    serverPattern: "src/server/views/components/footer-scripts/*.coffee"

  docs:
    hostname: "http://localhost:8000"
    backend:
      dest: "docs/server"
      src: "src/server/**/*.coffee"
    frontend:
      dest: "docs/client"
      src: "src/client/**/*.coffee"

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
    dest: "src/public/build/"
    targetFilename: "libraries.js"
