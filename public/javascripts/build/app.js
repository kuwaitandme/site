(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/*
Configuration
-------------

This file contains settings for the different components of the App. Any
changes here will effect the behavior of the App.
 */
module.exports = {

  /*
  ## jsVersion:
  This controls the version of the different JS components that are stored in the HTML5
  local-storage as cache.
   */
  jsVersion: window.jsVersion,

  /*
  ## hostname:
  This variable is used to prefix the URL for all AJAX requests. This is useful
  if we are deploying this App in phonegap and when we need to make CORS
  requests
   */
  hostname: "",

  /*
  ## localStorage:
   */
  localStorage: {
    enabled: true
  },

  /*
  ## html5Pushstate:
   */
  html5Pushstate: {
    enabled: true
  }
};

},{}],2:[function(require,module,exports){

/*
**Frontend Javascript App**
---------------------------
This file bootstraps the front-end app. Javascript execution begins from here.
The App is heavily dependent on BackBone, Underscore and jQuery.

The App is designed with an MVC framework in mind although with Backbone, your
views become your controller. The App also contains *modules*, which are
components that do different things like routing/caching.

Read the comments at the end of the page if you are trying to trace how the
application works
 */
var Main;

if (window.App == null) {

  /*
  ## *window.App*
  This variable is particularly important because it contains all the bits and
  pieces of our App. Even the application's running instance!
  
  This variable is made global so that different components of the App have a
  uniformed way of accessing different components/resources.
   */
  window.App = {
    Cache: (require("app-modules")).cache,
    Router: (require("app-modules")).router,
    ViewManager: (require("app-modules")).viewManager,
    Language: (require("app-modules")).language,
    External: (require("app-modules")).external,
    Resources: {
      Config: require("app-config"),
      Helpers: require("app-helpers"),
      Library: require("app-libs"),
      Models: require("app-models"),
      Views: require("app-views")
    },
    instance: null
  };

  /*
  ## class *Main*
  This class represents the main class of the app. There should be only one
  instance of this class during a user's window session.
   */
  Main = (function() {
    Main.prototype.name = "[app]";


    /*
    ## *constructor():*
    This function starts of the app by initializing it's various components.
     */

    function Main() {
      ($("#page-loader")).hide();
      this.decodeData();
      this.applyBackboneHacks();
      this.initializeListeners();
      this.initializeResources();
      this.initializeViews();
      this.initializeBackBone();
    }


    /*
    ## *initializeViews():*
    This function initializes the *ViewManager* and the *Router* which in
    turn initialize all the other subviews
     */

    Main.prototype.initializeViews = function() {
      console.log(this.name, 'initializing views');
      return this.ViewManager = new App.ViewManager(this.resources);
    };


    /*
    ## *inintializeListeners():*
    This function initializes the various listeners for the App. (Probably not
    needed)
     */

    Main.prototype.initializeListeners = function() {
      console.log(this.name, 'initializing listeners');
      return _.extend(this, Backbone.Events);
    };


    /*
    ## *decodeServerData():*
    This function decodes the data that is passed from the server-side. This
    data is simple base64 encoded and so this function simply base64 decodes it.
     */

    Main.prototype.decodeData = function() {
      var base64;
      console.log(this.name, 'decoding base64 encode data');
      base64 = App.Resources.Library.base64;
      return window.data = JSON.parse(base64.decode(window.data));
    };


    /*
    ## *initializeBackBone():*
    Initializes the Backbone components. Basically the router is only thing
    that needs to be started, so we start the *Backbone.history* here.
     */

    Main.prototype.initializeBackBone = function() {
      return Backbone.history.start({
        pushState: true,
        hashChange: false,
        root: '/'
      });
    };


    /*
    ## *applyBackboneHacks():*
    Probably one of the most useful functions in the code. This function
    rewrites some of the Backbone components such as the Backbone View and Model
    so that extra features are made available to it. View the content for more
    explanation.
     */

    Main.prototype.applyBackboneHacks = function() {
      var backboneSync, newModelProperties, newSync, newViewProperties;
      console.log(this.name, 'applying Backbone hacks');
      backboneSync = Backbone.sync;
      newSync = function(method, model, options) {
        options.beforeSend = function(xhr) {
          var captcha;
          captcha = ($('[name="g-recaptcha-response"]')).val();
          if (captcha) {
            xhr.setRequestHeader('x-gcaptcha', captcha);
          }
          return xhr.setRequestHeader('x-csrf-skipper');
        };
        return backboneSync(method, model, options);
      };
      Backbone.sync = newSync;
      newViewProperties = (require("app-views")).BackboneView;
      _.extend(Backbone.View.prototype, newViewProperties);
      newModelProperties = (require("app-models")).BackboneModel;
      _.extend(Backbone.Model.prototype, newModelProperties);
      return _.extend(Backbone.Collection.prototype, newModelProperties);
    };

    Main.prototype.initializeResources = function() {
      var asyncCounter, setAndCheckCounter;
      console.log(this.name, 'initializing resources');
      this.resources = App.Resources;
      this.resources.cache = new App.Cache;
      this.resources.categories = new App.Resources.Models.categories;
      this.resources.currentUser = new App.Resources.Models.user;
      this.resources.locations = new App.Resources.Models.locations;
      this.resources.language = new App.Language;
      this.Router = new App.Router;
      this.resources.router = this.Router;
      this.resources.router.resources = this.resources;
      this.resources.external = App.External;
      this.resources.currentView = App.ViewManager.currentView;
      this.resources.categories.resources = this.resources;
      this.resources.locations.resources = this.resources;
      this.resources.currentUser.resources = this.resources;
      asyncCounter = 4;
      setAndCheckCounter = (function(_this) {
        return function() {
          asyncCounter--;
          if (asyncCounter <= 0) {
            return _this.ViewManager.start();
          }
        };
      })(this);
      this.listenToOnce(this.resources.categories, 'synced', setAndCheckCounter);
      this.listenToOnce(this.resources.currentUser, 'synced', setAndCheckCounter);
      this.listenToOnce(this.resources.language, 'synced', setAndCheckCounter);
      this.listenToOnce(this.resources.locations, 'synced', setAndCheckCounter);
      this.resources.categories.fetch();
      this.resources.currentUser.fetch();
      this.resources.language.fetch();
      return this.resources.locations.fetch();
    };

    return Main;

  })();

  /*
  **Main Javascript Execution starts here**
  The code below initializes the foundation library and the App itself.
   */
  ($(window)).ready(function() {
    var $this;
    console.log('[foundation] initializing');
    $this = $(document);
    $this.foundation();
    return window.App.instance = new Main(window.App);
  });
} else {
  console.log("[lib] app already defined. stopping re-execution of script");
}

},{"app-config":1,"app-helpers":6,"app-libs":13,"app-models":21,"app-modules":30,"app-views":40}],3:[function(require,module,exports){
module.exports = {
  setHeaders: function(request) {
    var captcha;
    request.setRequestHeader('x-ajax', 'json');
    request.setRequestHeader('x-csrf-skipper', true);
    request.setRequestHeader('csrf-token', window._csrf);
    captcha = ($('[name="g-recaptcha-response"]')).val();
    if (captcha) {
      return request.setRequestHeader('x-gcaptcha', captcha);
    }
  }
};

},{}],4:[function(require,module,exports){
var cookie;

module.exports = cookie = {
  createCookie: function(name, value, days) {
    var date, expires;
    if (days) {
      date = new Date;
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + (date.toGMTString());
    } else {
      expires = "";
    }
    return document.cookie = name + "=" + value + expires + "; path=/";
  },
  readCookie: function(name) {
    var c, ca, i, nameEQ;
    nameEQ = name + "=";
    ca = document.cookie.split(';');
    i = 0;
    while (i < ca.length) {
      c = ca[i];
      while ((c.charAt(0)) === ' ') {
        c = c.substring(1, c.length);
      }
      if ((c.indexOf(nameEQ)) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
      i++;
    }
  },
  eraseCookie: function(name) {
    return this.createCookie(name, '', -1);
  }
};

},{}],5:[function(require,module,exports){
var createHandler, getArabicNoun;

getArabicNoun = function(noun) {
  var dict;
  dict = {
    'second': 'ثانية',
    'minute': 'دقيقة',
    'hour': 'ساعات',
    'day': 'أيام',
    'week': 'أسابيع',
    'month': 'أشهر',
    'year': 'سنوات'
  };
  return dict[noun];
};

createHandler = function(divisor, noun, restOfString) {
  return function(diff) {
    var arabicNoun, arabicNum, lang, n, pluralizedNoun;
    lang = App.Resources.language;
    n = Math.floor(diff / divisor);
    if (lang.currentLanguage === 'ar') {
      arabicNum = App.Resources.Helpers.numbers.toArabic(n);
      arabicNoun = getArabicNoun(noun);
      return arabicNum + " " + arabicNoun;
    } else {
      pluralizedNoun = "" + noun + (n > 1 ? 's' : '');
      return n + " " + pluralizedNoun + " " + restOfString;
    }
  };
};

module.exports = {
  prettify: function(date_raw) {
    var date, diff, formatters, i, now;
    formatters = [
      {
        threshold: 1,
        handler: function() {
          return 'just now';
        }
      }, {
        threshold: 60,
        handler: createHandler(1, 'second', 'ago')
      }, {
        threshold: 3600,
        handler: createHandler(60, 'minute', 'ago')
      }, {
        threshold: 86400,
        handler: createHandler(3600, 'hour', 'ago')
      }, {
        threshold: 172800,
        handler: function() {
          return 'yesterday';
        }
      }, {
        threshold: 604800,
        handler: createHandler(86400, 'day', 'ago')
      }, {
        threshold: 2592000,
        handler: createHandler(604800, 'week', 'ago')
      }, {
        threshold: 31536000,
        handler: createHandler(2592000, 'month', 'ago')
      }, {
        threshold: Infinity,
        handler: createHandler(31536000, 'year', 'ago')
      }
    ];
    date = new Date(date_raw);
    now = new Date;
    diff = (now.getTime() - date.getTime()) / 1000;
    i = 0;
    while (i < formatters.length) {
      if (diff < formatters[i].threshold) {
        return formatters[i].handler(diff);
      }
      i++;
    }
    return '';
  }
};

},{}],6:[function(require,module,exports){
module.exports = {
  ajax: require('./ajax'),
  cookie: require('./cookie'),
  date: require('./date'),
  numbers: require('./numbers'),
  url: require('./url'),
  validator: require('./validator')
};

},{"./ajax":3,"./cookie":4,"./date":5,"./numbers":7,"./url":8,"./validator":9}],7:[function(require,module,exports){
module.exports = {
  withCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  toArabic: function(n) {
    var id, number;
    id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    number = n.toString();
    return number.replace(/[0-9]/g, function(w) {
      return id[+w];
    });
  }
};

},{}],8:[function(require,module,exports){
module.exports = {
  serializeGET: function(obj) {
    var p, str;
    str = [];
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push((encodeURIComponent(p)) + "=" + (encodeURIComponent(obj[p])));
      }
    }
    return str.join('&');
  },
  getPlainPath: function() {
    var url;
    url = document.URL;
    if ((url.indexOf('?')) > -1) {
      url = url.substr(0, url.indexOf('?'));
    }
    if ((url.indexOf('#')) > -1) {
      url = url.substr(0, url.indexOf('#'));
    }
    return url;
  },
  getGETstring: function(url) {
    if (!url) {
      url = document.URL;
    }
    if ((url.indexOf('?')) > -1) {
      return url.substr(url.indexOf('?'), url.length);
    }
    return '';
  },
  getParam: function(name) {
    var regex, results, url;
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    url = window.location.search;
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(url);
    if (results === null) {
      return '';
    } else {
      return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
  },
  reconstruct: function(get_data) {
    return (this.getPlainPath()) + "?" + (this.serializeGET(get_data));
  },
  insertParam: function(paramName, paramValue) {
    var prefix, suffix, url;
    url = window.location.href;
    if ((url.indexOf(paramName + "=")) >= 0) {
      prefix = url.substring(0, url.indexOf(paramName));
      suffix = url.substring(url.indexOf(paramName));
      suffix = (suffix.substring(suffix.indexOf('='))) + 1;
      suffix = (suffix.indexOf('&')) >= 0 ? suffix.substring(suffix.indexOf('&')) : '';
      url = prefix + paramName + '=' + paramValue + suffix;
    } else {
      if ((url.indexOf('?')) < 0) {
        url += "?" + paramName + "=" + paramValue;
      } else {
        url += "&" + paramName + "=" + paramValue;
      }
    }
    return url;
  },
  href: function(url) {
    return "/" + window.lang + "/" + url;
  }
};

},{}],9:[function(require,module,exports){
module.exports = {
  email: function(email) {
    var re;
    re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }
};

},{}],10:[function(require,module,exports){
/*!
 * jQuery Smart Banner
 * Copyright (c) 2012 Arnold Daniels <arnold@jasny.net>
 * Based on 'jQuery Smart Web App Banner' by Kurt Zenisek @ kzeni.com
 */
!function ($) {
    var SmartBanner = function (options) {
        this.origHtmlMargin = parseFloat($('html').css('margin-top')) // Get the original margin-top of the HTML element so we can take that into account
        this.options = $.extend({}, $.smartbanner.defaults, options)

        var standalone = navigator.standalone // Check if it's already a standalone web app or running within a webui view of an app (not mobile safari)
          , UA = navigator.userAgent

        // Detect banner type (iOS or Android)
        if (this.options.force) {
            this.type = this.options.force
        } else if (UA.match(/Windows Phone 8/i) != null && UA.match(/Touch/i) !== null) {
            this.type = 'windows'
        } else if (UA.match(/iPhone|iPod/i) != null || (UA.match(/iPad/) && this.options.iOSUniversalApp)) {
            if (UA.match(/Safari/i) != null &&
               (UA.match(/CriOS/i) != null ||
               window.Number(UA.substr(UA.indexOf('OS ') + 3, 3).replace('_', '.')) < 6)) this.type = 'ios' // Check webview and native smart banner support (iOS 6+)
        } else if (UA.match(/\bSilk\/(.*\bMobile Safari\b)?/) || UA.match(/\bKF\w/) || UA.match('Kindle Fire')) {
            this.type = 'kindle'
        } else if (UA.match(/Android/i) != null) {
            this.type = 'android'
        }

        // Don't show banner if device isn't iOS or Android, website is loaded in app or user dismissed banner
        if (!this.type || standalone || this.getCookie('sb-closed') || this.getCookie('sb-installed')) {
            return
        }

        // Calculate scale
        this.scale = this.options.scale == 'auto' ? $(window).width() / window.screen.width : this.options.scale
        if (this.scale < 1) this.scale = 1

        // Get info from meta data
        var meta = $(this.type == 'android' ? 'meta[name="google-play-app"]' :
            this.type == 'ios' ? 'meta[name="apple-itunes-app"]' :
            this.type == 'kindle' ? 'meta[name="kindle-fire-app"]' : 'meta[name="msApplication-ID"]');
        if (meta.length == 0) return

        // For Windows Store apps, get the PackageFamilyName for protocol launch
        if (this.type == 'windows') {
            this.appId = $('meta[name="msApplication-PackageFamilyName"]').attr('content');
        } else {
            // Try to pull the appId out of the meta tag and store the result
            var parsedMetaContent = /app-id=([^\s,]+)/.exec(meta.attr('content'));

            if(parsedMetaContent) {
              this.appId = parsedMetaContent[1];
            } else {
              return;
            }
        }

        this.title = this.options.title ? this.options.title : meta.data('title') || $('title').text().replace(/\s*[|\-·].*$/, '')
        this.author = this.options.author ? this.options.author : meta.data('author') || ($('meta[name="author"]').length ? $('meta[name="author"]').attr('content') : window.location.hostname)
        this.iconUrl = meta.data('icon-url');
        this.price = meta.data('price');

        // Create banner
        this.create()
        this.show()
        this.listen()
    }

    SmartBanner.prototype = {

        constructor: SmartBanner

      , create: function() {
            var iconURL
              , link=(this.options.url ? this.options.url : (this.type == 'windows' ? 'ms-windows-store:navigate?appid=' : (this.type == 'android' ? 'market://details?id=' : (this.type == 'kindle' ? 'amzn://apps/android?asin=' : 'https://itunes.apple.com/' + this.options.appStoreLanguage + '/app/id'))) + this.appId)
              , price = this.price || this.options.price
              , inStore=price ? price + ' - ' + (this.type == 'android' ? this.options.inGooglePlay : this.type == 'kindle' ? this.options.inAmazonAppStore : this.type == 'ios' ? this.options.inAppStore : this.options.inWindowsStore) : ''
              , gloss=this.options.iconGloss === null ? (this.type=='ios') : this.options.iconGloss

            if (this.type == 'android' && this.options.GooglePlayParams) {
              link = link + '&referrer=' + this.options.GooglePlayParams;
            }

            var banner = '<div id="smartbanner" class="'+this.type+'"><div class="sb-container"><a href="#" class="sb-close">&times;</a><span class="sb-icon"></span><div class="sb-info"><strong>'+this.title+'</strong><span>'+this.author+'</span><span>'+inStore+'</span></div><a href="'+link+'" class="sb-button"><span>'+this.options.button+'</span></a></div></div>';
            (this.options.layer) ? $(this.options.appendToSelector).append(banner) : $(this.options.appendToSelector).prepend(banner);

            if (this.options.icon) {
                iconURL = this.options.icon
            } else if(this.iconUrl) {
                iconURL = this.iconUrl;
            } else if ($('link[rel="apple-touch-icon-precomposed"]').length > 0) {
                iconURL = $('link[rel="apple-touch-icon-precomposed"]').attr('href')
                if (this.options.iconGloss === null) gloss = false
            } else if ($('link[rel="apple-touch-icon"]').length > 0) {
                iconURL = $('link[rel="apple-touch-icon"]').attr('href')
            } else if ($('meta[name="msApplication-TileImage"]').length > 0) {
              iconURL = $('meta[name="msApplication-TileImage"]').attr('content')
            } else if ($('meta[name="msapplication-TileImage"]').length > 0) { /* redundant because ms docs show two case usages */
              iconURL = $('meta[name="msapplication-TileImage"]').attr('content')
            }

            if (iconURL) {
                $('#smartbanner .sb-icon').css('background-image','url('+iconURL+')')
                if (gloss) $('#smartbanner .sb-icon').addClass('gloss')
            } else{
                $('#smartbanner').addClass('no-icon')
            }

            this.bannerHeight = $('#smartbanner').outerHeight() + 2

            if (this.scale > 1) {
                $('#smartbanner')
                    .css('top', parseFloat($('#smartbanner').css('top')) * this.scale)
                    .css('height', parseFloat($('#smartbanner').css('height')) * this.scale)
                    .hide()
                $('#smartbanner .sb-container')
                    .css('-webkit-transform', 'scale('+this.scale+')')
                    .css('-msie-transform', 'scale('+this.scale+')')
                    .css('-moz-transform', 'scale('+this.scale+')')
                    .css('width', $(window).width() / this.scale)
            }
            $('#smartbanner').css('position', (this.options.layer) ? 'absolute' : 'static')
        }

      , listen: function () {
            $('#smartbanner .sb-close').on('click',$.proxy(this.close, this))
            $('#smartbanner .sb-button').on('click',$.proxy(this.install, this))
        }

      , show: function(callback) {
            var banner = $('#smartbanner');
            banner.stop();

            if (this.options.layer) {
                banner.animate({top: 0, display: 'block'}, this.options.speedIn).addClass('shown').show();
                $(this.pushSelector).animate({paddingTop: this.origHtmlMargin + (this.bannerHeight * this.scale)}, this.options.speedIn, 'swing', callback);
            } else {
                if ($.support.transition) {
                    banner.animate({top:0},this.options.speedIn).addClass('shown');
                    var transitionCallback = function() {
                        $('html').removeClass('sb-animation');
                        if (callback) {
                            callback();
                        }
                    };
                    $(this.pushSelector).addClass('sb-animation').one($.support.transition.end, transitionCallback).emulateTransitionEnd(this.options.speedIn).css('margin-top', this.origHtmlMargin+(this.bannerHeight*this.scale));
                } else {
                    banner.slideDown(this.options.speedIn).addClass('shown');
                }
            }
        }

      , hide: function(callback) {
            var banner = $('#smartbanner');
            banner.stop();

            if (this.options.layer) {
                banner.animate({top: -1 * this.bannerHeight * this.scale, display: 'block'}, this.options.speedIn).removeClass('shown');
                $(this.pushSelector).animate({paddingTop: this.origHtmlMargin}, this.options.speedIn, 'swing', callback);
            } else {
                if ($.support.transition) {
                    if ( this.type !== 'android' )
                      banner.css('top', -1*this.bannerHeight*this.scale).removeClass('shown');
                    else
                      banner.css({display:'none'}).removeClass('shown');
                    var transitionCallback = function() {
                        $('html').removeClass('sb-animation');
                        if (callback) {
                            callback();
                        }
                    };
                    $(this.pushSelector).addClass('sb-animation').one($.support.transition.end, transitionCallback).emulateTransitionEnd(this.options.speedOut).css('margin-top', this.origHtmlMargin);
                } else {
                    banner.slideUp(this.options.speedOut).removeClass('shown');
                }
            }
        }

      , close: function(e) {
            e.preventDefault()
            this.hide()
            this.setCookie('sb-closed','true',this.options.daysHidden);
        }

      , install: function(e) {
      if (this.options.hideOnInstall) {
        this.hide()
      }
            this.setCookie('sb-installed','true',this.options.daysReminder)
        }

      , setCookie: function(name, value, exdays) {
            var exdate = new Date()
            exdate.setDate(exdate.getDate()+exdays)
            value=encodeURI(value)+((exdays==null)?'':'; expires='+exdate.toUTCString())
            document.cookie=name+'='+value+'; path=/;'
        }

      , getCookie: function(name) {
            var i,x,y,ARRcookies = document.cookie.split(";")
            for(i=0;i<ARRcookies.length;i++) {
                x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="))
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1)
                x = x.replace(/^\s+|\s+$/g,"")
                if (x==name) {
                    return decodeURI(y)
                }
            }
            return null
        }

      // Demo only
      , switchType: function() {
          var that = this

          this.hide(function () {
              that.type = that.type == 'android' ? 'ios' : 'android'
              var meta = $(that.type == 'android' ? 'meta[name="google-play-app"]' : 'meta[name="apple-itunes-app"]').attr('content')
              that.appId = /app-id=([^\s,]+)/.exec(meta)[1]

              $('#smartbanner').detach()
              that.create()
              that.show()
          })
      }
    }

    $.smartbanner = function (option) {
        var $window = $(window)
        , data = $window.data('smartbanner')
        , options = typeof option == 'object' && option
        if (!data) $window.data('smartbanner', (data = new SmartBanner(options)))
        if (typeof option == 'string') data[option]()
    }

    // override these globally if you like (they are all optional)
    $.smartbanner.defaults = {
        title: null, // What the title of the app should be in the banner (defaults to <title>)
        author: null, // What the author of the app should be in the banner (defaults to <meta name="author"> or hostname)
        price: 'FREE', // Price of the app
        appStoreLanguage: 'us', // Language code for App Store
        inAppStore: 'On the App Store', // Text of price for iOS
        inGooglePlay: 'In Google Play', // Text of price for Android
        inAmazonAppStore: 'In the Amazon Appstore',
        inWindowsStore: 'In the Windows Store', //Text of price for Windows
        GooglePlayParams: null, // Aditional parameters for the market
        icon: null, // The URL of the icon (defaults to <meta name="apple-touch-icon">)
        iconGloss: null, // Force gloss effect for iOS even for precomposed
        button: 'VIEW', // Text for the install button
        url: null, // The URL for the button. Keep null if you want the button to link to the app store.
        scale: 'auto', // Scale based on viewport size (set to 1 to disable)
        speedIn: 300, // Show animation speed of the banner
        speedOut: 400, // Close animation speed of the banner
        daysHidden: 15, // Duration to hide the banner after being closed (0 = always show banner)
        daysReminder: 90, // Duration to hide the banner after "VIEW" is clicked *separate from when the close button is clicked* (0 = always show banner)
        force: null, // Choose 'ios', 'android' or 'windows'. Don't do a browser check, just always show this banner
        hideOnInstall: true, // Hide the banner after "VIEW" is clicked.
        layer: true, // Display as overlay layer or slide down the page
        iOSUniversalApp: true, // If the iOS App is a universal app for both iPad and iPhone, display Smart Banner to iPad users, too.
        appendToSelector: 'body', //Append the banner to a specific selector
    pushSelector: 'html' // What element is going to push the site content down; this is where the banner append animation will start.
    }

    $.smartbanner.Constructor = SmartBanner;


    // ============================================================
    // Bootstrap transition
    // Copyright 2011-2014 Twitter, Inc.
    // Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)

    function transitionEnd() {
        var el = document.createElement('smartbanner')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {end: transEndEventNames[name]}
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    if ($.support.transition !== undefined)
        return  // Prevent conflict with Twitter Bootstrap

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false, $el = this
        $(this).one($.support.transition.end, function() {
            called = true
        })
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function() {
        $.support.transition = transitionEnd()
    })
    // ============================================================

}(window.jQuery);
},{}],11:[function(require,module,exports){

/*
 * Copyright (c) 2010 Nick Galbreath
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
#
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
#
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
#
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* base64 encode/decode compatible with window.btoa/atob
#
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
#
 * It is also found in Safari and Chrome.  It is not available in IE.
#
 * if (!window.btoa) window.btoa = base64.encode
 * if (!window.atob) window.atob = base64.decode
#
 * The original spec's for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
#
 * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an DOMException(5) is thrown.
#
 * window.atob and base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an DOMException(5) is thrown.
 */
var base64;

module.exports = base64 = {};

base64.PADCHAR = '=';

base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

base64.makeDOMException = function() {
  var e, ex, tmp;
  e = void 0;
  tmp = void 0;
  try {
    return new DOMException(DOMException.INVALID_CHARACTER_ERR);
  } catch (_error) {
    tmp = _error;
    ex = new Error('DOM Exception 5');
    ex.code = ex.number = 5;
    ex.name = ex.description = 'INVALID_CHARACTER_ERR';
    ex.toString = function() {
      return 'Error: ' + ex.name + ': ' + ex.message;
    };
    return ex;
  }
};

base64.getbyte64 = function(s, i) {
  var idx;
  idx = base64.ALPHA.indexOf(s.charAt(i));
  if (idx === -1) {
    throw base64.makeDOMException();
  }
  return idx;
};

base64.decode = function(s) {
  var b10, getbyte64, i, imax, pads, x;
  s = '' + s;
  getbyte64 = base64.getbyte64;
  pads = void 0;
  i = void 0;
  b10 = void 0;
  imax = s.length;
  if (imax === 0) {
    return s;
  }
  if (imax % 4 !== 0) {
    throw base64.makeDOMException();
  }
  pads = 0;
  if (s.charAt(imax - 1) === base64.PADCHAR) {
    pads = 1;
    if (s.charAt(imax - 2) === base64.PADCHAR) {
      pads = 2;
    }
    imax -= 4;
  }
  x = [];
  i = 0;
  while (i < imax) {
    b10 = getbyte64(s, i) << 18 | getbyte64(s, i + 1) << 12 | getbyte64(s, i + 2) << 6 | getbyte64(s, i + 3);
    x.push(String.fromCharCode(b10 >> 16, b10 >> 8 & 0xff, b10 & 0xff));
    i += 4;
  }
  switch (pads) {
    case 1:
      b10 = getbyte64(s, i) << 18 | getbyte64(s, i + 1) << 12 | getbyte64(s, i + 2) << 6;
      x.push(String.fromCharCode(b10 >> 16, b10 >> 8 & 0xff));
      break;
    case 2:
      b10 = getbyte64(s, i) << 18 | getbyte64(s, i + 1) << 12;
      x.push(String.fromCharCode(b10 >> 16));
  }
  return x.join('');
};

base64.getbyte = function(s, i) {
  var x;
  x = s.charCodeAt(i);
  if (x > 255) {
    throw base64.makeDOMException();
  }
  return x;
};

base64.encode = function(s) {
  var alpha, b10, getbyte, i, imax, padchar, x;
  if (arguments.length !== 1) {
    throw new SyntaxError('Not enough arguments');
  }
  padchar = base64.PADCHAR;
  alpha = base64.ALPHA;
  getbyte = base64.getbyte;
  i = void 0;
  b10 = void 0;
  x = [];
  s = '' + s;
  imax = s.length - s.length % 3;
  if (s.length === 0) {
    return s;
  }
  i = 0;
  while (i < imax) {
    b10 = getbyte(s, i) << 16 | getbyte(s, i + 1) << 8 | getbyte(s, i + 2);
    x.push(alpha.charAt(b10 >> 18));
    x.push(alpha.charAt(b10 >> 12 & 0x3F));
    x.push(alpha.charAt(b10 >> 6 & 0x3f));
    x.push(alpha.charAt(b10 & 0x3f));
    i += 3;
  }
  switch (s.length - imax) {
    case 1:
      b10 = getbyte(s, i) << 16;
      x.push(alpha.charAt(b10 >> 18) + alpha.charAt(b10 >> 12 & 0x3F) + padchar + padchar);
      break;
    case 2:
      b10 = getbyte(s, i) << 16 | getbyte(s, i + 1) << 8;
      x.push(alpha.charAt(b10 >> 18) + alpha.charAt(b10 >> 12 & 0x3F) + alpha.charAt(b10 >> 6 & 0x3f) + padchar);
  }
  return x.join('');
};

},{}],12:[function(require,module,exports){

/*
Here's the meat and potatoes. Usage

  imageLoader('imgId',{
      success : function () { alert(this.width); },
      failure : function () { alert('Damn your eyes!'); },
  });

  imageLoader('http://somedomain.com/image/typooed_url.jpg', {
      success : function () {...},
      failure : function () {...},
      target : jQuery DOM,
  });
 */
module.exports = function(src, cfg) {
  var $, img, isType, prop;
  $ = function(id) {
    if (!id || id.nodeType === 1) {
      return id;
    } else {
      return document.getElementById(id);
    }
  };
  isType = function(o, t) {
    return (typeof o).indexOf(t.charAt(0).toLowerCase()) === 0;
  };
  cfg = cfg || (isType(src, 'o') ? src : {});
  img = document.createElement('img');
  src = src || cfg.src;
  if (!src) {
    throw 'Image source not found';
  }
  prop = isType(img.naturalWidth, 'u') ? 'width' : 'naturalWidth';
  img.alt = cfg.alt || img.alt;
  img.src = src;
  if (cfg.target) {
    cfg.target.append(img);
  }
  if (img.complete) {
    if (img[prop]) {
      if (isType(cfg.success, 'f')) {
        cfg.success.call(img);
      }
    } else {
      if (isType(cfg.failure, 'f')) {
        cfg.failure.call(img);
      }
    }
  } else {
    if (isType(cfg.success, 'f')) {
      img.onload = cfg.success;
    }
    if (isType(cfg.failure, 'f')) {
      img.onerror = cfg.failure;
    }
  }
  return img;
};

},{}],13:[function(require,module,exports){
module.exports = {
  md5: require("./md5"),
  banner: require("./banner"),
  imageLoader: require("./imageLoader"),
  base64: require("./base64")
};

},{"./banner":10,"./base64":11,"./imageLoader":12,"./md5":14}],14:[function(require,module,exports){
var add32, cmn, ff, gg, hex, hex_chr, hh, ii, md51, md5blk, md5cycle, rhex;

hex_chr = '0123456789abcdef'.split('');

md5cycle = function(x, k) {
  var a, b, c, d;
  a = x[0];
  b = x[1];
  c = x[2];
  d = x[3];
  a = ff(a, b, c, d, k[0], 7, -680876936);
  d = ff(d, a, b, c, k[1], 12, -389564586);
  c = ff(c, d, a, b, k[2], 17, 606105819);
  b = ff(b, c, d, a, k[3], 22, -1044525330);
  a = ff(a, b, c, d, k[4], 7, -176418897);
  d = ff(d, a, b, c, k[5], 12, 1200080426);
  c = ff(c, d, a, b, k[6], 17, -1473231341);
  b = ff(b, c, d, a, k[7], 22, -45705983);
  a = ff(a, b, c, d, k[8], 7, 1770035416);
  d = ff(d, a, b, c, k[9], 12, -1958414417);
  c = ff(c, d, a, b, k[10], 17, -42063);
  b = ff(b, c, d, a, k[11], 22, -1990404162);
  a = ff(a, b, c, d, k[12], 7, 1804603682);
  d = ff(d, a, b, c, k[13], 12, -40341101);
  c = ff(c, d, a, b, k[14], 17, -1502002290);
  b = ff(b, c, d, a, k[15], 22, 1236535329);
  a = gg(a, b, c, d, k[1], 5, -165796510);
  d = gg(d, a, b, c, k[6], 9, -1069501632);
  c = gg(c, d, a, b, k[11], 14, 643717713);
  b = gg(b, c, d, a, k[0], 20, -373897302);
  a = gg(a, b, c, d, k[5], 5, -701558691);
  d = gg(d, a, b, c, k[10], 9, 38016083);
  c = gg(c, d, a, b, k[15], 14, -660478335);
  b = gg(b, c, d, a, k[4], 20, -405537848);
  a = gg(a, b, c, d, k[9], 5, 568446438);
  d = gg(d, a, b, c, k[14], 9, -1019803690);
  c = gg(c, d, a, b, k[3], 14, -187363961);
  b = gg(b, c, d, a, k[8], 20, 1163531501);
  a = gg(a, b, c, d, k[13], 5, -1444681467);
  d = gg(d, a, b, c, k[2], 9, -51403784);
  c = gg(c, d, a, b, k[7], 14, 1735328473);
  b = gg(b, c, d, a, k[12], 20, -1926607734);
  a = hh(a, b, c, d, k[5], 4, -378558);
  d = hh(d, a, b, c, k[8], 11, -2022574463);
  c = hh(c, d, a, b, k[11], 16, 1839030562);
  b = hh(b, c, d, a, k[14], 23, -35309556);
  a = hh(a, b, c, d, k[1], 4, -1530992060);
  d = hh(d, a, b, c, k[4], 11, 1272893353);
  c = hh(c, d, a, b, k[7], 16, -155497632);
  b = hh(b, c, d, a, k[10], 23, -1094730640);
  a = hh(a, b, c, d, k[13], 4, 681279174);
  d = hh(d, a, b, c, k[0], 11, -358537222);
  c = hh(c, d, a, b, k[3], 16, -722521979);
  b = hh(b, c, d, a, k[6], 23, 76029189);
  a = hh(a, b, c, d, k[9], 4, -640364487);
  d = hh(d, a, b, c, k[12], 11, -421815835);
  c = hh(c, d, a, b, k[15], 16, 530742520);
  b = hh(b, c, d, a, k[2], 23, -995338651);
  a = ii(a, b, c, d, k[0], 6, -198630844);
  d = ii(d, a, b, c, k[7], 10, 1126891415);
  c = ii(c, d, a, b, k[14], 15, -1416354905);
  b = ii(b, c, d, a, k[5], 21, -57434055);
  a = ii(a, b, c, d, k[12], 6, 1700485571);
  d = ii(d, a, b, c, k[3], 10, -1894986606);
  c = ii(c, d, a, b, k[10], 15, -1051523);
  b = ii(b, c, d, a, k[1], 21, -2054922799);
  a = ii(a, b, c, d, k[8], 6, 1873313359);
  d = ii(d, a, b, c, k[15], 10, -30611744);
  c = ii(c, d, a, b, k[6], 15, -1560198380);
  b = ii(b, c, d, a, k[13], 21, 1309151649);
  a = ii(a, b, c, d, k[4], 6, -145523070);
  d = ii(d, a, b, c, k[11], 10, -1120210379);
  c = ii(c, d, a, b, k[2], 15, 718787259);
  b = ii(b, c, d, a, k[9], 21, -343485551);
  x[0] = add32(a, x[0]);
  x[1] = add32(b, x[1]);
  x[2] = add32(c, x[2]);
  x[3] = add32(d, x[3]);
};

cmn = function(q, a, b, x, s, t) {
  a = add32(add32(a, q), add32(x, t));
  return add32(a << s | a >>> 32 - s, b);
};

ff = function(a, b, c, d, x, s, t) {
  return cmn(b & c | ~b & d, a, b, x, s, t);
};

gg = function(a, b, c, d, x, s, t) {
  return cmn(b & d | c & ~d, a, b, x, s, t);
};

hh = function(a, b, c, d, x, s, t) {
  return cmn(b ^ c ^ d, a, b, x, s, t);
};

ii = function(a, b, c, d, x, s, t) {
  return cmn(c ^ (b | ~d), a, b, x, s, t);
};

md51 = function(s) {
  var i, n, state, tail, txt;
  txt = '';
  n = s.length;
  state = [1732584193, -271733879, -1732584194, 271733878];
  i = void 0;
  i = 64;
  while (i <= s.length) {
    md5cycle(state, md5blk(s.substring(i - 64, i)));
    i += 64;
  }
  s = s.substring(i - 64);
  tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  i = 0;
  while (i < s.length) {
    tail[i >> 2] |= s.charCodeAt(i) << i % 4 << 3;
    i++;
  }
  tail[i >> 2] |= 0x80 << i % 4 << 3;
  if (i > 55) {
    md5cycle(state, tail);
    i = 0;
    while (i < 16) {
      tail[i] = 0;
      i++;
    }
  }
  tail[14] = n * 8;
  md5cycle(state, tail);
  return state;
};


/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */

md5blk = function(s) {

  /* I figured global was faster. */
  var i, md5blks;
  md5blks = [];
  i = void 0;

  /* Andy King said do it this way. */
  i = 0;
  while (i < 64) {
    md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    i += 4;
  }
  return md5blks;
};

rhex = function(n) {
  var j, s;
  s = '';
  j = 0;
  while (j < 4) {
    s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
    j++;
  }
  return s;
};

hex = function(x) {
  var i;
  i = 0;
  while (i < x.length) {
    x[i] = rhex(x[i]);
    i++;
  }
  return x.join('');
};


/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.
 */

add32 = function(a, b) {
  return a + b & 0xFFFFFFFF;
};

module.exports = function(s) {
  return hex(md51(s));
};

},{}],15:[function(require,module,exports){

/*
**MainView**
------------

TODO: Rewrite this

This is the base view for all pages in the App. All pages must inherit
the properties in the view.

The different functions and properties defined
here get used by the ViewManager controller and enables the controller to
neatly cleanup and restart views.
 */
module.exports = {
  idAttribute: "_id",

  /*
  ## *initialize():*
  This function gets called by Backbone whenever we instantiate an Object from
  this view. Here we setup some common resources for all our child
  models to play with.
   */
  initialize: function(options) {
    if (options == null) {
      options = {};
    }
    this.resources = App.Resources;
    return this.start();
  },
  start: function() {},

  /*
  ## *name:*
  Here goes the name of the view. This is used in console statements
  to help debug the app. So in your view you would use something like
  
      console.log @name, "Message"
  
  and this makes it easy to filter out console messages generated by that
  view. (Since the app generates alot of console messages)
   */
  name: ""
};

},{}],16:[function(require,module,exports){
var ajax, model;

ajax = (require('app-helpers')).ajax;

model = Backbone.Model.extend({
  idAttribute: "_id",
  defaults: {
    _id: null,
    count: 0,
    name: ''
  }
});

module.exports = Backbone.Collection.extend({
  model: model,
  name: '[model:categories]',
  url: "/api/category",
  initialize: function(config) {
    this.config = config;
    console.log(this.name, 'initializing');
    this.oldFetch = this.fetch;
    this.fetch = function(options) {
      if (!this.cachedFetch(options)) {
        return this.oldFetch(options);
      }
    };
    return this.on('sync', (function(_this) {
      return function() {
        _this.setCache();
        return _this.getCounters(function(error, results) {
          console.log(_this.name, 'synced');
          return _this.trigger('synced');
        });
      };
    })(this));
  },
  setCache: function(value) {
    console.log(this.name, 'caching category details');
    if (!this.resources.cache.get('models:category')) {
      return this.resources.cache.set('models:category', JSON.stringify(this.toJSON()));
    }
  },
  findBySlug: function(slug) {
    var cat, categories, childcat, i, j, len, len1, ref;
    categories = this.toJSON();
    for (i = 0, len = categories.length; i < len; i++) {
      cat = categories[i];
      if (cat.slug === slug) {
        return cat;
      }
      ref = cat.children;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        childcat = ref[j];
        if (childcat.slug === slug) {
          return childcat;
        }
      }
    }
    return {};
  },
  findById: function(id) {
    var cat, categories, childcat, i, j, len, len1, ref;
    categories = this.toJSON();
    for (i = 0, len = categories.length; i < len; i++) {
      cat = categories[i];
      if (cat._id === id) {
        return cat;
      }
      ref = cat.children;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        childcat = ref[j];
        if (childcat._id === id) {
          return childcat;
        }
      }
    }
    return {};
  },
  getChildren: function(parentId) {
    var parent;
    parent = this.find({
      id: parentId
    });
    if (parent) {
      return parent.get('children');
    } else {
      return [];
    }
  },
  cachedFetch: function(options) {
    var cache, json;
    if (options == null) {
      options = {};
    }
    cache = this.resources.cache.get('models:category');
    if (cache) {
      console.log(this.name, 'setting categories from cache');
      json = JSON.parse(cache);
      this.set(json);
      this.trigger('sync');
      return true;
    }
    console.log(this.name, 'fetching from API');
    return false;
  },
  getCounters: function(callback) {
    if (callback == null) {
      callback = function() {};
    }
    return $.ajax({
      type: 'GET',
      url: '/api/category?count=true',
      dataType: 'json',
      beforeSend: ajax.setHeaders,
      success: (function(_this) {
        return function(response) {
          console.log(_this.name, 'fetching category counters');
          _this.setCounters(response);
          return callback(null, response);
        };
      })(this),
      error: (function(_this) {
        return function(response) {
          console.error(_this.name, 'error fetching category counters', response);
          return callback(response);
        };
      })(this)
    });
  },
  setCounters: function(counters) {
    var categories, category, categoryCount, childCategory, i, j, k, l, len, len1, len2, len3, ref, ref1, ref2;
    categories = this.toJSON();
    for (i = 0, len = categories.length; i < len; i++) {
      category = categories[i];
      ref = counters.category;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        categoryCount = ref[j];
        if (categoryCount._id === category._id) {
          category.count = categoryCount.total;
          break;
        } else {
          category.count = 0;
        }
      }
      ref1 = category.children;
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        childCategory = ref1[k];
        ref2 = counters.childCategory;
        for (l = 0, len3 = ref2.length; l < len3; l++) {
          categoryCount = ref2[l];
          if (categoryCount._id === childCategory._id) {
            childCategory.count = categoryCount.total;
            break;
          } else {
            childCategory.count = 0;
          }
        }
      }
    }
    return this.reset(categories);
  }
});

},{"app-helpers":6}],17:[function(require,module,exports){
var ajax, dateHelper, helpers;

helpers = require('app-helpers');

dateHelper = helpers.date;

ajax = helpers.ajax;

module.exports = Backbone.Model.extend({
  idAttribute: "_id",
  name: "[model:classified]",
  url: function() {
    var authHash, id;
    id = this.id;
    authHash = this.get('authHash');
    if (id) {
      return "/api/classified/" + id + "?authHash=" + authHash;
    } else {
      return '/api/classified';
    }
  },
  defaults: {
    _id: null,
    moderatorReason: null,
    authHash: null,
    category: null,
    childCategory: null,
    babyCategory: null,
    created: null,
    description: '',
    guest: true,
    images: [],
    owner: null,
    price: null,
    reports: [],
    location: null,
    status: null,
    title: '',
    type: null,
    views: 0,
    perks: {},
    contact: {},
    meta: {}
  },
  status: {
    INACTIVE: 0,
    ACTIVE: 1,
    REJECTED: 2,
    ARCHIVED: 3,
    BANNED: 4,
    FLAGGED: 5,
    VERIFIED: 6,
    EXPIRED: 7
  },
  initialize: function() {
    return this.bind('parse', this.parseVariables, this);
  },
  parseVariables: function() {
    var category, child, childCategory, date, i, len, location, price, ref, type;
    if (this.attributes.parsed) {
      return;
    }
    this.attributes.parsed = true;
    this.attributes.title = this.escape('title');
    this.attributes.description = this.escape('description');
    type = this.get('type');
    this.attributes.type = type === 0 ? 'Offering' : 'Wanted';
    price = this.get('price');
    this.attributes.price = this.priceFormat(price);
    location = this.get('location');
    location = App.Resources.locations.findWhere({
      _id: location
    });
    if (location) {
      this.attributes.location = location.get('name');
    } else {
      this.attributes.location = null;
    }
    category = this.get('category');
    category = App.Resources.categories.findWhere({
      _id: category
    });
    if (category) {
      this.attributes.category = category.get('name');
      childCategory = this.get('childCategory');
      ref = category.get('children');
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (childCategory === child._id) {
          this.attributes.childCategory = child.name;
        }
      }
    } else {
      this.attributes.category = null;
      this.attributes.childCategory = null;
    }
    date = this.get('created');
    return this.attributes.created = dateHelper.prettify(date);
  },
  uploadServer: function(callback) {
    var authHash, id, json, progressHandler, type, url;
    console.debug(this.name, 'uploading classified details to server', this);
    json = this.toJSON();
    json.files = null;
    progressHandler = (function(_this) {
      return function(event) {
        if (event.lengthComputable) {
          return _this.trigger('ajax:progrss', event.loaded / event.total * 100);
        }
      };
    })(this);
    authHash = this.get('authHash');
    id = this.get('_id');
    if (id) {
      type = 'PUT';
      url = App.Resources.Config.hostname + "/api/classified/" + id + "?authHash=" + authHash;
    } else {
      type = 'POST';
      url = App.Resources.Config.hostname + "/api/classified?authHash=" + authHash;
    }
    return $.ajax({
      beforeSend: ajax.setHeaders,
      contentType: false,
      data: this.getFormData(),
      processData: false,
      type: type,
      url: url,
      xhr: function() {
        var Xhr;
        Xhr = $.ajaxSettings.xhr();
        if (Xhr.upload) {
          Xhr.upload.addEventListener('progress', progressHandler, false);
        }
        return Xhr;
      },
      success: (function(_this) {
        return function(response) {
          if (!response._id) {
            console.error(_this.name, 'error uploading classified', response);
            return _this.trigger('ajax:error', response);
          }
          _this.set(response);
          return callback(null, response);
        };
      })(this),
      error: (function(_this) {
        return function(response) {
          console.error(_this.name, 'error uploading classified details', response);
          return callback(response);
        };
      })(this)
    });
  },
  getFormData: function() {
    var data, file, files, formdata, i, len;
    formdata = new FormData;
    data = this.toJSON();
    files = data.files || [];
    delete data.files;
    formdata.append('data', JSON.stringify(data));
    for (i = 0, len = files.length; i < len; i++) {
      file = files[i];
      formdata.append('files[]', file);
    }
    return formdata;
  },
  priceFormat: function(price) {
    var lang, prettyPrice, translatedPrice;
    lang = App.Resources.language;
    if (price === 0) {
      return lang.get("model.price.free");
    } else if (price === -1) {
      return lang.get("model.price.contact");
    } else if (price != null) {
      prettyPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      translatedPrice = lang.localizeNumber(prettyPrice);
      return translatedPrice + " " + (lang.get('model.price.unit'));
    }
  }
});

},{"app-helpers":6}],18:[function(require,module,exports){
var ajax;

ajax = (require('app-helpers')).ajax;

module.exports = Backbone.Collection.extend({
  name: '[model:classifieds]',
  model: require('./Classified'),
  isAccount: false,
  fetch: function(parameters) {
    var baseUrl, url;
    if (parameters == null) {
      parameters = {};
    }
    if (!this.isAccount) {
      baseUrl = '/api/query?';
    } else {
      baseUrl = '/api/account/manage?';
    }
    url = App.Resources.Config.hostname + baseUrl + $.param(parameters);
    return $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      beforeSend: ajax.setHeaders,
      success: (function(_this) {
        return function(response) {
          var classified, i, len, model, newModels;
          console.log(_this.name, 'fetching classifieds');
          console.debug(_this.name, response);
          newModels = [];
          for (i = 0, len = response.length; i < len; i++) {
            classified = response[i];
            model = new _this.model(classified);
            model.trigger('parse');
            newModels.push(model);
          }
          _this.add(newModels);
          return _this.trigger('ajax:done', newModels);
        };
      })(this),
      error: (function(_this) {
        return function(response) {
          return console.error(_this.name, 'error fetching classifieds', response);
        };
      })(this)
    });
  }
});

},{"./Classified":17,"app-helpers":6}],19:[function(require,module,exports){
var model;

model = Backbone.Model.extend({
  idAttribute: "_id",
  defaults: {
    _id: null,
    name: ''
  }
});

module.exports = Backbone.Collection.extend({
  model: model,
  name: '[model:locations]',
  url: "/api/location",
  initialize: function(config) {
    this.config = config;
    console.log(this.name, 'initializing');
    this.oldFetch = this.fetch;
    this.fetch = function(options) {
      if (!this.cachedFetch(options)) {
        return this.oldFetch(options);
      }
    };
    return this.on('sync', function() {
      this.setCache();
      console.log(this.name, 'synced');
      return this.trigger('synced');
    });
  },
  setCache: function() {
    console.log(this.name, 'caching location details');
    if (!this.resources.cache.get('models:locations')) {
      return this.resources.cache.set('models:locations', JSON.stringify(this.toJSON()));
    }
  },
  cachedFetch: function(options) {
    var cache, json;
    if (options == null) {
      options = {};
    }
    cache = this.resources.cache.get('models:locations');
    if (cache) {
      console.log(this.name, 'setting locations from cache');
      json = JSON.parse(cache);
      this.set(json);
      this.trigger('sync');
      return true;
    }
    console.log(this.name, 'fetching from API');
    return false;
  }
});

},{}],20:[function(require,module,exports){
var ajax, helpers;

helpers = require('app-helpers');

ajax = helpers.ajax;

module.exports = Backbone.Model.extend({
  name: "[model:user]",
  url: function() {
    var id;
    id = this.get('id');
    if (id) {
      return "/api/user/" + id;
    } else {
      return "/api/user";
    }
  },
  defaults: {
    adminReason: '',
    credits: 0,
    description: '',
    email: '',
    isModerator: false,
    language: 0,
    lastLogin: [],
    loginStrategy: 0,
    name: '',
    personal: {},
    status: 0,
    username: ''
  },
  loginStrategies: {
    EMAIL: 0,
    FACEBOOK: 1,
    TWITTER: 2,
    YAHOO: 3,
    GOOGLEPLUS: 4,
    PHONEGAP: 5
  },
  initialize: function() {
    console.log(this.name, 'initializing');
    this.$body = $('body');
    return this.on('sync', (function(_this) {
      return function() {
        console.log(_this.name, 'syncing');
        if (!_this.isAnonymous()) {
          _this.$body.addClass('loggedin');
          _this.$body.removeClass('loggedout');
        } else {
          _this.$body.removeClass('loggedin');
          _this.$body.addClass('loggedout');
        }
        console.log(_this.name, 'synced');
        return _this.trigger('synced');
      };
    })(this));
  },
  login: function(username, password, callback) {
    console.debug(this.name, 'logging in user');
    return $.ajax({
      type: 'POST',
      url: "/api/auth/email/" + username,
      beforeSend: ajax.setHeaders,
      data: {
        username: username,
        password: password
      },
      success: (function(_this) {
        return function(response) {
          console.debug(_this.name, 'user logged in', response);
          _this.set(response);
          _this.trigger('sync', response);
          return callback(null, response);
        };
      })(this),
      error: (function(_this) {
        return function(error) {
          console.error(_this.name, 'error logging in', error);
          return callback(error);
        };
      })(this)
    });
  },
  signup: function(parameters, callback) {
    console.debug(this.name, 'signing up new user');
    return $.ajax({
      type: 'POST',
      url: "/api/auth/email/",
      beforeSend: ajax.setHeaders,
      data: parameters,
      success: function(response) {
        return callback(null, response);
      },
      error: (function(_this) {
        return function(error) {
          console.error(_this.name, 'error creating user', error);
          return callback(error);
        };
      })(this)
    });
  },
  logout: function() {
    $.get("/api/auth/logout/");
    this.clear();
    return this.trigger('sync');
  },
  isAnonymous: function() {
    return !this.has("_id");
  }
});

},{"app-helpers":6}],21:[function(require,module,exports){
module.exports = {
  BackboneModel: require('./Backbone.Model'),
  categories: require('./Categories'),
  classified: require('./Classified'),
  classifieds: require('./Classifieds'),
  locations: require('./Locations'),
  user: require("./User")
};

},{"./Backbone.Model":15,"./Categories":16,"./Classified":17,"./Classifieds":18,"./Locations":19,"./User":20}],22:[function(require,module,exports){

/*
## *Cache* module
This module is responsible for only interacting with the HTML5 localStorage and
providing safe functions to interact with it. This module is key for performance
because it hacks on the localStorage to cache components of the site and
increase responsiveness of the site.

This module in production mode caches all startup scripts and reuses them when
the user navigates to the page for the second time, shortening load time to <
100ms. It also caches data that doesn't change that often like the locations and
the categories of classifieds.
 */
var controller;

module.exports = controller = (function() {
  controller.prototype.name = '[cache]';

  controller.prototype.fallback = false;


  /*
  ## *constructor():*
  Checks the JS version from the server side and setups the local storage
  based on it. If the JS version from the local and the server are
  different, then reset the local storage. Otherwise have the local storage
  cache every page template that it downloads.
  
  Also, if the browser does not support localStorage use fallback methods.
   */

  function controller(app, config) {
    this.config = config;
    console.log(this.name, 'initializing');
    if (typeof Storage !== "undefined" && Storage !== null) {
      this.checkVersions();
      setTimeout(((function(_this) {
        return function() {
          return _this.cacheStartupScripts();
        };
      })(this)), 3000);
    } else {
      this.fallback = true;
      console.log(this.name, 'HTML5 Storage not supported. Using fallback methods');
      console.warn(this.name, 'no fallback methods for cache have been implemented so far');
    }
  }


  /*
  ## *checkVersions():*
  This function checks the version of the different kinds of data that is
  stored in the cache. Basically the version control allows the server to
  demand the clients to clear the cache whenever it wants to and update
  itself with the new version.
   */

  controller.prototype.checkVersions = function() {
    var _clearApplicationCache, _clearLibrariesCache, _clearModelsCache, _removeKeysHelper, magic;
    console.log(this.name, "checking cache version");
    magic = window.config.magic || {};
    _clearApplicationCache = function() {
      return _removeKeysHelper('app');
    };
    _clearLibrariesCache = function() {
      return _removeKeysHelper('library');
    };
    _clearModelsCache = function() {
      return _removeKeysHelper('models');
    };
    _removeKeysHelper = function(tag) {
      var i, j, k, key, keysToRemove, len, ref, results;
      keysToRemove = [];
      for (i = j = 0, ref = localStorage.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        key = localStorage.key(i);
        if ((key != null) && ((key.split(':'))[0] === tag)) {
          keysToRemove.push(key);
        }
      }
      results = [];
      for (k = 0, len = keysToRemove.length; k < len; k++) {
        key = keysToRemove[k];
        results.push(localStorage.removeItem(key));
      }
      return results;
    };
    if ((this.get('magic:library')) !== magic.library) {
      console.log(this.name, "library caches differ, clearing");
      _clearLibrariesCache();
      this.set('magic:library', magic.library);
    }
    if ((this.get('magic:models')) !== magic.models) {
      console.log(this.name, "model caches differ, clearing");
      _clearModelsCache();
      this.set('magic:models', magic.models);
    }
    if ((this.get('magic:application')) !== magic.application) {
      console.log(this.name, "application caches differ, clearing");
      _clearApplicationCache();
      return this.set('magic:application', magic.application);
    }
  };


  /*
  ## *cacheStartupScripts():*
  This function is responsible for saving all the startup scripts
  (eg: jQuery, Backbone, Masonry) into the localStorage cache. This way the
  next time the user open the page, site will immediately load the scripts
  from the cache and avoid making requests from the CDN.
  
  The code that loads the script that is saved in the local path of the app.
  This is done, because most browsers don't allow cross-browser requests
  and saving the scripts local is a solution for this.
   */

  controller.prototype.cacheStartupScripts = function() {
    var ajax, j, len, results, script, storageIdentifier;
    if (this.fallback) {
      return;
    }
    results = [];
    for (j = 0, len = scripts.length; j < len; j++) {
      script = scripts[j];
      storageIdentifier = script.name;
      if ((script.localSrc != null) && !this.get(storageIdentifier)) {
        console.log(this.name, "caching script:", script.name);
        ajax = (function(_this) {
          return function(storageIdentifier, script) {
            return $.ajax({
              url: script.localSrc,
              success: function(result) {
                _this.set(storageIdentifier, result);
                return console.log(_this.name, "cached script:", storageIdentifier);
              }
            });
          };
        })(this);
        results.push(ajax(storageIdentifier, script));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /*
  ## *set(key, value):*
  A simple function to store a key-value pair into the cache
   */

  controller.prototype.set = function(key, string) {
    if (this.fallback) {
      return;
    }
    console.log(this.name, "setting '" + key + "' into cache");
    return localStorage.setItem(key, string);
  };


  /*
  ## *get(key):*
  Function to get a key-string pair from the cache, given the key
   */

  controller.prototype.get = function(key) {
    if (this.fallback) {
      return;
    }
    return localStorage.getItem(key);
  };

  return controller;

})();

},{}],23:[function(require,module,exports){

/*
## **Language** module
This module is responsible for making the App multi-lingual. It downloads the
different language dictionaries and caches them into the localStorage. It can
also translate DOM elements based on these dictionaries.

The language module translates DOM elements by following a specific pattern. See
*translate()* for more info.
 */
var controller;

module.exports = controller = (function() {
  controller.prototype.name = '[language]';

  controller.prototype.fallback = false;


  /*
  ## *constructor():*
  This function initializes the module by setting the current language and
  downloading any other languages if necessary.
   */

  function controller() {
    var currentLanguage, lang, ref, str;
    this.resources = App.Resources;
    console.log(this.name, 'initializing');
    _.extend(this, Backbone.Events);
    this.$html = $('html');
    str = location.pathname;
    lang = location.pathname.match(/^\/(..)/);
    if ((lang != null) && ((ref = lang[1]) === 'en' || ref === 'ar' || ref === 'dg')) {
      currentLanguage = lang[1];
    } else {
      currentLanguage = "en";
    }
    this.setLanguage(currentLanguage);
    console.log(this.name, "using language", this.currentLanguage);
  }


  /*
  ## *fetch():*
  This function fetches the dictionary of the current language, either from the
  cache or from the server. The function emits a 'synced' event when the
  dictionary has been downloaded.
   */

  controller.prototype.fetch = function() {
    var cache;
    cache = this.resources.cache.get("app:language:" + this.currentLanguage);
    if (cache != null) {
      console.log(this.name, "language found in cache");
      this.currentDictonary = JSON.parse(cache);
      return this.trigger('synced');
    } else {
      console.log(this.name, "language not found in cache");
      return this.downloadLanguage(this.currentLanguage, (function(_this) {
        return function(error, response) {
          var json;
          _this.currentDictonary = response;
          json = JSON.stringify(response);
          _this.resources.cache.set("app:language:" + _this.currentLanguage, json);
          return _this.trigger('synced');
        };
      })(this));
    }
  };


  /*
  ## *downloadLanguage(lang, callback):*
  This function makes a call to the server API to get the language dictionary
  specified in *lang*. The *callback* function gets called with the response
  from the server (which is the language dictionary).
   */

  controller.prototype.downloadLanguage = function(lang, callback) {
    var ajax;
    console.log(this.name, "downloading language from server");
    ajax = this.resources.Helpers.ajax;
    return $.ajax({
      beforeSend: ajax.setHeaders,
      dataType: 'json',
      type: "GET",
      url: "/api/lang/" + lang,
      success: function(response) {
        return callback(null, response);
      },
      error: function(response) {
        return callback(response);
      }
    });
  };


  /*
  ## *setLanguage(lang, callback):*
  A handy function to properly set the language of the App. *lang* should be
  either of the language slugs. (en/ar/dg)
   */

  controller.prototype.setLanguage = function(lang, callback) {
    if (callback == null) {
      callback = function() {};
    }
    console.log(this.name, "switching language to", lang);
    this.currentLanguage = lang;
    this.$html.attr('lang', lang);
    this.urlSlug = "/" + this.currentLanguage;
    return this.fetch(callback);
  };


  /*
  ## *translate($container):*
  This function translate the given DOM element by looking at the *lang-*
  attributes in every element and finding the right language value for it.
  
  The *lang-val* attribute should contain the key for language dictionary which
  should be used for the element value.
  
  The *lang-html* attribute should contain the key for language dictionary which
  should be used for the element's html.
  
  The *lang-placeholder* attribute should contain the key for language
  dictionary which should be used for the element's placeholder.
   */

  controller.prototype.translate = function($container) {
    var $els, _getLanguageItem;
    console.log(this.name, 'translating element');
    _getLanguageItem = (function(_this) {
      return function(key) {
        return (_this.get(key)) || key;
      };
    })(this);
    $els = $container.find('[lang-placeholder]');
    $els.each(function(i) {
      var $el;
      $el = $els.eq(i);
      return $el.attr('placeholder', _getLanguageItem($el.attr('lang-placeholder')));
    });
    $els = $container.find('[lang-value]');
    $els.each(function(i) {
      var $el;
      $el = $els.eq(i);
      return $el.val(_getLanguageItem($el.attr('lang-value')));
    });
    $els = $container.find('[lang-html]');
    return $els.each(function(i) {
      var $el;
      $el = $els.eq(i);
      return $el.html(_getLanguageItem($el.attr('lang-html')));
    });
  };

  controller.prototype.localizeNumber = function(number) {
    if (this.currentLanguage === 'ar') {
      return this.resources.Helpers.numbers.toArabic(number);
    } else {
      return number;
    }
  };


  /*
  ## *get(key):*
  Function to get a key-string pair from the current dictionary.
   */

  controller.prototype.get = function(key) {
    return this.currentDictonary[key];
  };

  return controller;

})();

},{}],24:[function(require,module,exports){
module.exports = Backbone.Router.extend({
  name: '[router]',
  fallback: false,
  about: function() {
    return this.handleRoute('about');
  },
  account: function() {
    return this.handleRoute('account-index');
  },
  accountCredits: function() {
    return this.handleRoute('account-credits');
  },
  accountManage: function() {
    return this.handleRoute('account-manage');
  },
  authLogin: function() {
    return this.handleRoute('auth-login');
  },
  authLogout: function() {
    return this.handleRoute('auth-logout');
  },
  authSignup: function() {
    return this.handleRoute('auth-signup');
  },
  classifiedSearch: function() {
    return this.handleRoute('classified-search', arguments);
  },
  classifiedEdit: function() {
    return this.handleRoute('classified-edit', arguments[0]);
  },
  classifiedFinish: function() {
    return this.handleRoute('classified-finish', arguments[0]);
  },
  classifiedPost: function() {
    return this.handleRoute('classified-post');
  },
  classifiedSingle: function() {
    return this.handleRoute('classified-single', arguments[0]);
  },
  contact: function() {
    return this.handleRoute('contact');
  },
  credits: function() {
    return this.handleRoute('credits');
  },
  guestFinish: function() {
    return this.handleRoute('guest-finish', arguments[0]);
  },
  guestEdit: function() {
    return this.handleRoute('guest-edit', arguments[0]);
  },
  guestPost: function() {
    return this.handleRoute('guest-post');
  },
  guestSingle: function() {
    return this.handleRoute('guest-single', arguments[0]);
  },
  landing: function() {
    return this.handleRoute('landing');
  },
  fourofour: function() {
    return console.log('404');
  },
  handleRoute: function(view, parameters) {
    var state;
    console.log(this.name, 'routing to view:', view);
    this.setHistoryState();
    state = this.getHistoryState();
    state.parameters = parameters;
    return this.trigger('change', {
      view: view,
      state: state
    });
  },
  initialize: function(config) {
    console.log(this.name, 'initializing');
    if (history && (history.pushState == null)) {
      return this.fallback = true;
    }
    this.historyIndex = window.history.length;
    window.history.replaceState({
      index: this.historyIndex
    }, '', document.URL);
    console.log(this.name, 'initializing current history state');
    console.debug(this.name, 'state:', window.history.state);
    this.on('change', this.reattachRouter);
    ($(window)).on('popstate', (function(_this) {
      return function(event) {
        return _this.popstateHandle(event);
      };
    })(this));
    return this.prepareRoutes();
  },
  prepareRoutes: function() {
    var _route, _url;
    _url = function(url) {
      return new RegExp("^(?:en|ar|dg)\/" + url + "(\/\?.*)?$");
    };
    _route = (function(_this) {
      return function(regex, view) {
        return _this.route(_url(regex), view);
      };
    })(this);
    this.route(/.*/, "langRedirect");
    this.route(/^(en|ar|dg)\/?$/, "landing");
    _route("about", "about");
    _route("account", "account");
    _route("account/credits", "accountCredits");
    _route("account/manage", "accountManage");
    _route("auth/login", "authLogin");
    _route("auth/logout", "authLogout");
    _route("auth/signup", "authSignup");
    _route("contact", "contact");
    _route("terms-privacy", "termsprivacy");
    _route("classified", "classifiedSearch");
    _route("classified/([a-f0-9]*)", "classifiedSingle");
    _route("classified/([a-f0-9]*)/edit", "classifiedEdit");
    _route("classified/([a-f0-9]*)/finish", "classifiedFinish");
    _route("classified/([a-z\-]+)", "classifiedSearch");
    _route("classified/([a-z\-]+)/([a-z\-]+)", "classifiedSearch");
    _route("classified/post", "classifiedPost");
    _route("guest/([a-f0-9]*)", "guestSingle");
    _route("guest/([a-f0-9]*)/edit", "guestEdit");
    _route("guest/([a-f0-9]*)/finish", "guestFinish");
    return _route("guest/post", "guestPost");
  },
  langRedirect: function() {
    return window.location = "" + location.pathname;
  },
  popstateHandle: function() {
    var state;
    if (this.fallback) {
      return;
    }
    state = this.getHistoryState();
    console.log(this.name, 'handling popstate event');
    if ((state != null) && (state.index != null)) {
      return this.historyIndex = state.index;
    }
  },
  setHistoryState: function() {
    var state;
    if (this.fallback) {
      return;
    }
    state = this.getHistoryState();
    if ((state != null) && (state.index == null)) {
      this.historyIndex += 1;
    }
    return window.history.replaceState({
      index: this.historyIndex
    }, '', document.URL);
  },
  getHistoryState: function() {
    if (this.fallback) {
      return {};
    } else {
      return window.history.state || {};
    }
  },
  hrefEventHandler: function(event) {
    var href;
    event.preventDefault();
    href = ($(event.currentTarget)).attr('href');
    return this.navigate(href, {
      trigger: true
    });
  },
  redirect: function(url) {
    return this.navigate(url, {
      trigger: true
    });
  },
  replaceURL: function(url) {
    if (this.fallback) {
      return;
    }
    return window.history.replaceState({
      index: this.historyIndex
    }, '', url);
  },
  reattachRouter: function() {
    console.log(this.name, 'reattaching href event handlers');
    ($('a[data-view]')).unbind('click');
    return ($('a[data-view]')).bind('click', (function(_this) {
      return function(event) {
        return _this.hrefEventHandler(event);
      };
    })(this));
  }
});

},{}],25:[function(require,module,exports){
var viewManager,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

module.exports = viewManager = (function() {
  viewManager.prototype.name = '[viewManager]';

  viewManager.prototype.components = (require('app-views')).components;

  viewManager.prototype.pages = (require('app-views')).pages;

  viewManager.prototype.viewBuffer = [];

  function viewManager(resources) {
    this.resources = resources;
    this.routeHandle = bind(this.routeHandle, this);
    console.log(this.name, 'initializing');
    this.$body = $('body');
    this.$main = $('main');
    this.resources.router.on('change', this.routeHandle);
    this.progressBar = new this.components.progressBar;
  }

  viewManager.prototype.start = function() {
    this.header = new this.components.header({
      el: 'header',
      resources: this.resources
    });
    this.header.trigger('start');
    this.header.trigger('continue');
    this.started = true;
    if (this.currentView) {
      if (this.currentView.checkRedirect()) {
        this.progressBar.progress(100);
        return this.resources.router.redirect(this.currentView.redirectUrl());
      }
      this.currentView.trigger('continue');
      return this.resources.router.reattachRouter();
    }
  };


  /*
  ## *routeHandle(args):*
  This function is called when the route of the current app has changed. This
  function is responsible for making sure of properly unloading the previous
  view and loading the next view.
   */

  viewManager.prototype.routeHandle = function(args) {
    var historyState, viewIdentifier;
    if (args == null) {
      args = {};
    }
    viewIdentifier = args.view;
    historyState = args.state;
    console.log(this.name, "setting view to:", viewIdentifier);
    console.debug(this.name, "using history:", historyState);
    this.resources.historyState = historyState;
    this.setView(viewIdentifier, historyState);
    this.resources.currentView = this.currentView;
    this.resources.currentViewName = viewIdentifier;
    return this.googleAnalyticsSend();
  };


  /*
  ## *setView(viewIdentifier, historyState):*
  Sets the current view, performing all the necessary actions, animations and
  DOM manipulations.
   */

  viewManager.prototype.setView = function(viewIdentifier, historyState) {
    if (historyState == null) {
      historyState = {};
    }
    this.displayMouseLoader(true);
    if (this.currentView != null) {
      this.switchPages(viewIdentifier, historyState);
    } else {
      this.initPage(viewIdentifier, historyState);
    }
    this.$body.attr('id', viewIdentifier);
    this.currentView.resources = this.resources;
    if (this.started) {
      if (this.currentView.checkRedirect()) {
        this.progressBar.progress(100);
        return this.resources.router.redirect(this.currentView.redirectUrl());
      }
      this.currentView.trigger('continue');
    }
    this.displayMouseLoader(false);
    this.progressBar.progress(100);
    return this.resources.router.reattachRouter();
  };

  viewManager.prototype.initPage = function(targetViewIdentifier, historyState) {
    var index, options, targetView, url;
    console.log(this.name, 'initializing first view');
    this.currentViewName = targetViewIdentifier;
    targetView = this.getView(targetViewIdentifier);
    url = document.URL;
    index = historyState.index;
    options = {
      historyState: historyState,
      resources: this.resources
    };
    this.currentView = new targetView(options);
    this.$main.append(this.currentView.$el);
    this.currentView.$el.attr('data-index', index).attr('data-url', url);
    this.viewBuffer.push(this.currentView);
    return this.currentView.trigger('start');
  };


  /*
  ## *switchPages(targetViewIdentifier, historyState):*
  This function is called specifically when there is a view that is already
  initialized and has to be replaced with a new target view.
   */

  viewManager.prototype.switchPages = function(targetViewIdentifier, historyState) {
    var reverse, targetView;
    this.currentViewName = targetViewIdentifier;
    reverse = historyState.reverse || false;
    this.currentView.trigger('pause');
    targetView = this.findTargetView(historyState);
    if (!targetView) {
      console.debug(this.name, "view not found", targetViewIdentifier);
      targetView = this.createTargetView(targetViewIdentifier, historyState);
      targetView.trigger('start');
    }
    return this.currentView = targetView;
  };

  viewManager.prototype.createTargetView = function(targetViewIdentifier, historyState) {
    var $targetPage, index, options, targetView, url, view;
    console.debug(this.name, "creating new view", targetViewIdentifier);
    ($(window)).scrollTop(0);
    index = historyState.index;
    url = document.URL;
    $targetPage = $("<div data-url='" + url + "' data-index='" + index + "'></div>").addClass('pt-page').addClass(targetViewIdentifier);
    options = {
      historyState: historyState,
      resources: this.resources
    };
    view = this.getView(targetViewIdentifier);
    targetView = new view(options);
    this.$main.append(targetView.$el);
    targetView.$el.attr('data-index', index).attr('data-url', url);
    this.destroyUnwantedViews(index);
    this.viewBuffer.push(targetView);
    return targetView;
  };

  viewManager.prototype.findTargetView = function(historyState) {
    var i, index, len, ref, url, view;
    console.log(this.name, "trying to find view in buffer");
    index = historyState.index;
    url = document.URL;
    ref = this.viewBuffer;
    for (i = 0, len = ref.length; i < len; i++) {
      view = ref[i];
      if ((view != null) && (view.$el != null) && (view.$el.data('url')) === url && (view.$el.data('index')) === index) {
        console.log(this.name, "view found in buffer. reusing view");
        return view;
      }
    }
  };

  viewManager.prototype.displayMouseLoader = function(shown) {
    if (shown == null) {
      shown = true;
    }
    return ($("body")).toggleClass("wait", shown);
  };

  viewManager.prototype.getView = function(viewIdentifier) {
    return this.pages[viewIdentifier];
  };

  viewManager.prototype.destroyUnwantedViews = function(historyIndex) {
    var i, index, len, ref, results, view, viewIndex;
    index = 0;
    ref = this.viewBuffer;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      view = ref[i];
      if ((view == null) || (view.$el == null)) {
        continue;
      }
      viewIndex = Number(view.$el.data('index'));
      if (viewIndex === historyIndex || (historyIndex - viewIndex) > 5) {
        this.viewBuffer[index] = null;
        view.trigger('finish');
      }
      results.push(index += 1);
    }
    return results;
  };

  viewManager.prototype.googleAnalyticsSend = function() {
    if (typeof ga !== "undefined" && ga !== null) {
      return ga('send', 'pageview', {
        page: "" + location.pathname + location.search
      });
    }
  };

  return viewManager;

})();

},{"app-views":40}],26:[function(require,module,exports){
var Facebook;

module.exports = Facebook = (function() {
  Facebook.prototype.name = "[facebook]";

  function Facebook() {
    console.log(this.name, 'initializing');
    this.onLoad((function(_this) {
      return function() {
        return console.log(_this.name, 'loaded');
      };
    })(this));
  }

  Facebook.prototype.onLoad = function(callback) {
    var waitForElement;
    if (callback == null) {
      callback = function() {};
    }
    waitForElement = function() {
      if (window.FB != null) {
        return callback();
      } else {
        return setTimeout((function() {
          return waitForElement();
        }), 250);
      }
    };
    return waitForElement();
  };

  return Facebook;

})();

},{}],27:[function(require,module,exports){
var GoogleMaps;

module.exports = GoogleMaps = (function() {
  GoogleMaps.prototype.name = "[google-maps]";

  function GoogleMaps() {
    console.log(this.name, 'initializing');
    this.onLoad((function(_this) {
      return function() {
        return console.log(_this.name, 'loaded');
      };
    })(this));
  }

  GoogleMaps.prototype.onLoad = function(callback) {
    var waitForElement;
    if (callback == null) {
      callback = function() {};
    }
    waitForElement = function() {
      if ((window.google != null) && (window.google.maps != null) && (window.google.maps.Circle != null)) {
        return callback();
      } else {
        return setTimeout((function() {
          return waitForElement();
        }), 250);
      }
    };
    return waitForElement();
  };

  return GoogleMaps;

})();

},{}],28:[function(require,module,exports){
var GoogleRecaptcha;

module.exports = GoogleRecaptcha = (function() {
  GoogleRecaptcha.prototype.name = "[google-recaptcha]";

  function GoogleRecaptcha() {
    console.log(this.name, 'initializing');
    this.onLoad((function(_this) {
      return function() {
        return console.log(_this.name, 'loaded');
      };
    })(this));
  }

  GoogleRecaptcha.prototype.onLoad = function(callback) {
    var waitForElement;
    if (callback == null) {
      callback = function() {};
    }
    waitForElement = function() {
      if (window.grecaptcha != null) {
        return callback();
      } else {
        return setTimeout((function() {
          return waitForElement();
        }), 250);
      }
    };
    return waitForElement();
  };

  return GoogleRecaptcha;

})();

},{}],29:[function(require,module,exports){
module.exports = {
  Facebook: require('./Facebook'),
  GoogleMaps: require('./GoogleMaps'),
  GoogleRecaptcha: require('./GoogleRecaptcha')
};

},{"./Facebook":26,"./GoogleMaps":27,"./GoogleRecaptcha":28}],30:[function(require,module,exports){
module.exports = {
  cache: require('./Cache'),
  external: require('./external'),
  language: require('./Language'),
  router: require('./Router'),
  viewManager: require('./ViewManager')
};

},{"./Cache":22,"./Language":23,"./Router":24,"./ViewManager":25,"./external":29}],31:[function(require,module,exports){

/*
**MainView**
------------

TODO: Rewrite this

This is the base view for all pages in the App. All pages must inherit
the properties in the view.

The different functions and properties defined
here get used by the ViewManager controller and enables the controller to
neatly cleanup and restart views.
 */
module.exports = {

  /*
  ## *initialize():*
  This function gets called by Backbone whenever we instantiate an Object from
  this view. Here we not only setup some common resources for all our child
  views to play with, but we also setup some functions that will be the main
  functions the child views will use.
   */
  initialize: function(options) {
    if (options == null) {
      options = {};
    }
    this.historyIndex = options.historyIndex;
    this.resources = App.Resources;
    this.helpers = App.helpers;
    if (options.templateOptions != null) {
      this.templateOptions = options.templateOptions;
    }
    this.templateOptions.lang = this.resources.language.currentDictonary || {};
    this.templateOptions.lang.href = this.resources.language.urlSlug;

    /*
    These are events that get called by the ViewManager module. You
    don't have to explicitly trigger them but just ensure that all your
    code lies in the functions defined the below sections.
     */
    this.on('start', (function(_this) {
      return function() {
        console.log(_this.name, "start");
        if (_this.template != null) {
          _this.$el.html(_this.template(_this.templateOptions));
        }
        return _this.start(options);
      };
    })(this));
    this.on('continue', (function(_this) {
      return function() {
        console.log(_this.name, "continue");
        _this.setTitle();
        _this.resources.language.translate(_this.$el);
        _this.$el.show();
        _this.undelegateEvents();
        _this.delegateEvents();
        return _this["continue"]();
      };
    })(this));
    this.on('pause', (function(_this) {
      return function() {
        console.log(_this.name, "pause");
        _this.undelegateEvents();
        _this.pause();
        return _this.$el.hide();
      };
    })(this));
    return this.on('finish', (function(_this) {
      return function() {
        console.log(_this.name, "finish");
        _this.finish();
        _this.remove();
        _this.unbind();
        return _this.stopListening();
      };
    })(this));
  },

  /*
   as
   */
  templateOptions: {},

  /*
  ## *name:*
  Here goes the name of the view. This is used in console statements
  to help debug the app. So in your view you would use something like
  
      console.log @name, "Message"
  
  and this makes it easy to filter out console messages generated by that
  view. (Since the app generates alot of console messages)
   */
  name: "",

  /*
  ## *title:*
  Use this function to generate the title for the page. It is mandatory
  for every view to define this. UX thing you know...
   */
  title: "Publish free classifieds",
  setTitle: function(title) {
    if (title == null) {
      title = this.title;
    }
    if (typeof title === 'function') {
      title = title();
    }
    return document.title = title + " - Kuwait and Me";
  },

  /*
  ## *start(), continue(), pause(), finish():*
  These functions control the view state. These functions are never called
  directly. Instead events are sent to the view which then triggers the
  functions accordingly.
   */

  /*
  **start():**
  This is called once, when the App is initializing the view. Ideally all things
  like attach DOM events and other initializations will go in here.
   */
  start: function() {},

  /*
  **continue():**
  This is called every time the App wants to restart the view. Things like
  clearing the screen or resetting variables would go in here.
   */
  "continue": function() {},

  /*
  **pause():**
  This is called every-time the App wants to switch to another view and
  temporarily disable this view. Things like disabling event listeners would
  go in here.
   */
  pause: function() {},

  /*
  **finish():**
  This is called when the App wants to finally kill the view. The only time when
  the app calls this function is when it realizes it has been caching too many
  views and decides to delete unwanted ones. All cleanup procedures go in here.
   */
  finish: function() {},

  /*
  ## *checkRedirect(), redirectUrl():*
  These two functions decide if the App's control has to be redirected or
  not.
   */

  /*
  **checkRedirect()**:  is used to see if the app's control has to be redirected
  and *redirectUrl()* returns the url to redirect to.
   */
  checkRedirect: function() {
    return false;
  },
  redirectUrl: function() {
    return '/';
  }
};

},{}],32:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[comp:category-list]',
  template: template['components/category-list'],
  events: {
    "click li .image": "toggleClassified"
  },
  "continue": function(options) {
    var categories, category, firstSlug, i, len;
    if (options == null) {
      options = {};
    }
    categories = this.resources.categories.toJSON();
    for (i = 0, len = categories.length; i < len; i++) {
      category = categories[i];
      firstSlug = (category.name.replace(',', ' ')).split(' ')[0].toLowerCase();
      category.classname = firstSlug;
    }
    this.$el.html(this.template({
      lang: this.resources.language.currentDictonary,
      categories: categories
    }));
    this.resources.language.translate(this.$el);
    this.resources.router.reattachRouter();
    this.$container = this.$('ul');
    this.resizeCategories();
    this.$container.masonry({
      isAnimated: true,
      isFitWidth: true,
      itemSelector: 'li'
    });
    return ($(window)).resize((function(_this) {
      return function() {
        return _this.resizeCategories();
      };
    })(this));
  },
  resizeCategories: function() {
    var _isSmall;
    _isSmall = function() {
      return (matchMedia(Foundation.media_queries.small)).matches && !(matchMedia(Foundation.media_queries.medium)).matches;
    };
    if (_isSmall()) {
      return (this.$('li')).width(($(window)).width() / 2 - 14);
    } else {
      return (this.$('li')).width(($(window)).width() / 4);
    }
  },
  toggleClassified: function(event) {
    var $el, $list;
    $el = ($(event.currentTarget)).parent();
    $list = $el.find('.children');
    if ($list.height() === 0) {
      return this.openClassified($el, $list);
    } else {
      return this.closeClassified();
    }
  },
  openClassified: function($el, $list) {
    var height;
    this.closeClassified();
    $el.addClass('active');
    $list.css('height', 'auto');
    height = $list.height();
    return this.$container.masonry();
  },
  closeClassified: function() {
    var $el, $list;
    $el = this.$('li');
    (this.$('.active')).removeClass('active');
    $list = $el.find('.children');
    $list.height(0);
    return this.$container.masonry();
  }
});

},{}],33:[function(require,module,exports){
module.exports = Backbone.View.extend({
  gridMinimumSize: 250,
  pageIndex: 1,
  settings: {
    ajaxEnable: true,
    ajaxLock: false,
    isAccount: false,
    enableFilterBox: true,
    query: {
      parentCategory: null,
      childCategory: null
    }
  },
  template: template['components/classified-list'],
  name: '[comp:classified-list]',
  start: function(options) {
    if (options == null) {
      options = {};
    }
    _.extend(this.settings, options.settings);
    this.collection = new this.resources.Models.classifieds;
    this.collection.isAccount = this.settings.isAccount;
    this.setupDOM();
    this.setupListeners();
    this.setupMasonry();
    _.bindAll(this, 'onScroll');
    return _.bindAll(this, 'resizeClassifieds');
  },
  "continue": function() {
    ($(window)).on('resize', this.resizeClassifieds);
    ($(window)).on('scroll', this.onScroll);
    if (this.query == null) {
      this.newQuery();
    }
    this.$classifiedList.masonry();
    setTimeout(((function(_this) {
      return function() {
        return _this.$classifiedList.masonry();
      };
    })(this)), 2000);
    if (this.settings.ajaxEnable) {
      return this.$loader.show();
    }
  },
  pause: function() {
    ($(window)).off('scroll', this.onScroll);
    return ($(window)).off('resize', this.resizeClassifieds);
  },
  onScroll: function() {
    if (this.settings.ajaxEnable) {
      return this.fireAjaxEvent();
    }
  },
  newQuery: function() {
    var $classifieds, baseUrl, currentState, newUrl, router;
    console.log(this.name, 'preparing new query');
    router = this.resources.router;
    $classifieds = this.$(".classified");
    this.$classifiedList.masonry('remove', $classifieds);
    this.pageIndex = 1;
    this.$classifiedList.height(0);
    this.query = this.getQuery();
    this.query.page = 0;
    if (this.enableFilterBox) {
      currentState = router.getHistoryState();
      if (!this.isAccount) {
        baseUrl = '/classified/search?';
      } else {
        baseUrl = '/account/manage?';
      }
      newUrl = baseUrl + $.param(this.query);
    }
    this.settings.ajaxEnable = true;
    return this.fireAjaxEvent();
  },
  resizeClassifieds: function() {
    var windowWidth;
    console.log(this.name, 'resizing classifieds');
    windowWidth = ($(window)).width();
    return (this.$('.classified')).css('max-width', windowWidth / 2);
  },
  fireAjaxEvent: function() {
    if (!this.settings.ajaxEnable || this.settings.ajaxLock) {
      return;
    }
    console.log(this.name, 'firing ajax event');
    if (this.$classifiedList.height() === 0 || ($(window)).scrollTop() >= (($(document)).height() - ($(window)).height()) * 0.7) {
      return this.ajaxLoadClassifieds();
    }
  },
  ajaxLoadClassifieds: function() {
    var parameters;
    this.settings.ajaxLock = true;
    this.$loader.show();
    parameters = this.query || {};
    parameters.page = this.pageIndex;
    this.pageIndex += 1;
    return this.collection.fetch(parameters, this.accountClassifieds);
  },
  getQuery: function() {
    var urlHelper;
    urlHelper = this.resources.Helpers.url;
    return {
      childCategory: (this.settings.query.childCategory || {})._id,
      parentCategory: (this.settings.query.parentCategory || {})._id,
      keywords: urlHelper.getParam('keywords'),
      location: urlHelper.getParam('location'),
      priceMax: urlHelper.getParam('priceMax'),
      priceMin: urlHelper.getParam('priceMin'),
      type: urlHelper.getParam('type')
    };
  },
  addClassifieds: function(classifieds) {
    var classified, createFailureHandler, createSuccessHandler, elem, html, i, imageLoader, imageURL, json, len;
    console.log(this.name, 'adding classifieds');
    imageLoader = this.resources.Library.imageLoader;
    this.$loader.hide();
    this.settings.ajaxLock = false;
    this.$classifiedList.masonry();
    if (classifieds.length === 0) {
      this.settings.ajaxEnable = false;
      this.$ajaxfinish.fadeIn();
    }
    for (i = 0, len = classifieds.length; i < len; i++) {
      classified = classifieds[i];
      json = classified.toJSON();
      json.lang = this.resources.language.currentDictonary;
      json.showStatus = this.settings.isAccount;
      if (json.images.length > 0) {
        json.image = json.images[0];
      }
      html = this.listTemplate(json);
      elem = $(html);
      this.$classifiedList.append(elem);
      this.$classifiedList.masonry('appended', elem);
      if (json.image) {
        elem.addClass('image-loading');
        createSuccessHandler = (function(_this) {
          return function(elem) {
            return function() {
              elem.removeClass('image-loading');
              return _this.$classifiedList.masonry();
            };
          };
        })(this);
        createFailureHandler = (function(_this) {
          return function(elem) {
            return function() {
              elem.removeClass('image-loading').addClass('image-failed');
              return _this.$classifiedList.masonry();
            };
          };
        })(this);
        imageURL = "/uploads/thumb/" + json.image.file;
        imageLoader(imageURL, {
          success: createSuccessHandler(elem),
          failure: createFailureHandler(elem),
          target: this.$("#imagecontainer-" + json._id)
        });
      }
    }
    this.resources.router.reattachRouter();
    setTimeout(((function(_this) {
      return function() {
        return _this.fireAjaxEvent();
      };
    })(this)), 1000);
    return this.resizeClassifieds();
  },
  setupListeners: function() {
    this.stopListening(this.collection, 'ajax:done');
    return this.listenTo(this.collection, 'ajax:done', this.addClassifieds);
  },
  setupDOM: function() {
    var texts;
    this.$ajaxfinish = this.$(".ajax-finish");
    this.$classifiedList = this.$('ul');
    this.$filterbox = this.$('#filter-box');
    this.$loader = this.$('.ajax-loading');
    this.listTemplate = template['components/classified-list-single'];
    texts = ["Woops! that's all we got!", "Wowie! that seems to be all we have!", "Mayday! we're all out of classifieds!", "Damn, there are no more classifieds!"];
    return this.$ajaxfinish.html(texts[Math.floor(Math.random() * texts.length)]);
  },
  setupMasonry: function() {
    return this.$classifiedList.masonry({
      isAnimated: true,
      isFitWidth: true,
      itemSelector: '.classified'
    });
  }
});

},{}],34:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:filterbox]',
  events: {
    "click #filterbox-icon": "showFilterbox"
  },
  query: {
    keywords: null,
    location: null,
    priceMax: null,
    priceMin: null,
    type: null
  },
  template: template['components/filterbox'],
  start: function(options) {
    if (options && options.query) {
      this.query = options.query;
    }
    this.$keywords = this.$("#filter-keywords");
    this.$parentCategory = this.$("#select-category");
    this.$childCategory = this.$("#select-subcategory");
    this.$selectPrice = this.$("#select-price");
    this.$location = this.$("#select-location");
    this.$type = this.$("#select-type");
    this.$submit = this.$(".submit");
    this.$modal = this.$("#filterbox-modal");
    return this.keywordsLock = 0;
  },
  "continue": function() {
    var handler, urlHelpers, urlQuery;
    urlHelpers = this.resources.Helpers.url;
    this._initializeCategory();
    this._initializeLocations();
    this.delegateEvents();
    handler = (function(_this) {
      return function(event) {
        return _this.submitHandle(event);
      };
    })(this);
    this.$parentCategory.on('change', (function(_this) {
      return function(event) {
        return _this.parentCategoryChange(event);
      };
    })(this));
    this.$submit.on('click', (function(_this) {
      return function(event) {
        return _this.submitHandle(event);
      };
    })(this));
    urlQuery = {
      keywords: urlHelpers.getParam('keywords'),
      location: urlHelpers.getParam('location'),
      location: urlHelpers.getParam('location'),
      priceMax: urlHelpers.getParam('priceMax'),
      priceMin: urlHelpers.getParam('priceMin'),
      type: urlHelpers.getParam('type')
    };
    return this.populateBox(urlQuery);
  },
  showFilterbox: function() {
    return this.$modal.foundation('reveal', 'open');
  },
  hideFilterbox: function() {
    return this.$modal.foundation('reveal', 'close');
  },
  populateBox: function(query) {
    var Category, childCategory, parentCategory;
    console.log(this.name, "populating filterbox");
    Category = this.resources.categories;
    parentCategory = this.resources.historyState.parameters[0];
    parentCategory = Category.findBySlug(parentCategory);
    if (parentCategory._id != null) {
      this.$parentCategory.val(parentCategory._id);
    }
    this.parentCategoryChange();
    childCategory = this.resources.historyState.parameters[1];
    childCategory = Category.findBySlug(childCategory);
    if (childCategory._id != null) {
      this.$childCategory.val(childCategory._id);
    }
    this.setPrice(query.priceMax, query.priceMin);
    this.$keywords.val(query.keywords);
    this.$type.val(query.type);
    return this.$location.val(query.location);
  },
  setPrice: function(priceMax, priceMin) {
    if (priceMax === '0' && priceMin === '0') {
      this.$selectPrice.val('Free');
    }
    if (priceMax === '-1' && priceMin === '-1') {
      return this.$selectPrice.val('Contact Owner');
    }
  },
  submitHandle: function(event) {
    event.preventDefault(null);
    return this.trigger('changed');
  },
  _initializeLocations: function() {
    var html, i, len, location, locations, locationsModel, results;
    locationsModel = this.resources.locations;
    locations = locationsModel.toJSON();
    results = [];
    for (i = 0, len = locations.length; i < len; i++) {
      location = locations[i];
      html = this.generateOption(location._id, location.name);
      results.push(this.$location.append(html));
    }
    return results;
  },
  _initializeCategory: function() {
    var categories, categoriesModel, category, i, len, results;
    categoriesModel = this.resources.categories;
    categories = categoriesModel.toJSON();
    this.$parentCategory.val("");
    this.$parentCategory.append(this.generateOption('', 'Everything', false, true));
    results = [];
    for (i = 0, len = categories.length; i < len; i++) {
      category = categories[i];
      results.push(this.$parentCategory.append(this.generateOption(category._id, category.name)));
    }
    return results;
  },
  generateOption: function(value, name, disabled, selected) {
    var attributes;
    if (disabled == null) {
      disabled = false;
    }
    if (selected == null) {
      selected = false;
    }
    attributes = "value='" + value + "'";
    if (disabled) {
      attributes += ' disabled';
    }
    if (selected) {
      attributes += ' selected';
    }
    return "<option " + attributes + ">" + name + "</option>";
  },
  parentCategoryChange: function(event) {
    var addChildCategory, child, children, i, len, results, val;
    val = this.$parentCategory.val();
    children = this.resources.categories.getChildren(val);
    if (children.length > 0) {
      this.$childCategory.parent().removeClass('hide');
    } else {
      this.$childCategory.parent().addClass('hide');
    }
    this.$childCategory.html(this.generateOption('', 'Choose a sub-category'));
    addChildCategory = (function(_this) {
      return function(child) {
        var html;
        html = _this.generateOption(child._id, child.name);
        return _this.$childCategory.append(html);
      };
    })(this);
    results = [];
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      results.push(addChildCategory(child));
    }
    return results;
  },
  getQuery: function() {
    var query;
    query = {};
    switch (this.$selectPrice.val()) {
      case "Free":
        query.priceMin = query.priceMax = 0;
        break;
      case "Contact Owner":
        query.priceMin = query.priceMax = -1;
        break;
      default:
        query.priceMin = query.priceMax = "";
    }
    query.category = this.$parentCategory.val() || "";
    query.childCategory = this.$childCategory.val() || "";
    query.keywords = this.$keywords.val() || "";
    query.location = this.$location.val() || "";
    query.type = this.$type.val() || "";
    return query;
  },
  submitHandle: function() {
    var Category, childCategory, parentCategory, query, url, urlHelpers;
    urlHelpers = this.resources.Helpers.url;
    Category = this.resources.categories;
    query = this.getQuery();
    parentCategory = Category.findById(query.category);
    childCategory = Category.findById(query.childCategory);
    url = "classified";
    if (parentCategory.slug != null) {
      url = url + "/" + parentCategory.slug;
      if (childCategory.slug != null) {
        url = url + "/" + childCategory.slug;
      }
    }
    url = url + "?" + (urlHelpers.serializeGET(query));
    url = this.resources.language.urlSlug + "/" + url;
    this.resources.router.redirect(url);
    return this.hideFilterbox();
  }
});

},{}],35:[function(require,module,exports){
module.exports = Backbone.View.extend({
  sliderAnimateWidth: 200,
  name: '[view:header]',
  template: template['components/header'],
  events: {
    'click #search-close': 'toggleSearchBar',
    'click .search-trigger': 'toggleSearchBar',
    'click #nav-grabber': 'toggleHeader',
    'click #subheader a': 'toggleHeader',
    'click #search-submit': 'submitQuery',
    "submit": "submitQuery"
  },
  searchTexts: ["Search for anything you want!", "Search for what you want, here!", "Search your heart's desires", "Search what you're looking for"],
  toggleHeader: function() {
    return this.$body.toggleClass('show-subheader');
  },
  start: function(options) {
    console.log(this.name, 'initializing');
    this.initializeDOM();
    this.initializeScrollHandler();
    this.setupSearchText();
    this.resources.currentUser.on('sync', (function(_this) {
      return function() {
        return _this.update();
      };
    })(this));
    return this.resources.router.on('change', (function(_this) {
      return function() {
        return _this.update();
      };
    })(this));
  },
  "continue": function() {
    return this.update();
  },
  setupSearchText: function() {
    return this.$search.attr('placeholder', this.searchTexts[Math.floor(Math.random() * this.searchTexts.length)]);
  },
  initializeDOM: function() {
    this.$body = $('body');
    this.$header = $('header');
    this.$credits = this.$('.user-credits .count');
    this.$navHome = this.$('#nav-logo');
    this.$navLinks = this.$('.nav');
    this.$nextLink = this.$('.next');
    this.$previousLink = this.$('.prev');
    this.$sliderNav = this.$('#slider-nav');
    this.$username = this.$('.user-title .name');
    this.$userthumb = this.$('.user-thumb img');
    return this.$search = this.$("[name='keywords']");
  },
  populateHeader: function() {
    var currentUser, md5, md5Hash, strategies, url;
    md5 = this.resources.Library.md5;
    currentUser = this.resources.currentUser.toJSON();
    strategies = this.resources.currentUser.loginStrategies;
    switch (currentUser.loginStrategy) {
      case strategies.FACEBOOK:
        url = "http://graph.facebook.com/" + currentUser.username + "/picture?width=80";
        break;
      case strategies.GOOGLEPLUS:
        url = currentUser.thumb || '';
        url = url.replace('sz=50', 'sz=80');
        break;
      case strategies.TWITTER:
        url = currentUser.thumb || '';
        url = url.replace('_normal', '_bigger');
        break;
      case strategies.EMAIL:
        md5Hash = md5(currentUser.email || '');
        url = "https://www.gravatar.com/avatar/" + md5Hash;
    }
    this.$credits.html(currentUser.credits);
    this.$username.html(currentUser.name);
    return this.$userthumb.attr('src', url);
  },
  toggleSearchBar: function() {
    this.$el.toggleClass('show-search');
    if (this.$el.hasClass('show-search')) {
      return this.$search.focus();
    }
  },
  submitQuery: function(event) {
    var keywords, url;
    event.preventDefault();
    keywords = this.$search.val() || '';
    keywords.replace(' ', '+');
    url = this.resources.language.urlSlug + "/classified/search/?keywords=" + keywords;
    return this.resources.router.redirect(url);
  },
  initializeScrollHandler: function() {
    var delta, didScroll, hasScrolled, lastScrollTop, navbarHeight;
    delta = 5;
    didScroll = false;
    lastScrollTop = 0;
    navbarHeight = this.$el.outerHeight();
    ($(window)).scroll(function(event) {
      return didScroll = true;
    });
    ($(window)).resize(function(event) {
      return didScroll = true;
    });
    hasScrolled = (function(_this) {
      return function() {
        var st;
        st = ($(window)).scrollTop();
        if (Math.abs(lastScrollTop - st) <= delta && st === !0) {
          return;
        }
        if (st > lastScrollTop && st > navbarHeight) {
          _this.$el.addClass('nav-up');
        } else if (st + ($(window)).height() < ($(document)).height()) {
          _this.$el.removeClass('nav-up');
        }
        if (st === 0) {
          _this.$el.removeClass('nav-up');
        }
        return lastScrollTop = st;
      };
    })(this);
    return setInterval((function(_this) {
      return function() {
        if (didScroll) {
          hasScrolled();
          return didScroll = false;
        }
      };
    })(this), 250);
  },
  update: function() {
    var currentView, routerController;
    console.log(this.name, 'updating header');
    routerController = App.Resources.router;
    this.$el.removeClass('nav-up');
    currentView = this.resources.currentViewName;
    (this.$("[data-view]")).removeClass('active');
    (this.$("[data-view='" + currentView + "']")).addClass('active');
    if (this.resources.currentUser.isAnonymous()) {
      this.$body.removeClass('loggedin');
    } else {
      this.$body.addClass('loggedin');
    }
    return this.populateHeader();
  }
});

},{}],36:[function(require,module,exports){
module.exports = {
  filterBox: require("./filterBox"),
  header: require("./header"),
  messages: require("./messages"),
  progressBar: require("./progressBar"),
  classifiedList: require("./classified.list"),
  categoryList: require("./category.list"),
  paymentModal: require("./payment.modal")
};

},{"./category.list":32,"./classified.list":33,"./filterBox":34,"./header":35,"./messages":37,"./payment.modal":38,"./progressBar":39}],37:[function(require,module,exports){
module.exports = Backbone.View.extend({
  template: _.template('<li class="<%= type %>"><b class="title"><%= title %></b>&nbsp;<span class="content"><%= text %></span></li>'),
  initialize: function() {
    this.$message = this.$el.find('.content');
    return this.$title = this.$el.find('.title');
  },
  clear: function() {
    return this.$el.html('');
  },
  success: function(text, title) {
    var html;
    html = this.template({
      text: text,
      title: title || 'Success!',
      type: 'success'
    });
    return this.$el.append(html);
  },
  error: function(text, title) {
    var html;
    html = this.template({
      text: text,
      title: title || 'Error!',
      type: 'error'
    });
    return this.$el.append(html);
  },
  warn: function(text, title) {
    var html;
    html = this.template({
      text: text,
      title: title || 'Warning!',
      type: 'warning'
    });
    return this.$el.append(html);
  }
});

},{}],38:[function(require,module,exports){
var urlHelpers;

urlHelpers = (require('app-helpers')).url;

module.exports = Backbone.View.extend({
  name: '[comp:payment-modal]',
  template: template['components/payment-modal'],
  KWDtoUSD: 3.33,
  initialize: function(options) {
    if (options == null) {
      options = {};
    }
    if (options.resources) {
      this.resources = options.resources;
    } else {
      this.resources = App.resources;
    }
    console.log(this.name, 'initializing');
    console.debug(this.name, options);
    this.$el.html(this.template());
    this.$modal = this.$("#payment-modal");
    this.$submit = this.$(".submit");
    this.$spinner = this.$(".ajax-spinner");
    this.$expiry = this.$("[name='expiry']");
    this.$name = this.$("[name='name']");
    this.$number = this.$("[name='number']");
    this.$cvc = this.$("[name='cvc']");
    this.$submit.click((function(_this) {
      return function(event) {
        return _this.submitHandle(event);
      };
    })(this));
    this.$spinner.hide();
    return (this.$("form")).card({
      container: '.card-wrapper'
    });
  },
  setPurchaseOptions: function(credits, KWD, USD) {
    var diff;
    this.credits = credits != null ? credits : 0;
    diff = Math.round(((KWD * this.KWDtoUSD) - USD) * 100) / 100;
    (this.$('.buycredit-count')).html(this.credits);
    (this.$('.kwd')).html(KWD + "KWD");
    (this.$('.usd')).html("$" + USD);
    (this.$('.usd-converted')).html("$" + (KWD * this.KWDtoUSD));
    return (this.$('.usd-diff')).html("-$" + diff);
  },
  getCreditDetails: function() {
    ({
      ccNo: this.$number.val().trim().split(' ').join(''),
      cvv: Number(this.$cvc.val().trim()),
      name: this.$name.val().trim(),
      expMonth: Number(this.$expiry.val().split('/')[0]),
      expYear: Number(this.$expiry.val().split('/')[1])
    });
    return {
      ccNo: "4000000000000002",
      cvv: "421",
      name: "John Doe",
      expMonth: "12",
      expYear: "16"
    };
  },
  validateCreditDetails: function(credit) {
    return true;
  },
  handleTransaction: function(callback) {
    this.$submit.show();
    this.$spinner.hide();
    this.$modal.foundation("reveal", "open");
    return this.callback = callback || function() {};
  },
  setErrorMessage: function(message) {},
  submitHandle: function(event) {
    var creditDetails, data;
    event.preventDefault();
    this.$submit.hide();
    this.$spinner.show();
    creditDetails = this.getCreditDetails();
    data = {
      credits: this.credits || 0,
      publishableKey: window.config.TCO.publicKey,
      sellerId: window.config.TCO.sid
    };
    if (!this.validateCreditDetails(creditDetails)) {
      return;
    }
    _.extend(data, creditDetails);
    return this.getToken(data, (function(_this) {
      return function(error, token) {
        console.log(error, token);
        data = {
          token: token,
          credits: _this.credits
        };
        return _this.sendDataBackend(data, function(error, response) {
          console.log(error, response);
          _this.$modal.foundation("reveal", "close");
          return _this.callback(error, response);
        });
      };
    })(this));
  },
  getToken: function(data, callback) {
    var error, success;
    error = function(response) {
      switch (response.errorCode) {
        case 300:
          console.log('300');
          break;
        default:
          console.log('s');
      }
      console.error('Could not get a transaction token' + response.errorMsg);
      return callback(response);
    };
    success = (function(_this) {
      return function(data) {
        var token;
        token = data.response.token.token;
        console.log(data);
        return callback(null, token);
      };
    })(this);
    return TCO.loadPubKey('sandbox', function() {
      return TCO.requestToken(success, error, data);
    });
  },
  sendDataBackend: function(data, callback) {
    return $.ajax({
      type: 'PUT',
      url: '/api/user',
      data: data,
      dataType: 'json',
      success: function(response) {
        return callback(null, response);
      },
      error: function(response) {
        return callback(response);
      }
    });
  }
});

},{"app-helpers":6}],39:[function(require,module,exports){
module.exports = Backbone.View.extend({
  el: '#page-progressbar',
  shown: false,
  progress: function(percent) {
    if (percent < 99) {
      if (!this.shown) {
        this.$el.stop().css('width', 0);
        this.shown = true;
      }
      return this.$el.animate({
        opacity: 1,
        width: percent + "%"
      });
    } else {
      return this.finish();
    }
  },
  finish: function() {
    var properties;
    this.shown = false;
    properties = {
      width: "100%"
    };
    return this.$el.animate(properties, (function(_this) {
      return function() {
        return _this.$el.css('width', 0);
      };
    })(this));
  }
});

},{}],40:[function(require,module,exports){
module.exports = {
  components: require('./components'),
  pages: require('./pages'),
  BackboneView: require('./Backbone.View')
};

},{"./Backbone.View":31,"./components":36,"./pages":64}],41:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:about]',
  template: template['about'],
  title: function() {
    return "About Us";
  }
});

},{}],42:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:account-credits]',
  title: function() {
    return "Buy Credits";
  },
  template: template['account/credits'],
  events: {
    "click .cta-button": "buyHandle"
  },
  start: function() {
    this.$credits = this.$(".credit-counter");
    return this.paymentModal = new this.resources.Views.components.paymentModal({
      el: this.$("#payment-modal-container")
    });
  },
  "continue": function() {
    return this.$credits.html(this.resources.currentUser.get('credits'));
  },
  buyHandle: function(event) {
    console.log("buying", event.currentTarget.dataset.credits);
    switch (Number(event.currentTarget.dataset.credits)) {
      case 20:
        this.paymentModal.setPurchaseOptions(20, 10, 30);
        break;
      case 50:
        this.paymentModal.setPurchaseOptions(50, 20, 60);
        break;
      case 100:
        this.paymentModal.setPurchaseOptions(100, 30, 90);
    }
    return this.paymentModal.handleTransaction(function(error, result) {
      return console.log(error, result);
    });
  }
});

},{}],43:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:account-index]',
  template: template['account/index'],
  title: function() {
    return "Manage your account";
  },
  checkRedirect: function() {
    return this.resources.currentUser.isAnonymous();
  },
  redirectUrl: function() {
    return this.resources.language.urlSlug + "/auth/login?error=need_login";
  }
});

},{}],44:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:account-manage]',
  template: template['account/manage'],
  title: function() {
    return "Manage your classifieds";
  },
  checkRedirect: function() {
    return this.resources.currentUser.isAnonymous();
  },
  redirectUrl: function() {
    return this.resources.language.urlSlug + "/auth/login?error=need_login";
  },
  start: function() {
    this.$classifiedList = this.$(".classifiedList");
    this.classifiedList = new this.resources.Views.components.classifiedList({
      settings: {
        isAccount: true,
        enableFilterBox: false
      },
      resources: this.resources,
      el: this.$classifiedList
    });
    return this.classifiedList.trigger('start');
  },
  "continue": function() {
    return this.classifiedList.trigger('continue');
  },
  pause: function() {
    return this.classifiedList.trigger('pause');
  }
});

},{}],45:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: "[view:auth-login]",
  template: template['auth/login'],
  events: {
    'click .submit': 'submit'
  },
  title: "Login",
  messages: {
    activate_fail: 'Something went wrong while activating your account',
    activate_success: 'Your account is successfully activated',
    bad_fields: 'Please fill in the fields properly',
    login_disabled: 'You have been blocked temporarily for too many incorrect logins',
    login_inactive: 'Your account is not activated. <br> Check your inbox (and junk email) for an activation email',
    login_incorrect: 'Wrong email/password',
    logout: 'You have been logged out successfully',
    need_login: 'You need to be logged in in to view that page',
    reset_error: 'Something went wrong while resetting your password',
    reset_password_mismatch: 'The passwords have to match',
    reset_password_small: 'The password is too small (min 6 characters)',
    reset_sent: 'Password reset has been sent to your email',
    reset_success: 'Your password has been reset',
    send_again: 'Your account is not activated, check your email',
    signup_userexists: 'An account with that email already exists',
    signup_success: 'Your account has been created, Check your inbox (and junk email) for an activation email',
    user_suspended: 'This user has been suspended temporarily by a moderator',
    user_banned: 'Your account has been banned by a moderator',
    signup_taken: 'That account name has already been taken!'
  },
  start: function() {
    this.model = this.resources.currentUser;
    this.$form = this.$("#login-form");
    this.$links = this.$(".extra-links");
    this.$messages = this.$("#auth-messages");
    this.$password = this.$("#auth-password");
    this.$spinner = this.$("#ajax-spinner");
    this.$submit = this.$(".submit");
    return this.$username = this.$("#auth-username");
  },
  "continue": function() {
    return this.parseURL();
  },
  pause: function() {
    return (this.$('#g-recaptcha-response')).remove();
  },
  setupCaptcha: function() {
    var randomId;
    randomId = Math.floor(Math.random() * 1000);
    this.captchaId = "gcaptcha-" + randomId;
    this.$captcha = this.$('.gcaptcha');
    return this.$captcha.attr('id', this.captchaId);
  },
  parseURL: function() {
    var error, success, urlHelper, warning;
    console.log(this.name, 'parsing URL');
    urlHelper = this.resources.Helpers.url;
    error = urlHelper.getParam('error');
    success = urlHelper.getParam('success');
    warning = urlHelper.getParam('warning');
    if (error) {
      this.addMessage(this.messages[error], 'error');
    }
    if (success) {
      this.addMessage(this.messages[success], 'success');
    }
    if (warning) {
      return this.addMessage(this.messages[warning], 'warning');
    }
  },
  renderCaptcha: function() {
    var GoogleRecaptcha;
    console.log(this.name, 'setting captcha');
    (this.$captcha.html("")).show();
    GoogleRecaptcha = new this.resources.external.GoogleRecaptcha;
    return GoogleRecaptcha.onLoad((function(_this) {
      return function() {
        if (_this.captcha) {
          return _this.resetCaptcha();
        } else {
          return _this.captcha = grecaptcha.render(_this.captchaId, {
            sitekey: window.config.reCaptcha,
            callback: function(response) {
              return _this.captchaSuccess(response);
            }
          });
        }
      };
    })(this));
  },
  captchaSuccess: function(response) {},
  resetCaptcha: function() {
    var GoogleRecaptcha;
    GoogleRecaptcha = new this.resources.external.GoogleRecaptcha;
    return GoogleRecaptcha.onLoad((function(_this) {
      return function() {
        return grecaptcha.reset(_this.captcha);
      };
    })(this));
  },
  showError: function($el, error) {
    var $parent;
    $parent = $el.parent().parent();
    $parent.addClass('show-error');
    return ($parent.find('small')).html(error);
  },
  removeAllErrors: function() {
    return ($('.show-error')).removeClass('show-error');
  },
  validate: function() {
    var isEmpty, isSmall, status;
    status = true;
    this.removeAllErrors();
    isEmpty = function(str) {
      return (str || "").trim().length === 0;
    };
    isSmall = function(str) {
      return (str || "").trim().length < 5;
    };
    if (isEmpty(this.$username.val())) {
      this.showError(this.$username, 'Please give an email');
      status = false;
    }
    if (isEmpty(this.$password.val())) {
      this.showError(this.$password, 'Please give a password');
      status = false;
    } else if (isSmall(this.$password.val())) {
      this.showError(this.$password, 'Password should have min. 5 characters');
      status = false;
    }
    console.debug(this.name, 'form validation status:', status);
    return status;
  },
  addMessage: function(message, type) {
    var $el;
    if (type == null) {
      type = 'error';
    }
    $el = $("<li> " + message + " </li>");
    $el.hide();
    $el.addClass(type);
    this.$messages.append($el);
    return $el.show();
  },
  removeMessages: function() {
    return this.$messages.html("");
  },
  showLoading: function() {
    this.$spinner.show();
    return this.$submit.hide();
  },
  hideLoading: function() {
    this.$spinner.stop().hide();
    return this.$submit.stop().show();
  },
  submit: function(event) {
    console.log(this.name, 'submitting form');
    event.preventDefault();
    this.removeMessages();
    this.showLoading();
    if (!this.validate()) {
      return this.hideLoading();
    }
    return this.resources.currentUser.login(this.$username.val(), this.$password.val(), (function(_this) {
      return function(error, response) {
        var reason;
        _this.hideLoading();
        if (error) {
          switch (error.responseJSON.status) {
            case 'user not activated':
              return _this.addMessage(_this.messages['login_inactive'], 'warning');
            case 'invalid username/password':
              return _this.addMessage(_this.messages['bad_fields']);
            case 'too many failed attempts':
              return _this.addMessage(_this.messages['login_disabled']);
            case 'user not found':
            case 'invalid password':
              return _this.addMessage(_this.messages['login_incorrect']);
            case 'suspended':
              _this.addMessage(_this.messages['user_suspended']);
              reason = error.responseJSON.reason;
              if (reason) {
                return _this.addMessage("Reason: " + reason);
              }
              break;
            case 'banned':
              _this.addMessage(_this.messages['user_banned']);
              reason = error.responseJSON.reason;
              if (reason) {
                return _this.addMessage("Reason: " + reason);
              }
              break;
            default:
              return _this.addMessage(error.responseText);
          }
        } else {
          console.debug(_this.name, 'received user', response);
          return _this.resources.router.redirect(_this.resources.language.urlSlug + "/account");
        }
      };
    })(this));
  }
});

},{}],46:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: "[view:auth-logout]",
  checkRedirect: function() {
    this.resources.currentUser.logout();
    return true;
  },
  redirectUrl: function() {
    return this.resources.language.urlSlug + "/auth/login?success=logout";
  }
});

},{}],47:[function(require,module,exports){
module.exports = (require("./login")).extend({
  name: "[view:auth-signup]",
  template: template['auth/signup'],
  title: "Signup",
  start: function() {
    this.model = this.resources.currentUser;
    this.$form = this.$("#login-form");
    this.$links = this.$(".extra-links");
    this.$messages = this.$("#auth-messages");
    this.$fullname = this.$("#auth-fullname");
    this.$password = this.$("#auth-password");
    this.$repassword = this.$("#auth-repassword");
    this.$spinner = this.$("#ajax-spinner");
    this.$submit = this.$("#submit-div");
    this.$username = this.$("#auth-username");
    return this.setupCaptcha();
  },
  "continue": function() {
    this.$captcha.removeClass('hide');
    this.$submit.addClass('hide');
    this.renderCaptcha();
    return this.parseURL();
  },
  captchaSuccess: function(response) {
    this.$submit.removeClass('hide');
    this.$captcha.addClass('hide');
    return console.log(this.name, 'captcha success');
  },
  validate: function() {
    var isEmpty, isSmall, status;
    status = true;
    this.removeAllErrors();
    isEmpty = function(str) {
      return (str || "").trim().length === 0;
    };
    isSmall = function(str) {
      return (str || "").trim().length < 5;
    };
    if (isEmpty(this.$fullname.val())) {
      this.showError(this.$fullname, 'Please give your full name');
      status = false;
    }
    if (isEmpty(this.$username.val())) {
      this.showError(this.$username, 'Please give an email');
      status = false;
    }
    if (isEmpty(this.$password.val())) {
      this.showError(this.$password, 'Please give a password');
      status = false;
    } else if (isSmall(this.$password.val())) {
      this.showError(this.$password, 'Password should be min. 5 letters');
      status = false;
    } else if (isEmpty(this.$repassword.val())) {
      this.showError(this.$repassword, 'Please re-enter your password');
      status = false;
    } else if (this.$password.val() !== this.$repassword.val()) {
      this.showError(this.$repassword, 'Passwords don\'t match');
      status = false;
    }
    console.debug(this.name, 'form validation status:', status);
    return status;
  },
  submit: function(event) {
    var fields;
    console.log(this.name, 'submitting form');
    event.preventDefault();
    this.removeMessages();
    this.showLoading();
    if (!this.validate()) {
      return this.hideLoading();
    }
    fields = {
      username: this.$username.val(),
      password: this.$password.val(),
      repassword: this.$repassword.val(),
      fullname: this.$fullname.val()
    };
    return this.resources.currentUser.signup(fields, (function(_this) {
      return function(error, response) {
        _this.hideLoading();
        if (error) {
          switch (error.responseJSON.status) {
            case 'invalid email/name':
              _this.addMessage(_this.messages['bad_fields']);
              break;
            case 'user already exists':
              _this.addMessage(_this.messages['signup_userexists']);
              break;
            default:
              _this.addMessage(error.responseText);
          }
          _this.$captcha.removeClass('hide');
          _this.$submit.addClass('hide');
          return _this.resetCaptcha();
        } else {
          console.debug(_this.name, 'created user', response);
          return _this.resources.router.redirect(_this.resources.language.urlSlug + "/auth/login?success=signup_success");
        }
      };
    })(this));
  }
});

},{"./login":45}],48:[function(require,module,exports){
module.exports = (require('./post')).extend({
  name: '[view:classified-edit]',
  templateOptions: {
    isGuest: false,
    hasClassified: true
  },
  getModel: function(callback) {
    var authHash, id, urlHelper;
    id = this.resources.historyState.parameters;
    urlHelper = this.resources.Helpers.url;
    if (this.model == null) {
      this.model = new this.resources.Models.classified({
        _id: id
      });
    }
    authHash = urlHelper.getParam('authHash');
    this.model.set('authHash', authHash);
    return this.model.fetch({
      success: callback
    });
  },
  onAJAXfinish: function(error, classified) {
    var url;
    if (classified == null) {
      classified = {};
    }
    if (error) {
      this.$spinner.hide();
      this.views["#page-submit"].trigger('continue');
      return this.displayError(error);
    }
    if (!this.templateOptions.isGuest) {
      url = "classified/" + classified._id;
    } else {
      url = "guest/" + classified._id + "?authHash=" + classified.authHash;
    }
    return this.resources.router.redirect(this.resources.language.urlSlug + "/" + url);
  }
});

},{"./post":50}],49:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classifieds-finish]',
  template: template['classified/finish'],
  templateOptions: {
    isGuest: false
  },
  title: function() {
    return "Classified submitted!";
  },
  events: {
    'click #promoteLink': 'promoteHandle'
  },
  paywithatweetURL: 'http://www.paywithatweet.com/pay?id=839c89ba-fec9-4b31-8f0a-29043cee27b6',
  start: function(options) {
    var cookieHelper;
    this.$tabPayment = this.$('#tab-payment');
    this.$paymentErrors = this.$('#payment-errors');
    this.$modal = this.$('#modal-purchase');
    this.$authLink = this.$("#authLink");
    this.$finishLink = this.$("#finishLink");
    this.$facebook = this.$(".social.facebook");
    this.$twitter = this.$(".social.twitter");
    this.$gplus = this.$(".social.gplus");
    this.$sharedMessage = this.$("#shared-message");
    this.$unsharedMessage = this.$("#unshared-message");
    cookieHelper = this.resources.Helpers.cookie;
    cookieHelper.eraseCookie('pay-w-tweet');
    cookieHelper.eraseCookie('authHash');
    if ((window.location.hash.indexOf("shared")) !== -1) {
      this.$sharedMessage.show();
      return this.$unsharedMessage.hide();
    } else {
      this.$sharedMessage.hide();
      return this.$unsharedMessage.show();
    }
  },
  "continue": function() {
    return this.generateSocialLinks();
  },
  generateSocialLinks: function() {
    var URL, facebook, gplus, id, localURL, tweet, twitter;
    id = this.resources.historyState.parameters;
    URL = window.location.origin + "/classified/" + id;
    localURL = "/classified/" + id;
    tweet = "Check out my classified at " + URL;
    facebook = "https://www.facebook.com/sharer/sharer.php?u=" + URL;
    twitter = "https://twitter.com/home?status=" + (encodeURI(tweet));
    gplus = "https://plus.google.com/share?url=" + URL;
    this.$authLink.html(localURL);
    this.$authLink.attr('href', localURL);
    this.$finishLink.attr('href', localURL);
    this.$facebook.attr('href', facebook);
    this.$twitter.attr('href', twitter);
    return this.$gplus.attr('href', gplus);
  },
  promoteHandle: function() {
    var cookieHelper;
    cookieHelper = this.resources.Helpers.cookie;
    cookieHelper.createCookie('pay-w-tweet', this.resources.historyState.parameters);
    return window.location = this.paywithatweetURL;
  }
});

},{}],50:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classified-post]',
  title: "Post a classified",
  template: template['classified/post'],
  templateOptions: {
    isGuest: false,
    hasClassified: false
  },
  subViews: {
    "#page-begin": require('./part.begin'),
    "#page-details": require('./part.details'),
    "#page-images": require('./part.images'),
    "#page-info": require('./part.info'),
    "#page-maps": require('./part.maps'),
    "#page-submit": require('./part.submit')
  },
  events: {
    'click .submit': 'submitHandle'
  },
  start: function(options) {
    this.options = options;
    console.debug(this.name, 'initializing', this.options);
    console.log(this.resources);
    this.views = {};
    return this.currentView = null;
  },
  "continue": function() {
    return this.getModel((function(_this) {
      return function() {
        var href, subView, view;
        console.log(_this.name, 'rendering', _this.el);
        for (href in _this.subViews) {
          subView = _this.subViews[href];
          view = new subView({
            el: _this.$(href)
          });
          view.templateOptions = _this.templateOptions;
          view.model = _this.model;
          view.trigger('start');
          view.trigger('continue');
          _this.views[href] = view;
        }
        _this.$submit = _this.$('.submit');
        _this.$spinner = _this.$("#ajax-spinner");
        _this.$errorMessages = _this.$('ul.error-message');
        return _this.delegateEvents();
      };
    })(this));
  },
  checkRedirect: function() {
    return !this.isGuest && this.resources.currentUser.isAnonymous();
  },
  redirectUrl: function() {
    return this.resources.language.urlSlug + "/auth/login?error=need_login";
  },
  pause: function() {
    return (this.$('#g-recaptcha-response')).remove();
  },
  getModel: function(callback) {
    if (this.model == null) {
      this.model = new this.resources.Models.classified;
    }
    return callback();
  },
  removeAllMessages: function() {
    return this.$errorMessages.hide().html('');
  },
  displayError: function(message) {
    console.log(message);
    return this.$errorMessages.show().append("<li>" + message + "</li>");
  },
  submitHandle: function(event) {
    var isViewValid, validated, view;
    console.log(this.name, 'submitting form', event);
    event.preventDefault();
    this.removeAllMessages();
    validated = true;
    for (view in this.views) {
      if (this.views[view].validate != null) {
        isViewValid = this.views[view].validate();
        validated = isViewValid && validated;
      }
    }
    console.log(this.name, 'validating form', validated);
    if (!validated) {
      return this.displayError('Some fields have invalid values, please go back and fill them properly');
    }
    for (view in this.views) {
      if (this.views[view].setModel != null) {
        this.views[view].setModel();
      }
    }
    this.$submit.hide();
    this.$spinner.show();
    return this.model.uploadServer((function(_this) {
      return function(error, classified) {
        return _this.onAJAXfinish(error, classified);
      };
    })(this));
  },
  onAJAXfinish: function(error, classified) {
    var url;
    if (classified == null) {
      classified = {};
    }
    if (error) {
      this.$spinner.hide();
      this.views["#page-submit"].trigger('continue');
      return this.displayError(error);
    }
    if (!classified.guest) {
      url = "classified/" + classified._id + "/finish";
    } else {
      url = "guest/" + classified._id + "/finish?authHash=" + classified.authHash;
    }
    return this.resources.router.redirect(this.resources.language.urlSlug + "/" + url);
  },
  finish: function() {
    var view;
    for (view in this.views) {
      this.views[view].trigger("finish");
      this.views[view] = null;
    }
    this.currentView = null;
    return this.views = null;
  }
});

},{"./part.begin":51,"./part.details":52,"./part.images":53,"./part.info":54,"./part.maps":55,"./part.submit":56}],51:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classified-post:begin]',
  template: template['classified/post/begin']
});

},{}],52:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classified-post:details]',
  template: template['classified/post/details'],
  events: {
    'change #cat-selector': 'parentCategoryChange',
    'change #childcat-selector': 'childCategoryChange',
    'change #locations': 'locationChange',
    'change #price-selector': 'priceChange'
  },
  start: function(options) {
    this.$address1 = this.$('#address1 input');
    this.$address2 = this.$('#address2 input');
    this.$parentCategory = this.$('#cat-selector');
    this.$childCategory = this.$('#childcat-selector');
    this.$email = this.$('#email');
    this.$locations = this.$('#locations');
    this.$phone = this.$('#phone');
    this.$priceField = this.$('#price-field');
    this.$priceRow = this.$('#price-row');
    this.$priceSelector = this.$('#price-selector');
    this.$type = this.$('#ctype');
    this.categories = this.resources.categories.toJSON();
    this.locations = this.resources.locations.toJSON();
    this.initCategories();
    return this.initLocations();
  },
  "continue": function() {
    return this.setDOM();
  },
  locationChange: function(event) {
    if ((this.$locations.val() != null) && this.$locations.val() !== "") {
      (this.$('#address1')).removeClass("hide");
      return (this.$('#address2')).removeClass("hide");
    } else {
      (this.$('#address1')).addClass("hide");
      return (this.$('#address2')).addClass("hide");
    }
  },
  _validatePrice: function(event) {
    var customPrice;
    if (!this.$priceSelector.val()) {
      this.$priceSelector.parent().addClass('show-error');
      console.error(this.name, 'price has not been set');
      return false;
    } else {
      customPrice = this.$priceField.val();
      if (this.$priceSelector.val() === -1 && customPrice > 0) {
        this.$priceField.parent().parent().addClass('show-error');
        console.error(this.name, 'price input for custom price has not been set');
        return false;
      }
    }
    return true;
  },
  _validateCategories: function(event) {
    var childVal, children, parentVal;
    parentVal = this.$parentCategory.val();
    childVal = this.$childCategory.val();
    this.$childCategory.parent().parent().removeClass('show-error');
    this.$parentCategory.parent().removeClass('show-error');
    if (!parentVal) {
      this.$parentCategory.parent().addClass('show-error');
      console.error(this.name, 'parent category has not been set');
      return false;
    } else {
      children = (this.resources.categories.getChildren(parentVal)) || [];
      if (children.length > 0 && ((childVal == null) || childVal.length === 0)) {
        this.$childCategory.parent().parent().addClass('show-error');
        console.error(this.name, 'child category has not been set');
        return false;
      }
    }
    return true;
  },
  _validateType: function(event) {
    var type;
    type = this.$type.val();
    if (!type) {
      this.$type.parent().addClass('show-error');
      console.error(this.name, 'type has not been set');
      return false;
    }
    return true;
  },
  _validateEmail: function(event) {
    var email;
    email = this.$email.val();
    if (!email) {
      this.$email.parent().parent().addClass('show-error');
      console.error(this.name, 'email has not been set');
      return false;
    }
    return true;
  },
  validate: function() {
    var isValid;
    console.log(this.name, 'validating');
    isValid = this._validateCategories();
    isValid = this._validatePrice() && isValid;
    isValid = this._validateType() && isValid;
    isValid = this._validateEmail() && isValid;
    console.debug(this.name, 'validation:', isValid);
    return isValid;
  },
  priceChange: function(event) {
    var val;
    val = (this.$priceSelector.find(':selected')).val();
    switch (Number(val)) {
      case 0:
        this.$priceField.val(0);
        this.$priceRow.addClass('hide');
        break;
      case 1:
        this.$priceField.val(null);
        this.$priceRow.removeClass('hide');
        break;
      case -1:
        this.$priceField.val(-1);
        this.$priceRow.addClass('hide');
    }
    return this._validatePrice();
  },
  childCategoryChange: function() {
    console.log('asd');
    return this._validateCategories();
  },
  parentCategoryChange: function(event) {
    var addChildCategory, child, children, i, len, val;
    val = this.$parentCategory.val();
    children = this.resources.categories.getChildren(val);
    if (children.length > 0) {
      (this.$('#child-row')).removeClass('hide');
    } else {
      (this.$('#child-row')).addClass('hide');
    }
    this.$childCategory.html(this.generateOption('', 'Choose a sub-category'));
    addChildCategory = (function(_this) {
      return function(child) {
        var html;
        html = _this.generateOption(child._id, child.name);
        return _this.$childCategory.append(html);
      };
    })(this);
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      addChildCategory(child);
    }
    return this._validateCategories();
  },
  setPrice: function(value) {
    if (value == null) {
      return this.$priceSelector.val('');
    } else if (value === 0) {
      return this.$priceSelector.val(0);
    } else if (value === -1) {
      return this.$priceSelector.val(-1);
    } else {
      this.$priceSelector.val(1);
      this.priceChange();
      return this.$priceField.val(value);
    }
  },
  generateOption: function(id, name) {
    return "<option value='" + id + "'>" + name + "</option>";
  },
  initCategories: function() {
    var category, html, i, len, ref;
    (this.$('#child-row')).addClass('hide');
    ref = this.categories;
    for (i = 0, len = ref.length; i < len; i++) {
      category = ref[i];
      html = this.generateOption(category._id, category.name);
      this.$parentCategory.append(html);
    }
    return this.$parentCategory.val('');
  },
  initLocations: function() {
    var html, i, len, location, ref, results;
    ref = this.locations;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      location = ref[i];
      html = this.generateOption(location._id, location.name);
      results.push(this.$locations.append(html));
    }
    return results;
  },
  setModel: function() {
    var checkandset, contact, location;
    location = this.$locations.val();
    if (location === "") {
      location = null;
    }
    this.model.set({
      category: this.$parentCategory.val(),
      childCategory: this.$childCategory.val(),
      price: this.$priceField.val(),
      type: this.$type.val(),
      location: location
    });
    contact = {};
    checkandset = function($el, field) {
      var value;
      value = $el.val();
      if (value) {
        return contact[field] = value;
      }
    };
    checkandset(this.$phone, 'phone');
    checkandset(this.$address1, 'address1');
    checkandset(this.$address2, 'address2');
    checkandset(this.$email, 'email');
    return this.model.set({
      contact: contact
    });
  },
  setDOM: function() {
    var model;
    model = this.model.toJSON();
    if (!model._id) {
      return;
    }
    this.$address1.val(model.contact.address1);
    this.$address2.val(model.contact.address2);
    this.$email.val(model.contact.email);
    this.$locations.val(model.location || "");
    this.$phone.val(model.contact.phone);
    this.$type.val(model.type);
    this.setPrice(model.price);
    this.$parentCategory.val(model.category || "");
    this.parentCategoryChange();
    if (model.childCategory) {
      this.$childCategory.val(model.childCategory);
    }
    this._validateCategories();
    return this.locationChange();
  }
});

},{}],53:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classified-post:images]',
  template: template['classified/post/images'],
  events: {
    'click .dz-preview .delete div': 'removeFile'
  },
  start: function(options) {
    this.$filePreview = this.$('#image-upload-preview');
    this.filesToDelete = [];
    this.initDropzone();
    return this.setDOM();
  },
  removeFile: function(event) {
    var $el, $li, file, i, index, len, ref, src;
    $el = $(event.currentTarget);
    $li = $el.parent().parent();
    src = ($li.find('img')).attr('alt');
    index = $li.index();
    if ($li.data('uploaded')) {
      this.filesToDelete.push(src);
    } else {
      ref = this.dropzone.files;
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        if (file.name === src) {
          file.status = 'delete';
        }
      }
    }
    return $li.remove();
  },
  initDropzone: function() {
    var $el, options;
    Dropzone.autoDiscover = false;
    $el = ((this.$('#image-upload')).eq(0)).dropzone({
      url: '/'
    });
    this.dropzone = $el[0].dropzone;
    this.dropzone.previewsContainer = this.$filePreview[0];
    options = this.dropzone.options;
    options.autoProcessQueue = false;
    options.paramName = 'files';
    options.uploadMultiple = true;
    options.maxFiles = 8;
    return options.previewTemplate = '<li class="dz-preview"><img data-dz-thumbnail /><div class="font-awesome delete"><div>&#xf00d;</div></div> </li>';
  },
  addImage: function(img) {
    var html;
    html = "<li class='dz-preview dz-image-preview' data-uploaded='true'> <img data-dz-thumbnail='' alt='" + img + "' height='100' src='/uploads/thumb/" + img + "'> <div class='font-awesome delete'><div>&#xf00d;</div></div> </li>";
    return this.$filePreview.append(html);
  },
  setModel: function() {
    var file, files, i, len;
    files = this.dropzone.getQueuedFiles();
    this.model.attributes.files = [];
    for (i = 0, len = files.length; i < len; i++) {
      file = files[i];
      this.model.attributes.files.push(file);
    }
    return this.model.set('filesToDelete', this.filesToDelete);
  },
  setDOM: function() {
    var i, image, images, len, results;
    images = this.model.get('images');
    results = [];
    for (i = 0, len = images.length; i < len; i++) {
      image = images[i];
      results.push(this.addImage(image.file));
    }
    return results;
  }
});

},{}],54:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classified-post:info]',
  template: template['classified/post/info'],
  events: {
    "keyup #title input": "titleChange",
    "keyup #description textarea": "descriptionChange"
  },
  start: function(options) {
    this.$description = this.$('#description textarea');
    this.$title = this.$('#title input');
    this.$website = this.$('#website input');
    this.$errorwebsite = this.$('#website small.error');
    this.$errorTitle = this.$('#title small.error');
    return this.$errorDesc = this.$('#description small.error');
  },
  "continue": function() {
    return this.populateDOM();
  },
  titleChange: function(event) {
    return this._validateTitle();
  },
  descriptionChange: function(event) {
    return this._validateDescription();
  },
  _validateTitle: function() {
    var title;
    title = this.$title.val() || "";
    this.$title.parent().removeClass('show-error');
    if (title.trim().length < 10) {
      this.$title.parent().addClass('show-error');
      this.$errorTitle.html('Please give a title (min 10 char)');
      return false;
    } else if (title.trim().length > 120) {
      this.$title.parent().addClass('show-error');
      this.$errorTitle.html('Title is too long (max 120 char)');
      return false;
    }
    return true;
  },
  _validateDescription: function() {
    var description;
    this.$description.parent().removeClass('show-error');
    description = this.$description.val() || "";
    if (description.length < 20) {
      this.$description.parent().addClass('show-error');
      this.$errorDesc.html('Description is too short (min 20 char)');
      return false;
    } else if (description.length > 5000) {
      this.$description.parent().addClass('show-error');
      this.$errorDesc.html('Description is too long (max 5,000 char)');
      return false;
    }
    return true;
  },
  _validateWebsite: function() {
    return true;
  },
  validate: function() {
    var isValid;
    console.log(this.name, 'validating');
    isValid = this._validateDescription();
    isValid = this._validateTitle() && isValid;
    console.debug(this.name, 'validation:', isValid);
    return isValid;
  },
  setModel: function() {
    var contact;
    contact = (this.model.get('contact')) || {};
    contact.website = this.$website.val();
    return this.model.set({
      description: this.$description.val(),
      title: this.$title.val(),
      contact: contact
    });
  },
  populateDOM: function() {
    var contact;
    this.$description.val(this.model.get('description'));
    this.$title.val(this.model.get('title'));
    contact = (this.model.get('contact')) || {};
    return this.$website.val(contact.website);
  }
});

},{}],55:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classified-post:maps]',
  template: template['classified/post/maps'],
  events: {
    "click #maps-disabled-overlay": "enableMaps"
  },
  start: function(options) {
    this.$gmap = this.$('#map-canvas');
    this.$gmapX = this.$('#gmapX');
    this.$gmapY = this.$('#gmapY');
    this.$mapContainer = this.$("#maps-container");
    this.$mapDisableOverlay = this.$("#maps-disabled-overlay");
    this.$mapContainer.css('max-height', ($(window)).height() / 2);
    return this.setDOM();
  },
  "continue": function() {
    var GoogleMaps;
    if (this.gmap == null) {
      GoogleMaps = new this.resources.external.GoogleMaps;
      return GoogleMaps.onLoad((function(_this) {
        return function() {
          return _this.initializeGoogleMaps();
        };
      })(this));
    }
  },
  enableMaps: function() {
    return this.$mapDisableOverlay.hide();
  },
  setModel: function() {
    var meta;
    if (this.$gmapX.val() || this.$gmapY.val()) {
      meta = (this.model.get('meta')) || {};
      meta.gmapX = this.$gmapX.val();
      meta.gmapY = this.$gmapY.val();
      return this.model.set('meta', meta);
    }
  },
  setDOM: function() {
    this.$gmapX.val((this.model.get('meta')).gmapX);
    this.$gmapY.val((this.model.get('meta')).gmapY);
    if (this.$gmapY.val()) {
      return this.enableMaps();
    }
  },
  initializeGoogleMaps: function() {
    var X, Y, myLatlng;
    X = this.$gmapX.val() || 29.375770981110353;
    Y = this.$gmapY.val() || 47.98656463623047;
    myLatlng = new google.maps.LatLng(X, Y);
    this.gmap = new google.maps.Map(this.$gmap[0], {
      center: myLatlng,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      zoom: 13
    });
    this.gmarker = new google.maps.Marker({
      draggable: true,
      map: this.gmap,
      position: myLatlng
    });
    google.maps.event.addListener(this.gmap, 'click', (function(_this) {
      return function(event) {
        var latLng, latitude, longitude;
        latitude = event.latLng.lat();
        longitude = event.latLng.lng();
        latLng = new google.maps.LatLng(latitude, longitude);
        _this.$gmapX.val(latLng.lat());
        _this.$gmapY.val(latLng.lng());
        _this.gmarker.setPosition(latLng);
        return _this.gmap.panTo(latLng);
      };
    })(this));
    return google.maps.event.addListener(this.gmarker, 'dragend', (function(_this) {
      return function(event) {
        var latLng;
        latLng = _this.gmarker.getPosition();
        _this.gmap.panTo(latLng);
        _this.$gmapX.val(latLng.lat());
        return _this.$gmapY.val(latLng.lng());
      };
    })(this));
  }
});

},{}],56:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:classified-post:submit]',
  template: template['classified/post/submit'],
  start: function(options) {
    var randomId;
    this.$submit = this.$('.submit');
    randomId = Math.floor(Math.random() * 1000);
    this.captchaId = "gcaptcha-" + randomId;
    this.$captcha = this.$('.gcaptcha');
    return this.$captcha.attr('id', this.captchaId);
  },
  "continue": function() {
    return this.renderCaptcha();
  },
  validate: function() {
    var val;
    val = (this.$('.g-recaptcha-response')).val();
    if (this.captcha && !val || val === '') {
      return false;
    }
    return true;
  },
  renderCaptcha: function() {
    var GoogleRecaptcha;
    console.log(this.name, 'setting captcha');
    (this.$captcha.html("")).show();
    this.$submit.hide();
    GoogleRecaptcha = new this.resources.external.GoogleRecaptcha;
    return GoogleRecaptcha.onLoad((function(_this) {
      return function() {
        if (_this.captcha) {
          return grecaptcha.reset(_this.captcha);
        } else {
          return _this.captcha = grecaptcha.render(_this.captchaId, {
            sitekey: window.config.reCaptcha,
            callback: function(response) {
              return _this.captchaSuccess(response);
            }
          });
        }
      };
    })(this));
  },
  captchaSuccess: function(response) {
    console.log(this.name, 'captcha success');
    this.$submit.show();
    return this.$captcha.hide();
  },
  resetCaptcha: function() {
    return grecaptcha.reset(this.captcha);
  }
});

},{}],57:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: "[view:classifieds-search]",
  template: template["classified/search"],
  title: "Search classifieds",
  events: {
    "click #search-filter": "toggleFilterbox"
  },
  start: function(options) {
    this.$classifiedList = this.$(".classifiedList");
    this.$filterbox = this.$("#filterbox");
    this.classifiedList = new this.resources.Views.components.classifiedList({
      settings: {
        isAccount: false,
        enableFilterBox: true
      },
      resources: this.resources,
      el: this.$classifiedList
    });
    this.classifiedList.trigger("start");
    this.filterbox = new this.resources.Views.components.filterBox({
      el: this.$filterbox
    });
    return this.filterbox.trigger("start");
  },
  "continue": function() {
    var Category, childCategory, parentCategory;
    Category = this.resources.categories;
    parentCategory = this.resources.historyState.parameters[0];
    childCategory = this.resources.historyState.parameters[1];
    parentCategory = Category.findBySlug(parentCategory);
    childCategory = Category.findBySlug(childCategory);
    this.classifiedList.settings.query.parentCategory = parentCategory;
    this.classifiedList.settings.query.childCategory = childCategory;
    this.classifiedList.trigger("continue");
    this.filterbox.trigger("continue");
    if (parentCategory.name != null) {
      this.title = parentCategory.name;
      if (childCategory.name != null) {
        this.title = childCategory.name + " - " + this.title;
      }
      return this.setTitle();
    }
  },
  pause: function() {
    return this.classifiedList.trigger("pause");
  },
  toggleFilterbox: function(event) {
    $("#filterbox-modal").foundation("reveal", "open");
    return console.log(this.name, "show filterbox");
  }
});

},{}],58:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: "[view:classified-single]",
  template: template['classified/single'],
  templateOptions: {
    isGuest: false
  },
  messages: {
    archived: 'This classified has been deleted',
    banned: 'This classified has been banned by a moderator',
    needlogin: 'You need to be logged in to make such requests',
    notfound: 'Classified was not found',
    rejected: 'This classified has been rejected by a moderator',
    reported: 'Your report has been successfully submitted',
    unpriv: 'You are not allowed to make such bogus requests'
  },
  events: {
    "submit form": "submitHandle",
    "click .action": "actionHandle"
  },
  start: function(options) {
    this.options = options != null ? options : {};
    console.debug(this.name, 'initializing', this.options);
    this.singleTemplate = template['components/single'];
    this.$messages = this.$("#single-messages");
    this.$promptModal = this.$("#promptModal");
    this.$admin = this.$('#admin-single');
    this.$content = this.$('#classified-container');
    this.model = new this.resources.Models.classified;
    this.listenTo(this.model, 'sync', this.modelChange);
    return _.bindAll(this, 'rearrangeGallery');
  },
  "continue": function() {
    var authHash, id, savedClassified, urlHelpers;
    id = this.resources.historyState.parameters;
    savedClassified = window.data.classified;
    if (savedClassified && savedClassified._id === id && false) {
      this.model.set(window.data.classified);
      this.model.trigger('parse');
      this.populateDOM();
    } else {
      this.model.id = id;
      this.listenToOnce(this.model, 'sync', this.populateDOM);
      this.model.fetch();
    }
    urlHelpers = this.resources.Helpers.url;
    this.$el.fadeIn();
    this.modelChange();
    authHash = urlHelpers.getParam('authHash');
    this.model.set('authHash', authHash);
    ($(document)).foundation('clearing', 'reflow');
    this.renderAdminbar();
    return ($(window)).on('resize', this.rearrangeGallery);
  },
  pause: function() {
    return ($(window)).off('resize', this.rearrangeGallery);
  },
  rearrangeGallery: function() {
    return this.$gallery.masonry();
  },
  populateDOM: function() {
    var GoogleMaps, images;
    this.model.parseVariables();
    this.title = this.model.get('title');
    this.setTitle();
    this.$content.html(this.singleTemplate(this.model.toJSON()));
    this.resources.language.translate(this.$content);
    this.$gallery = this.$('.c-gallery');
    this.$gallery.masonry({
      itemSelector: 'li'
    });
    this.$gallery.masonry();
    images = this.model.get('images');
    if (images && images.length > 0) {
      this.loadImages();
    }
    this.$gmap = this.$('#map-canvas');
    this.$gmap.css('max-height', ($(window)).height() / 2);
    this.$gmap.hide();
    if (this.gmap == null) {
      GoogleMaps = new this.resources.external.GoogleMaps;
      return GoogleMaps.onLoad((function(_this) {
        return function() {
          return _this.initializeGoogleMaps();
        };
      })(this));
    }
  },
  actionHandle: function(event) {
    var $el, action, finish, url;
    $el = $(event.currentTarget);
    action = $el.data('action');
    finish = (function(_this) {
      return function() {
        if (_this.model.hasChanged()) {
          return _this.model.save(_this.model.changedAttributes(), {
            patch: true
          });
        }
      };
    })(this);
    switch (action) {
      case 'publish':
        this.model.set('status', this.model.status.ACTIVE);
        this.model.save();
        return finish();
      case 'archive':
        this.model.set('status', this.model.status.ARCHIVED);
        this.model.save();
        return finish();
      case 'repost':
        if (this.model.get('guest')) {
          this.model.set({
            status: this.model.status.INACTIVE
          });
        } else {
          this.model.set({
            status: this.model.status.ACTIVE
          });
        }
        this.model.save();
        return finish();
      case 'ban':
        return this.showPromptModal('banning', (function(_this) {
          return function(reason) {
            _this.model.set({
              status: _this.model.status.BANNED,
              moderatorReason: reason
            });
            _this.model.save();
            return finish();
          };
        })(this));
      case 'reject':
        return this.showPromptModal('rejecting', (function(_this) {
          return function(reason) {
            _this.model.set({
              status: _this.model.status.REJECTED,
              moderatorReason: reason
            });
            _this.model.save();
            return finish();
          };
        })(this));
      case 'report':
        return this.showPromptModal('reporting', (function(_this) {
          return function(reason) {
            var reports;
            reports = _.clone(_this.model.get('reports'));
            reports.push(reason);
            _this.model.unset("reports", {
              silent: true
            });
            _this.model.set({
              reports: reports
            });
            _this.model.save();
            return finish();
          };
        })(this));
      case 'edit':
        if (this.templateOptions.isGuest) {
          url = "guest/" + this.model.id + "/edit?authHash=" + (this.model.get('authHash'));
        } else {
          url = "classified/" + this.model.id + "/edit";
        }
        return this.resources.router.redirect(this.resources.language.urlSlug + "/" + url);
    }
  },
  showPromptModal: function(actionText, callback) {
    var $submitButton, $textarea;
    this.$promptModal.foundation('reveal', 'open');
    (this.$promptModal.find('h3 span')).html(actionText);
    $submitButton = this.$promptModal.find('.submit');
    $textarea = this.$promptModal.find('textarea');
    return $submitButton.one('click', (function(_this) {
      return function(event) {
        _this.$promptModal.foundation('reveal', 'close');
        return callback($textarea.val());
      };
    })(this));
  },
  modelChange: function() {
    var authHash, moderatorReason, status, statuses, urlHelpers;
    urlHelpers = this.resources.Helpers.url;
    authHash = urlHelpers.getParam('authHash');
    this.model.set('authHash', authHash);
    this.$messages.html("");
    this.renderAdminbar();
    moderatorReason = this.model.get('moderatorReason');
    status = this.model.get('status');
    statuses = this.model.status;
    switch (status) {
      case statuses.INACTIVE:
        if (this.model.get('guest')) {
          return this.addMessage('This classified was posted anonymously and is yet to be reviewed', 'warning');
        } else {
          return this.addMessage('This classified is to be reviewed', 'warning');
        }
        break;
      case statuses.REJECTED:
        this.addMessage(this.messages.rejected);
        return this.addMessage(moderatorReason);
      case statuses.ARCHIVED:
        return this.addMessage(this.messages.archived);
      case statuses.BANNED:
        this.addMessage(this.messages.banned);
        return this.addMessage(moderatorReason);
      case statuses.FLAGGED:
        return this.addMessage('This classified has been reported too many times and is under review');
    }
  },
  addMessage: function(message, type) {
    var $el;
    if (type == null) {
      type = 'error';
    }
    $el = $("<li> " + message + " </li>");
    $el.hide();
    $el.addClass(type);
    this.$messages.append($el);
    return $el.fadeIn();
  },
  submitHandle: function(event) {
    var $form, action, reason, reports;
    console.log(this.name, 'reading submit event');
    event.preventDefault();
    $form = $(event.currentTarget);
    action = ($form.find("[name='action']")).val();
    reason = ($form.find("[name='reason']")).val();
    switch (action) {
      case 'publish':
        this.model.set('status', this.model.status.ACTIVE);
        break;
      case 'archive':
        this.model.set('status', this.model.status.ARCHIVED);
        break;
      case 'repost':
        if (this.model.get('guest')) {
          this.model.set({
            status: this.model.status.INACTIVE
          });
        } else {
          this.model.set({
            status: this.model.status.ACTIVE
          });
        }
        break;
      case 'ban':
        this.model.set({
          status: this.model.status.BANNED,
          moderatorReason: reason
        });
        break;
      case 'reject':
        this.model.set({
          status: this.model.status.REJECTED,
          moderatorReason: reason
        });
        break;
      case 'report':
        reports = _.clone(this.model.get('reports'));
        reports.push(reason);
        this.model.unset("reports", {
          silent: true
        });
        this.model.set({
          reports: reports
        });
    }
    if (this.model.hasChanged()) {
      return this.model.save(this.model.changedAttributes(), {
        patch: true
      });
    }
  },
  initializeGoogleMaps: function() {
    var init, meta;
    init = (function(_this) {
      return function(lat, lng) {
        var mapOptions, myLatlng;
        myLatlng = new google.maps.LatLng(lat, lng);
        mapOptions = {
          center: myLatlng,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          scrollwheel: false,
          zoom: 13
        };
        _this.gmap = new google.maps.Map(_this.$gmap[0], mapOptions);
        return _this.gmarker = new google.maps.Marker({
          position: myLatlng,
          map: _this.gmap
        });
      };
    })(this);
    meta = this.model.get('meta');
    if (meta && meta.gmapX && meta.gmapY) {
      setTimeout((function() {
        return init(meta.gmapX, meta.gmapY);
      }), 250);
      return this.$gmap.show();
    }
  },
  loadImages: function() {
    var $imgs, imageLoader, total;
    imageLoader = this.resources.Library.imageLoader;
    $imgs = this.$('[data-src]');
    total = $imgs.length;
    this.$gallery.magnificPopup({
      type: 'image',
      delegate: 'a',
      gallery: {
        enabled: true
      }
    });
    return $imgs.each((function(_this) {
      return function(i) {
        var $container, $img, createFailureHandler, createSuccessHandler, src;
        $img = $imgs.eq(i);
        $container = $img.parent().parent();
        src = $img.data('src');
        $container.addClass('image-loading');
        createSuccessHandler = function(elem) {
          return function() {
            _this.$gallery.masonry();
            elem.removeClass('image-loading').addClass('image-success');
            _this.$gallery.masonry();
            if (--total === 0) {
              return ($(document)).foundation('clearing', 'reflow');
            }
          };
        };
        createFailureHandler = function(elem) {
          return function() {
            elem.removeClass('image-loading').addClass('image-failed');
            _this.$gallery.masonry();
            if (--total === 0) {
              return ($(document)).foundation('clearing', 'reflow');
            }
          };
        };
        $img.attr('src', src);
        _this.$gallery.masonry('layout');
        return imageLoader(src, {
          success: createSuccessHandler($container),
          failure: createFailureHandler($container),
          target: $img
        });
      };
    })(this));
  },
  renderAdminbar: function() {
    var adminTemplate, editable, superEditable, urlHelpers, user;
    urlHelpers = this.resources.Helpers.url;
    superEditable = false;
    editable = false;
    adminTemplate = template['components/admin-single'];
    user = this.resources.currentUser;
    if ((this.model.get('guest')) && (urlHelpers.getParam('authHash')) && (location.pathname.split('/'))[2] === 'guest') {
      editable = true;
    }
    if (user.id === this.model.get('owner')) {
      editable = true;
    }
    if (user.get('isModerator')) {
      superEditable = true;
    }
    if (editable || superEditable) {
      this.$admin.show().html(adminTemplate({
        _id: this.model.id,
        editable: editable,
        superEditable: superEditable
      }));
      return this.resources.language.translate(this.$admin);
    } else {
      return this.$admin.hide();
    }
  }
});

},{}],59:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:contact]',
  template: template['contact'],
  events: {
    'click .submit': 'submit'
  },
  title: "Contact Us",
  start: function() {
    var randomId;
    randomId = Math.floor(Math.random() * 1000);
    this.$captcha = this.$(".gcaptcha");
    this.$submit = this.$(".submit");
    this.$email = this.$("[name='email']");
    this.$message = this.$("[name='message']");
    this.$messages = this.$("ul.messages");
    this.captchaId = "gcaptcha-" + randomId;
    this.$captcha.attr('id', this.captchaId);
    return this.renderCaptcha();
  },
  renderCaptcha: function() {
    var GoogleRecaptcha;
    console.log(this.name, 'setting captcha');
    this.$submit.hide();
    (this.$captcha.html("")).show();
    GoogleRecaptcha = new this.resources.external.GoogleRecaptcha;
    return GoogleRecaptcha.onLoad((function(_this) {
      return function() {
        if (_this.captcha) {
          return _this.resetCaptcha();
        } else {
          return _this.captcha = grecaptcha.render(_this.captchaId, {
            sitekey: window.config.reCaptcha,
            callback: function(response) {
              return _this.captchaSuccess(response);
            }
          });
        }
      };
    })(this));
  },
  captchaSuccess: function(response) {
    this.$submit.show();
    this.$captcha.hide();
    return console.log(this.name, 'captcha success');
  },
  resetCaptcha: function() {
    this.$captcha.show();
    return grecaptcha.reset(this.captcha);
  },
  validate: function() {
    var isEmpty, status;
    status = true;
    this.removeAllErrors();
    isEmpty = function(str) {
      return (str || "").trim().length === 0;
    };
    if (isEmpty(this.$email.val())) {
      this.addMessage('Your email is required for us to reply back to you!');
      status = false;
    }
    if (isEmpty(this.$message.val())) {
      this.addMessage('Nothing to say? :(');
      status = false;
    }
    console.debug(this.name, 'form validation status:', status);
    return status;
  },
  removeAllErrors: function() {
    ($('.show-error')).removeClass('show-error');
    return this.$messages.html("");
  },
  addMessage: function(message, type) {
    var $el;
    if (type == null) {
      type = 'error';
    }
    $el = $("<li> " + message + " </li>");
    $el.hide();
    $el.addClass(type);
    this.$messages.append($el);
    return $el.show();
  },
  submit: function(event) {
    var ajax, parameters, validated;
    ajax = (require('app-helpers')).ajax;
    console.debug(this.name, 'submitting form', event);
    event.preventDefault();
    validated = this.validate();
    console.debug(this.name, 'validating form', validated);
    if (!validated) {
      return;
    }
    this.$submit.hide();
    parameters = {
      email: this.$email.val(),
      message: this.$message.val()
    };
    return $.ajax({
      type: 'POST',
      url: '/api/contact',
      dataType: 'json',
      data: parameters,
      beforeSend: ajax.setHeaders,
      success: (function(_this) {
        return function(response) {
          return _this.addMessage('Your message has been sent!', 'success');
        };
      })(this),
      error: (function(_this) {
        return function(response) {
          console.log(response, typeof response);
          _this.resetCaptcha();
          return _this.addMessage(response.responseJSON);
        };
      })(this)
    });
  }
});

},{"app-helpers":6}],60:[function(require,module,exports){
module.exports = (require('../classified/edit')).extend({
  name: '[view:guest-edit]',
  templateOptions: {
    isGuest: true,
    hasClassified: true
  },
  checkRedirect: function() {
    return false;
  }
});

},{"../classified/edit":48}],61:[function(require,module,exports){
module.exports = (require('../classified/finish')).extend({
  name: '[view:guest-finish]',
  templateOptions: {
    isGuest: true
  },
  generateSocialLinks: function() {
    var URL, authHash, authLink, facebook, gplus, id, langhref, localURL, tweet, twitter, urlHelpers;
    id = this.resources.historyState.parameters;
    urlHelpers = this.resources.Helpers.url;
    langhref = this.resources.language.urlSlug;
    authHash = urlHelpers.getParam('authHash');
    URL = "" + window.location.origin + langhref + "/classified/" + id;
    authLink = "" + window.location.origin + langhref + "/guest/" + id + "?authHash=" + authHash;
    localURL = langhref + "/guest/" + id + "?authHash=" + authHash;
    tweet = "Check out my classified at " + URL;
    facebook = "https://www.facebook.com/sharer/sharer.php?u=" + URL;
    twitter = "https://twitter.com/home?status=" + (encodeURI(tweet));
    gplus = "https://plus.google.com/share?url=" + URL;
    this.$authLink.html(authLink);
    this.$authLink.attr('href', authLink);
    this.$finishLink.attr('href', localURL);
    this.$facebook.attr('href', facebook);
    this.$twitter.attr('href', twitter);
    return this.$gplus.attr('href', gplus);
  },
  promoteHandle: function() {
    var cookieHelper, urlHelpers;
    cookieHelper = this.resources.Helpers.cookie;
    urlHelpers = this.resources.Helpers.url;
    cookieHelper.createCookie('pay-w-tweet', this.resources.historyState.parameters);
    cookieHelper.createCookie('authHash', urlHelpers.getParam('authHash'));
    return window.location = this.paywithatweetURL;
  }
});

},{"../classified/finish":49}],62:[function(require,module,exports){
module.exports = (require('../classified/post')).extend({
  name: '[view:guest-post]',
  templateOptions: {
    isGuest: true,
    hasClassified: false
  },
  checkRedirect: function() {
    return false;
  }
});

},{"../classified/post":50}],63:[function(require,module,exports){
module.exports = (require('../classified/single')).extend({
  name: '[view:guest-single]',
  templateOptions: {
    isGuest: true
  }
});

},{"../classified/single":58}],64:[function(require,module,exports){
module.exports = {
  'about': require('./about'),
  'account-credits': require('./account/credits'),
  'account-index': require('./account'),
  'account-manage': require('./account/manage'),
  'auth-forgot': require('./auth/login'),
  'auth-login': require('./auth/login'),
  'auth-logout': require('./auth/logout'),
  'auth-reset': require('./auth/login'),
  'auth-signup': require('./auth/signup'),
  'classified-edit': require('./classified/edit'),
  'classified-finish': require('./classified/finish'),
  'classified-post': require('./classified/post'),
  'classified-search': require('./classified/search'),
  'classified-single': require('./classified/single'),
  'contact': require('./contact'),
  'guest-edit': require('./guest/edit'),
  'guest-finish': require('./guest/finish'),
  'guest-post': require('./guest/post'),
  'guest-single': require('./guest/single'),
  'landing': require('./landing')
};

},{"./about":41,"./account":43,"./account/credits":42,"./account/manage":44,"./auth/login":45,"./auth/logout":46,"./auth/signup":47,"./classified/edit":48,"./classified/finish":49,"./classified/post":50,"./classified/search":57,"./classified/single":58,"./contact":59,"./guest/edit":60,"./guest/finish":61,"./guest/post":62,"./guest/single":63,"./landing":65}],65:[function(require,module,exports){
module.exports = Backbone.View.extend({
  name: '[view:landing]',
  template: template['landing'],
  title: function() {
    return "Publish free classifieds";
  },
  events: {
    "submit": "formSubmit"
  },
  start: function() {
    this.$categoryContainer = this.$('#landing-categories');
    this.$classifiedList = this.$(".classifiedList");
    this.$logo = this.$("#landing-logo img");
    this.classifiedList = new this.resources.Views.components.classifiedList({
      settings: {
        isAccount: false,
        enableFilterBox: false
      },
      resources: this.resources,
      el: this.$classifiedList
    });
    this.classifiedList.trigger('start');
    this.$categoryList = this.$el.find('#masonry-container .content');
    this.categoryList = new this.resources.Views.components.categoryList({
      el: this.$categoryContainer,
      resources: this.resources
    });
    return this.categoryList.trigger('start');
  },
  "continue": function() {
    var authHash, cookieHelper, id, url;
    switch (window.location.hash) {
      case "#shared":
        cookieHelper = this.resources.Helpers.cookie;
        id = cookieHelper.readCookie('pay-w-tweet');
        authHash = cookieHelper.readCookie('authHash');
        if (authHash) {
          url = "guest/" + id + "/finish?authHash=" + authHash + "#shared";
        } else {
          url = "classified/" + id + "/finish#shared";
        }
        this.resources.router.redirect(this.resources.language.urlSlug + "/" + url);
    }
    this.classifiedList.trigger('continue');
    return this.categoryList.trigger('continue');
  },
  pause: function() {
    return this.classifiedList.pause();
  },
  formSubmit: function(event) {
    var $keywords, text, url;
    event.preventDefault();
    $keywords = this.$("[name='keywords']");
    text = $keywords.val().replace(' ', '+');
    url = this.resources.language.urlSlug + "/classified?keywords=" + text;
    return this.resources.router.redirect(url);
  }
});

},{}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjb25maWcuY29mZmVlIiwiZW50cnkuY29mZmVlIiwiaGVscGVycy9hamF4LmNvZmZlZSIsImhlbHBlcnMvY29va2llLmNvZmZlZSIsImhlbHBlcnMvZGF0ZS5jb2ZmZWUiLCJoZWxwZXJzL2luZGV4LmNvZmZlZSIsImhlbHBlcnMvbnVtYmVycy5jb2ZmZWUiLCJoZWxwZXJzL3VybC5jb2ZmZWUiLCJoZWxwZXJzL3ZhbGlkYXRvci5jb2ZmZWUiLCJsaWJyYXJpZXMvYmFubmVyLmpzIiwibGlicmFyaWVzL2Jhc2U2NC5jb2ZmZWUiLCJsaWJyYXJpZXMvaW1hZ2VMb2FkZXIuY29mZmVlIiwibGlicmFyaWVzL2luZGV4LmNvZmZlZSIsImxpYnJhcmllcy9tZDUuY29mZmVlIiwibW9kZWxzL0JhY2tib25lLk1vZGVsLmNvZmZlZSIsIm1vZGVscy9DYXRlZ29yaWVzLmNvZmZlZSIsIm1vZGVscy9DbGFzc2lmaWVkLmNvZmZlZSIsIm1vZGVscy9DbGFzc2lmaWVkcy5jb2ZmZWUiLCJtb2RlbHMvTG9jYXRpb25zLmNvZmZlZSIsIm1vZGVscy9Vc2VyLmNvZmZlZSIsIm1vZGVscy9pbmRleC5jb2ZmZWUiLCJtb2R1bGVzL0NhY2hlLmNvZmZlZSIsIm1vZHVsZXMvTGFuZ3VhZ2UuY29mZmVlIiwibW9kdWxlcy9Sb3V0ZXIuY29mZmVlIiwibW9kdWxlcy9WaWV3TWFuYWdlci5jb2ZmZWUiLCJtb2R1bGVzL2V4dGVybmFsL0ZhY2Vib29rLmNvZmZlZSIsIm1vZHVsZXMvZXh0ZXJuYWwvR29vZ2xlTWFwcy5jb2ZmZWUiLCJtb2R1bGVzL2V4dGVybmFsL0dvb2dsZVJlY2FwdGNoYS5jb2ZmZWUiLCJtb2R1bGVzL2V4dGVybmFsL2luZGV4LmNvZmZlZSIsIm1vZHVsZXMvaW5kZXguY29mZmVlIiwidmlld3MvQmFja2JvbmUuVmlldy5jb2ZmZWUiLCJ2aWV3cy9jb21wb25lbnRzL2NhdGVnb3J5Lmxpc3QuY29mZmVlIiwidmlld3MvY29tcG9uZW50cy9jbGFzc2lmaWVkLmxpc3QuY29mZmVlIiwidmlld3MvY29tcG9uZW50cy9maWx0ZXJCb3guY29mZmVlIiwidmlld3MvY29tcG9uZW50cy9oZWFkZXIuY29mZmVlIiwidmlld3MvY29tcG9uZW50cy9pbmRleC5jb2ZmZWUiLCJ2aWV3cy9jb21wb25lbnRzL21lc3NhZ2VzLmNvZmZlZSIsInZpZXdzL2NvbXBvbmVudHMvcGF5bWVudC5tb2RhbC5jb2ZmZWUiLCJ2aWV3cy9jb21wb25lbnRzL3Byb2dyZXNzQmFyLmNvZmZlZSIsInZpZXdzL2luZGV4LmNvZmZlZSIsInZpZXdzL3BhZ2VzL2Fib3V0LmNvZmZlZSIsInZpZXdzL3BhZ2VzL2FjY291bnQvY3JlZGl0cy5jb2ZmZWUiLCJ2aWV3cy9wYWdlcy9hY2NvdW50L2luZGV4LmNvZmZlZSIsInZpZXdzL3BhZ2VzL2FjY291bnQvbWFuYWdlLmNvZmZlZSIsInZpZXdzL3BhZ2VzL2F1dGgvbG9naW4uY29mZmVlIiwidmlld3MvcGFnZXMvYXV0aC9sb2dvdXQuY29mZmVlIiwidmlld3MvcGFnZXMvYXV0aC9zaWdudXAuY29mZmVlIiwidmlld3MvcGFnZXMvY2xhc3NpZmllZC9lZGl0LmNvZmZlZSIsInZpZXdzL3BhZ2VzL2NsYXNzaWZpZWQvZmluaXNoLmNvZmZlZSIsInZpZXdzL3BhZ2VzL2NsYXNzaWZpZWQvcG9zdC9pbmRleC5jb2ZmZWUiLCJ2aWV3cy9wYWdlcy9jbGFzc2lmaWVkL3Bvc3QvcGFydC5iZWdpbi5jb2ZmZWUiLCJ2aWV3cy9wYWdlcy9jbGFzc2lmaWVkL3Bvc3QvcGFydC5kZXRhaWxzLmNvZmZlZSIsInZpZXdzL3BhZ2VzL2NsYXNzaWZpZWQvcG9zdC9wYXJ0LmltYWdlcy5jb2ZmZWUiLCJ2aWV3cy9wYWdlcy9jbGFzc2lmaWVkL3Bvc3QvcGFydC5pbmZvLmNvZmZlZSIsInZpZXdzL3BhZ2VzL2NsYXNzaWZpZWQvcG9zdC9wYXJ0Lm1hcHMuY29mZmVlIiwidmlld3MvcGFnZXMvY2xhc3NpZmllZC9wb3N0L3BhcnQuc3VibWl0LmNvZmZlZSIsInZpZXdzL3BhZ2VzL2NsYXNzaWZpZWQvc2VhcmNoLmNvZmZlZSIsInZpZXdzL3BhZ2VzL2NsYXNzaWZpZWQvc2luZ2xlLmNvZmZlZSIsInZpZXdzL3BhZ2VzL2NvbnRhY3QuY29mZmVlIiwidmlld3MvcGFnZXMvZ3Vlc3QvZWRpdC5jb2ZmZWUiLCJ2aWV3cy9wYWdlcy9ndWVzdC9maW5pc2guY29mZmVlIiwidmlld3MvcGFnZXMvZ3Vlc3QvcG9zdC5jb2ZmZWUiLCJ2aWV3cy9wYWdlcy9ndWVzdC9zaW5nbGUuY29mZmVlIiwidmlld3MvcGFnZXMvaW5kZXguY29mZmVlIiwidmlld3MvcGFnZXMvbGFuZGluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG4vKlxuQ29uZmlndXJhdGlvblxuLS0tLS0tLS0tLS0tLVxuXG5UaGlzIGZpbGUgY29udGFpbnMgc2V0dGluZ3MgZm9yIHRoZSBkaWZmZXJlbnQgY29tcG9uZW50cyBvZiB0aGUgQXBwLiBBbnlcbmNoYW5nZXMgaGVyZSB3aWxsIGVmZmVjdCB0aGUgYmVoYXZpb3Igb2YgdGhlIEFwcC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLypcbiAgIyMganNWZXJzaW9uOlxuICBUaGlzIGNvbnRyb2xzIHRoZSB2ZXJzaW9uIG9mIHRoZSBkaWZmZXJlbnQgSlMgY29tcG9uZW50cyB0aGF0IGFyZSBzdG9yZWQgaW4gdGhlIEhUTUw1XG4gIGxvY2FsLXN0b3JhZ2UgYXMgY2FjaGUuXG4gICAqL1xuICBqc1ZlcnNpb246IHdpbmRvdy5qc1ZlcnNpb24sXG5cbiAgLypcbiAgIyMgaG9zdG5hbWU6XG4gIFRoaXMgdmFyaWFibGUgaXMgdXNlZCB0byBwcmVmaXggdGhlIFVSTCBmb3IgYWxsIEFKQVggcmVxdWVzdHMuIFRoaXMgaXMgdXNlZnVsXG4gIGlmIHdlIGFyZSBkZXBsb3lpbmcgdGhpcyBBcHAgaW4gcGhvbmVnYXAgYW5kIHdoZW4gd2UgbmVlZCB0byBtYWtlIENPUlNcbiAgcmVxdWVzdHNcbiAgICovXG4gIGhvc3RuYW1lOiBcIlwiLFxuXG4gIC8qXG4gICMjIGxvY2FsU3RvcmFnZTpcbiAgICovXG4gIGxvY2FsU3RvcmFnZToge1xuICAgIGVuYWJsZWQ6IHRydWVcbiAgfSxcblxuICAvKlxuICAjIyBodG1sNVB1c2hzdGF0ZTpcbiAgICovXG4gIGh0bWw1UHVzaHN0YXRlOiB7XG4gICAgZW5hYmxlZDogdHJ1ZVxuICB9XG59O1xuIiwiXG4vKlxuKipGcm9udGVuZCBKYXZhc2NyaXB0IEFwcCoqXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblRoaXMgZmlsZSBib290c3RyYXBzIHRoZSBmcm9udC1lbmQgYXBwLiBKYXZhc2NyaXB0IGV4ZWN1dGlvbiBiZWdpbnMgZnJvbSBoZXJlLlxuVGhlIEFwcCBpcyBoZWF2aWx5IGRlcGVuZGVudCBvbiBCYWNrQm9uZSwgVW5kZXJzY29yZSBhbmQgalF1ZXJ5LlxuXG5UaGUgQXBwIGlzIGRlc2lnbmVkIHdpdGggYW4gTVZDIGZyYW1ld29yayBpbiBtaW5kIGFsdGhvdWdoIHdpdGggQmFja2JvbmUsIHlvdXJcbnZpZXdzIGJlY29tZSB5b3VyIGNvbnRyb2xsZXIuIFRoZSBBcHAgYWxzbyBjb250YWlucyAqbW9kdWxlcyosIHdoaWNoIGFyZVxuY29tcG9uZW50cyB0aGF0IGRvIGRpZmZlcmVudCB0aGluZ3MgbGlrZSByb3V0aW5nL2NhY2hpbmcuXG5cblJlYWQgdGhlIGNvbW1lbnRzIGF0IHRoZSBlbmQgb2YgdGhlIHBhZ2UgaWYgeW91IGFyZSB0cnlpbmcgdG8gdHJhY2UgaG93IHRoZVxuYXBwbGljYXRpb24gd29ya3NcbiAqL1xudmFyIE1haW47XG5cbmlmICh3aW5kb3cuQXBwID09IG51bGwpIHtcblxuICAvKlxuICAjIyAqd2luZG93LkFwcCpcbiAgVGhpcyB2YXJpYWJsZSBpcyBwYXJ0aWN1bGFybHkgaW1wb3J0YW50IGJlY2F1c2UgaXQgY29udGFpbnMgYWxsIHRoZSBiaXRzIGFuZFxuICBwaWVjZXMgb2Ygb3VyIEFwcC4gRXZlbiB0aGUgYXBwbGljYXRpb24ncyBydW5uaW5nIGluc3RhbmNlIVxuICBcbiAgVGhpcyB2YXJpYWJsZSBpcyBtYWRlIGdsb2JhbCBzbyB0aGF0IGRpZmZlcmVudCBjb21wb25lbnRzIG9mIHRoZSBBcHAgaGF2ZSBhXG4gIHVuaWZvcm1lZCB3YXkgb2YgYWNjZXNzaW5nIGRpZmZlcmVudCBjb21wb25lbnRzL3Jlc291cmNlcy5cbiAgICovXG4gIHdpbmRvdy5BcHAgPSB7XG4gICAgQ2FjaGU6IChyZXF1aXJlKFwiYXBwLW1vZHVsZXNcIikpLmNhY2hlLFxuICAgIFJvdXRlcjogKHJlcXVpcmUoXCJhcHAtbW9kdWxlc1wiKSkucm91dGVyLFxuICAgIFZpZXdNYW5hZ2VyOiAocmVxdWlyZShcImFwcC1tb2R1bGVzXCIpKS52aWV3TWFuYWdlcixcbiAgICBMYW5ndWFnZTogKHJlcXVpcmUoXCJhcHAtbW9kdWxlc1wiKSkubGFuZ3VhZ2UsXG4gICAgRXh0ZXJuYWw6IChyZXF1aXJlKFwiYXBwLW1vZHVsZXNcIikpLmV4dGVybmFsLFxuICAgIFJlc291cmNlczoge1xuICAgICAgQ29uZmlnOiByZXF1aXJlKFwiYXBwLWNvbmZpZ1wiKSxcbiAgICAgIEhlbHBlcnM6IHJlcXVpcmUoXCJhcHAtaGVscGVyc1wiKSxcbiAgICAgIExpYnJhcnk6IHJlcXVpcmUoXCJhcHAtbGlic1wiKSxcbiAgICAgIE1vZGVsczogcmVxdWlyZShcImFwcC1tb2RlbHNcIiksXG4gICAgICBWaWV3czogcmVxdWlyZShcImFwcC12aWV3c1wiKVxuICAgIH0sXG4gICAgaW5zdGFuY2U6IG51bGxcbiAgfTtcblxuICAvKlxuICAjIyBjbGFzcyAqTWFpbipcbiAgVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBtYWluIGNsYXNzIG9mIHRoZSBhcHAuIFRoZXJlIHNob3VsZCBiZSBvbmx5IG9uZVxuICBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGR1cmluZyBhIHVzZXIncyB3aW5kb3cgc2Vzc2lvbi5cbiAgICovXG4gIE1haW4gPSAoZnVuY3Rpb24oKSB7XG4gICAgTWFpbi5wcm90b3R5cGUubmFtZSA9IFwiW2FwcF1cIjtcblxuXG4gICAgLypcbiAgICAjIyAqY29uc3RydWN0b3IoKToqXG4gICAgVGhpcyBmdW5jdGlvbiBzdGFydHMgb2YgdGhlIGFwcCBieSBpbml0aWFsaXppbmcgaXQncyB2YXJpb3VzIGNvbXBvbmVudHMuXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBNYWluKCkge1xuICAgICAgKCQoXCIjcGFnZS1sb2FkZXJcIikpLmhpZGUoKTtcbiAgICAgIHRoaXMuZGVjb2RlRGF0YSgpO1xuICAgICAgdGhpcy5hcHBseUJhY2tib25lSGFja3MoKTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUxpc3RlbmVycygpO1xuICAgICAgdGhpcy5pbml0aWFsaXplUmVzb3VyY2VzKCk7XG4gICAgICB0aGlzLmluaXRpYWxpemVWaWV3cygpO1xuICAgICAgdGhpcy5pbml0aWFsaXplQmFja0JvbmUoKTtcbiAgICB9XG5cblxuICAgIC8qXG4gICAgIyMgKmluaXRpYWxpemVWaWV3cygpOipcbiAgICBUaGlzIGZ1bmN0aW9uIGluaXRpYWxpemVzIHRoZSAqVmlld01hbmFnZXIqIGFuZCB0aGUgKlJvdXRlciogd2hpY2ggaW5cbiAgICB0dXJuIGluaXRpYWxpemUgYWxsIHRoZSBvdGhlciBzdWJ2aWV3c1xuICAgICAqL1xuXG4gICAgTWFpbi5wcm90b3R5cGUuaW5pdGlhbGl6ZVZpZXdzID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcgdmlld3MnKTtcbiAgICAgIHJldHVybiB0aGlzLlZpZXdNYW5hZ2VyID0gbmV3IEFwcC5WaWV3TWFuYWdlcih0aGlzLnJlc291cmNlcyk7XG4gICAgfTtcblxuXG4gICAgLypcbiAgICAjIyAqaW5pbnRpYWxpemVMaXN0ZW5lcnMoKToqXG4gICAgVGhpcyBmdW5jdGlvbiBpbml0aWFsaXplcyB0aGUgdmFyaW91cyBsaXN0ZW5lcnMgZm9yIHRoZSBBcHAuIChQcm9iYWJseSBub3RcbiAgICBuZWVkZWQpXG4gICAgICovXG5cbiAgICBNYWluLnByb3RvdHlwZS5pbml0aWFsaXplTGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcgbGlzdGVuZXJzJyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQodGhpcywgQmFja2JvbmUuRXZlbnRzKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICMjICpkZWNvZGVTZXJ2ZXJEYXRhKCk6KlxuICAgIFRoaXMgZnVuY3Rpb24gZGVjb2RlcyB0aGUgZGF0YSB0aGF0IGlzIHBhc3NlZCBmcm9tIHRoZSBzZXJ2ZXItc2lkZS4gVGhpc1xuICAgIGRhdGEgaXMgc2ltcGxlIGJhc2U2NCBlbmNvZGVkIGFuZCBzbyB0aGlzIGZ1bmN0aW9uIHNpbXBseSBiYXNlNjQgZGVjb2RlcyBpdC5cbiAgICAgKi9cblxuICAgIE1haW4ucHJvdG90eXBlLmRlY29kZURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBiYXNlNjQ7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdkZWNvZGluZyBiYXNlNjQgZW5jb2RlIGRhdGEnKTtcbiAgICAgIGJhc2U2NCA9IEFwcC5SZXNvdXJjZXMuTGlicmFyeS5iYXNlNjQ7XG4gICAgICByZXR1cm4gd2luZG93LmRhdGEgPSBKU09OLnBhcnNlKGJhc2U2NC5kZWNvZGUod2luZG93LmRhdGEpKTtcbiAgICB9O1xuXG5cbiAgICAvKlxuICAgICMjICppbml0aWFsaXplQmFja0JvbmUoKToqXG4gICAgSW5pdGlhbGl6ZXMgdGhlIEJhY2tib25lIGNvbXBvbmVudHMuIEJhc2ljYWxseSB0aGUgcm91dGVyIGlzIG9ubHkgdGhpbmdcbiAgICB0aGF0IG5lZWRzIHRvIGJlIHN0YXJ0ZWQsIHNvIHdlIHN0YXJ0IHRoZSAqQmFja2JvbmUuaGlzdG9yeSogaGVyZS5cbiAgICAgKi9cblxuICAgIE1haW4ucHJvdG90eXBlLmluaXRpYWxpemVCYWNrQm9uZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoe1xuICAgICAgICBwdXNoU3RhdGU6IHRydWUsXG4gICAgICAgIGhhc2hDaGFuZ2U6IGZhbHNlLFxuICAgICAgICByb290OiAnLydcbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAgIC8qXG4gICAgIyMgKmFwcGx5QmFja2JvbmVIYWNrcygpOipcbiAgICBQcm9iYWJseSBvbmUgb2YgdGhlIG1vc3QgdXNlZnVsIGZ1bmN0aW9ucyBpbiB0aGUgY29kZS4gVGhpcyBmdW5jdGlvblxuICAgIHJld3JpdGVzIHNvbWUgb2YgdGhlIEJhY2tib25lIGNvbXBvbmVudHMgc3VjaCBhcyB0aGUgQmFja2JvbmUgVmlldyBhbmQgTW9kZWxcbiAgICBzbyB0aGF0IGV4dHJhIGZlYXR1cmVzIGFyZSBtYWRlIGF2YWlsYWJsZSB0byBpdC4gVmlldyB0aGUgY29udGVudCBmb3IgbW9yZVxuICAgIGV4cGxhbmF0aW9uLlxuICAgICAqL1xuXG4gICAgTWFpbi5wcm90b3R5cGUuYXBwbHlCYWNrYm9uZUhhY2tzID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgYmFja2JvbmVTeW5jLCBuZXdNb2RlbFByb3BlcnRpZXMsIG5ld1N5bmMsIG5ld1ZpZXdQcm9wZXJ0aWVzO1xuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnYXBwbHlpbmcgQmFja2JvbmUgaGFja3MnKTtcbiAgICAgIGJhY2tib25lU3luYyA9IEJhY2tib25lLnN5bmM7XG4gICAgICBuZXdTeW5jID0gZnVuY3Rpb24obWV0aG9kLCBtb2RlbCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLmJlZm9yZVNlbmQgPSBmdW5jdGlvbih4aHIpIHtcbiAgICAgICAgICB2YXIgY2FwdGNoYTtcbiAgICAgICAgICBjYXB0Y2hhID0gKCQoJ1tuYW1lPVwiZy1yZWNhcHRjaGEtcmVzcG9uc2VcIl0nKSkudmFsKCk7XG4gICAgICAgICAgaWYgKGNhcHRjaGEpIHtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCd4LWdjYXB0Y2hhJywgY2FwdGNoYSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB4aHIuc2V0UmVxdWVzdEhlYWRlcigneC1jc3JmLXNraXBwZXInKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGJhY2tib25lU3luYyhtZXRob2QsIG1vZGVsLCBvcHRpb25zKTtcbiAgICAgIH07XG4gICAgICBCYWNrYm9uZS5zeW5jID0gbmV3U3luYztcbiAgICAgIG5ld1ZpZXdQcm9wZXJ0aWVzID0gKHJlcXVpcmUoXCJhcHAtdmlld3NcIikpLkJhY2tib25lVmlldztcbiAgICAgIF8uZXh0ZW5kKEJhY2tib25lLlZpZXcucHJvdG90eXBlLCBuZXdWaWV3UHJvcGVydGllcyk7XG4gICAgICBuZXdNb2RlbFByb3BlcnRpZXMgPSAocmVxdWlyZShcImFwcC1tb2RlbHNcIikpLkJhY2tib25lTW9kZWw7XG4gICAgICBfLmV4dGVuZChCYWNrYm9uZS5Nb2RlbC5wcm90b3R5cGUsIG5ld01vZGVsUHJvcGVydGllcyk7XG4gICAgICByZXR1cm4gXy5leHRlbmQoQmFja2JvbmUuQ29sbGVjdGlvbi5wcm90b3R5cGUsIG5ld01vZGVsUHJvcGVydGllcyk7XG4gICAgfTtcblxuICAgIE1haW4ucHJvdG90eXBlLmluaXRpYWxpemVSZXNvdXJjZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhc3luY0NvdW50ZXIsIHNldEFuZENoZWNrQ291bnRlcjtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2luaXRpYWxpemluZyByZXNvdXJjZXMnKTtcbiAgICAgIHRoaXMucmVzb3VyY2VzID0gQXBwLlJlc291cmNlcztcbiAgICAgIHRoaXMucmVzb3VyY2VzLmNhY2hlID0gbmV3IEFwcC5DYWNoZTtcbiAgICAgIHRoaXMucmVzb3VyY2VzLmNhdGVnb3JpZXMgPSBuZXcgQXBwLlJlc291cmNlcy5Nb2RlbHMuY2F0ZWdvcmllcztcbiAgICAgIHRoaXMucmVzb3VyY2VzLmN1cnJlbnRVc2VyID0gbmV3IEFwcC5SZXNvdXJjZXMuTW9kZWxzLnVzZXI7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2NhdGlvbnMgPSBuZXcgQXBwLlJlc291cmNlcy5Nb2RlbHMubG9jYXRpb25zO1xuICAgICAgdGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UgPSBuZXcgQXBwLkxhbmd1YWdlO1xuICAgICAgdGhpcy5Sb3V0ZXIgPSBuZXcgQXBwLlJvdXRlcjtcbiAgICAgIHRoaXMucmVzb3VyY2VzLnJvdXRlciA9IHRoaXMuUm91dGVyO1xuICAgICAgdGhpcy5yZXNvdXJjZXMucm91dGVyLnJlc291cmNlcyA9IHRoaXMucmVzb3VyY2VzO1xuICAgICAgdGhpcy5yZXNvdXJjZXMuZXh0ZXJuYWwgPSBBcHAuRXh0ZXJuYWw7XG4gICAgICB0aGlzLnJlc291cmNlcy5jdXJyZW50VmlldyA9IEFwcC5WaWV3TWFuYWdlci5jdXJyZW50VmlldztcbiAgICAgIHRoaXMucmVzb3VyY2VzLmNhdGVnb3JpZXMucmVzb3VyY2VzID0gdGhpcy5yZXNvdXJjZXM7XG4gICAgICB0aGlzLnJlc291cmNlcy5sb2NhdGlvbnMucmVzb3VyY2VzID0gdGhpcy5yZXNvdXJjZXM7XG4gICAgICB0aGlzLnJlc291cmNlcy5jdXJyZW50VXNlci5yZXNvdXJjZXMgPSB0aGlzLnJlc291cmNlcztcbiAgICAgIGFzeW5jQ291bnRlciA9IDQ7XG4gICAgICBzZXRBbmRDaGVja0NvdW50ZXIgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFzeW5jQ291bnRlci0tO1xuICAgICAgICAgIGlmIChhc3luY0NvdW50ZXIgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzLlZpZXdNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICB0aGlzLmxpc3RlblRvT25jZSh0aGlzLnJlc291cmNlcy5jYXRlZ29yaWVzLCAnc3luY2VkJywgc2V0QW5kQ2hlY2tDb3VudGVyKTtcbiAgICAgIHRoaXMubGlzdGVuVG9PbmNlKHRoaXMucmVzb3VyY2VzLmN1cnJlbnRVc2VyLCAnc3luY2VkJywgc2V0QW5kQ2hlY2tDb3VudGVyKTtcbiAgICAgIHRoaXMubGlzdGVuVG9PbmNlKHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLCAnc3luY2VkJywgc2V0QW5kQ2hlY2tDb3VudGVyKTtcbiAgICAgIHRoaXMubGlzdGVuVG9PbmNlKHRoaXMucmVzb3VyY2VzLmxvY2F0aW9ucywgJ3N5bmNlZCcsIHNldEFuZENoZWNrQ291bnRlcik7XG4gICAgICB0aGlzLnJlc291cmNlcy5jYXRlZ29yaWVzLmZldGNoKCk7XG4gICAgICB0aGlzLnJlc291cmNlcy5jdXJyZW50VXNlci5mZXRjaCgpO1xuICAgICAgdGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UuZmV0Y2goKTtcbiAgICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5sb2NhdGlvbnMuZmV0Y2goKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIE1haW47XG5cbiAgfSkoKTtcblxuICAvKlxuICAqKk1haW4gSmF2YXNjcmlwdCBFeGVjdXRpb24gc3RhcnRzIGhlcmUqKlxuICBUaGUgY29kZSBiZWxvdyBpbml0aWFsaXplcyB0aGUgZm91bmRhdGlvbiBsaWJyYXJ5IGFuZCB0aGUgQXBwIGl0c2VsZi5cbiAgICovXG4gICgkKHdpbmRvdykpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciAkdGhpcztcbiAgICBjb25zb2xlLmxvZygnW2ZvdW5kYXRpb25dIGluaXRpYWxpemluZycpO1xuICAgICR0aGlzID0gJChkb2N1bWVudCk7XG4gICAgJHRoaXMuZm91bmRhdGlvbigpO1xuICAgIHJldHVybiB3aW5kb3cuQXBwLmluc3RhbmNlID0gbmV3IE1haW4od2luZG93LkFwcCk7XG4gIH0pO1xufSBlbHNlIHtcbiAgY29uc29sZS5sb2coXCJbbGliXSBhcHAgYWxyZWFkeSBkZWZpbmVkLiBzdG9wcGluZyByZS1leGVjdXRpb24gb2Ygc2NyaXB0XCIpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldEhlYWRlcnM6IGZ1bmN0aW9uKHJlcXVlc3QpIHtcbiAgICB2YXIgY2FwdGNoYTtcbiAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoJ3gtYWpheCcsICdqc29uJyk7XG4gICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCd4LWNzcmYtc2tpcHBlcicsIHRydWUpO1xuICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignY3NyZi10b2tlbicsIHdpbmRvdy5fY3NyZik7XG4gICAgY2FwdGNoYSA9ICgkKCdbbmFtZT1cImctcmVjYXB0Y2hhLXJlc3BvbnNlXCJdJykpLnZhbCgpO1xuICAgIGlmIChjYXB0Y2hhKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCd4LWdjYXB0Y2hhJywgY2FwdGNoYSk7XG4gICAgfVxuICB9XG59O1xuIiwidmFyIGNvb2tpZTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb29raWUgPSB7XG4gIGNyZWF0ZUNvb2tpZTogZnVuY3Rpb24obmFtZSwgdmFsdWUsIGRheXMpIHtcbiAgICB2YXIgZGF0ZSwgZXhwaXJlcztcbiAgICBpZiAoZGF5cykge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgKGRhdGUudG9HTVRTdHJpbmcoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cGlyZXMgPSBcIlwiO1xuICAgIH1cbiAgICByZXR1cm4gZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgdmFsdWUgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiO1xuICB9LFxuICByZWFkQ29va2llOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGMsIGNhLCBpLCBuYW1lRVE7XG4gICAgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuICAgIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBjYS5sZW5ndGgpIHtcbiAgICAgIGMgPSBjYVtpXTtcbiAgICAgIHdoaWxlICgoYy5jaGFyQXQoMCkpID09PSAnICcpIHtcbiAgICAgICAgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIGlmICgoYy5pbmRleE9mKG5hbWVFUSkpID09PSAwKSB7XG4gICAgICAgIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICB9LFxuICBlcmFzZUNvb2tpZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZUNvb2tpZShuYW1lLCAnJywgLTEpO1xuICB9XG59O1xuIiwidmFyIGNyZWF0ZUhhbmRsZXIsIGdldEFyYWJpY05vdW47XG5cbmdldEFyYWJpY05vdW4gPSBmdW5jdGlvbihub3VuKSB7XG4gIHZhciBkaWN0O1xuICBkaWN0ID0ge1xuICAgICdzZWNvbmQnOiAn2KvYp9mG2YrYqScsXG4gICAgJ21pbnV0ZSc6ICfYr9mC2YrZgtipJyxcbiAgICAnaG91cic6ICfYs9in2LnYp9iqJyxcbiAgICAnZGF5JzogJ9ij2YrYp9mFJyxcbiAgICAnd2Vlayc6ICfYo9iz2KfYqNmK2LknLFxuICAgICdtb250aCc6ICfYo9i02YfYsScsXG4gICAgJ3llYXInOiAn2LPZhtmI2KfYqidcbiAgfTtcbiAgcmV0dXJuIGRpY3Rbbm91bl07XG59O1xuXG5jcmVhdGVIYW5kbGVyID0gZnVuY3Rpb24oZGl2aXNvciwgbm91biwgcmVzdE9mU3RyaW5nKSB7XG4gIHJldHVybiBmdW5jdGlvbihkaWZmKSB7XG4gICAgdmFyIGFyYWJpY05vdW4sIGFyYWJpY051bSwgbGFuZywgbiwgcGx1cmFsaXplZE5vdW47XG4gICAgbGFuZyA9IEFwcC5SZXNvdXJjZXMubGFuZ3VhZ2U7XG4gICAgbiA9IE1hdGguZmxvb3IoZGlmZiAvIGRpdmlzb3IpO1xuICAgIGlmIChsYW5nLmN1cnJlbnRMYW5ndWFnZSA9PT0gJ2FyJykge1xuICAgICAgYXJhYmljTnVtID0gQXBwLlJlc291cmNlcy5IZWxwZXJzLm51bWJlcnMudG9BcmFiaWMobik7XG4gICAgICBhcmFiaWNOb3VuID0gZ2V0QXJhYmljTm91bihub3VuKTtcbiAgICAgIHJldHVybiBhcmFiaWNOdW0gKyBcIiBcIiArIGFyYWJpY05vdW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsdXJhbGl6ZWROb3VuID0gXCJcIiArIG5vdW4gKyAobiA+IDEgPyAncycgOiAnJyk7XG4gICAgICByZXR1cm4gbiArIFwiIFwiICsgcGx1cmFsaXplZE5vdW4gKyBcIiBcIiArIHJlc3RPZlN0cmluZztcbiAgICB9XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHJldHRpZnk6IGZ1bmN0aW9uKGRhdGVfcmF3KSB7XG4gICAgdmFyIGRhdGUsIGRpZmYsIGZvcm1hdHRlcnMsIGksIG5vdztcbiAgICBmb3JtYXR0ZXJzID0gW1xuICAgICAge1xuICAgICAgICB0aHJlc2hvbGQ6IDEsXG4gICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAnanVzdCBub3cnO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRocmVzaG9sZDogNjAsXG4gICAgICAgIGhhbmRsZXI6IGNyZWF0ZUhhbmRsZXIoMSwgJ3NlY29uZCcsICdhZ28nKVxuICAgICAgfSwge1xuICAgICAgICB0aHJlc2hvbGQ6IDM2MDAsXG4gICAgICAgIGhhbmRsZXI6IGNyZWF0ZUhhbmRsZXIoNjAsICdtaW51dGUnLCAnYWdvJylcbiAgICAgIH0sIHtcbiAgICAgICAgdGhyZXNob2xkOiA4NjQwMCxcbiAgICAgICAgaGFuZGxlcjogY3JlYXRlSGFuZGxlcigzNjAwLCAnaG91cicsICdhZ28nKVxuICAgICAgfSwge1xuICAgICAgICB0aHJlc2hvbGQ6IDE3MjgwMCxcbiAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICd5ZXN0ZXJkYXknO1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIHRocmVzaG9sZDogNjA0ODAwLFxuICAgICAgICBoYW5kbGVyOiBjcmVhdGVIYW5kbGVyKDg2NDAwLCAnZGF5JywgJ2FnbycpXG4gICAgICB9LCB7XG4gICAgICAgIHRocmVzaG9sZDogMjU5MjAwMCxcbiAgICAgICAgaGFuZGxlcjogY3JlYXRlSGFuZGxlcig2MDQ4MDAsICd3ZWVrJywgJ2FnbycpXG4gICAgICB9LCB7XG4gICAgICAgIHRocmVzaG9sZDogMzE1MzYwMDAsXG4gICAgICAgIGhhbmRsZXI6IGNyZWF0ZUhhbmRsZXIoMjU5MjAwMCwgJ21vbnRoJywgJ2FnbycpXG4gICAgICB9LCB7XG4gICAgICAgIHRocmVzaG9sZDogSW5maW5pdHksXG4gICAgICAgIGhhbmRsZXI6IGNyZWF0ZUhhbmRsZXIoMzE1MzYwMDAsICd5ZWFyJywgJ2FnbycpXG4gICAgICB9XG4gICAgXTtcbiAgICBkYXRlID0gbmV3IERhdGUoZGF0ZV9yYXcpO1xuICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgIGRpZmYgPSAobm93LmdldFRpbWUoKSAtIGRhdGUuZ2V0VGltZSgpKSAvIDEwMDA7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBmb3JtYXR0ZXJzLmxlbmd0aCkge1xuICAgICAgaWYgKGRpZmYgPCBmb3JtYXR0ZXJzW2ldLnRocmVzaG9sZCkge1xuICAgICAgICByZXR1cm4gZm9ybWF0dGVyc1tpXS5oYW5kbGVyKGRpZmYpO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgYWpheDogcmVxdWlyZSgnLi9hamF4JyksXG4gIGNvb2tpZTogcmVxdWlyZSgnLi9jb29raWUnKSxcbiAgZGF0ZTogcmVxdWlyZSgnLi9kYXRlJyksXG4gIG51bWJlcnM6IHJlcXVpcmUoJy4vbnVtYmVycycpLFxuICB1cmw6IHJlcXVpcmUoJy4vdXJsJyksXG4gIHZhbGlkYXRvcjogcmVxdWlyZSgnLi92YWxpZGF0b3InKVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB3aXRoQ29tbWFzOiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHgudG9TdHJpbmcoKS5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xuICB9LFxuICB0b0FyYWJpYzogZnVuY3Rpb24obikge1xuICAgIHZhciBpZCwgbnVtYmVyO1xuICAgIGlkID0gWyfbsCcsICfbsScsICfbsicsICfbsycsICfbtCcsICfbtScsICfbticsICfbtycsICfbuCcsICfbuSddO1xuICAgIG51bWJlciA9IG4udG9TdHJpbmcoKTtcbiAgICByZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1swLTldL2csIGZ1bmN0aW9uKHcpIHtcbiAgICAgIHJldHVybiBpZFsrd107XG4gICAgfSk7XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2VyaWFsaXplR0VUOiBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcCwgc3RyO1xuICAgIHN0ciA9IFtdO1xuICAgIGZvciAocCBpbiBvYmopIHtcbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgc3RyLnB1c2goKGVuY29kZVVSSUNvbXBvbmVudChwKSkgKyBcIj1cIiArIChlbmNvZGVVUklDb21wb25lbnQob2JqW3BdKSkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyLmpvaW4oJyYnKTtcbiAgfSxcbiAgZ2V0UGxhaW5QYXRoOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXJsO1xuICAgIHVybCA9IGRvY3VtZW50LlVSTDtcbiAgICBpZiAoKHVybC5pbmRleE9mKCc/JykpID4gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zdWJzdHIoMCwgdXJsLmluZGV4T2YoJz8nKSk7XG4gICAgfVxuICAgIGlmICgodXJsLmluZGV4T2YoJyMnKSkgPiAtMSkge1xuICAgICAgdXJsID0gdXJsLnN1YnN0cigwLCB1cmwuaW5kZXhPZignIycpKTtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfSxcbiAgZ2V0R0VUc3RyaW5nOiBmdW5jdGlvbih1cmwpIHtcbiAgICBpZiAoIXVybCkge1xuICAgICAgdXJsID0gZG9jdW1lbnQuVVJMO1xuICAgIH1cbiAgICBpZiAoKHVybC5pbmRleE9mKCc/JykpID4gLTEpIHtcbiAgICAgIHJldHVybiB1cmwuc3Vic3RyKHVybC5pbmRleE9mKCc/JyksIHVybC5sZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gJyc7XG4gIH0sXG4gIGdldFBhcmFtOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHJlZ2V4LCByZXN1bHRzLCB1cmw7XG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvW1xcW10vLCAnXFxcXFsnKS5yZXBsYWNlKC9bXFxdXS8sICdcXFxcXScpO1xuICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG4gICAgcmVnZXggPSBuZXcgUmVnRXhwKFwiW1xcXFw/Jl1cIiArIG5hbWUgKyBcIj0oW14mI10qKVwiKTtcbiAgICByZXN1bHRzID0gcmVnZXguZXhlYyh1cmwpO1xuICAgIGlmIChyZXN1bHRzID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQocmVzdWx0c1sxXS5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gICAgfVxuICB9LFxuICByZWNvbnN0cnVjdDogZnVuY3Rpb24oZ2V0X2RhdGEpIHtcbiAgICByZXR1cm4gKHRoaXMuZ2V0UGxhaW5QYXRoKCkpICsgXCI/XCIgKyAodGhpcy5zZXJpYWxpemVHRVQoZ2V0X2RhdGEpKTtcbiAgfSxcbiAgaW5zZXJ0UGFyYW06IGZ1bmN0aW9uKHBhcmFtTmFtZSwgcGFyYW1WYWx1ZSkge1xuICAgIHZhciBwcmVmaXgsIHN1ZmZpeCwgdXJsO1xuICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIGlmICgodXJsLmluZGV4T2YocGFyYW1OYW1lICsgXCI9XCIpKSA+PSAwKSB7XG4gICAgICBwcmVmaXggPSB1cmwuc3Vic3RyaW5nKDAsIHVybC5pbmRleE9mKHBhcmFtTmFtZSkpO1xuICAgICAgc3VmZml4ID0gdXJsLnN1YnN0cmluZyh1cmwuaW5kZXhPZihwYXJhbU5hbWUpKTtcbiAgICAgIHN1ZmZpeCA9IChzdWZmaXguc3Vic3RyaW5nKHN1ZmZpeC5pbmRleE9mKCc9JykpKSArIDE7XG4gICAgICBzdWZmaXggPSAoc3VmZml4LmluZGV4T2YoJyYnKSkgPj0gMCA/IHN1ZmZpeC5zdWJzdHJpbmcoc3VmZml4LmluZGV4T2YoJyYnKSkgOiAnJztcbiAgICAgIHVybCA9IHByZWZpeCArIHBhcmFtTmFtZSArICc9JyArIHBhcmFtVmFsdWUgKyBzdWZmaXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICgodXJsLmluZGV4T2YoJz8nKSkgPCAwKSB7XG4gICAgICAgIHVybCArPSBcIj9cIiArIHBhcmFtTmFtZSArIFwiPVwiICsgcGFyYW1WYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybCArPSBcIiZcIiArIHBhcmFtTmFtZSArIFwiPVwiICsgcGFyYW1WYWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfSxcbiAgaHJlZjogZnVuY3Rpb24odXJsKSB7XG4gICAgcmV0dXJuIFwiL1wiICsgd2luZG93LmxhbmcgKyBcIi9cIiArIHVybDtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBlbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICB2YXIgcmU7XG4gICAgcmUgPSAvXihbXFx3LV0rKD86XFwuW1xcdy1dKykqKUAoKD86W1xcdy1dK1xcLikqXFx3W1xcdy1dezAsNjZ9KVxcLihbYS16XXsyLDZ9KD86XFwuW2Etel17Mn0pPykkL2k7XG4gICAgcmV0dXJuIHJlLnRlc3QoZW1haWwpO1xuICB9XG59O1xuIiwiLyohXG4gKiBqUXVlcnkgU21hcnQgQmFubmVyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTIgQXJub2xkIERhbmllbHMgPGFybm9sZEBqYXNueS5uZXQ+XG4gKiBCYXNlZCBvbiAnalF1ZXJ5IFNtYXJ0IFdlYiBBcHAgQmFubmVyJyBieSBLdXJ0IFplbmlzZWsgQCBremVuaS5jb21cbiAqL1xuIWZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIFNtYXJ0QmFubmVyID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcmlnSHRtbE1hcmdpbiA9IHBhcnNlRmxvYXQoJCgnaHRtbCcpLmNzcygnbWFyZ2luLXRvcCcpKSAvLyBHZXQgdGhlIG9yaWdpbmFsIG1hcmdpbi10b3Agb2YgdGhlIEhUTUwgZWxlbWVudCBzbyB3ZSBjYW4gdGFrZSB0aGF0IGludG8gYWNjb3VudFxuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgJC5zbWFydGJhbm5lci5kZWZhdWx0cywgb3B0aW9ucylcblxuICAgICAgICB2YXIgc3RhbmRhbG9uZSA9IG5hdmlnYXRvci5zdGFuZGFsb25lIC8vIENoZWNrIGlmIGl0J3MgYWxyZWFkeSBhIHN0YW5kYWxvbmUgd2ViIGFwcCBvciBydW5uaW5nIHdpdGhpbiBhIHdlYnVpIHZpZXcgb2YgYW4gYXBwIChub3QgbW9iaWxlIHNhZmFyaSlcbiAgICAgICAgICAsIFVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudFxuXG4gICAgICAgIC8vIERldGVjdCBiYW5uZXIgdHlwZSAoaU9TIG9yIEFuZHJvaWQpXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHRoaXMub3B0aW9ucy5mb3JjZVxuICAgICAgICB9IGVsc2UgaWYgKFVBLm1hdGNoKC9XaW5kb3dzIFBob25lIDgvaSkgIT0gbnVsbCAmJiBVQS5tYXRjaCgvVG91Y2gvaSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICd3aW5kb3dzJ1xuICAgICAgICB9IGVsc2UgaWYgKFVBLm1hdGNoKC9pUGhvbmV8aVBvZC9pKSAhPSBudWxsIHx8IChVQS5tYXRjaCgvaVBhZC8pICYmIHRoaXMub3B0aW9ucy5pT1NVbml2ZXJzYWxBcHApKSB7XG4gICAgICAgICAgICBpZiAoVUEubWF0Y2goL1NhZmFyaS9pKSAhPSBudWxsICYmXG4gICAgICAgICAgICAgICAoVUEubWF0Y2goL0NyaU9TL2kpICE9IG51bGwgfHxcbiAgICAgICAgICAgICAgIHdpbmRvdy5OdW1iZXIoVUEuc3Vic3RyKFVBLmluZGV4T2YoJ09TICcpICsgMywgMykucmVwbGFjZSgnXycsICcuJykpIDwgNikpIHRoaXMudHlwZSA9ICdpb3MnIC8vIENoZWNrIHdlYnZpZXcgYW5kIG5hdGl2ZSBzbWFydCBiYW5uZXIgc3VwcG9ydCAoaU9TIDYrKVxuICAgICAgICB9IGVsc2UgaWYgKFVBLm1hdGNoKC9cXGJTaWxrXFwvKC4qXFxiTW9iaWxlIFNhZmFyaVxcYik/LykgfHwgVUEubWF0Y2goL1xcYktGXFx3LykgfHwgVUEubWF0Y2goJ0tpbmRsZSBGaXJlJykpIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdraW5kbGUnXG4gICAgICAgIH0gZWxzZSBpZiAoVUEubWF0Y2goL0FuZHJvaWQvaSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gJ2FuZHJvaWQnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb24ndCBzaG93IGJhbm5lciBpZiBkZXZpY2UgaXNuJ3QgaU9TIG9yIEFuZHJvaWQsIHdlYnNpdGUgaXMgbG9hZGVkIGluIGFwcCBvciB1c2VyIGRpc21pc3NlZCBiYW5uZXJcbiAgICAgICAgaWYgKCF0aGlzLnR5cGUgfHwgc3RhbmRhbG9uZSB8fCB0aGlzLmdldENvb2tpZSgnc2ItY2xvc2VkJykgfHwgdGhpcy5nZXRDb29raWUoJ3NiLWluc3RhbGxlZCcpKSB7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBzY2FsZVxuICAgICAgICB0aGlzLnNjYWxlID0gdGhpcy5vcHRpb25zLnNjYWxlID09ICdhdXRvJyA/ICQod2luZG93KS53aWR0aCgpIC8gd2luZG93LnNjcmVlbi53aWR0aCA6IHRoaXMub3B0aW9ucy5zY2FsZVxuICAgICAgICBpZiAodGhpcy5zY2FsZSA8IDEpIHRoaXMuc2NhbGUgPSAxXG5cbiAgICAgICAgLy8gR2V0IGluZm8gZnJvbSBtZXRhIGRhdGFcbiAgICAgICAgdmFyIG1ldGEgPSAkKHRoaXMudHlwZSA9PSAnYW5kcm9pZCcgPyAnbWV0YVtuYW1lPVwiZ29vZ2xlLXBsYXktYXBwXCJdJyA6XG4gICAgICAgICAgICB0aGlzLnR5cGUgPT0gJ2lvcycgPyAnbWV0YVtuYW1lPVwiYXBwbGUtaXR1bmVzLWFwcFwiXScgOlxuICAgICAgICAgICAgdGhpcy50eXBlID09ICdraW5kbGUnID8gJ21ldGFbbmFtZT1cImtpbmRsZS1maXJlLWFwcFwiXScgOiAnbWV0YVtuYW1lPVwibXNBcHBsaWNhdGlvbi1JRFwiXScpO1xuICAgICAgICBpZiAobWV0YS5sZW5ndGggPT0gMCkgcmV0dXJuXG5cbiAgICAgICAgLy8gRm9yIFdpbmRvd3MgU3RvcmUgYXBwcywgZ2V0IHRoZSBQYWNrYWdlRmFtaWx5TmFtZSBmb3IgcHJvdG9jb2wgbGF1bmNoXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gJ3dpbmRvd3MnKSB7XG4gICAgICAgICAgICB0aGlzLmFwcElkID0gJCgnbWV0YVtuYW1lPVwibXNBcHBsaWNhdGlvbi1QYWNrYWdlRmFtaWx5TmFtZVwiXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBwdWxsIHRoZSBhcHBJZCBvdXQgb2YgdGhlIG1ldGEgdGFnIGFuZCBzdG9yZSB0aGUgcmVzdWx0XG4gICAgICAgICAgICB2YXIgcGFyc2VkTWV0YUNvbnRlbnQgPSAvYXBwLWlkPShbXlxccyxdKykvLmV4ZWMobWV0YS5hdHRyKCdjb250ZW50JykpO1xuXG4gICAgICAgICAgICBpZihwYXJzZWRNZXRhQ29udGVudCkge1xuICAgICAgICAgICAgICB0aGlzLmFwcElkID0gcGFyc2VkTWV0YUNvbnRlbnRbMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRpdGxlID0gdGhpcy5vcHRpb25zLnRpdGxlID8gdGhpcy5vcHRpb25zLnRpdGxlIDogbWV0YS5kYXRhKCd0aXRsZScpIHx8ICQoJ3RpdGxlJykudGV4dCgpLnJlcGxhY2UoL1xccypbfFxcLcK3XS4qJC8sICcnKVxuICAgICAgICB0aGlzLmF1dGhvciA9IHRoaXMub3B0aW9ucy5hdXRob3IgPyB0aGlzLm9wdGlvbnMuYXV0aG9yIDogbWV0YS5kYXRhKCdhdXRob3InKSB8fCAoJCgnbWV0YVtuYW1lPVwiYXV0aG9yXCJdJykubGVuZ3RoID8gJCgnbWV0YVtuYW1lPVwiYXV0aG9yXCJdJykuYXR0cignY29udGVudCcpIDogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKVxuICAgICAgICB0aGlzLmljb25VcmwgPSBtZXRhLmRhdGEoJ2ljb24tdXJsJyk7XG4gICAgICAgIHRoaXMucHJpY2UgPSBtZXRhLmRhdGEoJ3ByaWNlJyk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGJhbm5lclxuICAgICAgICB0aGlzLmNyZWF0ZSgpXG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICAgIHRoaXMubGlzdGVuKClcbiAgICB9XG5cbiAgICBTbWFydEJhbm5lci5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgY29uc3RydWN0b3I6IFNtYXJ0QmFubmVyXG5cbiAgICAgICwgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpY29uVVJMXG4gICAgICAgICAgICAgICwgbGluaz0odGhpcy5vcHRpb25zLnVybCA/IHRoaXMub3B0aW9ucy51cmwgOiAodGhpcy50eXBlID09ICd3aW5kb3dzJyA/ICdtcy13aW5kb3dzLXN0b3JlOm5hdmlnYXRlP2FwcGlkPScgOiAodGhpcy50eXBlID09ICdhbmRyb2lkJyA/ICdtYXJrZXQ6Ly9kZXRhaWxzP2lkPScgOiAodGhpcy50eXBlID09ICdraW5kbGUnID8gJ2Ftem46Ly9hcHBzL2FuZHJvaWQ/YXNpbj0nIDogJ2h0dHBzOi8vaXR1bmVzLmFwcGxlLmNvbS8nICsgdGhpcy5vcHRpb25zLmFwcFN0b3JlTGFuZ3VhZ2UgKyAnL2FwcC9pZCcpKSkgKyB0aGlzLmFwcElkKVxuICAgICAgICAgICAgICAsIHByaWNlID0gdGhpcy5wcmljZSB8fCB0aGlzLm9wdGlvbnMucHJpY2VcbiAgICAgICAgICAgICAgLCBpblN0b3JlPXByaWNlID8gcHJpY2UgKyAnIC0gJyArICh0aGlzLnR5cGUgPT0gJ2FuZHJvaWQnID8gdGhpcy5vcHRpb25zLmluR29vZ2xlUGxheSA6IHRoaXMudHlwZSA9PSAna2luZGxlJyA/IHRoaXMub3B0aW9ucy5pbkFtYXpvbkFwcFN0b3JlIDogdGhpcy50eXBlID09ICdpb3MnID8gdGhpcy5vcHRpb25zLmluQXBwU3RvcmUgOiB0aGlzLm9wdGlvbnMuaW5XaW5kb3dzU3RvcmUpIDogJydcbiAgICAgICAgICAgICAgLCBnbG9zcz10aGlzLm9wdGlvbnMuaWNvbkdsb3NzID09PSBudWxsID8gKHRoaXMudHlwZT09J2lvcycpIDogdGhpcy5vcHRpb25zLmljb25HbG9zc1xuXG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09ICdhbmRyb2lkJyAmJiB0aGlzLm9wdGlvbnMuR29vZ2xlUGxheVBhcmFtcykge1xuICAgICAgICAgICAgICBsaW5rID0gbGluayArICcmcmVmZXJyZXI9JyArIHRoaXMub3B0aW9ucy5Hb29nbGVQbGF5UGFyYW1zO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYmFubmVyID0gJzxkaXYgaWQ9XCJzbWFydGJhbm5lclwiIGNsYXNzPVwiJyt0aGlzLnR5cGUrJ1wiPjxkaXYgY2xhc3M9XCJzYi1jb250YWluZXJcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwic2ItY2xvc2VcIj4mdGltZXM7PC9hPjxzcGFuIGNsYXNzPVwic2ItaWNvblwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwic2ItaW5mb1wiPjxzdHJvbmc+Jyt0aGlzLnRpdGxlKyc8L3N0cm9uZz48c3Bhbj4nK3RoaXMuYXV0aG9yKyc8L3NwYW4+PHNwYW4+JytpblN0b3JlKyc8L3NwYW4+PC9kaXY+PGEgaHJlZj1cIicrbGluaysnXCIgY2xhc3M9XCJzYi1idXR0b25cIj48c3Bhbj4nK3RoaXMub3B0aW9ucy5idXR0b24rJzwvc3Bhbj48L2E+PC9kaXY+PC9kaXY+JztcbiAgICAgICAgICAgICh0aGlzLm9wdGlvbnMubGF5ZXIpID8gJCh0aGlzLm9wdGlvbnMuYXBwZW5kVG9TZWxlY3RvcikuYXBwZW5kKGJhbm5lcikgOiAkKHRoaXMub3B0aW9ucy5hcHBlbmRUb1NlbGVjdG9yKS5wcmVwZW5kKGJhbm5lcik7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWNvbikge1xuICAgICAgICAgICAgICAgIGljb25VUkwgPSB0aGlzLm9wdGlvbnMuaWNvblxuICAgICAgICAgICAgfSBlbHNlIGlmKHRoaXMuaWNvblVybCkge1xuICAgICAgICAgICAgICAgIGljb25VUkwgPSB0aGlzLmljb25Vcmw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQoJ2xpbmtbcmVsPVwiYXBwbGUtdG91Y2gtaWNvbi1wcmVjb21wb3NlZFwiXScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpY29uVVJMID0gJCgnbGlua1tyZWw9XCJhcHBsZS10b3VjaC1pY29uLXByZWNvbXBvc2VkXCJdJykuYXR0cignaHJlZicpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5pY29uR2xvc3MgPT09IG51bGwpIGdsb3NzID0gZmFsc2VcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnbGlua1tyZWw9XCJhcHBsZS10b3VjaC1pY29uXCJdJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGljb25VUkwgPSAkKCdsaW5rW3JlbD1cImFwcGxlLXRvdWNoLWljb25cIl0nKS5hdHRyKCdocmVmJylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJCgnbWV0YVtuYW1lPVwibXNBcHBsaWNhdGlvbi1UaWxlSW1hZ2VcIl0nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGljb25VUkwgPSAkKCdtZXRhW25hbWU9XCJtc0FwcGxpY2F0aW9uLVRpbGVJbWFnZVwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCdtZXRhW25hbWU9XCJtc2FwcGxpY2F0aW9uLVRpbGVJbWFnZVwiXScpLmxlbmd0aCA+IDApIHsgLyogcmVkdW5kYW50IGJlY2F1c2UgbXMgZG9jcyBzaG93IHR3byBjYXNlIHVzYWdlcyAqL1xuICAgICAgICAgICAgICBpY29uVVJMID0gJCgnbWV0YVtuYW1lPVwibXNhcHBsaWNhdGlvbi1UaWxlSW1hZ2VcIl0nKS5hdHRyKCdjb250ZW50JylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGljb25VUkwpIHtcbiAgICAgICAgICAgICAgICAkKCcjc21hcnRiYW5uZXIgLnNiLWljb24nKS5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnLCd1cmwoJytpY29uVVJMKycpJylcbiAgICAgICAgICAgICAgICBpZiAoZ2xvc3MpICQoJyNzbWFydGJhbm5lciAuc2ItaWNvbicpLmFkZENsYXNzKCdnbG9zcycpXG4gICAgICAgICAgICB9IGVsc2V7XG4gICAgICAgICAgICAgICAgJCgnI3NtYXJ0YmFubmVyJykuYWRkQ2xhc3MoJ25vLWljb24nKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJhbm5lckhlaWdodCA9ICQoJyNzbWFydGJhbm5lcicpLm91dGVySGVpZ2h0KCkgKyAyXG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNjYWxlID4gMSkge1xuICAgICAgICAgICAgICAgICQoJyNzbWFydGJhbm5lcicpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ3RvcCcsIHBhcnNlRmxvYXQoJCgnI3NtYXJ0YmFubmVyJykuY3NzKCd0b3AnKSkgKiB0aGlzLnNjYWxlKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCdoZWlnaHQnLCBwYXJzZUZsb2F0KCQoJyNzbWFydGJhbm5lcicpLmNzcygnaGVpZ2h0JykpICogdGhpcy5zY2FsZSlcbiAgICAgICAgICAgICAgICAgICAgLmhpZGUoKVxuICAgICAgICAgICAgICAgICQoJyNzbWFydGJhbm5lciAuc2ItY29udGFpbmVyJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnLXdlYmtpdC10cmFuc2Zvcm0nLCAnc2NhbGUoJyt0aGlzLnNjYWxlKycpJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcygnLW1zaWUtdHJhbnNmb3JtJywgJ3NjYWxlKCcrdGhpcy5zY2FsZSsnKScpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJy1tb3otdHJhbnNmb3JtJywgJ3NjYWxlKCcrdGhpcy5zY2FsZSsnKScpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoJ3dpZHRoJywgJCh3aW5kb3cpLndpZHRoKCkgLyB0aGlzLnNjYWxlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnI3NtYXJ0YmFubmVyJykuY3NzKCdwb3NpdGlvbicsICh0aGlzLm9wdGlvbnMubGF5ZXIpID8gJ2Fic29sdXRlJyA6ICdzdGF0aWMnKVxuICAgICAgICB9XG5cbiAgICAgICwgbGlzdGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjc21hcnRiYW5uZXIgLnNiLWNsb3NlJykub24oJ2NsaWNrJywkLnByb3h5KHRoaXMuY2xvc2UsIHRoaXMpKVxuICAgICAgICAgICAgJCgnI3NtYXJ0YmFubmVyIC5zYi1idXR0b24nKS5vbignY2xpY2snLCQucHJveHkodGhpcy5pbnN0YWxsLCB0aGlzKSlcbiAgICAgICAgfVxuXG4gICAgICAsIHNob3c6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgYmFubmVyID0gJCgnI3NtYXJ0YmFubmVyJyk7XG4gICAgICAgICAgICBiYW5uZXIuc3RvcCgpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmxheWVyKSB7XG4gICAgICAgICAgICAgICAgYmFubmVyLmFuaW1hdGUoe3RvcDogMCwgZGlzcGxheTogJ2Jsb2NrJ30sIHRoaXMub3B0aW9ucy5zcGVlZEluKS5hZGRDbGFzcygnc2hvd24nKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnB1c2hTZWxlY3RvcikuYW5pbWF0ZSh7cGFkZGluZ1RvcDogdGhpcy5vcmlnSHRtbE1hcmdpbiArICh0aGlzLmJhbm5lckhlaWdodCAqIHRoaXMuc2NhbGUpfSwgdGhpcy5vcHRpb25zLnNwZWVkSW4sICdzd2luZycsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuc3VwcG9ydC50cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGJhbm5lci5hbmltYXRlKHt0b3A6MH0sdGhpcy5vcHRpb25zLnNwZWVkSW4pLmFkZENsYXNzKCdzaG93bicpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ3NiLWFuaW1hdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnB1c2hTZWxlY3RvcikuYWRkQ2xhc3MoJ3NiLWFuaW1hdGlvbicpLm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIHRyYW5zaXRpb25DYWxsYmFjaykuZW11bGF0ZVRyYW5zaXRpb25FbmQodGhpcy5vcHRpb25zLnNwZWVkSW4pLmNzcygnbWFyZ2luLXRvcCcsIHRoaXMub3JpZ0h0bWxNYXJnaW4rKHRoaXMuYmFubmVySGVpZ2h0KnRoaXMuc2NhbGUpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBiYW5uZXIuc2xpZGVEb3duKHRoaXMub3B0aW9ucy5zcGVlZEluKS5hZGRDbGFzcygnc2hvd24nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgLCBoaWRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIGJhbm5lciA9ICQoJyNzbWFydGJhbm5lcicpO1xuICAgICAgICAgICAgYmFubmVyLnN0b3AoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYXllcikge1xuICAgICAgICAgICAgICAgIGJhbm5lci5hbmltYXRlKHt0b3A6IC0xICogdGhpcy5iYW5uZXJIZWlnaHQgKiB0aGlzLnNjYWxlLCBkaXNwbGF5OiAnYmxvY2snfSwgdGhpcy5vcHRpb25zLnNwZWVkSW4pLnJlbW92ZUNsYXNzKCdzaG93bicpO1xuICAgICAgICAgICAgICAgICQodGhpcy5wdXNoU2VsZWN0b3IpLmFuaW1hdGUoe3BhZGRpbmdUb3A6IHRoaXMub3JpZ0h0bWxNYXJnaW59LCB0aGlzLm9wdGlvbnMuc3BlZWRJbiwgJ3N3aW5nJywgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5zdXBwb3J0LnRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0aGlzLnR5cGUgIT09ICdhbmRyb2lkJyApXG4gICAgICAgICAgICAgICAgICAgICAgYmFubmVyLmNzcygndG9wJywgLTEqdGhpcy5iYW5uZXJIZWlnaHQqdGhpcy5zY2FsZSkucmVtb3ZlQ2xhc3MoJ3Nob3duJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICBiYW5uZXIuY3NzKHtkaXNwbGF5Oidub25lJ30pLnJlbW92ZUNsYXNzKCdzaG93bicpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNpdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ3NiLWFuaW1hdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnB1c2hTZWxlY3RvcikuYWRkQ2xhc3MoJ3NiLWFuaW1hdGlvbicpLm9uZSgkLnN1cHBvcnQudHJhbnNpdGlvbi5lbmQsIHRyYW5zaXRpb25DYWxsYmFjaykuZW11bGF0ZVRyYW5zaXRpb25FbmQodGhpcy5vcHRpb25zLnNwZWVkT3V0KS5jc3MoJ21hcmdpbi10b3AnLCB0aGlzLm9yaWdIdG1sTWFyZ2luKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBiYW5uZXIuc2xpZGVVcCh0aGlzLm9wdGlvbnMuc3BlZWRPdXQpLnJlbW92ZUNsYXNzKCdzaG93bicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAsIGNsb3NlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICAgICAgICB0aGlzLnNldENvb2tpZSgnc2ItY2xvc2VkJywndHJ1ZScsdGhpcy5vcHRpb25zLmRheXNIaWRkZW4pO1xuICAgICAgICB9XG5cbiAgICAgICwgaW5zdGFsbDogZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWRlT25JbnN0YWxsKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpXG4gICAgICB9XG4gICAgICAgICAgICB0aGlzLnNldENvb2tpZSgnc2ItaW5zdGFsbGVkJywndHJ1ZScsdGhpcy5vcHRpb25zLmRheXNSZW1pbmRlcilcbiAgICAgICAgfVxuXG4gICAgICAsIHNldENvb2tpZTogZnVuY3Rpb24obmFtZSwgdmFsdWUsIGV4ZGF5cykge1xuICAgICAgICAgICAgdmFyIGV4ZGF0ZSA9IG5ldyBEYXRlKClcbiAgICAgICAgICAgIGV4ZGF0ZS5zZXREYXRlKGV4ZGF0ZS5nZXREYXRlKCkrZXhkYXlzKVxuICAgICAgICAgICAgdmFsdWU9ZW5jb2RlVVJJKHZhbHVlKSsoKGV4ZGF5cz09bnVsbCk/Jyc6JzsgZXhwaXJlcz0nK2V4ZGF0ZS50b1VUQ1N0cmluZygpKVxuICAgICAgICAgICAgZG9jdW1lbnQuY29va2llPW5hbWUrJz0nK3ZhbHVlKyc7IHBhdGg9LzsnXG4gICAgICAgIH1cblxuICAgICAgLCBnZXRDb29raWU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpLHgseSxBUlJjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KFwiO1wiKVxuICAgICAgICAgICAgZm9yKGk9MDtpPEFSUmNvb2tpZXMubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgICAgIHggPSBBUlJjb29raWVzW2ldLnN1YnN0cigwLEFSUmNvb2tpZXNbaV0uaW5kZXhPZihcIj1cIikpXG4gICAgICAgICAgICAgICAgeSA9IEFSUmNvb2tpZXNbaV0uc3Vic3RyKEFSUmNvb2tpZXNbaV0uaW5kZXhPZihcIj1cIikrMSlcbiAgICAgICAgICAgICAgICB4ID0geC5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLFwiXCIpXG4gICAgICAgICAgICAgICAgaWYgKHg9PW5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSSh5KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH1cblxuICAgICAgLy8gRGVtbyBvbmx5XG4gICAgICAsIHN3aXRjaFR5cGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0aGF0ID0gdGhpc1xuXG4gICAgICAgICAgdGhpcy5oaWRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgdGhhdC50eXBlID0gdGhhdC50eXBlID09ICdhbmRyb2lkJyA/ICdpb3MnIDogJ2FuZHJvaWQnXG4gICAgICAgICAgICAgIHZhciBtZXRhID0gJCh0aGF0LnR5cGUgPT0gJ2FuZHJvaWQnID8gJ21ldGFbbmFtZT1cImdvb2dsZS1wbGF5LWFwcFwiXScgOiAnbWV0YVtuYW1lPVwiYXBwbGUtaXR1bmVzLWFwcFwiXScpLmF0dHIoJ2NvbnRlbnQnKVxuICAgICAgICAgICAgICB0aGF0LmFwcElkID0gL2FwcC1pZD0oW15cXHMsXSspLy5leGVjKG1ldGEpWzFdXG5cbiAgICAgICAgICAgICAgJCgnI3NtYXJ0YmFubmVyJykuZGV0YWNoKClcbiAgICAgICAgICAgICAgdGhhdC5jcmVhdGUoKVxuICAgICAgICAgICAgICB0aGF0LnNob3coKVxuICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgJC5zbWFydGJhbm5lciA9IGZ1bmN0aW9uIChvcHRpb24pIHtcbiAgICAgICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdylcbiAgICAgICAgLCBkYXRhID0gJHdpbmRvdy5kYXRhKCdzbWFydGJhbm5lcicpXG4gICAgICAgICwgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT0gJ29iamVjdCcgJiYgb3B0aW9uXG4gICAgICAgIGlmICghZGF0YSkgJHdpbmRvdy5kYXRhKCdzbWFydGJhbm5lcicsIChkYXRhID0gbmV3IFNtYXJ0QmFubmVyKG9wdGlvbnMpKSlcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT0gJ3N0cmluZycpIGRhdGFbb3B0aW9uXSgpXG4gICAgfVxuXG4gICAgLy8gb3ZlcnJpZGUgdGhlc2UgZ2xvYmFsbHkgaWYgeW91IGxpa2UgKHRoZXkgYXJlIGFsbCBvcHRpb25hbClcbiAgICAkLnNtYXJ0YmFubmVyLmRlZmF1bHRzID0ge1xuICAgICAgICB0aXRsZTogbnVsbCwgLy8gV2hhdCB0aGUgdGl0bGUgb2YgdGhlIGFwcCBzaG91bGQgYmUgaW4gdGhlIGJhbm5lciAoZGVmYXVsdHMgdG8gPHRpdGxlPilcbiAgICAgICAgYXV0aG9yOiBudWxsLCAvLyBXaGF0IHRoZSBhdXRob3Igb2YgdGhlIGFwcCBzaG91bGQgYmUgaW4gdGhlIGJhbm5lciAoZGVmYXVsdHMgdG8gPG1ldGEgbmFtZT1cImF1dGhvclwiPiBvciBob3N0bmFtZSlcbiAgICAgICAgcHJpY2U6ICdGUkVFJywgLy8gUHJpY2Ugb2YgdGhlIGFwcFxuICAgICAgICBhcHBTdG9yZUxhbmd1YWdlOiAndXMnLCAvLyBMYW5ndWFnZSBjb2RlIGZvciBBcHAgU3RvcmVcbiAgICAgICAgaW5BcHBTdG9yZTogJ09uIHRoZSBBcHAgU3RvcmUnLCAvLyBUZXh0IG9mIHByaWNlIGZvciBpT1NcbiAgICAgICAgaW5Hb29nbGVQbGF5OiAnSW4gR29vZ2xlIFBsYXknLCAvLyBUZXh0IG9mIHByaWNlIGZvciBBbmRyb2lkXG4gICAgICAgIGluQW1hem9uQXBwU3RvcmU6ICdJbiB0aGUgQW1hem9uIEFwcHN0b3JlJyxcbiAgICAgICAgaW5XaW5kb3dzU3RvcmU6ICdJbiB0aGUgV2luZG93cyBTdG9yZScsIC8vVGV4dCBvZiBwcmljZSBmb3IgV2luZG93c1xuICAgICAgICBHb29nbGVQbGF5UGFyYW1zOiBudWxsLCAvLyBBZGl0aW9uYWwgcGFyYW1ldGVycyBmb3IgdGhlIG1hcmtldFxuICAgICAgICBpY29uOiBudWxsLCAvLyBUaGUgVVJMIG9mIHRoZSBpY29uIChkZWZhdWx0cyB0byA8bWV0YSBuYW1lPVwiYXBwbGUtdG91Y2gtaWNvblwiPilcbiAgICAgICAgaWNvbkdsb3NzOiBudWxsLCAvLyBGb3JjZSBnbG9zcyBlZmZlY3QgZm9yIGlPUyBldmVuIGZvciBwcmVjb21wb3NlZFxuICAgICAgICBidXR0b246ICdWSUVXJywgLy8gVGV4dCBmb3IgdGhlIGluc3RhbGwgYnV0dG9uXG4gICAgICAgIHVybDogbnVsbCwgLy8gVGhlIFVSTCBmb3IgdGhlIGJ1dHRvbi4gS2VlcCBudWxsIGlmIHlvdSB3YW50IHRoZSBidXR0b24gdG8gbGluayB0byB0aGUgYXBwIHN0b3JlLlxuICAgICAgICBzY2FsZTogJ2F1dG8nLCAvLyBTY2FsZSBiYXNlZCBvbiB2aWV3cG9ydCBzaXplIChzZXQgdG8gMSB0byBkaXNhYmxlKVxuICAgICAgICBzcGVlZEluOiAzMDAsIC8vIFNob3cgYW5pbWF0aW9uIHNwZWVkIG9mIHRoZSBiYW5uZXJcbiAgICAgICAgc3BlZWRPdXQ6IDQwMCwgLy8gQ2xvc2UgYW5pbWF0aW9uIHNwZWVkIG9mIHRoZSBiYW5uZXJcbiAgICAgICAgZGF5c0hpZGRlbjogMTUsIC8vIER1cmF0aW9uIHRvIGhpZGUgdGhlIGJhbm5lciBhZnRlciBiZWluZyBjbG9zZWQgKDAgPSBhbHdheXMgc2hvdyBiYW5uZXIpXG4gICAgICAgIGRheXNSZW1pbmRlcjogOTAsIC8vIER1cmF0aW9uIHRvIGhpZGUgdGhlIGJhbm5lciBhZnRlciBcIlZJRVdcIiBpcyBjbGlja2VkICpzZXBhcmF0ZSBmcm9tIHdoZW4gdGhlIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkKiAoMCA9IGFsd2F5cyBzaG93IGJhbm5lcilcbiAgICAgICAgZm9yY2U6IG51bGwsIC8vIENob29zZSAnaW9zJywgJ2FuZHJvaWQnIG9yICd3aW5kb3dzJy4gRG9uJ3QgZG8gYSBicm93c2VyIGNoZWNrLCBqdXN0IGFsd2F5cyBzaG93IHRoaXMgYmFubmVyXG4gICAgICAgIGhpZGVPbkluc3RhbGw6IHRydWUsIC8vIEhpZGUgdGhlIGJhbm5lciBhZnRlciBcIlZJRVdcIiBpcyBjbGlja2VkLlxuICAgICAgICBsYXllcjogdHJ1ZSwgLy8gRGlzcGxheSBhcyBvdmVybGF5IGxheWVyIG9yIHNsaWRlIGRvd24gdGhlIHBhZ2VcbiAgICAgICAgaU9TVW5pdmVyc2FsQXBwOiB0cnVlLCAvLyBJZiB0aGUgaU9TIEFwcCBpcyBhIHVuaXZlcnNhbCBhcHAgZm9yIGJvdGggaVBhZCBhbmQgaVBob25lLCBkaXNwbGF5IFNtYXJ0IEJhbm5lciB0byBpUGFkIHVzZXJzLCB0b28uXG4gICAgICAgIGFwcGVuZFRvU2VsZWN0b3I6ICdib2R5JywgLy9BcHBlbmQgdGhlIGJhbm5lciB0byBhIHNwZWNpZmljIHNlbGVjdG9yXG4gICAgcHVzaFNlbGVjdG9yOiAnaHRtbCcgLy8gV2hhdCBlbGVtZW50IGlzIGdvaW5nIHRvIHB1c2ggdGhlIHNpdGUgY29udGVudCBkb3duOyB0aGlzIGlzIHdoZXJlIHRoZSBiYW5uZXIgYXBwZW5kIGFuaW1hdGlvbiB3aWxsIHN0YXJ0LlxuICAgIH1cblxuICAgICQuc21hcnRiYW5uZXIuQ29uc3RydWN0b3IgPSBTbWFydEJhbm5lcjtcblxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gQm9vdHN0cmFwIHRyYW5zaXRpb25cbiAgICAvLyBDb3B5cmlnaHQgMjAxMS0yMDE0IFR3aXR0ZXIsIEluYy5cbiAgICAvLyBMaWNlbnNlZCB1bmRlciBNSVQgKGh0dHBzOi8vZ2l0aHViLmNvbS90d2JzL2Jvb3RzdHJhcC9ibG9iL21hc3Rlci9MSUNFTlNFKVxuXG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc21hcnRiYW5uZXInKVxuXG4gICAgICAgIHZhciB0cmFuc0VuZEV2ZW50TmFtZXMgPSB7XG4gICAgICAgICAgICBXZWJraXRUcmFuc2l0aW9uOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAgICAgICBNb3pUcmFuc2l0aW9uOiAndHJhbnNpdGlvbmVuZCcsXG4gICAgICAgICAgICBPVHJhbnNpdGlvbjogJ29UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kJyxcbiAgICAgICAgICAgIHRyYW5zaXRpb246ICd0cmFuc2l0aW9uZW5kJ1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0cmFuc0VuZEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAgIGlmIChlbC5zdHlsZVtuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtlbmQ6IHRyYW5zRW5kRXZlbnROYW1lc1tuYW1lXX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZSAvLyBleHBsaWNpdCBmb3IgaWU4ICggIC5fLilcbiAgICB9XG5cbiAgICBpZiAoJC5zdXBwb3J0LnRyYW5zaXRpb24gIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuICAvLyBQcmV2ZW50IGNvbmZsaWN0IHdpdGggVHdpdHRlciBCb290c3RyYXBcblxuICAgIC8vIGh0dHA6Ly9ibG9nLmFsZXhtYWNjYXcuY29tL2Nzcy10cmFuc2l0aW9uc1xuICAgICQuZm4uZW11bGF0ZVRyYW5zaXRpb25FbmQgPSBmdW5jdGlvbihkdXJhdGlvbikge1xuICAgICAgICB2YXIgY2FsbGVkID0gZmFsc2UsICRlbCA9IHRoaXNcbiAgICAgICAgJCh0aGlzKS5vbmUoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNhbGxlZCA9IHRydWVcbiAgICAgICAgfSlcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxlZCkgJCgkZWwpLnRyaWdnZXIoJC5zdXBwb3J0LnRyYW5zaXRpb24uZW5kKVxuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIGR1cmF0aW9uKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cblxuICAgICQoZnVuY3Rpb24oKSB7XG4gICAgICAgICQuc3VwcG9ydC50cmFuc2l0aW9uID0gdHJhbnNpdGlvbkVuZCgpXG4gICAgfSlcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxufSh3aW5kb3cualF1ZXJ5KTsiLCJcbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgTmljayBHYWxicmVhdGhcbiAqIGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9zdHJpbmdlbmNvZGVycy9zb3VyY2UvYnJvd3NlLyNzdm4vdHJ1bmsvamF2YXNjcmlwdFxuI1xuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXRcbiAqIHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLFxuICogY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4jXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZVxuICogaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4jXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORFxuICogTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFRcbiAqIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLFxuICogV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4gKiBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SXG4gKiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyogYmFzZTY0IGVuY29kZS9kZWNvZGUgY29tcGF0aWJsZSB3aXRoIHdpbmRvdy5idG9hL2F0b2JcbiNcbiAqIHdpbmRvdy5hdG9iL2J0b2EgaXMgYSBGaXJlZm94IGV4dGVuc2lvbiB0byBjb252ZXJ0IGJpbmFyeSBkYXRhICh0aGUgXCJiXCIpXG4gKiB0byBiYXNlNjQgKGFzY2lpLCB0aGUgXCJhXCIpLlxuI1xuICogSXQgaXMgYWxzbyBmb3VuZCBpbiBTYWZhcmkgYW5kIENocm9tZS4gIEl0IGlzIG5vdCBhdmFpbGFibGUgaW4gSUUuXG4jXG4gKiBpZiAoIXdpbmRvdy5idG9hKSB3aW5kb3cuYnRvYSA9IGJhc2U2NC5lbmNvZGVcbiAqIGlmICghd2luZG93LmF0b2IpIHdpbmRvdy5hdG9iID0gYmFzZTY0LmRlY29kZVxuI1xuICogVGhlIG9yaWdpbmFsIHNwZWMncyBmb3IgYXRvYi9idG9hIGFyZSBhIGJpdCBsYWNraW5nXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LmF0b2JcbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cuYnRvYVxuI1xuICogd2luZG93LmJ0b2EgYW5kIGJhc2U2NC5lbmNvZGUgdGFrZXMgYSBzdHJpbmcgd2hlcmUgY2hhckNvZGVBdCBpcyBbMCwyNTVdXG4gKiBJZiBhbnkgY2hhcmFjdGVyIGlzIG5vdCBbMCwyNTVdLCB0aGVuIGFuIERPTUV4Y2VwdGlvbig1KSBpcyB0aHJvd24uXG4jXG4gKiB3aW5kb3cuYXRvYiBhbmQgYmFzZTY0LmRlY29kZSB0YWtlIGEgYmFzZTY0LWVuY29kZWQgc3RyaW5nXG4gKiBJZiB0aGUgaW5wdXQgbGVuZ3RoIGlzIG5vdCBhIG11bHRpcGxlIG9mIDQsIG9yIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyc1xuICogICB0aGVuIGFuIERPTUV4Y2VwdGlvbig1KSBpcyB0aHJvd24uXG4gKi9cbnZhciBiYXNlNjQ7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZTY0ID0ge307XG5cbmJhc2U2NC5QQURDSEFSID0gJz0nO1xuXG5iYXNlNjQuQUxQSEEgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbmJhc2U2NC5tYWtlRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlLCBleCwgdG1wO1xuICBlID0gdm9pZCAwO1xuICB0bXAgPSB2b2lkIDA7XG4gIHRyeSB7XG4gICAgcmV0dXJuIG5ldyBET01FeGNlcHRpb24oRE9NRXhjZXB0aW9uLklOVkFMSURfQ0hBUkFDVEVSX0VSUik7XG4gIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgIHRtcCA9IF9lcnJvcjtcbiAgICBleCA9IG5ldyBFcnJvcignRE9NIEV4Y2VwdGlvbiA1Jyk7XG4gICAgZXguY29kZSA9IGV4Lm51bWJlciA9IDU7XG4gICAgZXgubmFtZSA9IGV4LmRlc2NyaXB0aW9uID0gJ0lOVkFMSURfQ0hBUkFDVEVSX0VSUic7XG4gICAgZXgudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnRXJyb3I6ICcgKyBleC5uYW1lICsgJzogJyArIGV4Lm1lc3NhZ2U7XG4gICAgfTtcbiAgICByZXR1cm4gZXg7XG4gIH1cbn07XG5cbmJhc2U2NC5nZXRieXRlNjQgPSBmdW5jdGlvbihzLCBpKSB7XG4gIHZhciBpZHg7XG4gIGlkeCA9IGJhc2U2NC5BTFBIQS5pbmRleE9mKHMuY2hhckF0KGkpKTtcbiAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICB0aHJvdyBiYXNlNjQubWFrZURPTUV4Y2VwdGlvbigpO1xuICB9XG4gIHJldHVybiBpZHg7XG59O1xuXG5iYXNlNjQuZGVjb2RlID0gZnVuY3Rpb24ocykge1xuICB2YXIgYjEwLCBnZXRieXRlNjQsIGksIGltYXgsIHBhZHMsIHg7XG4gIHMgPSAnJyArIHM7XG4gIGdldGJ5dGU2NCA9IGJhc2U2NC5nZXRieXRlNjQ7XG4gIHBhZHMgPSB2b2lkIDA7XG4gIGkgPSB2b2lkIDA7XG4gIGIxMCA9IHZvaWQgMDtcbiAgaW1heCA9IHMubGVuZ3RoO1xuICBpZiAoaW1heCA9PT0gMCkge1xuICAgIHJldHVybiBzO1xuICB9XG4gIGlmIChpbWF4ICUgNCAhPT0gMCkge1xuICAgIHRocm93IGJhc2U2NC5tYWtlRE9NRXhjZXB0aW9uKCk7XG4gIH1cbiAgcGFkcyA9IDA7XG4gIGlmIChzLmNoYXJBdChpbWF4IC0gMSkgPT09IGJhc2U2NC5QQURDSEFSKSB7XG4gICAgcGFkcyA9IDE7XG4gICAgaWYgKHMuY2hhckF0KGltYXggLSAyKSA9PT0gYmFzZTY0LlBBRENIQVIpIHtcbiAgICAgIHBhZHMgPSAyO1xuICAgIH1cbiAgICBpbWF4IC09IDQ7XG4gIH1cbiAgeCA9IFtdO1xuICBpID0gMDtcbiAgd2hpbGUgKGkgPCBpbWF4KSB7XG4gICAgYjEwID0gZ2V0Ynl0ZTY0KHMsIGkpIDw8IDE4IHwgZ2V0Ynl0ZTY0KHMsIGkgKyAxKSA8PCAxMiB8IGdldGJ5dGU2NChzLCBpICsgMikgPDwgNiB8IGdldGJ5dGU2NChzLCBpICsgMyk7XG4gICAgeC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYjEwID4+IDE2LCBiMTAgPj4gOCAmIDB4ZmYsIGIxMCAmIDB4ZmYpKTtcbiAgICBpICs9IDQ7XG4gIH1cbiAgc3dpdGNoIChwYWRzKSB7XG4gICAgY2FzZSAxOlxuICAgICAgYjEwID0gZ2V0Ynl0ZTY0KHMsIGkpIDw8IDE4IHwgZ2V0Ynl0ZTY0KHMsIGkgKyAxKSA8PCAxMiB8IGdldGJ5dGU2NChzLCBpICsgMikgPDwgNjtcbiAgICAgIHgucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGIxMCA+PiAxNiwgYjEwID4+IDggJiAweGZmKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIDI6XG4gICAgICBiMTAgPSBnZXRieXRlNjQocywgaSkgPDwgMTggfCBnZXRieXRlNjQocywgaSArIDEpIDw8IDEyO1xuICAgICAgeC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYjEwID4+IDE2KSk7XG4gIH1cbiAgcmV0dXJuIHguam9pbignJyk7XG59O1xuXG5iYXNlNjQuZ2V0Ynl0ZSA9IGZ1bmN0aW9uKHMsIGkpIHtcbiAgdmFyIHg7XG4gIHggPSBzLmNoYXJDb2RlQXQoaSk7XG4gIGlmICh4ID4gMjU1KSB7XG4gICAgdGhyb3cgYmFzZTY0Lm1ha2VET01FeGNlcHRpb24oKTtcbiAgfVxuICByZXR1cm4geDtcbn07XG5cbmJhc2U2NC5lbmNvZGUgPSBmdW5jdGlvbihzKSB7XG4gIHZhciBhbHBoYSwgYjEwLCBnZXRieXRlLCBpLCBpbWF4LCBwYWRjaGFyLCB4O1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignTm90IGVub3VnaCBhcmd1bWVudHMnKTtcbiAgfVxuICBwYWRjaGFyID0gYmFzZTY0LlBBRENIQVI7XG4gIGFscGhhID0gYmFzZTY0LkFMUEhBO1xuICBnZXRieXRlID0gYmFzZTY0LmdldGJ5dGU7XG4gIGkgPSB2b2lkIDA7XG4gIGIxMCA9IHZvaWQgMDtcbiAgeCA9IFtdO1xuICBzID0gJycgKyBzO1xuICBpbWF4ID0gcy5sZW5ndGggLSBzLmxlbmd0aCAlIDM7XG4gIGlmIChzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBzO1xuICB9XG4gIGkgPSAwO1xuICB3aGlsZSAoaSA8IGltYXgpIHtcbiAgICBiMTAgPSBnZXRieXRlKHMsIGkpIDw8IDE2IHwgZ2V0Ynl0ZShzLCBpICsgMSkgPDwgOCB8IGdldGJ5dGUocywgaSArIDIpO1xuICAgIHgucHVzaChhbHBoYS5jaGFyQXQoYjEwID4+IDE4KSk7XG4gICAgeC5wdXNoKGFscGhhLmNoYXJBdChiMTAgPj4gMTIgJiAweDNGKSk7XG4gICAgeC5wdXNoKGFscGhhLmNoYXJBdChiMTAgPj4gNiAmIDB4M2YpKTtcbiAgICB4LnB1c2goYWxwaGEuY2hhckF0KGIxMCAmIDB4M2YpKTtcbiAgICBpICs9IDM7XG4gIH1cbiAgc3dpdGNoIChzLmxlbmd0aCAtIGltYXgpIHtcbiAgICBjYXNlIDE6XG4gICAgICBiMTAgPSBnZXRieXRlKHMsIGkpIDw8IDE2O1xuICAgICAgeC5wdXNoKGFscGhhLmNoYXJBdChiMTAgPj4gMTgpICsgYWxwaGEuY2hhckF0KGIxMCA+PiAxMiAmIDB4M0YpICsgcGFkY2hhciArIHBhZGNoYXIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgYjEwID0gZ2V0Ynl0ZShzLCBpKSA8PCAxNiB8IGdldGJ5dGUocywgaSArIDEpIDw8IDg7XG4gICAgICB4LnB1c2goYWxwaGEuY2hhckF0KGIxMCA+PiAxOCkgKyBhbHBoYS5jaGFyQXQoYjEwID4+IDEyICYgMHgzRikgKyBhbHBoYS5jaGFyQXQoYjEwID4+IDYgJiAweDNmKSArIHBhZGNoYXIpO1xuICB9XG4gIHJldHVybiB4LmpvaW4oJycpO1xufTtcbiIsIlxuLypcbkhlcmUncyB0aGUgbWVhdCBhbmQgcG90YXRvZXMuIFVzYWdlXG5cbiAgaW1hZ2VMb2FkZXIoJ2ltZ0lkJyx7XG4gICAgICBzdWNjZXNzIDogZnVuY3Rpb24gKCkgeyBhbGVydCh0aGlzLndpZHRoKTsgfSxcbiAgICAgIGZhaWx1cmUgOiBmdW5jdGlvbiAoKSB7IGFsZXJ0KCdEYW1uIHlvdXIgZXllcyEnKTsgfSxcbiAgfSk7XG5cbiAgaW1hZ2VMb2FkZXIoJ2h0dHA6Ly9zb21lZG9tYWluLmNvbS9pbWFnZS90eXBvb2VkX3VybC5qcGcnLCB7XG4gICAgICBzdWNjZXNzIDogZnVuY3Rpb24gKCkgey4uLn0sXG4gICAgICBmYWlsdXJlIDogZnVuY3Rpb24gKCkgey4uLn0sXG4gICAgICB0YXJnZXQgOiBqUXVlcnkgRE9NLFxuICB9KTtcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzcmMsIGNmZykge1xuICB2YXIgJCwgaW1nLCBpc1R5cGUsIHByb3A7XG4gICQgPSBmdW5jdGlvbihpZCkge1xuICAgIGlmICghaWQgfHwgaWQubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB9XG4gIH07XG4gIGlzVHlwZSA9IGZ1bmN0aW9uKG8sIHQpIHtcbiAgICByZXR1cm4gKHR5cGVvZiBvKS5pbmRleE9mKHQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkpID09PSAwO1xuICB9O1xuICBjZmcgPSBjZmcgfHwgKGlzVHlwZShzcmMsICdvJykgPyBzcmMgOiB7fSk7XG4gIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICBzcmMgPSBzcmMgfHwgY2ZnLnNyYztcbiAgaWYgKCFzcmMpIHtcbiAgICB0aHJvdyAnSW1hZ2Ugc291cmNlIG5vdCBmb3VuZCc7XG4gIH1cbiAgcHJvcCA9IGlzVHlwZShpbWcubmF0dXJhbFdpZHRoLCAndScpID8gJ3dpZHRoJyA6ICduYXR1cmFsV2lkdGgnO1xuICBpbWcuYWx0ID0gY2ZnLmFsdCB8fCBpbWcuYWx0O1xuICBpbWcuc3JjID0gc3JjO1xuICBpZiAoY2ZnLnRhcmdldCkge1xuICAgIGNmZy50YXJnZXQuYXBwZW5kKGltZyk7XG4gIH1cbiAgaWYgKGltZy5jb21wbGV0ZSkge1xuICAgIGlmIChpbWdbcHJvcF0pIHtcbiAgICAgIGlmIChpc1R5cGUoY2ZnLnN1Y2Nlc3MsICdmJykpIHtcbiAgICAgICAgY2ZnLnN1Y2Nlc3MuY2FsbChpbWcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNUeXBlKGNmZy5mYWlsdXJlLCAnZicpKSB7XG4gICAgICAgIGNmZy5mYWlsdXJlLmNhbGwoaW1nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGlzVHlwZShjZmcuc3VjY2VzcywgJ2YnKSkge1xuICAgICAgaW1nLm9ubG9hZCA9IGNmZy5zdWNjZXNzO1xuICAgIH1cbiAgICBpZiAoaXNUeXBlKGNmZy5mYWlsdXJlLCAnZicpKSB7XG4gICAgICBpbWcub25lcnJvciA9IGNmZy5mYWlsdXJlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaW1nO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBtZDU6IHJlcXVpcmUoXCIuL21kNVwiKSxcbiAgYmFubmVyOiByZXF1aXJlKFwiLi9iYW5uZXJcIiksXG4gIGltYWdlTG9hZGVyOiByZXF1aXJlKFwiLi9pbWFnZUxvYWRlclwiKSxcbiAgYmFzZTY0OiByZXF1aXJlKFwiLi9iYXNlNjRcIilcbn07XG4iLCJ2YXIgYWRkMzIsIGNtbiwgZmYsIGdnLCBoZXgsIGhleF9jaHIsIGhoLCBpaSwgbWQ1MSwgbWQ1YmxrLCBtZDVjeWNsZSwgcmhleDtcblxuaGV4X2NociA9ICcwMTIzNDU2Nzg5YWJjZGVmJy5zcGxpdCgnJyk7XG5cbm1kNWN5Y2xlID0gZnVuY3Rpb24oeCwgaykge1xuICB2YXIgYSwgYiwgYywgZDtcbiAgYSA9IHhbMF07XG4gIGIgPSB4WzFdO1xuICBjID0geFsyXTtcbiAgZCA9IHhbM107XG4gIGEgPSBmZihhLCBiLCBjLCBkLCBrWzBdLCA3LCAtNjgwODc2OTM2KTtcbiAgZCA9IGZmKGQsIGEsIGIsIGMsIGtbMV0sIDEyLCAtMzg5NTY0NTg2KTtcbiAgYyA9IGZmKGMsIGQsIGEsIGIsIGtbMl0sIDE3LCA2MDYxMDU4MTkpO1xuICBiID0gZmYoYiwgYywgZCwgYSwga1szXSwgMjIsIC0xMDQ0NTI1MzMwKTtcbiAgYSA9IGZmKGEsIGIsIGMsIGQsIGtbNF0sIDcsIC0xNzY0MTg4OTcpO1xuICBkID0gZmYoZCwgYSwgYiwgYywga1s1XSwgMTIsIDEyMDAwODA0MjYpO1xuICBjID0gZmYoYywgZCwgYSwgYiwga1s2XSwgMTcsIC0xNDczMjMxMzQxKTtcbiAgYiA9IGZmKGIsIGMsIGQsIGEsIGtbN10sIDIyLCAtNDU3MDU5ODMpO1xuICBhID0gZmYoYSwgYiwgYywgZCwga1s4XSwgNywgMTc3MDAzNTQxNik7XG4gIGQgPSBmZihkLCBhLCBiLCBjLCBrWzldLCAxMiwgLTE5NTg0MTQ0MTcpO1xuICBjID0gZmYoYywgZCwgYSwgYiwga1sxMF0sIDE3LCAtNDIwNjMpO1xuICBiID0gZmYoYiwgYywgZCwgYSwga1sxMV0sIDIyLCAtMTk5MDQwNDE2Mik7XG4gIGEgPSBmZihhLCBiLCBjLCBkLCBrWzEyXSwgNywgMTgwNDYwMzY4Mik7XG4gIGQgPSBmZihkLCBhLCBiLCBjLCBrWzEzXSwgMTIsIC00MDM0MTEwMSk7XG4gIGMgPSBmZihjLCBkLCBhLCBiLCBrWzE0XSwgMTcsIC0xNTAyMDAyMjkwKTtcbiAgYiA9IGZmKGIsIGMsIGQsIGEsIGtbMTVdLCAyMiwgMTIzNjUzNTMyOSk7XG4gIGEgPSBnZyhhLCBiLCBjLCBkLCBrWzFdLCA1LCAtMTY1Nzk2NTEwKTtcbiAgZCA9IGdnKGQsIGEsIGIsIGMsIGtbNl0sIDksIC0xMDY5NTAxNjMyKTtcbiAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbMTFdLCAxNCwgNjQzNzE3NzEzKTtcbiAgYiA9IGdnKGIsIGMsIGQsIGEsIGtbMF0sIDIwLCAtMzczODk3MzAyKTtcbiAgYSA9IGdnKGEsIGIsIGMsIGQsIGtbNV0sIDUsIC03MDE1NTg2OTEpO1xuICBkID0gZ2coZCwgYSwgYiwgYywga1sxMF0sIDksIDM4MDE2MDgzKTtcbiAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbMTVdLCAxNCwgLTY2MDQ3ODMzNSk7XG4gIGIgPSBnZyhiLCBjLCBkLCBhLCBrWzRdLCAyMCwgLTQwNTUzNzg0OCk7XG4gIGEgPSBnZyhhLCBiLCBjLCBkLCBrWzldLCA1LCA1Njg0NDY0MzgpO1xuICBkID0gZ2coZCwgYSwgYiwgYywga1sxNF0sIDksIC0xMDE5ODAzNjkwKTtcbiAgYyA9IGdnKGMsIGQsIGEsIGIsIGtbM10sIDE0LCAtMTg3MzYzOTYxKTtcbiAgYiA9IGdnKGIsIGMsIGQsIGEsIGtbOF0sIDIwLCAxMTYzNTMxNTAxKTtcbiAgYSA9IGdnKGEsIGIsIGMsIGQsIGtbMTNdLCA1LCAtMTQ0NDY4MTQ2Nyk7XG4gIGQgPSBnZyhkLCBhLCBiLCBjLCBrWzJdLCA5LCAtNTE0MDM3ODQpO1xuICBjID0gZ2coYywgZCwgYSwgYiwga1s3XSwgMTQsIDE3MzUzMjg0NzMpO1xuICBiID0gZ2coYiwgYywgZCwgYSwga1sxMl0sIDIwLCAtMTkyNjYwNzczNCk7XG4gIGEgPSBoaChhLCBiLCBjLCBkLCBrWzVdLCA0LCAtMzc4NTU4KTtcbiAgZCA9IGhoKGQsIGEsIGIsIGMsIGtbOF0sIDExLCAtMjAyMjU3NDQ2Myk7XG4gIGMgPSBoaChjLCBkLCBhLCBiLCBrWzExXSwgMTYsIDE4MzkwMzA1NjIpO1xuICBiID0gaGgoYiwgYywgZCwgYSwga1sxNF0sIDIzLCAtMzUzMDk1NTYpO1xuICBhID0gaGgoYSwgYiwgYywgZCwga1sxXSwgNCwgLTE1MzA5OTIwNjApO1xuICBkID0gaGgoZCwgYSwgYiwgYywga1s0XSwgMTEsIDEyNzI4OTMzNTMpO1xuICBjID0gaGgoYywgZCwgYSwgYiwga1s3XSwgMTYsIC0xNTU0OTc2MzIpO1xuICBiID0gaGgoYiwgYywgZCwgYSwga1sxMF0sIDIzLCAtMTA5NDczMDY0MCk7XG4gIGEgPSBoaChhLCBiLCBjLCBkLCBrWzEzXSwgNCwgNjgxMjc5MTc0KTtcbiAgZCA9IGhoKGQsIGEsIGIsIGMsIGtbMF0sIDExLCAtMzU4NTM3MjIyKTtcbiAgYyA9IGhoKGMsIGQsIGEsIGIsIGtbM10sIDE2LCAtNzIyNTIxOTc5KTtcbiAgYiA9IGhoKGIsIGMsIGQsIGEsIGtbNl0sIDIzLCA3NjAyOTE4OSk7XG4gIGEgPSBoaChhLCBiLCBjLCBkLCBrWzldLCA0LCAtNjQwMzY0NDg3KTtcbiAgZCA9IGhoKGQsIGEsIGIsIGMsIGtbMTJdLCAxMSwgLTQyMTgxNTgzNSk7XG4gIGMgPSBoaChjLCBkLCBhLCBiLCBrWzE1XSwgMTYsIDUzMDc0MjUyMCk7XG4gIGIgPSBoaChiLCBjLCBkLCBhLCBrWzJdLCAyMywgLTk5NTMzODY1MSk7XG4gIGEgPSBpaShhLCBiLCBjLCBkLCBrWzBdLCA2LCAtMTk4NjMwODQ0KTtcbiAgZCA9IGlpKGQsIGEsIGIsIGMsIGtbN10sIDEwLCAxMTI2ODkxNDE1KTtcbiAgYyA9IGlpKGMsIGQsIGEsIGIsIGtbMTRdLCAxNSwgLTE0MTYzNTQ5MDUpO1xuICBiID0gaWkoYiwgYywgZCwgYSwga1s1XSwgMjEsIC01NzQzNDA1NSk7XG4gIGEgPSBpaShhLCBiLCBjLCBkLCBrWzEyXSwgNiwgMTcwMDQ4NTU3MSk7XG4gIGQgPSBpaShkLCBhLCBiLCBjLCBrWzNdLCAxMCwgLTE4OTQ5ODY2MDYpO1xuICBjID0gaWkoYywgZCwgYSwgYiwga1sxMF0sIDE1LCAtMTA1MTUyMyk7XG4gIGIgPSBpaShiLCBjLCBkLCBhLCBrWzFdLCAyMSwgLTIwNTQ5MjI3OTkpO1xuICBhID0gaWkoYSwgYiwgYywgZCwga1s4XSwgNiwgMTg3MzMxMzM1OSk7XG4gIGQgPSBpaShkLCBhLCBiLCBjLCBrWzE1XSwgMTAsIC0zMDYxMTc0NCk7XG4gIGMgPSBpaShjLCBkLCBhLCBiLCBrWzZdLCAxNSwgLTE1NjAxOTgzODApO1xuICBiID0gaWkoYiwgYywgZCwgYSwga1sxM10sIDIxLCAxMzA5MTUxNjQ5KTtcbiAgYSA9IGlpKGEsIGIsIGMsIGQsIGtbNF0sIDYsIC0xNDU1MjMwNzApO1xuICBkID0gaWkoZCwgYSwgYiwgYywga1sxMV0sIDEwLCAtMTEyMDIxMDM3OSk7XG4gIGMgPSBpaShjLCBkLCBhLCBiLCBrWzJdLCAxNSwgNzE4Nzg3MjU5KTtcbiAgYiA9IGlpKGIsIGMsIGQsIGEsIGtbOV0sIDIxLCAtMzQzNDg1NTUxKTtcbiAgeFswXSA9IGFkZDMyKGEsIHhbMF0pO1xuICB4WzFdID0gYWRkMzIoYiwgeFsxXSk7XG4gIHhbMl0gPSBhZGQzMihjLCB4WzJdKTtcbiAgeFszXSA9IGFkZDMyKGQsIHhbM10pO1xufTtcblxuY21uID0gZnVuY3Rpb24ocSwgYSwgYiwgeCwgcywgdCkge1xuICBhID0gYWRkMzIoYWRkMzIoYSwgcSksIGFkZDMyKHgsIHQpKTtcbiAgcmV0dXJuIGFkZDMyKGEgPDwgcyB8IGEgPj4+IDMyIC0gcywgYik7XG59O1xuXG5mZiA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIGNtbihiICYgYyB8IH5iICYgZCwgYSwgYiwgeCwgcywgdCk7XG59O1xuXG5nZyA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIGNtbihiICYgZCB8IGMgJiB+ZCwgYSwgYiwgeCwgcywgdCk7XG59O1xuXG5oaCA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIHgsIHMsIHQpIHtcbiAgcmV0dXJuIGNtbihiIF4gYyBeIGQsIGEsIGIsIHgsIHMsIHQpO1xufTtcblxuaWkgPSBmdW5jdGlvbihhLCBiLCBjLCBkLCB4LCBzLCB0KSB7XG4gIHJldHVybiBjbW4oYyBeIChiIHwgfmQpLCBhLCBiLCB4LCBzLCB0KTtcbn07XG5cbm1kNTEgPSBmdW5jdGlvbihzKSB7XG4gIHZhciBpLCBuLCBzdGF0ZSwgdGFpbCwgdHh0O1xuICB0eHQgPSAnJztcbiAgbiA9IHMubGVuZ3RoO1xuICBzdGF0ZSA9IFsxNzMyNTg0MTkzLCAtMjcxNzMzODc5LCAtMTczMjU4NDE5NCwgMjcxNzMzODc4XTtcbiAgaSA9IHZvaWQgMDtcbiAgaSA9IDY0O1xuICB3aGlsZSAoaSA8PSBzLmxlbmd0aCkge1xuICAgIG1kNWN5Y2xlKHN0YXRlLCBtZDVibGsocy5zdWJzdHJpbmcoaSAtIDY0LCBpKSkpO1xuICAgIGkgKz0gNjQ7XG4gIH1cbiAgcyA9IHMuc3Vic3RyaW5nKGkgLSA2NCk7XG4gIHRhaWwgPSBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF07XG4gIGkgPSAwO1xuICB3aGlsZSAoaSA8IHMubGVuZ3RoKSB7XG4gICAgdGFpbFtpID4+IDJdIHw9IHMuY2hhckNvZGVBdChpKSA8PCBpICUgNCA8PCAzO1xuICAgIGkrKztcbiAgfVxuICB0YWlsW2kgPj4gMl0gfD0gMHg4MCA8PCBpICUgNCA8PCAzO1xuICBpZiAoaSA+IDU1KSB7XG4gICAgbWQ1Y3ljbGUoc3RhdGUsIHRhaWwpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgMTYpIHtcbiAgICAgIHRhaWxbaV0gPSAwO1xuICAgICAgaSsrO1xuICAgIH1cbiAgfVxuICB0YWlsWzE0XSA9IG4gKiA4O1xuICBtZDVjeWNsZShzdGF0ZSwgdGFpbCk7XG4gIHJldHVybiBzdGF0ZTtcbn07XG5cblxuLyogdGhlcmUgbmVlZHMgdG8gYmUgc3VwcG9ydCBmb3IgVW5pY29kZSBoZXJlLFxuICogdW5sZXNzIHdlIHByZXRlbmQgdGhhdCB3ZSBjYW4gcmVkZWZpbmUgdGhlIE1ELTVcbiAqIGFsZ29yaXRobSBmb3IgbXVsdGktYnl0ZSBjaGFyYWN0ZXJzIChwZXJoYXBzXG4gKiBieSBhZGRpbmcgZXZlcnkgZm91ciAxNi1iaXQgY2hhcmFjdGVycyBhbmRcbiAqIHNob3J0ZW5pbmcgdGhlIHN1bSB0byAzMiBiaXRzKS4gT3RoZXJ3aXNlXG4gKiBJIHN1Z2dlc3QgcGVyZm9ybWluZyBNRC01IGFzIGlmIGV2ZXJ5IGNoYXJhY3RlclxuICogd2FzIHR3byBieXRlcy0tZS5nLiwgMDA0MCAwMDI1ID0gQCUtLWJ1dCB0aGVuXG4gKiBob3cgd2lsbCBhbiBvcmRpbmFyeSBNRC01IHN1bSBiZSBtYXRjaGVkP1xuICogVGhlcmUgaXMgbm8gd2F5IHRvIHN0YW5kYXJkaXplIHRleHQgdG8gc29tZXRoaW5nXG4gKiBsaWtlIFVURi04IGJlZm9yZSB0cmFuc2Zvcm1hdGlvbjsgc3BlZWQgY29zdCBpc1xuICogdXR0ZXJseSBwcm9oaWJpdGl2ZS4gVGhlIEphdmFTY3JpcHQgc3RhbmRhcmRcbiAqIGl0c2VsZiBuZWVkcyB0byBsb29rIGF0IHRoaXM6IGl0IHNob3VsZCBzdGFydFxuICogcHJvdmlkaW5nIGFjY2VzcyB0byBzdHJpbmdzIGFzIHByZWZvcm1lZCBVVEYtOFxuICogOC1iaXQgdW5zaWduZWQgdmFsdWUgYXJyYXlzLlxuICovXG5cbm1kNWJsayA9IGZ1bmN0aW9uKHMpIHtcblxuICAvKiBJIGZpZ3VyZWQgZ2xvYmFsIHdhcyBmYXN0ZXIuICovXG4gIHZhciBpLCBtZDVibGtzO1xuICBtZDVibGtzID0gW107XG4gIGkgPSB2b2lkIDA7XG5cbiAgLyogQW5keSBLaW5nIHNhaWQgZG8gaXQgdGhpcyB3YXkuICovXG4gIGkgPSAwO1xuICB3aGlsZSAoaSA8IDY0KSB7XG4gICAgbWQ1Ymxrc1tpID4+IDJdID0gcy5jaGFyQ29kZUF0KGkpICsgKHMuY2hhckNvZGVBdChpICsgMSkgPDwgOCkgKyAocy5jaGFyQ29kZUF0KGkgKyAyKSA8PCAxNikgKyAocy5jaGFyQ29kZUF0KGkgKyAzKSA8PCAyNCk7XG4gICAgaSArPSA0O1xuICB9XG4gIHJldHVybiBtZDVibGtzO1xufTtcblxucmhleCA9IGZ1bmN0aW9uKG4pIHtcbiAgdmFyIGosIHM7XG4gIHMgPSAnJztcbiAgaiA9IDA7XG4gIHdoaWxlIChqIDwgNCkge1xuICAgIHMgKz0gaGV4X2NocltuID4+IGogKiA4ICsgNCAmIDB4MEZdICsgaGV4X2NocltuID4+IGogKiA4ICYgMHgwRl07XG4gICAgaisrO1xuICB9XG4gIHJldHVybiBzO1xufTtcblxuaGV4ID0gZnVuY3Rpb24oeCkge1xuICB2YXIgaTtcbiAgaSA9IDA7XG4gIHdoaWxlIChpIDwgeC5sZW5ndGgpIHtcbiAgICB4W2ldID0gcmhleCh4W2ldKTtcbiAgICBpKys7XG4gIH1cbiAgcmV0dXJuIHguam9pbignJyk7XG59O1xuXG5cbi8qIHRoaXMgZnVuY3Rpb24gaXMgbXVjaCBmYXN0ZXIsXG5zbyBpZiBwb3NzaWJsZSB3ZSB1c2UgaXQuIFNvbWUgSUVzXG5hcmUgdGhlIG9ubHkgb25lcyBJIGtub3cgb2YgdGhhdFxubmVlZCB0aGUgaWRpb3RpYyBzZWNvbmQgZnVuY3Rpb24sXG5nZW5lcmF0ZWQgYnkgYW4gaWYgY2xhdXNlLlxuICovXG5cbmFkZDMyID0gZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSArIGIgJiAweEZGRkZGRkZGO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzKSB7XG4gIHJldHVybiBoZXgobWQ1MShzKSk7XG59O1xuIiwiXG4vKlxuKipNYWluVmlldyoqXG4tLS0tLS0tLS0tLS1cblxuVE9ETzogUmV3cml0ZSB0aGlzXG5cblRoaXMgaXMgdGhlIGJhc2UgdmlldyBmb3IgYWxsIHBhZ2VzIGluIHRoZSBBcHAuIEFsbCBwYWdlcyBtdXN0IGluaGVyaXRcbnRoZSBwcm9wZXJ0aWVzIGluIHRoZSB2aWV3LlxuXG5UaGUgZGlmZmVyZW50IGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyBkZWZpbmVkXG5oZXJlIGdldCB1c2VkIGJ5IHRoZSBWaWV3TWFuYWdlciBjb250cm9sbGVyIGFuZCBlbmFibGVzIHRoZSBjb250cm9sbGVyIHRvXG5uZWF0bHkgY2xlYW51cCBhbmQgcmVzdGFydCB2aWV3cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGlkQXR0cmlidXRlOiBcIl9pZFwiLFxuXG4gIC8qXG4gICMjICppbml0aWFsaXplKCk6KlxuICBUaGlzIGZ1bmN0aW9uIGdldHMgY2FsbGVkIGJ5IEJhY2tib25lIHdoZW5ldmVyIHdlIGluc3RhbnRpYXRlIGFuIE9iamVjdCBmcm9tXG4gIHRoaXMgdmlldy4gSGVyZSB3ZSBzZXR1cCBzb21lIGNvbW1vbiByZXNvdXJjZXMgZm9yIGFsbCBvdXIgY2hpbGRcbiAgbW9kZWxzIHRvIHBsYXkgd2l0aC5cbiAgICovXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHRoaXMucmVzb3VyY2VzID0gQXBwLlJlc291cmNlcztcbiAgICByZXR1cm4gdGhpcy5zdGFydCgpO1xuICB9LFxuICBzdGFydDogZnVuY3Rpb24oKSB7fSxcblxuICAvKlxuICAjIyAqbmFtZToqXG4gIEhlcmUgZ29lcyB0aGUgbmFtZSBvZiB0aGUgdmlldy4gVGhpcyBpcyB1c2VkIGluIGNvbnNvbGUgc3RhdGVtZW50c1xuICB0byBoZWxwIGRlYnVnIHRoZSBhcHAuIFNvIGluIHlvdXIgdmlldyB5b3Ugd291bGQgdXNlIHNvbWV0aGluZyBsaWtlXG4gIFxuICAgICAgY29uc29sZS5sb2cgQG5hbWUsIFwiTWVzc2FnZVwiXG4gIFxuICBhbmQgdGhpcyBtYWtlcyBpdCBlYXN5IHRvIGZpbHRlciBvdXQgY29uc29sZSBtZXNzYWdlcyBnZW5lcmF0ZWQgYnkgdGhhdFxuICB2aWV3LiAoU2luY2UgdGhlIGFwcCBnZW5lcmF0ZXMgYWxvdCBvZiBjb25zb2xlIG1lc3NhZ2VzKVxuICAgKi9cbiAgbmFtZTogXCJcIlxufTtcbiIsInZhciBhamF4LCBtb2RlbDtcblxuYWpheCA9IChyZXF1aXJlKCdhcHAtaGVscGVycycpKS5hamF4O1xuXG5tb2RlbCA9IEJhY2tib25lLk1vZGVsLmV4dGVuZCh7XG4gIGlkQXR0cmlidXRlOiBcIl9pZFwiLFxuICBkZWZhdWx0czoge1xuICAgIF9pZDogbnVsbCxcbiAgICBjb3VudDogMCxcbiAgICBuYW1lOiAnJ1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIG1vZGVsOiBtb2RlbCxcbiAgbmFtZTogJ1ttb2RlbDpjYXRlZ29yaWVzXScsXG4gIHVybDogXCIvYXBpL2NhdGVnb3J5XCIsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2luaXRpYWxpemluZycpO1xuICAgIHRoaXMub2xkRmV0Y2ggPSB0aGlzLmZldGNoO1xuICAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBpZiAoIXRoaXMuY2FjaGVkRmV0Y2gob3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2xkRmV0Y2gob3B0aW9ucyk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5vbignc3luYycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBfdGhpcy5zZXRDYWNoZSgpO1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0Q291bnRlcnMoZnVuY3Rpb24oZXJyb3IsIHJlc3VsdHMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCAnc3luY2VkJyk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnRyaWdnZXIoJ3N5bmNlZCcpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9LFxuICBzZXRDYWNoZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdjYWNoaW5nIGNhdGVnb3J5IGRldGFpbHMnKTtcbiAgICBpZiAoIXRoaXMucmVzb3VyY2VzLmNhY2hlLmdldCgnbW9kZWxzOmNhdGVnb3J5JykpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5jYWNoZS5zZXQoJ21vZGVsczpjYXRlZ29yeScsIEpTT04uc3RyaW5naWZ5KHRoaXMudG9KU09OKCkpKTtcbiAgICB9XG4gIH0sXG4gIGZpbmRCeVNsdWc6IGZ1bmN0aW9uKHNsdWcpIHtcbiAgICB2YXIgY2F0LCBjYXRlZ29yaWVzLCBjaGlsZGNhdCwgaSwgaiwgbGVuLCBsZW4xLCByZWY7XG4gICAgY2F0ZWdvcmllcyA9IHRoaXMudG9KU09OKCk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2F0ZWdvcmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2F0ID0gY2F0ZWdvcmllc1tpXTtcbiAgICAgIGlmIChjYXQuc2x1ZyA9PT0gc2x1Zykge1xuICAgICAgICByZXR1cm4gY2F0O1xuICAgICAgfVxuICAgICAgcmVmID0gY2F0LmNoaWxkcmVuO1xuICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZi5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgY2hpbGRjYXQgPSByZWZbal07XG4gICAgICAgIGlmIChjaGlsZGNhdC5zbHVnID09PSBzbHVnKSB7XG4gICAgICAgICAgcmV0dXJuIGNoaWxkY2F0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgZmluZEJ5SWQ6IGZ1bmN0aW9uKGlkKSB7XG4gICAgdmFyIGNhdCwgY2F0ZWdvcmllcywgY2hpbGRjYXQsIGksIGosIGxlbiwgbGVuMSwgcmVmO1xuICAgIGNhdGVnb3JpZXMgPSB0aGlzLnRvSlNPTigpO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNhdGVnb3JpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNhdCA9IGNhdGVnb3JpZXNbaV07XG4gICAgICBpZiAoY2F0Ll9pZCA9PT0gaWQpIHtcbiAgICAgICAgcmV0dXJuIGNhdDtcbiAgICAgIH1cbiAgICAgIHJlZiA9IGNhdC5jaGlsZHJlbjtcbiAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgIGNoaWxkY2F0ID0gcmVmW2pdO1xuICAgICAgICBpZiAoY2hpbGRjYXQuX2lkID09PSBpZCkge1xuICAgICAgICAgIHJldHVybiBjaGlsZGNhdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGdldENoaWxkcmVuOiBmdW5jdGlvbihwYXJlbnRJZCkge1xuICAgIHZhciBwYXJlbnQ7XG4gICAgcGFyZW50ID0gdGhpcy5maW5kKHtcbiAgICAgIGlkOiBwYXJlbnRJZFxuICAgIH0pO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHJldHVybiBwYXJlbnQuZ2V0KCdjaGlsZHJlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICB9LFxuICBjYWNoZWRGZXRjaDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjYWNoZSwganNvbjtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGNhY2hlID0gdGhpcy5yZXNvdXJjZXMuY2FjaGUuZ2V0KCdtb2RlbHM6Y2F0ZWdvcnknKTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3NldHRpbmcgY2F0ZWdvcmllcyBmcm9tIGNhY2hlJyk7XG4gICAgICBqc29uID0gSlNPTi5wYXJzZShjYWNoZSk7XG4gICAgICB0aGlzLnNldChqc29uKTtcbiAgICAgIHRoaXMudHJpZ2dlcignc3luYycpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2ZldGNoaW5nIGZyb20gQVBJJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBnZXRDb3VudGVyczogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgdXJsOiAnL2FwaS9jYXRlZ29yeT9jb3VudD10cnVlJyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBiZWZvcmVTZW5kOiBhamF4LnNldEhlYWRlcnMsXG4gICAgICBzdWNjZXNzOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coX3RoaXMubmFtZSwgJ2ZldGNoaW5nIGNhdGVnb3J5IGNvdW50ZXJzJyk7XG4gICAgICAgICAgX3RoaXMuc2V0Q291bnRlcnMocmVzcG9uc2UpO1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSxcbiAgICAgIGVycm9yOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihfdGhpcy5uYW1lLCAnZXJyb3IgZmV0Y2hpbmcgY2F0ZWdvcnkgY291bnRlcnMnLCByZXNwb25zZSk7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpXG4gICAgfSk7XG4gIH0sXG4gIHNldENvdW50ZXJzOiBmdW5jdGlvbihjb3VudGVycykge1xuICAgIHZhciBjYXRlZ29yaWVzLCBjYXRlZ29yeSwgY2F0ZWdvcnlDb3VudCwgY2hpbGRDYXRlZ29yeSwgaSwgaiwgaywgbCwgbGVuLCBsZW4xLCBsZW4yLCBsZW4zLCByZWYsIHJlZjEsIHJlZjI7XG4gICAgY2F0ZWdvcmllcyA9IHRoaXMudG9KU09OKCk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2F0ZWdvcmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2F0ZWdvcnkgPSBjYXRlZ29yaWVzW2ldO1xuICAgICAgcmVmID0gY291bnRlcnMuY2F0ZWdvcnk7XG4gICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICBjYXRlZ29yeUNvdW50ID0gcmVmW2pdO1xuICAgICAgICBpZiAoY2F0ZWdvcnlDb3VudC5faWQgPT09IGNhdGVnb3J5Ll9pZCkge1xuICAgICAgICAgIGNhdGVnb3J5LmNvdW50ID0gY2F0ZWdvcnlDb3VudC50b3RhbDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYXRlZ29yeS5jb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlZjEgPSBjYXRlZ29yeS5jaGlsZHJlbjtcbiAgICAgIGZvciAoayA9IDAsIGxlbjIgPSByZWYxLmxlbmd0aDsgayA8IGxlbjI7IGsrKykge1xuICAgICAgICBjaGlsZENhdGVnb3J5ID0gcmVmMVtrXTtcbiAgICAgICAgcmVmMiA9IGNvdW50ZXJzLmNoaWxkQ2F0ZWdvcnk7XG4gICAgICAgIGZvciAobCA9IDAsIGxlbjMgPSByZWYyLmxlbmd0aDsgbCA8IGxlbjM7IGwrKykge1xuICAgICAgICAgIGNhdGVnb3J5Q291bnQgPSByZWYyW2xdO1xuICAgICAgICAgIGlmIChjYXRlZ29yeUNvdW50Ll9pZCA9PT0gY2hpbGRDYXRlZ29yeS5faWQpIHtcbiAgICAgICAgICAgIGNoaWxkQ2F0ZWdvcnkuY291bnQgPSBjYXRlZ29yeUNvdW50LnRvdGFsO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoaWxkQ2F0ZWdvcnkuY291bnQgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZXNldChjYXRlZ29yaWVzKTtcbiAgfVxufSk7XG4iLCJ2YXIgYWpheCwgZGF0ZUhlbHBlciwgaGVscGVycztcblxuaGVscGVycyA9IHJlcXVpcmUoJ2FwcC1oZWxwZXJzJyk7XG5cbmRhdGVIZWxwZXIgPSBoZWxwZXJzLmRhdGU7XG5cbmFqYXggPSBoZWxwZXJzLmFqYXg7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgaWRBdHRyaWJ1dGU6IFwiX2lkXCIsXG4gIG5hbWU6IFwiW21vZGVsOmNsYXNzaWZpZWRdXCIsXG4gIHVybDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGF1dGhIYXNoLCBpZDtcbiAgICBpZCA9IHRoaXMuaWQ7XG4gICAgYXV0aEhhc2ggPSB0aGlzLmdldCgnYXV0aEhhc2gnKTtcbiAgICBpZiAoaWQpIHtcbiAgICAgIHJldHVybiBcIi9hcGkvY2xhc3NpZmllZC9cIiArIGlkICsgXCI/YXV0aEhhc2g9XCIgKyBhdXRoSGFzaDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcvYXBpL2NsYXNzaWZpZWQnO1xuICAgIH1cbiAgfSxcbiAgZGVmYXVsdHM6IHtcbiAgICBfaWQ6IG51bGwsXG4gICAgbW9kZXJhdG9yUmVhc29uOiBudWxsLFxuICAgIGF1dGhIYXNoOiBudWxsLFxuICAgIGNhdGVnb3J5OiBudWxsLFxuICAgIGNoaWxkQ2F0ZWdvcnk6IG51bGwsXG4gICAgYmFieUNhdGVnb3J5OiBudWxsLFxuICAgIGNyZWF0ZWQ6IG51bGwsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIGd1ZXN0OiB0cnVlLFxuICAgIGltYWdlczogW10sXG4gICAgb3duZXI6IG51bGwsXG4gICAgcHJpY2U6IG51bGwsXG4gICAgcmVwb3J0czogW10sXG4gICAgbG9jYXRpb246IG51bGwsXG4gICAgc3RhdHVzOiBudWxsLFxuICAgIHRpdGxlOiAnJyxcbiAgICB0eXBlOiBudWxsLFxuICAgIHZpZXdzOiAwLFxuICAgIHBlcmtzOiB7fSxcbiAgICBjb250YWN0OiB7fSxcbiAgICBtZXRhOiB7fVxuICB9LFxuICBzdGF0dXM6IHtcbiAgICBJTkFDVElWRTogMCxcbiAgICBBQ1RJVkU6IDEsXG4gICAgUkVKRUNURUQ6IDIsXG4gICAgQVJDSElWRUQ6IDMsXG4gICAgQkFOTkVEOiA0LFxuICAgIEZMQUdHRUQ6IDUsXG4gICAgVkVSSUZJRUQ6IDYsXG4gICAgRVhQSVJFRDogN1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5iaW5kKCdwYXJzZScsIHRoaXMucGFyc2VWYXJpYWJsZXMsIHRoaXMpO1xuICB9LFxuICBwYXJzZVZhcmlhYmxlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhdGVnb3J5LCBjaGlsZCwgY2hpbGRDYXRlZ29yeSwgZGF0ZSwgaSwgbGVuLCBsb2NhdGlvbiwgcHJpY2UsIHJlZiwgdHlwZTtcbiAgICBpZiAodGhpcy5hdHRyaWJ1dGVzLnBhcnNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmF0dHJpYnV0ZXMucGFyc2VkID0gdHJ1ZTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMudGl0bGUgPSB0aGlzLmVzY2FwZSgndGl0bGUnKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMuZGVzY3JpcHRpb24gPSB0aGlzLmVzY2FwZSgnZGVzY3JpcHRpb24nKTtcbiAgICB0eXBlID0gdGhpcy5nZXQoJ3R5cGUnKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMudHlwZSA9IHR5cGUgPT09IDAgPyAnT2ZmZXJpbmcnIDogJ1dhbnRlZCc7XG4gICAgcHJpY2UgPSB0aGlzLmdldCgncHJpY2UnKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMucHJpY2UgPSB0aGlzLnByaWNlRm9ybWF0KHByaWNlKTtcbiAgICBsb2NhdGlvbiA9IHRoaXMuZ2V0KCdsb2NhdGlvbicpO1xuICAgIGxvY2F0aW9uID0gQXBwLlJlc291cmNlcy5sb2NhdGlvbnMuZmluZFdoZXJlKHtcbiAgICAgIF9pZDogbG9jYXRpb25cbiAgICB9KTtcbiAgICBpZiAobG9jYXRpb24pIHtcbiAgICAgIHRoaXMuYXR0cmlidXRlcy5sb2NhdGlvbiA9IGxvY2F0aW9uLmdldCgnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmF0dHJpYnV0ZXMubG9jYXRpb24gPSBudWxsO1xuICAgIH1cbiAgICBjYXRlZ29yeSA9IHRoaXMuZ2V0KCdjYXRlZ29yeScpO1xuICAgIGNhdGVnb3J5ID0gQXBwLlJlc291cmNlcy5jYXRlZ29yaWVzLmZpbmRXaGVyZSh7XG4gICAgICBfaWQ6IGNhdGVnb3J5XG4gICAgfSk7XG4gICAgaWYgKGNhdGVnb3J5KSB7XG4gICAgICB0aGlzLmF0dHJpYnV0ZXMuY2F0ZWdvcnkgPSBjYXRlZ29yeS5nZXQoJ25hbWUnKTtcbiAgICAgIGNoaWxkQ2F0ZWdvcnkgPSB0aGlzLmdldCgnY2hpbGRDYXRlZ29yeScpO1xuICAgICAgcmVmID0gY2F0ZWdvcnkuZ2V0KCdjaGlsZHJlbicpO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNoaWxkID0gcmVmW2ldO1xuICAgICAgICBpZiAoY2hpbGRDYXRlZ29yeSA9PT0gY2hpbGQuX2lkKSB7XG4gICAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLmNoaWxkQ2F0ZWdvcnkgPSBjaGlsZC5uYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXR0cmlidXRlcy5jYXRlZ29yeSA9IG51bGw7XG4gICAgICB0aGlzLmF0dHJpYnV0ZXMuY2hpbGRDYXRlZ29yeSA9IG51bGw7XG4gICAgfVxuICAgIGRhdGUgPSB0aGlzLmdldCgnY3JlYXRlZCcpO1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXMuY3JlYXRlZCA9IGRhdGVIZWxwZXIucHJldHRpZnkoZGF0ZSk7XG4gIH0sXG4gIHVwbG9hZFNlcnZlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgYXV0aEhhc2gsIGlkLCBqc29uLCBwcm9ncmVzc0hhbmRsZXIsIHR5cGUsIHVybDtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgJ3VwbG9hZGluZyBjbGFzc2lmaWVkIGRldGFpbHMgdG8gc2VydmVyJywgdGhpcyk7XG4gICAganNvbiA9IHRoaXMudG9KU09OKCk7XG4gICAganNvbi5maWxlcyA9IG51bGw7XG4gICAgcHJvZ3Jlc3NIYW5kbGVyID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50Lmxlbmd0aENvbXB1dGFibGUpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMudHJpZ2dlcignYWpheDpwcm9ncnNzJywgZXZlbnQubG9hZGVkIC8gZXZlbnQudG90YWwgKiAxMDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICAgIGF1dGhIYXNoID0gdGhpcy5nZXQoJ2F1dGhIYXNoJyk7XG4gICAgaWQgPSB0aGlzLmdldCgnX2lkJyk7XG4gICAgaWYgKGlkKSB7XG4gICAgICB0eXBlID0gJ1BVVCc7XG4gICAgICB1cmwgPSBBcHAuUmVzb3VyY2VzLkNvbmZpZy5ob3N0bmFtZSArIFwiL2FwaS9jbGFzc2lmaWVkL1wiICsgaWQgKyBcIj9hdXRoSGFzaD1cIiArIGF1dGhIYXNoO1xuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlID0gJ1BPU1QnO1xuICAgICAgdXJsID0gQXBwLlJlc291cmNlcy5Db25maWcuaG9zdG5hbWUgKyBcIi9hcGkvY2xhc3NpZmllZD9hdXRoSGFzaD1cIiArIGF1dGhIYXNoO1xuICAgIH1cbiAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgIGJlZm9yZVNlbmQ6IGFqYXguc2V0SGVhZGVycyxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIGRhdGE6IHRoaXMuZ2V0Rm9ybURhdGEoKSxcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIHhocjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBYaHI7XG4gICAgICAgIFhociA9ICQuYWpheFNldHRpbmdzLnhocigpO1xuICAgICAgICBpZiAoWGhyLnVwbG9hZCkge1xuICAgICAgICAgIFhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBwcm9ncmVzc0hhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gWGhyO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAoIXJlc3BvbnNlLl9pZCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihfdGhpcy5uYW1lLCAnZXJyb3IgdXBsb2FkaW5nIGNsYXNzaWZpZWQnLCByZXNwb25zZSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMudHJpZ2dlcignYWpheDplcnJvcicsIHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3RoaXMuc2V0KHJlc3BvbnNlKTtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyksXG4gICAgICBlcnJvcjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoX3RoaXMubmFtZSwgJ2Vycm9yIHVwbG9hZGluZyBjbGFzc2lmaWVkIGRldGFpbHMnLCByZXNwb25zZSk7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpXG4gICAgfSk7XG4gIH0sXG4gIGdldEZvcm1EYXRhOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0YSwgZmlsZSwgZmlsZXMsIGZvcm1kYXRhLCBpLCBsZW47XG4gICAgZm9ybWRhdGEgPSBuZXcgRm9ybURhdGE7XG4gICAgZGF0YSA9IHRoaXMudG9KU09OKCk7XG4gICAgZmlsZXMgPSBkYXRhLmZpbGVzIHx8IFtdO1xuICAgIGRlbGV0ZSBkYXRhLmZpbGVzO1xuICAgIGZvcm1kYXRhLmFwcGVuZCgnZGF0YScsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBmaWxlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZmlsZSA9IGZpbGVzW2ldO1xuICAgICAgZm9ybWRhdGEuYXBwZW5kKCdmaWxlc1tdJywgZmlsZSk7XG4gICAgfVxuICAgIHJldHVybiBmb3JtZGF0YTtcbiAgfSxcbiAgcHJpY2VGb3JtYXQ6IGZ1bmN0aW9uKHByaWNlKSB7XG4gICAgdmFyIGxhbmcsIHByZXR0eVByaWNlLCB0cmFuc2xhdGVkUHJpY2U7XG4gICAgbGFuZyA9IEFwcC5SZXNvdXJjZXMubGFuZ3VhZ2U7XG4gICAgaWYgKHByaWNlID09PSAwKSB7XG4gICAgICByZXR1cm4gbGFuZy5nZXQoXCJtb2RlbC5wcmljZS5mcmVlXCIpO1xuICAgIH0gZWxzZSBpZiAocHJpY2UgPT09IC0xKSB7XG4gICAgICByZXR1cm4gbGFuZy5nZXQoXCJtb2RlbC5wcmljZS5jb250YWN0XCIpO1xuICAgIH0gZWxzZSBpZiAocHJpY2UgIT0gbnVsbCkge1xuICAgICAgcHJldHR5UHJpY2UgPSBwcmljZS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG4gICAgICB0cmFuc2xhdGVkUHJpY2UgPSBsYW5nLmxvY2FsaXplTnVtYmVyKHByZXR0eVByaWNlKTtcbiAgICAgIHJldHVybiB0cmFuc2xhdGVkUHJpY2UgKyBcIiBcIiArIChsYW5nLmdldCgnbW9kZWwucHJpY2UudW5pdCcpKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwidmFyIGFqYXg7XG5cbmFqYXggPSAocmVxdWlyZSgnYXBwLWhlbHBlcnMnKSkuYWpheDtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gIG5hbWU6ICdbbW9kZWw6Y2xhc3NpZmllZHNdJyxcbiAgbW9kZWw6IHJlcXVpcmUoJy4vQ2xhc3NpZmllZCcpLFxuICBpc0FjY291bnQ6IGZhbHNlLFxuICBmZXRjaDogZnVuY3Rpb24ocGFyYW1ldGVycykge1xuICAgIHZhciBiYXNlVXJsLCB1cmw7XG4gICAgaWYgKHBhcmFtZXRlcnMgPT0gbnVsbCkge1xuICAgICAgcGFyYW1ldGVycyA9IHt9O1xuICAgIH1cbiAgICBpZiAoIXRoaXMuaXNBY2NvdW50KSB7XG4gICAgICBiYXNlVXJsID0gJy9hcGkvcXVlcnk/JztcbiAgICB9IGVsc2Uge1xuICAgICAgYmFzZVVybCA9ICcvYXBpL2FjY291bnQvbWFuYWdlPyc7XG4gICAgfVxuICAgIHVybCA9IEFwcC5SZXNvdXJjZXMuQ29uZmlnLmhvc3RuYW1lICsgYmFzZVVybCArICQucGFyYW0ocGFyYW1ldGVycyk7XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICBiZWZvcmVTZW5kOiBhamF4LnNldEhlYWRlcnMsXG4gICAgICBzdWNjZXNzOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgdmFyIGNsYXNzaWZpZWQsIGksIGxlbiwgbW9kZWwsIG5ld01vZGVscztcbiAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCAnZmV0Y2hpbmcgY2xhc3NpZmllZHMnKTtcbiAgICAgICAgICBjb25zb2xlLmRlYnVnKF90aGlzLm5hbWUsIHJlc3BvbnNlKTtcbiAgICAgICAgICBuZXdNb2RlbHMgPSBbXTtcbiAgICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZXNwb25zZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgY2xhc3NpZmllZCA9IHJlc3BvbnNlW2ldO1xuICAgICAgICAgICAgbW9kZWwgPSBuZXcgX3RoaXMubW9kZWwoY2xhc3NpZmllZCk7XG4gICAgICAgICAgICBtb2RlbC50cmlnZ2VyKCdwYXJzZScpO1xuICAgICAgICAgICAgbmV3TW9kZWxzLnB1c2gobW9kZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfdGhpcy5hZGQobmV3TW9kZWxzKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMudHJpZ2dlcignYWpheDpkb25lJywgbmV3TW9kZWxzKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpLFxuICAgICAgZXJyb3I6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihfdGhpcy5uYW1lLCAnZXJyb3IgZmV0Y2hpbmcgY2xhc3NpZmllZHMnLCByZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKVxuICAgIH0pO1xuICB9XG59KTtcbiIsInZhciBtb2RlbDtcblxubW9kZWwgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICBpZEF0dHJpYnV0ZTogXCJfaWRcIixcbiAgZGVmYXVsdHM6IHtcbiAgICBfaWQ6IG51bGwsXG4gICAgbmFtZTogJydcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICBtb2RlbDogbW9kZWwsXG4gIG5hbWU6ICdbbW9kZWw6bG9jYXRpb25zXScsXG4gIHVybDogXCIvYXBpL2xvY2F0aW9uXCIsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2luaXRpYWxpemluZycpO1xuICAgIHRoaXMub2xkRmV0Y2ggPSB0aGlzLmZldGNoO1xuICAgIHRoaXMuZmV0Y2ggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICBpZiAoIXRoaXMuY2FjaGVkRmV0Y2gob3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2xkRmV0Y2gob3B0aW9ucyk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5vbignc3luYycsIGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zZXRDYWNoZSgpO1xuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnc3luY2VkJyk7XG4gICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKCdzeW5jZWQnKTtcbiAgICB9KTtcbiAgfSxcbiAgc2V0Q2FjaGU6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2NhY2hpbmcgbG9jYXRpb24gZGV0YWlscycpO1xuICAgIGlmICghdGhpcy5yZXNvdXJjZXMuY2FjaGUuZ2V0KCdtb2RlbHM6bG9jYXRpb25zJykpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5jYWNoZS5zZXQoJ21vZGVsczpsb2NhdGlvbnMnLCBKU09OLnN0cmluZ2lmeSh0aGlzLnRvSlNPTigpKSk7XG4gICAgfVxuICB9LFxuICBjYWNoZWRGZXRjaDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjYWNoZSwganNvbjtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGNhY2hlID0gdGhpcy5yZXNvdXJjZXMuY2FjaGUuZ2V0KCdtb2RlbHM6bG9jYXRpb25zJyk7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdzZXR0aW5nIGxvY2F0aW9ucyBmcm9tIGNhY2hlJyk7XG4gICAgICBqc29uID0gSlNPTi5wYXJzZShjYWNoZSk7XG4gICAgICB0aGlzLnNldChqc29uKTtcbiAgICAgIHRoaXMudHJpZ2dlcignc3luYycpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2ZldGNoaW5nIGZyb20gQVBJJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KTtcbiIsInZhciBhamF4LCBoZWxwZXJzO1xuXG5oZWxwZXJzID0gcmVxdWlyZSgnYXBwLWhlbHBlcnMnKTtcblxuYWpheCA9IGhlbHBlcnMuYWpheDtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICBuYW1lOiBcIlttb2RlbDp1c2VyXVwiLFxuICB1cmw6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpZDtcbiAgICBpZCA9IHRoaXMuZ2V0KCdpZCcpO1xuICAgIGlmIChpZCkge1xuICAgICAgcmV0dXJuIFwiL2FwaS91c2VyL1wiICsgaWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIi9hcGkvdXNlclwiO1xuICAgIH1cbiAgfSxcbiAgZGVmYXVsdHM6IHtcbiAgICBhZG1pblJlYXNvbjogJycsXG4gICAgY3JlZGl0czogMCxcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgZW1haWw6ICcnLFxuICAgIGlzTW9kZXJhdG9yOiBmYWxzZSxcbiAgICBsYW5ndWFnZTogMCxcbiAgICBsYXN0TG9naW46IFtdLFxuICAgIGxvZ2luU3RyYXRlZ3k6IDAsXG4gICAgbmFtZTogJycsXG4gICAgcGVyc29uYWw6IHt9LFxuICAgIHN0YXR1czogMCxcbiAgICB1c2VybmFtZTogJydcbiAgfSxcbiAgbG9naW5TdHJhdGVnaWVzOiB7XG4gICAgRU1BSUw6IDAsXG4gICAgRkFDRUJPT0s6IDEsXG4gICAgVFdJVFRFUjogMixcbiAgICBZQUhPTzogMyxcbiAgICBHT09HTEVQTFVTOiA0LFxuICAgIFBIT05FR0FQOiA1XG4gIH0sXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2luaXRpYWxpemluZycpO1xuICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG4gICAgcmV0dXJuIHRoaXMub24oJ3N5bmMnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coX3RoaXMubmFtZSwgJ3N5bmNpbmcnKTtcbiAgICAgICAgaWYgKCFfdGhpcy5pc0Fub255bW91cygpKSB7XG4gICAgICAgICAgX3RoaXMuJGJvZHkuYWRkQ2xhc3MoJ2xvZ2dlZGluJyk7XG4gICAgICAgICAgX3RoaXMuJGJvZHkucmVtb3ZlQ2xhc3MoJ2xvZ2dlZG91dCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzLiRib2R5LnJlbW92ZUNsYXNzKCdsb2dnZWRpbicpO1xuICAgICAgICAgIF90aGlzLiRib2R5LmFkZENsYXNzKCdsb2dnZWRvdXQnKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCAnc3luY2VkJyk7XG4gICAgICAgIHJldHVybiBfdGhpcy50cmlnZ2VyKCdzeW5jZWQnKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9LFxuICBsb2dpbjogZnVuY3Rpb24odXNlcm5hbWUsIHBhc3N3b3JkLCBjYWxsYmFjaykge1xuICAgIGNvbnNvbGUuZGVidWcodGhpcy5uYW1lLCAnbG9nZ2luZyBpbiB1c2VyJyk7XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6IFwiL2FwaS9hdXRoL2VtYWlsL1wiICsgdXNlcm5hbWUsXG4gICAgICBiZWZvcmVTZW5kOiBhamF4LnNldEhlYWRlcnMsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICB9LFxuICAgICAgc3VjY2VzczogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoX3RoaXMubmFtZSwgJ3VzZXIgbG9nZ2VkIGluJywgcmVzcG9uc2UpO1xuICAgICAgICAgIF90aGlzLnNldChyZXNwb25zZSk7XG4gICAgICAgICAgX3RoaXMudHJpZ2dlcignc3luYycsIHJlc3BvbnNlKTtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyksXG4gICAgICBlcnJvcjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoX3RoaXMubmFtZSwgJ2Vycm9yIGxvZ2dpbmcgaW4nLCBlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpXG4gICAgfSk7XG4gIH0sXG4gIHNpZ251cDogZnVuY3Rpb24ocGFyYW1ldGVycywgY2FsbGJhY2spIHtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgJ3NpZ25pbmcgdXAgbmV3IHVzZXInKTtcbiAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogXCIvYXBpL2F1dGgvZW1haWwvXCIsXG4gICAgICBiZWZvcmVTZW5kOiBhamF4LnNldEhlYWRlcnMsXG4gICAgICBkYXRhOiBwYXJhbWV0ZXJzLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoX3RoaXMubmFtZSwgJ2Vycm9yIGNyZWF0aW5nIHVzZXInLCBlcnJvcik7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpXG4gICAgfSk7XG4gIH0sXG4gIGxvZ291dDogZnVuY3Rpb24oKSB7XG4gICAgJC5nZXQoXCIvYXBpL2F1dGgvbG9nb3V0L1wiKTtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgcmV0dXJuIHRoaXMudHJpZ2dlcignc3luYycpO1xuICB9LFxuICBpc0Fub255bW91czogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICF0aGlzLmhhcyhcIl9pZFwiKTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgQmFja2JvbmVNb2RlbDogcmVxdWlyZSgnLi9CYWNrYm9uZS5Nb2RlbCcpLFxuICBjYXRlZ29yaWVzOiByZXF1aXJlKCcuL0NhdGVnb3JpZXMnKSxcbiAgY2xhc3NpZmllZDogcmVxdWlyZSgnLi9DbGFzc2lmaWVkJyksXG4gIGNsYXNzaWZpZWRzOiByZXF1aXJlKCcuL0NsYXNzaWZpZWRzJyksXG4gIGxvY2F0aW9uczogcmVxdWlyZSgnLi9Mb2NhdGlvbnMnKSxcbiAgdXNlcjogcmVxdWlyZShcIi4vVXNlclwiKVxufTtcbiIsIlxuLypcbiMjICpDYWNoZSogbW9kdWxlXG5UaGlzIG1vZHVsZSBpcyByZXNwb25zaWJsZSBmb3Igb25seSBpbnRlcmFjdGluZyB3aXRoIHRoZSBIVE1MNSBsb2NhbFN0b3JhZ2UgYW5kXG5wcm92aWRpbmcgc2FmZSBmdW5jdGlvbnMgdG8gaW50ZXJhY3Qgd2l0aCBpdC4gVGhpcyBtb2R1bGUgaXMga2V5IGZvciBwZXJmb3JtYW5jZVxuYmVjYXVzZSBpdCBoYWNrcyBvbiB0aGUgbG9jYWxTdG9yYWdlIHRvIGNhY2hlIGNvbXBvbmVudHMgb2YgdGhlIHNpdGUgYW5kXG5pbmNyZWFzZSByZXNwb25zaXZlbmVzcyBvZiB0aGUgc2l0ZS5cblxuVGhpcyBtb2R1bGUgaW4gcHJvZHVjdGlvbiBtb2RlIGNhY2hlcyBhbGwgc3RhcnR1cCBzY3JpcHRzIGFuZCByZXVzZXMgdGhlbSB3aGVuXG50aGUgdXNlciBuYXZpZ2F0ZXMgdG8gdGhlIHBhZ2UgZm9yIHRoZSBzZWNvbmQgdGltZSwgc2hvcnRlbmluZyBsb2FkIHRpbWUgdG8gPFxuMTAwbXMuIEl0IGFsc28gY2FjaGVzIGRhdGEgdGhhdCBkb2Vzbid0IGNoYW5nZSB0aGF0IG9mdGVuIGxpa2UgdGhlIGxvY2F0aW9ucyBhbmRcbnRoZSBjYXRlZ29yaWVzIG9mIGNsYXNzaWZpZWRzLlxuICovXG52YXIgY29udHJvbGxlcjtcblxubW9kdWxlLmV4cG9ydHMgPSBjb250cm9sbGVyID0gKGZ1bmN0aW9uKCkge1xuICBjb250cm9sbGVyLnByb3RvdHlwZS5uYW1lID0gJ1tjYWNoZV0nO1xuXG4gIGNvbnRyb2xsZXIucHJvdG90eXBlLmZhbGxiYWNrID0gZmFsc2U7XG5cblxuICAvKlxuICAjIyAqY29uc3RydWN0b3IoKToqXG4gIENoZWNrcyB0aGUgSlMgdmVyc2lvbiBmcm9tIHRoZSBzZXJ2ZXIgc2lkZSBhbmQgc2V0dXBzIHRoZSBsb2NhbCBzdG9yYWdlXG4gIGJhc2VkIG9uIGl0LiBJZiB0aGUgSlMgdmVyc2lvbiBmcm9tIHRoZSBsb2NhbCBhbmQgdGhlIHNlcnZlciBhcmVcbiAgZGlmZmVyZW50LCB0aGVuIHJlc2V0IHRoZSBsb2NhbCBzdG9yYWdlLiBPdGhlcndpc2UgaGF2ZSB0aGUgbG9jYWwgc3RvcmFnZVxuICBjYWNoZSBldmVyeSBwYWdlIHRlbXBsYXRlIHRoYXQgaXQgZG93bmxvYWRzLlxuICBcbiAgQWxzbywgaWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBsb2NhbFN0b3JhZ2UgdXNlIGZhbGxiYWNrIG1ldGhvZHMuXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNvbnRyb2xsZXIoYXBwLCBjb25maWcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcnKTtcbiAgICBpZiAodHlwZW9mIFN0b3JhZ2UgIT09IFwidW5kZWZpbmVkXCIgJiYgU3RvcmFnZSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5jaGVja1ZlcnNpb25zKCk7XG4gICAgICBzZXRUaW1lb3V0KCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5jYWNoZVN0YXJ0dXBTY3JpcHRzKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSksIDMwMDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZhbGxiYWNrID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ0hUTUw1IFN0b3JhZ2Ugbm90IHN1cHBvcnRlZC4gVXNpbmcgZmFsbGJhY2sgbWV0aG9kcycpO1xuICAgICAgY29uc29sZS53YXJuKHRoaXMubmFtZSwgJ25vIGZhbGxiYWNrIG1ldGhvZHMgZm9yIGNhY2hlIGhhdmUgYmVlbiBpbXBsZW1lbnRlZCBzbyBmYXInKTtcbiAgICB9XG4gIH1cblxuXG4gIC8qXG4gICMjICpjaGVja1ZlcnNpb25zKCk6KlxuICBUaGlzIGZ1bmN0aW9uIGNoZWNrcyB0aGUgdmVyc2lvbiBvZiB0aGUgZGlmZmVyZW50IGtpbmRzIG9mIGRhdGEgdGhhdCBpc1xuICBzdG9yZWQgaW4gdGhlIGNhY2hlLiBCYXNpY2FsbHkgdGhlIHZlcnNpb24gY29udHJvbCBhbGxvd3MgdGhlIHNlcnZlciB0b1xuICBkZW1hbmQgdGhlIGNsaWVudHMgdG8gY2xlYXIgdGhlIGNhY2hlIHdoZW5ldmVyIGl0IHdhbnRzIHRvIGFuZCB1cGRhdGVcbiAgaXRzZWxmIHdpdGggdGhlIG5ldyB2ZXJzaW9uLlxuICAgKi9cblxuICBjb250cm9sbGVyLnByb3RvdHlwZS5jaGVja1ZlcnNpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIF9jbGVhckFwcGxpY2F0aW9uQ2FjaGUsIF9jbGVhckxpYnJhcmllc0NhY2hlLCBfY2xlYXJNb2RlbHNDYWNoZSwgX3JlbW92ZUtleXNIZWxwZXIsIG1hZ2ljO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJjaGVja2luZyBjYWNoZSB2ZXJzaW9uXCIpO1xuICAgIG1hZ2ljID0gd2luZG93LmNvbmZpZy5tYWdpYyB8fCB7fTtcbiAgICBfY2xlYXJBcHBsaWNhdGlvbkNhY2hlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX3JlbW92ZUtleXNIZWxwZXIoJ2FwcCcpO1xuICAgIH07XG4gICAgX2NsZWFyTGlicmFyaWVzQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfcmVtb3ZlS2V5c0hlbHBlcignbGlicmFyeScpO1xuICAgIH07XG4gICAgX2NsZWFyTW9kZWxzQ2FjaGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfcmVtb3ZlS2V5c0hlbHBlcignbW9kZWxzJyk7XG4gICAgfTtcbiAgICBfcmVtb3ZlS2V5c0hlbHBlciA9IGZ1bmN0aW9uKHRhZykge1xuICAgICAgdmFyIGksIGosIGssIGtleSwga2V5c1RvUmVtb3ZlLCBsZW4sIHJlZiwgcmVzdWx0cztcbiAgICAgIGtleXNUb1JlbW92ZSA9IFtdO1xuICAgICAgZm9yIChpID0gaiA9IDAsIHJlZiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7IDAgPD0gcmVmID8gaiA8IHJlZiA6IGogPiByZWY7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgICBrZXkgPSBsb2NhbFN0b3JhZ2Uua2V5KGkpO1xuICAgICAgICBpZiAoKGtleSAhPSBudWxsKSAmJiAoKGtleS5zcGxpdCgnOicpKVswXSA9PT0gdGFnKSkge1xuICAgICAgICAgIGtleXNUb1JlbW92ZS5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoayA9IDAsIGxlbiA9IGtleXNUb1JlbW92ZS5sZW5ndGg7IGsgPCBsZW47IGsrKykge1xuICAgICAgICBrZXkgPSBrZXlzVG9SZW1vdmVba107XG4gICAgICAgIHJlc3VsdHMucHVzaChsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICAgIH07XG4gICAgaWYgKCh0aGlzLmdldCgnbWFnaWM6bGlicmFyeScpKSAhPT0gbWFnaWMubGlicmFyeSkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImxpYnJhcnkgY2FjaGVzIGRpZmZlciwgY2xlYXJpbmdcIik7XG4gICAgICBfY2xlYXJMaWJyYXJpZXNDYWNoZSgpO1xuICAgICAgdGhpcy5zZXQoJ21hZ2ljOmxpYnJhcnknLCBtYWdpYy5saWJyYXJ5KTtcbiAgICB9XG4gICAgaWYgKCh0aGlzLmdldCgnbWFnaWM6bW9kZWxzJykpICE9PSBtYWdpYy5tb2RlbHMpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJtb2RlbCBjYWNoZXMgZGlmZmVyLCBjbGVhcmluZ1wiKTtcbiAgICAgIF9jbGVhck1vZGVsc0NhY2hlKCk7XG4gICAgICB0aGlzLnNldCgnbWFnaWM6bW9kZWxzJywgbWFnaWMubW9kZWxzKTtcbiAgICB9XG4gICAgaWYgKCh0aGlzLmdldCgnbWFnaWM6YXBwbGljYXRpb24nKSkgIT09IG1hZ2ljLmFwcGxpY2F0aW9uKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiYXBwbGljYXRpb24gY2FjaGVzIGRpZmZlciwgY2xlYXJpbmdcIik7XG4gICAgICBfY2xlYXJBcHBsaWNhdGlvbkNhY2hlKCk7XG4gICAgICByZXR1cm4gdGhpcy5zZXQoJ21hZ2ljOmFwcGxpY2F0aW9uJywgbWFnaWMuYXBwbGljYXRpb24pO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICMjICpjYWNoZVN0YXJ0dXBTY3JpcHRzKCk6KlxuICBUaGlzIGZ1bmN0aW9uIGlzIHJlc3BvbnNpYmxlIGZvciBzYXZpbmcgYWxsIHRoZSBzdGFydHVwIHNjcmlwdHNcbiAgKGVnOiBqUXVlcnksIEJhY2tib25lLCBNYXNvbnJ5KSBpbnRvIHRoZSBsb2NhbFN0b3JhZ2UgY2FjaGUuIFRoaXMgd2F5IHRoZVxuICBuZXh0IHRpbWUgdGhlIHVzZXIgb3BlbiB0aGUgcGFnZSwgc2l0ZSB3aWxsIGltbWVkaWF0ZWx5IGxvYWQgdGhlIHNjcmlwdHNcbiAgZnJvbSB0aGUgY2FjaGUgYW5kIGF2b2lkIG1ha2luZyByZXF1ZXN0cyBmcm9tIHRoZSBDRE4uXG4gIFxuICBUaGUgY29kZSB0aGF0IGxvYWRzIHRoZSBzY3JpcHQgdGhhdCBpcyBzYXZlZCBpbiB0aGUgbG9jYWwgcGF0aCBvZiB0aGUgYXBwLlxuICBUaGlzIGlzIGRvbmUsIGJlY2F1c2UgbW9zdCBicm93c2VycyBkb24ndCBhbGxvdyBjcm9zcy1icm93c2VyIHJlcXVlc3RzXG4gIGFuZCBzYXZpbmcgdGhlIHNjcmlwdHMgbG9jYWwgaXMgYSBzb2x1dGlvbiBmb3IgdGhpcy5cbiAgICovXG5cbiAgY29udHJvbGxlci5wcm90b3R5cGUuY2FjaGVTdGFydHVwU2NyaXB0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhamF4LCBqLCBsZW4sIHJlc3VsdHMsIHNjcmlwdCwgc3RvcmFnZUlkZW50aWZpZXI7XG4gICAgaWYgKHRoaXMuZmFsbGJhY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IHNjcmlwdHMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgIHNjcmlwdCA9IHNjcmlwdHNbal07XG4gICAgICBzdG9yYWdlSWRlbnRpZmllciA9IHNjcmlwdC5uYW1lO1xuICAgICAgaWYgKChzY3JpcHQubG9jYWxTcmMgIT0gbnVsbCkgJiYgIXRoaXMuZ2V0KHN0b3JhZ2VJZGVudGlmaWVyKSkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiY2FjaGluZyBzY3JpcHQ6XCIsIHNjcmlwdC5uYW1lKTtcbiAgICAgICAgYWpheCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihzdG9yYWdlSWRlbnRpZmllciwgc2NyaXB0KSB7XG4gICAgICAgICAgICByZXR1cm4gJC5hamF4KHtcbiAgICAgICAgICAgICAgdXJsOiBzY3JpcHQubG9jYWxTcmMsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnNldChzdG9yYWdlSWRlbnRpZmllciwgcmVzdWx0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coX3RoaXMubmFtZSwgXCJjYWNoZWQgc2NyaXB0OlwiLCBzdG9yYWdlSWRlbnRpZmllcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpO1xuICAgICAgICByZXN1bHRzLnB1c2goYWpheChzdG9yYWdlSWRlbnRpZmllciwgc2NyaXB0KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzLnB1c2godm9pZCAwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cblxuICAvKlxuICAjIyAqc2V0KGtleSwgdmFsdWUpOipcbiAgQSBzaW1wbGUgZnVuY3Rpb24gdG8gc3RvcmUgYSBrZXktdmFsdWUgcGFpciBpbnRvIHRoZSBjYWNoZVxuICAgKi9cblxuICBjb250cm9sbGVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrZXksIHN0cmluZykge1xuICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJzZXR0aW5nICdcIiArIGtleSArIFwiJyBpbnRvIGNhY2hlXCIpO1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHN0cmluZyk7XG4gIH07XG5cblxuICAvKlxuICAjIyAqZ2V0KGtleSk6KlxuICBGdW5jdGlvbiB0byBnZXQgYSBrZXktc3RyaW5nIHBhaXIgZnJvbSB0aGUgY2FjaGUsIGdpdmVuIHRoZSBrZXlcbiAgICovXG5cbiAgY29udHJvbGxlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKHRoaXMuZmFsbGJhY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gIH07XG5cbiAgcmV0dXJuIGNvbnRyb2xsZXI7XG5cbn0pKCk7XG4iLCJcbi8qXG4jIyAqKkxhbmd1YWdlKiogbW9kdWxlXG5UaGlzIG1vZHVsZSBpcyByZXNwb25zaWJsZSBmb3IgbWFraW5nIHRoZSBBcHAgbXVsdGktbGluZ3VhbC4gSXQgZG93bmxvYWRzIHRoZVxuZGlmZmVyZW50IGxhbmd1YWdlIGRpY3Rpb25hcmllcyBhbmQgY2FjaGVzIHRoZW0gaW50byB0aGUgbG9jYWxTdG9yYWdlLiBJdCBjYW5cbmFsc28gdHJhbnNsYXRlIERPTSBlbGVtZW50cyBiYXNlZCBvbiB0aGVzZSBkaWN0aW9uYXJpZXMuXG5cblRoZSBsYW5ndWFnZSBtb2R1bGUgdHJhbnNsYXRlcyBET00gZWxlbWVudHMgYnkgZm9sbG93aW5nIGEgc3BlY2lmaWMgcGF0dGVybi4gU2VlXG4qdHJhbnNsYXRlKCkqIGZvciBtb3JlIGluZm8uXG4gKi9cbnZhciBjb250cm9sbGVyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRyb2xsZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGNvbnRyb2xsZXIucHJvdG90eXBlLm5hbWUgPSAnW2xhbmd1YWdlXSc7XG5cbiAgY29udHJvbGxlci5wcm90b3R5cGUuZmFsbGJhY2sgPSBmYWxzZTtcblxuXG4gIC8qXG4gICMjICpjb25zdHJ1Y3RvcigpOipcbiAgVGhpcyBmdW5jdGlvbiBpbml0aWFsaXplcyB0aGUgbW9kdWxlIGJ5IHNldHRpbmcgdGhlIGN1cnJlbnQgbGFuZ3VhZ2UgYW5kXG4gIGRvd25sb2FkaW5nIGFueSBvdGhlciBsYW5ndWFnZXMgaWYgbmVjZXNzYXJ5LlxuICAgKi9cblxuICBmdW5jdGlvbiBjb250cm9sbGVyKCkge1xuICAgIHZhciBjdXJyZW50TGFuZ3VhZ2UsIGxhbmcsIHJlZiwgc3RyO1xuICAgIHRoaXMucmVzb3VyY2VzID0gQXBwLlJlc291cmNlcztcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcnKTtcbiAgICBfLmV4dGVuZCh0aGlzLCBCYWNrYm9uZS5FdmVudHMpO1xuICAgIHRoaXMuJGh0bWwgPSAkKCdodG1sJyk7XG4gICAgc3RyID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gICAgbGFuZyA9IGxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKC9eXFwvKC4uKS8pO1xuICAgIGlmICgobGFuZyAhPSBudWxsKSAmJiAoKHJlZiA9IGxhbmdbMV0pID09PSAnZW4nIHx8IHJlZiA9PT0gJ2FyJyB8fCByZWYgPT09ICdkZycpKSB7XG4gICAgICBjdXJyZW50TGFuZ3VhZ2UgPSBsYW5nWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50TGFuZ3VhZ2UgPSBcImVuXCI7XG4gICAgfVxuICAgIHRoaXMuc2V0TGFuZ3VhZ2UoY3VycmVudExhbmd1YWdlKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwidXNpbmcgbGFuZ3VhZ2VcIiwgdGhpcy5jdXJyZW50TGFuZ3VhZ2UpO1xuICB9XG5cblxuICAvKlxuICAjIyAqZmV0Y2goKToqXG4gIFRoaXMgZnVuY3Rpb24gZmV0Y2hlcyB0aGUgZGljdGlvbmFyeSBvZiB0aGUgY3VycmVudCBsYW5ndWFnZSwgZWl0aGVyIGZyb20gdGhlXG4gIGNhY2hlIG9yIGZyb20gdGhlIHNlcnZlci4gVGhlIGZ1bmN0aW9uIGVtaXRzIGEgJ3N5bmNlZCcgZXZlbnQgd2hlbiB0aGVcbiAgZGljdGlvbmFyeSBoYXMgYmVlbiBkb3dubG9hZGVkLlxuICAgKi9cblxuICBjb250cm9sbGVyLnByb3RvdHlwZS5mZXRjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYWNoZTtcbiAgICBjYWNoZSA9IHRoaXMucmVzb3VyY2VzLmNhY2hlLmdldChcImFwcDpsYW5ndWFnZTpcIiArIHRoaXMuY3VycmVudExhbmd1YWdlKTtcbiAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImxhbmd1YWdlIGZvdW5kIGluIGNhY2hlXCIpO1xuICAgICAgdGhpcy5jdXJyZW50RGljdG9uYXJ5ID0gSlNPTi5wYXJzZShjYWNoZSk7XG4gICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKCdzeW5jZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImxhbmd1YWdlIG5vdCBmb3VuZCBpbiBjYWNoZVwiKTtcbiAgICAgIHJldHVybiB0aGlzLmRvd25sb2FkTGFuZ3VhZ2UodGhpcy5jdXJyZW50TGFuZ3VhZ2UsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZXJyb3IsIHJlc3BvbnNlKSB7XG4gICAgICAgICAgdmFyIGpzb247XG4gICAgICAgICAgX3RoaXMuY3VycmVudERpY3RvbmFyeSA9IHJlc3BvbnNlO1xuICAgICAgICAgIGpzb24gPSBKU09OLnN0cmluZ2lmeShyZXNwb25zZSk7XG4gICAgICAgICAgX3RoaXMucmVzb3VyY2VzLmNhY2hlLnNldChcImFwcDpsYW5ndWFnZTpcIiArIF90aGlzLmN1cnJlbnRMYW5ndWFnZSwganNvbik7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnRyaWdnZXIoJ3N5bmNlZCcpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICMjICpkb3dubG9hZExhbmd1YWdlKGxhbmcsIGNhbGxiYWNrKToqXG4gIFRoaXMgZnVuY3Rpb24gbWFrZXMgYSBjYWxsIHRvIHRoZSBzZXJ2ZXIgQVBJIHRvIGdldCB0aGUgbGFuZ3VhZ2UgZGljdGlvbmFyeVxuICBzcGVjaWZpZWQgaW4gKmxhbmcqLiBUaGUgKmNhbGxiYWNrKiBmdW5jdGlvbiBnZXRzIGNhbGxlZCB3aXRoIHRoZSByZXNwb25zZVxuICBmcm9tIHRoZSBzZXJ2ZXIgKHdoaWNoIGlzIHRoZSBsYW5ndWFnZSBkaWN0aW9uYXJ5KS5cbiAgICovXG5cbiAgY29udHJvbGxlci5wcm90b3R5cGUuZG93bmxvYWRMYW5ndWFnZSA9IGZ1bmN0aW9uKGxhbmcsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGFqYXg7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImRvd25sb2FkaW5nIGxhbmd1YWdlIGZyb20gc2VydmVyXCIpO1xuICAgIGFqYXggPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLmFqYXg7XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICBiZWZvcmVTZW5kOiBhamF4LnNldEhlYWRlcnMsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIHVybDogXCIvYXBpL2xhbmcvXCIgKyBsYW5nLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuXG4gIC8qXG4gICMjICpzZXRMYW5ndWFnZShsYW5nLCBjYWxsYmFjayk6KlxuICBBIGhhbmR5IGZ1bmN0aW9uIHRvIHByb3Blcmx5IHNldCB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIEFwcC4gKmxhbmcqIHNob3VsZCBiZVxuICBlaXRoZXIgb2YgdGhlIGxhbmd1YWdlIHNsdWdzLiAoZW4vYXIvZGcpXG4gICAqL1xuXG4gIGNvbnRyb2xsZXIucHJvdG90eXBlLnNldExhbmd1YWdlID0gZnVuY3Rpb24obGFuZywgY2FsbGJhY2spIHtcbiAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwic3dpdGNoaW5nIGxhbmd1YWdlIHRvXCIsIGxhbmcpO1xuICAgIHRoaXMuY3VycmVudExhbmd1YWdlID0gbGFuZztcbiAgICB0aGlzLiRodG1sLmF0dHIoJ2xhbmcnLCBsYW5nKTtcbiAgICB0aGlzLnVybFNsdWcgPSBcIi9cIiArIHRoaXMuY3VycmVudExhbmd1YWdlO1xuICAgIHJldHVybiB0aGlzLmZldGNoKGNhbGxiYWNrKTtcbiAgfTtcblxuXG4gIC8qXG4gICMjICp0cmFuc2xhdGUoJGNvbnRhaW5lcik6KlxuICBUaGlzIGZ1bmN0aW9uIHRyYW5zbGF0ZSB0aGUgZ2l2ZW4gRE9NIGVsZW1lbnQgYnkgbG9va2luZyBhdCB0aGUgKmxhbmctKlxuICBhdHRyaWJ1dGVzIGluIGV2ZXJ5IGVsZW1lbnQgYW5kIGZpbmRpbmcgdGhlIHJpZ2h0IGxhbmd1YWdlIHZhbHVlIGZvciBpdC5cbiAgXG4gIFRoZSAqbGFuZy12YWwqIGF0dHJpYnV0ZSBzaG91bGQgY29udGFpbiB0aGUga2V5IGZvciBsYW5ndWFnZSBkaWN0aW9uYXJ5IHdoaWNoXG4gIHNob3VsZCBiZSB1c2VkIGZvciB0aGUgZWxlbWVudCB2YWx1ZS5cbiAgXG4gIFRoZSAqbGFuZy1odG1sKiBhdHRyaWJ1dGUgc2hvdWxkIGNvbnRhaW4gdGhlIGtleSBmb3IgbGFuZ3VhZ2UgZGljdGlvbmFyeSB3aGljaFxuICBzaG91bGQgYmUgdXNlZCBmb3IgdGhlIGVsZW1lbnQncyBodG1sLlxuICBcbiAgVGhlICpsYW5nLXBsYWNlaG9sZGVyKiBhdHRyaWJ1dGUgc2hvdWxkIGNvbnRhaW4gdGhlIGtleSBmb3IgbGFuZ3VhZ2VcbiAgZGljdGlvbmFyeSB3aGljaCBzaG91bGQgYmUgdXNlZCBmb3IgdGhlIGVsZW1lbnQncyBwbGFjZWhvbGRlci5cbiAgICovXG5cbiAgY29udHJvbGxlci5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24oJGNvbnRhaW5lcikge1xuICAgIHZhciAkZWxzLCBfZ2V0TGFuZ3VhZ2VJdGVtO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3RyYW5zbGF0aW5nIGVsZW1lbnQnKTtcbiAgICBfZ2V0TGFuZ3VhZ2VJdGVtID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiAoX3RoaXMuZ2V0KGtleSkpIHx8IGtleTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgJGVscyA9ICRjb250YWluZXIuZmluZCgnW2xhbmctcGxhY2Vob2xkZXJdJyk7XG4gICAgJGVscy5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgIHZhciAkZWw7XG4gICAgICAkZWwgPSAkZWxzLmVxKGkpO1xuICAgICAgcmV0dXJuICRlbC5hdHRyKCdwbGFjZWhvbGRlcicsIF9nZXRMYW5ndWFnZUl0ZW0oJGVsLmF0dHIoJ2xhbmctcGxhY2Vob2xkZXInKSkpO1xuICAgIH0pO1xuICAgICRlbHMgPSAkY29udGFpbmVyLmZpbmQoJ1tsYW5nLXZhbHVlXScpO1xuICAgICRlbHMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICB2YXIgJGVsO1xuICAgICAgJGVsID0gJGVscy5lcShpKTtcbiAgICAgIHJldHVybiAkZWwudmFsKF9nZXRMYW5ndWFnZUl0ZW0oJGVsLmF0dHIoJ2xhbmctdmFsdWUnKSkpO1xuICAgIH0pO1xuICAgICRlbHMgPSAkY29udGFpbmVyLmZpbmQoJ1tsYW5nLWh0bWxdJyk7XG4gICAgcmV0dXJuICRlbHMuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICB2YXIgJGVsO1xuICAgICAgJGVsID0gJGVscy5lcShpKTtcbiAgICAgIHJldHVybiAkZWwuaHRtbChfZ2V0TGFuZ3VhZ2VJdGVtKCRlbC5hdHRyKCdsYW5nLWh0bWwnKSkpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnRyb2xsZXIucHJvdG90eXBlLmxvY2FsaXplTnVtYmVyID0gZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudExhbmd1YWdlID09PSAnYXInKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMuSGVscGVycy5udW1iZXJzLnRvQXJhYmljKG51bWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfVxuICB9O1xuXG5cbiAgLypcbiAgIyMgKmdldChrZXkpOipcbiAgRnVuY3Rpb24gdG8gZ2V0IGEga2V5LXN0cmluZyBwYWlyIGZyb20gdGhlIGN1cnJlbnQgZGljdGlvbmFyeS5cbiAgICovXG5cbiAgY29udHJvbGxlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudERpY3RvbmFyeVtrZXldO1xuICB9O1xuXG4gIHJldHVybiBjb250cm9sbGVyO1xuXG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHtcbiAgbmFtZTogJ1tyb3V0ZXJdJyxcbiAgZmFsbGJhY2s6IGZhbHNlLFxuICBhYm91dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUm91dGUoJ2Fib3V0Jyk7XG4gIH0sXG4gIGFjY291bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJvdXRlKCdhY2NvdW50LWluZGV4Jyk7XG4gIH0sXG4gIGFjY291bnRDcmVkaXRzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZSgnYWNjb3VudC1jcmVkaXRzJyk7XG4gIH0sXG4gIGFjY291bnRNYW5hZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJvdXRlKCdhY2NvdW50LW1hbmFnZScpO1xuICB9LFxuICBhdXRoTG9naW46IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJvdXRlKCdhdXRoLWxvZ2luJyk7XG4gIH0sXG4gIGF1dGhMb2dvdXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJvdXRlKCdhdXRoLWxvZ291dCcpO1xuICB9LFxuICBhdXRoU2lnbnVwOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZSgnYXV0aC1zaWdudXAnKTtcbiAgfSxcbiAgY2xhc3NpZmllZFNlYXJjaDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUm91dGUoJ2NsYXNzaWZpZWQtc2VhcmNoJywgYXJndW1lbnRzKTtcbiAgfSxcbiAgY2xhc3NpZmllZEVkaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJvdXRlKCdjbGFzc2lmaWVkLWVkaXQnLCBhcmd1bWVudHNbMF0pO1xuICB9LFxuICBjbGFzc2lmaWVkRmluaXNoOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZSgnY2xhc3NpZmllZC1maW5pc2gnLCBhcmd1bWVudHNbMF0pO1xuICB9LFxuICBjbGFzc2lmaWVkUG9zdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUm91dGUoJ2NsYXNzaWZpZWQtcG9zdCcpO1xuICB9LFxuICBjbGFzc2lmaWVkU2luZ2xlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZSgnY2xhc3NpZmllZC1zaW5nbGUnLCBhcmd1bWVudHNbMF0pO1xuICB9LFxuICBjb250YWN0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZSgnY29udGFjdCcpO1xuICB9LFxuICBjcmVkaXRzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZSgnY3JlZGl0cycpO1xuICB9LFxuICBndWVzdEZpbmlzaDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUm91dGUoJ2d1ZXN0LWZpbmlzaCcsIGFyZ3VtZW50c1swXSk7XG4gIH0sXG4gIGd1ZXN0RWRpdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUm91dGUoJ2d1ZXN0LWVkaXQnLCBhcmd1bWVudHNbMF0pO1xuICB9LFxuICBndWVzdFBvc3Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZVJvdXRlKCdndWVzdC1wb3N0Jyk7XG4gIH0sXG4gIGd1ZXN0U2luZ2xlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5oYW5kbGVSb3V0ZSgnZ3Vlc3Qtc2luZ2xlJywgYXJndW1lbnRzWzBdKTtcbiAgfSxcbiAgbGFuZGluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlUm91dGUoJ2xhbmRpbmcnKTtcbiAgfSxcbiAgZm91cm9mb3VyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY29uc29sZS5sb2coJzQwNCcpO1xuICB9LFxuICBoYW5kbGVSb3V0ZTogZnVuY3Rpb24odmlldywgcGFyYW1ldGVycykge1xuICAgIHZhciBzdGF0ZTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdyb3V0aW5nIHRvIHZpZXc6Jywgdmlldyk7XG4gICAgdGhpcy5zZXRIaXN0b3J5U3RhdGUoKTtcbiAgICBzdGF0ZSA9IHRoaXMuZ2V0SGlzdG9yeVN0YXRlKCk7XG4gICAgc3RhdGUucGFyYW1ldGVycyA9IHBhcmFtZXRlcnM7XG4gICAgcmV0dXJuIHRoaXMudHJpZ2dlcignY2hhbmdlJywge1xuICAgICAgdmlldzogdmlldyxcbiAgICAgIHN0YXRlOiBzdGF0ZVxuICAgIH0pO1xuICB9LFxuICBpbml0aWFsaXplOiBmdW5jdGlvbihjb25maWcpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcnKTtcbiAgICBpZiAoaGlzdG9yeSAmJiAoaGlzdG9yeS5wdXNoU3RhdGUgPT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiB0aGlzLmZhbGxiYWNrID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpcy5oaXN0b3J5SW5kZXggPSB3aW5kb3cuaGlzdG9yeS5sZW5ndGg7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKHtcbiAgICAgIGluZGV4OiB0aGlzLmhpc3RvcnlJbmRleFxuICAgIH0sICcnLCBkb2N1bWVudC5VUkwpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2luaXRpYWxpemluZyBjdXJyZW50IGhpc3Rvcnkgc3RhdGUnKTtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgJ3N0YXRlOicsIHdpbmRvdy5oaXN0b3J5LnN0YXRlKTtcbiAgICB0aGlzLm9uKCdjaGFuZ2UnLCB0aGlzLnJlYXR0YWNoUm91dGVyKTtcbiAgICAoJCh3aW5kb3cpKS5vbigncG9wc3RhdGUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gX3RoaXMucG9wc3RhdGVIYW5kbGUoZXZlbnQpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuIHRoaXMucHJlcGFyZVJvdXRlcygpO1xuICB9LFxuICBwcmVwYXJlUm91dGVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgX3JvdXRlLCBfdXJsO1xuICAgIF91cmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICAgIHJldHVybiBuZXcgUmVnRXhwKFwiXig/OmVufGFyfGRnKVxcL1wiICsgdXJsICsgXCIoXFwvXFw/LiopPyRcIik7XG4gICAgfTtcbiAgICBfcm91dGUgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihyZWdleCwgdmlldykge1xuICAgICAgICByZXR1cm4gX3RoaXMucm91dGUoX3VybChyZWdleCksIHZpZXcpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICB0aGlzLnJvdXRlKC8uKi8sIFwibGFuZ1JlZGlyZWN0XCIpO1xuICAgIHRoaXMucm91dGUoL14oZW58YXJ8ZGcpXFwvPyQvLCBcImxhbmRpbmdcIik7XG4gICAgX3JvdXRlKFwiYWJvdXRcIiwgXCJhYm91dFwiKTtcbiAgICBfcm91dGUoXCJhY2NvdW50XCIsIFwiYWNjb3VudFwiKTtcbiAgICBfcm91dGUoXCJhY2NvdW50L2NyZWRpdHNcIiwgXCJhY2NvdW50Q3JlZGl0c1wiKTtcbiAgICBfcm91dGUoXCJhY2NvdW50L21hbmFnZVwiLCBcImFjY291bnRNYW5hZ2VcIik7XG4gICAgX3JvdXRlKFwiYXV0aC9sb2dpblwiLCBcImF1dGhMb2dpblwiKTtcbiAgICBfcm91dGUoXCJhdXRoL2xvZ291dFwiLCBcImF1dGhMb2dvdXRcIik7XG4gICAgX3JvdXRlKFwiYXV0aC9zaWdudXBcIiwgXCJhdXRoU2lnbnVwXCIpO1xuICAgIF9yb3V0ZShcImNvbnRhY3RcIiwgXCJjb250YWN0XCIpO1xuICAgIF9yb3V0ZShcInRlcm1zLXByaXZhY3lcIiwgXCJ0ZXJtc3ByaXZhY3lcIik7XG4gICAgX3JvdXRlKFwiY2xhc3NpZmllZFwiLCBcImNsYXNzaWZpZWRTZWFyY2hcIik7XG4gICAgX3JvdXRlKFwiY2xhc3NpZmllZC8oW2EtZjAtOV0qKVwiLCBcImNsYXNzaWZpZWRTaW5nbGVcIik7XG4gICAgX3JvdXRlKFwiY2xhc3NpZmllZC8oW2EtZjAtOV0qKS9lZGl0XCIsIFwiY2xhc3NpZmllZEVkaXRcIik7XG4gICAgX3JvdXRlKFwiY2xhc3NpZmllZC8oW2EtZjAtOV0qKS9maW5pc2hcIiwgXCJjbGFzc2lmaWVkRmluaXNoXCIpO1xuICAgIF9yb3V0ZShcImNsYXNzaWZpZWQvKFthLXpcXC1dKylcIiwgXCJjbGFzc2lmaWVkU2VhcmNoXCIpO1xuICAgIF9yb3V0ZShcImNsYXNzaWZpZWQvKFthLXpcXC1dKykvKFthLXpcXC1dKylcIiwgXCJjbGFzc2lmaWVkU2VhcmNoXCIpO1xuICAgIF9yb3V0ZShcImNsYXNzaWZpZWQvcG9zdFwiLCBcImNsYXNzaWZpZWRQb3N0XCIpO1xuICAgIF9yb3V0ZShcImd1ZXN0LyhbYS1mMC05XSopXCIsIFwiZ3Vlc3RTaW5nbGVcIik7XG4gICAgX3JvdXRlKFwiZ3Vlc3QvKFthLWYwLTldKikvZWRpdFwiLCBcImd1ZXN0RWRpdFwiKTtcbiAgICBfcm91dGUoXCJndWVzdC8oW2EtZjAtOV0qKS9maW5pc2hcIiwgXCJndWVzdEZpbmlzaFwiKTtcbiAgICByZXR1cm4gX3JvdXRlKFwiZ3Vlc3QvcG9zdFwiLCBcImd1ZXN0UG9zdFwiKTtcbiAgfSxcbiAgbGFuZ1JlZGlyZWN0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gXCJcIiArIGxvY2F0aW9uLnBhdGhuYW1lO1xuICB9LFxuICBwb3BzdGF0ZUhhbmRsZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0YXRlID0gdGhpcy5nZXRIaXN0b3J5U3RhdGUoKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdoYW5kbGluZyBwb3BzdGF0ZSBldmVudCcpO1xuICAgIGlmICgoc3RhdGUgIT0gbnVsbCkgJiYgKHN0YXRlLmluZGV4ICE9IG51bGwpKSB7XG4gICAgICByZXR1cm4gdGhpcy5oaXN0b3J5SW5kZXggPSBzdGF0ZS5pbmRleDtcbiAgICB9XG4gIH0sXG4gIHNldEhpc3RvcnlTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN0YXRlID0gdGhpcy5nZXRIaXN0b3J5U3RhdGUoKTtcbiAgICBpZiAoKHN0YXRlICE9IG51bGwpICYmIChzdGF0ZS5pbmRleCA9PSBudWxsKSkge1xuICAgICAgdGhpcy5oaXN0b3J5SW5kZXggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh7XG4gICAgICBpbmRleDogdGhpcy5oaXN0b3J5SW5kZXhcbiAgICB9LCAnJywgZG9jdW1lbnQuVVJMKTtcbiAgfSxcbiAgZ2V0SGlzdG9yeVN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5mYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gd2luZG93Lmhpc3Rvcnkuc3RhdGUgfHwge307XG4gICAgfVxuICB9LFxuICBocmVmRXZlbnRIYW5kbGVyOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBocmVmO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaHJlZiA9ICgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpKS5hdHRyKCdocmVmJyk7XG4gICAgcmV0dXJuIHRoaXMubmF2aWdhdGUoaHJlZiwge1xuICAgICAgdHJpZ2dlcjogdHJ1ZVxuICAgIH0pO1xuICB9LFxuICByZWRpcmVjdDogZnVuY3Rpb24odXJsKSB7XG4gICAgcmV0dXJuIHRoaXMubmF2aWdhdGUodXJsLCB7XG4gICAgICB0cmlnZ2VyOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIHJlcGxhY2VVUkw6IGZ1bmN0aW9uKHVybCkge1xuICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoe1xuICAgICAgaW5kZXg6IHRoaXMuaGlzdG9yeUluZGV4XG4gICAgfSwgJycsIHVybCk7XG4gIH0sXG4gIHJlYXR0YWNoUm91dGVyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdyZWF0dGFjaGluZyBocmVmIGV2ZW50IGhhbmRsZXJzJyk7XG4gICAgKCQoJ2FbZGF0YS12aWV3XScpKS51bmJpbmQoJ2NsaWNrJyk7XG4gICAgcmV0dXJuICgkKCdhW2RhdGEtdmlld10nKSkuYmluZCgnY2xpY2snLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuaHJlZkV2ZW50SGFuZGxlcihldmVudCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxufSk7XG4iLCJ2YXIgdmlld01hbmFnZXIsXG4gIGJpbmQgPSBmdW5jdGlvbihmbiwgbWUpeyByZXR1cm4gZnVuY3Rpb24oKXsgcmV0dXJuIGZuLmFwcGx5KG1lLCBhcmd1bWVudHMpOyB9OyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZpZXdNYW5hZ2VyID0gKGZ1bmN0aW9uKCkge1xuICB2aWV3TWFuYWdlci5wcm90b3R5cGUubmFtZSA9ICdbdmlld01hbmFnZXJdJztcblxuICB2aWV3TWFuYWdlci5wcm90b3R5cGUuY29tcG9uZW50cyA9IChyZXF1aXJlKCdhcHAtdmlld3MnKSkuY29tcG9uZW50cztcblxuICB2aWV3TWFuYWdlci5wcm90b3R5cGUucGFnZXMgPSAocmVxdWlyZSgnYXBwLXZpZXdzJykpLnBhZ2VzO1xuXG4gIHZpZXdNYW5hZ2VyLnByb3RvdHlwZS52aWV3QnVmZmVyID0gW107XG5cbiAgZnVuY3Rpb24gdmlld01hbmFnZXIocmVzb3VyY2VzKSB7XG4gICAgdGhpcy5yZXNvdXJjZXMgPSByZXNvdXJjZXM7XG4gICAgdGhpcy5yb3V0ZUhhbmRsZSA9IGJpbmQodGhpcy5yb3V0ZUhhbmRsZSwgdGhpcyk7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnaW5pdGlhbGl6aW5nJyk7XG4gICAgdGhpcy4kYm9keSA9ICQoJ2JvZHknKTtcbiAgICB0aGlzLiRtYWluID0gJCgnbWFpbicpO1xuICAgIHRoaXMucmVzb3VyY2VzLnJvdXRlci5vbignY2hhbmdlJywgdGhpcy5yb3V0ZUhhbmRsZSk7XG4gICAgdGhpcy5wcm9ncmVzc0JhciA9IG5ldyB0aGlzLmNvbXBvbmVudHMucHJvZ3Jlc3NCYXI7XG4gIH1cblxuICB2aWV3TWFuYWdlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlYWRlciA9IG5ldyB0aGlzLmNvbXBvbmVudHMuaGVhZGVyKHtcbiAgICAgIGVsOiAnaGVhZGVyJyxcbiAgICAgIHJlc291cmNlczogdGhpcy5yZXNvdXJjZXNcbiAgICB9KTtcbiAgICB0aGlzLmhlYWRlci50cmlnZ2VyKCdzdGFydCcpO1xuICAgIHRoaXMuaGVhZGVyLnRyaWdnZXIoJ2NvbnRpbnVlJyk7XG4gICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5jdXJyZW50Vmlldykge1xuICAgICAgaWYgKHRoaXMuY3VycmVudFZpZXcuY2hlY2tSZWRpcmVjdCgpKSB7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIucHJvZ3Jlc3MoMTAwKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJvdXRlci5yZWRpcmVjdCh0aGlzLmN1cnJlbnRWaWV3LnJlZGlyZWN0VXJsKCkpO1xuICAgICAgfVxuICAgICAgdGhpcy5jdXJyZW50Vmlldy50cmlnZ2VyKCdjb250aW51ZScpO1xuICAgICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJvdXRlci5yZWF0dGFjaFJvdXRlcigpO1xuICAgIH1cbiAgfTtcblxuXG4gIC8qXG4gICMjICpyb3V0ZUhhbmRsZShhcmdzKToqXG4gIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gdGhlIHJvdXRlIG9mIHRoZSBjdXJyZW50IGFwcCBoYXMgY2hhbmdlZC4gVGhpc1xuICBmdW5jdGlvbiBpcyByZXNwb25zaWJsZSBmb3IgbWFraW5nIHN1cmUgb2YgcHJvcGVybHkgdW5sb2FkaW5nIHRoZSBwcmV2aW91c1xuICB2aWV3IGFuZCBsb2FkaW5nIHRoZSBuZXh0IHZpZXcuXG4gICAqL1xuXG4gIHZpZXdNYW5hZ2VyLnByb3RvdHlwZS5yb3V0ZUhhbmRsZSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgaGlzdG9yeVN0YXRlLCB2aWV3SWRlbnRpZmllcjtcbiAgICBpZiAoYXJncyA9PSBudWxsKSB7XG4gICAgICBhcmdzID0ge307XG4gICAgfVxuICAgIHZpZXdJZGVudGlmaWVyID0gYXJncy52aWV3O1xuICAgIGhpc3RvcnlTdGF0ZSA9IGFyZ3Muc3RhdGU7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcInNldHRpbmcgdmlldyB0bzpcIiwgdmlld0lkZW50aWZpZXIpO1xuICAgIGNvbnNvbGUuZGVidWcodGhpcy5uYW1lLCBcInVzaW5nIGhpc3Rvcnk6XCIsIGhpc3RvcnlTdGF0ZSk7XG4gICAgdGhpcy5yZXNvdXJjZXMuaGlzdG9yeVN0YXRlID0gaGlzdG9yeVN0YXRlO1xuICAgIHRoaXMuc2V0Vmlldyh2aWV3SWRlbnRpZmllciwgaGlzdG9yeVN0YXRlKTtcbiAgICB0aGlzLnJlc291cmNlcy5jdXJyZW50VmlldyA9IHRoaXMuY3VycmVudFZpZXc7XG4gICAgdGhpcy5yZXNvdXJjZXMuY3VycmVudFZpZXdOYW1lID0gdmlld0lkZW50aWZpZXI7XG4gICAgcmV0dXJuIHRoaXMuZ29vZ2xlQW5hbHl0aWNzU2VuZCgpO1xuICB9O1xuXG5cbiAgLypcbiAgIyMgKnNldFZpZXcodmlld0lkZW50aWZpZXIsIGhpc3RvcnlTdGF0ZSk6KlxuICBTZXRzIHRoZSBjdXJyZW50IHZpZXcsIHBlcmZvcm1pbmcgYWxsIHRoZSBuZWNlc3NhcnkgYWN0aW9ucywgYW5pbWF0aW9ucyBhbmRcbiAgRE9NIG1hbmlwdWxhdGlvbnMuXG4gICAqL1xuXG4gIHZpZXdNYW5hZ2VyLnByb3RvdHlwZS5zZXRWaWV3ID0gZnVuY3Rpb24odmlld0lkZW50aWZpZXIsIGhpc3RvcnlTdGF0ZSkge1xuICAgIGlmIChoaXN0b3J5U3RhdGUgPT0gbnVsbCkge1xuICAgICAgaGlzdG9yeVN0YXRlID0ge307XG4gICAgfVxuICAgIHRoaXMuZGlzcGxheU1vdXNlTG9hZGVyKHRydWUpO1xuICAgIGlmICh0aGlzLmN1cnJlbnRWaWV3ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuc3dpdGNoUGFnZXModmlld0lkZW50aWZpZXIsIGhpc3RvcnlTdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdFBhZ2Uodmlld0lkZW50aWZpZXIsIGhpc3RvcnlTdGF0ZSk7XG4gICAgfVxuICAgIHRoaXMuJGJvZHkuYXR0cignaWQnLCB2aWV3SWRlbnRpZmllcik7XG4gICAgdGhpcy5jdXJyZW50Vmlldy5yZXNvdXJjZXMgPSB0aGlzLnJlc291cmNlcztcbiAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICBpZiAodGhpcy5jdXJyZW50Vmlldy5jaGVja1JlZGlyZWN0KCkpIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5wcm9ncmVzcygxMDApO1xuICAgICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucm91dGVyLnJlZGlyZWN0KHRoaXMuY3VycmVudFZpZXcucmVkaXJlY3RVcmwoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmN1cnJlbnRWaWV3LnRyaWdnZXIoJ2NvbnRpbnVlJyk7XG4gICAgfVxuICAgIHRoaXMuZGlzcGxheU1vdXNlTG9hZGVyKGZhbHNlKTtcbiAgICB0aGlzLnByb2dyZXNzQmFyLnByb2dyZXNzKDEwMCk7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJvdXRlci5yZWF0dGFjaFJvdXRlcigpO1xuICB9O1xuXG4gIHZpZXdNYW5hZ2VyLnByb3RvdHlwZS5pbml0UGFnZSA9IGZ1bmN0aW9uKHRhcmdldFZpZXdJZGVudGlmaWVyLCBoaXN0b3J5U3RhdGUpIHtcbiAgICB2YXIgaW5kZXgsIG9wdGlvbnMsIHRhcmdldFZpZXcsIHVybDtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcgZmlyc3QgdmlldycpO1xuICAgIHRoaXMuY3VycmVudFZpZXdOYW1lID0gdGFyZ2V0Vmlld0lkZW50aWZpZXI7XG4gICAgdGFyZ2V0VmlldyA9IHRoaXMuZ2V0Vmlldyh0YXJnZXRWaWV3SWRlbnRpZmllcik7XG4gICAgdXJsID0gZG9jdW1lbnQuVVJMO1xuICAgIGluZGV4ID0gaGlzdG9yeVN0YXRlLmluZGV4O1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBoaXN0b3J5U3RhdGU6IGhpc3RvcnlTdGF0ZSxcbiAgICAgIHJlc291cmNlczogdGhpcy5yZXNvdXJjZXNcbiAgICB9O1xuICAgIHRoaXMuY3VycmVudFZpZXcgPSBuZXcgdGFyZ2V0VmlldyhvcHRpb25zKTtcbiAgICB0aGlzLiRtYWluLmFwcGVuZCh0aGlzLmN1cnJlbnRWaWV3LiRlbCk7XG4gICAgdGhpcy5jdXJyZW50Vmlldy4kZWwuYXR0cignZGF0YS1pbmRleCcsIGluZGV4KS5hdHRyKCdkYXRhLXVybCcsIHVybCk7XG4gICAgdGhpcy52aWV3QnVmZmVyLnB1c2godGhpcy5jdXJyZW50Vmlldyk7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFZpZXcudHJpZ2dlcignc3RhcnQnKTtcbiAgfTtcblxuXG4gIC8qXG4gICMjICpzd2l0Y2hQYWdlcyh0YXJnZXRWaWV3SWRlbnRpZmllciwgaGlzdG9yeVN0YXRlKToqXG4gIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIHNwZWNpZmljYWxseSB3aGVuIHRoZXJlIGlzIGEgdmlldyB0aGF0IGlzIGFscmVhZHlcbiAgaW5pdGlhbGl6ZWQgYW5kIGhhcyB0byBiZSByZXBsYWNlZCB3aXRoIGEgbmV3IHRhcmdldCB2aWV3LlxuICAgKi9cblxuICB2aWV3TWFuYWdlci5wcm90b3R5cGUuc3dpdGNoUGFnZXMgPSBmdW5jdGlvbih0YXJnZXRWaWV3SWRlbnRpZmllciwgaGlzdG9yeVN0YXRlKSB7XG4gICAgdmFyIHJldmVyc2UsIHRhcmdldFZpZXc7XG4gICAgdGhpcy5jdXJyZW50Vmlld05hbWUgPSB0YXJnZXRWaWV3SWRlbnRpZmllcjtcbiAgICByZXZlcnNlID0gaGlzdG9yeVN0YXRlLnJldmVyc2UgfHwgZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50Vmlldy50cmlnZ2VyKCdwYXVzZScpO1xuICAgIHRhcmdldFZpZXcgPSB0aGlzLmZpbmRUYXJnZXRWaWV3KGhpc3RvcnlTdGF0ZSk7XG4gICAgaWYgKCF0YXJnZXRWaWV3KSB7XG4gICAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgXCJ2aWV3IG5vdCBmb3VuZFwiLCB0YXJnZXRWaWV3SWRlbnRpZmllcik7XG4gICAgICB0YXJnZXRWaWV3ID0gdGhpcy5jcmVhdGVUYXJnZXRWaWV3KHRhcmdldFZpZXdJZGVudGlmaWVyLCBoaXN0b3J5U3RhdGUpO1xuICAgICAgdGFyZ2V0Vmlldy50cmlnZ2VyKCdzdGFydCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jdXJyZW50VmlldyA9IHRhcmdldFZpZXc7XG4gIH07XG5cbiAgdmlld01hbmFnZXIucHJvdG90eXBlLmNyZWF0ZVRhcmdldFZpZXcgPSBmdW5jdGlvbih0YXJnZXRWaWV3SWRlbnRpZmllciwgaGlzdG9yeVN0YXRlKSB7XG4gICAgdmFyICR0YXJnZXRQYWdlLCBpbmRleCwgb3B0aW9ucywgdGFyZ2V0VmlldywgdXJsLCB2aWV3O1xuICAgIGNvbnNvbGUuZGVidWcodGhpcy5uYW1lLCBcImNyZWF0aW5nIG5ldyB2aWV3XCIsIHRhcmdldFZpZXdJZGVudGlmaWVyKTtcbiAgICAoJCh3aW5kb3cpKS5zY3JvbGxUb3AoMCk7XG4gICAgaW5kZXggPSBoaXN0b3J5U3RhdGUuaW5kZXg7XG4gICAgdXJsID0gZG9jdW1lbnQuVVJMO1xuICAgICR0YXJnZXRQYWdlID0gJChcIjxkaXYgZGF0YS11cmw9J1wiICsgdXJsICsgXCInIGRhdGEtaW5kZXg9J1wiICsgaW5kZXggKyBcIic+PC9kaXY+XCIpLmFkZENsYXNzKCdwdC1wYWdlJykuYWRkQ2xhc3ModGFyZ2V0Vmlld0lkZW50aWZpZXIpO1xuICAgIG9wdGlvbnMgPSB7XG4gICAgICBoaXN0b3J5U3RhdGU6IGhpc3RvcnlTdGF0ZSxcbiAgICAgIHJlc291cmNlczogdGhpcy5yZXNvdXJjZXNcbiAgICB9O1xuICAgIHZpZXcgPSB0aGlzLmdldFZpZXcodGFyZ2V0Vmlld0lkZW50aWZpZXIpO1xuICAgIHRhcmdldFZpZXcgPSBuZXcgdmlldyhvcHRpb25zKTtcbiAgICB0aGlzLiRtYWluLmFwcGVuZCh0YXJnZXRWaWV3LiRlbCk7XG4gICAgdGFyZ2V0Vmlldy4kZWwuYXR0cignZGF0YS1pbmRleCcsIGluZGV4KS5hdHRyKCdkYXRhLXVybCcsIHVybCk7XG4gICAgdGhpcy5kZXN0cm95VW53YW50ZWRWaWV3cyhpbmRleCk7XG4gICAgdGhpcy52aWV3QnVmZmVyLnB1c2godGFyZ2V0Vmlldyk7XG4gICAgcmV0dXJuIHRhcmdldFZpZXc7XG4gIH07XG5cbiAgdmlld01hbmFnZXIucHJvdG90eXBlLmZpbmRUYXJnZXRWaWV3ID0gZnVuY3Rpb24oaGlzdG9yeVN0YXRlKSB7XG4gICAgdmFyIGksIGluZGV4LCBsZW4sIHJlZiwgdXJsLCB2aWV3O1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJ0cnlpbmcgdG8gZmluZCB2aWV3IGluIGJ1ZmZlclwiKTtcbiAgICBpbmRleCA9IGhpc3RvcnlTdGF0ZS5pbmRleDtcbiAgICB1cmwgPSBkb2N1bWVudC5VUkw7XG4gICAgcmVmID0gdGhpcy52aWV3QnVmZmVyO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmlldyA9IHJlZltpXTtcbiAgICAgIGlmICgodmlldyAhPSBudWxsKSAmJiAodmlldy4kZWwgIT0gbnVsbCkgJiYgKHZpZXcuJGVsLmRhdGEoJ3VybCcpKSA9PT0gdXJsICYmICh2aWV3LiRlbC5kYXRhKCdpbmRleCcpKSA9PT0gaW5kZXgpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcInZpZXcgZm91bmQgaW4gYnVmZmVyLiByZXVzaW5nIHZpZXdcIik7XG4gICAgICAgIHJldHVybiB2aWV3O1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2aWV3TWFuYWdlci5wcm90b3R5cGUuZGlzcGxheU1vdXNlTG9hZGVyID0gZnVuY3Rpb24oc2hvd24pIHtcbiAgICBpZiAoc2hvd24gPT0gbnVsbCkge1xuICAgICAgc2hvd24gPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gKCQoXCJib2R5XCIpKS50b2dnbGVDbGFzcyhcIndhaXRcIiwgc2hvd24pO1xuICB9O1xuXG4gIHZpZXdNYW5hZ2VyLnByb3RvdHlwZS5nZXRWaWV3ID0gZnVuY3Rpb24odmlld0lkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gdGhpcy5wYWdlc1t2aWV3SWRlbnRpZmllcl07XG4gIH07XG5cbiAgdmlld01hbmFnZXIucHJvdG90eXBlLmRlc3Ryb3lVbndhbnRlZFZpZXdzID0gZnVuY3Rpb24oaGlzdG9yeUluZGV4KSB7XG4gICAgdmFyIGksIGluZGV4LCBsZW4sIHJlZiwgcmVzdWx0cywgdmlldywgdmlld0luZGV4O1xuICAgIGluZGV4ID0gMDtcbiAgICByZWYgPSB0aGlzLnZpZXdCdWZmZXI7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmlldyA9IHJlZltpXTtcbiAgICAgIGlmICgodmlldyA9PSBudWxsKSB8fCAodmlldy4kZWwgPT0gbnVsbCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICB2aWV3SW5kZXggPSBOdW1iZXIodmlldy4kZWwuZGF0YSgnaW5kZXgnKSk7XG4gICAgICBpZiAodmlld0luZGV4ID09PSBoaXN0b3J5SW5kZXggfHwgKGhpc3RvcnlJbmRleCAtIHZpZXdJbmRleCkgPiA1KSB7XG4gICAgICAgIHRoaXMudmlld0J1ZmZlcltpbmRleF0gPSBudWxsO1xuICAgICAgICB2aWV3LnRyaWdnZXIoJ2ZpbmlzaCcpO1xuICAgICAgfVxuICAgICAgcmVzdWx0cy5wdXNoKGluZGV4ICs9IDEpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICB2aWV3TWFuYWdlci5wcm90b3R5cGUuZ29vZ2xlQW5hbHl0aWNzU2VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YgZ2EgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2EgIT09IG51bGwpIHtcbiAgICAgIHJldHVybiBnYSgnc2VuZCcsICdwYWdldmlldycsIHtcbiAgICAgICAgcGFnZTogXCJcIiArIGxvY2F0aW9uLnBhdGhuYW1lICsgbG9jYXRpb24uc2VhcmNoXG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHZpZXdNYW5hZ2VyO1xuXG59KSgpO1xuIiwidmFyIEZhY2Vib29rO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZhY2Vib29rID0gKGZ1bmN0aW9uKCkge1xuICBGYWNlYm9vay5wcm90b3R5cGUubmFtZSA9IFwiW2ZhY2Vib29rXVwiO1xuXG4gIGZ1bmN0aW9uIEZhY2Vib29rKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2luaXRpYWxpemluZycpO1xuICAgIHRoaXMub25Mb2FkKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coX3RoaXMubmFtZSwgJ2xvYWRlZCcpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cblxuICBGYWNlYm9vay5wcm90b3R5cGUub25Mb2FkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgd2FpdEZvckVsZW1lbnQ7XG4gICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gICAgd2FpdEZvckVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh3aW5kb3cuRkIgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gd2FpdEZvckVsZW1lbnQoKTtcbiAgICAgICAgfSksIDI1MCk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gd2FpdEZvckVsZW1lbnQoKTtcbiAgfTtcblxuICByZXR1cm4gRmFjZWJvb2s7XG5cbn0pKCk7XG4iLCJ2YXIgR29vZ2xlTWFwcztcblxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGVNYXBzID0gKGZ1bmN0aW9uKCkge1xuICBHb29nbGVNYXBzLnByb3RvdHlwZS5uYW1lID0gXCJbZ29vZ2xlLW1hcHNdXCI7XG5cbiAgZnVuY3Rpb24gR29vZ2xlTWFwcygpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcnKTtcbiAgICB0aGlzLm9uTG9hZCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKF90aGlzLm5hbWUsICdsb2FkZWQnKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG5cbiAgR29vZ2xlTWFwcy5wcm90b3R5cGUub25Mb2FkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICB2YXIgd2FpdEZvckVsZW1lbnQ7XG4gICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gICAgd2FpdEZvckVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgod2luZG93Lmdvb2dsZSAhPSBudWxsKSAmJiAod2luZG93Lmdvb2dsZS5tYXBzICE9IG51bGwpICYmICh3aW5kb3cuZ29vZ2xlLm1hcHMuQ2lyY2xlICE9IG51bGwpKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB3YWl0Rm9yRWxlbWVudCgpO1xuICAgICAgICB9KSwgMjUwKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiB3YWl0Rm9yRWxlbWVudCgpO1xuICB9O1xuXG4gIHJldHVybiBHb29nbGVNYXBzO1xuXG59KSgpO1xuIiwidmFyIEdvb2dsZVJlY2FwdGNoYTtcblxubW9kdWxlLmV4cG9ydHMgPSBHb29nbGVSZWNhcHRjaGEgPSAoZnVuY3Rpb24oKSB7XG4gIEdvb2dsZVJlY2FwdGNoYS5wcm90b3R5cGUubmFtZSA9IFwiW2dvb2dsZS1yZWNhcHRjaGFdXCI7XG5cbiAgZnVuY3Rpb24gR29vZ2xlUmVjYXB0Y2hhKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2luaXRpYWxpemluZycpO1xuICAgIHRoaXMub25Mb2FkKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coX3RoaXMubmFtZSwgJ2xvYWRlZCcpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH1cblxuICBHb29nbGVSZWNhcHRjaGEucHJvdG90eXBlLm9uTG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgdmFyIHdhaXRGb3JFbGVtZW50O1xuICAgIGlmIChjYWxsYmFjayA9PSBudWxsKSB7XG4gICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICAgIHdhaXRGb3JFbGVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAod2luZG93LmdyZWNhcHRjaGEgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gd2FpdEZvckVsZW1lbnQoKTtcbiAgICAgICAgfSksIDI1MCk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gd2FpdEZvckVsZW1lbnQoKTtcbiAgfTtcblxuICByZXR1cm4gR29vZ2xlUmVjYXB0Y2hhO1xuXG59KSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIEZhY2Vib29rOiByZXF1aXJlKCcuL0ZhY2Vib29rJyksXG4gIEdvb2dsZU1hcHM6IHJlcXVpcmUoJy4vR29vZ2xlTWFwcycpLFxuICBHb29nbGVSZWNhcHRjaGE6IHJlcXVpcmUoJy4vR29vZ2xlUmVjYXB0Y2hhJylcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2FjaGU6IHJlcXVpcmUoJy4vQ2FjaGUnKSxcbiAgZXh0ZXJuYWw6IHJlcXVpcmUoJy4vZXh0ZXJuYWwnKSxcbiAgbGFuZ3VhZ2U6IHJlcXVpcmUoJy4vTGFuZ3VhZ2UnKSxcbiAgcm91dGVyOiByZXF1aXJlKCcuL1JvdXRlcicpLFxuICB2aWV3TWFuYWdlcjogcmVxdWlyZSgnLi9WaWV3TWFuYWdlcicpXG59O1xuIiwiXG4vKlxuKipNYWluVmlldyoqXG4tLS0tLS0tLS0tLS1cblxuVE9ETzogUmV3cml0ZSB0aGlzXG5cblRoaXMgaXMgdGhlIGJhc2UgdmlldyBmb3IgYWxsIHBhZ2VzIGluIHRoZSBBcHAuIEFsbCBwYWdlcyBtdXN0IGluaGVyaXRcbnRoZSBwcm9wZXJ0aWVzIGluIHRoZSB2aWV3LlxuXG5UaGUgZGlmZmVyZW50IGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyBkZWZpbmVkXG5oZXJlIGdldCB1c2VkIGJ5IHRoZSBWaWV3TWFuYWdlciBjb250cm9sbGVyIGFuZCBlbmFibGVzIHRoZSBjb250cm9sbGVyIHRvXG5uZWF0bHkgY2xlYW51cCBhbmQgcmVzdGFydCB2aWV3cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgLypcbiAgIyMgKmluaXRpYWxpemUoKToqXG4gIFRoaXMgZnVuY3Rpb24gZ2V0cyBjYWxsZWQgYnkgQmFja2JvbmUgd2hlbmV2ZXIgd2UgaW5zdGFudGlhdGUgYW4gT2JqZWN0IGZyb21cbiAgdGhpcyB2aWV3LiBIZXJlIHdlIG5vdCBvbmx5IHNldHVwIHNvbWUgY29tbW9uIHJlc291cmNlcyBmb3IgYWxsIG91ciBjaGlsZFxuICB2aWV3cyB0byBwbGF5IHdpdGgsIGJ1dCB3ZSBhbHNvIHNldHVwIHNvbWUgZnVuY3Rpb25zIHRoYXQgd2lsbCBiZSB0aGUgbWFpblxuICBmdW5jdGlvbnMgdGhlIGNoaWxkIHZpZXdzIHdpbGwgdXNlLlxuICAgKi9cbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgdGhpcy5oaXN0b3J5SW5kZXggPSBvcHRpb25zLmhpc3RvcnlJbmRleDtcbiAgICB0aGlzLnJlc291cmNlcyA9IEFwcC5SZXNvdXJjZXM7XG4gICAgdGhpcy5oZWxwZXJzID0gQXBwLmhlbHBlcnM7XG4gICAgaWYgKG9wdGlvbnMudGVtcGxhdGVPcHRpb25zICE9IG51bGwpIHtcbiAgICAgIHRoaXMudGVtcGxhdGVPcHRpb25zID0gb3B0aW9ucy50ZW1wbGF0ZU9wdGlvbnM7XG4gICAgfVxuICAgIHRoaXMudGVtcGxhdGVPcHRpb25zLmxhbmcgPSB0aGlzLnJlc291cmNlcy5sYW5ndWFnZS5jdXJyZW50RGljdG9uYXJ5IHx8IHt9O1xuICAgIHRoaXMudGVtcGxhdGVPcHRpb25zLmxhbmcuaHJlZiA9IHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLnVybFNsdWc7XG5cbiAgICAvKlxuICAgIFRoZXNlIGFyZSBldmVudHMgdGhhdCBnZXQgY2FsbGVkIGJ5IHRoZSBWaWV3TWFuYWdlciBtb2R1bGUuIFlvdVxuICAgIGRvbid0IGhhdmUgdG8gZXhwbGljaXRseSB0cmlnZ2VyIHRoZW0gYnV0IGp1c3QgZW5zdXJlIHRoYXQgYWxsIHlvdXJcbiAgICBjb2RlIGxpZXMgaW4gdGhlIGZ1bmN0aW9ucyBkZWZpbmVkIHRoZSBiZWxvdyBzZWN0aW9ucy5cbiAgICAgKi9cbiAgICB0aGlzLm9uKCdzdGFydCcsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCBcInN0YXJ0XCIpO1xuICAgICAgICBpZiAoX3RoaXMudGVtcGxhdGUgIT0gbnVsbCkge1xuICAgICAgICAgIF90aGlzLiRlbC5odG1sKF90aGlzLnRlbXBsYXRlKF90aGlzLnRlbXBsYXRlT3B0aW9ucykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfdGhpcy5zdGFydChvcHRpb25zKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHRoaXMub24oJ2NvbnRpbnVlJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKF90aGlzLm5hbWUsIFwiY29udGludWVcIik7XG4gICAgICAgIF90aGlzLnNldFRpdGxlKCk7XG4gICAgICAgIF90aGlzLnJlc291cmNlcy5sYW5ndWFnZS50cmFuc2xhdGUoX3RoaXMuJGVsKTtcbiAgICAgICAgX3RoaXMuJGVsLnNob3coKTtcbiAgICAgICAgX3RoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgICBfdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgICByZXR1cm4gX3RoaXNbXCJjb250aW51ZVwiXSgpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgdGhpcy5vbigncGF1c2UnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coX3RoaXMubmFtZSwgXCJwYXVzZVwiKTtcbiAgICAgICAgX3RoaXMudW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgICBfdGhpcy5wYXVzZSgpO1xuICAgICAgICByZXR1cm4gX3RoaXMuJGVsLmhpZGUoKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiB0aGlzLm9uKCdmaW5pc2gnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coX3RoaXMubmFtZSwgXCJmaW5pc2hcIik7XG4gICAgICAgIF90aGlzLmZpbmlzaCgpO1xuICAgICAgICBfdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgX3RoaXMudW5iaW5kKCk7XG4gICAgICAgIHJldHVybiBfdGhpcy5zdG9wTGlzdGVuaW5nKCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcblxuICAvKlxuICAgYXNcbiAgICovXG4gIHRlbXBsYXRlT3B0aW9uczoge30sXG5cbiAgLypcbiAgIyMgKm5hbWU6KlxuICBIZXJlIGdvZXMgdGhlIG5hbWUgb2YgdGhlIHZpZXcuIFRoaXMgaXMgdXNlZCBpbiBjb25zb2xlIHN0YXRlbWVudHNcbiAgdG8gaGVscCBkZWJ1ZyB0aGUgYXBwLiBTbyBpbiB5b3VyIHZpZXcgeW91IHdvdWxkIHVzZSBzb21ldGhpbmcgbGlrZVxuICBcbiAgICAgIGNvbnNvbGUubG9nIEBuYW1lLCBcIk1lc3NhZ2VcIlxuICBcbiAgYW5kIHRoaXMgbWFrZXMgaXQgZWFzeSB0byBmaWx0ZXIgb3V0IGNvbnNvbGUgbWVzc2FnZXMgZ2VuZXJhdGVkIGJ5IHRoYXRcbiAgdmlldy4gKFNpbmNlIHRoZSBhcHAgZ2VuZXJhdGVzIGFsb3Qgb2YgY29uc29sZSBtZXNzYWdlcylcbiAgICovXG4gIG5hbWU6IFwiXCIsXG5cbiAgLypcbiAgIyMgKnRpdGxlOipcbiAgVXNlIHRoaXMgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgdGhlIHRpdGxlIGZvciB0aGUgcGFnZS4gSXQgaXMgbWFuZGF0b3J5XG4gIGZvciBldmVyeSB2aWV3IHRvIGRlZmluZSB0aGlzLiBVWCB0aGluZyB5b3Uga25vdy4uLlxuICAgKi9cbiAgdGl0bGU6IFwiUHVibGlzaCBmcmVlIGNsYXNzaWZpZWRzXCIsXG4gIHNldFRpdGxlOiBmdW5jdGlvbih0aXRsZSkge1xuICAgIGlmICh0aXRsZSA9PSBudWxsKSB7XG4gICAgICB0aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGl0bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRpdGxlID0gdGl0bGUoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvY3VtZW50LnRpdGxlID0gdGl0bGUgKyBcIiAtIEt1d2FpdCBhbmQgTWVcIjtcbiAgfSxcblxuICAvKlxuICAjIyAqc3RhcnQoKSwgY29udGludWUoKSwgcGF1c2UoKSwgZmluaXNoKCk6KlxuICBUaGVzZSBmdW5jdGlvbnMgY29udHJvbCB0aGUgdmlldyBzdGF0ZS4gVGhlc2UgZnVuY3Rpb25zIGFyZSBuZXZlciBjYWxsZWRcbiAgZGlyZWN0bHkuIEluc3RlYWQgZXZlbnRzIGFyZSBzZW50IHRvIHRoZSB2aWV3IHdoaWNoIHRoZW4gdHJpZ2dlcnMgdGhlXG4gIGZ1bmN0aW9ucyBhY2NvcmRpbmdseS5cbiAgICovXG5cbiAgLypcbiAgKipzdGFydCgpOioqXG4gIFRoaXMgaXMgY2FsbGVkIG9uY2UsIHdoZW4gdGhlIEFwcCBpcyBpbml0aWFsaXppbmcgdGhlIHZpZXcuIElkZWFsbHkgYWxsIHRoaW5nc1xuICBsaWtlIGF0dGFjaCBET00gZXZlbnRzIGFuZCBvdGhlciBpbml0aWFsaXphdGlvbnMgd2lsbCBnbyBpbiBoZXJlLlxuICAgKi9cbiAgc3RhcnQ6IGZ1bmN0aW9uKCkge30sXG5cbiAgLypcbiAgKipjb250aW51ZSgpOioqXG4gIFRoaXMgaXMgY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIEFwcCB3YW50cyB0byByZXN0YXJ0IHRoZSB2aWV3LiBUaGluZ3MgbGlrZVxuICBjbGVhcmluZyB0aGUgc2NyZWVuIG9yIHJlc2V0dGluZyB2YXJpYWJsZXMgd291bGQgZ28gaW4gaGVyZS5cbiAgICovXG4gIFwiY29udGludWVcIjogZnVuY3Rpb24oKSB7fSxcblxuICAvKlxuICAqKnBhdXNlKCk6KipcbiAgVGhpcyBpcyBjYWxsZWQgZXZlcnktdGltZSB0aGUgQXBwIHdhbnRzIHRvIHN3aXRjaCB0byBhbm90aGVyIHZpZXcgYW5kXG4gIHRlbXBvcmFyaWx5IGRpc2FibGUgdGhpcyB2aWV3LiBUaGluZ3MgbGlrZSBkaXNhYmxpbmcgZXZlbnQgbGlzdGVuZXJzIHdvdWxkXG4gIGdvIGluIGhlcmUuXG4gICAqL1xuICBwYXVzZTogZnVuY3Rpb24oKSB7fSxcblxuICAvKlxuICAqKmZpbmlzaCgpOioqXG4gIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIEFwcCB3YW50cyB0byBmaW5hbGx5IGtpbGwgdGhlIHZpZXcuIFRoZSBvbmx5IHRpbWUgd2hlblxuICB0aGUgYXBwIGNhbGxzIHRoaXMgZnVuY3Rpb24gaXMgd2hlbiBpdCByZWFsaXplcyBpdCBoYXMgYmVlbiBjYWNoaW5nIHRvbyBtYW55XG4gIHZpZXdzIGFuZCBkZWNpZGVzIHRvIGRlbGV0ZSB1bndhbnRlZCBvbmVzLiBBbGwgY2xlYW51cCBwcm9jZWR1cmVzIGdvIGluIGhlcmUuXG4gICAqL1xuICBmaW5pc2g6IGZ1bmN0aW9uKCkge30sXG5cbiAgLypcbiAgIyMgKmNoZWNrUmVkaXJlY3QoKSwgcmVkaXJlY3RVcmwoKToqXG4gIFRoZXNlIHR3byBmdW5jdGlvbnMgZGVjaWRlIGlmIHRoZSBBcHAncyBjb250cm9sIGhhcyB0byBiZSByZWRpcmVjdGVkIG9yXG4gIG5vdC5cbiAgICovXG5cbiAgLypcbiAgKipjaGVja1JlZGlyZWN0KCkqKjogIGlzIHVzZWQgdG8gc2VlIGlmIHRoZSBhcHAncyBjb250cm9sIGhhcyB0byBiZSByZWRpcmVjdGVkXG4gIGFuZCAqcmVkaXJlY3RVcmwoKSogcmV0dXJucyB0aGUgdXJsIHRvIHJlZGlyZWN0IHRvLlxuICAgKi9cbiAgY2hlY2tSZWRpcmVjdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZWRpcmVjdFVybDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcvJztcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiAnW2NvbXA6Y2F0ZWdvcnktbGlzdF0nLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2NvbXBvbmVudHMvY2F0ZWdvcnktbGlzdCddLFxuICBldmVudHM6IHtcbiAgICBcImNsaWNrIGxpIC5pbWFnZVwiOiBcInRvZ2dsZUNsYXNzaWZpZWRcIlxuICB9LFxuICBcImNvbnRpbnVlXCI6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY2F0ZWdvcmllcywgY2F0ZWdvcnksIGZpcnN0U2x1ZywgaSwgbGVuO1xuICAgIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgY2F0ZWdvcmllcyA9IHRoaXMucmVzb3VyY2VzLmNhdGVnb3JpZXMudG9KU09OKCk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2F0ZWdvcmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY2F0ZWdvcnkgPSBjYXRlZ29yaWVzW2ldO1xuICAgICAgZmlyc3RTbHVnID0gKGNhdGVnb3J5Lm5hbWUucmVwbGFjZSgnLCcsICcgJykpLnNwbGl0KCcgJylbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgIGNhdGVnb3J5LmNsYXNzbmFtZSA9IGZpcnN0U2x1ZztcbiAgICB9XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHtcbiAgICAgIGxhbmc6IHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLmN1cnJlbnREaWN0b25hcnksXG4gICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzXG4gICAgfSkpO1xuICAgIHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLnRyYW5zbGF0ZSh0aGlzLiRlbCk7XG4gICAgdGhpcy5yZXNvdXJjZXMucm91dGVyLnJlYXR0YWNoUm91dGVyKCk7XG4gICAgdGhpcy4kY29udGFpbmVyID0gdGhpcy4kKCd1bCcpO1xuICAgIHRoaXMucmVzaXplQ2F0ZWdvcmllcygpO1xuICAgIHRoaXMuJGNvbnRhaW5lci5tYXNvbnJ5KHtcbiAgICAgIGlzQW5pbWF0ZWQ6IHRydWUsXG4gICAgICBpc0ZpdFdpZHRoOiB0cnVlLFxuICAgICAgaXRlbVNlbGVjdG9yOiAnbGknXG4gICAgfSk7XG4gICAgcmV0dXJuICgkKHdpbmRvdykpLnJlc2l6ZSgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlc2l6ZUNhdGVnb3JpZXMoKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9LFxuICByZXNpemVDYXRlZ29yaWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgX2lzU21hbGw7XG4gICAgX2lzU21hbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAobWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMuc21hbGwpKS5tYXRjaGVzICYmICEobWF0Y2hNZWRpYShGb3VuZGF0aW9uLm1lZGlhX3F1ZXJpZXMubWVkaXVtKSkubWF0Y2hlcztcbiAgICB9O1xuICAgIGlmIChfaXNTbWFsbCgpKSB7XG4gICAgICByZXR1cm4gKHRoaXMuJCgnbGknKSkud2lkdGgoKCQod2luZG93KSkud2lkdGgoKSAvIDIgLSAxNCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAodGhpcy4kKCdsaScpKS53aWR0aCgoJCh3aW5kb3cpKS53aWR0aCgpIC8gNCk7XG4gICAgfVxuICB9LFxuICB0b2dnbGVDbGFzc2lmaWVkOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciAkZWwsICRsaXN0O1xuICAgICRlbCA9ICgkKGV2ZW50LmN1cnJlbnRUYXJnZXQpKS5wYXJlbnQoKTtcbiAgICAkbGlzdCA9ICRlbC5maW5kKCcuY2hpbGRyZW4nKTtcbiAgICBpZiAoJGxpc3QuaGVpZ2h0KCkgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLm9wZW5DbGFzc2lmaWVkKCRlbCwgJGxpc3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZUNsYXNzaWZpZWQoKTtcbiAgICB9XG4gIH0sXG4gIG9wZW5DbGFzc2lmaWVkOiBmdW5jdGlvbigkZWwsICRsaXN0KSB7XG4gICAgdmFyIGhlaWdodDtcbiAgICB0aGlzLmNsb3NlQ2xhc3NpZmllZCgpO1xuICAgICRlbC5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgJGxpc3QuY3NzKCdoZWlnaHQnLCAnYXV0bycpO1xuICAgIGhlaWdodCA9ICRsaXN0LmhlaWdodCgpO1xuICAgIHJldHVybiB0aGlzLiRjb250YWluZXIubWFzb25yeSgpO1xuICB9LFxuICBjbG9zZUNsYXNzaWZpZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkZWwsICRsaXN0O1xuICAgICRlbCA9IHRoaXMuJCgnbGknKTtcbiAgICAodGhpcy4kKCcuYWN0aXZlJykpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkbGlzdCA9ICRlbC5maW5kKCcuY2hpbGRyZW4nKTtcbiAgICAkbGlzdC5oZWlnaHQoMCk7XG4gICAgcmV0dXJuIHRoaXMuJGNvbnRhaW5lci5tYXNvbnJ5KCk7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIGdyaWRNaW5pbXVtU2l6ZTogMjUwLFxuICBwYWdlSW5kZXg6IDEsXG4gIHNldHRpbmdzOiB7XG4gICAgYWpheEVuYWJsZTogdHJ1ZSxcbiAgICBhamF4TG9jazogZmFsc2UsXG4gICAgaXNBY2NvdW50OiBmYWxzZSxcbiAgICBlbmFibGVGaWx0ZXJCb3g6IHRydWUsXG4gICAgcXVlcnk6IHtcbiAgICAgIHBhcmVudENhdGVnb3J5OiBudWxsLFxuICAgICAgY2hpbGRDYXRlZ29yeTogbnVsbFxuICAgIH1cbiAgfSxcbiAgdGVtcGxhdGU6IHRlbXBsYXRlWydjb21wb25lbnRzL2NsYXNzaWZpZWQtbGlzdCddLFxuICBuYW1lOiAnW2NvbXA6Y2xhc3NpZmllZC1saXN0XScsXG4gIHN0YXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBfLmV4dGVuZCh0aGlzLnNldHRpbmdzLCBvcHRpb25zLnNldHRpbmdzKTtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBuZXcgdGhpcy5yZXNvdXJjZXMuTW9kZWxzLmNsYXNzaWZpZWRzO1xuICAgIHRoaXMuY29sbGVjdGlvbi5pc0FjY291bnQgPSB0aGlzLnNldHRpbmdzLmlzQWNjb3VudDtcbiAgICB0aGlzLnNldHVwRE9NKCk7XG4gICAgdGhpcy5zZXR1cExpc3RlbmVycygpO1xuICAgIHRoaXMuc2V0dXBNYXNvbnJ5KCk7XG4gICAgXy5iaW5kQWxsKHRoaXMsICdvblNjcm9sbCcpO1xuICAgIHJldHVybiBfLmJpbmRBbGwodGhpcywgJ3Jlc2l6ZUNsYXNzaWZpZWRzJyk7XG4gIH0sXG4gIFwiY29udGludWVcIjogZnVuY3Rpb24oKSB7XG4gICAgKCQod2luZG93KSkub24oJ3Jlc2l6ZScsIHRoaXMucmVzaXplQ2xhc3NpZmllZHMpO1xuICAgICgkKHdpbmRvdykpLm9uKCdzY3JvbGwnLCB0aGlzLm9uU2Nyb2xsKTtcbiAgICBpZiAodGhpcy5xdWVyeSA9PSBudWxsKSB7XG4gICAgICB0aGlzLm5ld1F1ZXJ5KCk7XG4gICAgfVxuICAgIHRoaXMuJGNsYXNzaWZpZWRMaXN0Lm1hc29ucnkoKTtcbiAgICBzZXRUaW1lb3V0KCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLiRjbGFzc2lmaWVkTGlzdC5tYXNvbnJ5KCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKSwgMjAwMCk7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuYWpheEVuYWJsZSkge1xuICAgICAgcmV0dXJuIHRoaXMuJGxvYWRlci5zaG93KCk7XG4gICAgfVxuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgKCQod2luZG93KSkub2ZmKCdzY3JvbGwnLCB0aGlzLm9uU2Nyb2xsKTtcbiAgICByZXR1cm4gKCQod2luZG93KSkub2ZmKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUNsYXNzaWZpZWRzKTtcbiAgfSxcbiAgb25TY3JvbGw6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmFqYXhFbmFibGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpcmVBamF4RXZlbnQoKTtcbiAgICB9XG4gIH0sXG4gIG5ld1F1ZXJ5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGNsYXNzaWZpZWRzLCBiYXNlVXJsLCBjdXJyZW50U3RhdGUsIG5ld1VybCwgcm91dGVyO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3ByZXBhcmluZyBuZXcgcXVlcnknKTtcbiAgICByb3V0ZXIgPSB0aGlzLnJlc291cmNlcy5yb3V0ZXI7XG4gICAgJGNsYXNzaWZpZWRzID0gdGhpcy4kKFwiLmNsYXNzaWZpZWRcIik7XG4gICAgdGhpcy4kY2xhc3NpZmllZExpc3QubWFzb25yeSgncmVtb3ZlJywgJGNsYXNzaWZpZWRzKTtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IDE7XG4gICAgdGhpcy4kY2xhc3NpZmllZExpc3QuaGVpZ2h0KDApO1xuICAgIHRoaXMucXVlcnkgPSB0aGlzLmdldFF1ZXJ5KCk7XG4gICAgdGhpcy5xdWVyeS5wYWdlID0gMDtcbiAgICBpZiAodGhpcy5lbmFibGVGaWx0ZXJCb3gpIHtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IHJvdXRlci5nZXRIaXN0b3J5U3RhdGUoKTtcbiAgICAgIGlmICghdGhpcy5pc0FjY291bnQpIHtcbiAgICAgICAgYmFzZVVybCA9ICcvY2xhc3NpZmllZC9zZWFyY2g/JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhc2VVcmwgPSAnL2FjY291bnQvbWFuYWdlPyc7XG4gICAgICB9XG4gICAgICBuZXdVcmwgPSBiYXNlVXJsICsgJC5wYXJhbSh0aGlzLnF1ZXJ5KTtcbiAgICB9XG4gICAgdGhpcy5zZXR0aW5ncy5hamF4RW5hYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5maXJlQWpheEV2ZW50KCk7XG4gIH0sXG4gIHJlc2l6ZUNsYXNzaWZpZWRzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgd2luZG93V2lkdGg7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAncmVzaXppbmcgY2xhc3NpZmllZHMnKTtcbiAgICB3aW5kb3dXaWR0aCA9ICgkKHdpbmRvdykpLndpZHRoKCk7XG4gICAgcmV0dXJuICh0aGlzLiQoJy5jbGFzc2lmaWVkJykpLmNzcygnbWF4LXdpZHRoJywgd2luZG93V2lkdGggLyAyKTtcbiAgfSxcbiAgZmlyZUFqYXhFdmVudDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmFqYXhFbmFibGUgfHwgdGhpcy5zZXR0aW5ncy5hamF4TG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdmaXJpbmcgYWpheCBldmVudCcpO1xuICAgIGlmICh0aGlzLiRjbGFzc2lmaWVkTGlzdC5oZWlnaHQoKSA9PT0gMCB8fCAoJCh3aW5kb3cpKS5zY3JvbGxUb3AoKSA+PSAoKCQoZG9jdW1lbnQpKS5oZWlnaHQoKSAtICgkKHdpbmRvdykpLmhlaWdodCgpKSAqIDAuNykge1xuICAgICAgcmV0dXJuIHRoaXMuYWpheExvYWRDbGFzc2lmaWVkcygpO1xuICAgIH1cbiAgfSxcbiAgYWpheExvYWRDbGFzc2lmaWVkczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmFtZXRlcnM7XG4gICAgdGhpcy5zZXR0aW5ncy5hamF4TG9jayA9IHRydWU7XG4gICAgdGhpcy4kbG9hZGVyLnNob3coKTtcbiAgICBwYXJhbWV0ZXJzID0gdGhpcy5xdWVyeSB8fCB7fTtcbiAgICBwYXJhbWV0ZXJzLnBhZ2UgPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCArPSAxO1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmV0Y2gocGFyYW1ldGVycywgdGhpcy5hY2NvdW50Q2xhc3NpZmllZHMpO1xuICB9LFxuICBnZXRRdWVyeTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVybEhlbHBlcjtcbiAgICB1cmxIZWxwZXIgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLnVybDtcbiAgICByZXR1cm4ge1xuICAgICAgY2hpbGRDYXRlZ29yeTogKHRoaXMuc2V0dGluZ3MucXVlcnkuY2hpbGRDYXRlZ29yeSB8fCB7fSkuX2lkLFxuICAgICAgcGFyZW50Q2F0ZWdvcnk6ICh0aGlzLnNldHRpbmdzLnF1ZXJ5LnBhcmVudENhdGVnb3J5IHx8IHt9KS5faWQsXG4gICAgICBrZXl3b3JkczogdXJsSGVscGVyLmdldFBhcmFtKCdrZXl3b3JkcycpLFxuICAgICAgbG9jYXRpb246IHVybEhlbHBlci5nZXRQYXJhbSgnbG9jYXRpb24nKSxcbiAgICAgIHByaWNlTWF4OiB1cmxIZWxwZXIuZ2V0UGFyYW0oJ3ByaWNlTWF4JyksXG4gICAgICBwcmljZU1pbjogdXJsSGVscGVyLmdldFBhcmFtKCdwcmljZU1pbicpLFxuICAgICAgdHlwZTogdXJsSGVscGVyLmdldFBhcmFtKCd0eXBlJylcbiAgICB9O1xuICB9LFxuICBhZGRDbGFzc2lmaWVkczogZnVuY3Rpb24oY2xhc3NpZmllZHMpIHtcbiAgICB2YXIgY2xhc3NpZmllZCwgY3JlYXRlRmFpbHVyZUhhbmRsZXIsIGNyZWF0ZVN1Y2Nlc3NIYW5kbGVyLCBlbGVtLCBodG1sLCBpLCBpbWFnZUxvYWRlciwgaW1hZ2VVUkwsIGpzb24sIGxlbjtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdhZGRpbmcgY2xhc3NpZmllZHMnKTtcbiAgICBpbWFnZUxvYWRlciA9IHRoaXMucmVzb3VyY2VzLkxpYnJhcnkuaW1hZ2VMb2FkZXI7XG4gICAgdGhpcy4kbG9hZGVyLmhpZGUoKTtcbiAgICB0aGlzLnNldHRpbmdzLmFqYXhMb2NrID0gZmFsc2U7XG4gICAgdGhpcy4kY2xhc3NpZmllZExpc3QubWFzb25yeSgpO1xuICAgIGlmIChjbGFzc2lmaWVkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuc2V0dGluZ3MuYWpheEVuYWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy4kYWpheGZpbmlzaC5mYWRlSW4oKTtcbiAgICB9XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2xhc3NpZmllZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNsYXNzaWZpZWQgPSBjbGFzc2lmaWVkc1tpXTtcbiAgICAgIGpzb24gPSBjbGFzc2lmaWVkLnRvSlNPTigpO1xuICAgICAganNvbi5sYW5nID0gdGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UuY3VycmVudERpY3RvbmFyeTtcbiAgICAgIGpzb24uc2hvd1N0YXR1cyA9IHRoaXMuc2V0dGluZ3MuaXNBY2NvdW50O1xuICAgICAgaWYgKGpzb24uaW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAganNvbi5pbWFnZSA9IGpzb24uaW1hZ2VzWzBdO1xuICAgICAgfVxuICAgICAgaHRtbCA9IHRoaXMubGlzdFRlbXBsYXRlKGpzb24pO1xuICAgICAgZWxlbSA9ICQoaHRtbCk7XG4gICAgICB0aGlzLiRjbGFzc2lmaWVkTGlzdC5hcHBlbmQoZWxlbSk7XG4gICAgICB0aGlzLiRjbGFzc2lmaWVkTGlzdC5tYXNvbnJ5KCdhcHBlbmRlZCcsIGVsZW0pO1xuICAgICAgaWYgKGpzb24uaW1hZ2UpIHtcbiAgICAgICAgZWxlbS5hZGRDbGFzcygnaW1hZ2UtbG9hZGluZycpO1xuICAgICAgICBjcmVhdGVTdWNjZXNzSGFuZGxlciA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoJ2ltYWdlLWxvYWRpbmcnKTtcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLiRjbGFzc2lmaWVkTGlzdC5tYXNvbnJ5KCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpO1xuICAgICAgICBjcmVhdGVGYWlsdXJlSGFuZGxlciA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoJ2ltYWdlLWxvYWRpbmcnKS5hZGRDbGFzcygnaW1hZ2UtZmFpbGVkJyk7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy4kY2xhc3NpZmllZExpc3QubWFzb25yeSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKTtcbiAgICAgICAgaW1hZ2VVUkwgPSBcIi91cGxvYWRzL3RodW1iL1wiICsganNvbi5pbWFnZS5maWxlO1xuICAgICAgICBpbWFnZUxvYWRlcihpbWFnZVVSTCwge1xuICAgICAgICAgIHN1Y2Nlc3M6IGNyZWF0ZVN1Y2Nlc3NIYW5kbGVyKGVsZW0pLFxuICAgICAgICAgIGZhaWx1cmU6IGNyZWF0ZUZhaWx1cmVIYW5kbGVyKGVsZW0pLFxuICAgICAgICAgIHRhcmdldDogdGhpcy4kKFwiI2ltYWdlY29udGFpbmVyLVwiICsganNvbi5faWQpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlc291cmNlcy5yb3V0ZXIucmVhdHRhY2hSb3V0ZXIoKTtcbiAgICBzZXRUaW1lb3V0KCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmZpcmVBamF4RXZlbnQoKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpLCAxMDAwKTtcbiAgICByZXR1cm4gdGhpcy5yZXNpemVDbGFzc2lmaWVkcygpO1xuICB9LFxuICBzZXR1cExpc3RlbmVyczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdG9wTGlzdGVuaW5nKHRoaXMuY29sbGVjdGlvbiwgJ2FqYXg6ZG9uZScpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlblRvKHRoaXMuY29sbGVjdGlvbiwgJ2FqYXg6ZG9uZScsIHRoaXMuYWRkQ2xhc3NpZmllZHMpO1xuICB9LFxuICBzZXR1cERPTTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRleHRzO1xuICAgIHRoaXMuJGFqYXhmaW5pc2ggPSB0aGlzLiQoXCIuYWpheC1maW5pc2hcIik7XG4gICAgdGhpcy4kY2xhc3NpZmllZExpc3QgPSB0aGlzLiQoJ3VsJyk7XG4gICAgdGhpcy4kZmlsdGVyYm94ID0gdGhpcy4kKCcjZmlsdGVyLWJveCcpO1xuICAgIHRoaXMuJGxvYWRlciA9IHRoaXMuJCgnLmFqYXgtbG9hZGluZycpO1xuICAgIHRoaXMubGlzdFRlbXBsYXRlID0gdGVtcGxhdGVbJ2NvbXBvbmVudHMvY2xhc3NpZmllZC1saXN0LXNpbmdsZSddO1xuICAgIHRleHRzID0gW1wiV29vcHMhIHRoYXQncyBhbGwgd2UgZ290IVwiLCBcIldvd2llISB0aGF0IHNlZW1zIHRvIGJlIGFsbCB3ZSBoYXZlIVwiLCBcIk1heWRheSEgd2UncmUgYWxsIG91dCBvZiBjbGFzc2lmaWVkcyFcIiwgXCJEYW1uLCB0aGVyZSBhcmUgbm8gbW9yZSBjbGFzc2lmaWVkcyFcIl07XG4gICAgcmV0dXJuIHRoaXMuJGFqYXhmaW5pc2guaHRtbCh0ZXh0c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0ZXh0cy5sZW5ndGgpXSk7XG4gIH0sXG4gIHNldHVwTWFzb25yeTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJGNsYXNzaWZpZWRMaXN0Lm1hc29ucnkoe1xuICAgICAgaXNBbmltYXRlZDogdHJ1ZSxcbiAgICAgIGlzRml0V2lkdGg6IHRydWUsXG4gICAgICBpdGVtU2VsZWN0b3I6ICcuY2xhc3NpZmllZCdcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3OmZpbHRlcmJveF0nLFxuICBldmVudHM6IHtcbiAgICBcImNsaWNrICNmaWx0ZXJib3gtaWNvblwiOiBcInNob3dGaWx0ZXJib3hcIlxuICB9LFxuICBxdWVyeToge1xuICAgIGtleXdvcmRzOiBudWxsLFxuICAgIGxvY2F0aW9uOiBudWxsLFxuICAgIHByaWNlTWF4OiBudWxsLFxuICAgIHByaWNlTWluOiBudWxsLFxuICAgIHR5cGU6IG51bGxcbiAgfSxcbiAgdGVtcGxhdGU6IHRlbXBsYXRlWydjb21wb25lbnRzL2ZpbHRlcmJveCddLFxuICBzdGFydDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucXVlcnkpIHtcbiAgICAgIHRoaXMucXVlcnkgPSBvcHRpb25zLnF1ZXJ5O1xuICAgIH1cbiAgICB0aGlzLiRrZXl3b3JkcyA9IHRoaXMuJChcIiNmaWx0ZXIta2V5d29yZHNcIik7XG4gICAgdGhpcy4kcGFyZW50Q2F0ZWdvcnkgPSB0aGlzLiQoXCIjc2VsZWN0LWNhdGVnb3J5XCIpO1xuICAgIHRoaXMuJGNoaWxkQ2F0ZWdvcnkgPSB0aGlzLiQoXCIjc2VsZWN0LXN1YmNhdGVnb3J5XCIpO1xuICAgIHRoaXMuJHNlbGVjdFByaWNlID0gdGhpcy4kKFwiI3NlbGVjdC1wcmljZVwiKTtcbiAgICB0aGlzLiRsb2NhdGlvbiA9IHRoaXMuJChcIiNzZWxlY3QtbG9jYXRpb25cIik7XG4gICAgdGhpcy4kdHlwZSA9IHRoaXMuJChcIiNzZWxlY3QtdHlwZVwiKTtcbiAgICB0aGlzLiRzdWJtaXQgPSB0aGlzLiQoXCIuc3VibWl0XCIpO1xuICAgIHRoaXMuJG1vZGFsID0gdGhpcy4kKFwiI2ZpbHRlcmJveC1tb2RhbFwiKTtcbiAgICByZXR1cm4gdGhpcy5rZXl3b3Jkc0xvY2sgPSAwO1xuICB9LFxuICBcImNvbnRpbnVlXCI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoYW5kbGVyLCB1cmxIZWxwZXJzLCB1cmxRdWVyeTtcbiAgICB1cmxIZWxwZXJzID0gdGhpcy5yZXNvdXJjZXMuSGVscGVycy51cmw7XG4gICAgdGhpcy5faW5pdGlhbGl6ZUNhdGVnb3J5KCk7XG4gICAgdGhpcy5faW5pdGlhbGl6ZUxvY2F0aW9ucygpO1xuICAgIHRoaXMuZGVsZWdhdGVFdmVudHMoKTtcbiAgICBoYW5kbGVyID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnN1Ym1pdEhhbmRsZShldmVudCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICAgIHRoaXMuJHBhcmVudENhdGVnb3J5Lm9uKCdjaGFuZ2UnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gX3RoaXMucGFyZW50Q2F0ZWdvcnlDaGFuZ2UoZXZlbnQpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgdGhpcy4kc3VibWl0Lm9uKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5zdWJtaXRIYW5kbGUoZXZlbnQpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgdXJsUXVlcnkgPSB7XG4gICAgICBrZXl3b3JkczogdXJsSGVscGVycy5nZXRQYXJhbSgna2V5d29yZHMnKSxcbiAgICAgIGxvY2F0aW9uOiB1cmxIZWxwZXJzLmdldFBhcmFtKCdsb2NhdGlvbicpLFxuICAgICAgbG9jYXRpb246IHVybEhlbHBlcnMuZ2V0UGFyYW0oJ2xvY2F0aW9uJyksXG4gICAgICBwcmljZU1heDogdXJsSGVscGVycy5nZXRQYXJhbSgncHJpY2VNYXgnKSxcbiAgICAgIHByaWNlTWluOiB1cmxIZWxwZXJzLmdldFBhcmFtKCdwcmljZU1pbicpLFxuICAgICAgdHlwZTogdXJsSGVscGVycy5nZXRQYXJhbSgndHlwZScpXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5wb3B1bGF0ZUJveCh1cmxRdWVyeSk7XG4gIH0sXG4gIHNob3dGaWx0ZXJib3g6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiRtb2RhbC5mb3VuZGF0aW9uKCdyZXZlYWwnLCAnb3BlbicpO1xuICB9LFxuICBoaWRlRmlsdGVyYm94OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kbW9kYWwuZm91bmRhdGlvbigncmV2ZWFsJywgJ2Nsb3NlJyk7XG4gIH0sXG4gIHBvcHVsYXRlQm94OiBmdW5jdGlvbihxdWVyeSkge1xuICAgIHZhciBDYXRlZ29yeSwgY2hpbGRDYXRlZ29yeSwgcGFyZW50Q2F0ZWdvcnk7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcInBvcHVsYXRpbmcgZmlsdGVyYm94XCIpO1xuICAgIENhdGVnb3J5ID0gdGhpcy5yZXNvdXJjZXMuY2F0ZWdvcmllcztcbiAgICBwYXJlbnRDYXRlZ29yeSA9IHRoaXMucmVzb3VyY2VzLmhpc3RvcnlTdGF0ZS5wYXJhbWV0ZXJzWzBdO1xuICAgIHBhcmVudENhdGVnb3J5ID0gQ2F0ZWdvcnkuZmluZEJ5U2x1ZyhwYXJlbnRDYXRlZ29yeSk7XG4gICAgaWYgKHBhcmVudENhdGVnb3J5Ll9pZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLiRwYXJlbnRDYXRlZ29yeS52YWwocGFyZW50Q2F0ZWdvcnkuX2lkKTtcbiAgICB9XG4gICAgdGhpcy5wYXJlbnRDYXRlZ29yeUNoYW5nZSgpO1xuICAgIGNoaWxkQ2F0ZWdvcnkgPSB0aGlzLnJlc291cmNlcy5oaXN0b3J5U3RhdGUucGFyYW1ldGVyc1sxXTtcbiAgICBjaGlsZENhdGVnb3J5ID0gQ2F0ZWdvcnkuZmluZEJ5U2x1ZyhjaGlsZENhdGVnb3J5KTtcbiAgICBpZiAoY2hpbGRDYXRlZ29yeS5faWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy4kY2hpbGRDYXRlZ29yeS52YWwoY2hpbGRDYXRlZ29yeS5faWQpO1xuICAgIH1cbiAgICB0aGlzLnNldFByaWNlKHF1ZXJ5LnByaWNlTWF4LCBxdWVyeS5wcmljZU1pbik7XG4gICAgdGhpcy4ka2V5d29yZHMudmFsKHF1ZXJ5LmtleXdvcmRzKTtcbiAgICB0aGlzLiR0eXBlLnZhbChxdWVyeS50eXBlKTtcbiAgICByZXR1cm4gdGhpcy4kbG9jYXRpb24udmFsKHF1ZXJ5LmxvY2F0aW9uKTtcbiAgfSxcbiAgc2V0UHJpY2U6IGZ1bmN0aW9uKHByaWNlTWF4LCBwcmljZU1pbikge1xuICAgIGlmIChwcmljZU1heCA9PT0gJzAnICYmIHByaWNlTWluID09PSAnMCcpIHtcbiAgICAgIHRoaXMuJHNlbGVjdFByaWNlLnZhbCgnRnJlZScpO1xuICAgIH1cbiAgICBpZiAocHJpY2VNYXggPT09ICctMScgJiYgcHJpY2VNaW4gPT09ICctMScpIHtcbiAgICAgIHJldHVybiB0aGlzLiRzZWxlY3RQcmljZS52YWwoJ0NvbnRhY3QgT3duZXInKTtcbiAgICB9XG4gIH0sXG4gIHN1Ym1pdEhhbmRsZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdChudWxsKTtcbiAgICByZXR1cm4gdGhpcy50cmlnZ2VyKCdjaGFuZ2VkJyk7XG4gIH0sXG4gIF9pbml0aWFsaXplTG9jYXRpb25zOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaHRtbCwgaSwgbGVuLCBsb2NhdGlvbiwgbG9jYXRpb25zLCBsb2NhdGlvbnNNb2RlbCwgcmVzdWx0cztcbiAgICBsb2NhdGlvbnNNb2RlbCA9IHRoaXMucmVzb3VyY2VzLmxvY2F0aW9ucztcbiAgICBsb2NhdGlvbnMgPSBsb2NhdGlvbnNNb2RlbC50b0pTT04oKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gbG9jYXRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsb2NhdGlvbiA9IGxvY2F0aW9uc1tpXTtcbiAgICAgIGh0bWwgPSB0aGlzLmdlbmVyYXRlT3B0aW9uKGxvY2F0aW9uLl9pZCwgbG9jYXRpb24ubmFtZSk7XG4gICAgICByZXN1bHRzLnB1c2godGhpcy4kbG9jYXRpb24uYXBwZW5kKGh0bWwpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH0sXG4gIF9pbml0aWFsaXplQ2F0ZWdvcnk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXRlZ29yaWVzLCBjYXRlZ29yaWVzTW9kZWwsIGNhdGVnb3J5LCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgY2F0ZWdvcmllc01vZGVsID0gdGhpcy5yZXNvdXJjZXMuY2F0ZWdvcmllcztcbiAgICBjYXRlZ29yaWVzID0gY2F0ZWdvcmllc01vZGVsLnRvSlNPTigpO1xuICAgIHRoaXMuJHBhcmVudENhdGVnb3J5LnZhbChcIlwiKTtcbiAgICB0aGlzLiRwYXJlbnRDYXRlZ29yeS5hcHBlbmQodGhpcy5nZW5lcmF0ZU9wdGlvbignJywgJ0V2ZXJ5dGhpbmcnLCBmYWxzZSwgdHJ1ZSkpO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjYXRlZ29yaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjYXRlZ29yeSA9IGNhdGVnb3JpZXNbaV07XG4gICAgICByZXN1bHRzLnB1c2godGhpcy4kcGFyZW50Q2F0ZWdvcnkuYXBwZW5kKHRoaXMuZ2VuZXJhdGVPcHRpb24oY2F0ZWdvcnkuX2lkLCBjYXRlZ29yeS5uYW1lKSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSxcbiAgZ2VuZXJhdGVPcHRpb246IGZ1bmN0aW9uKHZhbHVlLCBuYW1lLCBkaXNhYmxlZCwgc2VsZWN0ZWQpIHtcbiAgICB2YXIgYXR0cmlidXRlcztcbiAgICBpZiAoZGlzYWJsZWQgPT0gbnVsbCkge1xuICAgICAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHNlbGVjdGVkID09IG51bGwpIHtcbiAgICAgIHNlbGVjdGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGF0dHJpYnV0ZXMgPSBcInZhbHVlPSdcIiArIHZhbHVlICsgXCInXCI7XG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICBhdHRyaWJ1dGVzICs9ICcgZGlzYWJsZWQnO1xuICAgIH1cbiAgICBpZiAoc2VsZWN0ZWQpIHtcbiAgICAgIGF0dHJpYnV0ZXMgKz0gJyBzZWxlY3RlZCc7XG4gICAgfVxuICAgIHJldHVybiBcIjxvcHRpb24gXCIgKyBhdHRyaWJ1dGVzICsgXCI+XCIgKyBuYW1lICsgXCI8L29wdGlvbj5cIjtcbiAgfSxcbiAgcGFyZW50Q2F0ZWdvcnlDaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGFkZENoaWxkQ2F0ZWdvcnksIGNoaWxkLCBjaGlsZHJlbiwgaSwgbGVuLCByZXN1bHRzLCB2YWw7XG4gICAgdmFsID0gdGhpcy4kcGFyZW50Q2F0ZWdvcnkudmFsKCk7XG4gICAgY2hpbGRyZW4gPSB0aGlzLnJlc291cmNlcy5jYXRlZ29yaWVzLmdldENoaWxkcmVuKHZhbCk7XG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuJGNoaWxkQ2F0ZWdvcnkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy4kY2hpbGRDYXRlZ29yeS5wYXJlbnQoKS5hZGRDbGFzcygnaGlkZScpO1xuICAgIH1cbiAgICB0aGlzLiRjaGlsZENhdGVnb3J5Lmh0bWwodGhpcy5nZW5lcmF0ZU9wdGlvbignJywgJ0Nob29zZSBhIHN1Yi1jYXRlZ29yeScpKTtcbiAgICBhZGRDaGlsZENhdGVnb3J5ID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgdmFyIGh0bWw7XG4gICAgICAgIGh0bWwgPSBfdGhpcy5nZW5lcmF0ZU9wdGlvbihjaGlsZC5faWQsIGNoaWxkLm5hbWUpO1xuICAgICAgICByZXR1cm4gX3RoaXMuJGNoaWxkQ2F0ZWdvcnkuYXBwZW5kKGh0bWwpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICByZXN1bHRzLnB1c2goYWRkQ2hpbGRDYXRlZ29yeShjaGlsZCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSxcbiAgZ2V0UXVlcnk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBxdWVyeTtcbiAgICBxdWVyeSA9IHt9O1xuICAgIHN3aXRjaCAodGhpcy4kc2VsZWN0UHJpY2UudmFsKCkpIHtcbiAgICAgIGNhc2UgXCJGcmVlXCI6XG4gICAgICAgIHF1ZXJ5LnByaWNlTWluID0gcXVlcnkucHJpY2VNYXggPSAwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJDb250YWN0IE93bmVyXCI6XG4gICAgICAgIHF1ZXJ5LnByaWNlTWluID0gcXVlcnkucHJpY2VNYXggPSAtMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBxdWVyeS5wcmljZU1pbiA9IHF1ZXJ5LnByaWNlTWF4ID0gXCJcIjtcbiAgICB9XG4gICAgcXVlcnkuY2F0ZWdvcnkgPSB0aGlzLiRwYXJlbnRDYXRlZ29yeS52YWwoKSB8fCBcIlwiO1xuICAgIHF1ZXJ5LmNoaWxkQ2F0ZWdvcnkgPSB0aGlzLiRjaGlsZENhdGVnb3J5LnZhbCgpIHx8IFwiXCI7XG4gICAgcXVlcnkua2V5d29yZHMgPSB0aGlzLiRrZXl3b3Jkcy52YWwoKSB8fCBcIlwiO1xuICAgIHF1ZXJ5LmxvY2F0aW9uID0gdGhpcy4kbG9jYXRpb24udmFsKCkgfHwgXCJcIjtcbiAgICBxdWVyeS50eXBlID0gdGhpcy4kdHlwZS52YWwoKSB8fCBcIlwiO1xuICAgIHJldHVybiBxdWVyeTtcbiAgfSxcbiAgc3VibWl0SGFuZGxlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgQ2F0ZWdvcnksIGNoaWxkQ2F0ZWdvcnksIHBhcmVudENhdGVnb3J5LCBxdWVyeSwgdXJsLCB1cmxIZWxwZXJzO1xuICAgIHVybEhlbHBlcnMgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLnVybDtcbiAgICBDYXRlZ29yeSA9IHRoaXMucmVzb3VyY2VzLmNhdGVnb3JpZXM7XG4gICAgcXVlcnkgPSB0aGlzLmdldFF1ZXJ5KCk7XG4gICAgcGFyZW50Q2F0ZWdvcnkgPSBDYXRlZ29yeS5maW5kQnlJZChxdWVyeS5jYXRlZ29yeSk7XG4gICAgY2hpbGRDYXRlZ29yeSA9IENhdGVnb3J5LmZpbmRCeUlkKHF1ZXJ5LmNoaWxkQ2F0ZWdvcnkpO1xuICAgIHVybCA9IFwiY2xhc3NpZmllZFwiO1xuICAgIGlmIChwYXJlbnRDYXRlZ29yeS5zbHVnICE9IG51bGwpIHtcbiAgICAgIHVybCA9IHVybCArIFwiL1wiICsgcGFyZW50Q2F0ZWdvcnkuc2x1ZztcbiAgICAgIGlmIChjaGlsZENhdGVnb3J5LnNsdWcgIT0gbnVsbCkge1xuICAgICAgICB1cmwgPSB1cmwgKyBcIi9cIiArIGNoaWxkQ2F0ZWdvcnkuc2x1ZztcbiAgICAgIH1cbiAgICB9XG4gICAgdXJsID0gdXJsICsgXCI/XCIgKyAodXJsSGVscGVycy5zZXJpYWxpemVHRVQocXVlcnkpKTtcbiAgICB1cmwgPSB0aGlzLnJlc291cmNlcy5sYW5ndWFnZS51cmxTbHVnICsgXCIvXCIgKyB1cmw7XG4gICAgdGhpcy5yZXNvdXJjZXMucm91dGVyLnJlZGlyZWN0KHVybCk7XG4gICAgcmV0dXJuIHRoaXMuaGlkZUZpbHRlcmJveCgpO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBzbGlkZXJBbmltYXRlV2lkdGg6IDIwMCxcbiAgbmFtZTogJ1t2aWV3OmhlYWRlcl0nLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2NvbXBvbmVudHMvaGVhZGVyJ10sXG4gIGV2ZW50czoge1xuICAgICdjbGljayAjc2VhcmNoLWNsb3NlJzogJ3RvZ2dsZVNlYXJjaEJhcicsXG4gICAgJ2NsaWNrIC5zZWFyY2gtdHJpZ2dlcic6ICd0b2dnbGVTZWFyY2hCYXInLFxuICAgICdjbGljayAjbmF2LWdyYWJiZXInOiAndG9nZ2xlSGVhZGVyJyxcbiAgICAnY2xpY2sgI3N1YmhlYWRlciBhJzogJ3RvZ2dsZUhlYWRlcicsXG4gICAgJ2NsaWNrICNzZWFyY2gtc3VibWl0JzogJ3N1Ym1pdFF1ZXJ5JyxcbiAgICBcInN1Ym1pdFwiOiBcInN1Ym1pdFF1ZXJ5XCJcbiAgfSxcbiAgc2VhcmNoVGV4dHM6IFtcIlNlYXJjaCBmb3IgYW55dGhpbmcgeW91IHdhbnQhXCIsIFwiU2VhcmNoIGZvciB3aGF0IHlvdSB3YW50LCBoZXJlIVwiLCBcIlNlYXJjaCB5b3VyIGhlYXJ0J3MgZGVzaXJlc1wiLCBcIlNlYXJjaCB3aGF0IHlvdSdyZSBsb29raW5nIGZvclwiXSxcbiAgdG9nZ2xlSGVhZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kYm9keS50b2dnbGVDbGFzcygnc2hvdy1zdWJoZWFkZXInKTtcbiAgfSxcbiAgc3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcnKTtcbiAgICB0aGlzLmluaXRpYWxpemVET00oKTtcbiAgICB0aGlzLmluaXRpYWxpemVTY3JvbGxIYW5kbGVyKCk7XG4gICAgdGhpcy5zZXR1cFNlYXJjaFRleHQoKTtcbiAgICB0aGlzLnJlc291cmNlcy5jdXJyZW50VXNlci5vbignc3luYycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3RoaXMudXBkYXRlKCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucm91dGVyLm9uKCdjaGFuZ2UnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH0sXG4gIFwiY29udGludWVcIjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudXBkYXRlKCk7XG4gIH0sXG4gIHNldHVwU2VhcmNoVGV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuJHNlYXJjaC5hdHRyKCdwbGFjZWhvbGRlcicsIHRoaXMuc2VhcmNoVGV4dHNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5zZWFyY2hUZXh0cy5sZW5ndGgpXSk7XG4gIH0sXG4gIGluaXRpYWxpemVET006IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJGJvZHkgPSAkKCdib2R5Jyk7XG4gICAgdGhpcy4kaGVhZGVyID0gJCgnaGVhZGVyJyk7XG4gICAgdGhpcy4kY3JlZGl0cyA9IHRoaXMuJCgnLnVzZXItY3JlZGl0cyAuY291bnQnKTtcbiAgICB0aGlzLiRuYXZIb21lID0gdGhpcy4kKCcjbmF2LWxvZ28nKTtcbiAgICB0aGlzLiRuYXZMaW5rcyA9IHRoaXMuJCgnLm5hdicpO1xuICAgIHRoaXMuJG5leHRMaW5rID0gdGhpcy4kKCcubmV4dCcpO1xuICAgIHRoaXMuJHByZXZpb3VzTGluayA9IHRoaXMuJCgnLnByZXYnKTtcbiAgICB0aGlzLiRzbGlkZXJOYXYgPSB0aGlzLiQoJyNzbGlkZXItbmF2Jyk7XG4gICAgdGhpcy4kdXNlcm5hbWUgPSB0aGlzLiQoJy51c2VyLXRpdGxlIC5uYW1lJyk7XG4gICAgdGhpcy4kdXNlcnRodW1iID0gdGhpcy4kKCcudXNlci10aHVtYiBpbWcnKTtcbiAgICByZXR1cm4gdGhpcy4kc2VhcmNoID0gdGhpcy4kKFwiW25hbWU9J2tleXdvcmRzJ11cIik7XG4gIH0sXG4gIHBvcHVsYXRlSGVhZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudFVzZXIsIG1kNSwgbWQ1SGFzaCwgc3RyYXRlZ2llcywgdXJsO1xuICAgIG1kNSA9IHRoaXMucmVzb3VyY2VzLkxpYnJhcnkubWQ1O1xuICAgIGN1cnJlbnRVc2VyID0gdGhpcy5yZXNvdXJjZXMuY3VycmVudFVzZXIudG9KU09OKCk7XG4gICAgc3RyYXRlZ2llcyA9IHRoaXMucmVzb3VyY2VzLmN1cnJlbnRVc2VyLmxvZ2luU3RyYXRlZ2llcztcbiAgICBzd2l0Y2ggKGN1cnJlbnRVc2VyLmxvZ2luU3RyYXRlZ3kpIHtcbiAgICAgIGNhc2Ugc3RyYXRlZ2llcy5GQUNFQk9PSzpcbiAgICAgICAgdXJsID0gXCJodHRwOi8vZ3JhcGguZmFjZWJvb2suY29tL1wiICsgY3VycmVudFVzZXIudXNlcm5hbWUgKyBcIi9waWN0dXJlP3dpZHRoPTgwXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBzdHJhdGVnaWVzLkdPT0dMRVBMVVM6XG4gICAgICAgIHVybCA9IGN1cnJlbnRVc2VyLnRodW1iIHx8ICcnO1xuICAgICAgICB1cmwgPSB1cmwucmVwbGFjZSgnc3o9NTAnLCAnc3o9ODAnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHN0cmF0ZWdpZXMuVFdJVFRFUjpcbiAgICAgICAgdXJsID0gY3VycmVudFVzZXIudGh1bWIgfHwgJyc7XG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKCdfbm9ybWFsJywgJ19iaWdnZXInKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIHN0cmF0ZWdpZXMuRU1BSUw6XG4gICAgICAgIG1kNUhhc2ggPSBtZDUoY3VycmVudFVzZXIuZW1haWwgfHwgJycpO1xuICAgICAgICB1cmwgPSBcImh0dHBzOi8vd3d3LmdyYXZhdGFyLmNvbS9hdmF0YXIvXCIgKyBtZDVIYXNoO1xuICAgIH1cbiAgICB0aGlzLiRjcmVkaXRzLmh0bWwoY3VycmVudFVzZXIuY3JlZGl0cyk7XG4gICAgdGhpcy4kdXNlcm5hbWUuaHRtbChjdXJyZW50VXNlci5uYW1lKTtcbiAgICByZXR1cm4gdGhpcy4kdXNlcnRodW1iLmF0dHIoJ3NyYycsIHVybCk7XG4gIH0sXG4gIHRvZ2dsZVNlYXJjaEJhcjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ3Nob3ctc2VhcmNoJyk7XG4gICAgaWYgKHRoaXMuJGVsLmhhc0NsYXNzKCdzaG93LXNlYXJjaCcpKSB7XG4gICAgICByZXR1cm4gdGhpcy4kc2VhcmNoLmZvY3VzKCk7XG4gICAgfVxuICB9LFxuICBzdWJtaXRRdWVyeTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIga2V5d29yZHMsIHVybDtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGtleXdvcmRzID0gdGhpcy4kc2VhcmNoLnZhbCgpIHx8ICcnO1xuICAgIGtleXdvcmRzLnJlcGxhY2UoJyAnLCAnKycpO1xuICAgIHVybCA9IHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLnVybFNsdWcgKyBcIi9jbGFzc2lmaWVkL3NlYXJjaC8/a2V5d29yZHM9XCIgKyBrZXl3b3JkcztcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucm91dGVyLnJlZGlyZWN0KHVybCk7XG4gIH0sXG4gIGluaXRpYWxpemVTY3JvbGxIYW5kbGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVsdGEsIGRpZFNjcm9sbCwgaGFzU2Nyb2xsZWQsIGxhc3RTY3JvbGxUb3AsIG5hdmJhckhlaWdodDtcbiAgICBkZWx0YSA9IDU7XG4gICAgZGlkU2Nyb2xsID0gZmFsc2U7XG4gICAgbGFzdFNjcm9sbFRvcCA9IDA7XG4gICAgbmF2YmFySGVpZ2h0ID0gdGhpcy4kZWwub3V0ZXJIZWlnaHQoKTtcbiAgICAoJCh3aW5kb3cpKS5zY3JvbGwoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiBkaWRTY3JvbGwgPSB0cnVlO1xuICAgIH0pO1xuICAgICgkKHdpbmRvdykpLnJlc2l6ZShmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIGRpZFNjcm9sbCA9IHRydWU7XG4gICAgfSk7XG4gICAgaGFzU2Nyb2xsZWQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHN0O1xuICAgICAgICBzdCA9ICgkKHdpbmRvdykpLnNjcm9sbFRvcCgpO1xuICAgICAgICBpZiAoTWF0aC5hYnMobGFzdFNjcm9sbFRvcCAtIHN0KSA8PSBkZWx0YSAmJiBzdCA9PT0gITApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0ID4gbGFzdFNjcm9sbFRvcCAmJiBzdCA+IG5hdmJhckhlaWdodCkge1xuICAgICAgICAgIF90aGlzLiRlbC5hZGRDbGFzcygnbmF2LXVwJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3QgKyAoJCh3aW5kb3cpKS5oZWlnaHQoKSA8ICgkKGRvY3VtZW50KSkuaGVpZ2h0KCkpIHtcbiAgICAgICAgICBfdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ25hdi11cCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdCA9PT0gMCkge1xuICAgICAgICAgIF90aGlzLiRlbC5yZW1vdmVDbGFzcygnbmF2LXVwJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhc3RTY3JvbGxUb3AgPSBzdDtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgcmV0dXJuIHNldEludGVydmFsKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZGlkU2Nyb2xsKSB7XG4gICAgICAgICAgaGFzU2Nyb2xsZWQoKTtcbiAgICAgICAgICByZXR1cm4gZGlkU2Nyb2xsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkodGhpcyksIDI1MCk7XG4gIH0sXG4gIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJlbnRWaWV3LCByb3V0ZXJDb250cm9sbGVyO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3VwZGF0aW5nIGhlYWRlcicpO1xuICAgIHJvdXRlckNvbnRyb2xsZXIgPSBBcHAuUmVzb3VyY2VzLnJvdXRlcjtcbiAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnbmF2LXVwJyk7XG4gICAgY3VycmVudFZpZXcgPSB0aGlzLnJlc291cmNlcy5jdXJyZW50Vmlld05hbWU7XG4gICAgKHRoaXMuJChcIltkYXRhLXZpZXddXCIpKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgKHRoaXMuJChcIltkYXRhLXZpZXc9J1wiICsgY3VycmVudFZpZXcgKyBcIiddXCIpKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgaWYgKHRoaXMucmVzb3VyY2VzLmN1cnJlbnRVc2VyLmlzQW5vbnltb3VzKCkpIHtcbiAgICAgIHRoaXMuJGJvZHkucmVtb3ZlQ2xhc3MoJ2xvZ2dlZGluJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJGJvZHkuYWRkQ2xhc3MoJ2xvZ2dlZGluJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBvcHVsYXRlSGVhZGVyKCk7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZpbHRlckJveDogcmVxdWlyZShcIi4vZmlsdGVyQm94XCIpLFxuICBoZWFkZXI6IHJlcXVpcmUoXCIuL2hlYWRlclwiKSxcbiAgbWVzc2FnZXM6IHJlcXVpcmUoXCIuL21lc3NhZ2VzXCIpLFxuICBwcm9ncmVzc0JhcjogcmVxdWlyZShcIi4vcHJvZ3Jlc3NCYXJcIiksXG4gIGNsYXNzaWZpZWRMaXN0OiByZXF1aXJlKFwiLi9jbGFzc2lmaWVkLmxpc3RcIiksXG4gIGNhdGVnb3J5TGlzdDogcmVxdWlyZShcIi4vY2F0ZWdvcnkubGlzdFwiKSxcbiAgcGF5bWVudE1vZGFsOiByZXF1aXJlKFwiLi9wYXltZW50Lm1vZGFsXCIpXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCc8bGkgY2xhc3M9XCI8JT0gdHlwZSAlPlwiPjxiIGNsYXNzPVwidGl0bGVcIj48JT0gdGl0bGUgJT48L2I+Jm5ic3A7PHNwYW4gY2xhc3M9XCJjb250ZW50XCI+PCU9IHRleHQgJT48L3NwYW4+PC9saT4nKSxcbiAgaW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kbWVzc2FnZSA9IHRoaXMuJGVsLmZpbmQoJy5jb250ZW50Jyk7XG4gICAgcmV0dXJuIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnLnRpdGxlJyk7XG4gIH0sXG4gIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kZWwuaHRtbCgnJyk7XG4gIH0sXG4gIHN1Y2Nlc3M6IGZ1bmN0aW9uKHRleHQsIHRpdGxlKSB7XG4gICAgdmFyIGh0bWw7XG4gICAgaHRtbCA9IHRoaXMudGVtcGxhdGUoe1xuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIHRpdGxlOiB0aXRsZSB8fCAnU3VjY2VzcyEnLFxuICAgICAgdHlwZTogJ3N1Y2Nlc3MnXG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuJGVsLmFwcGVuZChodG1sKTtcbiAgfSxcbiAgZXJyb3I6IGZ1bmN0aW9uKHRleHQsIHRpdGxlKSB7XG4gICAgdmFyIGh0bWw7XG4gICAgaHRtbCA9IHRoaXMudGVtcGxhdGUoe1xuICAgICAgdGV4dDogdGV4dCxcbiAgICAgIHRpdGxlOiB0aXRsZSB8fCAnRXJyb3IhJyxcbiAgICAgIHR5cGU6ICdlcnJvcidcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy4kZWwuYXBwZW5kKGh0bWwpO1xuICB9LFxuICB3YXJuOiBmdW5jdGlvbih0ZXh0LCB0aXRsZSkge1xuICAgIHZhciBodG1sO1xuICAgIGh0bWwgPSB0aGlzLnRlbXBsYXRlKHtcbiAgICAgIHRleHQ6IHRleHQsXG4gICAgICB0aXRsZTogdGl0bGUgfHwgJ1dhcm5pbmchJyxcbiAgICAgIHR5cGU6ICd3YXJuaW5nJ1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLiRlbC5hcHBlbmQoaHRtbCk7XG4gIH1cbn0pO1xuIiwidmFyIHVybEhlbHBlcnM7XG5cbnVybEhlbHBlcnMgPSAocmVxdWlyZSgnYXBwLWhlbHBlcnMnKSkudXJsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogJ1tjb21wOnBheW1lbnQtbW9kYWxdJyxcbiAgdGVtcGxhdGU6IHRlbXBsYXRlWydjb21wb25lbnRzL3BheW1lbnQtbW9kYWwnXSxcbiAgS1dEdG9VU0Q6IDMuMzMsXG4gIGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChvcHRpb25zLnJlc291cmNlcykge1xuICAgICAgdGhpcy5yZXNvdXJjZXMgPSBvcHRpb25zLnJlc291cmNlcztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXNvdXJjZXMgPSBBcHAucmVzb3VyY2VzO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdpbml0aWFsaXppbmcnKTtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgb3B0aW9ucyk7XG4gICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKCkpO1xuICAgIHRoaXMuJG1vZGFsID0gdGhpcy4kKFwiI3BheW1lbnQtbW9kYWxcIik7XG4gICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kKFwiLnN1Ym1pdFwiKTtcbiAgICB0aGlzLiRzcGlubmVyID0gdGhpcy4kKFwiLmFqYXgtc3Bpbm5lclwiKTtcbiAgICB0aGlzLiRleHBpcnkgPSB0aGlzLiQoXCJbbmFtZT0nZXhwaXJ5J11cIik7XG4gICAgdGhpcy4kbmFtZSA9IHRoaXMuJChcIltuYW1lPSduYW1lJ11cIik7XG4gICAgdGhpcy4kbnVtYmVyID0gdGhpcy4kKFwiW25hbWU9J251bWJlciddXCIpO1xuICAgIHRoaXMuJGN2YyA9IHRoaXMuJChcIltuYW1lPSdjdmMnXVwiKTtcbiAgICB0aGlzLiRzdWJtaXQuY2xpY2soKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLnN1Ym1pdEhhbmRsZShldmVudCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgICB0aGlzLiRzcGlubmVyLmhpZGUoKTtcbiAgICByZXR1cm4gKHRoaXMuJChcImZvcm1cIikpLmNhcmQoe1xuICAgICAgY29udGFpbmVyOiAnLmNhcmQtd3JhcHBlcidcbiAgICB9KTtcbiAgfSxcbiAgc2V0UHVyY2hhc2VPcHRpb25zOiBmdW5jdGlvbihjcmVkaXRzLCBLV0QsIFVTRCkge1xuICAgIHZhciBkaWZmO1xuICAgIHRoaXMuY3JlZGl0cyA9IGNyZWRpdHMgIT0gbnVsbCA/IGNyZWRpdHMgOiAwO1xuICAgIGRpZmYgPSBNYXRoLnJvdW5kKCgoS1dEICogdGhpcy5LV0R0b1VTRCkgLSBVU0QpICogMTAwKSAvIDEwMDtcbiAgICAodGhpcy4kKCcuYnV5Y3JlZGl0LWNvdW50JykpLmh0bWwodGhpcy5jcmVkaXRzKTtcbiAgICAodGhpcy4kKCcua3dkJykpLmh0bWwoS1dEICsgXCJLV0RcIik7XG4gICAgKHRoaXMuJCgnLnVzZCcpKS5odG1sKFwiJFwiICsgVVNEKTtcbiAgICAodGhpcy4kKCcudXNkLWNvbnZlcnRlZCcpKS5odG1sKFwiJFwiICsgKEtXRCAqIHRoaXMuS1dEdG9VU0QpKTtcbiAgICByZXR1cm4gKHRoaXMuJCgnLnVzZC1kaWZmJykpLmh0bWwoXCItJFwiICsgZGlmZik7XG4gIH0sXG4gIGdldENyZWRpdERldGFpbHM6IGZ1bmN0aW9uKCkge1xuICAgICh7XG4gICAgICBjY05vOiB0aGlzLiRudW1iZXIudmFsKCkudHJpbSgpLnNwbGl0KCcgJykuam9pbignJyksXG4gICAgICBjdnY6IE51bWJlcih0aGlzLiRjdmMudmFsKCkudHJpbSgpKSxcbiAgICAgIG5hbWU6IHRoaXMuJG5hbWUudmFsKCkudHJpbSgpLFxuICAgICAgZXhwTW9udGg6IE51bWJlcih0aGlzLiRleHBpcnkudmFsKCkuc3BsaXQoJy8nKVswXSksXG4gICAgICBleHBZZWFyOiBOdW1iZXIodGhpcy4kZXhwaXJ5LnZhbCgpLnNwbGl0KCcvJylbMV0pXG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNjTm86IFwiNDAwMDAwMDAwMDAwMDAwMlwiLFxuICAgICAgY3Z2OiBcIjQyMVwiLFxuICAgICAgbmFtZTogXCJKb2huIERvZVwiLFxuICAgICAgZXhwTW9udGg6IFwiMTJcIixcbiAgICAgIGV4cFllYXI6IFwiMTZcIlxuICAgIH07XG4gIH0sXG4gIHZhbGlkYXRlQ3JlZGl0RGV0YWlsczogZnVuY3Rpb24oY3JlZGl0KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGhhbmRsZVRyYW5zYWN0aW9uOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHRoaXMuJHN1Ym1pdC5zaG93KCk7XG4gICAgdGhpcy4kc3Bpbm5lci5oaWRlKCk7XG4gICAgdGhpcy4kbW9kYWwuZm91bmRhdGlvbihcInJldmVhbFwiLCBcIm9wZW5cIik7XG4gICAgcmV0dXJuIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xuICB9LFxuICBzZXRFcnJvck1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UpIHt9LFxuICBzdWJtaXRIYW5kbGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGNyZWRpdERldGFpbHMsIGRhdGE7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLiRzdWJtaXQuaGlkZSgpO1xuICAgIHRoaXMuJHNwaW5uZXIuc2hvdygpO1xuICAgIGNyZWRpdERldGFpbHMgPSB0aGlzLmdldENyZWRpdERldGFpbHMoKTtcbiAgICBkYXRhID0ge1xuICAgICAgY3JlZGl0czogdGhpcy5jcmVkaXRzIHx8IDAsXG4gICAgICBwdWJsaXNoYWJsZUtleTogd2luZG93LmNvbmZpZy5UQ08ucHVibGljS2V5LFxuICAgICAgc2VsbGVySWQ6IHdpbmRvdy5jb25maWcuVENPLnNpZFxuICAgIH07XG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlQ3JlZGl0RGV0YWlscyhjcmVkaXREZXRhaWxzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBfLmV4dGVuZChkYXRhLCBjcmVkaXREZXRhaWxzKTtcbiAgICByZXR1cm4gdGhpcy5nZXRUb2tlbihkYXRhLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvciwgdG9rZW4pIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IsIHRva2VuKTtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICB0b2tlbjogdG9rZW4sXG4gICAgICAgICAgY3JlZGl0czogX3RoaXMuY3JlZGl0c1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX3RoaXMuc2VuZERhdGFCYWNrZW5kKGRhdGEsIGZ1bmN0aW9uKGVycm9yLCByZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yLCByZXNwb25zZSk7XG4gICAgICAgICAgX3RoaXMuJG1vZGFsLmZvdW5kYXRpb24oXCJyZXZlYWxcIiwgXCJjbG9zZVwiKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMuY2FsbGJhY2soZXJyb3IsIHJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgZ2V0VG9rZW46IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGVycm9yLCBzdWNjZXNzO1xuICAgIGVycm9yID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIHN3aXRjaCAocmVzcG9uc2UuZXJyb3JDb2RlKSB7XG4gICAgICAgIGNhc2UgMzAwOlxuICAgICAgICAgIGNvbnNvbGUubG9nKCczMDAnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBjb25zb2xlLmxvZygncycpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGdldCBhIHRyYW5zYWN0aW9uIHRva2VuJyArIHJlc3BvbnNlLmVycm9yTXNnKTtcbiAgICAgIHJldHVybiBjYWxsYmFjayhyZXNwb25zZSk7XG4gICAgfTtcbiAgICBzdWNjZXNzID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB2YXIgdG9rZW47XG4gICAgICAgIHRva2VuID0gZGF0YS5yZXNwb25zZS50b2tlbi50b2tlbjtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0b2tlbik7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICAgIHJldHVybiBUQ08ubG9hZFB1YktleSgnc2FuZGJveCcsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFRDTy5yZXF1ZXN0VG9rZW4oc3VjY2VzcywgZXJyb3IsIGRhdGEpO1xuICAgIH0pO1xuICB9LFxuICBzZW5kRGF0YUJhY2tlbmQ6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICB0eXBlOiAnUFVUJyxcbiAgICAgIHVybDogJy9hcGkvdXNlcicsXG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXNwb25zZSk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhyZXNwb25zZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIGVsOiAnI3BhZ2UtcHJvZ3Jlc3NiYXInLFxuICBzaG93bjogZmFsc2UsXG4gIHByb2dyZXNzOiBmdW5jdGlvbihwZXJjZW50KSB7XG4gICAgaWYgKHBlcmNlbnQgPCA5OSkge1xuICAgICAgaWYgKCF0aGlzLnNob3duKSB7XG4gICAgICAgIHRoaXMuJGVsLnN0b3AoKS5jc3MoJ3dpZHRoJywgMCk7XG4gICAgICAgIHRoaXMuc2hvd24gPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuJGVsLmFuaW1hdGUoe1xuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICB3aWR0aDogcGVyY2VudCArIFwiJVwiXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZmluaXNoKCk7XG4gICAgfVxuICB9LFxuICBmaW5pc2g6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwcm9wZXJ0aWVzO1xuICAgIHRoaXMuc2hvd24gPSBmYWxzZTtcbiAgICBwcm9wZXJ0aWVzID0ge1xuICAgICAgd2lkdGg6IFwiMTAwJVwiXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy4kZWwuYW5pbWF0ZShwcm9wZXJ0aWVzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLiRlbC5jc3MoJ3dpZHRoJywgMCk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tcG9uZW50czogcmVxdWlyZSgnLi9jb21wb25lbnRzJyksXG4gIHBhZ2VzOiByZXF1aXJlKCcuL3BhZ2VzJyksXG4gIEJhY2tib25lVmlldzogcmVxdWlyZSgnLi9CYWNrYm9uZS5WaWV3Jylcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3OmFib3V0XScsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnYWJvdXQnXSxcbiAgdGl0bGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIkFib3V0IFVzXCI7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIG5hbWU6ICdbdmlldzphY2NvdW50LWNyZWRpdHNdJyxcbiAgdGl0bGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIkJ1eSBDcmVkaXRzXCI7XG4gIH0sXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnYWNjb3VudC9jcmVkaXRzJ10sXG4gIGV2ZW50czoge1xuICAgIFwiY2xpY2sgLmN0YS1idXR0b25cIjogXCJidXlIYW5kbGVcIlxuICB9LFxuICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kY3JlZGl0cyA9IHRoaXMuJChcIi5jcmVkaXQtY291bnRlclwiKTtcbiAgICByZXR1cm4gdGhpcy5wYXltZW50TW9kYWwgPSBuZXcgdGhpcy5yZXNvdXJjZXMuVmlld3MuY29tcG9uZW50cy5wYXltZW50TW9kYWwoe1xuICAgICAgZWw6IHRoaXMuJChcIiNwYXltZW50LW1vZGFsLWNvbnRhaW5lclwiKVxuICAgIH0pO1xuICB9LFxuICBcImNvbnRpbnVlXCI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiRjcmVkaXRzLmh0bWwodGhpcy5yZXNvdXJjZXMuY3VycmVudFVzZXIuZ2V0KCdjcmVkaXRzJykpO1xuICB9LFxuICBidXlIYW5kbGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coXCJidXlpbmdcIiwgZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmNyZWRpdHMpO1xuICAgIHN3aXRjaCAoTnVtYmVyKGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5jcmVkaXRzKSkge1xuICAgICAgY2FzZSAyMDpcbiAgICAgICAgdGhpcy5wYXltZW50TW9kYWwuc2V0UHVyY2hhc2VPcHRpb25zKDIwLCAxMCwgMzApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNTA6XG4gICAgICAgIHRoaXMucGF5bWVudE1vZGFsLnNldFB1cmNoYXNlT3B0aW9ucyg1MCwgMjAsIDYwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDEwMDpcbiAgICAgICAgdGhpcy5wYXltZW50TW9kYWwuc2V0UHVyY2hhc2VPcHRpb25zKDEwMCwgMzAsIDkwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGF5bWVudE1vZGFsLmhhbmRsZVRyYW5zYWN0aW9uKGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhlcnJvciwgcmVzdWx0KTtcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3OmFjY291bnQtaW5kZXhdJyxcbiAgdGVtcGxhdGU6IHRlbXBsYXRlWydhY2NvdW50L2luZGV4J10sXG4gIHRpdGxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJNYW5hZ2UgeW91ciBhY2NvdW50XCI7XG4gIH0sXG4gIGNoZWNrUmVkaXJlY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5jdXJyZW50VXNlci5pc0Fub255bW91cygpO1xuICB9LFxuICByZWRpcmVjdFVybDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLnVybFNsdWcgKyBcIi9hdXRoL2xvZ2luP2Vycm9yPW5lZWRfbG9naW5cIjtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3OmFjY291bnQtbWFuYWdlXScsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnYWNjb3VudC9tYW5hZ2UnXSxcbiAgdGl0bGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIk1hbmFnZSB5b3VyIGNsYXNzaWZpZWRzXCI7XG4gIH0sXG4gIGNoZWNrUmVkaXJlY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5jdXJyZW50VXNlci5pc0Fub255bW91cygpO1xuICB9LFxuICByZWRpcmVjdFVybDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLnVybFNsdWcgKyBcIi9hdXRoL2xvZ2luP2Vycm9yPW5lZWRfbG9naW5cIjtcbiAgfSxcbiAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJGNsYXNzaWZpZWRMaXN0ID0gdGhpcy4kKFwiLmNsYXNzaWZpZWRMaXN0XCIpO1xuICAgIHRoaXMuY2xhc3NpZmllZExpc3QgPSBuZXcgdGhpcy5yZXNvdXJjZXMuVmlld3MuY29tcG9uZW50cy5jbGFzc2lmaWVkTGlzdCh7XG4gICAgICBzZXR0aW5nczoge1xuICAgICAgICBpc0FjY291bnQ6IHRydWUsXG4gICAgICAgIGVuYWJsZUZpbHRlckJveDogZmFsc2VcbiAgICAgIH0sXG4gICAgICByZXNvdXJjZXM6IHRoaXMucmVzb3VyY2VzLFxuICAgICAgZWw6IHRoaXMuJGNsYXNzaWZpZWRMaXN0XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NpZmllZExpc3QudHJpZ2dlcignc3RhcnQnKTtcbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jbGFzc2lmaWVkTGlzdC50cmlnZ2VyKCdjb250aW51ZScpO1xuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NpZmllZExpc3QudHJpZ2dlcigncGF1c2UnKTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogXCJbdmlldzphdXRoLWxvZ2luXVwiLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2F1dGgvbG9naW4nXSxcbiAgZXZlbnRzOiB7XG4gICAgJ2NsaWNrIC5zdWJtaXQnOiAnc3VibWl0J1xuICB9LFxuICB0aXRsZTogXCJMb2dpblwiLFxuICBtZXNzYWdlczoge1xuICAgIGFjdGl2YXRlX2ZhaWw6ICdTb21ldGhpbmcgd2VudCB3cm9uZyB3aGlsZSBhY3RpdmF0aW5nIHlvdXIgYWNjb3VudCcsXG4gICAgYWN0aXZhdGVfc3VjY2VzczogJ1lvdXIgYWNjb3VudCBpcyBzdWNjZXNzZnVsbHkgYWN0aXZhdGVkJyxcbiAgICBiYWRfZmllbGRzOiAnUGxlYXNlIGZpbGwgaW4gdGhlIGZpZWxkcyBwcm9wZXJseScsXG4gICAgbG9naW5fZGlzYWJsZWQ6ICdZb3UgaGF2ZSBiZWVuIGJsb2NrZWQgdGVtcG9yYXJpbHkgZm9yIHRvbyBtYW55IGluY29ycmVjdCBsb2dpbnMnLFxuICAgIGxvZ2luX2luYWN0aXZlOiAnWW91ciBhY2NvdW50IGlzIG5vdCBhY3RpdmF0ZWQuIDxicj4gQ2hlY2sgeW91ciBpbmJveCAoYW5kIGp1bmsgZW1haWwpIGZvciBhbiBhY3RpdmF0aW9uIGVtYWlsJyxcbiAgICBsb2dpbl9pbmNvcnJlY3Q6ICdXcm9uZyBlbWFpbC9wYXNzd29yZCcsXG4gICAgbG9nb3V0OiAnWW91IGhhdmUgYmVlbiBsb2dnZWQgb3V0IHN1Y2Nlc3NmdWxseScsXG4gICAgbmVlZF9sb2dpbjogJ1lvdSBuZWVkIHRvIGJlIGxvZ2dlZCBpbiBpbiB0byB2aWV3IHRoYXQgcGFnZScsXG4gICAgcmVzZXRfZXJyb3I6ICdTb21ldGhpbmcgd2VudCB3cm9uZyB3aGlsZSByZXNldHRpbmcgeW91ciBwYXNzd29yZCcsXG4gICAgcmVzZXRfcGFzc3dvcmRfbWlzbWF0Y2g6ICdUaGUgcGFzc3dvcmRzIGhhdmUgdG8gbWF0Y2gnLFxuICAgIHJlc2V0X3Bhc3N3b3JkX3NtYWxsOiAnVGhlIHBhc3N3b3JkIGlzIHRvbyBzbWFsbCAobWluIDYgY2hhcmFjdGVycyknLFxuICAgIHJlc2V0X3NlbnQ6ICdQYXNzd29yZCByZXNldCBoYXMgYmVlbiBzZW50IHRvIHlvdXIgZW1haWwnLFxuICAgIHJlc2V0X3N1Y2Nlc3M6ICdZb3VyIHBhc3N3b3JkIGhhcyBiZWVuIHJlc2V0JyxcbiAgICBzZW5kX2FnYWluOiAnWW91ciBhY2NvdW50IGlzIG5vdCBhY3RpdmF0ZWQsIGNoZWNrIHlvdXIgZW1haWwnLFxuICAgIHNpZ251cF91c2VyZXhpc3RzOiAnQW4gYWNjb3VudCB3aXRoIHRoYXQgZW1haWwgYWxyZWFkeSBleGlzdHMnLFxuICAgIHNpZ251cF9zdWNjZXNzOiAnWW91ciBhY2NvdW50IGhhcyBiZWVuIGNyZWF0ZWQsIENoZWNrIHlvdXIgaW5ib3ggKGFuZCBqdW5rIGVtYWlsKSBmb3IgYW4gYWN0aXZhdGlvbiBlbWFpbCcsXG4gICAgdXNlcl9zdXNwZW5kZWQ6ICdUaGlzIHVzZXIgaGFzIGJlZW4gc3VzcGVuZGVkIHRlbXBvcmFyaWx5IGJ5IGEgbW9kZXJhdG9yJyxcbiAgICB1c2VyX2Jhbm5lZDogJ1lvdXIgYWNjb3VudCBoYXMgYmVlbiBiYW5uZWQgYnkgYSBtb2RlcmF0b3InLFxuICAgIHNpZ251cF90YWtlbjogJ1RoYXQgYWNjb3VudCBuYW1lIGhhcyBhbHJlYWR5IGJlZW4gdGFrZW4hJ1xuICB9LFxuICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tb2RlbCA9IHRoaXMucmVzb3VyY2VzLmN1cnJlbnRVc2VyO1xuICAgIHRoaXMuJGZvcm0gPSB0aGlzLiQoXCIjbG9naW4tZm9ybVwiKTtcbiAgICB0aGlzLiRsaW5rcyA9IHRoaXMuJChcIi5leHRyYS1saW5rc1wiKTtcbiAgICB0aGlzLiRtZXNzYWdlcyA9IHRoaXMuJChcIiNhdXRoLW1lc3NhZ2VzXCIpO1xuICAgIHRoaXMuJHBhc3N3b3JkID0gdGhpcy4kKFwiI2F1dGgtcGFzc3dvcmRcIik7XG4gICAgdGhpcy4kc3Bpbm5lciA9IHRoaXMuJChcIiNhamF4LXNwaW5uZXJcIik7XG4gICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kKFwiLnN1Ym1pdFwiKTtcbiAgICByZXR1cm4gdGhpcy4kdXNlcm5hbWUgPSB0aGlzLiQoXCIjYXV0aC11c2VybmFtZVwiKTtcbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZVVSTCgpO1xuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLiQoJyNnLXJlY2FwdGNoYS1yZXNwb25zZScpKS5yZW1vdmUoKTtcbiAgfSxcbiAgc2V0dXBDYXB0Y2hhOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmFuZG9tSWQ7XG4gICAgcmFuZG9tSWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcbiAgICB0aGlzLmNhcHRjaGFJZCA9IFwiZ2NhcHRjaGEtXCIgKyByYW5kb21JZDtcbiAgICB0aGlzLiRjYXB0Y2hhID0gdGhpcy4kKCcuZ2NhcHRjaGEnKTtcbiAgICByZXR1cm4gdGhpcy4kY2FwdGNoYS5hdHRyKCdpZCcsIHRoaXMuY2FwdGNoYUlkKTtcbiAgfSxcbiAgcGFyc2VVUkw6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlcnJvciwgc3VjY2VzcywgdXJsSGVscGVyLCB3YXJuaW5nO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3BhcnNpbmcgVVJMJyk7XG4gICAgdXJsSGVscGVyID0gdGhpcy5yZXNvdXJjZXMuSGVscGVycy51cmw7XG4gICAgZXJyb3IgPSB1cmxIZWxwZXIuZ2V0UGFyYW0oJ2Vycm9yJyk7XG4gICAgc3VjY2VzcyA9IHVybEhlbHBlci5nZXRQYXJhbSgnc3VjY2VzcycpO1xuICAgIHdhcm5pbmcgPSB1cmxIZWxwZXIuZ2V0UGFyYW0oJ3dhcm5pbmcnKTtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHRoaXMuYWRkTWVzc2FnZSh0aGlzLm1lc3NhZ2VzW2Vycm9yXSwgJ2Vycm9yJyk7XG4gICAgfVxuICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICB0aGlzLmFkZE1lc3NhZ2UodGhpcy5tZXNzYWdlc1tzdWNjZXNzXSwgJ3N1Y2Nlc3MnKTtcbiAgICB9XG4gICAgaWYgKHdhcm5pbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmFkZE1lc3NhZ2UodGhpcy5tZXNzYWdlc1t3YXJuaW5nXSwgJ3dhcm5pbmcnKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlckNhcHRjaGE6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBHb29nbGVSZWNhcHRjaGE7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnc2V0dGluZyBjYXB0Y2hhJyk7XG4gICAgKHRoaXMuJGNhcHRjaGEuaHRtbChcIlwiKSkuc2hvdygpO1xuICAgIEdvb2dsZVJlY2FwdGNoYSA9IG5ldyB0aGlzLnJlc291cmNlcy5leHRlcm5hbC5Hb29nbGVSZWNhcHRjaGE7XG4gICAgcmV0dXJuIEdvb2dsZVJlY2FwdGNoYS5vbkxvYWQoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChfdGhpcy5jYXB0Y2hhKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnJlc2V0Q2FwdGNoYSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5jYXB0Y2hhID0gZ3JlY2FwdGNoYS5yZW5kZXIoX3RoaXMuY2FwdGNoYUlkLCB7XG4gICAgICAgICAgICBzaXRla2V5OiB3aW5kb3cuY29uZmlnLnJlQ2FwdGNoYSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuY2FwdGNoYVN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgY2FwdGNoYVN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSxcbiAgcmVzZXRDYXB0Y2hhOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgR29vZ2xlUmVjYXB0Y2hhO1xuICAgIEdvb2dsZVJlY2FwdGNoYSA9IG5ldyB0aGlzLnJlc291cmNlcy5leHRlcm5hbC5Hb29nbGVSZWNhcHRjaGE7XG4gICAgcmV0dXJuIEdvb2dsZVJlY2FwdGNoYS5vbkxvYWQoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBncmVjYXB0Y2hhLnJlc2V0KF90aGlzLmNhcHRjaGEpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH0sXG4gIHNob3dFcnJvcjogZnVuY3Rpb24oJGVsLCBlcnJvcikge1xuICAgIHZhciAkcGFyZW50O1xuICAgICRwYXJlbnQgPSAkZWwucGFyZW50KCkucGFyZW50KCk7XG4gICAgJHBhcmVudC5hZGRDbGFzcygnc2hvdy1lcnJvcicpO1xuICAgIHJldHVybiAoJHBhcmVudC5maW5kKCdzbWFsbCcpKS5odG1sKGVycm9yKTtcbiAgfSxcbiAgcmVtb3ZlQWxsRXJyb3JzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKCQoJy5zaG93LWVycm9yJykpLnJlbW92ZUNsYXNzKCdzaG93LWVycm9yJyk7XG4gIH0sXG4gIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXNFbXB0eSwgaXNTbWFsbCwgc3RhdHVzO1xuICAgIHN0YXR1cyA9IHRydWU7XG4gICAgdGhpcy5yZW1vdmVBbGxFcnJvcnMoKTtcbiAgICBpc0VtcHR5ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgICByZXR1cm4gKHN0ciB8fCBcIlwiKS50cmltKCkubGVuZ3RoID09PSAwO1xuICAgIH07XG4gICAgaXNTbWFsbCA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIChzdHIgfHwgXCJcIikudHJpbSgpLmxlbmd0aCA8IDU7XG4gICAgfTtcbiAgICBpZiAoaXNFbXB0eSh0aGlzLiR1c2VybmFtZS52YWwoKSkpIHtcbiAgICAgIHRoaXMuc2hvd0Vycm9yKHRoaXMuJHVzZXJuYW1lLCAnUGxlYXNlIGdpdmUgYW4gZW1haWwnKTtcbiAgICAgIHN0YXR1cyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXNFbXB0eSh0aGlzLiRwYXNzd29yZC52YWwoKSkpIHtcbiAgICAgIHRoaXMuc2hvd0Vycm9yKHRoaXMuJHBhc3N3b3JkLCAnUGxlYXNlIGdpdmUgYSBwYXNzd29yZCcpO1xuICAgICAgc3RhdHVzID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChpc1NtYWxsKHRoaXMuJHBhc3N3b3JkLnZhbCgpKSkge1xuICAgICAgdGhpcy5zaG93RXJyb3IodGhpcy4kcGFzc3dvcmQsICdQYXNzd29yZCBzaG91bGQgaGF2ZSBtaW4uIDUgY2hhcmFjdGVycycpO1xuICAgICAgc3RhdHVzID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnNvbGUuZGVidWcodGhpcy5uYW1lLCAnZm9ybSB2YWxpZGF0aW9uIHN0YXR1czonLCBzdGF0dXMpO1xuICAgIHJldHVybiBzdGF0dXM7XG4gIH0sXG4gIGFkZE1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UsIHR5cGUpIHtcbiAgICB2YXIgJGVsO1xuICAgIGlmICh0eXBlID09IG51bGwpIHtcbiAgICAgIHR5cGUgPSAnZXJyb3InO1xuICAgIH1cbiAgICAkZWwgPSAkKFwiPGxpPiBcIiArIG1lc3NhZ2UgKyBcIiA8L2xpPlwiKTtcbiAgICAkZWwuaGlkZSgpO1xuICAgICRlbC5hZGRDbGFzcyh0eXBlKTtcbiAgICB0aGlzLiRtZXNzYWdlcy5hcHBlbmQoJGVsKTtcbiAgICByZXR1cm4gJGVsLnNob3coKTtcbiAgfSxcbiAgcmVtb3ZlTWVzc2FnZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiRtZXNzYWdlcy5odG1sKFwiXCIpO1xuICB9LFxuICBzaG93TG9hZGluZzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kc3Bpbm5lci5zaG93KCk7XG4gICAgcmV0dXJuIHRoaXMuJHN1Ym1pdC5oaWRlKCk7XG4gIH0sXG4gIGhpZGVMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRzcGlubmVyLnN0b3AoKS5oaWRlKCk7XG4gICAgcmV0dXJuIHRoaXMuJHN1Ym1pdC5zdG9wKCkuc2hvdygpO1xuICB9LFxuICBzdWJtaXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnc3VibWl0dGluZyBmb3JtJyk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnJlbW92ZU1lc3NhZ2VzKCk7XG4gICAgdGhpcy5zaG93TG9hZGluZygpO1xuICAgIGlmICghdGhpcy52YWxpZGF0ZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5oaWRlTG9hZGluZygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMuY3VycmVudFVzZXIubG9naW4odGhpcy4kdXNlcm5hbWUudmFsKCksIHRoaXMuJHBhc3N3b3JkLnZhbCgpLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihlcnJvciwgcmVzcG9uc2UpIHtcbiAgICAgICAgdmFyIHJlYXNvbjtcbiAgICAgICAgX3RoaXMuaGlkZUxvYWRpbmcoKTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgc3dpdGNoIChlcnJvci5yZXNwb25zZUpTT04uc3RhdHVzKSB7XG4gICAgICAgICAgICBjYXNlICd1c2VyIG5vdCBhY3RpdmF0ZWQnOlxuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRkTWVzc2FnZShfdGhpcy5tZXNzYWdlc1snbG9naW5faW5hY3RpdmUnXSwgJ3dhcm5pbmcnKTtcbiAgICAgICAgICAgIGNhc2UgJ2ludmFsaWQgdXNlcm5hbWUvcGFzc3dvcmQnOlxuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRkTWVzc2FnZShfdGhpcy5tZXNzYWdlc1snYmFkX2ZpZWxkcyddKTtcbiAgICAgICAgICAgIGNhc2UgJ3RvbyBtYW55IGZhaWxlZCBhdHRlbXB0cyc6XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5hZGRNZXNzYWdlKF90aGlzLm1lc3NhZ2VzWydsb2dpbl9kaXNhYmxlZCddKTtcbiAgICAgICAgICAgIGNhc2UgJ3VzZXIgbm90IGZvdW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ2ludmFsaWQgcGFzc3dvcmQnOlxuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRkTWVzc2FnZShfdGhpcy5tZXNzYWdlc1snbG9naW5faW5jb3JyZWN0J10pO1xuICAgICAgICAgICAgY2FzZSAnc3VzcGVuZGVkJzpcbiAgICAgICAgICAgICAgX3RoaXMuYWRkTWVzc2FnZShfdGhpcy5tZXNzYWdlc1sndXNlcl9zdXNwZW5kZWQnXSk7XG4gICAgICAgICAgICAgIHJlYXNvbiA9IGVycm9yLnJlc3BvbnNlSlNPTi5yZWFzb247XG4gICAgICAgICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRkTWVzc2FnZShcIlJlYXNvbjogXCIgKyByZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYmFubmVkJzpcbiAgICAgICAgICAgICAgX3RoaXMuYWRkTWVzc2FnZShfdGhpcy5tZXNzYWdlc1sndXNlcl9iYW5uZWQnXSk7XG4gICAgICAgICAgICAgIHJlYXNvbiA9IGVycm9yLnJlc3BvbnNlSlNPTi5yZWFzb247XG4gICAgICAgICAgICAgIGlmIChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuYWRkTWVzc2FnZShcIlJlYXNvbjogXCIgKyByZWFzb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLmFkZE1lc3NhZ2UoZXJyb3IucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZyhfdGhpcy5uYW1lLCAncmVjZWl2ZWQgdXNlcicsIHJlc3BvbnNlKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucmVzb3VyY2VzLnJvdXRlci5yZWRpcmVjdChfdGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UudXJsU2x1ZyArIFwiL2FjY291bnRcIik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiBcIlt2aWV3OmF1dGgtbG9nb3V0XVwiLFxuICBjaGVja1JlZGlyZWN0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlc291cmNlcy5jdXJyZW50VXNlci5sb2dvdXQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgcmVkaXJlY3RVcmw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5sYW5ndWFnZS51cmxTbHVnICsgXCIvYXV0aC9sb2dpbj9zdWNjZXNzPWxvZ291dFwiO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKHJlcXVpcmUoXCIuL2xvZ2luXCIpKS5leHRlbmQoe1xuICBuYW1lOiBcIlt2aWV3OmF1dGgtc2lnbnVwXVwiLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2F1dGgvc2lnbnVwJ10sXG4gIHRpdGxlOiBcIlNpZ251cFwiLFxuICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tb2RlbCA9IHRoaXMucmVzb3VyY2VzLmN1cnJlbnRVc2VyO1xuICAgIHRoaXMuJGZvcm0gPSB0aGlzLiQoXCIjbG9naW4tZm9ybVwiKTtcbiAgICB0aGlzLiRsaW5rcyA9IHRoaXMuJChcIi5leHRyYS1saW5rc1wiKTtcbiAgICB0aGlzLiRtZXNzYWdlcyA9IHRoaXMuJChcIiNhdXRoLW1lc3NhZ2VzXCIpO1xuICAgIHRoaXMuJGZ1bGxuYW1lID0gdGhpcy4kKFwiI2F1dGgtZnVsbG5hbWVcIik7XG4gICAgdGhpcy4kcGFzc3dvcmQgPSB0aGlzLiQoXCIjYXV0aC1wYXNzd29yZFwiKTtcbiAgICB0aGlzLiRyZXBhc3N3b3JkID0gdGhpcy4kKFwiI2F1dGgtcmVwYXNzd29yZFwiKTtcbiAgICB0aGlzLiRzcGlubmVyID0gdGhpcy4kKFwiI2FqYXgtc3Bpbm5lclwiKTtcbiAgICB0aGlzLiRzdWJtaXQgPSB0aGlzLiQoXCIjc3VibWl0LWRpdlwiKTtcbiAgICB0aGlzLiR1c2VybmFtZSA9IHRoaXMuJChcIiNhdXRoLXVzZXJuYW1lXCIpO1xuICAgIHJldHVybiB0aGlzLnNldHVwQ2FwdGNoYSgpO1xuICB9LFxuICBcImNvbnRpbnVlXCI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJGNhcHRjaGEucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICB0aGlzLiRzdWJtaXQuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICB0aGlzLnJlbmRlckNhcHRjaGEoKTtcbiAgICByZXR1cm4gdGhpcy5wYXJzZVVSTCgpO1xuICB9LFxuICBjYXB0Y2hhU3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICB0aGlzLiRzdWJtaXQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICB0aGlzLiRjYXB0Y2hhLmFkZENsYXNzKCdoaWRlJyk7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ2NhcHRjaGEgc3VjY2VzcycpO1xuICB9LFxuICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlzRW1wdHksIGlzU21hbGwsIHN0YXR1cztcbiAgICBzdGF0dXMgPSB0cnVlO1xuICAgIHRoaXMucmVtb3ZlQWxsRXJyb3JzKCk7XG4gICAgaXNFbXB0eSA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIChzdHIgfHwgXCJcIikudHJpbSgpLmxlbmd0aCA9PT0gMDtcbiAgICB9O1xuICAgIGlzU21hbGwgPSBmdW5jdGlvbihzdHIpIHtcbiAgICAgIHJldHVybiAoc3RyIHx8IFwiXCIpLnRyaW0oKS5sZW5ndGggPCA1O1xuICAgIH07XG4gICAgaWYgKGlzRW1wdHkodGhpcy4kZnVsbG5hbWUudmFsKCkpKSB7XG4gICAgICB0aGlzLnNob3dFcnJvcih0aGlzLiRmdWxsbmFtZSwgJ1BsZWFzZSBnaXZlIHlvdXIgZnVsbCBuYW1lJyk7XG4gICAgICBzdGF0dXMgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGlzRW1wdHkodGhpcy4kdXNlcm5hbWUudmFsKCkpKSB7XG4gICAgICB0aGlzLnNob3dFcnJvcih0aGlzLiR1c2VybmFtZSwgJ1BsZWFzZSBnaXZlIGFuIGVtYWlsJyk7XG4gICAgICBzdGF0dXMgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGlzRW1wdHkodGhpcy4kcGFzc3dvcmQudmFsKCkpKSB7XG4gICAgICB0aGlzLnNob3dFcnJvcih0aGlzLiRwYXNzd29yZCwgJ1BsZWFzZSBnaXZlIGEgcGFzc3dvcmQnKTtcbiAgICAgIHN0YXR1cyA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoaXNTbWFsbCh0aGlzLiRwYXNzd29yZC52YWwoKSkpIHtcbiAgICAgIHRoaXMuc2hvd0Vycm9yKHRoaXMuJHBhc3N3b3JkLCAnUGFzc3dvcmQgc2hvdWxkIGJlIG1pbi4gNSBsZXR0ZXJzJyk7XG4gICAgICBzdGF0dXMgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGlzRW1wdHkodGhpcy4kcmVwYXNzd29yZC52YWwoKSkpIHtcbiAgICAgIHRoaXMuc2hvd0Vycm9yKHRoaXMuJHJlcGFzc3dvcmQsICdQbGVhc2UgcmUtZW50ZXIgeW91ciBwYXNzd29yZCcpO1xuICAgICAgc3RhdHVzID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh0aGlzLiRwYXNzd29yZC52YWwoKSAhPT0gdGhpcy4kcmVwYXNzd29yZC52YWwoKSkge1xuICAgICAgdGhpcy5zaG93RXJyb3IodGhpcy4kcmVwYXNzd29yZCwgJ1Bhc3N3b3JkcyBkb25cXCd0IG1hdGNoJyk7XG4gICAgICBzdGF0dXMgPSBmYWxzZTtcbiAgICB9XG4gICAgY29uc29sZS5kZWJ1Zyh0aGlzLm5hbWUsICdmb3JtIHZhbGlkYXRpb24gc3RhdHVzOicsIHN0YXR1cyk7XG4gICAgcmV0dXJuIHN0YXR1cztcbiAgfSxcbiAgc3VibWl0OiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBmaWVsZHM7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnc3VibWl0dGluZyBmb3JtJyk7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnJlbW92ZU1lc3NhZ2VzKCk7XG4gICAgdGhpcy5zaG93TG9hZGluZygpO1xuICAgIGlmICghdGhpcy52YWxpZGF0ZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5oaWRlTG9hZGluZygpO1xuICAgIH1cbiAgICBmaWVsZHMgPSB7XG4gICAgICB1c2VybmFtZTogdGhpcy4kdXNlcm5hbWUudmFsKCksXG4gICAgICBwYXNzd29yZDogdGhpcy4kcGFzc3dvcmQudmFsKCksXG4gICAgICByZXBhc3N3b3JkOiB0aGlzLiRyZXBhc3N3b3JkLnZhbCgpLFxuICAgICAgZnVsbG5hbWU6IHRoaXMuJGZ1bGxuYW1lLnZhbCgpXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMuY3VycmVudFVzZXIuc2lnbnVwKGZpZWxkcywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXJyb3IsIHJlc3BvbnNlKSB7XG4gICAgICAgIF90aGlzLmhpZGVMb2FkaW5nKCk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHN3aXRjaCAoZXJyb3IucmVzcG9uc2VKU09OLnN0YXR1cykge1xuICAgICAgICAgICAgY2FzZSAnaW52YWxpZCBlbWFpbC9uYW1lJzpcbiAgICAgICAgICAgICAgX3RoaXMuYWRkTWVzc2FnZShfdGhpcy5tZXNzYWdlc1snYmFkX2ZpZWxkcyddKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1c2VyIGFscmVhZHkgZXhpc3RzJzpcbiAgICAgICAgICAgICAgX3RoaXMuYWRkTWVzc2FnZShfdGhpcy5tZXNzYWdlc1snc2lnbnVwX3VzZXJleGlzdHMnXSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgX3RoaXMuYWRkTWVzc2FnZShlcnJvci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBfdGhpcy4kY2FwdGNoYS5yZW1vdmVDbGFzcygnaGlkZScpO1xuICAgICAgICAgIF90aGlzLiRzdWJtaXQuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucmVzZXRDYXB0Y2hhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZyhfdGhpcy5uYW1lLCAnY3JlYXRlZCB1c2VyJywgcmVzcG9uc2UpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5yZXNvdXJjZXMucm91dGVyLnJlZGlyZWN0KF90aGlzLnJlc291cmNlcy5sYW5ndWFnZS51cmxTbHVnICsgXCIvYXV0aC9sb2dpbj9zdWNjZXNzPXNpZ251cF9zdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChyZXF1aXJlKCcuL3Bvc3QnKSkuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3OmNsYXNzaWZpZWQtZWRpdF0nLFxuICB0ZW1wbGF0ZU9wdGlvbnM6IHtcbiAgICBpc0d1ZXN0OiBmYWxzZSxcbiAgICBoYXNDbGFzc2lmaWVkOiB0cnVlXG4gIH0sXG4gIGdldE1vZGVsOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIHZhciBhdXRoSGFzaCwgaWQsIHVybEhlbHBlcjtcbiAgICBpZCA9IHRoaXMucmVzb3VyY2VzLmhpc3RvcnlTdGF0ZS5wYXJhbWV0ZXJzO1xuICAgIHVybEhlbHBlciA9IHRoaXMucmVzb3VyY2VzLkhlbHBlcnMudXJsO1xuICAgIGlmICh0aGlzLm1vZGVsID09IG51bGwpIHtcbiAgICAgIHRoaXMubW9kZWwgPSBuZXcgdGhpcy5yZXNvdXJjZXMuTW9kZWxzLmNsYXNzaWZpZWQoe1xuICAgICAgICBfaWQ6IGlkXG4gICAgICB9KTtcbiAgICB9XG4gICAgYXV0aEhhc2ggPSB1cmxIZWxwZXIuZ2V0UGFyYW0oJ2F1dGhIYXNoJyk7XG4gICAgdGhpcy5tb2RlbC5zZXQoJ2F1dGhIYXNoJywgYXV0aEhhc2gpO1xuICAgIHJldHVybiB0aGlzLm1vZGVsLmZldGNoKHtcbiAgICAgIHN1Y2Nlc3M6IGNhbGxiYWNrXG4gICAgfSk7XG4gIH0sXG4gIG9uQUpBWGZpbmlzaDogZnVuY3Rpb24oZXJyb3IsIGNsYXNzaWZpZWQpIHtcbiAgICB2YXIgdXJsO1xuICAgIGlmIChjbGFzc2lmaWVkID09IG51bGwpIHtcbiAgICAgIGNsYXNzaWZpZWQgPSB7fTtcbiAgICB9XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB0aGlzLiRzcGlubmVyLmhpZGUoKTtcbiAgICAgIHRoaXMudmlld3NbXCIjcGFnZS1zdWJtaXRcIl0udHJpZ2dlcignY29udGludWUnKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlFcnJvcihlcnJvcik7XG4gICAgfVxuICAgIGlmICghdGhpcy50ZW1wbGF0ZU9wdGlvbnMuaXNHdWVzdCkge1xuICAgICAgdXJsID0gXCJjbGFzc2lmaWVkL1wiICsgY2xhc3NpZmllZC5faWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IFwiZ3Vlc3QvXCIgKyBjbGFzc2lmaWVkLl9pZCArIFwiP2F1dGhIYXNoPVwiICsgY2xhc3NpZmllZC5hdXRoSGFzaDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJvdXRlci5yZWRpcmVjdCh0aGlzLnJlc291cmNlcy5sYW5ndWFnZS51cmxTbHVnICsgXCIvXCIgKyB1cmwpO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiAnW3ZpZXc6Y2xhc3NpZmllZHMtZmluaXNoXScsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnY2xhc3NpZmllZC9maW5pc2gnXSxcbiAgdGVtcGxhdGVPcHRpb25zOiB7XG4gICAgaXNHdWVzdDogZmFsc2VcbiAgfSxcbiAgdGl0bGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIkNsYXNzaWZpZWQgc3VibWl0dGVkIVwiO1xuICB9LFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgI3Byb21vdGVMaW5rJzogJ3Byb21vdGVIYW5kbGUnXG4gIH0sXG4gIHBheXdpdGhhdHdlZXRVUkw6ICdodHRwOi8vd3d3LnBheXdpdGhhdHdlZXQuY29tL3BheT9pZD04MzljODliYS1mZWM5LTRiMzEtOGYwYS0yOTA0M2NlZTI3YjYnLFxuICBzdGFydDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb29raWVIZWxwZXI7XG4gICAgdGhpcy4kdGFiUGF5bWVudCA9IHRoaXMuJCgnI3RhYi1wYXltZW50Jyk7XG4gICAgdGhpcy4kcGF5bWVudEVycm9ycyA9IHRoaXMuJCgnI3BheW1lbnQtZXJyb3JzJyk7XG4gICAgdGhpcy4kbW9kYWwgPSB0aGlzLiQoJyNtb2RhbC1wdXJjaGFzZScpO1xuICAgIHRoaXMuJGF1dGhMaW5rID0gdGhpcy4kKFwiI2F1dGhMaW5rXCIpO1xuICAgIHRoaXMuJGZpbmlzaExpbmsgPSB0aGlzLiQoXCIjZmluaXNoTGlua1wiKTtcbiAgICB0aGlzLiRmYWNlYm9vayA9IHRoaXMuJChcIi5zb2NpYWwuZmFjZWJvb2tcIik7XG4gICAgdGhpcy4kdHdpdHRlciA9IHRoaXMuJChcIi5zb2NpYWwudHdpdHRlclwiKTtcbiAgICB0aGlzLiRncGx1cyA9IHRoaXMuJChcIi5zb2NpYWwuZ3BsdXNcIik7XG4gICAgdGhpcy4kc2hhcmVkTWVzc2FnZSA9IHRoaXMuJChcIiNzaGFyZWQtbWVzc2FnZVwiKTtcbiAgICB0aGlzLiR1bnNoYXJlZE1lc3NhZ2UgPSB0aGlzLiQoXCIjdW5zaGFyZWQtbWVzc2FnZVwiKTtcbiAgICBjb29raWVIZWxwZXIgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLmNvb2tpZTtcbiAgICBjb29raWVIZWxwZXIuZXJhc2VDb29raWUoJ3BheS13LXR3ZWV0Jyk7XG4gICAgY29va2llSGVscGVyLmVyYXNlQ29va2llKCdhdXRoSGFzaCcpO1xuICAgIGlmICgod2luZG93LmxvY2F0aW9uLmhhc2guaW5kZXhPZihcInNoYXJlZFwiKSkgIT09IC0xKSB7XG4gICAgICB0aGlzLiRzaGFyZWRNZXNzYWdlLnNob3coKTtcbiAgICAgIHJldHVybiB0aGlzLiR1bnNoYXJlZE1lc3NhZ2UuaGlkZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiRzaGFyZWRNZXNzYWdlLmhpZGUoKTtcbiAgICAgIHJldHVybiB0aGlzLiR1bnNoYXJlZE1lc3NhZ2Uuc2hvdygpO1xuICAgIH1cbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZW5lcmF0ZVNvY2lhbExpbmtzKCk7XG4gIH0sXG4gIGdlbmVyYXRlU29jaWFsTGlua3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBVUkwsIGZhY2Vib29rLCBncGx1cywgaWQsIGxvY2FsVVJMLCB0d2VldCwgdHdpdHRlcjtcbiAgICBpZCA9IHRoaXMucmVzb3VyY2VzLmhpc3RvcnlTdGF0ZS5wYXJhbWV0ZXJzO1xuICAgIFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9jbGFzc2lmaWVkL1wiICsgaWQ7XG4gICAgbG9jYWxVUkwgPSBcIi9jbGFzc2lmaWVkL1wiICsgaWQ7XG4gICAgdHdlZXQgPSBcIkNoZWNrIG91dCBteSBjbGFzc2lmaWVkIGF0IFwiICsgVVJMO1xuICAgIGZhY2Vib29rID0gXCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT1cIiArIFVSTDtcbiAgICB0d2l0dGVyID0gXCJodHRwczovL3R3aXR0ZXIuY29tL2hvbWU/c3RhdHVzPVwiICsgKGVuY29kZVVSSSh0d2VldCkpO1xuICAgIGdwbHVzID0gXCJodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZT91cmw9XCIgKyBVUkw7XG4gICAgdGhpcy4kYXV0aExpbmsuaHRtbChsb2NhbFVSTCk7XG4gICAgdGhpcy4kYXV0aExpbmsuYXR0cignaHJlZicsIGxvY2FsVVJMKTtcbiAgICB0aGlzLiRmaW5pc2hMaW5rLmF0dHIoJ2hyZWYnLCBsb2NhbFVSTCk7XG4gICAgdGhpcy4kZmFjZWJvb2suYXR0cignaHJlZicsIGZhY2Vib29rKTtcbiAgICB0aGlzLiR0d2l0dGVyLmF0dHIoJ2hyZWYnLCB0d2l0dGVyKTtcbiAgICByZXR1cm4gdGhpcy4kZ3BsdXMuYXR0cignaHJlZicsIGdwbHVzKTtcbiAgfSxcbiAgcHJvbW90ZUhhbmRsZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvb2tpZUhlbHBlcjtcbiAgICBjb29raWVIZWxwZXIgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLmNvb2tpZTtcbiAgICBjb29raWVIZWxwZXIuY3JlYXRlQ29va2llKCdwYXktdy10d2VldCcsIHRoaXMucmVzb3VyY2VzLmhpc3RvcnlTdGF0ZS5wYXJhbWV0ZXJzKTtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdGhpcy5wYXl3aXRoYXR3ZWV0VVJMO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiAnW3ZpZXc6Y2xhc3NpZmllZC1wb3N0XScsXG4gIHRpdGxlOiBcIlBvc3QgYSBjbGFzc2lmaWVkXCIsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnY2xhc3NpZmllZC9wb3N0J10sXG4gIHRlbXBsYXRlT3B0aW9uczoge1xuICAgIGlzR3Vlc3Q6IGZhbHNlLFxuICAgIGhhc0NsYXNzaWZpZWQ6IGZhbHNlXG4gIH0sXG4gIHN1YlZpZXdzOiB7XG4gICAgXCIjcGFnZS1iZWdpblwiOiByZXF1aXJlKCcuL3BhcnQuYmVnaW4nKSxcbiAgICBcIiNwYWdlLWRldGFpbHNcIjogcmVxdWlyZSgnLi9wYXJ0LmRldGFpbHMnKSxcbiAgICBcIiNwYWdlLWltYWdlc1wiOiByZXF1aXJlKCcuL3BhcnQuaW1hZ2VzJyksXG4gICAgXCIjcGFnZS1pbmZvXCI6IHJlcXVpcmUoJy4vcGFydC5pbmZvJyksXG4gICAgXCIjcGFnZS1tYXBzXCI6IHJlcXVpcmUoJy4vcGFydC5tYXBzJyksXG4gICAgXCIjcGFnZS1zdWJtaXRcIjogcmVxdWlyZSgnLi9wYXJ0LnN1Ym1pdCcpXG4gIH0sXG4gIGV2ZW50czoge1xuICAgICdjbGljayAuc3VibWl0JzogJ3N1Ym1pdEhhbmRsZSdcbiAgfSxcbiAgc3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIGNvbnNvbGUuZGVidWcodGhpcy5uYW1lLCAnaW5pdGlhbGl6aW5nJywgdGhpcy5vcHRpb25zKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnJlc291cmNlcyk7XG4gICAgdGhpcy52aWV3cyA9IHt9O1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRWaWV3ID0gbnVsbDtcbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRNb2RlbCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhyZWYsIHN1YlZpZXcsIHZpZXc7XG4gICAgICAgIGNvbnNvbGUubG9nKF90aGlzLm5hbWUsICdyZW5kZXJpbmcnLCBfdGhpcy5lbCk7XG4gICAgICAgIGZvciAoaHJlZiBpbiBfdGhpcy5zdWJWaWV3cykge1xuICAgICAgICAgIHN1YlZpZXcgPSBfdGhpcy5zdWJWaWV3c1tocmVmXTtcbiAgICAgICAgICB2aWV3ID0gbmV3IHN1YlZpZXcoe1xuICAgICAgICAgICAgZWw6IF90aGlzLiQoaHJlZilcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB2aWV3LnRlbXBsYXRlT3B0aW9ucyA9IF90aGlzLnRlbXBsYXRlT3B0aW9ucztcbiAgICAgICAgICB2aWV3Lm1vZGVsID0gX3RoaXMubW9kZWw7XG4gICAgICAgICAgdmlldy50cmlnZ2VyKCdzdGFydCcpO1xuICAgICAgICAgIHZpZXcudHJpZ2dlcignY29udGludWUnKTtcbiAgICAgICAgICBfdGhpcy52aWV3c1tocmVmXSA9IHZpZXc7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuJHN1Ym1pdCA9IF90aGlzLiQoJy5zdWJtaXQnKTtcbiAgICAgICAgX3RoaXMuJHNwaW5uZXIgPSBfdGhpcy4kKFwiI2FqYXgtc3Bpbm5lclwiKTtcbiAgICAgICAgX3RoaXMuJGVycm9yTWVzc2FnZXMgPSBfdGhpcy4kKCd1bC5lcnJvci1tZXNzYWdlJyk7XG4gICAgICAgIHJldHVybiBfdGhpcy5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH0sXG4gIGNoZWNrUmVkaXJlY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0d1ZXN0ICYmIHRoaXMucmVzb3VyY2VzLmN1cnJlbnRVc2VyLmlzQW5vbnltb3VzKCk7XG4gIH0sXG4gIHJlZGlyZWN0VXJsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UudXJsU2x1ZyArIFwiL2F1dGgvbG9naW4/ZXJyb3I9bmVlZF9sb2dpblwiO1xuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICh0aGlzLiQoJyNnLXJlY2FwdGNoYS1yZXNwb25zZScpKS5yZW1vdmUoKTtcbiAgfSxcbiAgZ2V0TW9kZWw6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMubW9kZWwgPT0gbnVsbCkge1xuICAgICAgdGhpcy5tb2RlbCA9IG5ldyB0aGlzLnJlc291cmNlcy5Nb2RlbHMuY2xhc3NpZmllZDtcbiAgICB9XG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH0sXG4gIHJlbW92ZUFsbE1lc3NhZ2VzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kZXJyb3JNZXNzYWdlcy5oaWRlKCkuaHRtbCgnJyk7XG4gIH0sXG4gIGRpc3BsYXlFcnJvcjogZnVuY3Rpb24obWVzc2FnZSkge1xuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIHJldHVybiB0aGlzLiRlcnJvck1lc3NhZ2VzLnNob3coKS5hcHBlbmQoXCI8bGk+XCIgKyBtZXNzYWdlICsgXCI8L2xpPlwiKTtcbiAgfSxcbiAgc3VibWl0SGFuZGxlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpc1ZpZXdWYWxpZCwgdmFsaWRhdGVkLCB2aWV3O1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3N1Ym1pdHRpbmcgZm9ybScsIGV2ZW50KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMucmVtb3ZlQWxsTWVzc2FnZXMoKTtcbiAgICB2YWxpZGF0ZWQgPSB0cnVlO1xuICAgIGZvciAodmlldyBpbiB0aGlzLnZpZXdzKSB7XG4gICAgICBpZiAodGhpcy52aWV3c1t2aWV3XS52YWxpZGF0ZSAhPSBudWxsKSB7XG4gICAgICAgIGlzVmlld1ZhbGlkID0gdGhpcy52aWV3c1t2aWV3XS52YWxpZGF0ZSgpO1xuICAgICAgICB2YWxpZGF0ZWQgPSBpc1ZpZXdWYWxpZCAmJiB2YWxpZGF0ZWQ7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3ZhbGlkYXRpbmcgZm9ybScsIHZhbGlkYXRlZCk7XG4gICAgaWYgKCF2YWxpZGF0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlFcnJvcignU29tZSBmaWVsZHMgaGF2ZSBpbnZhbGlkIHZhbHVlcywgcGxlYXNlIGdvIGJhY2sgYW5kIGZpbGwgdGhlbSBwcm9wZXJseScpO1xuICAgIH1cbiAgICBmb3IgKHZpZXcgaW4gdGhpcy52aWV3cykge1xuICAgICAgaWYgKHRoaXMudmlld3Nbdmlld10uc2V0TW9kZWwgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLnZpZXdzW3ZpZXddLnNldE1vZGVsKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuJHN1Ym1pdC5oaWRlKCk7XG4gICAgdGhpcy4kc3Bpbm5lci5zaG93KCk7XG4gICAgcmV0dXJuIHRoaXMubW9kZWwudXBsb2FkU2VydmVyKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCBjbGFzc2lmaWVkKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5vbkFKQVhmaW5pc2goZXJyb3IsIGNsYXNzaWZpZWQpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gIH0sXG4gIG9uQUpBWGZpbmlzaDogZnVuY3Rpb24oZXJyb3IsIGNsYXNzaWZpZWQpIHtcbiAgICB2YXIgdXJsO1xuICAgIGlmIChjbGFzc2lmaWVkID09IG51bGwpIHtcbiAgICAgIGNsYXNzaWZpZWQgPSB7fTtcbiAgICB9XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB0aGlzLiRzcGlubmVyLmhpZGUoKTtcbiAgICAgIHRoaXMudmlld3NbXCIjcGFnZS1zdWJtaXRcIl0udHJpZ2dlcignY29udGludWUnKTtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BsYXlFcnJvcihlcnJvcik7XG4gICAgfVxuICAgIGlmICghY2xhc3NpZmllZC5ndWVzdCkge1xuICAgICAgdXJsID0gXCJjbGFzc2lmaWVkL1wiICsgY2xhc3NpZmllZC5faWQgKyBcIi9maW5pc2hcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gXCJndWVzdC9cIiArIGNsYXNzaWZpZWQuX2lkICsgXCIvZmluaXNoP2F1dGhIYXNoPVwiICsgY2xhc3NpZmllZC5hdXRoSGFzaDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VzLnJvdXRlci5yZWRpcmVjdCh0aGlzLnJlc291cmNlcy5sYW5ndWFnZS51cmxTbHVnICsgXCIvXCIgKyB1cmwpO1xuICB9LFxuICBmaW5pc2g6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWV3O1xuICAgIGZvciAodmlldyBpbiB0aGlzLnZpZXdzKSB7XG4gICAgICB0aGlzLnZpZXdzW3ZpZXddLnRyaWdnZXIoXCJmaW5pc2hcIik7XG4gICAgICB0aGlzLnZpZXdzW3ZpZXddID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50VmlldyA9IG51bGw7XG4gICAgcmV0dXJuIHRoaXMudmlld3MgPSBudWxsO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiAnW3ZpZXc6Y2xhc3NpZmllZC1wb3N0OmJlZ2luXScsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnY2xhc3NpZmllZC9wb3N0L2JlZ2luJ11cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIG5hbWU6ICdbdmlldzpjbGFzc2lmaWVkLXBvc3Q6ZGV0YWlsc10nLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2NsYXNzaWZpZWQvcG9zdC9kZXRhaWxzJ10sXG4gIGV2ZW50czoge1xuICAgICdjaGFuZ2UgI2NhdC1zZWxlY3Rvcic6ICdwYXJlbnRDYXRlZ29yeUNoYW5nZScsXG4gICAgJ2NoYW5nZSAjY2hpbGRjYXQtc2VsZWN0b3InOiAnY2hpbGRDYXRlZ29yeUNoYW5nZScsXG4gICAgJ2NoYW5nZSAjbG9jYXRpb25zJzogJ2xvY2F0aW9uQ2hhbmdlJyxcbiAgICAnY2hhbmdlICNwcmljZS1zZWxlY3Rvcic6ICdwcmljZUNoYW5nZSdcbiAgfSxcbiAgc3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLiRhZGRyZXNzMSA9IHRoaXMuJCgnI2FkZHJlc3MxIGlucHV0Jyk7XG4gICAgdGhpcy4kYWRkcmVzczIgPSB0aGlzLiQoJyNhZGRyZXNzMiBpbnB1dCcpO1xuICAgIHRoaXMuJHBhcmVudENhdGVnb3J5ID0gdGhpcy4kKCcjY2F0LXNlbGVjdG9yJyk7XG4gICAgdGhpcy4kY2hpbGRDYXRlZ29yeSA9IHRoaXMuJCgnI2NoaWxkY2F0LXNlbGVjdG9yJyk7XG4gICAgdGhpcy4kZW1haWwgPSB0aGlzLiQoJyNlbWFpbCcpO1xuICAgIHRoaXMuJGxvY2F0aW9ucyA9IHRoaXMuJCgnI2xvY2F0aW9ucycpO1xuICAgIHRoaXMuJHBob25lID0gdGhpcy4kKCcjcGhvbmUnKTtcbiAgICB0aGlzLiRwcmljZUZpZWxkID0gdGhpcy4kKCcjcHJpY2UtZmllbGQnKTtcbiAgICB0aGlzLiRwcmljZVJvdyA9IHRoaXMuJCgnI3ByaWNlLXJvdycpO1xuICAgIHRoaXMuJHByaWNlU2VsZWN0b3IgPSB0aGlzLiQoJyNwcmljZS1zZWxlY3RvcicpO1xuICAgIHRoaXMuJHR5cGUgPSB0aGlzLiQoJyNjdHlwZScpO1xuICAgIHRoaXMuY2F0ZWdvcmllcyA9IHRoaXMucmVzb3VyY2VzLmNhdGVnb3JpZXMudG9KU09OKCk7XG4gICAgdGhpcy5sb2NhdGlvbnMgPSB0aGlzLnJlc291cmNlcy5sb2NhdGlvbnMudG9KU09OKCk7XG4gICAgdGhpcy5pbml0Q2F0ZWdvcmllcygpO1xuICAgIHJldHVybiB0aGlzLmluaXRMb2NhdGlvbnMoKTtcbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRET00oKTtcbiAgfSxcbiAgbG9jYXRpb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKCh0aGlzLiRsb2NhdGlvbnMudmFsKCkgIT0gbnVsbCkgJiYgdGhpcy4kbG9jYXRpb25zLnZhbCgpICE9PSBcIlwiKSB7XG4gICAgICAodGhpcy4kKCcjYWRkcmVzczEnKSkucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgcmV0dXJuICh0aGlzLiQoJyNhZGRyZXNzMicpKS5yZW1vdmVDbGFzcyhcImhpZGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzLiQoJyNhZGRyZXNzMScpKS5hZGRDbGFzcyhcImhpZGVcIik7XG4gICAgICByZXR1cm4gKHRoaXMuJCgnI2FkZHJlc3MyJykpLmFkZENsYXNzKFwiaGlkZVwiKTtcbiAgICB9XG4gIH0sXG4gIF92YWxpZGF0ZVByaWNlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBjdXN0b21QcmljZTtcbiAgICBpZiAoIXRoaXMuJHByaWNlU2VsZWN0b3IudmFsKCkpIHtcbiAgICAgIHRoaXMuJHByaWNlU2VsZWN0b3IucGFyZW50KCkuYWRkQ2xhc3MoJ3Nob3ctZXJyb3InKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5uYW1lLCAncHJpY2UgaGFzIG5vdCBiZWVuIHNldCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXN0b21QcmljZSA9IHRoaXMuJHByaWNlRmllbGQudmFsKCk7XG4gICAgICBpZiAodGhpcy4kcHJpY2VTZWxlY3Rvci52YWwoKSA9PT0gLTEgJiYgY3VzdG9tUHJpY2UgPiAwKSB7XG4gICAgICAgIHRoaXMuJHByaWNlRmllbGQucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ3Nob3ctZXJyb3InKTtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLm5hbWUsICdwcmljZSBpbnB1dCBmb3IgY3VzdG9tIHByaWNlIGhhcyBub3QgYmVlbiBzZXQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgX3ZhbGlkYXRlQ2F0ZWdvcmllczogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgY2hpbGRWYWwsIGNoaWxkcmVuLCBwYXJlbnRWYWw7XG4gICAgcGFyZW50VmFsID0gdGhpcy4kcGFyZW50Q2F0ZWdvcnkudmFsKCk7XG4gICAgY2hpbGRWYWwgPSB0aGlzLiRjaGlsZENhdGVnb3J5LnZhbCgpO1xuICAgIHRoaXMuJGNoaWxkQ2F0ZWdvcnkucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ3Nob3ctZXJyb3InKTtcbiAgICB0aGlzLiRwYXJlbnRDYXRlZ29yeS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnc2hvdy1lcnJvcicpO1xuICAgIGlmICghcGFyZW50VmFsKSB7XG4gICAgICB0aGlzLiRwYXJlbnRDYXRlZ29yeS5wYXJlbnQoKS5hZGRDbGFzcygnc2hvdy1lcnJvcicpO1xuICAgICAgY29uc29sZS5lcnJvcih0aGlzLm5hbWUsICdwYXJlbnQgY2F0ZWdvcnkgaGFzIG5vdCBiZWVuIHNldCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZHJlbiA9ICh0aGlzLnJlc291cmNlcy5jYXRlZ29yaWVzLmdldENoaWxkcmVuKHBhcmVudFZhbCkpIHx8IFtdO1xuICAgICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA+IDAgJiYgKChjaGlsZFZhbCA9PSBudWxsKSB8fCBjaGlsZFZhbC5sZW5ndGggPT09IDApKSB7XG4gICAgICAgIHRoaXMuJGNoaWxkQ2F0ZWdvcnkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ3Nob3ctZXJyb3InKTtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLm5hbWUsICdjaGlsZCBjYXRlZ29yeSBoYXMgbm90IGJlZW4gc2V0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIF92YWxpZGF0ZVR5cGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHR5cGU7XG4gICAgdHlwZSA9IHRoaXMuJHR5cGUudmFsKCk7XG4gICAgaWYgKCF0eXBlKSB7XG4gICAgICB0aGlzLiR0eXBlLnBhcmVudCgpLmFkZENsYXNzKCdzaG93LWVycm9yJyk7XG4gICAgICBjb25zb2xlLmVycm9yKHRoaXMubmFtZSwgJ3R5cGUgaGFzIG5vdCBiZWVuIHNldCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgX3ZhbGlkYXRlRW1haWw6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGVtYWlsO1xuICAgIGVtYWlsID0gdGhpcy4kZW1haWwudmFsKCk7XG4gICAgaWYgKCFlbWFpbCkge1xuICAgICAgdGhpcy4kZW1haWwucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ3Nob3ctZXJyb3InKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5uYW1lLCAnZW1haWwgaGFzIG5vdCBiZWVuIHNldCcpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpc1ZhbGlkO1xuICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgJ3ZhbGlkYXRpbmcnKTtcbiAgICBpc1ZhbGlkID0gdGhpcy5fdmFsaWRhdGVDYXRlZ29yaWVzKCk7XG4gICAgaXNWYWxpZCA9IHRoaXMuX3ZhbGlkYXRlUHJpY2UoKSAmJiBpc1ZhbGlkO1xuICAgIGlzVmFsaWQgPSB0aGlzLl92YWxpZGF0ZVR5cGUoKSAmJiBpc1ZhbGlkO1xuICAgIGlzVmFsaWQgPSB0aGlzLl92YWxpZGF0ZUVtYWlsKCkgJiYgaXNWYWxpZDtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgJ3ZhbGlkYXRpb246JywgaXNWYWxpZCk7XG4gICAgcmV0dXJuIGlzVmFsaWQ7XG4gIH0sXG4gIHByaWNlQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciB2YWw7XG4gICAgdmFsID0gKHRoaXMuJHByaWNlU2VsZWN0b3IuZmluZCgnOnNlbGVjdGVkJykpLnZhbCgpO1xuICAgIHN3aXRjaCAoTnVtYmVyKHZhbCkpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpcy4kcHJpY2VGaWVsZC52YWwoMCk7XG4gICAgICAgIHRoaXMuJHByaWNlUm93LmFkZENsYXNzKCdoaWRlJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzLiRwcmljZUZpZWxkLnZhbChudWxsKTtcbiAgICAgICAgdGhpcy4kcHJpY2VSb3cucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIC0xOlxuICAgICAgICB0aGlzLiRwcmljZUZpZWxkLnZhbCgtMSk7XG4gICAgICAgIHRoaXMuJHByaWNlUm93LmFkZENsYXNzKCdoaWRlJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl92YWxpZGF0ZVByaWNlKCk7XG4gIH0sXG4gIGNoaWxkQ2F0ZWdvcnlDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKCdhc2QnKTtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdGVDYXRlZ29yaWVzKCk7XG4gIH0sXG4gIHBhcmVudENhdGVnb3J5Q2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBhZGRDaGlsZENhdGVnb3J5LCBjaGlsZCwgY2hpbGRyZW4sIGksIGxlbiwgdmFsO1xuICAgIHZhbCA9IHRoaXMuJHBhcmVudENhdGVnb3J5LnZhbCgpO1xuICAgIGNoaWxkcmVuID0gdGhpcy5yZXNvdXJjZXMuY2F0ZWdvcmllcy5nZXRDaGlsZHJlbih2YWwpO1xuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAodGhpcy4kKCcjY2hpbGQtcm93JykpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICh0aGlzLiQoJyNjaGlsZC1yb3cnKSkuYWRkQ2xhc3MoJ2hpZGUnKTtcbiAgICB9XG4gICAgdGhpcy4kY2hpbGRDYXRlZ29yeS5odG1sKHRoaXMuZ2VuZXJhdGVPcHRpb24oJycsICdDaG9vc2UgYSBzdWItY2F0ZWdvcnknKSk7XG4gICAgYWRkQ2hpbGRDYXRlZ29yeSA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHZhciBodG1sO1xuICAgICAgICBodG1sID0gX3RoaXMuZ2VuZXJhdGVPcHRpb24oY2hpbGQuX2lkLCBjaGlsZC5uYW1lKTtcbiAgICAgICAgcmV0dXJuIF90aGlzLiRjaGlsZENhdGVnb3J5LmFwcGVuZChodG1sKTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNoaWxkID0gY2hpbGRyZW5baV07XG4gICAgICBhZGRDaGlsZENhdGVnb3J5KGNoaWxkKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRlQ2F0ZWdvcmllcygpO1xuICB9LFxuICBzZXRQcmljZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRoaXMuJHByaWNlU2VsZWN0b3IudmFsKCcnKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy4kcHJpY2VTZWxlY3Rvci52YWwoMCk7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiB0aGlzLiRwcmljZVNlbGVjdG9yLnZhbCgtMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuJHByaWNlU2VsZWN0b3IudmFsKDEpO1xuICAgICAgdGhpcy5wcmljZUNoYW5nZSgpO1xuICAgICAgcmV0dXJuIHRoaXMuJHByaWNlRmllbGQudmFsKHZhbHVlKTtcbiAgICB9XG4gIH0sXG4gIGdlbmVyYXRlT3B0aW9uOiBmdW5jdGlvbihpZCwgbmFtZSkge1xuICAgIHJldHVybiBcIjxvcHRpb24gdmFsdWU9J1wiICsgaWQgKyBcIic+XCIgKyBuYW1lICsgXCI8L29wdGlvbj5cIjtcbiAgfSxcbiAgaW5pdENhdGVnb3JpZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXRlZ29yeSwgaHRtbCwgaSwgbGVuLCByZWY7XG4gICAgKHRoaXMuJCgnI2NoaWxkLXJvdycpKS5hZGRDbGFzcygnaGlkZScpO1xuICAgIHJlZiA9IHRoaXMuY2F0ZWdvcmllcztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNhdGVnb3J5ID0gcmVmW2ldO1xuICAgICAgaHRtbCA9IHRoaXMuZ2VuZXJhdGVPcHRpb24oY2F0ZWdvcnkuX2lkLCBjYXRlZ29yeS5uYW1lKTtcbiAgICAgIHRoaXMuJHBhcmVudENhdGVnb3J5LmFwcGVuZChodG1sKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJHBhcmVudENhdGVnb3J5LnZhbCgnJyk7XG4gIH0sXG4gIGluaXRMb2NhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBodG1sLCBpLCBsZW4sIGxvY2F0aW9uLCByZWYsIHJlc3VsdHM7XG4gICAgcmVmID0gdGhpcy5sb2NhdGlvbnM7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbG9jYXRpb24gPSByZWZbaV07XG4gICAgICBodG1sID0gdGhpcy5nZW5lcmF0ZU9wdGlvbihsb2NhdGlvbi5faWQsIGxvY2F0aW9uLm5hbWUpO1xuICAgICAgcmVzdWx0cy5wdXNoKHRoaXMuJGxvY2F0aW9ucy5hcHBlbmQoaHRtbCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfSxcbiAgc2V0TW9kZWw6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjaGVja2FuZHNldCwgY29udGFjdCwgbG9jYXRpb247XG4gICAgbG9jYXRpb24gPSB0aGlzLiRsb2NhdGlvbnMudmFsKCk7XG4gICAgaWYgKGxvY2F0aW9uID09PSBcIlwiKSB7XG4gICAgICBsb2NhdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgIGNhdGVnb3J5OiB0aGlzLiRwYXJlbnRDYXRlZ29yeS52YWwoKSxcbiAgICAgIGNoaWxkQ2F0ZWdvcnk6IHRoaXMuJGNoaWxkQ2F0ZWdvcnkudmFsKCksXG4gICAgICBwcmljZTogdGhpcy4kcHJpY2VGaWVsZC52YWwoKSxcbiAgICAgIHR5cGU6IHRoaXMuJHR5cGUudmFsKCksXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb25cbiAgICB9KTtcbiAgICBjb250YWN0ID0ge307XG4gICAgY2hlY2thbmRzZXQgPSBmdW5jdGlvbigkZWwsIGZpZWxkKSB7XG4gICAgICB2YXIgdmFsdWU7XG4gICAgICB2YWx1ZSA9ICRlbC52YWwoKTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY29udGFjdFtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNoZWNrYW5kc2V0KHRoaXMuJHBob25lLCAncGhvbmUnKTtcbiAgICBjaGVja2FuZHNldCh0aGlzLiRhZGRyZXNzMSwgJ2FkZHJlc3MxJyk7XG4gICAgY2hlY2thbmRzZXQodGhpcy4kYWRkcmVzczIsICdhZGRyZXNzMicpO1xuICAgIGNoZWNrYW5kc2V0KHRoaXMuJGVtYWlsLCAnZW1haWwnKTtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgY29udGFjdDogY29udGFjdFxuICAgIH0pO1xuICB9LFxuICBzZXRET006IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtb2RlbDtcbiAgICBtb2RlbCA9IHRoaXMubW9kZWwudG9KU09OKCk7XG4gICAgaWYgKCFtb2RlbC5faWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy4kYWRkcmVzczEudmFsKG1vZGVsLmNvbnRhY3QuYWRkcmVzczEpO1xuICAgIHRoaXMuJGFkZHJlc3MyLnZhbChtb2RlbC5jb250YWN0LmFkZHJlc3MyKTtcbiAgICB0aGlzLiRlbWFpbC52YWwobW9kZWwuY29udGFjdC5lbWFpbCk7XG4gICAgdGhpcy4kbG9jYXRpb25zLnZhbChtb2RlbC5sb2NhdGlvbiB8fCBcIlwiKTtcbiAgICB0aGlzLiRwaG9uZS52YWwobW9kZWwuY29udGFjdC5waG9uZSk7XG4gICAgdGhpcy4kdHlwZS52YWwobW9kZWwudHlwZSk7XG4gICAgdGhpcy5zZXRQcmljZShtb2RlbC5wcmljZSk7XG4gICAgdGhpcy4kcGFyZW50Q2F0ZWdvcnkudmFsKG1vZGVsLmNhdGVnb3J5IHx8IFwiXCIpO1xuICAgIHRoaXMucGFyZW50Q2F0ZWdvcnlDaGFuZ2UoKTtcbiAgICBpZiAobW9kZWwuY2hpbGRDYXRlZ29yeSkge1xuICAgICAgdGhpcy4kY2hpbGRDYXRlZ29yeS52YWwobW9kZWwuY2hpbGRDYXRlZ29yeSk7XG4gICAgfVxuICAgIHRoaXMuX3ZhbGlkYXRlQ2F0ZWdvcmllcygpO1xuICAgIHJldHVybiB0aGlzLmxvY2F0aW9uQ2hhbmdlKCk7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIG5hbWU6ICdbdmlldzpjbGFzc2lmaWVkLXBvc3Q6aW1hZ2VzXScsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnY2xhc3NpZmllZC9wb3N0L2ltYWdlcyddLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgLmR6LXByZXZpZXcgLmRlbGV0ZSBkaXYnOiAncmVtb3ZlRmlsZSdcbiAgfSxcbiAgc3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB0aGlzLiRmaWxlUHJldmlldyA9IHRoaXMuJCgnI2ltYWdlLXVwbG9hZC1wcmV2aWV3Jyk7XG4gICAgdGhpcy5maWxlc1RvRGVsZXRlID0gW107XG4gICAgdGhpcy5pbml0RHJvcHpvbmUoKTtcbiAgICByZXR1cm4gdGhpcy5zZXRET00oKTtcbiAgfSxcbiAgcmVtb3ZlRmlsZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgJGVsLCAkbGksIGZpbGUsIGksIGluZGV4LCBsZW4sIHJlZiwgc3JjO1xuICAgICRlbCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgJGxpID0gJGVsLnBhcmVudCgpLnBhcmVudCgpO1xuICAgIHNyYyA9ICgkbGkuZmluZCgnaW1nJykpLmF0dHIoJ2FsdCcpO1xuICAgIGluZGV4ID0gJGxpLmluZGV4KCk7XG4gICAgaWYgKCRsaS5kYXRhKCd1cGxvYWRlZCcpKSB7XG4gICAgICB0aGlzLmZpbGVzVG9EZWxldGUucHVzaChzcmMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWYgPSB0aGlzLmRyb3B6b25lLmZpbGVzO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGZpbGUgPSByZWZbaV07XG4gICAgICAgIGlmIChmaWxlLm5hbWUgPT09IHNyYykge1xuICAgICAgICAgIGZpbGUuc3RhdHVzID0gJ2RlbGV0ZSc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICRsaS5yZW1vdmUoKTtcbiAgfSxcbiAgaW5pdERyb3B6b25lOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGVsLCBvcHRpb25zO1xuICAgIERyb3B6b25lLmF1dG9EaXNjb3ZlciA9IGZhbHNlO1xuICAgICRlbCA9ICgodGhpcy4kKCcjaW1hZ2UtdXBsb2FkJykpLmVxKDApKS5kcm9wem9uZSh7XG4gICAgICB1cmw6ICcvJ1xuICAgIH0pO1xuICAgIHRoaXMuZHJvcHpvbmUgPSAkZWxbMF0uZHJvcHpvbmU7XG4gICAgdGhpcy5kcm9wem9uZS5wcmV2aWV3c0NvbnRhaW5lciA9IHRoaXMuJGZpbGVQcmV2aWV3WzBdO1xuICAgIG9wdGlvbnMgPSB0aGlzLmRyb3B6b25lLm9wdGlvbnM7XG4gICAgb3B0aW9ucy5hdXRvUHJvY2Vzc1F1ZXVlID0gZmFsc2U7XG4gICAgb3B0aW9ucy5wYXJhbU5hbWUgPSAnZmlsZXMnO1xuICAgIG9wdGlvbnMudXBsb2FkTXVsdGlwbGUgPSB0cnVlO1xuICAgIG9wdGlvbnMubWF4RmlsZXMgPSA4O1xuICAgIHJldHVybiBvcHRpb25zLnByZXZpZXdUZW1wbGF0ZSA9ICc8bGkgY2xhc3M9XCJkei1wcmV2aWV3XCI+PGltZyBkYXRhLWR6LXRodW1ibmFpbCAvPjxkaXYgY2xhc3M9XCJmb250LWF3ZXNvbWUgZGVsZXRlXCI+PGRpdj4mI3hmMDBkOzwvZGl2PjwvZGl2PiA8L2xpPic7XG4gIH0sXG4gIGFkZEltYWdlOiBmdW5jdGlvbihpbWcpIHtcbiAgICB2YXIgaHRtbDtcbiAgICBodG1sID0gXCI8bGkgY2xhc3M9J2R6LXByZXZpZXcgZHotaW1hZ2UtcHJldmlldycgZGF0YS11cGxvYWRlZD0ndHJ1ZSc+IDxpbWcgZGF0YS1kei10aHVtYm5haWw9JycgYWx0PSdcIiArIGltZyArIFwiJyBoZWlnaHQ9JzEwMCcgc3JjPScvdXBsb2Fkcy90aHVtYi9cIiArIGltZyArIFwiJz4gPGRpdiBjbGFzcz0nZm9udC1hd2Vzb21lIGRlbGV0ZSc+PGRpdj4mI3hmMDBkOzwvZGl2PjwvZGl2PiA8L2xpPlwiO1xuICAgIHJldHVybiB0aGlzLiRmaWxlUHJldmlldy5hcHBlbmQoaHRtbCk7XG4gIH0sXG4gIHNldE1vZGVsOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsZSwgZmlsZXMsIGksIGxlbjtcbiAgICBmaWxlcyA9IHRoaXMuZHJvcHpvbmUuZ2V0UXVldWVkRmlsZXMoKTtcbiAgICB0aGlzLm1vZGVsLmF0dHJpYnV0ZXMuZmlsZXMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBmaWxlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZmlsZSA9IGZpbGVzW2ldO1xuICAgICAgdGhpcy5tb2RlbC5hdHRyaWJ1dGVzLmZpbGVzLnB1c2goZmlsZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm1vZGVsLnNldCgnZmlsZXNUb0RlbGV0ZScsIHRoaXMuZmlsZXNUb0RlbGV0ZSk7XG4gIH0sXG4gIHNldERPTTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIGltYWdlLCBpbWFnZXMsIGxlbiwgcmVzdWx0cztcbiAgICBpbWFnZXMgPSB0aGlzLm1vZGVsLmdldCgnaW1hZ2VzJyk7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGltYWdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaW1hZ2UgPSBpbWFnZXNbaV07XG4gICAgICByZXN1bHRzLnB1c2godGhpcy5hZGRJbWFnZShpbWFnZS5maWxlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiAnW3ZpZXc6Y2xhc3NpZmllZC1wb3N0OmluZm9dJyxcbiAgdGVtcGxhdGU6IHRlbXBsYXRlWydjbGFzc2lmaWVkL3Bvc3QvaW5mbyddLFxuICBldmVudHM6IHtcbiAgICBcImtleXVwICN0aXRsZSBpbnB1dFwiOiBcInRpdGxlQ2hhbmdlXCIsXG4gICAgXCJrZXl1cCAjZGVzY3JpcHRpb24gdGV4dGFyZWFcIjogXCJkZXNjcmlwdGlvbkNoYW5nZVwiXG4gIH0sXG4gIHN0YXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy4kZGVzY3JpcHRpb24gPSB0aGlzLiQoJyNkZXNjcmlwdGlvbiB0ZXh0YXJlYScpO1xuICAgIHRoaXMuJHRpdGxlID0gdGhpcy4kKCcjdGl0bGUgaW5wdXQnKTtcbiAgICB0aGlzLiR3ZWJzaXRlID0gdGhpcy4kKCcjd2Vic2l0ZSBpbnB1dCcpO1xuICAgIHRoaXMuJGVycm9yd2Vic2l0ZSA9IHRoaXMuJCgnI3dlYnNpdGUgc21hbGwuZXJyb3InKTtcbiAgICB0aGlzLiRlcnJvclRpdGxlID0gdGhpcy4kKCcjdGl0bGUgc21hbGwuZXJyb3InKTtcbiAgICByZXR1cm4gdGhpcy4kZXJyb3JEZXNjID0gdGhpcy4kKCcjZGVzY3JpcHRpb24gc21hbGwuZXJyb3InKTtcbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3B1bGF0ZURPTSgpO1xuICB9LFxuICB0aXRsZUNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdGVUaXRsZSgpO1xuICB9LFxuICBkZXNjcmlwdGlvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdGVEZXNjcmlwdGlvbigpO1xuICB9LFxuICBfdmFsaWRhdGVUaXRsZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpdGxlO1xuICAgIHRpdGxlID0gdGhpcy4kdGl0bGUudmFsKCkgfHwgXCJcIjtcbiAgICB0aGlzLiR0aXRsZS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnc2hvdy1lcnJvcicpO1xuICAgIGlmICh0aXRsZS50cmltKCkubGVuZ3RoIDwgMTApIHtcbiAgICAgIHRoaXMuJHRpdGxlLnBhcmVudCgpLmFkZENsYXNzKCdzaG93LWVycm9yJyk7XG4gICAgICB0aGlzLiRlcnJvclRpdGxlLmh0bWwoJ1BsZWFzZSBnaXZlIGEgdGl0bGUgKG1pbiAxMCBjaGFyKScpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAodGl0bGUudHJpbSgpLmxlbmd0aCA+IDEyMCkge1xuICAgICAgdGhpcy4kdGl0bGUucGFyZW50KCkuYWRkQ2xhc3MoJ3Nob3ctZXJyb3InKTtcbiAgICAgIHRoaXMuJGVycm9yVGl0bGUuaHRtbCgnVGl0bGUgaXMgdG9vIGxvbmcgKG1heCAxMjAgY2hhciknKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIF92YWxpZGF0ZURlc2NyaXB0aW9uOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVzY3JpcHRpb247XG4gICAgdGhpcy4kZGVzY3JpcHRpb24ucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ3Nob3ctZXJyb3InKTtcbiAgICBkZXNjcmlwdGlvbiA9IHRoaXMuJGRlc2NyaXB0aW9uLnZhbCgpIHx8IFwiXCI7XG4gICAgaWYgKGRlc2NyaXB0aW9uLmxlbmd0aCA8IDIwKSB7XG4gICAgICB0aGlzLiRkZXNjcmlwdGlvbi5wYXJlbnQoKS5hZGRDbGFzcygnc2hvdy1lcnJvcicpO1xuICAgICAgdGhpcy4kZXJyb3JEZXNjLmh0bWwoJ0Rlc2NyaXB0aW9uIGlzIHRvbyBzaG9ydCAobWluIDIwIGNoYXIpJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChkZXNjcmlwdGlvbi5sZW5ndGggPiA1MDAwKSB7XG4gICAgICB0aGlzLiRkZXNjcmlwdGlvbi5wYXJlbnQoKS5hZGRDbGFzcygnc2hvdy1lcnJvcicpO1xuICAgICAgdGhpcy4kZXJyb3JEZXNjLmh0bWwoJ0Rlc2NyaXB0aW9uIGlzIHRvbyBsb25nIChtYXggNSwwMDAgY2hhciknKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIF92YWxpZGF0ZVdlYnNpdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlzVmFsaWQ7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAndmFsaWRhdGluZycpO1xuICAgIGlzVmFsaWQgPSB0aGlzLl92YWxpZGF0ZURlc2NyaXB0aW9uKCk7XG4gICAgaXNWYWxpZCA9IHRoaXMuX3ZhbGlkYXRlVGl0bGUoKSAmJiBpc1ZhbGlkO1xuICAgIGNvbnNvbGUuZGVidWcodGhpcy5uYW1lLCAndmFsaWRhdGlvbjonLCBpc1ZhbGlkKTtcbiAgICByZXR1cm4gaXNWYWxpZDtcbiAgfSxcbiAgc2V0TW9kZWw6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250YWN0O1xuICAgIGNvbnRhY3QgPSAodGhpcy5tb2RlbC5nZXQoJ2NvbnRhY3QnKSkgfHwge307XG4gICAgY29udGFjdC53ZWJzaXRlID0gdGhpcy4kd2Vic2l0ZS52YWwoKTtcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgZGVzY3JpcHRpb246IHRoaXMuJGRlc2NyaXB0aW9uLnZhbCgpLFxuICAgICAgdGl0bGU6IHRoaXMuJHRpdGxlLnZhbCgpLFxuICAgICAgY29udGFjdDogY29udGFjdFxuICAgIH0pO1xuICB9LFxuICBwb3B1bGF0ZURPTTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRhY3Q7XG4gICAgdGhpcy4kZGVzY3JpcHRpb24udmFsKHRoaXMubW9kZWwuZ2V0KCdkZXNjcmlwdGlvbicpKTtcbiAgICB0aGlzLiR0aXRsZS52YWwodGhpcy5tb2RlbC5nZXQoJ3RpdGxlJykpO1xuICAgIGNvbnRhY3QgPSAodGhpcy5tb2RlbC5nZXQoJ2NvbnRhY3QnKSkgfHwge307XG4gICAgcmV0dXJuIHRoaXMuJHdlYnNpdGUudmFsKGNvbnRhY3Qud2Vic2l0ZSk7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIG5hbWU6ICdbdmlldzpjbGFzc2lmaWVkLXBvc3Q6bWFwc10nLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2NsYXNzaWZpZWQvcG9zdC9tYXBzJ10sXG4gIGV2ZW50czoge1xuICAgIFwiY2xpY2sgI21hcHMtZGlzYWJsZWQtb3ZlcmxheVwiOiBcImVuYWJsZU1hcHNcIlxuICB9LFxuICBzdGFydDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHRoaXMuJGdtYXAgPSB0aGlzLiQoJyNtYXAtY2FudmFzJyk7XG4gICAgdGhpcy4kZ21hcFggPSB0aGlzLiQoJyNnbWFwWCcpO1xuICAgIHRoaXMuJGdtYXBZID0gdGhpcy4kKCcjZ21hcFknKTtcbiAgICB0aGlzLiRtYXBDb250YWluZXIgPSB0aGlzLiQoXCIjbWFwcy1jb250YWluZXJcIik7XG4gICAgdGhpcy4kbWFwRGlzYWJsZU92ZXJsYXkgPSB0aGlzLiQoXCIjbWFwcy1kaXNhYmxlZC1vdmVybGF5XCIpO1xuICAgIHRoaXMuJG1hcENvbnRhaW5lci5jc3MoJ21heC1oZWlnaHQnLCAoJCh3aW5kb3cpKS5oZWlnaHQoKSAvIDIpO1xuICAgIHJldHVybiB0aGlzLnNldERPTSgpO1xuICB9LFxuICBcImNvbnRpbnVlXCI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBHb29nbGVNYXBzO1xuICAgIGlmICh0aGlzLmdtYXAgPT0gbnVsbCkge1xuICAgICAgR29vZ2xlTWFwcyA9IG5ldyB0aGlzLnJlc291cmNlcy5leHRlcm5hbC5Hb29nbGVNYXBzO1xuICAgICAgcmV0dXJuIEdvb2dsZU1hcHMub25Mb2FkKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmluaXRpYWxpemVHb29nbGVNYXBzKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfVxuICB9LFxuICBlbmFibGVNYXBzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kbWFwRGlzYWJsZU92ZXJsYXkuaGlkZSgpO1xuICB9LFxuICBzZXRNb2RlbDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1ldGE7XG4gICAgaWYgKHRoaXMuJGdtYXBYLnZhbCgpIHx8IHRoaXMuJGdtYXBZLnZhbCgpKSB7XG4gICAgICBtZXRhID0gKHRoaXMubW9kZWwuZ2V0KCdtZXRhJykpIHx8IHt9O1xuICAgICAgbWV0YS5nbWFwWCA9IHRoaXMuJGdtYXBYLnZhbCgpO1xuICAgICAgbWV0YS5nbWFwWSA9IHRoaXMuJGdtYXBZLnZhbCgpO1xuICAgICAgcmV0dXJuIHRoaXMubW9kZWwuc2V0KCdtZXRhJywgbWV0YSk7XG4gICAgfVxuICB9LFxuICBzZXRET006IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJGdtYXBYLnZhbCgodGhpcy5tb2RlbC5nZXQoJ21ldGEnKSkuZ21hcFgpO1xuICAgIHRoaXMuJGdtYXBZLnZhbCgodGhpcy5tb2RlbC5nZXQoJ21ldGEnKSkuZ21hcFkpO1xuICAgIGlmICh0aGlzLiRnbWFwWS52YWwoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZW5hYmxlTWFwcygpO1xuICAgIH1cbiAgfSxcbiAgaW5pdGlhbGl6ZUdvb2dsZU1hcHM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBYLCBZLCBteUxhdGxuZztcbiAgICBYID0gdGhpcy4kZ21hcFgudmFsKCkgfHwgMjkuMzc1NzcwOTgxMTEwMzUzO1xuICAgIFkgPSB0aGlzLiRnbWFwWS52YWwoKSB8fCA0Ny45ODY1NjQ2MzYyMzA0NztcbiAgICBteUxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoWCwgWSk7XG4gICAgdGhpcy5nbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCh0aGlzLiRnbWFwWzBdLCB7XG4gICAgICBjZW50ZXI6IG15TGF0bG5nLFxuICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcbiAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgIHpvb206IDEzXG4gICAgfSk7XG4gICAgdGhpcy5nbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICBkcmFnZ2FibGU6IHRydWUsXG4gICAgICBtYXA6IHRoaXMuZ21hcCxcbiAgICAgIHBvc2l0aW9uOiBteUxhdGxuZ1xuICAgIH0pO1xuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMuZ21hcCwgJ2NsaWNrJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGxhdExuZywgbGF0aXR1ZGUsIGxvbmdpdHVkZTtcbiAgICAgICAgbGF0aXR1ZGUgPSBldmVudC5sYXRMbmcubGF0KCk7XG4gICAgICAgIGxvbmdpdHVkZSA9IGV2ZW50LmxhdExuZy5sbmcoKTtcbiAgICAgICAgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXRpdHVkZSwgbG9uZ2l0dWRlKTtcbiAgICAgICAgX3RoaXMuJGdtYXBYLnZhbChsYXRMbmcubGF0KCkpO1xuICAgICAgICBfdGhpcy4kZ21hcFkudmFsKGxhdExuZy5sbmcoKSk7XG4gICAgICAgIF90aGlzLmdtYXJrZXIuc2V0UG9zaXRpb24obGF0TG5nKTtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdtYXAucGFuVG8obGF0TG5nKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICAgIHJldHVybiBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcih0aGlzLmdtYXJrZXIsICdkcmFnZW5kJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGxhdExuZztcbiAgICAgICAgbGF0TG5nID0gX3RoaXMuZ21hcmtlci5nZXRQb3NpdGlvbigpO1xuICAgICAgICBfdGhpcy5nbWFwLnBhblRvKGxhdExuZyk7XG4gICAgICAgIF90aGlzLiRnbWFwWC52YWwobGF0TG5nLmxhdCgpKTtcbiAgICAgICAgcmV0dXJuIF90aGlzLiRnbWFwWS52YWwobGF0TG5nLmxuZygpKTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiAnW3ZpZXc6Y2xhc3NpZmllZC1wb3N0OnN1Ym1pdF0nLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2NsYXNzaWZpZWQvcG9zdC9zdWJtaXQnXSxcbiAgc3RhcnQ6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgcmFuZG9tSWQ7XG4gICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kKCcuc3VibWl0Jyk7XG4gICAgcmFuZG9tSWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwKTtcbiAgICB0aGlzLmNhcHRjaGFJZCA9IFwiZ2NhcHRjaGEtXCIgKyByYW5kb21JZDtcbiAgICB0aGlzLiRjYXB0Y2hhID0gdGhpcy4kKCcuZ2NhcHRjaGEnKTtcbiAgICByZXR1cm4gdGhpcy4kY2FwdGNoYS5hdHRyKCdpZCcsIHRoaXMuY2FwdGNoYUlkKTtcbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJDYXB0Y2hhKCk7XG4gIH0sXG4gIHZhbGlkYXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmFsO1xuICAgIHZhbCA9ICh0aGlzLiQoJy5nLXJlY2FwdGNoYS1yZXNwb25zZScpKS52YWwoKTtcbiAgICBpZiAodGhpcy5jYXB0Y2hhICYmICF2YWwgfHwgdmFsID09PSAnJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgcmVuZGVyQ2FwdGNoYTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIEdvb2dsZVJlY2FwdGNoYTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdzZXR0aW5nIGNhcHRjaGEnKTtcbiAgICAodGhpcy4kY2FwdGNoYS5odG1sKFwiXCIpKS5zaG93KCk7XG4gICAgdGhpcy4kc3VibWl0LmhpZGUoKTtcbiAgICBHb29nbGVSZWNhcHRjaGEgPSBuZXcgdGhpcy5yZXNvdXJjZXMuZXh0ZXJuYWwuR29vZ2xlUmVjYXB0Y2hhO1xuICAgIHJldHVybiBHb29nbGVSZWNhcHRjaGEub25Mb2FkKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoX3RoaXMuY2FwdGNoYSkge1xuICAgICAgICAgIHJldHVybiBncmVjYXB0Y2hhLnJlc2V0KF90aGlzLmNhcHRjaGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5jYXB0Y2hhID0gZ3JlY2FwdGNoYS5yZW5kZXIoX3RoaXMuY2FwdGNoYUlkLCB7XG4gICAgICAgICAgICBzaXRla2V5OiB3aW5kb3cuY29uZmlnLnJlQ2FwdGNoYSxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuY2FwdGNoYVN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgY2FwdGNoYVN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnY2FwdGNoYSBzdWNjZXNzJyk7XG4gICAgdGhpcy4kc3VibWl0LnNob3coKTtcbiAgICByZXR1cm4gdGhpcy4kY2FwdGNoYS5oaWRlKCk7XG4gIH0sXG4gIHJlc2V0Q2FwdGNoYTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGdyZWNhcHRjaGEucmVzZXQodGhpcy5jYXB0Y2hhKTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogXCJbdmlldzpjbGFzc2lmaWVkcy1zZWFyY2hdXCIsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVtcImNsYXNzaWZpZWQvc2VhcmNoXCJdLFxuICB0aXRsZTogXCJTZWFyY2ggY2xhc3NpZmllZHNcIixcbiAgZXZlbnRzOiB7XG4gICAgXCJjbGljayAjc2VhcmNoLWZpbHRlclwiOiBcInRvZ2dsZUZpbHRlcmJveFwiXG4gIH0sXG4gIHN0YXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy4kY2xhc3NpZmllZExpc3QgPSB0aGlzLiQoXCIuY2xhc3NpZmllZExpc3RcIik7XG4gICAgdGhpcy4kZmlsdGVyYm94ID0gdGhpcy4kKFwiI2ZpbHRlcmJveFwiKTtcbiAgICB0aGlzLmNsYXNzaWZpZWRMaXN0ID0gbmV3IHRoaXMucmVzb3VyY2VzLlZpZXdzLmNvbXBvbmVudHMuY2xhc3NpZmllZExpc3Qoe1xuICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgaXNBY2NvdW50OiBmYWxzZSxcbiAgICAgICAgZW5hYmxlRmlsdGVyQm94OiB0cnVlXG4gICAgICB9LFxuICAgICAgcmVzb3VyY2VzOiB0aGlzLnJlc291cmNlcyxcbiAgICAgIGVsOiB0aGlzLiRjbGFzc2lmaWVkTGlzdFxuICAgIH0pO1xuICAgIHRoaXMuY2xhc3NpZmllZExpc3QudHJpZ2dlcihcInN0YXJ0XCIpO1xuICAgIHRoaXMuZmlsdGVyYm94ID0gbmV3IHRoaXMucmVzb3VyY2VzLlZpZXdzLmNvbXBvbmVudHMuZmlsdGVyQm94KHtcbiAgICAgIGVsOiB0aGlzLiRmaWx0ZXJib3hcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJib3gudHJpZ2dlcihcInN0YXJ0XCIpO1xuICB9LFxuICBcImNvbnRpbnVlXCI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBDYXRlZ29yeSwgY2hpbGRDYXRlZ29yeSwgcGFyZW50Q2F0ZWdvcnk7XG4gICAgQ2F0ZWdvcnkgPSB0aGlzLnJlc291cmNlcy5jYXRlZ29yaWVzO1xuICAgIHBhcmVudENhdGVnb3J5ID0gdGhpcy5yZXNvdXJjZXMuaGlzdG9yeVN0YXRlLnBhcmFtZXRlcnNbMF07XG4gICAgY2hpbGRDYXRlZ29yeSA9IHRoaXMucmVzb3VyY2VzLmhpc3RvcnlTdGF0ZS5wYXJhbWV0ZXJzWzFdO1xuICAgIHBhcmVudENhdGVnb3J5ID0gQ2F0ZWdvcnkuZmluZEJ5U2x1ZyhwYXJlbnRDYXRlZ29yeSk7XG4gICAgY2hpbGRDYXRlZ29yeSA9IENhdGVnb3J5LmZpbmRCeVNsdWcoY2hpbGRDYXRlZ29yeSk7XG4gICAgdGhpcy5jbGFzc2lmaWVkTGlzdC5zZXR0aW5ncy5xdWVyeS5wYXJlbnRDYXRlZ29yeSA9IHBhcmVudENhdGVnb3J5O1xuICAgIHRoaXMuY2xhc3NpZmllZExpc3Quc2V0dGluZ3MucXVlcnkuY2hpbGRDYXRlZ29yeSA9IGNoaWxkQ2F0ZWdvcnk7XG4gICAgdGhpcy5jbGFzc2lmaWVkTGlzdC50cmlnZ2VyKFwiY29udGludWVcIik7XG4gICAgdGhpcy5maWx0ZXJib3gudHJpZ2dlcihcImNvbnRpbnVlXCIpO1xuICAgIGlmIChwYXJlbnRDYXRlZ29yeS5uYW1lICE9IG51bGwpIHtcbiAgICAgIHRoaXMudGl0bGUgPSBwYXJlbnRDYXRlZ29yeS5uYW1lO1xuICAgICAgaWYgKGNoaWxkQ2F0ZWdvcnkubmFtZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMudGl0bGUgPSBjaGlsZENhdGVnb3J5Lm5hbWUgKyBcIiAtIFwiICsgdGhpcy50aXRsZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnNldFRpdGxlKCk7XG4gICAgfVxuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NpZmllZExpc3QudHJpZ2dlcihcInBhdXNlXCIpO1xuICB9LFxuICB0b2dnbGVGaWx0ZXJib3g6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgJChcIiNmaWx0ZXJib3gtbW9kYWxcIikuZm91bmRhdGlvbihcInJldmVhbFwiLCBcIm9wZW5cIik7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJzaG93IGZpbHRlcmJveFwiKTtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcbiAgbmFtZTogXCJbdmlldzpjbGFzc2lmaWVkLXNpbmdsZV1cIixcbiAgdGVtcGxhdGU6IHRlbXBsYXRlWydjbGFzc2lmaWVkL3NpbmdsZSddLFxuICB0ZW1wbGF0ZU9wdGlvbnM6IHtcbiAgICBpc0d1ZXN0OiBmYWxzZVxuICB9LFxuICBtZXNzYWdlczoge1xuICAgIGFyY2hpdmVkOiAnVGhpcyBjbGFzc2lmaWVkIGhhcyBiZWVuIGRlbGV0ZWQnLFxuICAgIGJhbm5lZDogJ1RoaXMgY2xhc3NpZmllZCBoYXMgYmVlbiBiYW5uZWQgYnkgYSBtb2RlcmF0b3InLFxuICAgIG5lZWRsb2dpbjogJ1lvdSBuZWVkIHRvIGJlIGxvZ2dlZCBpbiB0byBtYWtlIHN1Y2ggcmVxdWVzdHMnLFxuICAgIG5vdGZvdW5kOiAnQ2xhc3NpZmllZCB3YXMgbm90IGZvdW5kJyxcbiAgICByZWplY3RlZDogJ1RoaXMgY2xhc3NpZmllZCBoYXMgYmVlbiByZWplY3RlZCBieSBhIG1vZGVyYXRvcicsXG4gICAgcmVwb3J0ZWQ6ICdZb3VyIHJlcG9ydCBoYXMgYmVlbiBzdWNjZXNzZnVsbHkgc3VibWl0dGVkJyxcbiAgICB1bnByaXY6ICdZb3UgYXJlIG5vdCBhbGxvd2VkIHRvIG1ha2Ugc3VjaCBib2d1cyByZXF1ZXN0cydcbiAgfSxcbiAgZXZlbnRzOiB7XG4gICAgXCJzdWJtaXQgZm9ybVwiOiBcInN1Ym1pdEhhbmRsZVwiLFxuICAgIFwiY2xpY2sgLmFjdGlvblwiOiBcImFjdGlvbkhhbmRsZVwiXG4gIH0sXG4gIHN0YXJ0OiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyAhPSBudWxsID8gb3B0aW9ucyA6IHt9O1xuICAgIGNvbnNvbGUuZGVidWcodGhpcy5uYW1lLCAnaW5pdGlhbGl6aW5nJywgdGhpcy5vcHRpb25zKTtcbiAgICB0aGlzLnNpbmdsZVRlbXBsYXRlID0gdGVtcGxhdGVbJ2NvbXBvbmVudHMvc2luZ2xlJ107XG4gICAgdGhpcy4kbWVzc2FnZXMgPSB0aGlzLiQoXCIjc2luZ2xlLW1lc3NhZ2VzXCIpO1xuICAgIHRoaXMuJHByb21wdE1vZGFsID0gdGhpcy4kKFwiI3Byb21wdE1vZGFsXCIpO1xuICAgIHRoaXMuJGFkbWluID0gdGhpcy4kKCcjYWRtaW4tc2luZ2xlJyk7XG4gICAgdGhpcy4kY29udGVudCA9IHRoaXMuJCgnI2NsYXNzaWZpZWQtY29udGFpbmVyJyk7XG4gICAgdGhpcy5tb2RlbCA9IG5ldyB0aGlzLnJlc291cmNlcy5Nb2RlbHMuY2xhc3NpZmllZDtcbiAgICB0aGlzLmxpc3RlblRvKHRoaXMubW9kZWwsICdzeW5jJywgdGhpcy5tb2RlbENoYW5nZSk7XG4gICAgcmV0dXJuIF8uYmluZEFsbCh0aGlzLCAncmVhcnJhbmdlR2FsbGVyeScpO1xuICB9LFxuICBcImNvbnRpbnVlXCI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdXRoSGFzaCwgaWQsIHNhdmVkQ2xhc3NpZmllZCwgdXJsSGVscGVycztcbiAgICBpZCA9IHRoaXMucmVzb3VyY2VzLmhpc3RvcnlTdGF0ZS5wYXJhbWV0ZXJzO1xuICAgIHNhdmVkQ2xhc3NpZmllZCA9IHdpbmRvdy5kYXRhLmNsYXNzaWZpZWQ7XG4gICAgaWYgKHNhdmVkQ2xhc3NpZmllZCAmJiBzYXZlZENsYXNzaWZpZWQuX2lkID09PSBpZCAmJiBmYWxzZSkge1xuICAgICAgdGhpcy5tb2RlbC5zZXQod2luZG93LmRhdGEuY2xhc3NpZmllZCk7XG4gICAgICB0aGlzLm1vZGVsLnRyaWdnZXIoJ3BhcnNlJyk7XG4gICAgICB0aGlzLnBvcHVsYXRlRE9NKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubW9kZWwuaWQgPSBpZDtcbiAgICAgIHRoaXMubGlzdGVuVG9PbmNlKHRoaXMubW9kZWwsICdzeW5jJywgdGhpcy5wb3B1bGF0ZURPTSk7XG4gICAgICB0aGlzLm1vZGVsLmZldGNoKCk7XG4gICAgfVxuICAgIHVybEhlbHBlcnMgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLnVybDtcbiAgICB0aGlzLiRlbC5mYWRlSW4oKTtcbiAgICB0aGlzLm1vZGVsQ2hhbmdlKCk7XG4gICAgYXV0aEhhc2ggPSB1cmxIZWxwZXJzLmdldFBhcmFtKCdhdXRoSGFzaCcpO1xuICAgIHRoaXMubW9kZWwuc2V0KCdhdXRoSGFzaCcsIGF1dGhIYXNoKTtcbiAgICAoJChkb2N1bWVudCkpLmZvdW5kYXRpb24oJ2NsZWFyaW5nJywgJ3JlZmxvdycpO1xuICAgIHRoaXMucmVuZGVyQWRtaW5iYXIoKTtcbiAgICByZXR1cm4gKCQod2luZG93KSkub24oJ3Jlc2l6ZScsIHRoaXMucmVhcnJhbmdlR2FsbGVyeSk7XG4gIH0sXG4gIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKCQod2luZG93KSkub2ZmKCdyZXNpemUnLCB0aGlzLnJlYXJyYW5nZUdhbGxlcnkpO1xuICB9LFxuICByZWFycmFuZ2VHYWxsZXJ5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4kZ2FsbGVyeS5tYXNvbnJ5KCk7XG4gIH0sXG4gIHBvcHVsYXRlRE9NOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgR29vZ2xlTWFwcywgaW1hZ2VzO1xuICAgIHRoaXMubW9kZWwucGFyc2VWYXJpYWJsZXMoKTtcbiAgICB0aGlzLnRpdGxlID0gdGhpcy5tb2RlbC5nZXQoJ3RpdGxlJyk7XG4gICAgdGhpcy5zZXRUaXRsZSgpO1xuICAgIHRoaXMuJGNvbnRlbnQuaHRtbCh0aGlzLnNpbmdsZVRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKTtcbiAgICB0aGlzLnJlc291cmNlcy5sYW5ndWFnZS50cmFuc2xhdGUodGhpcy4kY29udGVudCk7XG4gICAgdGhpcy4kZ2FsbGVyeSA9IHRoaXMuJCgnLmMtZ2FsbGVyeScpO1xuICAgIHRoaXMuJGdhbGxlcnkubWFzb25yeSh7XG4gICAgICBpdGVtU2VsZWN0b3I6ICdsaSdcbiAgICB9KTtcbiAgICB0aGlzLiRnYWxsZXJ5Lm1hc29ucnkoKTtcbiAgICBpbWFnZXMgPSB0aGlzLm1vZGVsLmdldCgnaW1hZ2VzJyk7XG4gICAgaWYgKGltYWdlcyAmJiBpbWFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5sb2FkSW1hZ2VzKCk7XG4gICAgfVxuICAgIHRoaXMuJGdtYXAgPSB0aGlzLiQoJyNtYXAtY2FudmFzJyk7XG4gICAgdGhpcy4kZ21hcC5jc3MoJ21heC1oZWlnaHQnLCAoJCh3aW5kb3cpKS5oZWlnaHQoKSAvIDIpO1xuICAgIHRoaXMuJGdtYXAuaGlkZSgpO1xuICAgIGlmICh0aGlzLmdtYXAgPT0gbnVsbCkge1xuICAgICAgR29vZ2xlTWFwcyA9IG5ldyB0aGlzLnJlc291cmNlcy5leHRlcm5hbC5Hb29nbGVNYXBzO1xuICAgICAgcmV0dXJuIEdvb2dsZU1hcHMub25Mb2FkKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmluaXRpYWxpemVHb29nbGVNYXBzKCk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfVxuICB9LFxuICBhY3Rpb25IYW5kbGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyICRlbCwgYWN0aW9uLCBmaW5pc2gsIHVybDtcbiAgICAkZWwgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgIGFjdGlvbiA9ICRlbC5kYXRhKCdhY3Rpb24nKTtcbiAgICBmaW5pc2ggPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF90aGlzLm1vZGVsLmhhc0NoYW5nZWQoKSkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5tb2RlbC5zYXZlKF90aGlzLm1vZGVsLmNoYW5nZWRBdHRyaWJ1dGVzKCksIHtcbiAgICAgICAgICAgIHBhdGNoOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgIGNhc2UgJ3B1Ymxpc2gnOlxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3RhdHVzJywgdGhpcy5tb2RlbC5zdGF0dXMuQUNUSVZFKTtcbiAgICAgICAgdGhpcy5tb2RlbC5zYXZlKCk7XG4gICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgIGNhc2UgJ2FyY2hpdmUnOlxuICAgICAgICB0aGlzLm1vZGVsLnNldCgnc3RhdHVzJywgdGhpcy5tb2RlbC5zdGF0dXMuQVJDSElWRUQpO1xuICAgICAgICB0aGlzLm1vZGVsLnNhdmUoKTtcbiAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgY2FzZSAncmVwb3N0JzpcbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdndWVzdCcpKSB7XG4gICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgc3RhdHVzOiB0aGlzLm1vZGVsLnN0YXR1cy5JTkFDVElWRVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgIHN0YXR1czogdGhpcy5tb2RlbC5zdGF0dXMuQUNUSVZFXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb2RlbC5zYXZlKCk7XG4gICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgIGNhc2UgJ2Jhbic6XG4gICAgICAgIHJldHVybiB0aGlzLnNob3dQcm9tcHRNb2RhbCgnYmFubmluZycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICAgIF90aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgICAgIHN0YXR1czogX3RoaXMubW9kZWwuc3RhdHVzLkJBTk5FRCxcbiAgICAgICAgICAgICAgbW9kZXJhdG9yUmVhc29uOiByZWFzb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX3RoaXMubW9kZWwuc2F2ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGZpbmlzaCgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpKTtcbiAgICAgIGNhc2UgJ3JlamVjdCc6XG4gICAgICAgIHJldHVybiB0aGlzLnNob3dQcm9tcHRNb2RhbCgncmVqZWN0aW5nJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgc3RhdHVzOiBfdGhpcy5tb2RlbC5zdGF0dXMuUkVKRUNURUQsXG4gICAgICAgICAgICAgIG1vZGVyYXRvclJlYXNvbjogcmVhc29uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF90aGlzLm1vZGVsLnNhdmUoKTtcbiAgICAgICAgICAgIHJldHVybiBmaW5pc2goKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSk7XG4gICAgICBjYXNlICdyZXBvcnQnOlxuICAgICAgICByZXR1cm4gdGhpcy5zaG93UHJvbXB0TW9kYWwoJ3JlcG9ydGluZycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICAgIHZhciByZXBvcnRzO1xuICAgICAgICAgICAgcmVwb3J0cyA9IF8uY2xvbmUoX3RoaXMubW9kZWwuZ2V0KCdyZXBvcnRzJykpO1xuICAgICAgICAgICAgcmVwb3J0cy5wdXNoKHJlYXNvbik7XG4gICAgICAgICAgICBfdGhpcy5tb2RlbC51bnNldChcInJlcG9ydHNcIiwge1xuICAgICAgICAgICAgICBzaWxlbnQ6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX3RoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgICAgcmVwb3J0czogcmVwb3J0c1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBfdGhpcy5tb2RlbC5zYXZlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmluaXNoKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpO1xuICAgICAgY2FzZSAnZWRpdCc6XG4gICAgICAgIGlmICh0aGlzLnRlbXBsYXRlT3B0aW9ucy5pc0d1ZXN0KSB7XG4gICAgICAgICAgdXJsID0gXCJndWVzdC9cIiArIHRoaXMubW9kZWwuaWQgKyBcIi9lZGl0P2F1dGhIYXNoPVwiICsgKHRoaXMubW9kZWwuZ2V0KCdhdXRoSGFzaCcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBcImNsYXNzaWZpZWQvXCIgKyB0aGlzLm1vZGVsLmlkICsgXCIvZWRpdFwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlc291cmNlcy5yb3V0ZXIucmVkaXJlY3QodGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UudXJsU2x1ZyArIFwiL1wiICsgdXJsKTtcbiAgICB9XG4gIH0sXG4gIHNob3dQcm9tcHRNb2RhbDogZnVuY3Rpb24oYWN0aW9uVGV4dCwgY2FsbGJhY2spIHtcbiAgICB2YXIgJHN1Ym1pdEJ1dHRvbiwgJHRleHRhcmVhO1xuICAgIHRoaXMuJHByb21wdE1vZGFsLmZvdW5kYXRpb24oJ3JldmVhbCcsICdvcGVuJyk7XG4gICAgKHRoaXMuJHByb21wdE1vZGFsLmZpbmQoJ2gzIHNwYW4nKSkuaHRtbChhY3Rpb25UZXh0KTtcbiAgICAkc3VibWl0QnV0dG9uID0gdGhpcy4kcHJvbXB0TW9kYWwuZmluZCgnLnN1Ym1pdCcpO1xuICAgICR0ZXh0YXJlYSA9IHRoaXMuJHByb21wdE1vZGFsLmZpbmQoJ3RleHRhcmVhJyk7XG4gICAgcmV0dXJuICRzdWJtaXRCdXR0b24ub25lKCdjbGljaycsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIF90aGlzLiRwcm9tcHRNb2RhbC5mb3VuZGF0aW9uKCdyZXZlYWwnLCAnY2xvc2UnKTtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCR0ZXh0YXJlYS52YWwoKSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgbW9kZWxDaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhdXRoSGFzaCwgbW9kZXJhdG9yUmVhc29uLCBzdGF0dXMsIHN0YXR1c2VzLCB1cmxIZWxwZXJzO1xuICAgIHVybEhlbHBlcnMgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLnVybDtcbiAgICBhdXRoSGFzaCA9IHVybEhlbHBlcnMuZ2V0UGFyYW0oJ2F1dGhIYXNoJyk7XG4gICAgdGhpcy5tb2RlbC5zZXQoJ2F1dGhIYXNoJywgYXV0aEhhc2gpO1xuICAgIHRoaXMuJG1lc3NhZ2VzLmh0bWwoXCJcIik7XG4gICAgdGhpcy5yZW5kZXJBZG1pbmJhcigpO1xuICAgIG1vZGVyYXRvclJlYXNvbiA9IHRoaXMubW9kZWwuZ2V0KCdtb2RlcmF0b3JSZWFzb24nKTtcbiAgICBzdGF0dXMgPSB0aGlzLm1vZGVsLmdldCgnc3RhdHVzJyk7XG4gICAgc3RhdHVzZXMgPSB0aGlzLm1vZGVsLnN0YXR1cztcbiAgICBzd2l0Y2ggKHN0YXR1cykge1xuICAgICAgY2FzZSBzdGF0dXNlcy5JTkFDVElWRTpcbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdndWVzdCcpKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZSgnVGhpcyBjbGFzc2lmaWVkIHdhcyBwb3N0ZWQgYW5vbnltb3VzbHkgYW5kIGlzIHlldCB0byBiZSByZXZpZXdlZCcsICd3YXJuaW5nJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZSgnVGhpcyBjbGFzc2lmaWVkIGlzIHRvIGJlIHJldmlld2VkJywgJ3dhcm5pbmcnKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugc3RhdHVzZXMuUkVKRUNURUQ6XG4gICAgICAgIHRoaXMuYWRkTWVzc2FnZSh0aGlzLm1lc3NhZ2VzLnJlamVjdGVkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZShtb2RlcmF0b3JSZWFzb24pO1xuICAgICAgY2FzZSBzdGF0dXNlcy5BUkNISVZFRDpcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTWVzc2FnZSh0aGlzLm1lc3NhZ2VzLmFyY2hpdmVkKTtcbiAgICAgIGNhc2Ugc3RhdHVzZXMuQkFOTkVEOlxuICAgICAgICB0aGlzLmFkZE1lc3NhZ2UodGhpcy5tZXNzYWdlcy5iYW5uZWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5hZGRNZXNzYWdlKG1vZGVyYXRvclJlYXNvbik7XG4gICAgICBjYXNlIHN0YXR1c2VzLkZMQUdHRUQ6XG4gICAgICAgIHJldHVybiB0aGlzLmFkZE1lc3NhZ2UoJ1RoaXMgY2xhc3NpZmllZCBoYXMgYmVlbiByZXBvcnRlZCB0b28gbWFueSB0aW1lcyBhbmQgaXMgdW5kZXIgcmV2aWV3Jyk7XG4gICAgfVxuICB9LFxuICBhZGRNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlLCB0eXBlKSB7XG4gICAgdmFyICRlbDtcbiAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICB0eXBlID0gJ2Vycm9yJztcbiAgICB9XG4gICAgJGVsID0gJChcIjxsaT4gXCIgKyBtZXNzYWdlICsgXCIgPC9saT5cIik7XG4gICAgJGVsLmhpZGUoKTtcbiAgICAkZWwuYWRkQ2xhc3ModHlwZSk7XG4gICAgdGhpcy4kbWVzc2FnZXMuYXBwZW5kKCRlbCk7XG4gICAgcmV0dXJuICRlbC5mYWRlSW4oKTtcbiAgfSxcbiAgc3VibWl0SGFuZGxlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciAkZm9ybSwgYWN0aW9uLCByZWFzb24sIHJlcG9ydHM7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAncmVhZGluZyBzdWJtaXQgZXZlbnQnKTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICRmb3JtID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcbiAgICBhY3Rpb24gPSAoJGZvcm0uZmluZChcIltuYW1lPSdhY3Rpb24nXVwiKSkudmFsKCk7XG4gICAgcmVhc29uID0gKCRmb3JtLmZpbmQoXCJbbmFtZT0ncmVhc29uJ11cIikpLnZhbCgpO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICBjYXNlICdwdWJsaXNoJzpcbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoJ3N0YXR1cycsIHRoaXMubW9kZWwuc3RhdHVzLkFDVElWRSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnYXJjaGl2ZSc6XG4gICAgICAgIHRoaXMubW9kZWwuc2V0KCdzdGF0dXMnLCB0aGlzLm1vZGVsLnN0YXR1cy5BUkNISVZFRCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVwb3N0JzpcbiAgICAgICAgaWYgKHRoaXMubW9kZWwuZ2V0KCdndWVzdCcpKSB7XG4gICAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgICAgc3RhdHVzOiB0aGlzLm1vZGVsLnN0YXR1cy5JTkFDVElWRVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMubW9kZWwuc2V0KHtcbiAgICAgICAgICAgIHN0YXR1czogdGhpcy5tb2RlbC5zdGF0dXMuQUNUSVZFXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiYW4nOlxuICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgc3RhdHVzOiB0aGlzLm1vZGVsLnN0YXR1cy5CQU5ORUQsXG4gICAgICAgICAgbW9kZXJhdG9yUmVhc29uOiByZWFzb25cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVqZWN0JzpcbiAgICAgICAgdGhpcy5tb2RlbC5zZXQoe1xuICAgICAgICAgIHN0YXR1czogdGhpcy5tb2RlbC5zdGF0dXMuUkVKRUNURUQsXG4gICAgICAgICAgbW9kZXJhdG9yUmVhc29uOiByZWFzb25cbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVwb3J0JzpcbiAgICAgICAgcmVwb3J0cyA9IF8uY2xvbmUodGhpcy5tb2RlbC5nZXQoJ3JlcG9ydHMnKSk7XG4gICAgICAgIHJlcG9ydHMucHVzaChyZWFzb24pO1xuICAgICAgICB0aGlzLm1vZGVsLnVuc2V0KFwicmVwb3J0c1wiLCB7XG4gICAgICAgICAgc2lsZW50OiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm1vZGVsLnNldCh7XG4gICAgICAgICAgcmVwb3J0czogcmVwb3J0c1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHRoaXMubW9kZWwuaGFzQ2hhbmdlZCgpKSB7XG4gICAgICByZXR1cm4gdGhpcy5tb2RlbC5zYXZlKHRoaXMubW9kZWwuY2hhbmdlZEF0dHJpYnV0ZXMoKSwge1xuICAgICAgICBwYXRjaDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBpbml0aWFsaXplR29vZ2xlTWFwczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluaXQsIG1ldGE7XG4gICAgaW5pdCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGxhdCwgbG5nKSB7XG4gICAgICAgIHZhciBtYXBPcHRpb25zLCBteUxhdGxuZztcbiAgICAgICAgbXlMYXRsbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcbiAgICAgICAgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICBjZW50ZXI6IG15TGF0bG5nLFxuICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxuICAgICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgICAgICB6b29tOiAxM1xuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5nbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChfdGhpcy4kZ21hcFswXSwgbWFwT3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBfdGhpcy5nbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgcG9zaXRpb246IG15TGF0bG5nLFxuICAgICAgICAgIG1hcDogX3RoaXMuZ21hcFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgbWV0YSA9IHRoaXMubW9kZWwuZ2V0KCdtZXRhJyk7XG4gICAgaWYgKG1ldGEgJiYgbWV0YS5nbWFwWCAmJiBtZXRhLmdtYXBZKSB7XG4gICAgICBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGluaXQobWV0YS5nbWFwWCwgbWV0YS5nbWFwWSk7XG4gICAgICB9KSwgMjUwKTtcbiAgICAgIHJldHVybiB0aGlzLiRnbWFwLnNob3coKTtcbiAgICB9XG4gIH0sXG4gIGxvYWRJbWFnZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkaW1ncywgaW1hZ2VMb2FkZXIsIHRvdGFsO1xuICAgIGltYWdlTG9hZGVyID0gdGhpcy5yZXNvdXJjZXMuTGlicmFyeS5pbWFnZUxvYWRlcjtcbiAgICAkaW1ncyA9IHRoaXMuJCgnW2RhdGEtc3JjXScpO1xuICAgIHRvdGFsID0gJGltZ3MubGVuZ3RoO1xuICAgIHRoaXMuJGdhbGxlcnkubWFnbmlmaWNQb3B1cCh7XG4gICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgZGVsZWdhdGU6ICdhJyxcbiAgICAgIGdhbGxlcnk6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiAkaW1ncy5lYWNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgdmFyICRjb250YWluZXIsICRpbWcsIGNyZWF0ZUZhaWx1cmVIYW5kbGVyLCBjcmVhdGVTdWNjZXNzSGFuZGxlciwgc3JjO1xuICAgICAgICAkaW1nID0gJGltZ3MuZXEoaSk7XG4gICAgICAgICRjb250YWluZXIgPSAkaW1nLnBhcmVudCgpLnBhcmVudCgpO1xuICAgICAgICBzcmMgPSAkaW1nLmRhdGEoJ3NyYycpO1xuICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdpbWFnZS1sb2FkaW5nJyk7XG4gICAgICAgIGNyZWF0ZVN1Y2Nlc3NIYW5kbGVyID0gZnVuY3Rpb24oZWxlbSkge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLiRnYWxsZXJ5Lm1hc29ucnkoKTtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoJ2ltYWdlLWxvYWRpbmcnKS5hZGRDbGFzcygnaW1hZ2Utc3VjY2VzcycpO1xuICAgICAgICAgICAgX3RoaXMuJGdhbGxlcnkubWFzb25yeSgpO1xuICAgICAgICAgICAgaWYgKC0tdG90YWwgPT09IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuICgkKGRvY3VtZW50KSkuZm91bmRhdGlvbignY2xlYXJpbmcnLCAncmVmbG93Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgY3JlYXRlRmFpbHVyZUhhbmRsZXIgPSBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgZWxlbS5yZW1vdmVDbGFzcygnaW1hZ2UtbG9hZGluZycpLmFkZENsYXNzKCdpbWFnZS1mYWlsZWQnKTtcbiAgICAgICAgICAgIF90aGlzLiRnYWxsZXJ5Lm1hc29ucnkoKTtcbiAgICAgICAgICAgIGlmICgtLXRvdGFsID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiAoJChkb2N1bWVudCkpLmZvdW5kYXRpb24oJ2NsZWFyaW5nJywgJ3JlZmxvdycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgICRpbWcuYXR0cignc3JjJywgc3JjKTtcbiAgICAgICAgX3RoaXMuJGdhbGxlcnkubWFzb25yeSgnbGF5b3V0Jyk7XG4gICAgICAgIHJldHVybiBpbWFnZUxvYWRlcihzcmMsIHtcbiAgICAgICAgICBzdWNjZXNzOiBjcmVhdGVTdWNjZXNzSGFuZGxlcigkY29udGFpbmVyKSxcbiAgICAgICAgICBmYWlsdXJlOiBjcmVhdGVGYWlsdXJlSGFuZGxlcigkY29udGFpbmVyKSxcbiAgICAgICAgICB0YXJnZXQ6ICRpbWdcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpKTtcbiAgfSxcbiAgcmVuZGVyQWRtaW5iYXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhZG1pblRlbXBsYXRlLCBlZGl0YWJsZSwgc3VwZXJFZGl0YWJsZSwgdXJsSGVscGVycywgdXNlcjtcbiAgICB1cmxIZWxwZXJzID0gdGhpcy5yZXNvdXJjZXMuSGVscGVycy51cmw7XG4gICAgc3VwZXJFZGl0YWJsZSA9IGZhbHNlO1xuICAgIGVkaXRhYmxlID0gZmFsc2U7XG4gICAgYWRtaW5UZW1wbGF0ZSA9IHRlbXBsYXRlWydjb21wb25lbnRzL2FkbWluLXNpbmdsZSddO1xuICAgIHVzZXIgPSB0aGlzLnJlc291cmNlcy5jdXJyZW50VXNlcjtcbiAgICBpZiAoKHRoaXMubW9kZWwuZ2V0KCdndWVzdCcpKSAmJiAodXJsSGVscGVycy5nZXRQYXJhbSgnYXV0aEhhc2gnKSkgJiYgKGxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KCcvJykpWzJdID09PSAnZ3Vlc3QnKSB7XG4gICAgICBlZGl0YWJsZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICh1c2VyLmlkID09PSB0aGlzLm1vZGVsLmdldCgnb3duZXInKSkge1xuICAgICAgZWRpdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAodXNlci5nZXQoJ2lzTW9kZXJhdG9yJykpIHtcbiAgICAgIHN1cGVyRWRpdGFibGUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoZWRpdGFibGUgfHwgc3VwZXJFZGl0YWJsZSkge1xuICAgICAgdGhpcy4kYWRtaW4uc2hvdygpLmh0bWwoYWRtaW5UZW1wbGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy5tb2RlbC5pZCxcbiAgICAgICAgZWRpdGFibGU6IGVkaXRhYmxlLFxuICAgICAgICBzdXBlckVkaXRhYmxlOiBzdXBlckVkaXRhYmxlXG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UudHJhbnNsYXRlKHRoaXMuJGFkbWluKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuJGFkbWluLmhpZGUoKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5WaWV3LmV4dGVuZCh7XG4gIG5hbWU6ICdbdmlldzpjb250YWN0XScsXG4gIHRlbXBsYXRlOiB0ZW1wbGF0ZVsnY29udGFjdCddLFxuICBldmVudHM6IHtcbiAgICAnY2xpY2sgLnN1Ym1pdCc6ICdzdWJtaXQnXG4gIH0sXG4gIHRpdGxlOiBcIkNvbnRhY3QgVXNcIixcbiAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYW5kb21JZDtcbiAgICByYW5kb21JZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDApO1xuICAgIHRoaXMuJGNhcHRjaGEgPSB0aGlzLiQoXCIuZ2NhcHRjaGFcIik7XG4gICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kKFwiLnN1Ym1pdFwiKTtcbiAgICB0aGlzLiRlbWFpbCA9IHRoaXMuJChcIltuYW1lPSdlbWFpbCddXCIpO1xuICAgIHRoaXMuJG1lc3NhZ2UgPSB0aGlzLiQoXCJbbmFtZT0nbWVzc2FnZSddXCIpO1xuICAgIHRoaXMuJG1lc3NhZ2VzID0gdGhpcy4kKFwidWwubWVzc2FnZXNcIik7XG4gICAgdGhpcy5jYXB0Y2hhSWQgPSBcImdjYXB0Y2hhLVwiICsgcmFuZG9tSWQ7XG4gICAgdGhpcy4kY2FwdGNoYS5hdHRyKCdpZCcsIHRoaXMuY2FwdGNoYUlkKTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJDYXB0Y2hhKCk7XG4gIH0sXG4gIHJlbmRlckNhcHRjaGE6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBHb29nbGVSZWNhcHRjaGE7XG4gICAgY29uc29sZS5sb2codGhpcy5uYW1lLCAnc2V0dGluZyBjYXB0Y2hhJyk7XG4gICAgdGhpcy4kc3VibWl0LmhpZGUoKTtcbiAgICAodGhpcy4kY2FwdGNoYS5odG1sKFwiXCIpKS5zaG93KCk7XG4gICAgR29vZ2xlUmVjYXB0Y2hhID0gbmV3IHRoaXMucmVzb3VyY2VzLmV4dGVybmFsLkdvb2dsZVJlY2FwdGNoYTtcbiAgICByZXR1cm4gR29vZ2xlUmVjYXB0Y2hhLm9uTG9hZCgoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF90aGlzLmNhcHRjaGEpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXMucmVzZXRDYXB0Y2hhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNhcHRjaGEgPSBncmVjYXB0Y2hhLnJlbmRlcihfdGhpcy5jYXB0Y2hhSWQsIHtcbiAgICAgICAgICAgIHNpdGVrZXk6IHdpbmRvdy5jb25maWcucmVDYXB0Y2hhLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBfdGhpcy5jYXB0Y2hhU3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9LFxuICBjYXB0Y2hhU3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICB0aGlzLiRzdWJtaXQuc2hvdygpO1xuICAgIHRoaXMuJGNhcHRjaGEuaGlkZSgpO1xuICAgIHJldHVybiBjb25zb2xlLmxvZyh0aGlzLm5hbWUsICdjYXB0Y2hhIHN1Y2Nlc3MnKTtcbiAgfSxcbiAgcmVzZXRDYXB0Y2hhOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiRjYXB0Y2hhLnNob3coKTtcbiAgICByZXR1cm4gZ3JlY2FwdGNoYS5yZXNldCh0aGlzLmNhcHRjaGEpO1xuICB9LFxuICB2YWxpZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGlzRW1wdHksIHN0YXR1cztcbiAgICBzdGF0dXMgPSB0cnVlO1xuICAgIHRoaXMucmVtb3ZlQWxsRXJyb3JzKCk7XG4gICAgaXNFbXB0eSA9IGZ1bmN0aW9uKHN0cikge1xuICAgICAgcmV0dXJuIChzdHIgfHwgXCJcIikudHJpbSgpLmxlbmd0aCA9PT0gMDtcbiAgICB9O1xuICAgIGlmIChpc0VtcHR5KHRoaXMuJGVtYWlsLnZhbCgpKSkge1xuICAgICAgdGhpcy5hZGRNZXNzYWdlKCdZb3VyIGVtYWlsIGlzIHJlcXVpcmVkIGZvciB1cyB0byByZXBseSBiYWNrIHRvIHlvdSEnKTtcbiAgICAgIHN0YXR1cyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXNFbXB0eSh0aGlzLiRtZXNzYWdlLnZhbCgpKSkge1xuICAgICAgdGhpcy5hZGRNZXNzYWdlKCdOb3RoaW5nIHRvIHNheT8gOignKTtcbiAgICAgIHN0YXR1cyA9IGZhbHNlO1xuICAgIH1cbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgJ2Zvcm0gdmFsaWRhdGlvbiBzdGF0dXM6Jywgc3RhdHVzKTtcbiAgICByZXR1cm4gc3RhdHVzO1xuICB9LFxuICByZW1vdmVBbGxFcnJvcnM6IGZ1bmN0aW9uKCkge1xuICAgICgkKCcuc2hvdy1lcnJvcicpKS5yZW1vdmVDbGFzcygnc2hvdy1lcnJvcicpO1xuICAgIHJldHVybiB0aGlzLiRtZXNzYWdlcy5odG1sKFwiXCIpO1xuICB9LFxuICBhZGRNZXNzYWdlOiBmdW5jdGlvbihtZXNzYWdlLCB0eXBlKSB7XG4gICAgdmFyICRlbDtcbiAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICB0eXBlID0gJ2Vycm9yJztcbiAgICB9XG4gICAgJGVsID0gJChcIjxsaT4gXCIgKyBtZXNzYWdlICsgXCIgPC9saT5cIik7XG4gICAgJGVsLmhpZGUoKTtcbiAgICAkZWwuYWRkQ2xhc3ModHlwZSk7XG4gICAgdGhpcy4kbWVzc2FnZXMuYXBwZW5kKCRlbCk7XG4gICAgcmV0dXJuICRlbC5zaG93KCk7XG4gIH0sXG4gIHN1Ym1pdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgYWpheCwgcGFyYW1ldGVycywgdmFsaWRhdGVkO1xuICAgIGFqYXggPSAocmVxdWlyZSgnYXBwLWhlbHBlcnMnKSkuYWpheDtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgJ3N1Ym1pdHRpbmcgZm9ybScsIGV2ZW50KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhbGlkYXRlZCA9IHRoaXMudmFsaWRhdGUoKTtcbiAgICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgJ3ZhbGlkYXRpbmcgZm9ybScsIHZhbGlkYXRlZCk7XG4gICAgaWYgKCF2YWxpZGF0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy4kc3VibWl0LmhpZGUoKTtcbiAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgZW1haWw6IHRoaXMuJGVtYWlsLnZhbCgpLFxuICAgICAgbWVzc2FnZTogdGhpcy4kbWVzc2FnZS52YWwoKVxuICAgIH07XG4gICAgcmV0dXJuICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6ICcvYXBpL2NvbnRhY3QnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIGRhdGE6IHBhcmFtZXRlcnMsXG4gICAgICBiZWZvcmVTZW5kOiBhamF4LnNldEhlYWRlcnMsXG4gICAgICBzdWNjZXNzOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmFkZE1lc3NhZ2UoJ1lvdXIgbWVzc2FnZSBoYXMgYmVlbiBzZW50IScsICdzdWNjZXNzJyk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSxcbiAgICAgIGVycm9yOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UsIHR5cGVvZiByZXNwb25zZSk7XG4gICAgICAgICAgX3RoaXMucmVzZXRDYXB0Y2hhKCk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmFkZE1lc3NhZ2UocmVzcG9uc2UucmVzcG9uc2VKU09OKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpXG4gICAgfSk7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAocmVxdWlyZSgnLi4vY2xhc3NpZmllZC9lZGl0JykpLmV4dGVuZCh7XG4gIG5hbWU6ICdbdmlldzpndWVzdC1lZGl0XScsXG4gIHRlbXBsYXRlT3B0aW9uczoge1xuICAgIGlzR3Vlc3Q6IHRydWUsXG4gICAgaGFzQ2xhc3NpZmllZDogdHJ1ZVxuICB9LFxuICBjaGVja1JlZGlyZWN0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAocmVxdWlyZSgnLi4vY2xhc3NpZmllZC9maW5pc2gnKSkuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3Omd1ZXN0LWZpbmlzaF0nLFxuICB0ZW1wbGF0ZU9wdGlvbnM6IHtcbiAgICBpc0d1ZXN0OiB0cnVlXG4gIH0sXG4gIGdlbmVyYXRlU29jaWFsTGlua3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBVUkwsIGF1dGhIYXNoLCBhdXRoTGluaywgZmFjZWJvb2ssIGdwbHVzLCBpZCwgbGFuZ2hyZWYsIGxvY2FsVVJMLCB0d2VldCwgdHdpdHRlciwgdXJsSGVscGVycztcbiAgICBpZCA9IHRoaXMucmVzb3VyY2VzLmhpc3RvcnlTdGF0ZS5wYXJhbWV0ZXJzO1xuICAgIHVybEhlbHBlcnMgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLnVybDtcbiAgICBsYW5naHJlZiA9IHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLnVybFNsdWc7XG4gICAgYXV0aEhhc2ggPSB1cmxIZWxwZXJzLmdldFBhcmFtKCdhdXRoSGFzaCcpO1xuICAgIFVSTCA9IFwiXCIgKyB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgbGFuZ2hyZWYgKyBcIi9jbGFzc2lmaWVkL1wiICsgaWQ7XG4gICAgYXV0aExpbmsgPSBcIlwiICsgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIGxhbmdocmVmICsgXCIvZ3Vlc3QvXCIgKyBpZCArIFwiP2F1dGhIYXNoPVwiICsgYXV0aEhhc2g7XG4gICAgbG9jYWxVUkwgPSBsYW5naHJlZiArIFwiL2d1ZXN0L1wiICsgaWQgKyBcIj9hdXRoSGFzaD1cIiArIGF1dGhIYXNoO1xuICAgIHR3ZWV0ID0gXCJDaGVjayBvdXQgbXkgY2xhc3NpZmllZCBhdCBcIiArIFVSTDtcbiAgICBmYWNlYm9vayA9IFwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9XCIgKyBVUkw7XG4gICAgdHdpdHRlciA9IFwiaHR0cHM6Ly90d2l0dGVyLmNvbS9ob21lP3N0YXR1cz1cIiArIChlbmNvZGVVUkkodHdlZXQpKTtcbiAgICBncGx1cyA9IFwiaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmU/dXJsPVwiICsgVVJMO1xuICAgIHRoaXMuJGF1dGhMaW5rLmh0bWwoYXV0aExpbmspO1xuICAgIHRoaXMuJGF1dGhMaW5rLmF0dHIoJ2hyZWYnLCBhdXRoTGluayk7XG4gICAgdGhpcy4kZmluaXNoTGluay5hdHRyKCdocmVmJywgbG9jYWxVUkwpO1xuICAgIHRoaXMuJGZhY2Vib29rLmF0dHIoJ2hyZWYnLCBmYWNlYm9vayk7XG4gICAgdGhpcy4kdHdpdHRlci5hdHRyKCdocmVmJywgdHdpdHRlcik7XG4gICAgcmV0dXJuIHRoaXMuJGdwbHVzLmF0dHIoJ2hyZWYnLCBncGx1cyk7XG4gIH0sXG4gIHByb21vdGVIYW5kbGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb29raWVIZWxwZXIsIHVybEhlbHBlcnM7XG4gICAgY29va2llSGVscGVyID0gdGhpcy5yZXNvdXJjZXMuSGVscGVycy5jb29raWU7XG4gICAgdXJsSGVscGVycyA9IHRoaXMucmVzb3VyY2VzLkhlbHBlcnMudXJsO1xuICAgIGNvb2tpZUhlbHBlci5jcmVhdGVDb29raWUoJ3BheS13LXR3ZWV0JywgdGhpcy5yZXNvdXJjZXMuaGlzdG9yeVN0YXRlLnBhcmFtZXRlcnMpO1xuICAgIGNvb2tpZUhlbHBlci5jcmVhdGVDb29raWUoJ2F1dGhIYXNoJywgdXJsSGVscGVycy5nZXRQYXJhbSgnYXV0aEhhc2gnKSk7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IHRoaXMucGF5d2l0aGF0d2VldFVSTDtcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChyZXF1aXJlKCcuLi9jbGFzc2lmaWVkL3Bvc3QnKSkuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3Omd1ZXN0LXBvc3RdJyxcbiAgdGVtcGxhdGVPcHRpb25zOiB7XG4gICAgaXNHdWVzdDogdHJ1ZSxcbiAgICBoYXNDbGFzc2lmaWVkOiBmYWxzZVxuICB9LFxuICBjaGVja1JlZGlyZWN0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSAocmVxdWlyZSgnLi4vY2xhc3NpZmllZC9zaW5nbGUnKSkuZXh0ZW5kKHtcbiAgbmFtZTogJ1t2aWV3Omd1ZXN0LXNpbmdsZV0nLFxuICB0ZW1wbGF0ZU9wdGlvbnM6IHtcbiAgICBpc0d1ZXN0OiB0cnVlXG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICdhYm91dCc6IHJlcXVpcmUoJy4vYWJvdXQnKSxcbiAgJ2FjY291bnQtY3JlZGl0cyc6IHJlcXVpcmUoJy4vYWNjb3VudC9jcmVkaXRzJyksXG4gICdhY2NvdW50LWluZGV4JzogcmVxdWlyZSgnLi9hY2NvdW50JyksXG4gICdhY2NvdW50LW1hbmFnZSc6IHJlcXVpcmUoJy4vYWNjb3VudC9tYW5hZ2UnKSxcbiAgJ2F1dGgtZm9yZ290JzogcmVxdWlyZSgnLi9hdXRoL2xvZ2luJyksXG4gICdhdXRoLWxvZ2luJzogcmVxdWlyZSgnLi9hdXRoL2xvZ2luJyksXG4gICdhdXRoLWxvZ291dCc6IHJlcXVpcmUoJy4vYXV0aC9sb2dvdXQnKSxcbiAgJ2F1dGgtcmVzZXQnOiByZXF1aXJlKCcuL2F1dGgvbG9naW4nKSxcbiAgJ2F1dGgtc2lnbnVwJzogcmVxdWlyZSgnLi9hdXRoL3NpZ251cCcpLFxuICAnY2xhc3NpZmllZC1lZGl0JzogcmVxdWlyZSgnLi9jbGFzc2lmaWVkL2VkaXQnKSxcbiAgJ2NsYXNzaWZpZWQtZmluaXNoJzogcmVxdWlyZSgnLi9jbGFzc2lmaWVkL2ZpbmlzaCcpLFxuICAnY2xhc3NpZmllZC1wb3N0JzogcmVxdWlyZSgnLi9jbGFzc2lmaWVkL3Bvc3QnKSxcbiAgJ2NsYXNzaWZpZWQtc2VhcmNoJzogcmVxdWlyZSgnLi9jbGFzc2lmaWVkL3NlYXJjaCcpLFxuICAnY2xhc3NpZmllZC1zaW5nbGUnOiByZXF1aXJlKCcuL2NsYXNzaWZpZWQvc2luZ2xlJyksXG4gICdjb250YWN0JzogcmVxdWlyZSgnLi9jb250YWN0JyksXG4gICdndWVzdC1lZGl0JzogcmVxdWlyZSgnLi9ndWVzdC9lZGl0JyksXG4gICdndWVzdC1maW5pc2gnOiByZXF1aXJlKCcuL2d1ZXN0L2ZpbmlzaCcpLFxuICAnZ3Vlc3QtcG9zdCc6IHJlcXVpcmUoJy4vZ3Vlc3QvcG9zdCcpLFxuICAnZ3Vlc3Qtc2luZ2xlJzogcmVxdWlyZSgnLi9ndWVzdC9zaW5nbGUnKSxcbiAgJ2xhbmRpbmcnOiByZXF1aXJlKCcuL2xhbmRpbmcnKVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICBuYW1lOiAnW3ZpZXc6bGFuZGluZ10nLFxuICB0ZW1wbGF0ZTogdGVtcGxhdGVbJ2xhbmRpbmcnXSxcbiAgdGl0bGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIlB1Ymxpc2ggZnJlZSBjbGFzc2lmaWVkc1wiO1xuICB9LFxuICBldmVudHM6IHtcbiAgICBcInN1Ym1pdFwiOiBcImZvcm1TdWJtaXRcIlxuICB9LFxuICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kY2F0ZWdvcnlDb250YWluZXIgPSB0aGlzLiQoJyNsYW5kaW5nLWNhdGVnb3JpZXMnKTtcbiAgICB0aGlzLiRjbGFzc2lmaWVkTGlzdCA9IHRoaXMuJChcIi5jbGFzc2lmaWVkTGlzdFwiKTtcbiAgICB0aGlzLiRsb2dvID0gdGhpcy4kKFwiI2xhbmRpbmctbG9nbyBpbWdcIik7XG4gICAgdGhpcy5jbGFzc2lmaWVkTGlzdCA9IG5ldyB0aGlzLnJlc291cmNlcy5WaWV3cy5jb21wb25lbnRzLmNsYXNzaWZpZWRMaXN0KHtcbiAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgIGlzQWNjb3VudDogZmFsc2UsXG4gICAgICAgIGVuYWJsZUZpbHRlckJveDogZmFsc2VcbiAgICAgIH0sXG4gICAgICByZXNvdXJjZXM6IHRoaXMucmVzb3VyY2VzLFxuICAgICAgZWw6IHRoaXMuJGNsYXNzaWZpZWRMaXN0XG4gICAgfSk7XG4gICAgdGhpcy5jbGFzc2lmaWVkTGlzdC50cmlnZ2VyKCdzdGFydCcpO1xuICAgIHRoaXMuJGNhdGVnb3J5TGlzdCA9IHRoaXMuJGVsLmZpbmQoJyNtYXNvbnJ5LWNvbnRhaW5lciAuY29udGVudCcpO1xuICAgIHRoaXMuY2F0ZWdvcnlMaXN0ID0gbmV3IHRoaXMucmVzb3VyY2VzLlZpZXdzLmNvbXBvbmVudHMuY2F0ZWdvcnlMaXN0KHtcbiAgICAgIGVsOiB0aGlzLiRjYXRlZ29yeUNvbnRhaW5lcixcbiAgICAgIHJlc291cmNlczogdGhpcy5yZXNvdXJjZXNcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5jYXRlZ29yeUxpc3QudHJpZ2dlcignc3RhcnQnKTtcbiAgfSxcbiAgXCJjb250aW51ZVwiOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXV0aEhhc2gsIGNvb2tpZUhlbHBlciwgaWQsIHVybDtcbiAgICBzd2l0Y2ggKHdpbmRvdy5sb2NhdGlvbi5oYXNoKSB7XG4gICAgICBjYXNlIFwiI3NoYXJlZFwiOlxuICAgICAgICBjb29raWVIZWxwZXIgPSB0aGlzLnJlc291cmNlcy5IZWxwZXJzLmNvb2tpZTtcbiAgICAgICAgaWQgPSBjb29raWVIZWxwZXIucmVhZENvb2tpZSgncGF5LXctdHdlZXQnKTtcbiAgICAgICAgYXV0aEhhc2ggPSBjb29raWVIZWxwZXIucmVhZENvb2tpZSgnYXV0aEhhc2gnKTtcbiAgICAgICAgaWYgKGF1dGhIYXNoKSB7XG4gICAgICAgICAgdXJsID0gXCJndWVzdC9cIiArIGlkICsgXCIvZmluaXNoP2F1dGhIYXNoPVwiICsgYXV0aEhhc2ggKyBcIiNzaGFyZWRcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cmwgPSBcImNsYXNzaWZpZWQvXCIgKyBpZCArIFwiL2ZpbmlzaCNzaGFyZWRcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc291cmNlcy5yb3V0ZXIucmVkaXJlY3QodGhpcy5yZXNvdXJjZXMubGFuZ3VhZ2UudXJsU2x1ZyArIFwiL1wiICsgdXJsKTtcbiAgICB9XG4gICAgdGhpcy5jbGFzc2lmaWVkTGlzdC50cmlnZ2VyKCdjb250aW51ZScpO1xuICAgIHJldHVybiB0aGlzLmNhdGVnb3J5TGlzdC50cmlnZ2VyKCdjb250aW51ZScpO1xuICB9LFxuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhc3NpZmllZExpc3QucGF1c2UoKTtcbiAgfSxcbiAgZm9ybVN1Ym1pdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgJGtleXdvcmRzLCB0ZXh0LCB1cmw7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAka2V5d29yZHMgPSB0aGlzLiQoXCJbbmFtZT0na2V5d29yZHMnXVwiKTtcbiAgICB0ZXh0ID0gJGtleXdvcmRzLnZhbCgpLnJlcGxhY2UoJyAnLCAnKycpO1xuICAgIHVybCA9IHRoaXMucmVzb3VyY2VzLmxhbmd1YWdlLnVybFNsdWcgKyBcIi9jbGFzc2lmaWVkP2tleXdvcmRzPVwiICsgdGV4dDtcbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZXMucm91dGVyLnJlZGlyZWN0KHVybCk7XG4gIH1cbn0pO1xuIl19
