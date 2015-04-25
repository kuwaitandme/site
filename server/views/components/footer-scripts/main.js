(function() {
  var $fileref, appChanged, foundInCache, head, i, isCSS, isLibrary, len, libraryChanged, localVersion, localVersionString, production, remoteVersion, remoteVersionString, script, scriptCache;

  window.scripts = [
    {
      name: "library:normalize-css",
      remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/normalize.min.css",
      localSrc: "/stylesheets/vendor/normalize.min.css"
    }, {
      name: "library:foundation-css",
      remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/foundation.min.css",
      localSrc: "/stylesheets/vendor/foundation.min.css"
    }, {
    //   name: "library:jquery.magnific-popup-css",
    //   remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.0.0/magnific-popup.min.css",
    //   localSrc: "/stylesheets/vendor/magnific-popup.min.css"
    // }, {
      name: "app:style-css",
      remoteSrc: "/stylesheets/build/style.css?m=" + config.magic.application,
      localSrc: "/stylesheets/build/style.css?m=" + config.magic.application
    }, {
      name: "library:jquery",
      remoteSrc: "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js",
      localSrc: "/javascripts/vendor/angular.min.js"
    }, {
      name: "library:jquery-transit",
      remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.12/jquery.transit.min.js",
      localSrc: "/javascripts/vendor/angular-route.min.js"
    }, {
      name: "library:jquery-transit",
      remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.12/jquery.transit.min.js",
      localSrc: "/javascripts/vendor/angular-sanitize.min.js"
    }, {
    //   name: "library:underscore",
    //   remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js",
    //   localSrc: "/javascripts/vendor/underscore.min.js"
    // }, {
    //   name: "library:backbone",
    //   remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js",
    //   localSrc: "/javascripts/vendor/backbone.min.js"
    // }, {
    //   name: "library:google-maps",
    //   remoteSrc: "//maps.googleapis.com/maps/api/js?key=AIzaSyBUcoOW5jw2GvlFQI49FIGl6I7czXcX5iQ&callback=initializeGmap"
    // }, {
    //   name: "library:dropzone",
    //   remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/min/dropzone.min.js",
    //   localSrc: "/javascripts/vendor/dropzone.min.js"
    // }, {
    //   name: "library:masonry",
    //   remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/masonry/3.2.2/masonry.pkgd.min.js",
    //   localSrc: "/javascripts/vendor/masonry.pkgd.min.js"
    // }, {
    //   name: "library:foundation-js",
    //   remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/js/foundation.min.js",
    //   localSrc: "/javascripts/vendor/foundation.min.js"
    // }, {
    //   name: "library:magnific-popup",
    //   remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.0.0/jquery.magnific-popup.min.js",
    //   localSrc: "/javascripts/vendor/jquery.magnific-popup.min.js"
    // }, {
    //
      name: "app:template",
      remoteSrc: "/javascripts/vendor/angular.uiroute.js",
      localSrc: "/javascripts/vendor/angular.uiroute.js"
    }, {
      name: "app:template",
      remoteSrc: "/javascripts/build/template.js?m=" + config.magic.application,
      localSrc: "/javascripts/build/template.js?m=" + config.magic.application
    }, {
      name: "app:script",
      remoteSrc: "/javascripts/build/app.js?m=" + config.magic.application,
      localSrc: "/javascripts/build/app.js?m=" + config.magic.application
    // }, {
    //   name: "library:google-recaptcha",
    //   remoteSrc: '//www.google.com/recaptcha/api.js?render=explicit&hl=#{lang}'
    }
  ];

  window.initializeGmap = function() {};

  head = document.getElementsByTagName("head")[0];

  production = config.mode === "production";

  for (i = 0, len = scripts.length; i < len; i++) {
    script = scripts[i];
    $fileref = void 0;
    foundInCache = false;
    isCSS = (script.name.substr(-3)) === "css";
    if (isCSS) {
      $fileref = document.createElement("link");
      $fileref.rel = "stylesheet";
    } else {
      $fileref = document.createElement("script");
      $fileref.type = "text/javascript";
    }
    if ((typeof localStorage !== "undefined" && localStorage !== null) && production && script.localSrc) {
      appChanged = (localStorage.getItem("magic:application")) !== config.magic.application;
      libraryChanged = (localStorage.getItem("magic:library")) !== config.magic.library;
      isLibrary = (script.name.split(":"))[0] === "library";
      localVersionString = isLibrary ? "magic:library" : "magic:application";
      remoteVersionString = isLibrary ? "library" : "application";
      localVersion = String(localStorage.getItem(localVersionString));
      remoteVersion = String(window.config.magic[remoteVersionString]);
      scriptCache = localStorage.getItem(script.name);
      if (libraryChanged || (appChanged && !isLibrary)) {
        console.log("skipping:", script.name);
        scriptCache = null;
      }
      if (scriptCache) {
        console.log("fething from cache:", script.name);
        if (isCSS) {
          $fileref = document.createElement("style");
          $fileref.type = "text/css";
        }
        $fileref.innerHTML = scriptCache;
        foundInCache = true;
      }
    }
    if (!production) {
      script.remoteSrc = script.localSrc || script.remoteSrc;
    }
    if (!foundInCache) {
      $fileref.async = false;
      if (isCSS) {
        $fileref.href = script.remoteSrc;
      } else {
        $fileref.src = script.remoteSrc;
      }
    }
    if (isCSS) {
      head.appendChild($fileref);
    } else {
      head.insertBefore($fileref, head.firstChild);
    }
  }

}).call(this);
