(function() {
  var $fileref, appChanged, foundInCache, head, incrementProgressBar, isCSS, isLibrary, j, len, libraryChanged, localVersion, localVersionString, production, remoteVersion, remoteVersionString, script, scriptCache, totalScriptsLoaded;

  window.scripts = [
    {
      name: "app:style-css",
      remoteSrc: "/stylesheets/style.css?m=" + publicData.magic.application,
      localSrc: "/stylesheets/style.css?m=" + publicData.magic.application
    }, {
      name: "library:masonry",
      remoteSrc: "/javascripts/libraries.js"
    }, {
      name: "app:template",
      remoteSrc: "/javascripts/templates.js?m=" + publicData.magic.application,
      localSrc: "/javascripts/templates.js?m=" + publicData.magic.application
    }, {
      name: "app:script",
      remoteSrc: "/javascripts/app.js?m=" + publicData.magic.application,
      localSrc: "/javascripts/app.js?m=" + publicData.magic.application
    }, {
      name: "library:font-opensans-css",
      remoteSrc: "//fonts.googleapis.com/css?family=Open+Sans:400,600"
    }, {
      name: "library:font-roboto-css",
      remoteSrc: "//fonts.googleapis.com/css?family=Roboto"
    }, {
      name: "library:font-awesome-css",
      remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css"
    }
  ];

  window.initializeGmap = function() {};

  totalScriptsLoaded = 0;

  (document.getElementsByTagName('body'))[0].className += 'loading';

  incrementProgressBar = function() {
    var setProgressBar;
    setProgressBar = function(i, total) {
      var progressBarStyle;
      progressBarStyle = document.getElementById("page-loading-bar").style;
      return progressBarStyle.width = (i * 1.0 / total * 100) + "%";
    };
    totalScriptsLoaded++;
    return setProgressBar(totalScriptsLoaded, window.scripts.length);
  };

  head = document.getElementsByTagName("head")[0];

  production = publicData.environment === "production";

  for (j = 0, len = scripts.length; j < len; j++) {
    script = scripts[j];
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
    $fileref.onreadystatechange = function() {
      if (this.readyState === "complete") {
        return incrementProgressBar();
      }
    };
    $fileref.onload = incrementProgressBar;
    if ((typeof localStorage !== "undefined" && localStorage !== null) && production && script.localSrc) {
      appChanged = (localStorage.getItem("magic:application")) !== publicData.magic.application;
      libraryChanged = (localStorage.getItem("magic:library")) !== publicData.magic.library;
      isLibrary = (script.name.split(":"))[0] === "library";
      localVersionString = isLibrary ? "magic:library" : "magic:application";
      remoteVersionString = isLibrary ? "library" : "application";
      localVersion = String(localStorage.getItem(localVersionString));
      remoteVersion = String(window.publicData.magic[remoteVersionString]);
      scriptCache = localStorage.getItem(script.name);
      if (libraryChanged || (appChanged && !isLibrary)) {
        console.log("skipping:", script.name);
        scriptCache = null;
      }
      if (scriptCache) {
        console.log("fetching from cache:", script.name);
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
