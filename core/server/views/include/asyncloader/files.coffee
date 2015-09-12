u = window.publicData.staticUrl
window.scripts = [
  {
    id: "style.css"
    remote: ["#{u}/build/md5/style_#{publicData.md5['style.css']}.css"]
    local: "/build/md5/style_#{publicData.md5['style.css']}.css"
  }
  {
    id: "libraries.js"
    remote: [
      "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-hotkeys/1.4.5/hotkeys.min.js"
      # "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-cookies.min.js"
      # "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-sanitize.min.js"
      "//ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular-touch.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.2.14/angular-ui-router.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/masonry/3.3.0/masonry.pkgd.min.js"
      "//cdnjs.cloudflare.com/ajax/libs/angular-md5/0.1.7/angular-md5.min.js"
      # "//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min.js"
    ]
    local: "/build/md5/libraries_#{ publicData.md5['libraries.js'] }.js"
  }
  {
    id: "templates.js"
    # remote: ["#{u}/build/md5/templates_#{publicData.md5['templates.js']}.js"]
    remote: ["/build/templates.js"]
    # local: "/build/md5/templates_#{publicData.md5['templates.js']}.js"
    local: "/build/templates.js"
  }
  {
    id: "main.js"
    remote: ["#{u}/build/md5/main_#{publicData.md5['main.js']}.js"]
    local: "/build/md5/main_#{publicData.md5['main.js']}.js"
  }
  {
    id: "fonts.css"
    remote: [
      "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"
      "//fonts.googleapis.com/css?family=Cantarell"
      "//fonts.googleapis.com/css?family=Open+Sans:400,600"
      "//fonts.googleapis.com/css?family=Roboto"
      "//fonts.googleapis.com/css?family=Roboto+Slab"
      "//fonts.googleapis.com/css?family=Palanquin:100"
      "//fonts.googleapis.com/css?family=Droid+Sans:700"
    ]
  }
]