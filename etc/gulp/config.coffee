module.exports =
  coffee:
    dest: "content/build"
    src: "core/client/main.coffee"
    targetFilename: "app.js"
    targetFilenameMin: "app.js"


  sass:
    dest: "content/build"
    src: "core/client/style.sass"
    targetFilename: "style.css"
    targetFilenameMin: "style.css"


  md5:
    dest: "content/build/md5"
    src: "content/build/*.{js,css}"


  checksum:
    dest: "content/build"
    filename: "checksums"
    hash: "md5"
    src: "content/build/*.{js,css}"


  minify:
    jsDest: "content/build/"
    jsSrc: "content/build/*.js"


  jade:
    dest: "content/build"
    src: "core/client/**/*.jade"
    targetFilename: "templates.js"
    targetFilenameMin: "templates.js"


  watch:
    coffeePattern: "core/client/**/*.{coffee,js,json}"
    jadePattern: "core/client/**/*.jade"
    sassPattern: "core/client/**/*.{sass,scss}"
    serverPattern: "core/server/views/*.coffee"


  docs:
    backend:
      dest: "docs/server"
      src: "core/server/**/*.coffee"
    frontend:
      dest: "docs/client"
      src: "core/client/**/*.coffee"
    hostname: "http://localhost:8000"


  server:
    footer:
      dest: "core/server/views/"
      src: "core/server/views/**/*.coffee"
    db:
      dest: "core/server/db"
      filename: "populate.js"
      src: "core/server/db/*.coffee"


  bower:
    dest: "content/build/"
    targetFilename: "libraries.js"