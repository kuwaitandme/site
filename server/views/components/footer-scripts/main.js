(function() {
  var $fileref, appChanged, foundInCache, head, i, isCSS, isLibrary, j, len, libraryChanged, localVersion, localVersionString, remoteVersion, remoteVersionString, script, scriptCache;

  window.scripts = [
    {
      name: 'library:normalize-css',
      remoteSrc: '/stylesheets/vendor/normalize.min.css',
      localSrc: '/stylesheets/vendor/normalize.min.css'
    }, {
      name: 'library:foundation-css',
      remoteSrc: '/stylesheets/vendor/foundation.min.css',
      localSrc: '/stylesheets/vendor/foundation.min.css'
    }, {
      name: 'app:stylesheet',
      remoteSrc: '/stylesheets/build/style.css',
      localSrc: '/stylesheets/build/style.css'
    }, {
      name: 'library:jquery',
      remoteSrc: '/javascripts/vendor/jquery.min.js',
      localSrc: '/javascripts/vendor/jquery.min.js'
    }, {
      name: 'library:jquery-transit',
      remoteSrc: '/javascripts/vendor/jquery.transit.min.js',
      localSrc: '/javascripts/vendor/jquery.transit.min.js'
    }, {
      name: 'library:underscore',
      remoteSrc: '/javascripts/vendor/underscore.min.js',
      localSrc: '/javascripts/vendor/underscore.min.js'
    }, {
      name: 'library:backbone',
      remoteSrc: '/javascripts/vendor/backbone.min.js',
      localSrc: '/javascripts/vendor/backbone.min.js'
    }, {
      name: 'library:modernizr',
      remoteSrc: '/javascripts/vendor/modernizr.min.js',
      localSrc: '/javascripts/vendor/modernizr.min.js'
    }, {
      name: 'library:dropzone',
      remoteSrc: '/javascripts/vendor/dropzone.min.js',
      localSrc: '/javascripts/vendor/dropzone.min.js'
    }, {
      name: 'library:masonry',
      remoteSrc: '/javascripts/vendor/masonry.pkgd.min.js',
      localSrc: '/javascripts/vendor/masonry.pkgd.min.js'
    }, {
      name: 'library:foundation-js',
      remoteSrc: '/javascripts/vendor/foundation.min.js',
      localSrc: '/javascripts/vendor/foundation.min.js'
    }, {
      name: 'app:template',
      remoteSrc: '/javascripts/build/template.js',
      localSrc: '/javascripts/build/template.js'
    }, {
      name: 'app:script',
      remoteSrc: '/javascripts/build/app.js',
      localSrc: '/javascripts/build/app.js'
    }
  ];


  /* Special functions and variables to facilitate gmaps */

  window.gmapInitialized = false;

  window.gmapInitializeListeners = [];

  window.initializeGmap = function() {
    var i, listeners;
    window.gmapInitialized = true;
    listeners = window.gmapInitializeListeners;
    i = 0;
    while (i < listeners.length) {
      listeners[i]();
      i++;
    }
  };

  head = document.getElementsByTagName('head')[0];

  i = scripts.length;

  for (j = 0, len = scripts.length; j < len; j++) {
    script = scripts[j];
    $fileref = void 0;
    foundInCache = false;
    isCSS = script.remoteSrc.substr(-3) === 'css';
    if (isCSS) {
      $fileref = document.createElement('link');
      $fileref.rel = 'stylesheet';
    } else {
      $fileref = document.createElement('script');
    }
    if ((typeof localStorage !== "undefined" && localStorage !== null) && false) {
      appChanged = (localStorage.getItem('version:application')) !== window.config.js.applicationVersion;
      libraryChanged = (localStorage.getItem('version:library')) !== window.config.js.libraryVersion;
      isLibrary = (script.name.split(':'))[0] === 'library';
      localVersionString = isLibrary ? 'version:library' : 'version:application';
      remoteVersionString = isLibrary ? 'libraryVersion' : 'applicationVersion';
      localVersion = String(localStorage.getItem(localVersionString));
      remoteVersion = String(window.config.js[remoteVersionString]);
      scriptCache = localStorage.getItem(script.name);
      if (libraryChanged || (appChanged && !isLibrary)) {
        console.log('skipping', script.name);
        scriptCache = null;
      }
      if (scriptCache) {
        if (isCSS) {
          $fileref = document.createElement('style');
          $fileref.type = 'text/css';
        }
        $fileref.innerHTML = scriptCache;
        foundInCache = true;
      }
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
      $fileref.type = 'text/javascript';
      head.insertBefore($fileref, head.firstChild);
      head.removeChild($fileref);
    }
  }

}).call(this);
