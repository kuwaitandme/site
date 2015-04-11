(function() {
  var $fileref, appChanged, foundInCache, head, i, isCSS, isLibrary, j, len, libraryChanged, localVersion, localVersionString, remoteVersion, remoteVersionString, script, scriptCache;

  window.scripts = [
    {
      name: 'lib:normalize-css',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/normalize.min.css',
      localSrc: '/stylesheets/vendor/normalize.min.css'
    }, {
      name: 'lib:foundation-css',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/css/foundation.min.css',
      localSrc: '/stylesheets/vendor/foundation.min.css'
    }, {
      name: 'app:stylesheet',
      remoteSrc: '/stylesheets/build/style.min.css',
      localSrc: '/stylesheets/build/style.min.css'
    }, {
      name: 'lib:jquery',
      remoteSrc: '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
      localSrc: '/javascripts/vendor/jquery.min.js'
    }, {
      name: 'lib:jquery-transit',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.12/jquery.transit.min.js',
      localSrc: '/javascripts/vendor/jquery.transit.min.js'
    }, {
      name: 'lib:underscore',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js',
      localSrc: '/javascripts/vendor/underscore.min.js'
    }, {
      name: 'lib:backbone',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js',
      localSrc: '/javascripts/vendor/backbone.min.js'
    }, {
      name: 'lib:google-maps',
      remoteSrc: '//maps.googleapis.com/maps/api/js?v=3.exp&callback=initializeGmap',
      localSrc: '/javascripts/vendor/google.maps.min.js'
    }, {
      name: 'lib:modernizr',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js',
      localSrc: '/javascripts/vendor/modernizr.min.js'
    }, {
      name: 'lib:dropzone',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/min/dropzone.min.js',
      localSrc: '/javascripts/vendor/dropzone.min.js'
    }, {
      name: 'lib:masonry',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/masonry/3.2.2/masonry.pkgd.min.js',
      localSrc: '/javascripts/vendor/masonry.pkgd.min.js'
    }, {
      name: 'lib:jquery-imagesloaded',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.pkgd.min.js',
      localSrc: '/javascripts/vendor/imagesloaded.min.js'
    }, {
      name: 'lib:foundation-js',
      remoteSrc: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.1/js/foundation.min.js',
      localSrc: '/javascripts/vendor/foundation.min.js'
    }, {
      name: 'app:template',
      remoteSrc: '/javascripts/build/template.min.js',
      localSrc: '/javascripts/build/template.min.js'
    }, {
      name: 'app:script',
      remoteSrc: '/javascripts/build/app.min.js',
      localSrc: '/javascripts/build/app.min.js'
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
    if (typeof localStorage !== "undefined" && localStorage !== null) {
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
