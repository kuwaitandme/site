(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(app) {
  console.log("[app] preparing config stages");
  app.config(require("./router"));
  return app.config(require("./templateCacheDecorator"));
};

},{"./router":2,"./templateCacheDecorator":3}],2:[function(require,module,exports){
var exports;

exports = module.exports = function($stateProvider, $locationProvider, $urlMatcher, $urlRouterProvider) {
  var _route, index;
  $urlMatcher.strictMode(false);
  index = 0;
  _route = function(page, route) {
    return $stateProvider.state(page + "-" + (index++), {
      controller: "page:" + page,
      templateUrl: "" + page,
      url: route,
      resolve: {
        categories: [
          "model.categories", function(category) {
            return category.download();
          }
        ],
        user: [
          "model.users", function(user) {
            return user.download();
          }
        ],
        location: [
          "model.locations", function(location) {
            return location.download();
          }
        ]
      }
    });
  };
  _route("landing", "/");
  _route("account/index", "/account");
  _route("account/manage", "/account/manage");
  _route("auth/index", "/auth");
  _route("auth/logout", "/auth/logout");
  _route("guest/post", "/guest/post");
  _route("classified/finish", "/classified/finish/{id:[0-9]+}");
  _route("classified/edit", "/classified/edit/{id:[0-9]+}");
  _route("classified/post", "/classified/post");
  _route("classified/search", "/classified");
  _route("classified/search", "/classified/{parent:[^/]+}");
  _route("classified/search", "/classified/{parent:[^/]+}/{child:[^/]+}");
  _route("classified/single", "/{slug:[^/]+}");
  _route("404", "*page");
  return $locationProvider.html5Mode({
    enabled: true,
    requireBases: false
  });
};

exports.$inject = ["$stateProvider", "$locationProvider", "$urlMatcherFactoryProvider", "$urlRouterProvider"];

},{}],3:[function(require,module,exports){
var exports;

exports = module.exports = function($provide) {
  var decorator;
  decorator = function($delegate, $sniffer) {
    var originalGet;
    originalGet = $delegate.get;
    $delegate.get = function(key) {
      var value;
      value = originalGet(key);
      if (!value) {
        if (JST[key] != null) {
          value = JST[key]();
        }
        if (value) {
          $delegate.put(key, value);
        }
      }
      return value;
    };
    return $delegate;
  };
  this;
  decorator.$inject = ["$delegate", "$sniffer"];
  return $provide.decorator("$templateCache", decorator);
};

exports.$inject = ["$provide"];

},{}],4:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $location, console, Categories) {
  var $el, categories, category, i, len, masonry;
  this.name = "[component:category-list]";
  console.log(this.name, "initializing");
  $scope.categories = [];
  $el = angular.element(document.querySelectorAll(".categories-list"));
  masonry = new Masonry($el[0], {
    transitionDuration: 0
  });
  $scope.$watch((function() {
    return $el[0].childElementCount;
  }), (function(_this) {
    return function() {
      var child, i, len, ref;
      ref = $el[0].children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        masonry.appended(child);
      }
      return masonry.layout();
    };
  })(this));
  categories = Categories.getAll();
  for (i = 0, len = categories.length; i < len; i++) {
    category = categories[i];
    category.sprite = (category.name.replace(",", " ")).split(" ")[0].toLowerCase();
    category.extraClass = "";
    category.toggleChildren = function() {
      this.extraClass = this.extraClass === "show-children" ? "" : "show-children";
      return setTimeout((function() {
        return masonry.layout();
      }), 100);
    };
  }
  return $scope.categories = categories;
};

exports.$inject = ["$scope", "$location", "$log", "model.categories"];

},{}],5:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $googleMaps, $imageResizer, $location, $notifications, console, Classifieds, Categories, Locations) {
  var onDescriptionChange, onTitleChange;
  this.name = "[component:classified-form]";
  console.log(this.name, "initializing");
  $scope.categories = Categories.getAll();
  $scope.locations = Locations.getAll();
  if ($scope.onSuccess == null) {
    $scope.onSuccess = function() {};
  }
  if ($scope.classified == null) {
    $scope.classified = Classifieds.getDefault();
  }
  $scope.classified.parentCategory = Categories.findByParentId($scope.classified.parent_category || null);
  $scope.classified.childCategory = Categories.findByChildId($scope.classified.child_category || null);
  $scope.location = Locations.findById($scope.classified.location);
  $scope.superEditable = true;
  onTitleChange = function(newValue) {
    var maxTitle, minTitle, ref, remaining;
    if (newValue == null) {
      newValue = "";
    }
    minTitle = 20;
    maxTitle = 140;
    if ((minTitle <= (ref = newValue.length) && ref <= maxTitle)) {
      remaining = maxTitle - newValue.length;
      return $scope.remainingTitle = remaining + " characters left";
    } else {
      return $scope.remainingTitle = "";
    }
  };
  $scope.$watch("classified.title", onTitleChange);
  onDescriptionChange = function(newValue) {
    var maxDescription, minDescription, ref, remaining;
    if (newValue == null) {
      newValue = "";
    }
    minDescription = 50;
    maxDescription = 2000;
    if ((minDescription <= (ref = newValue.length) && ref <= maxDescription)) {
      remaining = maxDescription - newValue.length;
      return $scope.remainingDescription = remaining + " characters left";
    } else {
      return $scope.remainingDescription = "";
    }
  };
  $scope.$watch("classified.description", onDescriptionChange);
  $scope.addImages = function() {
    var $el;
    $el = angular.element(document.querySelectorAll("[type='file']"));
    return $el[0].click();
  };
  $scope.changeStatus = (function(_this) {
    return function(newStatus) {
      console.debug(_this.name, "changing status to : '" + newStatus + "'");
      $scope.classified.status = Classifieds.statuses[newStatus];
      return $scope.submit();
    };
  })(this);
  $scope.fileChange = function(files) {
    var file, i, len, results;
    if (files == null) {
      files = [];
    }
    if ($scope.classified.images == null) {
      $scope.classified.images = [];
    }
    results = [];
    for (i = 0, len = files.length; i < len; i++) {
      file = files[i];
      results.push((function(file) {
        return $imageResizer.createThumbnail(file, {
          thumbnailHeight: 300,
          thumbnailWidth: 300,
          callback: (function(_this) {
            return function(dataURL) {
              return $scope.$apply(function() {
                var image, isThereMainImage, j, len1, ref;
                isThereMainImage = false;
                ref = $scope.classified.images;
                for (j = 0, len1 = ref.length; j < len1; j++) {
                  image = ref[j];
                  if (image.main) {
                    isThereMainImage = true;
                  }
                }
                return $scope.classified.images.push({
                  file: file,
                  filename: file.name,
                  width: file.width,
                  height: file.height,
                  src: dataURL,
                  main: !isThereMainImage,
                  status: "to-upload"
                });
              });
            };
          })(this)
        });
      })(file));
    }
    return results;
  };
  $scope.removeImage = function($event) {
    var $li, i, image, len, newStatus, ref, ref1;
    $li = angular.element($event.target.parentNode);
    switch ($li.data().$scope.image.status) {
      case "on-server":
        newStatus = "to-delete-from-server";
        break;
      case "to-delete":
        newStatus = "to-upload";
        break;
      case "to-delete-from-server":
        newStatus = "on-server";
        break;
      case "to-upload":
        newStatus = "to-delete";
    }
    if (newStatus != null) {
      $li.data().$scope.image.status = newStatus;
    }
    if ($li.data().$scope.image.main) {
      ref = $scope.classified.images;
      for (i = 0, len = ref.length; i < len; i++) {
        image = ref[i];
        if ((ref1 = image.status) === "on-server" || ref1 === "to-upload") {
          image.main = true;
          break;
        }
      }
      return $li.data().$scope.image.main = false;
    }
  };
  $scope.setmainImage = function($event) {
    var $li, i, image, len, ref, ref1;
    $li = angular.element($event.target.parentNode);
    if ((ref = $li.data().$scope.image.status) === "to-delete-from-server" || ref === "to-delete") {
      return;
    }
    ref1 = $scope.classified.images;
    for (i = 0, len = ref1.length; i < len; i++) {
      image = ref1[i];
      image.main = false;
    }
    return $li.data().$scope.image.main = true;
  };
  $scope.submit = (function(_this) {
    return function() {
      var i, image, len, ref;
      if (!$scope.form.$invalid) {
        console.log(_this.name, "submitting form");
        ref = $scope.classified.images || [];
        for (i = 0, len = ref.length; i < len; i++) {
          image = ref[i];
          delete image.src;
        }
        if ($scope.classified.parentCategory != null) {
          $scope.classified.parent_category = $scope.classified.parentCategory.id;
        }
        if ($scope.classified.childCategory != null) {
          $scope.classified.child_category = $scope.classified.childCategory.id;
        }
        if ($scope.location != null) {
          $scope.classified.location = $scope.location.id;
        }
        Classifieds.save($scope.classified, function(error, classified) {
          if (error) {
            return $notifications.error("Something went wrong while saving your classified. Try again later");
          }
          return $scope.onSuccess(classified);
        });
      } else {
        $notifications.error("You have some invalid fields in your form. Have a look at them again");
      }
      return $scope.attempted = true;
    };
  })(this);
  return $scope.drawMap = function() {
    var initMap, loaded;
    loaded = false;
    initMap = function() {
      var gmap, map, marker, myLatlng;
      myLatlng = new google.maps.LatLng($scope.classified.meta.gmapX || 29.375770981110353, $scope.classified.meta.gmapY || 47.98656463623047);
      gmap = document.getElementById("maps-container");
      map = new google.maps.Map(gmap, {
        center: myLatlng,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        style: $googleMaps.defaultStyle,
        zoom: 13
      });
      marker = new google.maps.Marker({
        draggable: true,
        map: map,
        position: myLatlng
      });
      google.maps.event.addListener(map, 'click', function(event) {
        var latLng;
        latLng = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
        $scope.classified.meta.gmapX = latLng.lat();
        $scope.classified.meta.gmapY = latLng.lng();
        marker.setPosition(latLng);
        return map.panTo(latLng);
      });
      google.maps.event.addListener(marker, 'dragend', function(event) {
        var latLng;
        latLng = marker.getPosition();
        $scope.classified.meta.gmapX = latLng.lat();
        $scope.classified.meta.gmapY = latLng.lng();
        return map.panTo(latLng);
      });
      return loaded = true;
    };
    if (!loaded) {
      return $googleMaps.onLoad(function() {
        return initMap();
      });
    }
  };
};

exports.$inject = ["$scope", "$googleMaps", "$imageResizer", "$location", "$notifications", "$log", "model.classifieds", "model.categories", "model.locations"];

},{}],6:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $window, $rootScope, console, Classifieds) {
  var body, classifedList, currentPage, loadingClassifieds, masonry, scrollPosition;
  this.name = "[component:classified-list]";
  console.log(this.name, "initializing");
  classifedList = (angular.element(document.querySelectorAll(".classified-list")))[0];
  masonry = new Masonry(classifedList, {
    transitionDuration: 0
  });
  currentPage = 1;
  loadingClassifieds = false;
  scrollPosition = 0;
  body = (document.getElementsByTagName("body"))[0];
  if ($scope.queryFinished == null) {
    $scope.queryFinished = false;
  }
  if ($scope.redirectToEditPage == null) {
    $scope.redirectToEditPage = false;
  }
  if ($scope.finishMessage == null) {
    $scope.finishMessage = (function() {
      var texts;
      texts = ["Damn, there are no more classifieds!", "Mayday! we're all out of classifieds!", "Woops! that's all we got!", "Wowie! that seems to be all we have!"];
      return texts[Math.floor(Math.random() * texts.length)];
    })();
  }
  if ($scope.emptyMessage == null) {
    $scope.emptyMessage = $scope.finishMessage;
  }
  $scope.$watch((function() {
    return classifedList.childElementCount;
  }), (function(_this) {
    return function() {
      var child, i, len, newElements, ref;
      if (classifedList.children.length > 0) {
        newElements = [];
        ref = classifedList.children;
        for (i = 0, len = ref.length; i < len; i++) {
          child = ref[i];
          if (!child.dataset.added) {
            child.dataset.added = true;
            newElements.push(child);
          }
        }
        masonry.appended(newElements.reverse());
        return masonry.layout();
      }
    };
  })(this));
  $scope.toggleClassified = function(classified) {
    $rootScope.bodyStyles = $rootScope.bodyStyles || {};
    if ($scope.classified == null) {
      $scope.$broadcast("classified-changed", classified);
      $rootScope.bodyStyles.overflowY = "hidden";
      $scope.classified = classified;
      scrollPosition = body.scrollTop;
      return body.scrollTop = 0;
    } else {
      $scope.classified = void 0;
      setTimeout((function() {
        return body.scrollTop = scrollPosition;
      }), 10);
      return $rootScope.bodyStyles.overflowY = "";
    }
  };
  $scope.classifieds = [];
  $scope.loadClassifieds = (function(_this) {
    return function() {
      var parameters;
      console.log(_this.name, "loading more classifieds");
      console.debug(_this.name, "page:", currentPage);
      parameters = {
        page: currentPage++
      };
      angular.extend(parameters, $scope.query || {});
      return Classifieds.query(parameters, function(error, classifieds) {
        var classified, i, len;
        if (error) {
          console.error(error);
        }
        if (classifieds.length === 0) {
          $scope.queryFinished = true;
        }
        console.log(_this.name, "finished loading classifieds");
        console.debug(_this.name, "loaded " + classifieds.length + " classified(s)");
        for (i = 0, len = classifieds.length; i < len; i++) {
          classified = classifieds[i];
          if ($scope.redirectToEditPage) {
            classified.link = "/classified/edit/" + classified.id;
          }
          classified.imageLoaded = function() {
            return masonry.layout();
          };
          $scope.classifieds.push(classified);
        }
        return loadingClassifieds = false;
      });
    };
  })(this);
  $scope.loadClassifieds();
  return $scope.onScroll = (function(_this) {
    return function($event) {
      var documentHeight, html;
      if ($scope.queryFinished || loadingClassifieds) {
        return;
      }
      body = document.body;
      html = document.documentElement;
      documentHeight = Math.max(body.clientHeight, body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);
      scrollPosition = body.scrollTop + $window.innerHeight;
      if (scrollPosition / documentHeight * 100 > 80) {
        loadingClassifieds = true;
        return $scope.loadClassifieds();
      }
    };
  })(this);
};

exports.$inject = ["$scope", "$window", "$rootScope", "$log", "model.classifieds"];

},{}],7:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $googleMaps, console, Classifieds) {
  var cl;
  this.name = "[component:classified-single]";
  console.log(this.name, "initializing");
  console.debug(this.name, $scope);
  cl = $scope.classified || Classifieds.getDefault();
  cl.show = true;
  return $scope.drawMap = function() {
    var initMap;
    initMap = function() {
      var gmap, latLng, map, marker;
      latLng = new google.maps.LatLng(cl.meta.gmapX, cl.meta.gmapY);
      gmap = document.getElementById("maps-container");
      map = new google.maps.Map(gmap, {
        center: latLng,
        mapTypeControl: false,
        style: $googleMaps.defaultStyle,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        panControl: false,
        zoomControl: false,
        streetViewControl: false,
        draggable: false,
        zoom: 13
      });
      return marker = new google.maps.Marker({
        draggable: false,
        map: map,
        position: latLng
      });
    };
    return $googleMaps.onLoad(function() {
      return initMap();
    });
  };
};

exports.$inject = ["$scope", "$googleMaps", "$log", "model.classifieds"];

},{}],8:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $root, console, setTimeout) {
  var flashNotificationLifetime, maxUnreadNotifications, onNotificationAdded, onNotificationRead;
  this.name = "[component:header]";
  console.log(this.name, "initializing");
  flashNotificationLifetime = 3000;
  maxUnreadNotifications = 3;
  $scope.flashNotifications = [];
  $scope.unreadNotifications = 12;
  $scope.notifications = [];
  if ($root.bodyClasses == null) {
    $root.bodyClasses = {};
  }
  $scope.openHeader = function() {
    return $root.bodyClasses["show-subheader"] = true;
  };
  $scope.closeHeader = function() {
    var count, i, len, notification, ref, results;
    $root.bodyClasses["show-subheader"] = false;
    count = 0;
    ref = $scope.notifications;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      notification = ref[i];
      notification.hasRead = true;
      if (++count > maxUnreadNotifications) {
        results.push(notification.remove = true);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  $scope.toggleHeader = function() {
    var headerIsOpened;
    headerIsOpened = $root.bodyClasses["show-subheader"];
    if (headerIsOpened) {
      return $scope.closeHeader();
    } else {
      return $scope.openHeader();
    }
  };
  onNotificationAdded = function(notifications) {};
  $scope.$watch("notifications", onNotificationAdded, true);
  onNotificationRead = function(notifications) {
    var i, len, notification, results;
    $scope.unreadNotifications = 0;
    results = [];
    for (i = 0, len = notifications.length; i < len; i++) {
      notification = notifications[i];
      if (!notification.hasRead) {
        results.push($scope.unreadNotifications++);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  $scope.$watch("notifications", onNotificationRead, true);
  $scope.closeFlashNotification = function(index) {
    var closedNotification, i, len, notification, ref, results;
    closedNotification = ($scope.flashNotifications.splice(index, 1))[0];
    ref = $scope.notifications;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      notification = ref[i];
      if (notification.$$hashkey === closedNotification.$$hashkey) {
        results.push(notification.hasRead = true);
      } else {
        results.push(void 0);
      }
    }
    return results;
  };
  return $scope.$on("notification", function(event, notification) {
    $scope.flashNotifications.push(notification);
    (function(notifications) {
      return setTimeout(function() {
        var index;
        index = $scope.flashNotifications.indexOf(notification);
        if (index != null) {
          return $scope.flashNotifications.splice(index, 1);
        }
      }, flashNotificationLifetime);
    })(notification);
    if (!notification.flash) {
      return $scope.notifications.push(notification);
    }
  });
};

exports.$inject = ["$scope", "$rootScope", "$log", "$timeout"];

},{}],9:[function(require,module,exports){
module.exports = function(app) {
  console.log("[controllers] initializing");
  app.controller("master", require("./master"));
  app.controller("component:category-list", require("./components/category-list"));
  app.controller("component:classified-list", require("./components/classified-list"));
  app.controller("component:classified-single", require("./components/classified-single"));
  app.controller("component:classified-form", require("./components/classified-form"));
  app.controller("component:header", require("./components/header"));
  app.controller("page:404", require("./pages/404"));
  app.controller("page:account/index", require("./pages/account"));
  app.controller("page:account/manage", require("./pages/account/manage"));
  app.controller("page:auth/index", require("./pages/auth"));
  app.controller("page:auth/logout", require("./pages/auth/logout"));
  app.controller("page:classified/edit", require("./pages/classified/edit"));
  app.controller("page:classified/finish", require("./pages/classified/finish"));
  app.controller("page:classified/post", require("./pages/classified/post"));
  app.controller("page:classified/search", require("./pages/classified/search"));
  app.controller("page:classified/single", require("./pages/classified/single"));
  return app.controller("page:landing", require("./pages/landing"));
};

},{"./components/category-list":4,"./components/classified-form":5,"./components/classified-list":6,"./components/classified-single":7,"./components/header":8,"./master":10,"./pages/404":11,"./pages/account":12,"./pages/account/manage":13,"./pages/auth":14,"./pages/auth/logout":15,"./pages/classified/edit":16,"./pages/classified/finish":17,"./pages/classified/post":18,"./pages/classified/search":19,"./pages/classified/single":20,"./pages/landing":21}],10:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $root, console) {
  this.name = "[controller:master]";
  console.log(this.name, "initializing");
  return $scope.meta = $root.meta = {
    robotsNoIndex: false
  };
};

exports.$inject = ["$scope", "$rootScope", "$log"];

},{}],11:[function(require,module,exports){
var exports;

exports = module.exports = function($location) {
  console.log("reloading page");
  return $location.reload();
};

exports.$inject = ["$location"];

},{}],12:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, console) {
  this.name = "[page:account-index]";
  console.log(this.name, "initializing");
  return $scope.$emit("page-loaded");
};

exports.$inject = ["$scope", "$log"];

},{}],13:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, console, Users) {
  this.name = "[page:account-manage]";
  console.log(this.name, "initializing");
  $scope.$emit("page-loaded");
  $scope.query = {
    owner: Users.getCurrentUser().id
  };
  $scope.finishMessage = "End of classifieds";
  $scope.emptyMessage = "You have no classifieds";
  return $scope.redirectToEditPage = true;
};

exports.$inject = ["$scope", "$log", "model.users"];

},{}],14:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $location, $http, console, $notifications, Users) {
  this.name = "[page:auth-login]";
  console.log(this.name, "initializing");
  $scope.$emit("page-loaded");
  $scope.login = {};
  $scope.signup = {};
  $scope.doLogin = (function(_this) {
    return function() {
      return $http({
        method: "POST",
        url: "/api/auth/email/login",
        data: $scope.login
      }).success(function(data, status) {
        console.log(_this.name, "login successful! redirecting to account page");
        Users.setCurrentUser(data);
        $notifications.success("Welcome " + data.full_name + ", You have been logged in!");
        return $location.path("/account");
      }).error(function(data, status) {
        $notifications.error("Invalid login. Please check your credentials");
        return console.error(_this.name, data, status);
      });
    };
  })(this);
  return $scope.doSignup = (function(_this) {
    return function() {
      return $http({
        method: "POST",
        url: "/api/auth/email/signup",
        data: $scope.signup
      }).success(function(data, status) {
        $notifications.success("An activation email has been sent, " + data.full_name + "! (Check your spam folder too)");
        return console.log(_this.name, "signup successful! waiting for activation page");
      }).error(function(data, status) {
        console.error(_this.name, data, status);
        return $notifications.error("Signup failed. Please check your credentials or try again later");
      });
    };
  })(this);
};

exports.$inject = ["$scope", "$location", "$http", "$log", "$notifications", "model.users"];

},{}],15:[function(require,module,exports){
var exports;

exports = module.exports = function($location, $http, console, $notifications, Users) {
  this.name = "[page:auth-logout]";
  console.log(this.name, "initializing");
  $notifications.success("You have been logged out successfully");
  Users.logout();
  return $location.path("/auth");
};

exports.$inject = ["$location", "$http", "$log", "$notifications", "model.users"];

},{}],16:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $stateParams, console, $location, $notifications, Classifieds) {
  this.name = "[page:classified-edit]";
  console.log(this.name, "initializing", Classifieds.get($stateParams.id, (function(_this) {
    return function(error, classified) {
      var i, image, len, ref;
      ref = classified.images || [];
      for (i = 0, len = ref.length; i < len; i++) {
        image = ref[i];
        image.status = "on-server";
        image.src = "/uploads/thumb/" + image.filename;
      }
      $scope.classified = classified;
      return $scope.$emit("page-loaded");
    };
  })(this)));
  return $scope.onSuccess = function(classified) {
    $notifications.success("Your classified has been edited successfully!");
    return $location.path("/account/manage");
  };
};

exports.$inject = ["$scope", "$stateParams", "$log", "$location", "$notifications", "model.classifieds"];

},{}],17:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $stateParams, $googleMaps, console, Classifieds) {
  this.name = "[page:classified-finish]";
  console.log(this.name, "initializing");
  console.debug(this.name, "routeParams", $stateParams);
  return $scope.$emit("page-loaded");
};

exports.$inject = ["$scope", "$stateParams", "$googleMaps", "$log", "model.classifieds"];

},{}],18:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, console, $location, $notifications, Users) {
  this.name = "[page:classified-post]";
  console.log(this.name, "initializing");
  $scope.onSuccess = function(classified) {
    $notifications.success("Your classified has been submitted successfully!");
    return $location.path("/classified/finish/" + classified.id);
  };
  $scope.isUserLoggedIn = Users.isLoggedIn();
  $scope.heroURL = "landing.jpg";
  return $scope.onHeroLoad = function() {
    return $scope.$emit("page-loaded");
  };
};

exports.$inject = ["$scope", "$log", "$location", "$notifications", "model.users"];

},{}],19:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $stateParams, $rootScope, console, Categories) {
  var cls;
  this.name = "[page:classified-search]";
  console.log(this.name, "initializing");
  console.debug(this.name, "routeParams", $stateParams);
  $scope.childCategory = Categories.findBySlug($stateParams.child);
  $scope.parentCategory = Categories.findBySlug($stateParams.parent);
  $scope.heroURL = "cl-" + $scope.parentCategory.slug + ".jpg";
  $scope.onHeroLoad = function() {
    return $scope.$emit("page-loaded");
  };
  $scope.query = {
    child_category: $scope.childCategory.id,
    parent_category: $scope.parentCategory.id
  };
  $rootScope.bodyClasses = $rootScope.bodyClasses || {};
  for (cls in $rootScope.bodyClasses) {
    if ((cls.indexOf("cl-")) === 0) {
      $rootScope.bodyClasses[cls] = false;
    }
  }
  return $rootScope.bodyClasses["cl-" + $stateParams.parent] = true;
};

exports.$inject = ["$scope", "$stateParams", "$rootScope", "$log", "model.categories"];

},{}],20:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $root, $stateParams, console, Classifieds) {
  this.name = "[page:classified-single]";
  console.log(this.name, "initializing");
  console.debug(this.name, "routeParams", $stateParams);
  $scope.$on("classified-changed", function(event, classified) {
    return $scope.classified = classified;
  });
  if ($scope.classified == null) {
    return Classifieds.getBySlug($stateParams.slug, (function(_this) {
      return function(error, classified) {
        $scope.classified = classified;
        $scope.$emit("page-loaded");
        return $root.meta.robotsNoIndex = classified.meta.hideSearchEngine;
      };
    })(this));
  }
};

exports.$inject = ["$scope", "$rootScope", "$stateParams", "$log", "model.classifieds"];

},{}],21:[function(require,module,exports){
var exports;

exports = module.exports = function($scope, $scroller, console) {
  this.name = "[page:landing]";
  console.log(this.name, "initializing");
  $scope.gotoElement = function(eID) {
    return setTimeout((function() {
      return $scroller.scrollTo(eID);
    }), 100);
  };
  $scope.heroURL = "landing.jpg";
  return $scope.onHeroLoad = function() {
    return $scope.$emit("page-loaded");
  };
};

exports.$inject = ["$scope", "$scroller", "$log"];

},{}],22:[function(require,module,exports){
module.exports = function(app) {
  console.log("[directives] initializing");
  app.directive("ngImageLoader", require("./ngImageLoader"));
  app.directive("ngModelFile", require("./ngModelFile"));
  return app.directive("ngScroll", require("./ngScroll"));
};

},{"./ngImageLoader":23,"./ngModelFile":24,"./ngScroll":25}],23:[function(require,module,exports){
module.exports = function() {
  return {
    scope: {
      ngImageSuccess: "&",
      ngImageFail: "&"
    },
    link: function(scope, element, attributes) {
      var failure, img, isType, prop, src, success;
      isType = function(o, t) {
        return (typeof o).indexOf(t.charAt(0).toLowerCase()) === 0;
      };
      img = element[0];
      src = attributes.ngImageLoader;
      element.addClass("image-loading");
      success = function() {
        var fn;
        element.removeClass("image-loading");
        element.addClass("image-success");
        fn = (scope.ngImageSuccess && scope.ngImageSuccess()) || function() {};
        return fn();
      };
      failure = function() {
        var fn;
        element.removeClass("image-loading");
        element.addClass("image-fail");
        fn = (scope.ngImageFail && scope.ngImageFail()) || function() {};
        return fn();
      };
      prop = isType(img.naturalWidth, "u") ? "width" : "naturalWidth";
      img.src = src;
      if (img.complete) {
        if (img[prop]) {
          return success(img);
        } else {
          return failure(img);
        }
      } else {
        img.onload = success;
        return img.onerror = failure;
      }
    }
  };
};

},{}],24:[function(require,module,exports){
module.exports = function() {
  return {
    scope: {
      ngModelFile: "&"
    },
    link: function(scope, element, attributes) {
      return element.bind("change", function(changeEvent) {
        var files, reader, results;
        reader = new FileReader;
        files = changeEvent.target.files;
        results = [];
        return (scope.ngModelFile || function() {})()(files);
      });
    }
  };
};

},{}],25:[function(require,module,exports){
var exports;

exports = module.exports = function($window) {
  return {
    scope: {
      ngScroll: "&"
    },
    link: function(scope, element, attributes) {
      return (angular.element($window)).bind("scroll", function(event) {
        var scrollFn;
        scrollFn = scope.ngScroll();
        if (typeof scrollFn === "function") {
          return scrollFn(event);
        }
      });
    }
  };
};

exports.$inject = ["$window"];

},{}],26:[function(require,module,exports){
var app;

console.log("[app] initializing");

app = angular.module("App", ["ui.router"]);

(require("./config"))(app);

(require("./controllers"))(app);

(require("./directives"))(app);

(require("./factories"))(app);

(require("./filters"))(app);

(require("./providers"))(app);

(require("./run"))(app);

(require("./services"))(app);

(require("./values"))(app);

},{"./config":1,"./controllers":9,"./directives":22,"./factories":29,"./filters":33,"./providers":40,"./run":42,"./services":49,"./values":53}],27:[function(require,module,exports){
var exports;

exports = module.exports = function($http, console, $storage) {
  return new ((function() {
    function _Class() {}

    _Class.prototype.name = "[model:category]";


    /*
    ## *getAll(callback):*
    This function returns an array of all the categories from the server. The
    callback function follows a node-style pattern and should look something like
    this.
    
      callback = function(error, categories) { LOGIC HERE };
     */

    _Class.prototype.getAll = function(callback) {
      return this.categories;
    };

    _Class.prototype.findBySlug = function(slug) {
      var cat, childcat, i, j, len, len1, ref, ref1;
      ref = this.categories;
      for (i = 0, len = ref.length; i < len; i++) {
        cat = ref[i];
        if (cat.slug === slug) {
          return cat;
        }
        if (cat.children != null) {
          ref1 = cat.children;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            childcat = ref1[j];
            if (childcat.slug === slug) {
              return childcat;
            }
          }
        }
      }
      return {};
    };

    _Class.prototype.findByParentId = function(id) {
      var cat, i, len, ref;
      ref = this.categories;
      for (i = 0, len = ref.length; i < len; i++) {
        cat = ref[i];
        if (cat.id === id) {
          return cat;
        }
      }
    };

    _Class.prototype.findByChildId = function(id) {
      var cat, child, i, j, len, len1, ref, ref1;
      ref = this.categories;
      for (i = 0, len = ref.length; i < len; i++) {
        cat = ref[i];
        if (cat.children != null) {
          ref1 = cat.children;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            child = ref1[j];
            if (child.id === id) {
              return child;
            }
          }
        }
      }
    };

    _Class.prototype._setCounters = function(counters) {
      var categoryCount, childCategory, i, j, len, len1, parentCategory, ref, ref1, results;
      ref = this.categories || [];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        parentCategory = ref[i];
        parentCategory.count = 0;
        ref1 = counters.parent_category || [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          categoryCount = ref1[j];
          if (categoryCount.id === parentCategory.id) {
            parentCategory.count = categoryCount.count;
            break;
          }
        }
        results.push((function() {
          var k, len2, ref2, results1;
          ref2 = parentCategory.children || [];
          results1 = [];
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            childCategory = ref2[k];
            childCategory.count = 0;
            results1.push((function() {
              var l, len3, ref3, results2;
              ref3 = counters.child_category || [];
              results2 = [];
              for (l = 0, len3 = ref3.length; l < len3; l++) {
                categoryCount = ref3[l];
                if (categoryCount.id === childCategory.id) {
                  childCategory.count = categoryCount.count;
                  break;
                } else {
                  results2.push(void 0);
                }
              }
              return results2;
            })());
          }
          return results1;
        })());
      }
      return results;
    };

    _Class.prototype.download = function() {
      var _fetchFromAPI, _getCounters, cache, exception;
      if (this.categories != null) {
        return;
      }
      console.log(this.name, "downloading categories");
      _getCounters = (function(_this) {
        return function(callback) {
          if (callback == null) {
            callback = function() {};
          }
          console.log(_this.name, "fetching category counters");
          return $http.get("/api/categories/counters").success(function(response) {
            console.log(_this.name, "fetched category counters");
            console.debug(_this.name, response);
            _this._setCounters(response);
            return callback(null, response);
          }).error(function(response) {
            callback(response);
            console.error(_this.name, "error fetching category counters");
            return console.error(_this.name, response);
          });
        };
      })(this);
      _fetchFromAPI = (function(_this) {
        return function() {
          return $http.get("/api/categories/").success(function(categories) {
            console.log(_this.name, "fetched categories from API");
            _this.categories = categories;
            return $storage.local("models:category", angular.toJson(categories));
          });
        };
      })(this);
      cache = $storage.local("models:category");
      if ((cache != null) && false) {
        console.log(this.name, "fetching categories from cache");
        try {
          this.categories = angular.fromJson(cache);
          _getCounters();
          return console.log(this.name, "fetched categories from cache");
        } catch (_error) {
          exception = _error;
          console.error(this.name, "can't parse categories from cache");
          return _fetchFromAPI().then(function() {
            return _getCounters();
          });
        }
      } else {
        console.log(this.name, "fetching categories from API");
        return _fetchFromAPI().then(function() {
          return _getCounters();
        });
      }
    };

    return _Class;

  })());
};

exports.$inject = ["$http", "$log", "$storage"];

},{}],28:[function(require,module,exports){
var exports;

exports = module.exports = function($location, $http, console) {
  return new ((function() {
    function _Class() {}

    _Class.prototype.name = "[model:classified]";

    _Class.prototype.defaults = {
      contact: {},
      images: [],
      meta: {}
    };

    _Class.prototype.statuses = {
      INACTIVE: 0,
      ACTIVE: 1,
      REJECTED: 2,
      ARCHIVED: 3,
      BANNED: 4,
      FLAGGED: 5,
      VERIFIED: 6,
      EXPIRED: 7
    };

    _Class.prototype.languages = {
      ENGLISH: 1,
      ARABIC: 2,
      HINDI: 3
    };

    _Class.prototype._serializeGET = function(obj) {
      var p, str;
      str = [];
      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push((encodeURIComponent(p)) + "=" + (encodeURIComponent(obj[p])));
        }
      }
      return str.join('&');
    };

    _Class.prototype.save = function(classified, callback) {
      var formdata, method, url;
      if (classified == null) {
        classified = {};
      }
      if (callback == null) {
        callback = function() {};
      }
      if (classified.id == null) {
        method = "POST";
        url = "/api/classifieds";
      } else {
        method = "PUT";
        url = "/api/classifieds/" + classified.id;
      }
      console.log(this.name, "sending classified to server [" + method + "]");
      console.debug(this.name, classified);
      formdata = this._getFormdata(classified);
      return $http({
        url: url,
        data: formdata,
        method: method,
        transformRequest: angular.identity,
        headers: {
          "Content-Type": void 0
        }
      }).success((function(_this) {
        return function(classified) {
          return callback(null, _this._parse(classified));
        };
      })(this)).error(function(response) {
        return callback(response);
      });
    };

    _Class.prototype.query = function(parameters, callback) {
      return $http.get("/api/classifieds?" + (this._serializeGET(parameters))).success((function(_this) {
        return function(classifieds) {
          var classified;
          return callback(null, (function() {
            var j, len, results;
            results = [];
            for (j = 0, len = classifieds.length; j < len; j++) {
              classified = classifieds[j];
              results.push(this._parse(classified));
            }
            return results;
          }).call(_this));
        };
      })(this)).error(callback);
    };

    _Class.prototype.get = function(id, callback) {
      return $http.get("/api/classifieds/" + id).success((function(_this) {
        return function(classified) {
          return callback(null, _this._parse(classified));
        };
      })(this)).error(callback);
    };

    _Class.prototype.getBySlug = function(slug, callback) {
      return $http.get("/api/classifieds/slug/" + slug).success((function(_this) {
        return function(classified) {
          return callback(null, _this._parse(classified));
        };
      })(this)).error(callback);
    };

    _Class.prototype.getDefault = function() {
      return this._parse(new function() {
        return this.defaults;
      });
    };

    _Class.prototype._parse = function(classified) {
      var URL, cl, image, j, len, ref, tweet;
      cl = {};
      angular.extend(cl, this.defaults, classified);
      URL = "https://" + ($location.host()) + "/" + cl.slug;
      tweet = "Check out this classified, " + URL;
      cl.social = {
        facebook: "https://www.facebook.com/sharer/sharer.php?u=" + URL,
        gplus: "https://plus.google.com/share?url=" + URL,
        twitter: "https://twitter.com/home?status=" + (encodeURI(tweet)),
        email: "mailto:?subject=Checkout this cl: '" + cl.title + "' &body=<your message>%0D%0A%0D%0Aurl: " + URL
      };
      ref = cl.images || [];
      for (j = 0, len = ref.length; j < len; j++) {
        image = ref[j];
        cl.mainImage = image;
        if ((image.main != null) && image.main) {
          break;
        }
      }
      switch (cl.status) {
        case this.statuses.ACTIVE:
          cl.isActive = true;
          break;
        case this.statuses.ARCHIVED:
          cl.isArchived = true;
          break;
        case this.statuses.REJECTED:
          cl.isRejected = true;
          break;
        case this.statuses.BANNED:
          cl.isBanned = true;
          break;
        case this.statuses.INACTIVE:
          cl.underReview = true;
          break;
        case this.statuses.EXPIRED:
          cl.hasExpired = true;
      }
      switch (cl.language) {
        case this.languages.ENGLISH:
          cl.isEnglish = true;
          break;
        case this.languages.ARABIC:
          cl.isArabic = true;
      }
      if (cl.meta.deliveryIncluded) {
        if (!cl.meta.freeDeliveryIncluded) {
          cl.hasDelivery = true;
        } else {
          cl.hasFreeDelivery = true;
        }
      }
      return cl;
    };

    _Class.prototype._getFormdata = function(classified) {
      var fileIndex, formdata, hasMainImage, image, images, j, len, newImages;
      fileIndex = 0;
      hasMainImage = false;
      newImages = [];
      images = classified.images || [];
      delete classified.images;
      formdata = new FormData;
      for (j = 0, len = images.length; j < len; j++) {
        image = images[j];
        if (image.status === "to-upload") {
          if (image.main) {
            hasMainImage = true;
          }
          formdata.append("images[]", image.file, image.file.name);
        } else if (image.status === "to-delete-from-server") {
          if (classified.filesToDelete == null) {
            classified.filesToDelete = [];
          }
          classified.filesToDelete.push(image.filename);
        }
        delete image.src;
        delete image.file;
        delete image.status;
      }
      if (!hasMainImage && newImages.length > 0) {
        newImages[0].main = true;
      }
      classified.new_images = newImages;
      classified.images = images;
      formdata.append("classified", angular.toJson(classified));
      return formdata;
    };

    _Class.prototype._dataURItoBlob = function(dataURI) {
      var base64ToBlob, matched;
      base64ToBlob = function(base64, contentType, sliceSize) {
        var byteArray, byteArrays, byteCharacters, byteNumbers, i, offset, slice;
        if (contentType == null) {
          contentType = "";
        }
        if (sliceSize == null) {
          sliceSize = 512;
        }
        byteCharacters = atob(base64);
        byteArrays = [];
        offset = 0;
        while (offset < byteCharacters.length) {
          slice = byteCharacters.slice(offset, offset + sliceSize);
          byteNumbers = new Array(slice.length);
          i = 0;
          while (i < slice.length) {
            byteNumbers[i] = slice.charCodeAt(i);
            i++;
          }
          byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
          offset += sliceSize;
        }
        return new Blob(byteArrays, {
          type: contentType
        });
      };
      matched = dataURI.match(/data:(\w+\/\w+);base64,(.+)/);
      return base64ToBlob(matched[2], matched[1]);
    };

    return _Class;

  })());
};

exports.$inject = ["$location", "$http", "$log"];

},{}],29:[function(require,module,exports){
module.exports = function(app) {
  console.log("[services] initializing");
  app.factory("model.categories", require("./categories"));
  app.factory("model.classifieds", require("./classifieds"));
  app.factory("model.locations", require("./locations"));
  return app.factory("model.users", require("./users"));
};

},{"./categories":27,"./classifieds":28,"./locations":30,"./users":31}],30:[function(require,module,exports){
var exports;

exports = module.exports = function($http, console, $storage) {
  return new ((function() {
    function _Class() {}

    _Class.prototype.name = "[model:location]";

    _Class.prototype.getAll = function(callback) {
      return this.locations;
    };

    _Class.prototype.findById = function(id) {
      var i, len, location, ref;
      ref = this.locations;
      for (i = 0, len = ref.length; i < len; i++) {
        location = ref[i];
        if (location.id === id) {
          return location;
        }
      }
    };

    _Class.prototype.download = function() {
      var _fetchFromAPI, cache, exception;
      if (this.locations != null) {
        return;
      }
      console.log(this.name, "downloading locations");
      _fetchFromAPI = (function(_this) {
        return function() {
          console.log(_this.name, "fetching locations from API");
          return $http.get("/api/locations").success(function(locations) {
            console.log(_this.name, "fetched locations from API");
            _this.locations = locations;
            return $storage.local("models:location", angular.toJson(locations));
          });
        };
      })(this);
      cache = $storage.local("models:location");
      if ((cache != null) && false) {
        console.log(this.name, "retrieving locations from cache");
        try {
          return this.locations = angular.fromJson(cache);
        } catch (_error) {
          exception = _error;
          return _fetchFromAPI();
        }
      } else {
        console.log(this.name, "retrieving locations from API");
        return _fetchFromAPI();
      }
    };

    return _Class;

  })());
};

exports.$inject = ["$http", "$log", "$storage"];

},{}],31:[function(require,module,exports){
var exports;

exports = module.exports = function($http, $root, console, $storage) {
  return new ((function() {
    _Class.prototype.name = "[model:user]";

    _Class.prototype.setCurrentUser = function(user) {
      return $storage.session("user:current", user);
    };

    _Class.prototype.getCurrentUser = function() {
      return (angular.fromJson($storage.session("user:current"))) || {};
    };

    _Class.prototype.isLoggedIn = function() {
      return this.getCurrentUser().id != null;
    };

    function _Class() {
      $root.$on("user:changed", (function(_this) {
        return function() {
          return _this.onUserChange();
        };
      })(this));
      if ($root.bodyClasses == null) {
        $root.bodyClasses = {};
      }
    }

    _Class.prototype.onUserChange = function(user) {
      return $root.bodyClasses["logged-in"] = this.isLoggedIn();
    };

    _Class.prototype.logout = function() {
      return $http.get("/api/auth/logout").success((function(_this) {
        return function(data, status) {
          console.log(_this.name, "user logged out");
          $storage.session("user:current", null);
          return $root.$broadcast("user:changed");
        };
      })(this));
    };

    _Class.prototype.download = function() {
      var _fetchFromAPI, cache, exception;
      _fetchFromAPI = (function(_this) {
        return function() {
          console.log(_this.name, "downloading user");
          return $http.get("/api/users/current").success(function(user) {
            console.log(_this.name, "fetched current user");
            console.debug(_this.name, user);
            $storage.session("user:current", angular.toJson(user));
            return $root.$broadcast("user:changed");
          });
        };
      })(this);
      cache = $storage.session("user:current");
      if (cache != null) {
        console.log(this.name, "retrieving current user from cache");
        try {
          angular.fromJson(cache);
          return $root.$broadcast("user:changed");
        } catch (_error) {
          exception = _error;
          return _fetchFromAPI();
        }
      } else {
        console.log(this.name, "retrieving current user from API");
        return _fetchFromAPI();
      }
    };

    return _Class;

  })());
};

exports.$inject = ["$http", "$rootScope", "$log", "$storage"];

},{}],32:[function(require,module,exports){
var exports;

exports = module.exports = function(Category) {
  return function(categoryId, type) {
    var category;
    switch (type) {
      case "parent":
        category = Category.findByParentId(categoryId);
        break;
      case "child":
        category = Category.findByChildId(categoryId);
    }
    return category.name;
  };
};

exports.$inject = ["model.categories"];

},{}],33:[function(require,module,exports){
module.exports = function(app) {
  console.log("[filters] initializing");
  app.filter("category", require("./category"));
  app.filter("link", require("./link"));
  app.filter("location", require("./location"));
  app.filter("prettydate", require("./prettydate"));
  app.filter("price", require("./price"));
  return app.filter("translate", require("./translate"));
};

},{"./category":32,"./link":34,"./location":35,"./prettydate":36,"./price":37,"./translate":38}],34:[function(require,module,exports){
module.exports = function() {
  return function(link) {
    var maxLength, result;
    maxLength = 50;
    if (link.length > maxLength) {
      link = (link.substring(0, maxLength)) + "...";
    }
    return result = link.replace(/.*?:\/\//g, "");
  };
};

},{}],35:[function(require,module,exports){
var exports;

exports = module.exports = function(Locations) {
  return function(locationId) {
    var location;
    location = Locations.findById(locationId);
    return location.name;
  };
};

exports.$inject = ["model.locations"];

},{}],36:[function(require,module,exports){
var createHandler, exports, getArabicNoun, prettify;

getArabicNoun = function(noun) {
  var dict;
  dict = {
    "second": "ثانية",
    "minute": "دقيقة",
    "hour": "ساعات",
    "day": "أيام",
    "week": "أسابيع",
    "month": "أشهر",
    "year": "سنوات"
  };
  return dict[noun];
};

createHandler = function(divisor, noun, restOfString) {
  return function(diff) {
    var n, pluralizedNoun;
    n = Math.floor(diff / divisor);
    pluralizedNoun = "" + noun + (n > 1 ? "s" : "");
    return n + " " + pluralizedNoun + " " + restOfString;
  };
};

prettify = function(date_raw) {
  var date, diff, formatters, i, now;
  formatters = [
    {
      threshold: 1,
      handler: function() {
        return "just now";
      }
    }, {
      threshold: 60,
      handler: createHandler(1, "second", "ago")
    }, {
      threshold: 3600,
      handler: createHandler(60, "minute", "ago")
    }, {
      threshold: 86400,
      handler: createHandler(3600, "hour", "ago")
    }, {
      threshold: 172800,
      handler: function() {
        return "yesterday";
      }
    }, {
      threshold: 604800,
      handler: createHandler(86400, "day", "ago")
    }, {
      threshold: 2592000,
      handler: createHandler(604800, "week", "ago")
    }, {
      threshold: 31536000,
      handler: createHandler(2592000, "month", "ago")
    }, {
      threshold: Infinity,
      handler: createHandler(31536000, "year", "ago")
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
  return "";
};

exports = module.exports = function() {
  return prettify;
};

},{}],37:[function(require,module,exports){
module.exports = function() {
  return function(price, priceType) {
    if (priceType === 0) {
      return "Free";
    }
    if (priceType === 1) {
      return "Contact Owner";
    }
    if (priceType) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD";
    }
  };
};

},{}],38:[function(require,module,exports){
module.exports = function() {
  return function(text) {
    return text.toUpperCase();
  };
};

},{}],39:[function(require,module,exports){
var exports;

exports = module.exports = function() {
  return new ((function() {
    function _Class() {}

    _Class.prototype.name = "[provider:environment]";

    _Class.prototype.config = {};

    _Class.prototype.get = function(key) {
      return config["" + key];
    };

    _Class.prototype.$get = [
      "$window", "$log", "$base64", function($window, console, $base64) {
        var config, e;
        console.log(this.name, "initializing");
        console.log(this.name, "decoding server-side data");
        try {
          config = {};
          angular.extend(config, $window.publicData, angular.fromJson($base64.decode($window.cryptedData)));
          this.config = config;
          return console.debug(this.name, this.config);
        } catch (_error) {
          e = _error;
          console.error(this.name, "error decoding server-side data");
          return console.error(e);
        }
      }
    ];

    return _Class;

  })());
};

},{}],40:[function(require,module,exports){
module.exports = function(app) {
  console.log("[providers] initializing");
  return app.provider("$environment", require("./environment"));
};

},{"./environment":39}],41:[function(require,module,exports){
var exports;

exports = module.exports = function($state, $rootScope, $window, console) {
  return $rootScope.$on("$viewContentLoaded", function() {
    var state, to;
    state = $state.$current;
    if (!(typeof state.scrollTo === "function" ? state.scrollTo($window.scrollTo(0, 0)) : void 0)) {

    } else {
      return;
      to = 0;
      if (state.scrollTo.id !== void 0) {
        to = $(state.scrollTo.id).offset().top;
      }
      if ($($window).scrollTop() === to) {
        return;
      }
      if (state.scrollTo.animated) {
        return $(document.body).animate({
          scrollTop: to
        });
      } else {
        return $window.scrollTo(0, to);
      }
    }
  });
};

exports.$inject = ["$state", "$rootScope", "$window", "$log"];

},{}],42:[function(require,module,exports){
module.exports = function(app) {
  console.log("[app] preparing run stages");
  app.run(require("./anchorScroll"));
  return app.run(require("./stateChange"));
};

},{"./anchorScroll":41,"./stateChange":43}],43:[function(require,module,exports){
var exports;

exports = module.exports = function($root, console, $storage) {
  var body;
  body = document.body;
  if ($root.bodyClasses == null) {
    $root.bodyClasses = {};
  }
  $root.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    var bodyid;
    $root.bodyStyles = {};
    $root.bodyClasses.loading = true;
    console.log("[router] switching from '" + fromState.name + "' to '" + toState.name + "'");
    if (toState.templateUrl != null) {
      bodyid = toState.templateUrl.replace("/", "-");
      return body.id = bodyid;
    }
  });
  return $root.$on("page-loaded", function() {
    return setTimeout(function() {
      return $root.$apply(function() {
        return $root.bodyClasses.loading = false;
      });
    });
  });
};

exports.$inject = ["$rootScope", "$log", "$storage"];

},{}],44:[function(require,module,exports){

/**
 * Copyright (c) 2010 Nick Galbreath, Steven Enamakel
 * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * base64 encode/decode compatible with window.btoa/atob
 *
 * window.atob/btoa is a Firefox extension to convert binary data (the "b")
 * to base64 (ascii, the "a").
 *
 * It is also found in Safari and Chrome.  It is not available in IE.
 *
 * if (!window.btoa) window.btoa = base64.encode
 * if (!window.atob) window.atob = base64.decode
 *
 * The original specs for atob/btoa are a bit lacking
 * https://developer.mozilla.org/en/DOM/window.atob
 * https://developer.mozilla.org/en/DOM/window.btoa
 *
 * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
 * If any character is not [0,255], then an DOMException(5) is thrown.
 *
 * window.atob and base64.decode take a base64-encoded string
 * If the input length is not a multiple of 4, or contains invalid characters
 *   then an DOMException(5) is thrown.
 */
var exports;

exports = module.exports = function($window) {
  return new ((function() {
    function _Class() {}

    _Class.prototype.PADCHAR = "=";

    _Class.prototype.ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    _Class.prototype.makeDOMException = function() {
      var ex, tmp;
      try {
        return new DOMException(DOMException.INVALID_CHARACTER_ERR);
      } catch (_error) {
        tmp = _error;
        ex = new Error("DOM Exception 5");
        ex.code = ex.number = 5;
        ex.name = ex.description = "INVALID_CHARACTER_ERR";
        return ex.toString = function() {
          return "Error: " + ex.name + ": " + ex.message;
        };
      }
    };

    _Class.prototype.getbyte64 = function(s, i) {
      var idx;
      idx = this.ALPHA.indexOf(s.charAt(i));
      if (idx === -1) {
        throw this.makeDOMException();
      }
      return idx;
    };

    _Class.prototype.decode = function(s) {
      var b10, i, imax, pads, x;
      s = "" + s;
      imax = s.length;
      if (imax === 0) {
        return s;
      }
      if (imax % 4 === !0) {
        throw this.makeDOMException();
      }
      pads = 0;
      if ((s.charAt(imax - 1)) === this.PADCHAR) {
        pads = 1;
        if ((s.charAt(imax - 2)) === this.PADCHAR) {
          pads = 2;
        }
        imax -= 4;
      }
      x = [];
      i = 0;
      while (i < imax) {
        b10 = (this.getbyte64(s, i)) << 18 | (this.getbyte64(s, i + 1)) << 12 | (this.getbyte64(s, i + 2)) << 6 | (this.getbyte64(s, i + 3));
        x.push(String.fromCharCode(b10 >> 16, b10 >> 8 & 0xff, b10 & 0xff));
        i += 4;
      }
      switch (pads) {
        case 1:
          b10 = (this.getbyte64(s, i)) << 18 | (this.getbyte64(s, i + 1)) << 12 | (this.getbyte64(s, i + 2)) << 6;
          x.push(String.fromCharCode(b10 >> 16, b10 >> 8 & 0xff));
          break;
        case 2:
          b10 = (this.getbyte64(s, i)) << 18 | (this.getbyte64(s, i + 1)) << 12;
          x.push(String.fromCharCode(b10 >> 16));
      }
      return x.join("");
    };

    return _Class;

  })());
};

this.getbyte = function(s, i) {
  var x;
  x = s.charCodeAt(i);
  if (x > 255) {
    throw this.makeDOMException();
  }
  return x;
};

this.encode = function(s) {
  var b10, i, imax, x;
  if (arguments.length !== 1) {
    throw new SyntaxError("Not enough arguments");
  }
  x = [];
  s = "" + s;
  imax = s.length - s.length % 3;
  if (s.length === 0) {
    return s;
  }
  i = 0;
  while (i < imax) {
    b10 = (this.getbyte(s, i)) << 16 | (this.getbyte(s, i + 1)) << 8 | (this.getbyte(s, i + 2));
    x.push(this.ALPHA.charAt(b10 >> 18));
    x.push(this.ALPHA.charAt(b10 >> 12 & 0x3F));
    x.push(this.ALPHA.charAt(b10 >> 6 & 0x3f));
    x.push(this.ALPHA.charAt(b10 & 0x3f));
    i += 3;
  }
  switch (s.length - imax) {
    case 1:
      b10 = (this.getbyte(s, i)) << 16;
      x.push((this.ALPHA.charAt(b10 >> 18)) + (this.ALPHA.charAt(b10 >> 12 & 0x3F)) + this.PADCHAR + this.PADCHAR);
      break;
    case 2:
      b10 = (this.getbyte(s, i)) << 16 | (this.getbyte(s, i + 1)) << 8;
      x.push((this.ALPHA.charAt(b10 >> 18)) + (this.ALPHA.charAt(b10 >> 12 & 0x3F)) + (this.ALPHA.charAt(b10 >> 6 & 0x3f)) + this.PADCHAR);
  }
  return x.join("");
};

exports.$inject = ["$window"];

},{}],45:[function(require,module,exports){
var exports;

exports = module.exports = function($window) {
  return {
    name: "[facebook]",
    hasLoaded: false,
    onLoad: function(callback) {
      var waitForElement;
      if (callback == null) {
        callback = function() {};
      }
      waitForElement = function() {
        if ($window.FB != null) {
          return callback();
        } else {
          return setTimeout((function() {
            return waitForElement();
          }), 250);
        }
      };
      return waitForElement();
    }
  };
};

exports.$inject = ["$window"];

},{}],46:[function(require,module,exports){
var exports;

exports = module.exports = function($window) {
  return new ((function() {
    _Class.prototype.name = "[service:google-maps]";

    function _Class() {
      var $fileref, APIkey, head, url;
      console.log(this.name, "initializing");
      APIkey = "AIzaSyBUcoOW5jw2GvlFQI49FIGl6I7czXcX5iQ";
      url = "https://maps.googleapis.com/maps/api/js?key=" + APIkey + "&callback=initializeGmap";
      $fileref = document.createElement("script");
      $fileref.type = "text/javascript";
      $fileref.src = url;
      head = (document.getElementsByTagName("head"))[0];
      head.insertBefore($fileref, head.firstChild);
    }

    _Class.prototype.onLoad = function(callback) {
      var waitForElement;
      if (callback == null) {
        callback = function() {};
      }
      waitForElement = function() {
        if (($window.google != null) && ($window.google.maps != null) && ($window.google.maps.Circle != null)) {
          return callback();
        } else {
          return setTimeout((function() {
            return waitForElement();
          }), 250);
        }
      };
      return waitForElement();
    };

    _Class.prototype.defaultStyle = [
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f7f1df"
          }
        ]
      }, {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#d0e3b4"
          }
        ]
      }, {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fbd3da"
          }
        ]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#bde6ab"
          }
        ]
      }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffe15f"
          }
        ]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#efd151"
          }
        ]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "black"
          }
        ]
      }, {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#cfb2db"
          }
        ]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#a2daf2"
          }
        ]
      }
    ];

    return _Class;

  })());
};

exports.$inject = ["$window"];

},{}],47:[function(require,module,exports){
var exports;

exports = module.exports = function($window) {
  return {
    name: "[google-recaptcha]",
    onLoad: function(callback) {
      var waitForElement;
      if (callback == null) {
        callback = function() {};
      }
      waitForElement = function() {
        if ($window.grecaptcha != null) {
          return callback();
        } else {
          return setTimeout((function() {
            return waitForElement();
          }), 250);
        }
      };
      return waitForElement();
    }
  };
};

exports.$inject = ["$window"];

},{}],48:[function(require,module,exports){
module.exports = function() {
  return {

    /*
    This function creates the thumbnail from the given file with the given
    options. The options will have three arguments:
      thumbnailWidth: Target width for thumbnail
      thumbnailHeight: Target height for thumbnail
      callback: A callback function which receives the imageData of the new
      thumbnail.
     */
    createThumbnail: function(file, options) {
      var fileReader;
      if (options == null) {
        options = {};
      }
      fileReader = new FileReader;
      fileReader.onload = (function(_this) {
        return function() {
          if (file.type === "image/svg+xml") {
            if (options.callback != null) {
              options.callback(fileReader.result);
            }
            return;
          }
          return _this.createThumbnailFromUrl(file, fileReader.result, options);
        };
      })(this);
      return fileReader.readAsDataURL(file);
    },
    createThumbnailFromUrl: function(file, imageUrl, options) {
      var img;
      img = document.createElement("img");
      img.onload = (function(_this) {
        return function() {
          var canvas, ctx, ref, ref1, ref2, ref3, resizeInfo, thumbnail;
          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.resize(file, options);
          if (resizeInfo.trgWidth == null) {
            resizeInfo.trgWidth = resizeInfo.optWidth;
          }
          if (resizeInfo.trgHeight == null) {
            resizeInfo.trgHeight = resizeInfo.optHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          _this.drawImageIOSFix(ctx, img, (ref = resizeInfo.srcX) != null ? ref : 0, (ref1 = resizeInfo.srcY) != null ? ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (ref2 = resizeInfo.trgX) != null ? ref2 : 0, (ref3 = resizeInfo.trgY) != null ? ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          _this.thumbnailCreated(file, thumbnail);
          if (options.callback != null) {
            return options.callback(thumbnail);
          }
        };
      })(this);
      if (typeof callback !== "undefined" && callback !== null) {
        img.onerror = callback;
      }
      return img.src = imageUrl;
    },
    thumbnailCreated: function(file, dataUrl) {
      var i, len, ref, thumbnailElement;
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
        for (i = 0, len = ref.length; i < len; i++) {
          thumbnailElement = ref[i];
          thumbnailElement.alt = file.name;
          thumbnailElement.src = dataUrl;
        }
        return setTimeout(((function(_this) {
          return function() {
            return file.previewElement.classList.add("dz-image-preview");
          };
        })(this)), 1);
      }
    },
    resize: function(file, options) {
      var info, srcRatio, trgRatio;
      info = {
        srcX: 0,
        srcY: 0,
        srcWidth: file.width,
        srcHeight: file.height
      };
      srcRatio = file.width / file.height;
      info.optWidth = options.thumbnailWidth || 300;
      info.optHeight = options.thumbnailHeight || 300;
      if ((info.optWidth == null) && (info.optHeight == null)) {
        info.optWidth = info.srcWidth;
        info.optHeight = info.srcHeight;
      } else if (info.optWidth == null) {
        info.optWidth = srcRatio * info.optHeight;
      } else if (info.optHeight == null) {
        info.optHeight = (1 / srcRatio) * info.optWidth;
      }
      trgRatio = info.optWidth / info.optHeight;
      if (file.height < info.optHeight || file.width < info.optWidth) {
        info.trgHeight = info.srcHeight;
        info.trgWidth = info.srcWidth;
      } else {
        if (srcRatio > trgRatio) {
          info.srcHeight = file.height;
          info.srcWidth = info.srcHeight * trgRatio;
        } else {
          info.srcWidth = file.width;
          info.srcHeight = info.srcWidth / trgRatio;
        }
      }
      info.srcX = (file.width - info.srcWidth) / 2;
      info.srcY = (file.height - info.srcHeight) / 2;
      return info;
    },
    detectVerticalSquash: function(img) {
      var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
      iw = img.naturalWidth;
      ih = img.naturalHeight;
      canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = ih;
      ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      data = (ctx.getImageData(0, 0, 1, ih)).data;
      sy = 0;
      ey = ih;
      py = ih;
      while (py > sy) {
        alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
          ey = py;
        } else {
          sy = py;
        }
        py = (ey + sy) >> 1;
      }
      ratio = py / ih;
      if (ratio === 0) {
        return 1;
      } else {
        return ratio;
      }
    },
    drawImageIOSFix: function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
      var vertSquashRatio;
      vertSquashRatio = this.detectVerticalSquash(img);
      return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
    }
  };
};

},{}],49:[function(require,module,exports){
module.exports = function(app) {
  console.log("[services] initializing");
  app.service("$facebook", require("./facebook.sdk"));
  app.service("$googleMaps", require("./google.maps"));
  app.service("$googleRecaptcha", require("./google.recaptcha"));
  app.service("$base64", require("./base64"));
  app.service("$imageResizer", require("./imageResizer"));
  app.service("$notifications", require("./notifications"));
  app.service("$scroller", require("./scroller"));
  return app.service("$storage", require("./storage"));
};

},{"./base64":44,"./facebook.sdk":45,"./google.maps":46,"./google.recaptcha":47,"./imageResizer":48,"./notifications":50,"./scroller":51,"./storage":52}],50:[function(require,module,exports){
var exports;

exports = module.exports = function($http, $root, console, $storage) {
  return new ((function() {
    _Class.prototype.name = "[service:notifications]";

    function _Class() {
      console.log(this.name, "initializing");
    }

    _Class.prototype.getAll = function() {};

    _Class.prototype.create = function(message, type) {
      if (type == null) {
        type = "success";
      }
      return $root.$broadcast("notification", {
        text: message,
        type: type,
        hasRead: false,
        flash: true
      });
    };

    _Class.prototype.error = function(message) {
      return this.create(message, "error");
    };

    _Class.prototype.success = function(message) {
      return this.create(message, "success");
    };

    _Class.prototype.warn = function(message) {
      return this.create(message, "warn");
    };

    return _Class;

  })());
};

exports.$inject = ["$http", "$rootScope", "$log", "$storage"];

},{}],51:[function(require,module,exports){
var exports;

exports = module.exports = function($window, console) {
  return {
    name: "[scroller]",
    scrollTo: function(eID) {
      var avail, body, documentHeight, elmYPosition, html, isAnimating, onAnimationEnd, scroll, windowHeight, windowScrollTop;
      return;
      console.log(this.name, "scrolling to #" + eID);
      isAnimating = true;
      html = document.documentElement;
      body = document.body;
      documentHeight = Math.max(body.clientHeight, body.offsetHeight, body.scrollHeight, html.clientHeight, html.offsetHeight, html.scrollHeight);
      windowHeight = $window.innerHeight;
      windowScrollTop = ($window.pageYOffset || html.scrollTop) - (html.clientTop || 0);
      elmYPosition = function(eID) {
        var elm, node, y;
        elm = document.getElementById(eID);
        y = elm.offsetTop;
        node = elm;
        while (node.offsetParent && node.offsetParent !== document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
        }
        return y;
      };
      avail = documentHeight - windowHeight;
      scroll = elmYPosition(eID);
      if (scroll > avail) {
        scroll = avail;
      }
      html.style.transition = "1s ease-in-out";
      html.style.marginTop = (windowScrollTop - scroll) + "px";
      onAnimationEnd = function(event) {
        if (event.currentTarget === event.target && isAnimating) {
          body.scrollTop = scroll;
          html.style.transition = "";
          html.style.marginTop = "";
          return isAnimating = false;
        }
      };
      html.addEventListener("webkitTransitionEnd", onAnimationEnd);
      html.addEventListener("transitionend", onAnimationEnd);
      return html.addEventListener("oTransitionEnd", onAnimationEnd);
    }
  };
};

exports.$inject = ["$window", "$log"];

},{}],52:[function(require,module,exports){

/*
  This service offers an interface to three kinds of storage. Temporary, local
  and session.

  Temporary storage: Use this to save objects that only need to live within the
  lifetime of the current window/tab.

  Local storage: Use this to save objects that only need to live forever. They
  don't get erased unless the user decides to clear the browser's saved data.

  Session storage: Use this to save objects that only need to withing the
  current session. They get erased when the user closes the browser.
 */
var exports;

exports = module.exports = function($window, console, $environment) {
  return new ((function() {
    _Class.prototype.name = "[service:storage]";

    function _Class() {
      console.log(this.name, "initializing");
      console.log(this.name, "setting up temporary storage");
      this.tmp = this._createFallbackStorage();
      console.log(this.name, "setting up local and session storage");
      if (this._supportsHTML5storage()) {
        this.local = (function(_this) {
          return function(key, value) {
            return _this._operate(localStorage, key, value);
          };
        })(this);
        this.session = (function(_this) {
          return function(key, value) {
            return _this._operate(sessionStorage, key, value);
          };
        })(this);
      } else {
        console.warn(this.name, "using fallback storages for local and session");
        this.local = this._createFallbackStorage();
        this.session = this._createFallbackStorage();
      }
    }

    _Class.prototype._operate = function(storage, key, value) {
      if (key === null && value === null) {
        return storage.clear();
      } else if (typeof value === "undefined") {
        return storage.getItem(key);
      } else if (value != null) {
        return storage.setItem(key, value);
      } else {
        return storage.removeItem(key);
      }
    };

    _Class.prototype._createFallbackStorage = function() {
      var fn;
      fn = function(key, value) {
        if (key === null && value === null) {
          this.privateData = {};
        }
        if (typeof value === "undefined") {
          return this.privateData[key];
        } else {
          if (value != null) {
            return this.privateData[key] = value;
          } else {
            return delete this.privateData[key];
          }
        }
      };
      fn.privateData = {};
      return fn;
    };

    _Class.prototype._supportsHTML5storage = function() {
      var e;
      try {
        return $window["localStorage"] != null;
      } catch (_error) {
        e = _error;
        return false;
      }
    };

    return _Class;

  })());
};

exports.$inject = ["$window", "$log", "$environment"];

},{}],53:[function(require,module,exports){
module.exports = function(app) {
  console.log("[app] settings values");
  app.value("$anchorScroll", angular.noop);
  return app.value("$log", console);
};

},{}]},{},[26])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWNvZmZlZWlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiY29uZmlnL2luZGV4LmNvZmZlZSIsImNvbmZpZy9yb3V0ZXIuY29mZmVlIiwiY29uZmlnL3RlbXBsYXRlQ2FjaGVEZWNvcmF0b3IuY29mZmVlIiwiY29udHJvbGxlcnMvY29tcG9uZW50cy9jYXRlZ29yeS1saXN0LmNvZmZlZSIsImNvbnRyb2xsZXJzL2NvbXBvbmVudHMvY2xhc3NpZmllZC1mb3JtLmNvZmZlZSIsImNvbnRyb2xsZXJzL2NvbXBvbmVudHMvY2xhc3NpZmllZC1saXN0LmNvZmZlZSIsImNvbnRyb2xsZXJzL2NvbXBvbmVudHMvY2xhc3NpZmllZC1zaW5nbGUuY29mZmVlIiwiY29udHJvbGxlcnMvY29tcG9uZW50cy9oZWFkZXIuY29mZmVlIiwiY29udHJvbGxlcnMvaW5kZXguY29mZmVlIiwiY29udHJvbGxlcnMvbWFzdGVyLmNvZmZlZSIsImNvbnRyb2xsZXJzL3BhZ2VzLzQwNC5jb2ZmZWUiLCJjb250cm9sbGVycy9wYWdlcy9hY2NvdW50L2luZGV4LmNvZmZlZSIsImNvbnRyb2xsZXJzL3BhZ2VzL2FjY291bnQvbWFuYWdlLmNvZmZlZSIsImNvbnRyb2xsZXJzL3BhZ2VzL2F1dGgvaW5kZXguY29mZmVlIiwiY29udHJvbGxlcnMvcGFnZXMvYXV0aC9sb2dvdXQuY29mZmVlIiwiY29udHJvbGxlcnMvcGFnZXMvY2xhc3NpZmllZC9lZGl0LmNvZmZlZSIsImNvbnRyb2xsZXJzL3BhZ2VzL2NsYXNzaWZpZWQvZmluaXNoLmNvZmZlZSIsImNvbnRyb2xsZXJzL3BhZ2VzL2NsYXNzaWZpZWQvcG9zdC5jb2ZmZWUiLCJjb250cm9sbGVycy9wYWdlcy9jbGFzc2lmaWVkL3NlYXJjaC5jb2ZmZWUiLCJjb250cm9sbGVycy9wYWdlcy9jbGFzc2lmaWVkL3NpbmdsZS5jb2ZmZWUiLCJjb250cm9sbGVycy9wYWdlcy9sYW5kaW5nLmNvZmZlZSIsImRpcmVjdGl2ZXMvaW5kZXguY29mZmVlIiwiZGlyZWN0aXZlcy9uZ0ltYWdlTG9hZGVyLmNvZmZlZSIsImRpcmVjdGl2ZXMvbmdNb2RlbEZpbGUuY29mZmVlIiwiZGlyZWN0aXZlcy9uZ1Njcm9sbC5jb2ZmZWUiLCJlbnRyeS5jb2ZmZWUiLCJmYWN0b3JpZXMvY2F0ZWdvcmllcy5jb2ZmZWUiLCJmYWN0b3JpZXMvY2xhc3NpZmllZHMuY29mZmVlIiwiZmFjdG9yaWVzL2luZGV4LmNvZmZlZSIsImZhY3Rvcmllcy9sb2NhdGlvbnMuY29mZmVlIiwiZmFjdG9yaWVzL3VzZXJzLmNvZmZlZSIsImZpbHRlcnMvY2F0ZWdvcnkuY29mZmVlIiwiZmlsdGVycy9pbmRleC5jb2ZmZWUiLCJmaWx0ZXJzL2xpbmsuY29mZmVlIiwiZmlsdGVycy9sb2NhdGlvbi5jb2ZmZWUiLCJmaWx0ZXJzL3ByZXR0eWRhdGUuY29mZmVlIiwiZmlsdGVycy9wcmljZS5jb2ZmZWUiLCJmaWx0ZXJzL3RyYW5zbGF0ZS5jb2ZmZWUiLCJwcm92aWRlcnMvZW52aXJvbm1lbnQuY29mZmVlIiwicHJvdmlkZXJzL2luZGV4LmNvZmZlZSIsInJ1bi9hbmNob3JTY3JvbGwuY29mZmVlIiwicnVuL2luZGV4LmNvZmZlZSIsInJ1bi9zdGF0ZUNoYW5nZS5jb2ZmZWUiLCJzZXJ2aWNlcy9iYXNlNjQuY29mZmVlIiwic2VydmljZXMvZmFjZWJvb2suc2RrLmNvZmZlZSIsInNlcnZpY2VzL2dvb2dsZS5tYXBzLmNvZmZlZSIsInNlcnZpY2VzL2dvb2dsZS5yZWNhcHRjaGEuY29mZmVlIiwic2VydmljZXMvaW1hZ2VSZXNpemVyLmNvZmZlZSIsInNlcnZpY2VzL2luZGV4LmNvZmZlZSIsInNlcnZpY2VzL25vdGlmaWNhdGlvbnMuY29mZmVlIiwic2VydmljZXMvc2Nyb2xsZXIuY29mZmVlIiwic2VydmljZXMvc3RvcmFnZS5jb2ZmZWUiLCJ2YWx1ZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG4gIGNvbnNvbGUubG9nKFwiW2FwcF0gcHJlcGFyaW5nIGNvbmZpZyBzdGFnZXNcIik7XG4gIGFwcC5jb25maWcocmVxdWlyZShcIi4vcm91dGVyXCIpKTtcbiAgcmV0dXJuIGFwcC5jb25maWcocmVxdWlyZShcIi4vdGVtcGxhdGVDYWNoZURlY29yYXRvclwiKSk7XG59O1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHVybE1hdGNoZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICB2YXIgX3JvdXRlLCBpbmRleDtcbiAgJHVybE1hdGNoZXIuc3RyaWN0TW9kZShmYWxzZSk7XG4gIGluZGV4ID0gMDtcbiAgX3JvdXRlID0gZnVuY3Rpb24ocGFnZSwgcm91dGUpIHtcbiAgICByZXR1cm4gJHN0YXRlUHJvdmlkZXIuc3RhdGUocGFnZSArIFwiLVwiICsgKGluZGV4KyspLCB7XG4gICAgICBjb250cm9sbGVyOiBcInBhZ2U6XCIgKyBwYWdlLFxuICAgICAgdGVtcGxhdGVVcmw6IFwiXCIgKyBwYWdlLFxuICAgICAgdXJsOiByb3V0ZSxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgY2F0ZWdvcmllczogW1xuICAgICAgICAgIFwibW9kZWwuY2F0ZWdvcmllc1wiLCBmdW5jdGlvbihjYXRlZ29yeSkge1xuICAgICAgICAgICAgcmV0dXJuIGNhdGVnb3J5LmRvd25sb2FkKCk7XG4gICAgICAgICAgfVxuICAgICAgICBdLFxuICAgICAgICB1c2VyOiBbXG4gICAgICAgICAgXCJtb2RlbC51c2Vyc1wiLCBmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlci5kb3dubG9hZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcbiAgICAgICAgbG9jYXRpb246IFtcbiAgICAgICAgICBcIm1vZGVsLmxvY2F0aW9uc1wiLCBmdW5jdGlvbihsb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2F0aW9uLmRvd25sb2FkKCk7XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIF9yb3V0ZShcImxhbmRpbmdcIiwgXCIvXCIpO1xuICBfcm91dGUoXCJhY2NvdW50L2luZGV4XCIsIFwiL2FjY291bnRcIik7XG4gIF9yb3V0ZShcImFjY291bnQvbWFuYWdlXCIsIFwiL2FjY291bnQvbWFuYWdlXCIpO1xuICBfcm91dGUoXCJhdXRoL2luZGV4XCIsIFwiL2F1dGhcIik7XG4gIF9yb3V0ZShcImF1dGgvbG9nb3V0XCIsIFwiL2F1dGgvbG9nb3V0XCIpO1xuICBfcm91dGUoXCJndWVzdC9wb3N0XCIsIFwiL2d1ZXN0L3Bvc3RcIik7XG4gIF9yb3V0ZShcImNsYXNzaWZpZWQvZmluaXNoXCIsIFwiL2NsYXNzaWZpZWQvZmluaXNoL3tpZDpbMC05XSt9XCIpO1xuICBfcm91dGUoXCJjbGFzc2lmaWVkL2VkaXRcIiwgXCIvY2xhc3NpZmllZC9lZGl0L3tpZDpbMC05XSt9XCIpO1xuICBfcm91dGUoXCJjbGFzc2lmaWVkL3Bvc3RcIiwgXCIvY2xhc3NpZmllZC9wb3N0XCIpO1xuICBfcm91dGUoXCJjbGFzc2lmaWVkL3NlYXJjaFwiLCBcIi9jbGFzc2lmaWVkXCIpO1xuICBfcm91dGUoXCJjbGFzc2lmaWVkL3NlYXJjaFwiLCBcIi9jbGFzc2lmaWVkL3twYXJlbnQ6W14vXSt9XCIpO1xuICBfcm91dGUoXCJjbGFzc2lmaWVkL3NlYXJjaFwiLCBcIi9jbGFzc2lmaWVkL3twYXJlbnQ6W14vXSt9L3tjaGlsZDpbXi9dK31cIik7XG4gIF9yb3V0ZShcImNsYXNzaWZpZWQvc2luZ2xlXCIsIFwiL3tzbHVnOlteL10rfVwiKTtcbiAgX3JvdXRlKFwiNDA0XCIsIFwiKnBhZ2VcIik7XG4gIHJldHVybiAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgcmVxdWlyZUJhc2VzOiBmYWxzZVxuICB9KTtcbn07XG5cbmV4cG9ydHMuJGluamVjdCA9IFtcIiRzdGF0ZVByb3ZpZGVyXCIsIFwiJGxvY2F0aW9uUHJvdmlkZXJcIiwgXCIkdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlclwiLCBcIiR1cmxSb3V0ZXJQcm92aWRlclwiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkcHJvdmlkZSkge1xuICB2YXIgZGVjb3JhdG9yO1xuICBkZWNvcmF0b3IgPSBmdW5jdGlvbigkZGVsZWdhdGUsICRzbmlmZmVyKSB7XG4gICAgdmFyIG9yaWdpbmFsR2V0O1xuICAgIG9yaWdpbmFsR2V0ID0gJGRlbGVnYXRlLmdldDtcbiAgICAkZGVsZWdhdGUuZ2V0ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgdmFsdWU7XG4gICAgICB2YWx1ZSA9IG9yaWdpbmFsR2V0KGtleSk7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIGlmIChKU1Rba2V5XSAhPSBudWxsKSB7XG4gICAgICAgICAgdmFsdWUgPSBKU1Rba2V5XSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICRkZWxlZ2F0ZS5wdXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIHJldHVybiAkZGVsZWdhdGU7XG4gIH07XG4gIHRoaXM7XG4gIGRlY29yYXRvci4kaW5qZWN0ID0gW1wiJGRlbGVnYXRlXCIsIFwiJHNuaWZmZXJcIl07XG4gIHJldHVybiAkcHJvdmlkZS5kZWNvcmF0b3IoXCIkdGVtcGxhdGVDYWNoZVwiLCBkZWNvcmF0b3IpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHByb3ZpZGVcIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGNvbnNvbGUsIENhdGVnb3JpZXMpIHtcbiAgdmFyICRlbCwgY2F0ZWdvcmllcywgY2F0ZWdvcnksIGksIGxlbiwgbWFzb25yeTtcbiAgdGhpcy5uYW1lID0gXCJbY29tcG9uZW50OmNhdGVnb3J5LWxpc3RdXCI7XG4gIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJpbml0aWFsaXppbmdcIik7XG4gICRzY29wZS5jYXRlZ29yaWVzID0gW107XG4gICRlbCA9IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhdGVnb3JpZXMtbGlzdFwiKSk7XG4gIG1hc29ucnkgPSBuZXcgTWFzb25yeSgkZWxbMF0sIHtcbiAgICB0cmFuc2l0aW9uRHVyYXRpb246IDBcbiAgfSk7XG4gICRzY29wZS4kd2F0Y2goKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAkZWxbMF0uY2hpbGRFbGVtZW50Q291bnQ7XG4gIH0pLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY2hpbGQsIGksIGxlbiwgcmVmO1xuICAgICAgcmVmID0gJGVsWzBdLmNoaWxkcmVuO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNoaWxkID0gcmVmW2ldO1xuICAgICAgICBtYXNvbnJ5LmFwcGVuZGVkKGNoaWxkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXNvbnJ5LmxheW91dCgpO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgY2F0ZWdvcmllcyA9IENhdGVnb3JpZXMuZ2V0QWxsKCk7XG4gIGZvciAoaSA9IDAsIGxlbiA9IGNhdGVnb3JpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjYXRlZ29yeSA9IGNhdGVnb3JpZXNbaV07XG4gICAgY2F0ZWdvcnkuc3ByaXRlID0gKGNhdGVnb3J5Lm5hbWUucmVwbGFjZShcIixcIiwgXCIgXCIpKS5zcGxpdChcIiBcIilbMF0udG9Mb3dlckNhc2UoKTtcbiAgICBjYXRlZ29yeS5leHRyYUNsYXNzID0gXCJcIjtcbiAgICBjYXRlZ29yeS50b2dnbGVDaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5leHRyYUNsYXNzID0gdGhpcy5leHRyYUNsYXNzID09PSBcInNob3ctY2hpbGRyZW5cIiA/IFwiXCIgOiBcInNob3ctY2hpbGRyZW5cIjtcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG1hc29ucnkubGF5b3V0KCk7XG4gICAgICB9KSwgMTAwKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAkc2NvcGUuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXM7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgXCIkbG9nXCIsIFwibW9kZWwuY2F0ZWdvcmllc1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsICRnb29nbGVNYXBzLCAkaW1hZ2VSZXNpemVyLCAkbG9jYXRpb24sICRub3RpZmljYXRpb25zLCBjb25zb2xlLCBDbGFzc2lmaWVkcywgQ2F0ZWdvcmllcywgTG9jYXRpb25zKSB7XG4gIHZhciBvbkRlc2NyaXB0aW9uQ2hhbmdlLCBvblRpdGxlQ2hhbmdlO1xuICB0aGlzLm5hbWUgPSBcIltjb21wb25lbnQ6Y2xhc3NpZmllZC1mb3JtXVwiO1xuICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiaW5pdGlhbGl6aW5nXCIpO1xuICAkc2NvcGUuY2F0ZWdvcmllcyA9IENhdGVnb3JpZXMuZ2V0QWxsKCk7XG4gICRzY29wZS5sb2NhdGlvbnMgPSBMb2NhdGlvbnMuZ2V0QWxsKCk7XG4gIGlmICgkc2NvcGUub25TdWNjZXNzID09IG51bGwpIHtcbiAgICAkc2NvcGUub25TdWNjZXNzID0gZnVuY3Rpb24oKSB7fTtcbiAgfVxuICBpZiAoJHNjb3BlLmNsYXNzaWZpZWQgPT0gbnVsbCkge1xuICAgICRzY29wZS5jbGFzc2lmaWVkID0gQ2xhc3NpZmllZHMuZ2V0RGVmYXVsdCgpO1xuICB9XG4gICRzY29wZS5jbGFzc2lmaWVkLnBhcmVudENhdGVnb3J5ID0gQ2F0ZWdvcmllcy5maW5kQnlQYXJlbnRJZCgkc2NvcGUuY2xhc3NpZmllZC5wYXJlbnRfY2F0ZWdvcnkgfHwgbnVsbCk7XG4gICRzY29wZS5jbGFzc2lmaWVkLmNoaWxkQ2F0ZWdvcnkgPSBDYXRlZ29yaWVzLmZpbmRCeUNoaWxkSWQoJHNjb3BlLmNsYXNzaWZpZWQuY2hpbGRfY2F0ZWdvcnkgfHwgbnVsbCk7XG4gICRzY29wZS5sb2NhdGlvbiA9IExvY2F0aW9ucy5maW5kQnlJZCgkc2NvcGUuY2xhc3NpZmllZC5sb2NhdGlvbik7XG4gICRzY29wZS5zdXBlckVkaXRhYmxlID0gdHJ1ZTtcbiAgb25UaXRsZUNoYW5nZSA9IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgdmFyIG1heFRpdGxlLCBtaW5UaXRsZSwgcmVmLCByZW1haW5pbmc7XG4gICAgaWYgKG5ld1ZhbHVlID09IG51bGwpIHtcbiAgICAgIG5ld1ZhbHVlID0gXCJcIjtcbiAgICB9XG4gICAgbWluVGl0bGUgPSAyMDtcbiAgICBtYXhUaXRsZSA9IDE0MDtcbiAgICBpZiAoKG1pblRpdGxlIDw9IChyZWYgPSBuZXdWYWx1ZS5sZW5ndGgpICYmIHJlZiA8PSBtYXhUaXRsZSkpIHtcbiAgICAgIHJlbWFpbmluZyA9IG1heFRpdGxlIC0gbmV3VmFsdWUubGVuZ3RoO1xuICAgICAgcmV0dXJuICRzY29wZS5yZW1haW5pbmdUaXRsZSA9IHJlbWFpbmluZyArIFwiIGNoYXJhY3RlcnMgbGVmdFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnJlbWFpbmluZ1RpdGxlID0gXCJcIjtcbiAgICB9XG4gIH07XG4gICRzY29wZS4kd2F0Y2goXCJjbGFzc2lmaWVkLnRpdGxlXCIsIG9uVGl0bGVDaGFuZ2UpO1xuICBvbkRlc2NyaXB0aW9uQ2hhbmdlID0gZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICB2YXIgbWF4RGVzY3JpcHRpb24sIG1pbkRlc2NyaXB0aW9uLCByZWYsIHJlbWFpbmluZztcbiAgICBpZiAobmV3VmFsdWUgPT0gbnVsbCkge1xuICAgICAgbmV3VmFsdWUgPSBcIlwiO1xuICAgIH1cbiAgICBtaW5EZXNjcmlwdGlvbiA9IDUwO1xuICAgIG1heERlc2NyaXB0aW9uID0gMjAwMDtcbiAgICBpZiAoKG1pbkRlc2NyaXB0aW9uIDw9IChyZWYgPSBuZXdWYWx1ZS5sZW5ndGgpICYmIHJlZiA8PSBtYXhEZXNjcmlwdGlvbikpIHtcbiAgICAgIHJlbWFpbmluZyA9IG1heERlc2NyaXB0aW9uIC0gbmV3VmFsdWUubGVuZ3RoO1xuICAgICAgcmV0dXJuICRzY29wZS5yZW1haW5pbmdEZXNjcmlwdGlvbiA9IHJlbWFpbmluZyArIFwiIGNoYXJhY3RlcnMgbGVmdFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJHNjb3BlLnJlbWFpbmluZ0Rlc2NyaXB0aW9uID0gXCJcIjtcbiAgICB9XG4gIH07XG4gICRzY29wZS4kd2F0Y2goXCJjbGFzc2lmaWVkLmRlc2NyaXB0aW9uXCIsIG9uRGVzY3JpcHRpb25DaGFuZ2UpO1xuICAkc2NvcGUuYWRkSW1hZ2VzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRlbDtcbiAgICAkZWwgPSBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIlt0eXBlPSdmaWxlJ11cIikpO1xuICAgIHJldHVybiAkZWxbMF0uY2xpY2soKTtcbiAgfTtcbiAgJHNjb3BlLmNoYW5nZVN0YXR1cyA9IChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbihuZXdTdGF0dXMpIHtcbiAgICAgIGNvbnNvbGUuZGVidWcoX3RoaXMubmFtZSwgXCJjaGFuZ2luZyBzdGF0dXMgdG8gOiAnXCIgKyBuZXdTdGF0dXMgKyBcIidcIik7XG4gICAgICAkc2NvcGUuY2xhc3NpZmllZC5zdGF0dXMgPSBDbGFzc2lmaWVkcy5zdGF0dXNlc1tuZXdTdGF0dXNdO1xuICAgICAgcmV0dXJuICRzY29wZS5zdWJtaXQoKTtcbiAgICB9O1xuICB9KSh0aGlzKTtcbiAgJHNjb3BlLmZpbGVDaGFuZ2UgPSBmdW5jdGlvbihmaWxlcykge1xuICAgIHZhciBmaWxlLCBpLCBsZW4sIHJlc3VsdHM7XG4gICAgaWYgKGZpbGVzID09IG51bGwpIHtcbiAgICAgIGZpbGVzID0gW107XG4gICAgfVxuICAgIGlmICgkc2NvcGUuY2xhc3NpZmllZC5pbWFnZXMgPT0gbnVsbCkge1xuICAgICAgJHNjb3BlLmNsYXNzaWZpZWQuaW1hZ2VzID0gW107XG4gICAgfVxuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBmaWxlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZmlsZSA9IGZpbGVzW2ldO1xuICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIHJldHVybiAkaW1hZ2VSZXNpemVyLmNyZWF0ZVRodW1ibmFpbChmaWxlLCB7XG4gICAgICAgICAgdGh1bWJuYWlsSGVpZ2h0OiAzMDAsXG4gICAgICAgICAgdGh1bWJuYWlsV2lkdGg6IDMwMCxcbiAgICAgICAgICBjYWxsYmFjazogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZGF0YVVSTCkge1xuICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UsIGlzVGhlcmVNYWluSW1hZ2UsIGosIGxlbjEsIHJlZjtcbiAgICAgICAgICAgICAgICBpc1RoZXJlTWFpbkltYWdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVmID0gJHNjb3BlLmNsYXNzaWZpZWQuaW1hZ2VzO1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICBpbWFnZSA9IHJlZltqXTtcbiAgICAgICAgICAgICAgICAgIGlmIChpbWFnZS5tYWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzVGhlcmVNYWluSW1hZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLmNsYXNzaWZpZWQuaW1hZ2VzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBmaWxlLm5hbWUsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogZmlsZS53aWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogZmlsZS5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICBzcmM6IGRhdGFVUkwsXG4gICAgICAgICAgICAgICAgICBtYWluOiAhaXNUaGVyZU1haW5JbWFnZSxcbiAgICAgICAgICAgICAgICAgIHN0YXR1czogXCJ0by11cGxvYWRcIlxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkodGhpcylcbiAgICAgICAgfSk7XG4gICAgICB9KShmaWxlKSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuICAkc2NvcGUucmVtb3ZlSW1hZ2UgPSBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICB2YXIgJGxpLCBpLCBpbWFnZSwgbGVuLCBuZXdTdGF0dXMsIHJlZiwgcmVmMTtcbiAgICAkbGkgPSBhbmd1bGFyLmVsZW1lbnQoJGV2ZW50LnRhcmdldC5wYXJlbnROb2RlKTtcbiAgICBzd2l0Y2ggKCRsaS5kYXRhKCkuJHNjb3BlLmltYWdlLnN0YXR1cykge1xuICAgICAgY2FzZSBcIm9uLXNlcnZlclwiOlxuICAgICAgICBuZXdTdGF0dXMgPSBcInRvLWRlbGV0ZS1mcm9tLXNlcnZlclwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0by1kZWxldGVcIjpcbiAgICAgICAgbmV3U3RhdHVzID0gXCJ0by11cGxvYWRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidG8tZGVsZXRlLWZyb20tc2VydmVyXCI6XG4gICAgICAgIG5ld1N0YXR1cyA9IFwib24tc2VydmVyXCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInRvLXVwbG9hZFwiOlxuICAgICAgICBuZXdTdGF0dXMgPSBcInRvLWRlbGV0ZVwiO1xuICAgIH1cbiAgICBpZiAobmV3U3RhdHVzICE9IG51bGwpIHtcbiAgICAgICRsaS5kYXRhKCkuJHNjb3BlLmltYWdlLnN0YXR1cyA9IG5ld1N0YXR1cztcbiAgICB9XG4gICAgaWYgKCRsaS5kYXRhKCkuJHNjb3BlLmltYWdlLm1haW4pIHtcbiAgICAgIHJlZiA9ICRzY29wZS5jbGFzc2lmaWVkLmltYWdlcztcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpbWFnZSA9IHJlZltpXTtcbiAgICAgICAgaWYgKChyZWYxID0gaW1hZ2Uuc3RhdHVzKSA9PT0gXCJvbi1zZXJ2ZXJcIiB8fCByZWYxID09PSBcInRvLXVwbG9hZFwiKSB7XG4gICAgICAgICAgaW1hZ2UubWFpbiA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAkbGkuZGF0YSgpLiRzY29wZS5pbWFnZS5tYWluID0gZmFsc2U7XG4gICAgfVxuICB9O1xuICAkc2NvcGUuc2V0bWFpbkltYWdlID0gZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgdmFyICRsaSwgaSwgaW1hZ2UsIGxlbiwgcmVmLCByZWYxO1xuICAgICRsaSA9IGFuZ3VsYXIuZWxlbWVudCgkZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpO1xuICAgIGlmICgocmVmID0gJGxpLmRhdGEoKS4kc2NvcGUuaW1hZ2Uuc3RhdHVzKSA9PT0gXCJ0by1kZWxldGUtZnJvbS1zZXJ2ZXJcIiB8fCByZWYgPT09IFwidG8tZGVsZXRlXCIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVmMSA9ICRzY29wZS5jbGFzc2lmaWVkLmltYWdlcztcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYxLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpbWFnZSA9IHJlZjFbaV07XG4gICAgICBpbWFnZS5tYWluID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiAkbGkuZGF0YSgpLiRzY29wZS5pbWFnZS5tYWluID0gdHJ1ZTtcbiAgfTtcbiAgJHNjb3BlLnN1Ym1pdCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpLCBpbWFnZSwgbGVuLCByZWY7XG4gICAgICBpZiAoISRzY29wZS5mb3JtLiRpbnZhbGlkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKF90aGlzLm5hbWUsIFwic3VibWl0dGluZyBmb3JtXCIpO1xuICAgICAgICByZWYgPSAkc2NvcGUuY2xhc3NpZmllZC5pbWFnZXMgfHwgW107XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGltYWdlID0gcmVmW2ldO1xuICAgICAgICAgIGRlbGV0ZSBpbWFnZS5zcmM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCRzY29wZS5jbGFzc2lmaWVkLnBhcmVudENhdGVnb3J5ICE9IG51bGwpIHtcbiAgICAgICAgICAkc2NvcGUuY2xhc3NpZmllZC5wYXJlbnRfY2F0ZWdvcnkgPSAkc2NvcGUuY2xhc3NpZmllZC5wYXJlbnRDYXRlZ29yeS5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJHNjb3BlLmNsYXNzaWZpZWQuY2hpbGRDYXRlZ29yeSAhPSBudWxsKSB7XG4gICAgICAgICAgJHNjb3BlLmNsYXNzaWZpZWQuY2hpbGRfY2F0ZWdvcnkgPSAkc2NvcGUuY2xhc3NpZmllZC5jaGlsZENhdGVnb3J5LmlkO1xuICAgICAgICB9XG4gICAgICAgIGlmICgkc2NvcGUubG9jYXRpb24gIT0gbnVsbCkge1xuICAgICAgICAgICRzY29wZS5jbGFzc2lmaWVkLmxvY2F0aW9uID0gJHNjb3BlLmxvY2F0aW9uLmlkO1xuICAgICAgICB9XG4gICAgICAgIENsYXNzaWZpZWRzLnNhdmUoJHNjb3BlLmNsYXNzaWZpZWQsIGZ1bmN0aW9uKGVycm9yLCBjbGFzc2lmaWVkKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gJG5vdGlmaWNhdGlvbnMuZXJyb3IoXCJTb21ldGhpbmcgd2VudCB3cm9uZyB3aGlsZSBzYXZpbmcgeW91ciBjbGFzc2lmaWVkLiBUcnkgYWdhaW4gbGF0ZXJcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiAkc2NvcGUub25TdWNjZXNzKGNsYXNzaWZpZWQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRub3RpZmljYXRpb25zLmVycm9yKFwiWW91IGhhdmUgc29tZSBpbnZhbGlkIGZpZWxkcyBpbiB5b3VyIGZvcm0uIEhhdmUgYSBsb29rIGF0IHRoZW0gYWdhaW5cIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gJHNjb3BlLmF0dGVtcHRlZCA9IHRydWU7XG4gICAgfTtcbiAgfSkodGhpcyk7XG4gIHJldHVybiAkc2NvcGUuZHJhd01hcCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbml0TWFwLCBsb2FkZWQ7XG4gICAgbG9hZGVkID0gZmFsc2U7XG4gICAgaW5pdE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGdtYXAsIG1hcCwgbWFya2VyLCBteUxhdGxuZztcbiAgICAgIG15TGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygkc2NvcGUuY2xhc3NpZmllZC5tZXRhLmdtYXBYIHx8IDI5LjM3NTc3MDk4MTExMDM1MywgJHNjb3BlLmNsYXNzaWZpZWQubWV0YS5nbWFwWSB8fCA0Ny45ODY1NjQ2MzYyMzA0Nyk7XG4gICAgICBnbWFwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBzLWNvbnRhaW5lclwiKTtcbiAgICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZ21hcCwge1xuICAgICAgICBjZW50ZXI6IG15TGF0bG5nLFxuICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2UsXG4gICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXG4gICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcbiAgICAgICAgc3R5bGU6ICRnb29nbGVNYXBzLmRlZmF1bHRTdHlsZSxcbiAgICAgICAgem9vbTogMTNcbiAgICAgIH0pO1xuICAgICAgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIHBvc2l0aW9uOiBteUxhdGxuZ1xuICAgICAgfSk7XG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXAsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBsYXRMbmc7XG4gICAgICAgIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoZXZlbnQubGF0TG5nLmxhdCgpLCBldmVudC5sYXRMbmcubG5nKCkpO1xuICAgICAgICAkc2NvcGUuY2xhc3NpZmllZC5tZXRhLmdtYXBYID0gbGF0TG5nLmxhdCgpO1xuICAgICAgICAkc2NvcGUuY2xhc3NpZmllZC5tZXRhLmdtYXBZID0gbGF0TG5nLmxuZygpO1xuICAgICAgICBtYXJrZXIuc2V0UG9zaXRpb24obGF0TG5nKTtcbiAgICAgICAgcmV0dXJuIG1hcC5wYW5UbyhsYXRMbmcpO1xuICAgICAgfSk7XG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdkcmFnZW5kJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGxhdExuZztcbiAgICAgICAgbGF0TG5nID0gbWFya2VyLmdldFBvc2l0aW9uKCk7XG4gICAgICAgICRzY29wZS5jbGFzc2lmaWVkLm1ldGEuZ21hcFggPSBsYXRMbmcubGF0KCk7XG4gICAgICAgICRzY29wZS5jbGFzc2lmaWVkLm1ldGEuZ21hcFkgPSBsYXRMbmcubG5nKCk7XG4gICAgICAgIHJldHVybiBtYXAucGFuVG8obGF0TG5nKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGxvYWRlZCA9IHRydWU7XG4gICAgfTtcbiAgICBpZiAoIWxvYWRlZCkge1xuICAgICAgcmV0dXJuICRnb29nbGVNYXBzLm9uTG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGluaXRNYXAoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG5cbmV4cG9ydHMuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRnb29nbGVNYXBzXCIsIFwiJGltYWdlUmVzaXplclwiLCBcIiRsb2NhdGlvblwiLCBcIiRub3RpZmljYXRpb25zXCIsIFwiJGxvZ1wiLCBcIm1vZGVsLmNsYXNzaWZpZWRzXCIsIFwibW9kZWwuY2F0ZWdvcmllc1wiLCBcIm1vZGVsLmxvY2F0aW9uc1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsICR3aW5kb3csICRyb290U2NvcGUsIGNvbnNvbGUsIENsYXNzaWZpZWRzKSB7XG4gIHZhciBib2R5LCBjbGFzc2lmZWRMaXN0LCBjdXJyZW50UGFnZSwgbG9hZGluZ0NsYXNzaWZpZWRzLCBtYXNvbnJ5LCBzY3JvbGxQb3NpdGlvbjtcbiAgdGhpcy5uYW1lID0gXCJbY29tcG9uZW50OmNsYXNzaWZpZWQtbGlzdF1cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgY2xhc3NpZmVkTGlzdCA9IChhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jbGFzc2lmaWVkLWxpc3RcIikpKVswXTtcbiAgbWFzb25yeSA9IG5ldyBNYXNvbnJ5KGNsYXNzaWZlZExpc3QsIHtcbiAgICB0cmFuc2l0aW9uRHVyYXRpb246IDBcbiAgfSk7XG4gIGN1cnJlbnRQYWdlID0gMTtcbiAgbG9hZGluZ0NsYXNzaWZpZWRzID0gZmFsc2U7XG4gIHNjcm9sbFBvc2l0aW9uID0gMDtcbiAgYm9keSA9IChkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIikpWzBdO1xuICBpZiAoJHNjb3BlLnF1ZXJ5RmluaXNoZWQgPT0gbnVsbCkge1xuICAgICRzY29wZS5xdWVyeUZpbmlzaGVkID0gZmFsc2U7XG4gIH1cbiAgaWYgKCRzY29wZS5yZWRpcmVjdFRvRWRpdFBhZ2UgPT0gbnVsbCkge1xuICAgICRzY29wZS5yZWRpcmVjdFRvRWRpdFBhZ2UgPSBmYWxzZTtcbiAgfVxuICBpZiAoJHNjb3BlLmZpbmlzaE1lc3NhZ2UgPT0gbnVsbCkge1xuICAgICRzY29wZS5maW5pc2hNZXNzYWdlID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHRleHRzO1xuICAgICAgdGV4dHMgPSBbXCJEYW1uLCB0aGVyZSBhcmUgbm8gbW9yZSBjbGFzc2lmaWVkcyFcIiwgXCJNYXlkYXkhIHdlJ3JlIGFsbCBvdXQgb2YgY2xhc3NpZmllZHMhXCIsIFwiV29vcHMhIHRoYXQncyBhbGwgd2UgZ290IVwiLCBcIldvd2llISB0aGF0IHNlZW1zIHRvIGJlIGFsbCB3ZSBoYXZlIVwiXTtcbiAgICAgIHJldHVybiB0ZXh0c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0ZXh0cy5sZW5ndGgpXTtcbiAgICB9KSgpO1xuICB9XG4gIGlmICgkc2NvcGUuZW1wdHlNZXNzYWdlID09IG51bGwpIHtcbiAgICAkc2NvcGUuZW1wdHlNZXNzYWdlID0gJHNjb3BlLmZpbmlzaE1lc3NhZ2U7XG4gIH1cbiAgJHNjb3BlLiR3YXRjaCgoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNsYXNzaWZlZExpc3QuY2hpbGRFbGVtZW50Q291bnQ7XG4gIH0pLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY2hpbGQsIGksIGxlbiwgbmV3RWxlbWVudHMsIHJlZjtcbiAgICAgIGlmIChjbGFzc2lmZWRMaXN0LmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbmV3RWxlbWVudHMgPSBbXTtcbiAgICAgICAgcmVmID0gY2xhc3NpZmVkTGlzdC5jaGlsZHJlbjtcbiAgICAgICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgY2hpbGQgPSByZWZbaV07XG4gICAgICAgICAgaWYgKCFjaGlsZC5kYXRhc2V0LmFkZGVkKSB7XG4gICAgICAgICAgICBjaGlsZC5kYXRhc2V0LmFkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIG5ld0VsZW1lbnRzLnB1c2goY2hpbGQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBtYXNvbnJ5LmFwcGVuZGVkKG5ld0VsZW1lbnRzLnJldmVyc2UoKSk7XG4gICAgICAgIHJldHVybiBtYXNvbnJ5LmxheW91dCgpO1xuICAgICAgfVxuICAgIH07XG4gIH0pKHRoaXMpKTtcbiAgJHNjb3BlLnRvZ2dsZUNsYXNzaWZpZWQgPSBmdW5jdGlvbihjbGFzc2lmaWVkKSB7XG4gICAgJHJvb3RTY29wZS5ib2R5U3R5bGVzID0gJHJvb3RTY29wZS5ib2R5U3R5bGVzIHx8IHt9O1xuICAgIGlmICgkc2NvcGUuY2xhc3NpZmllZCA9PSBudWxsKSB7XG4gICAgICAkc2NvcGUuJGJyb2FkY2FzdChcImNsYXNzaWZpZWQtY2hhbmdlZFwiLCBjbGFzc2lmaWVkKTtcbiAgICAgICRyb290U2NvcGUuYm9keVN0eWxlcy5vdmVyZmxvd1kgPSBcImhpZGRlblwiO1xuICAgICAgJHNjb3BlLmNsYXNzaWZpZWQgPSBjbGFzc2lmaWVkO1xuICAgICAgc2Nyb2xsUG9zaXRpb24gPSBib2R5LnNjcm9sbFRvcDtcbiAgICAgIHJldHVybiBib2R5LnNjcm9sbFRvcCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICRzY29wZS5jbGFzc2lmaWVkID0gdm9pZCAwO1xuICAgICAgc2V0VGltZW91dCgoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBib2R5LnNjcm9sbFRvcCA9IHNjcm9sbFBvc2l0aW9uO1xuICAgICAgfSksIDEwKTtcbiAgICAgIHJldHVybiAkcm9vdFNjb3BlLmJvZHlTdHlsZXMub3ZlcmZsb3dZID0gXCJcIjtcbiAgICB9XG4gIH07XG4gICRzY29wZS5jbGFzc2lmaWVkcyA9IFtdO1xuICAkc2NvcGUubG9hZENsYXNzaWZpZWRzID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhcmFtZXRlcnM7XG4gICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCBcImxvYWRpbmcgbW9yZSBjbGFzc2lmaWVkc1wiKTtcbiAgICAgIGNvbnNvbGUuZGVidWcoX3RoaXMubmFtZSwgXCJwYWdlOlwiLCBjdXJyZW50UGFnZSk7XG4gICAgICBwYXJhbWV0ZXJzID0ge1xuICAgICAgICBwYWdlOiBjdXJyZW50UGFnZSsrXG4gICAgICB9O1xuICAgICAgYW5ndWxhci5leHRlbmQocGFyYW1ldGVycywgJHNjb3BlLnF1ZXJ5IHx8IHt9KTtcbiAgICAgIHJldHVybiBDbGFzc2lmaWVkcy5xdWVyeShwYXJhbWV0ZXJzLCBmdW5jdGlvbihlcnJvciwgY2xhc3NpZmllZHMpIHtcbiAgICAgICAgdmFyIGNsYXNzaWZpZWQsIGksIGxlbjtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsYXNzaWZpZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICRzY29wZS5xdWVyeUZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCBcImZpbmlzaGVkIGxvYWRpbmcgY2xhc3NpZmllZHNcIik7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoX3RoaXMubmFtZSwgXCJsb2FkZWQgXCIgKyBjbGFzc2lmaWVkcy5sZW5ndGggKyBcIiBjbGFzc2lmaWVkKHMpXCIpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBjbGFzc2lmaWVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGNsYXNzaWZpZWQgPSBjbGFzc2lmaWVkc1tpXTtcbiAgICAgICAgICBpZiAoJHNjb3BlLnJlZGlyZWN0VG9FZGl0UGFnZSkge1xuICAgICAgICAgICAgY2xhc3NpZmllZC5saW5rID0gXCIvY2xhc3NpZmllZC9lZGl0L1wiICsgY2xhc3NpZmllZC5pZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2xhc3NpZmllZC5pbWFnZUxvYWRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hc29ucnkubGF5b3V0KCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICAkc2NvcGUuY2xhc3NpZmllZHMucHVzaChjbGFzc2lmaWVkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9hZGluZ0NsYXNzaWZpZWRzID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSh0aGlzKTtcbiAgJHNjb3BlLmxvYWRDbGFzc2lmaWVkcygpO1xuICByZXR1cm4gJHNjb3BlLm9uU2Nyb2xsID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgdmFyIGRvY3VtZW50SGVpZ2h0LCBodG1sO1xuICAgICAgaWYgKCRzY29wZS5xdWVyeUZpbmlzaGVkIHx8IGxvYWRpbmdDbGFzc2lmaWVkcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgIGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICBkb2N1bWVudEhlaWdodCA9IE1hdGgubWF4KGJvZHkuY2xpZW50SGVpZ2h0LCBib2R5Lm9mZnNldEhlaWdodCwgYm9keS5zY3JvbGxIZWlnaHQsIGh0bWwuY2xpZW50SGVpZ2h0LCBodG1sLm9mZnNldEhlaWdodCwgaHRtbC5zY3JvbGxIZWlnaHQpO1xuICAgICAgc2Nyb2xsUG9zaXRpb24gPSBib2R5LnNjcm9sbFRvcCArICR3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICBpZiAoc2Nyb2xsUG9zaXRpb24gLyBkb2N1bWVudEhlaWdodCAqIDEwMCA+IDgwKSB7XG4gICAgICAgIGxvYWRpbmdDbGFzc2lmaWVkcyA9IHRydWU7XG4gICAgICAgIHJldHVybiAkc2NvcGUubG9hZENsYXNzaWZpZWRzKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkodGhpcyk7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkd2luZG93XCIsIFwiJHJvb3RTY29wZVwiLCBcIiRsb2dcIiwgXCJtb2RlbC5jbGFzc2lmaWVkc1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsICRnb29nbGVNYXBzLCBjb25zb2xlLCBDbGFzc2lmaWVkcykge1xuICB2YXIgY2w7XG4gIHRoaXMubmFtZSA9IFwiW2NvbXBvbmVudDpjbGFzc2lmaWVkLXNpbmdsZV1cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgY29uc29sZS5kZWJ1Zyh0aGlzLm5hbWUsICRzY29wZSk7XG4gIGNsID0gJHNjb3BlLmNsYXNzaWZpZWQgfHwgQ2xhc3NpZmllZHMuZ2V0RGVmYXVsdCgpO1xuICBjbC5zaG93ID0gdHJ1ZTtcbiAgcmV0dXJuICRzY29wZS5kcmF3TWFwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGluaXRNYXA7XG4gICAgaW5pdE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGdtYXAsIGxhdExuZywgbWFwLCBtYXJrZXI7XG4gICAgICBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGNsLm1ldGEuZ21hcFgsIGNsLm1ldGEuZ21hcFkpO1xuICAgICAgZ21hcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwcy1jb250YWluZXJcIik7XG4gICAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGdtYXAsIHtcbiAgICAgICAgY2VudGVyOiBsYXRMbmcsXG4gICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZSxcbiAgICAgICAgc3R5bGU6ICRnb29nbGVNYXBzLmRlZmF1bHRTdHlsZSxcbiAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxuICAgICAgICBwYW5Db250cm9sOiBmYWxzZSxcbiAgICAgICAgem9vbUNvbnRyb2w6IGZhbHNlLFxuICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG4gICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXG4gICAgICAgIHpvb206IDEzXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIHBvc2l0aW9uOiBsYXRMbmdcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuICRnb29nbGVNYXBzLm9uTG9hZChmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpbml0TWFwKCk7XG4gICAgfSk7XG4gIH07XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkZ29vZ2xlTWFwc1wiLCBcIiRsb2dcIiwgXCJtb2RlbC5jbGFzc2lmaWVkc1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsICRyb290LCBjb25zb2xlLCBzZXRUaW1lb3V0KSB7XG4gIHZhciBmbGFzaE5vdGlmaWNhdGlvbkxpZmV0aW1lLCBtYXhVbnJlYWROb3RpZmljYXRpb25zLCBvbk5vdGlmaWNhdGlvbkFkZGVkLCBvbk5vdGlmaWNhdGlvblJlYWQ7XG4gIHRoaXMubmFtZSA9IFwiW2NvbXBvbmVudDpoZWFkZXJdXCI7XG4gIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJpbml0aWFsaXppbmdcIik7XG4gIGZsYXNoTm90aWZpY2F0aW9uTGlmZXRpbWUgPSAzMDAwO1xuICBtYXhVbnJlYWROb3RpZmljYXRpb25zID0gMztcbiAgJHNjb3BlLmZsYXNoTm90aWZpY2F0aW9ucyA9IFtdO1xuICAkc2NvcGUudW5yZWFkTm90aWZpY2F0aW9ucyA9IDEyO1xuICAkc2NvcGUubm90aWZpY2F0aW9ucyA9IFtdO1xuICBpZiAoJHJvb3QuYm9keUNsYXNzZXMgPT0gbnVsbCkge1xuICAgICRyb290LmJvZHlDbGFzc2VzID0ge307XG4gIH1cbiAgJHNjb3BlLm9wZW5IZWFkZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJHJvb3QuYm9keUNsYXNzZXNbXCJzaG93LXN1YmhlYWRlclwiXSA9IHRydWU7XG4gIH07XG4gICRzY29wZS5jbG9zZUhlYWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb3VudCwgaSwgbGVuLCBub3RpZmljYXRpb24sIHJlZiwgcmVzdWx0cztcbiAgICAkcm9vdC5ib2R5Q2xhc3Nlc1tcInNob3ctc3ViaGVhZGVyXCJdID0gZmFsc2U7XG4gICAgY291bnQgPSAwO1xuICAgIHJlZiA9ICRzY29wZS5ub3RpZmljYXRpb25zO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG5vdGlmaWNhdGlvbiA9IHJlZltpXTtcbiAgICAgIG5vdGlmaWNhdGlvbi5oYXNSZWFkID0gdHJ1ZTtcbiAgICAgIGlmICgrK2NvdW50ID4gbWF4VW5yZWFkTm90aWZpY2F0aW9ucykge1xuICAgICAgICByZXN1bHRzLnB1c2gobm90aWZpY2F0aW9uLnJlbW92ZSA9IHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuICAkc2NvcGUudG9nZ2xlSGVhZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhlYWRlcklzT3BlbmVkO1xuICAgIGhlYWRlcklzT3BlbmVkID0gJHJvb3QuYm9keUNsYXNzZXNbXCJzaG93LXN1YmhlYWRlclwiXTtcbiAgICBpZiAoaGVhZGVySXNPcGVuZWQpIHtcbiAgICAgIHJldHVybiAkc2NvcGUuY2xvc2VIZWFkZXIoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICRzY29wZS5vcGVuSGVhZGVyKCk7XG4gICAgfVxuICB9O1xuICBvbk5vdGlmaWNhdGlvbkFkZGVkID0gZnVuY3Rpb24obm90aWZpY2F0aW9ucykge307XG4gICRzY29wZS4kd2F0Y2goXCJub3RpZmljYXRpb25zXCIsIG9uTm90aWZpY2F0aW9uQWRkZWQsIHRydWUpO1xuICBvbk5vdGlmaWNhdGlvblJlYWQgPSBmdW5jdGlvbihub3RpZmljYXRpb25zKSB7XG4gICAgdmFyIGksIGxlbiwgbm90aWZpY2F0aW9uLCByZXN1bHRzO1xuICAgICRzY29wZS51bnJlYWROb3RpZmljYXRpb25zID0gMDtcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gbm90aWZpY2F0aW9ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbm90aWZpY2F0aW9uID0gbm90aWZpY2F0aW9uc1tpXTtcbiAgICAgIGlmICghbm90aWZpY2F0aW9uLmhhc1JlYWQpIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKCRzY29wZS51bnJlYWROb3RpZmljYXRpb25zKyspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHZvaWQgMCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuICAkc2NvcGUuJHdhdGNoKFwibm90aWZpY2F0aW9uc1wiLCBvbk5vdGlmaWNhdGlvblJlYWQsIHRydWUpO1xuICAkc2NvcGUuY2xvc2VGbGFzaE5vdGlmaWNhdGlvbiA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgdmFyIGNsb3NlZE5vdGlmaWNhdGlvbiwgaSwgbGVuLCBub3RpZmljYXRpb24sIHJlZiwgcmVzdWx0cztcbiAgICBjbG9zZWROb3RpZmljYXRpb24gPSAoJHNjb3BlLmZsYXNoTm90aWZpY2F0aW9ucy5zcGxpY2UoaW5kZXgsIDEpKVswXTtcbiAgICByZWYgPSAkc2NvcGUubm90aWZpY2F0aW9ucztcbiAgICByZXN1bHRzID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBub3RpZmljYXRpb24gPSByZWZbaV07XG4gICAgICBpZiAobm90aWZpY2F0aW9uLiQkaGFzaGtleSA9PT0gY2xvc2VkTm90aWZpY2F0aW9uLiQkaGFzaGtleSkge1xuICAgICAgICByZXN1bHRzLnB1c2gobm90aWZpY2F0aW9uLmhhc1JlYWQgPSB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMucHVzaCh2b2lkIDApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcbiAgcmV0dXJuICRzY29wZS4kb24oXCJub3RpZmljYXRpb25cIiwgZnVuY3Rpb24oZXZlbnQsIG5vdGlmaWNhdGlvbikge1xuICAgICRzY29wZS5mbGFzaE5vdGlmaWNhdGlvbnMucHVzaChub3RpZmljYXRpb24pO1xuICAgIChmdW5jdGlvbihub3RpZmljYXRpb25zKSB7XG4gICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICBpbmRleCA9ICRzY29wZS5mbGFzaE5vdGlmaWNhdGlvbnMuaW5kZXhPZihub3RpZmljYXRpb24pO1xuICAgICAgICBpZiAoaW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiAkc2NvcGUuZmxhc2hOb3RpZmljYXRpb25zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH0sIGZsYXNoTm90aWZpY2F0aW9uTGlmZXRpbWUpO1xuICAgIH0pKG5vdGlmaWNhdGlvbik7XG4gICAgaWYgKCFub3RpZmljYXRpb24uZmxhc2gpIHtcbiAgICAgIHJldHVybiAkc2NvcGUubm90aWZpY2F0aW9ucy5wdXNoKG5vdGlmaWNhdGlvbik7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydHMuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRyb290U2NvcGVcIiwgXCIkbG9nXCIsIFwiJHRpbWVvdXRcIl07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICBjb25zb2xlLmxvZyhcIltjb250cm9sbGVyc10gaW5pdGlhbGl6aW5nXCIpO1xuICBhcHAuY29udHJvbGxlcihcIm1hc3RlclwiLCByZXF1aXJlKFwiLi9tYXN0ZXJcIikpO1xuICBhcHAuY29udHJvbGxlcihcImNvbXBvbmVudDpjYXRlZ29yeS1saXN0XCIsIHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvY2F0ZWdvcnktbGlzdFwiKSk7XG4gIGFwcC5jb250cm9sbGVyKFwiY29tcG9uZW50OmNsYXNzaWZpZWQtbGlzdFwiLCByZXF1aXJlKFwiLi9jb21wb25lbnRzL2NsYXNzaWZpZWQtbGlzdFwiKSk7XG4gIGFwcC5jb250cm9sbGVyKFwiY29tcG9uZW50OmNsYXNzaWZpZWQtc2luZ2xlXCIsIHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvY2xhc3NpZmllZC1zaW5nbGVcIikpO1xuICBhcHAuY29udHJvbGxlcihcImNvbXBvbmVudDpjbGFzc2lmaWVkLWZvcm1cIiwgcmVxdWlyZShcIi4vY29tcG9uZW50cy9jbGFzc2lmaWVkLWZvcm1cIikpO1xuICBhcHAuY29udHJvbGxlcihcImNvbXBvbmVudDpoZWFkZXJcIiwgcmVxdWlyZShcIi4vY29tcG9uZW50cy9oZWFkZXJcIikpO1xuICBhcHAuY29udHJvbGxlcihcInBhZ2U6NDA0XCIsIHJlcXVpcmUoXCIuL3BhZ2VzLzQwNFwiKSk7XG4gIGFwcC5jb250cm9sbGVyKFwicGFnZTphY2NvdW50L2luZGV4XCIsIHJlcXVpcmUoXCIuL3BhZ2VzL2FjY291bnRcIikpO1xuICBhcHAuY29udHJvbGxlcihcInBhZ2U6YWNjb3VudC9tYW5hZ2VcIiwgcmVxdWlyZShcIi4vcGFnZXMvYWNjb3VudC9tYW5hZ2VcIikpO1xuICBhcHAuY29udHJvbGxlcihcInBhZ2U6YXV0aC9pbmRleFwiLCByZXF1aXJlKFwiLi9wYWdlcy9hdXRoXCIpKTtcbiAgYXBwLmNvbnRyb2xsZXIoXCJwYWdlOmF1dGgvbG9nb3V0XCIsIHJlcXVpcmUoXCIuL3BhZ2VzL2F1dGgvbG9nb3V0XCIpKTtcbiAgYXBwLmNvbnRyb2xsZXIoXCJwYWdlOmNsYXNzaWZpZWQvZWRpdFwiLCByZXF1aXJlKFwiLi9wYWdlcy9jbGFzc2lmaWVkL2VkaXRcIikpO1xuICBhcHAuY29udHJvbGxlcihcInBhZ2U6Y2xhc3NpZmllZC9maW5pc2hcIiwgcmVxdWlyZShcIi4vcGFnZXMvY2xhc3NpZmllZC9maW5pc2hcIikpO1xuICBhcHAuY29udHJvbGxlcihcInBhZ2U6Y2xhc3NpZmllZC9wb3N0XCIsIHJlcXVpcmUoXCIuL3BhZ2VzL2NsYXNzaWZpZWQvcG9zdFwiKSk7XG4gIGFwcC5jb250cm9sbGVyKFwicGFnZTpjbGFzc2lmaWVkL3NlYXJjaFwiLCByZXF1aXJlKFwiLi9wYWdlcy9jbGFzc2lmaWVkL3NlYXJjaFwiKSk7XG4gIGFwcC5jb250cm9sbGVyKFwicGFnZTpjbGFzc2lmaWVkL3NpbmdsZVwiLCByZXF1aXJlKFwiLi9wYWdlcy9jbGFzc2lmaWVkL3NpbmdsZVwiKSk7XG4gIHJldHVybiBhcHAuY29udHJvbGxlcihcInBhZ2U6bGFuZGluZ1wiLCByZXF1aXJlKFwiLi9wYWdlcy9sYW5kaW5nXCIpKTtcbn07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCAkcm9vdCwgY29uc29sZSkge1xuICB0aGlzLm5hbWUgPSBcIltjb250cm9sbGVyOm1hc3Rlcl1cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgcmV0dXJuICRzY29wZS5tZXRhID0gJHJvb3QubWV0YSA9IHtcbiAgICByb2JvdHNOb0luZGV4OiBmYWxzZVxuICB9O1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHJvb3RTY29wZVwiLCBcIiRsb2dcIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGxvY2F0aW9uKSB7XG4gIGNvbnNvbGUubG9nKFwicmVsb2FkaW5nIHBhZ2VcIik7XG4gIHJldHVybiAkbG9jYXRpb24ucmVsb2FkKCk7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkbG9jYXRpb25cIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCBjb25zb2xlKSB7XG4gIHRoaXMubmFtZSA9IFwiW3BhZ2U6YWNjb3VudC1pbmRleF1cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgcmV0dXJuICRzY29wZS4kZW1pdChcInBhZ2UtbG9hZGVkXCIpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJGxvZ1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsIGNvbnNvbGUsIFVzZXJzKSB7XG4gIHRoaXMubmFtZSA9IFwiW3BhZ2U6YWNjb3VudC1tYW5hZ2VdXCI7XG4gIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJpbml0aWFsaXppbmdcIik7XG4gICRzY29wZS4kZW1pdChcInBhZ2UtbG9hZGVkXCIpO1xuICAkc2NvcGUucXVlcnkgPSB7XG4gICAgb3duZXI6IFVzZXJzLmdldEN1cnJlbnRVc2VyKCkuaWRcbiAgfTtcbiAgJHNjb3BlLmZpbmlzaE1lc3NhZ2UgPSBcIkVuZCBvZiBjbGFzc2lmaWVkc1wiO1xuICAkc2NvcGUuZW1wdHlNZXNzYWdlID0gXCJZb3UgaGF2ZSBubyBjbGFzc2lmaWVkc1wiO1xuICByZXR1cm4gJHNjb3BlLnJlZGlyZWN0VG9FZGl0UGFnZSA9IHRydWU7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkbG9nXCIsIFwibW9kZWwudXNlcnNcIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRodHRwLCBjb25zb2xlLCAkbm90aWZpY2F0aW9ucywgVXNlcnMpIHtcbiAgdGhpcy5uYW1lID0gXCJbcGFnZTphdXRoLWxvZ2luXVwiO1xuICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiaW5pdGlhbGl6aW5nXCIpO1xuICAkc2NvcGUuJGVtaXQoXCJwYWdlLWxvYWRlZFwiKTtcbiAgJHNjb3BlLmxvZ2luID0ge307XG4gICRzY29wZS5zaWdudXAgPSB7fTtcbiAgJHNjb3BlLmRvTG9naW4gPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICB1cmw6IFwiL2FwaS9hdXRoL2VtYWlsL2xvZ2luXCIsXG4gICAgICAgIGRhdGE6ICRzY29wZS5sb2dpblxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coX3RoaXMubmFtZSwgXCJsb2dpbiBzdWNjZXNzZnVsISByZWRpcmVjdGluZyB0byBhY2NvdW50IHBhZ2VcIik7XG4gICAgICAgIFVzZXJzLnNldEN1cnJlbnRVc2VyKGRhdGEpO1xuICAgICAgICAkbm90aWZpY2F0aW9ucy5zdWNjZXNzKFwiV2VsY29tZSBcIiArIGRhdGEuZnVsbF9uYW1lICsgXCIsIFlvdSBoYXZlIGJlZW4gbG9nZ2VkIGluIVwiKTtcbiAgICAgICAgcmV0dXJuICRsb2NhdGlvbi5wYXRoKFwiL2FjY291bnRcIik7XG4gICAgICB9KS5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgJG5vdGlmaWNhdGlvbnMuZXJyb3IoXCJJbnZhbGlkIGxvZ2luLiBQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFsc1wiKTtcbiAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoX3RoaXMubmFtZSwgZGF0YSwgc3RhdHVzKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKHRoaXMpO1xuICByZXR1cm4gJHNjb3BlLmRvU2lnbnVwID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgdXJsOiBcIi9hcGkvYXV0aC9lbWFpbC9zaWdudXBcIixcbiAgICAgICAgZGF0YTogJHNjb3BlLnNpZ251cFxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgJG5vdGlmaWNhdGlvbnMuc3VjY2VzcyhcIkFuIGFjdGl2YXRpb24gZW1haWwgaGFzIGJlZW4gc2VudCwgXCIgKyBkYXRhLmZ1bGxfbmFtZSArIFwiISAoQ2hlY2sgeW91ciBzcGFtIGZvbGRlciB0b28pXCIpO1xuICAgICAgICByZXR1cm4gY29uc29sZS5sb2coX3RoaXMubmFtZSwgXCJzaWdudXAgc3VjY2Vzc2Z1bCEgd2FpdGluZyBmb3IgYWN0aXZhdGlvbiBwYWdlXCIpO1xuICAgICAgfSkuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoX3RoaXMubmFtZSwgZGF0YSwgc3RhdHVzKTtcbiAgICAgICAgcmV0dXJuICRub3RpZmljYXRpb25zLmVycm9yKFwiU2lnbnVwIGZhaWxlZC4gUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMgb3IgdHJ5IGFnYWluIGxhdGVyXCIpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSkodGhpcyk7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkbG9jYXRpb25cIiwgXCIkaHR0cFwiLCBcIiRsb2dcIiwgXCIkbm90aWZpY2F0aW9uc1wiLCBcIm1vZGVsLnVzZXJzXCJdO1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRsb2NhdGlvbiwgJGh0dHAsIGNvbnNvbGUsICRub3RpZmljYXRpb25zLCBVc2Vycykge1xuICB0aGlzLm5hbWUgPSBcIltwYWdlOmF1dGgtbG9nb3V0XVwiO1xuICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiaW5pdGlhbGl6aW5nXCIpO1xuICAkbm90aWZpY2F0aW9ucy5zdWNjZXNzKFwiWW91IGhhdmUgYmVlbiBsb2dnZWQgb3V0IHN1Y2Nlc3NmdWxseVwiKTtcbiAgVXNlcnMubG9nb3V0KCk7XG4gIHJldHVybiAkbG9jYXRpb24ucGF0aChcIi9hdXRoXCIpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJGxvY2F0aW9uXCIsIFwiJGh0dHBcIiwgXCIkbG9nXCIsIFwiJG5vdGlmaWNhdGlvbnNcIiwgXCJtb2RlbC51c2Vyc1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgY29uc29sZSwgJGxvY2F0aW9uLCAkbm90aWZpY2F0aW9ucywgQ2xhc3NpZmllZHMpIHtcbiAgdGhpcy5uYW1lID0gXCJbcGFnZTpjbGFzc2lmaWVkLWVkaXRdXCI7XG4gIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJpbml0aWFsaXppbmdcIiwgQ2xhc3NpZmllZHMuZ2V0KCRzdGF0ZVBhcmFtcy5pZCwgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCBjbGFzc2lmaWVkKSB7XG4gICAgICB2YXIgaSwgaW1hZ2UsIGxlbiwgcmVmO1xuICAgICAgcmVmID0gY2xhc3NpZmllZC5pbWFnZXMgfHwgW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaW1hZ2UgPSByZWZbaV07XG4gICAgICAgIGltYWdlLnN0YXR1cyA9IFwib24tc2VydmVyXCI7XG4gICAgICAgIGltYWdlLnNyYyA9IFwiL3VwbG9hZHMvdGh1bWIvXCIgKyBpbWFnZS5maWxlbmFtZTtcbiAgICAgIH1cbiAgICAgICRzY29wZS5jbGFzc2lmaWVkID0gY2xhc3NpZmllZDtcbiAgICAgIHJldHVybiAkc2NvcGUuJGVtaXQoXCJwYWdlLWxvYWRlZFwiKTtcbiAgICB9O1xuICB9KSh0aGlzKSkpO1xuICByZXR1cm4gJHNjb3BlLm9uU3VjY2VzcyA9IGZ1bmN0aW9uKGNsYXNzaWZpZWQpIHtcbiAgICAkbm90aWZpY2F0aW9ucy5zdWNjZXNzKFwiWW91ciBjbGFzc2lmaWVkIGhhcyBiZWVuIGVkaXRlZCBzdWNjZXNzZnVsbHkhXCIpO1xuICAgIHJldHVybiAkbG9jYXRpb24ucGF0aChcIi9hY2NvdW50L21hbmFnZVwiKTtcbiAgfTtcbn07XG5cbmV4cG9ydHMuJGluamVjdCA9IFtcIiRzY29wZVwiLCBcIiRzdGF0ZVBhcmFtc1wiLCBcIiRsb2dcIiwgXCIkbG9jYXRpb25cIiwgXCIkbm90aWZpY2F0aW9uc1wiLCBcIm1vZGVsLmNsYXNzaWZpZWRzXCJdO1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCAkZ29vZ2xlTWFwcywgY29uc29sZSwgQ2xhc3NpZmllZHMpIHtcbiAgdGhpcy5uYW1lID0gXCJbcGFnZTpjbGFzc2lmaWVkLWZpbmlzaF1cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgY29uc29sZS5kZWJ1Zyh0aGlzLm5hbWUsIFwicm91dGVQYXJhbXNcIiwgJHN0YXRlUGFyYW1zKTtcbiAgcmV0dXJuICRzY29wZS4kZW1pdChcInBhZ2UtbG9hZGVkXCIpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHN0YXRlUGFyYW1zXCIsIFwiJGdvb2dsZU1hcHNcIiwgXCIkbG9nXCIsIFwibW9kZWwuY2xhc3NpZmllZHNcIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlLCBjb25zb2xlLCAkbG9jYXRpb24sICRub3RpZmljYXRpb25zLCBVc2Vycykge1xuICB0aGlzLm5hbWUgPSBcIltwYWdlOmNsYXNzaWZpZWQtcG9zdF1cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgJHNjb3BlLm9uU3VjY2VzcyA9IGZ1bmN0aW9uKGNsYXNzaWZpZWQpIHtcbiAgICAkbm90aWZpY2F0aW9ucy5zdWNjZXNzKFwiWW91ciBjbGFzc2lmaWVkIGhhcyBiZWVuIHN1Ym1pdHRlZCBzdWNjZXNzZnVsbHkhXCIpO1xuICAgIHJldHVybiAkbG9jYXRpb24ucGF0aChcIi9jbGFzc2lmaWVkL2ZpbmlzaC9cIiArIGNsYXNzaWZpZWQuaWQpO1xuICB9O1xuICAkc2NvcGUuaXNVc2VyTG9nZ2VkSW4gPSBVc2Vycy5pc0xvZ2dlZEluKCk7XG4gICRzY29wZS5oZXJvVVJMID0gXCJsYW5kaW5nLmpwZ1wiO1xuICByZXR1cm4gJHNjb3BlLm9uSGVyb0xvYWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJHNjb3BlLiRlbWl0KFwicGFnZS1sb2FkZWRcIik7XG4gIH07XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkbG9nXCIsIFwiJGxvY2F0aW9uXCIsIFwiJG5vdGlmaWNhdGlvbnNcIiwgXCJtb2RlbC51c2Vyc1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZVBhcmFtcywgJHJvb3RTY29wZSwgY29uc29sZSwgQ2F0ZWdvcmllcykge1xuICB2YXIgY2xzO1xuICB0aGlzLm5hbWUgPSBcIltwYWdlOmNsYXNzaWZpZWQtc2VhcmNoXVwiO1xuICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiaW5pdGlhbGl6aW5nXCIpO1xuICBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgXCJyb3V0ZVBhcmFtc1wiLCAkc3RhdGVQYXJhbXMpO1xuICAkc2NvcGUuY2hpbGRDYXRlZ29yeSA9IENhdGVnb3JpZXMuZmluZEJ5U2x1Zygkc3RhdGVQYXJhbXMuY2hpbGQpO1xuICAkc2NvcGUucGFyZW50Q2F0ZWdvcnkgPSBDYXRlZ29yaWVzLmZpbmRCeVNsdWcoJHN0YXRlUGFyYW1zLnBhcmVudCk7XG4gICRzY29wZS5oZXJvVVJMID0gXCJjbC1cIiArICRzY29wZS5wYXJlbnRDYXRlZ29yeS5zbHVnICsgXCIuanBnXCI7XG4gICRzY29wZS5vbkhlcm9Mb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRzY29wZS4kZW1pdChcInBhZ2UtbG9hZGVkXCIpO1xuICB9O1xuICAkc2NvcGUucXVlcnkgPSB7XG4gICAgY2hpbGRfY2F0ZWdvcnk6ICRzY29wZS5jaGlsZENhdGVnb3J5LmlkLFxuICAgIHBhcmVudF9jYXRlZ29yeTogJHNjb3BlLnBhcmVudENhdGVnb3J5LmlkXG4gIH07XG4gICRyb290U2NvcGUuYm9keUNsYXNzZXMgPSAkcm9vdFNjb3BlLmJvZHlDbGFzc2VzIHx8IHt9O1xuICBmb3IgKGNscyBpbiAkcm9vdFNjb3BlLmJvZHlDbGFzc2VzKSB7XG4gICAgaWYgKChjbHMuaW5kZXhPZihcImNsLVwiKSkgPT09IDApIHtcbiAgICAgICRyb290U2NvcGUuYm9keUNsYXNzZXNbY2xzXSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gJHJvb3RTY29wZS5ib2R5Q2xhc3Nlc1tcImNsLVwiICsgJHN0YXRlUGFyYW1zLnBhcmVudF0gPSB0cnVlO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHN0YXRlUGFyYW1zXCIsIFwiJHJvb3RTY29wZVwiLCBcIiRsb2dcIiwgXCJtb2RlbC5jYXRlZ29yaWVzXCJdO1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY29wZSwgJHJvb3QsICRzdGF0ZVBhcmFtcywgY29uc29sZSwgQ2xhc3NpZmllZHMpIHtcbiAgdGhpcy5uYW1lID0gXCJbcGFnZTpjbGFzc2lmaWVkLXNpbmdsZV1cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgY29uc29sZS5kZWJ1Zyh0aGlzLm5hbWUsIFwicm91dGVQYXJhbXNcIiwgJHN0YXRlUGFyYW1zKTtcbiAgJHNjb3BlLiRvbihcImNsYXNzaWZpZWQtY2hhbmdlZFwiLCBmdW5jdGlvbihldmVudCwgY2xhc3NpZmllZCkge1xuICAgIHJldHVybiAkc2NvcGUuY2xhc3NpZmllZCA9IGNsYXNzaWZpZWQ7XG4gIH0pO1xuICBpZiAoJHNjb3BlLmNsYXNzaWZpZWQgPT0gbnVsbCkge1xuICAgIHJldHVybiBDbGFzc2lmaWVkcy5nZXRCeVNsdWcoJHN0YXRlUGFyYW1zLnNsdWcsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGVycm9yLCBjbGFzc2lmaWVkKSB7XG4gICAgICAgICRzY29wZS5jbGFzc2lmaWVkID0gY2xhc3NpZmllZDtcbiAgICAgICAgJHNjb3BlLiRlbWl0KFwicGFnZS1sb2FkZWRcIik7XG4gICAgICAgIHJldHVybiAkcm9vdC5tZXRhLnJvYm90c05vSW5kZXggPSBjbGFzc2lmaWVkLm1ldGEuaGlkZVNlYXJjaEVuZ2luZTtcbiAgICAgIH07XG4gICAgfSkodGhpcykpO1xuICB9XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc2NvcGVcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJHN0YXRlUGFyYW1zXCIsIFwiJGxvZ1wiLCBcIm1vZGVsLmNsYXNzaWZpZWRzXCJdO1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY29wZSwgJHNjcm9sbGVyLCBjb25zb2xlKSB7XG4gIHRoaXMubmFtZSA9IFwiW3BhZ2U6bGFuZGluZ11cIjtcbiAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgJHNjb3BlLmdvdG9FbGVtZW50ID0gZnVuY3Rpb24oZUlEKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICRzY3JvbGxlci5zY3JvbGxUbyhlSUQpO1xuICAgIH0pLCAxMDApO1xuICB9O1xuICAkc2NvcGUuaGVyb1VSTCA9IFwibGFuZGluZy5qcGdcIjtcbiAgcmV0dXJuICRzY29wZS5vbkhlcm9Mb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRzY29wZS4kZW1pdChcInBhZ2UtbG9hZGVkXCIpO1xuICB9O1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHNjb3BlXCIsIFwiJHNjcm9sbGVyXCIsIFwiJGxvZ1wiXTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG4gIGNvbnNvbGUubG9nKFwiW2RpcmVjdGl2ZXNdIGluaXRpYWxpemluZ1wiKTtcbiAgYXBwLmRpcmVjdGl2ZShcIm5nSW1hZ2VMb2FkZXJcIiwgcmVxdWlyZShcIi4vbmdJbWFnZUxvYWRlclwiKSk7XG4gIGFwcC5kaXJlY3RpdmUoXCJuZ01vZGVsRmlsZVwiLCByZXF1aXJlKFwiLi9uZ01vZGVsRmlsZVwiKSk7XG4gIHJldHVybiBhcHAuZGlyZWN0aXZlKFwibmdTY3JvbGxcIiwgcmVxdWlyZShcIi4vbmdTY3JvbGxcIikpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgc2NvcGU6IHtcbiAgICAgIG5nSW1hZ2VTdWNjZXNzOiBcIiZcIixcbiAgICAgIG5nSW1hZ2VGYWlsOiBcIiZcIlxuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIHZhciBmYWlsdXJlLCBpbWcsIGlzVHlwZSwgcHJvcCwgc3JjLCBzdWNjZXNzO1xuICAgICAgaXNUeXBlID0gZnVuY3Rpb24obywgdCkge1xuICAgICAgICByZXR1cm4gKHR5cGVvZiBvKS5pbmRleE9mKHQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkpID09PSAwO1xuICAgICAgfTtcbiAgICAgIGltZyA9IGVsZW1lbnRbMF07XG4gICAgICBzcmMgPSBhdHRyaWJ1dGVzLm5nSW1hZ2VMb2FkZXI7XG4gICAgICBlbGVtZW50LmFkZENsYXNzKFwiaW1hZ2UtbG9hZGluZ1wiKTtcbiAgICAgIHN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZuO1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKFwiaW1hZ2UtbG9hZGluZ1wiKTtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhcImltYWdlLXN1Y2Nlc3NcIik7XG4gICAgICAgIGZuID0gKHNjb3BlLm5nSW1hZ2VTdWNjZXNzICYmIHNjb3BlLm5nSW1hZ2VTdWNjZXNzKCkpIHx8IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfTtcbiAgICAgIGZhaWx1cmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZuO1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKFwiaW1hZ2UtbG9hZGluZ1wiKTtcbiAgICAgICAgZWxlbWVudC5hZGRDbGFzcyhcImltYWdlLWZhaWxcIik7XG4gICAgICAgIGZuID0gKHNjb3BlLm5nSW1hZ2VGYWlsICYmIHNjb3BlLm5nSW1hZ2VGYWlsKCkpIHx8IGZ1bmN0aW9uKCkge307XG4gICAgICAgIHJldHVybiBmbigpO1xuICAgICAgfTtcbiAgICAgIHByb3AgPSBpc1R5cGUoaW1nLm5hdHVyYWxXaWR0aCwgXCJ1XCIpID8gXCJ3aWR0aFwiIDogXCJuYXR1cmFsV2lkdGhcIjtcbiAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgICBpZiAoaW1nLmNvbXBsZXRlKSB7XG4gICAgICAgIGlmIChpbWdbcHJvcF0pIHtcbiAgICAgICAgICByZXR1cm4gc3VjY2VzcyhpbWcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWlsdXJlKGltZyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGltZy5vbmxvYWQgPSBzdWNjZXNzO1xuICAgICAgICByZXR1cm4gaW1nLm9uZXJyb3IgPSBmYWlsdXJlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBuZ01vZGVsRmlsZTogXCImXCJcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICByZXR1cm4gZWxlbWVudC5iaW5kKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGNoYW5nZUV2ZW50KSB7XG4gICAgICAgIHZhciBmaWxlcywgcmVhZGVyLCByZXN1bHRzO1xuICAgICAgICByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcjtcbiAgICAgICAgZmlsZXMgPSBjaGFuZ2VFdmVudC50YXJnZXQuZmlsZXM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgcmV0dXJuIChzY29wZS5uZ01vZGVsRmlsZSB8fCBmdW5jdGlvbigpIHt9KSgpKGZpbGVzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHdpbmRvdykge1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBuZ1Njcm9sbDogXCImXCJcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICByZXR1cm4gKGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KSkuYmluZChcInNjcm9sbFwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgc2Nyb2xsRm47XG4gICAgICAgIHNjcm9sbEZuID0gc2NvcGUubmdTY3JvbGwoKTtcbiAgICAgICAgaWYgKHR5cGVvZiBzY3JvbGxGbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIHNjcm9sbEZuKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHdpbmRvd1wiXTtcbiIsInZhciBhcHA7XG5cbmNvbnNvbGUubG9nKFwiW2FwcF0gaW5pdGlhbGl6aW5nXCIpO1xuXG5hcHAgPSBhbmd1bGFyLm1vZHVsZShcIkFwcFwiLCBbXCJ1aS5yb3V0ZXJcIl0pO1xuXG4ocmVxdWlyZShcIi4vY29uZmlnXCIpKShhcHApO1xuXG4ocmVxdWlyZShcIi4vY29udHJvbGxlcnNcIikpKGFwcCk7XG5cbihyZXF1aXJlKFwiLi9kaXJlY3RpdmVzXCIpKShhcHApO1xuXG4ocmVxdWlyZShcIi4vZmFjdG9yaWVzXCIpKShhcHApO1xuXG4ocmVxdWlyZShcIi4vZmlsdGVyc1wiKSkoYXBwKTtcblxuKHJlcXVpcmUoXCIuL3Byb3ZpZGVyc1wiKSkoYXBwKTtcblxuKHJlcXVpcmUoXCIuL3J1blwiKSkoYXBwKTtcblxuKHJlcXVpcmUoXCIuL3NlcnZpY2VzXCIpKShhcHApO1xuXG4ocmVxdWlyZShcIi4vdmFsdWVzXCIpKShhcHApO1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRodHRwLCBjb25zb2xlLCAkc3RvcmFnZSkge1xuICByZXR1cm4gbmV3ICgoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gX0NsYXNzKCkge31cblxuICAgIF9DbGFzcy5wcm90b3R5cGUubmFtZSA9IFwiW21vZGVsOmNhdGVnb3J5XVwiO1xuXG5cbiAgICAvKlxuICAgICMjICpnZXRBbGwoY2FsbGJhY2spOipcbiAgICBUaGlzIGZ1bmN0aW9uIHJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHRoZSBjYXRlZ29yaWVzIGZyb20gdGhlIHNlcnZlci4gVGhlXG4gICAgY2FsbGJhY2sgZnVuY3Rpb24gZm9sbG93cyBhIG5vZGUtc3R5bGUgcGF0dGVybiBhbmQgc2hvdWxkIGxvb2sgc29tZXRoaW5nIGxpa2VcbiAgICB0aGlzLlxuICAgIFxuICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbihlcnJvciwgY2F0ZWdvcmllcykgeyBMT0dJQyBIRVJFIH07XG4gICAgICovXG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmdldEFsbCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYXRlZ29yaWVzO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmZpbmRCeVNsdWcgPSBmdW5jdGlvbihzbHVnKSB7XG4gICAgICB2YXIgY2F0LCBjaGlsZGNhdCwgaSwgaiwgbGVuLCBsZW4xLCByZWYsIHJlZjE7XG4gICAgICByZWYgPSB0aGlzLmNhdGVnb3JpZXM7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2F0ID0gcmVmW2ldO1xuICAgICAgICBpZiAoY2F0LnNsdWcgPT09IHNsdWcpIHtcbiAgICAgICAgICByZXR1cm4gY2F0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChjYXQuY2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICAgIHJlZjEgPSBjYXQuY2hpbGRyZW47XG4gICAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgICBjaGlsZGNhdCA9IHJlZjFbal07XG4gICAgICAgICAgICBpZiAoY2hpbGRjYXQuc2x1ZyA9PT0gc2x1Zykge1xuICAgICAgICAgICAgICByZXR1cm4gY2hpbGRjYXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfTtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuZmluZEJ5UGFyZW50SWQgPSBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIGNhdCwgaSwgbGVuLCByZWY7XG4gICAgICByZWYgPSB0aGlzLmNhdGVnb3JpZXM7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2F0ID0gcmVmW2ldO1xuICAgICAgICBpZiAoY2F0LmlkID09PSBpZCkge1xuICAgICAgICAgIHJldHVybiBjYXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5maW5kQnlDaGlsZElkID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBjYXQsIGNoaWxkLCBpLCBqLCBsZW4sIGxlbjEsIHJlZiwgcmVmMTtcbiAgICAgIHJlZiA9IHRoaXMuY2F0ZWdvcmllcztcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjYXQgPSByZWZbaV07XG4gICAgICAgIGlmIChjYXQuY2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICAgIHJlZjEgPSBjYXQuY2hpbGRyZW47XG4gICAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZjEubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgICBjaGlsZCA9IHJlZjFbal07XG4gICAgICAgICAgICBpZiAoY2hpbGQuaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5fc2V0Q291bnRlcnMgPSBmdW5jdGlvbihjb3VudGVycykge1xuICAgICAgdmFyIGNhdGVnb3J5Q291bnQsIGNoaWxkQ2F0ZWdvcnksIGksIGosIGxlbiwgbGVuMSwgcGFyZW50Q2F0ZWdvcnksIHJlZiwgcmVmMSwgcmVzdWx0cztcbiAgICAgIHJlZiA9IHRoaXMuY2F0ZWdvcmllcyB8fCBbXTtcbiAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwYXJlbnRDYXRlZ29yeSA9IHJlZltpXTtcbiAgICAgICAgcGFyZW50Q2F0ZWdvcnkuY291bnQgPSAwO1xuICAgICAgICByZWYxID0gY291bnRlcnMucGFyZW50X2NhdGVnb3J5IHx8IFtdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmMS5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBjYXRlZ29yeUNvdW50ID0gcmVmMVtqXTtcbiAgICAgICAgICBpZiAoY2F0ZWdvcnlDb3VudC5pZCA9PT0gcGFyZW50Q2F0ZWdvcnkuaWQpIHtcbiAgICAgICAgICAgIHBhcmVudENhdGVnb3J5LmNvdW50ID0gY2F0ZWdvcnlDb3VudC5jb3VudDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXN1bHRzLnB1c2goKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBrLCBsZW4yLCByZWYyLCByZXN1bHRzMTtcbiAgICAgICAgICByZWYyID0gcGFyZW50Q2F0ZWdvcnkuY2hpbGRyZW4gfHwgW107XG4gICAgICAgICAgcmVzdWx0czEgPSBbXTtcbiAgICAgICAgICBmb3IgKGsgPSAwLCBsZW4yID0gcmVmMi5sZW5ndGg7IGsgPCBsZW4yOyBrKyspIHtcbiAgICAgICAgICAgIGNoaWxkQ2F0ZWdvcnkgPSByZWYyW2tdO1xuICAgICAgICAgICAgY2hpbGRDYXRlZ29yeS5jb3VudCA9IDA7XG4gICAgICAgICAgICByZXN1bHRzMS5wdXNoKChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIGwsIGxlbjMsIHJlZjMsIHJlc3VsdHMyO1xuICAgICAgICAgICAgICByZWYzID0gY291bnRlcnMuY2hpbGRfY2F0ZWdvcnkgfHwgW107XG4gICAgICAgICAgICAgIHJlc3VsdHMyID0gW107XG4gICAgICAgICAgICAgIGZvciAobCA9IDAsIGxlbjMgPSByZWYzLmxlbmd0aDsgbCA8IGxlbjM7IGwrKykge1xuICAgICAgICAgICAgICAgIGNhdGVnb3J5Q291bnQgPSByZWYzW2xdO1xuICAgICAgICAgICAgICAgIGlmIChjYXRlZ29yeUNvdW50LmlkID09PSBjaGlsZENhdGVnb3J5LmlkKSB7XG4gICAgICAgICAgICAgICAgICBjaGlsZENhdGVnb3J5LmNvdW50ID0gY2F0ZWdvcnlDb3VudC5jb3VudDtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHRzMi5wdXNoKHZvaWQgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiByZXN1bHRzMjtcbiAgICAgICAgICAgIH0pKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0czE7XG4gICAgICAgIH0pKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfTtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuZG93bmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfZmV0Y2hGcm9tQVBJLCBfZ2V0Q291bnRlcnMsIGNhY2hlLCBleGNlcHRpb247XG4gICAgICBpZiAodGhpcy5jYXRlZ29yaWVzICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImRvd25sb2FkaW5nIGNhdGVnb3JpZXNcIik7XG4gICAgICBfZ2V0Q291bnRlcnMgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coX3RoaXMubmFtZSwgXCJmZXRjaGluZyBjYXRlZ29yeSBjb3VudGVyc1wiKTtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS9jYXRlZ29yaWVzL2NvdW50ZXJzXCIpLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKF90aGlzLm5hbWUsIFwiZmV0Y2hlZCBjYXRlZ29yeSBjb3VudGVyc1wiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoX3RoaXMubmFtZSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgX3RoaXMuX3NldENvdW50ZXJzKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCByZXNwb25zZSk7XG4gICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoX3RoaXMubmFtZSwgXCJlcnJvciBmZXRjaGluZyBjYXRlZ29yeSBjb3VudGVyc1wiKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKF90aGlzLm5hbWUsIHJlc3BvbnNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgX2ZldGNoRnJvbUFQSSA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICRodHRwLmdldChcIi9hcGkvY2F0ZWdvcmllcy9cIikuc3VjY2VzcyhmdW5jdGlvbihjYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCBcImZldGNoZWQgY2F0ZWdvcmllcyBmcm9tIEFQSVwiKTtcbiAgICAgICAgICAgIF90aGlzLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xuICAgICAgICAgICAgcmV0dXJuICRzdG9yYWdlLmxvY2FsKFwibW9kZWxzOmNhdGVnb3J5XCIsIGFuZ3VsYXIudG9Kc29uKGNhdGVnb3JpZXMpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgY2FjaGUgPSAkc3RvcmFnZS5sb2NhbChcIm1vZGVsczpjYXRlZ29yeVwiKTtcbiAgICAgIGlmICgoY2FjaGUgIT0gbnVsbCkgJiYgZmFsc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImZldGNoaW5nIGNhdGVnb3JpZXMgZnJvbSBjYWNoZVwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBhbmd1bGFyLmZyb21Kc29uKGNhY2hlKTtcbiAgICAgICAgICBfZ2V0Q291bnRlcnMoKTtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2codGhpcy5uYW1lLCBcImZldGNoZWQgY2F0ZWdvcmllcyBmcm9tIGNhY2hlXCIpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICBleGNlcHRpb24gPSBfZXJyb3I7XG4gICAgICAgICAgY29uc29sZS5lcnJvcih0aGlzLm5hbWUsIFwiY2FuJ3QgcGFyc2UgY2F0ZWdvcmllcyBmcm9tIGNhY2hlXCIpO1xuICAgICAgICAgIHJldHVybiBfZmV0Y2hGcm9tQVBJKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBfZ2V0Q291bnRlcnMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImZldGNoaW5nIGNhdGVnb3JpZXMgZnJvbSBBUElcIik7XG4gICAgICAgIHJldHVybiBfZmV0Y2hGcm9tQVBJKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gX2dldENvdW50ZXJzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX0NsYXNzO1xuXG4gIH0pKCkpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJGh0dHBcIiwgXCIkbG9nXCIsIFwiJHN0b3JhZ2VcIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGxvY2F0aW9uLCAkaHR0cCwgY29uc29sZSkge1xuICByZXR1cm4gbmV3ICgoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gX0NsYXNzKCkge31cblxuICAgIF9DbGFzcy5wcm90b3R5cGUubmFtZSA9IFwiW21vZGVsOmNsYXNzaWZpZWRdXCI7XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmRlZmF1bHRzID0ge1xuICAgICAgY29udGFjdDoge30sXG4gICAgICBpbWFnZXM6IFtdLFxuICAgICAgbWV0YToge31cbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5zdGF0dXNlcyA9IHtcbiAgICAgIElOQUNUSVZFOiAwLFxuICAgICAgQUNUSVZFOiAxLFxuICAgICAgUkVKRUNURUQ6IDIsXG4gICAgICBBUkNISVZFRDogMyxcbiAgICAgIEJBTk5FRDogNCxcbiAgICAgIEZMQUdHRUQ6IDUsXG4gICAgICBWRVJJRklFRDogNixcbiAgICAgIEVYUElSRUQ6IDdcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5sYW5ndWFnZXMgPSB7XG4gICAgICBFTkdMSVNIOiAxLFxuICAgICAgQVJBQklDOiAyLFxuICAgICAgSElOREk6IDNcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5fc2VyaWFsaXplR0VUID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgcCwgc3RyO1xuICAgICAgc3RyID0gW107XG4gICAgICBmb3IgKHAgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgICAgICBzdHIucHVzaCgoZW5jb2RlVVJJQ29tcG9uZW50KHApKSArIFwiPVwiICsgKGVuY29kZVVSSUNvbXBvbmVudChvYmpbcF0pKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHIuam9pbignJicpO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbihjbGFzc2lmaWVkLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGZvcm1kYXRhLCBtZXRob2QsIHVybDtcbiAgICAgIGlmIChjbGFzc2lmaWVkID09IG51bGwpIHtcbiAgICAgICAgY2xhc3NpZmllZCA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgfVxuICAgICAgaWYgKGNsYXNzaWZpZWQuaWQgPT0gbnVsbCkge1xuICAgICAgICBtZXRob2QgPSBcIlBPU1RcIjtcbiAgICAgICAgdXJsID0gXCIvYXBpL2NsYXNzaWZpZWRzXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXRob2QgPSBcIlBVVFwiO1xuICAgICAgICB1cmwgPSBcIi9hcGkvY2xhc3NpZmllZHMvXCIgKyBjbGFzc2lmaWVkLmlkO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcInNlbmRpbmcgY2xhc3NpZmllZCB0byBzZXJ2ZXIgW1wiICsgbWV0aG9kICsgXCJdXCIpO1xuICAgICAgY29uc29sZS5kZWJ1Zyh0aGlzLm5hbWUsIGNsYXNzaWZpZWQpO1xuICAgICAgZm9ybWRhdGEgPSB0aGlzLl9nZXRGb3JtZGF0YShjbGFzc2lmaWVkKTtcbiAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBkYXRhOiBmb3JtZGF0YSxcbiAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgIHRyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHksXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiB2b2lkIDBcbiAgICAgICAgfVxuICAgICAgfSkuc3VjY2VzcygoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNsYXNzaWZpZWQpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgX3RoaXMuX3BhcnNlKGNsYXNzaWZpZWQpKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5lcnJvcihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2socmVzcG9uc2UpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUucXVlcnkgPSBmdW5jdGlvbihwYXJhbWV0ZXJzLCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuICRodHRwLmdldChcIi9hcGkvY2xhc3NpZmllZHM/XCIgKyAodGhpcy5fc2VyaWFsaXplR0VUKHBhcmFtZXRlcnMpKSkuc3VjY2VzcygoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNsYXNzaWZpZWRzKSB7XG4gICAgICAgICAgdmFyIGNsYXNzaWZpZWQ7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBqLCBsZW4sIHJlc3VsdHM7XG4gICAgICAgICAgICByZXN1bHRzID0gW107XG4gICAgICAgICAgICBmb3IgKGogPSAwLCBsZW4gPSBjbGFzc2lmaWVkcy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICAgICAgICBjbGFzc2lmaWVkID0gY2xhc3NpZmllZHNbal07XG4gICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh0aGlzLl9wYXJzZShjbGFzc2lmaWVkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICB9KS5jYWxsKF90aGlzKSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSkuZXJyb3IoY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaykge1xuICAgICAgcmV0dXJuICRodHRwLmdldChcIi9hcGkvY2xhc3NpZmllZHMvXCIgKyBpZCkuc3VjY2VzcygoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGNsYXNzaWZpZWQpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgX3RoaXMuX3BhcnNlKGNsYXNzaWZpZWQpKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKS5lcnJvcihjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuZ2V0QnlTbHVnID0gZnVuY3Rpb24oc2x1ZywgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoXCIvYXBpL2NsYXNzaWZpZWRzL3NsdWcvXCIgKyBzbHVnKS5zdWNjZXNzKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oY2xhc3NpZmllZCkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBfdGhpcy5fcGFyc2UoY2xhc3NpZmllZCkpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpLmVycm9yKGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5nZXREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFyc2UobmV3IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWZhdWx0cztcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLl9wYXJzZSA9IGZ1bmN0aW9uKGNsYXNzaWZpZWQpIHtcbiAgICAgIHZhciBVUkwsIGNsLCBpbWFnZSwgaiwgbGVuLCByZWYsIHR3ZWV0O1xuICAgICAgY2wgPSB7fTtcbiAgICAgIGFuZ3VsYXIuZXh0ZW5kKGNsLCB0aGlzLmRlZmF1bHRzLCBjbGFzc2lmaWVkKTtcbiAgICAgIFVSTCA9IFwiaHR0cHM6Ly9cIiArICgkbG9jYXRpb24uaG9zdCgpKSArIFwiL1wiICsgY2wuc2x1ZztcbiAgICAgIHR3ZWV0ID0gXCJDaGVjayBvdXQgdGhpcyBjbGFzc2lmaWVkLCBcIiArIFVSTDtcbiAgICAgIGNsLnNvY2lhbCA9IHtcbiAgICAgICAgZmFjZWJvb2s6IFwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwP3U9XCIgKyBVUkwsXG4gICAgICAgIGdwbHVzOiBcImh0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlP3VybD1cIiArIFVSTCxcbiAgICAgICAgdHdpdHRlcjogXCJodHRwczovL3R3aXR0ZXIuY29tL2hvbWU/c3RhdHVzPVwiICsgKGVuY29kZVVSSSh0d2VldCkpLFxuICAgICAgICBlbWFpbDogXCJtYWlsdG86P3N1YmplY3Q9Q2hlY2tvdXQgdGhpcyBjbDogJ1wiICsgY2wudGl0bGUgKyBcIicgJmJvZHk9PHlvdXIgbWVzc2FnZT4lMEQlMEElMEQlMEF1cmw6IFwiICsgVVJMXG4gICAgICB9O1xuICAgICAgcmVmID0gY2wuaW1hZ2VzIHx8IFtdO1xuICAgICAgZm9yIChqID0gMCwgbGVuID0gcmVmLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIGltYWdlID0gcmVmW2pdO1xuICAgICAgICBjbC5tYWluSW1hZ2UgPSBpbWFnZTtcbiAgICAgICAgaWYgKChpbWFnZS5tYWluICE9IG51bGwpICYmIGltYWdlLm1haW4pIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3dpdGNoIChjbC5zdGF0dXMpIHtcbiAgICAgICAgY2FzZSB0aGlzLnN0YXR1c2VzLkFDVElWRTpcbiAgICAgICAgICBjbC5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgdGhpcy5zdGF0dXNlcy5BUkNISVZFRDpcbiAgICAgICAgICBjbC5pc0FyY2hpdmVkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB0aGlzLnN0YXR1c2VzLlJFSkVDVEVEOlxuICAgICAgICAgIGNsLmlzUmVqZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHRoaXMuc3RhdHVzZXMuQkFOTkVEOlxuICAgICAgICAgIGNsLmlzQmFubmVkID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB0aGlzLnN0YXR1c2VzLklOQUNUSVZFOlxuICAgICAgICAgIGNsLnVuZGVyUmV2aWV3ID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSB0aGlzLnN0YXR1c2VzLkVYUElSRUQ6XG4gICAgICAgICAgY2wuaGFzRXhwaXJlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBzd2l0Y2ggKGNsLmxhbmd1YWdlKSB7XG4gICAgICAgIGNhc2UgdGhpcy5sYW5ndWFnZXMuRU5HTElTSDpcbiAgICAgICAgICBjbC5pc0VuZ2xpc2ggPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIHRoaXMubGFuZ3VhZ2VzLkFSQUJJQzpcbiAgICAgICAgICBjbC5pc0FyYWJpYyA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoY2wubWV0YS5kZWxpdmVyeUluY2x1ZGVkKSB7XG4gICAgICAgIGlmICghY2wubWV0YS5mcmVlRGVsaXZlcnlJbmNsdWRlZCkge1xuICAgICAgICAgIGNsLmhhc0RlbGl2ZXJ5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbC5oYXNGcmVlRGVsaXZlcnkgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY2w7XG4gICAgfTtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuX2dldEZvcm1kYXRhID0gZnVuY3Rpb24oY2xhc3NpZmllZCkge1xuICAgICAgdmFyIGZpbGVJbmRleCwgZm9ybWRhdGEsIGhhc01haW5JbWFnZSwgaW1hZ2UsIGltYWdlcywgaiwgbGVuLCBuZXdJbWFnZXM7XG4gICAgICBmaWxlSW5kZXggPSAwO1xuICAgICAgaGFzTWFpbkltYWdlID0gZmFsc2U7XG4gICAgICBuZXdJbWFnZXMgPSBbXTtcbiAgICAgIGltYWdlcyA9IGNsYXNzaWZpZWQuaW1hZ2VzIHx8IFtdO1xuICAgICAgZGVsZXRlIGNsYXNzaWZpZWQuaW1hZ2VzO1xuICAgICAgZm9ybWRhdGEgPSBuZXcgRm9ybURhdGE7XG4gICAgICBmb3IgKGogPSAwLCBsZW4gPSBpbWFnZXMubGVuZ3RoOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgaW1hZ2UgPSBpbWFnZXNbal07XG4gICAgICAgIGlmIChpbWFnZS5zdGF0dXMgPT09IFwidG8tdXBsb2FkXCIpIHtcbiAgICAgICAgICBpZiAoaW1hZ2UubWFpbikge1xuICAgICAgICAgICAgaGFzTWFpbkltYWdlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZm9ybWRhdGEuYXBwZW5kKFwiaW1hZ2VzW11cIiwgaW1hZ2UuZmlsZSwgaW1hZ2UuZmlsZS5uYW1lKTtcbiAgICAgICAgfSBlbHNlIGlmIChpbWFnZS5zdGF0dXMgPT09IFwidG8tZGVsZXRlLWZyb20tc2VydmVyXCIpIHtcbiAgICAgICAgICBpZiAoY2xhc3NpZmllZC5maWxlc1RvRGVsZXRlID09IG51bGwpIHtcbiAgICAgICAgICAgIGNsYXNzaWZpZWQuZmlsZXNUb0RlbGV0ZSA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjbGFzc2lmaWVkLmZpbGVzVG9EZWxldGUucHVzaChpbWFnZS5maWxlbmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGltYWdlLnNyYztcbiAgICAgICAgZGVsZXRlIGltYWdlLmZpbGU7XG4gICAgICAgIGRlbGV0ZSBpbWFnZS5zdGF0dXM7XG4gICAgICB9XG4gICAgICBpZiAoIWhhc01haW5JbWFnZSAmJiBuZXdJbWFnZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBuZXdJbWFnZXNbMF0ubWFpbiA9IHRydWU7XG4gICAgICB9XG4gICAgICBjbGFzc2lmaWVkLm5ld19pbWFnZXMgPSBuZXdJbWFnZXM7XG4gICAgICBjbGFzc2lmaWVkLmltYWdlcyA9IGltYWdlcztcbiAgICAgIGZvcm1kYXRhLmFwcGVuZChcImNsYXNzaWZpZWRcIiwgYW5ndWxhci50b0pzb24oY2xhc3NpZmllZCkpO1xuICAgICAgcmV0dXJuIGZvcm1kYXRhO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLl9kYXRhVVJJdG9CbG9iID0gZnVuY3Rpb24oZGF0YVVSSSkge1xuICAgICAgdmFyIGJhc2U2NFRvQmxvYiwgbWF0Y2hlZDtcbiAgICAgIGJhc2U2NFRvQmxvYiA9IGZ1bmN0aW9uKGJhc2U2NCwgY29udGVudFR5cGUsIHNsaWNlU2l6ZSkge1xuICAgICAgICB2YXIgYnl0ZUFycmF5LCBieXRlQXJyYXlzLCBieXRlQ2hhcmFjdGVycywgYnl0ZU51bWJlcnMsIGksIG9mZnNldCwgc2xpY2U7XG4gICAgICAgIGlmIChjb250ZW50VHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgY29udGVudFR5cGUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzbGljZVNpemUgPT0gbnVsbCkge1xuICAgICAgICAgIHNsaWNlU2l6ZSA9IDUxMjtcbiAgICAgICAgfVxuICAgICAgICBieXRlQ2hhcmFjdGVycyA9IGF0b2IoYmFzZTY0KTtcbiAgICAgICAgYnl0ZUFycmF5cyA9IFtdO1xuICAgICAgICBvZmZzZXQgPSAwO1xuICAgICAgICB3aGlsZSAob2Zmc2V0IDwgYnl0ZUNoYXJhY3RlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgc2xpY2UgPSBieXRlQ2hhcmFjdGVycy5zbGljZShvZmZzZXQsIG9mZnNldCArIHNsaWNlU2l6ZSk7XG4gICAgICAgICAgYnl0ZU51bWJlcnMgPSBuZXcgQXJyYXkoc2xpY2UubGVuZ3RoKTtcbiAgICAgICAgICBpID0gMDtcbiAgICAgICAgICB3aGlsZSAoaSA8IHNsaWNlLmxlbmd0aCkge1xuICAgICAgICAgICAgYnl0ZU51bWJlcnNbaV0gPSBzbGljZS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBieXRlQXJyYXkgPSBuZXcgVWludDhBcnJheShieXRlTnVtYmVycyk7XG4gICAgICAgICAgYnl0ZUFycmF5cy5wdXNoKGJ5dGVBcnJheSk7XG4gICAgICAgICAgb2Zmc2V0ICs9IHNsaWNlU2l6ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJsb2IoYnl0ZUFycmF5cywge1xuICAgICAgICAgIHR5cGU6IGNvbnRlbnRUeXBlXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICAgIG1hdGNoZWQgPSBkYXRhVVJJLm1hdGNoKC9kYXRhOihcXHcrXFwvXFx3Kyk7YmFzZTY0LCguKykvKTtcbiAgICAgIHJldHVybiBiYXNlNjRUb0Jsb2IobWF0Y2hlZFsyXSwgbWF0Y2hlZFsxXSk7XG4gICAgfTtcblxuICAgIHJldHVybiBfQ2xhc3M7XG5cbiAgfSkoKSk7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkbG9jYXRpb25cIiwgXCIkaHR0cFwiLCBcIiRsb2dcIl07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICBjb25zb2xlLmxvZyhcIltzZXJ2aWNlc10gaW5pdGlhbGl6aW5nXCIpO1xuICBhcHAuZmFjdG9yeShcIm1vZGVsLmNhdGVnb3JpZXNcIiwgcmVxdWlyZShcIi4vY2F0ZWdvcmllc1wiKSk7XG4gIGFwcC5mYWN0b3J5KFwibW9kZWwuY2xhc3NpZmllZHNcIiwgcmVxdWlyZShcIi4vY2xhc3NpZmllZHNcIikpO1xuICBhcHAuZmFjdG9yeShcIm1vZGVsLmxvY2F0aW9uc1wiLCByZXF1aXJlKFwiLi9sb2NhdGlvbnNcIikpO1xuICByZXR1cm4gYXBwLmZhY3RvcnkoXCJtb2RlbC51c2Vyc1wiLCByZXF1aXJlKFwiLi91c2Vyc1wiKSk7XG59O1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRodHRwLCBjb25zb2xlLCAkc3RvcmFnZSkge1xuICByZXR1cm4gbmV3ICgoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gX0NsYXNzKCkge31cblxuICAgIF9DbGFzcy5wcm90b3R5cGUubmFtZSA9IFwiW21vZGVsOmxvY2F0aW9uXVwiO1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHRoaXMubG9jYXRpb25zO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmZpbmRCeUlkID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBpLCBsZW4sIGxvY2F0aW9uLCByZWY7XG4gICAgICByZWYgPSB0aGlzLmxvY2F0aW9ucztcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsb2NhdGlvbiA9IHJlZltpXTtcbiAgICAgICAgaWYgKGxvY2F0aW9uLmlkID09PSBpZCkge1xuICAgICAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmRvd25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX2ZldGNoRnJvbUFQSSwgY2FjaGUsIGV4Y2VwdGlvbjtcbiAgICAgIGlmICh0aGlzLmxvY2F0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJkb3dubG9hZGluZyBsb2NhdGlvbnNcIik7XG4gICAgICBfZmV0Y2hGcm9tQVBJID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCBcImZldGNoaW5nIGxvY2F0aW9ucyBmcm9tIEFQSVwiKTtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS9sb2NhdGlvbnNcIikuc3VjY2VzcyhmdW5jdGlvbihsb2NhdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKF90aGlzLm5hbWUsIFwiZmV0Y2hlZCBsb2NhdGlvbnMgZnJvbSBBUElcIik7XG4gICAgICAgICAgICBfdGhpcy5sb2NhdGlvbnMgPSBsb2NhdGlvbnM7XG4gICAgICAgICAgICByZXR1cm4gJHN0b3JhZ2UubG9jYWwoXCJtb2RlbHM6bG9jYXRpb25cIiwgYW5ndWxhci50b0pzb24obG9jYXRpb25zKSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICAgIGNhY2hlID0gJHN0b3JhZ2UubG9jYWwoXCJtb2RlbHM6bG9jYXRpb25cIik7XG4gICAgICBpZiAoKGNhY2hlICE9IG51bGwpICYmIGZhbHNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJyZXRyaWV2aW5nIGxvY2F0aW9ucyBmcm9tIGNhY2hlXCIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmxvY2F0aW9ucyA9IGFuZ3VsYXIuZnJvbUpzb24oY2FjaGUpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICBleGNlcHRpb24gPSBfZXJyb3I7XG4gICAgICAgICAgcmV0dXJuIF9mZXRjaEZyb21BUEkoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcInJldHJpZXZpbmcgbG9jYXRpb25zIGZyb20gQVBJXCIpO1xuICAgICAgICByZXR1cm4gX2ZldGNoRnJvbUFQSSgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX0NsYXNzO1xuXG4gIH0pKCkpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJGh0dHBcIiwgXCIkbG9nXCIsIFwiJHN0b3JhZ2VcIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGh0dHAsICRyb290LCBjb25zb2xlLCAkc3RvcmFnZSkge1xuICByZXR1cm4gbmV3ICgoZnVuY3Rpb24oKSB7XG4gICAgX0NsYXNzLnByb3RvdHlwZS5uYW1lID0gXCJbbW9kZWw6dXNlcl1cIjtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuc2V0Q3VycmVudFVzZXIgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICByZXR1cm4gJHN0b3JhZ2Uuc2Vzc2lvbihcInVzZXI6Y3VycmVudFwiLCB1c2VyKTtcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5nZXRDdXJyZW50VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIChhbmd1bGFyLmZyb21Kc29uKCRzdG9yYWdlLnNlc3Npb24oXCJ1c2VyOmN1cnJlbnRcIikpKSB8fCB7fTtcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5pc0xvZ2dlZEluID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDdXJyZW50VXNlcigpLmlkICE9IG51bGw7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9DbGFzcygpIHtcbiAgICAgICRyb290LiRvbihcInVzZXI6Y2hhbmdlZFwiLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5vblVzZXJDaGFuZ2UoKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICAgIGlmICgkcm9vdC5ib2R5Q2xhc3NlcyA9PSBudWxsKSB7XG4gICAgICAgICRyb290LmJvZHlDbGFzc2VzID0ge307XG4gICAgICB9XG4gICAgfVxuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5vblVzZXJDaGFuZ2UgPSBmdW5jdGlvbih1c2VyKSB7XG4gICAgICByZXR1cm4gJHJvb3QuYm9keUNsYXNzZXNbXCJsb2dnZWQtaW5cIl0gPSB0aGlzLmlzTG9nZ2VkSW4oKTtcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5sb2dvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoXCIvYXBpL2F1dGgvbG9nb3V0XCIpLnN1Y2Nlc3MoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhfdGhpcy5uYW1lLCBcInVzZXIgbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgICAkc3RvcmFnZS5zZXNzaW9uKFwidXNlcjpjdXJyZW50XCIsIG51bGwpO1xuICAgICAgICAgIHJldHVybiAkcm9vdC4kYnJvYWRjYXN0KFwidXNlcjpjaGFuZ2VkXCIpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmRvd25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX2ZldGNoRnJvbUFQSSwgY2FjaGUsIGV4Y2VwdGlvbjtcbiAgICAgIF9mZXRjaEZyb21BUEkgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKF90aGlzLm5hbWUsIFwiZG93bmxvYWRpbmcgdXNlclwiKTtcbiAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiL2FwaS91c2Vycy9jdXJyZW50XCIpLnN1Y2Nlc3MoZnVuY3Rpb24odXNlcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coX3RoaXMubmFtZSwgXCJmZXRjaGVkIGN1cnJlbnQgdXNlclwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoX3RoaXMubmFtZSwgdXNlcik7XG4gICAgICAgICAgICAkc3RvcmFnZS5zZXNzaW9uKFwidXNlcjpjdXJyZW50XCIsIGFuZ3VsYXIudG9Kc29uKHVzZXIpKTtcbiAgICAgICAgICAgIHJldHVybiAkcm9vdC4kYnJvYWRjYXN0KFwidXNlcjpjaGFuZ2VkXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICBjYWNoZSA9ICRzdG9yYWdlLnNlc3Npb24oXCJ1c2VyOmN1cnJlbnRcIik7XG4gICAgICBpZiAoY2FjaGUgIT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwicmV0cmlldmluZyBjdXJyZW50IHVzZXIgZnJvbSBjYWNoZVwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhbmd1bGFyLmZyb21Kc29uKGNhY2hlKTtcbiAgICAgICAgICByZXR1cm4gJHJvb3QuJGJyb2FkY2FzdChcInVzZXI6Y2hhbmdlZFwiKTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycm9yKSB7XG4gICAgICAgICAgZXhjZXB0aW9uID0gX2Vycm9yO1xuICAgICAgICAgIHJldHVybiBfZmV0Y2hGcm9tQVBJKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJyZXRyaWV2aW5nIGN1cnJlbnQgdXNlciBmcm9tIEFQSVwiKTtcbiAgICAgICAgcmV0dXJuIF9mZXRjaEZyb21BUEkoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF9DbGFzcztcblxuICB9KSgpKTtcbn07XG5cbmV4cG9ydHMuJGluamVjdCA9IFtcIiRodHRwXCIsIFwiJHJvb3RTY29wZVwiLCBcIiRsb2dcIiwgXCIkc3RvcmFnZVwiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDYXRlZ29yeSkge1xuICByZXR1cm4gZnVuY3Rpb24oY2F0ZWdvcnlJZCwgdHlwZSkge1xuICAgIHZhciBjYXRlZ29yeTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgXCJwYXJlbnRcIjpcbiAgICAgICAgY2F0ZWdvcnkgPSBDYXRlZ29yeS5maW5kQnlQYXJlbnRJZChjYXRlZ29yeUlkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2hpbGRcIjpcbiAgICAgICAgY2F0ZWdvcnkgPSBDYXRlZ29yeS5maW5kQnlDaGlsZElkKGNhdGVnb3J5SWQpO1xuICAgIH1cbiAgICByZXR1cm4gY2F0ZWdvcnkubmFtZTtcbiAgfTtcbn07XG5cbmV4cG9ydHMuJGluamVjdCA9IFtcIm1vZGVsLmNhdGVnb3JpZXNcIl07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICBjb25zb2xlLmxvZyhcIltmaWx0ZXJzXSBpbml0aWFsaXppbmdcIik7XG4gIGFwcC5maWx0ZXIoXCJjYXRlZ29yeVwiLCByZXF1aXJlKFwiLi9jYXRlZ29yeVwiKSk7XG4gIGFwcC5maWx0ZXIoXCJsaW5rXCIsIHJlcXVpcmUoXCIuL2xpbmtcIikpO1xuICBhcHAuZmlsdGVyKFwibG9jYXRpb25cIiwgcmVxdWlyZShcIi4vbG9jYXRpb25cIikpO1xuICBhcHAuZmlsdGVyKFwicHJldHR5ZGF0ZVwiLCByZXF1aXJlKFwiLi9wcmV0dHlkYXRlXCIpKTtcbiAgYXBwLmZpbHRlcihcInByaWNlXCIsIHJlcXVpcmUoXCIuL3ByaWNlXCIpKTtcbiAgcmV0dXJuIGFwcC5maWx0ZXIoXCJ0cmFuc2xhdGVcIiwgcmVxdWlyZShcIi4vdHJhbnNsYXRlXCIpKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZnVuY3Rpb24obGluaykge1xuICAgIHZhciBtYXhMZW5ndGgsIHJlc3VsdDtcbiAgICBtYXhMZW5ndGggPSA1MDtcbiAgICBpZiAobGluay5sZW5ndGggPiBtYXhMZW5ndGgpIHtcbiAgICAgIGxpbmsgPSAobGluay5zdWJzdHJpbmcoMCwgbWF4TGVuZ3RoKSkgKyBcIi4uLlwiO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0ID0gbGluay5yZXBsYWNlKC8uKj86XFwvXFwvL2csIFwiXCIpO1xuICB9O1xufTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihMb2NhdGlvbnMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGxvY2F0aW9uSWQpIHtcbiAgICB2YXIgbG9jYXRpb247XG4gICAgbG9jYXRpb24gPSBMb2NhdGlvbnMuZmluZEJ5SWQobG9jYXRpb25JZCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uLm5hbWU7XG4gIH07XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCJtb2RlbC5sb2NhdGlvbnNcIl07XG4iLCJ2YXIgY3JlYXRlSGFuZGxlciwgZXhwb3J0cywgZ2V0QXJhYmljTm91biwgcHJldHRpZnk7XG5cbmdldEFyYWJpY05vdW4gPSBmdW5jdGlvbihub3VuKSB7XG4gIHZhciBkaWN0O1xuICBkaWN0ID0ge1xuICAgIFwic2Vjb25kXCI6IFwi2KvYp9mG2YrYqVwiLFxuICAgIFwibWludXRlXCI6IFwi2K/ZgtmK2YLYqVwiLFxuICAgIFwiaG91clwiOiBcItiz2KfYudin2KpcIixcbiAgICBcImRheVwiOiBcItij2YrYp9mFXCIsXG4gICAgXCJ3ZWVrXCI6IFwi2KPYs9in2KjZiti5XCIsXG4gICAgXCJtb250aFwiOiBcItij2LTZh9ixXCIsXG4gICAgXCJ5ZWFyXCI6IFwi2LPZhtmI2KfYqlwiXG4gIH07XG4gIHJldHVybiBkaWN0W25vdW5dO1xufTtcblxuY3JlYXRlSGFuZGxlciA9IGZ1bmN0aW9uKGRpdmlzb3IsIG5vdW4sIHJlc3RPZlN0cmluZykge1xuICByZXR1cm4gZnVuY3Rpb24oZGlmZikge1xuICAgIHZhciBuLCBwbHVyYWxpemVkTm91bjtcbiAgICBuID0gTWF0aC5mbG9vcihkaWZmIC8gZGl2aXNvcik7XG4gICAgcGx1cmFsaXplZE5vdW4gPSBcIlwiICsgbm91biArIChuID4gMSA/IFwic1wiIDogXCJcIik7XG4gICAgcmV0dXJuIG4gKyBcIiBcIiArIHBsdXJhbGl6ZWROb3VuICsgXCIgXCIgKyByZXN0T2ZTdHJpbmc7XG4gIH07XG59O1xuXG5wcmV0dGlmeSA9IGZ1bmN0aW9uKGRhdGVfcmF3KSB7XG4gIHZhciBkYXRlLCBkaWZmLCBmb3JtYXR0ZXJzLCBpLCBub3c7XG4gIGZvcm1hdHRlcnMgPSBbXG4gICAge1xuICAgICAgdGhyZXNob2xkOiAxLFxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcImp1c3Qgbm93XCI7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgdGhyZXNob2xkOiA2MCxcbiAgICAgIGhhbmRsZXI6IGNyZWF0ZUhhbmRsZXIoMSwgXCJzZWNvbmRcIiwgXCJhZ29cIilcbiAgICB9LCB7XG4gICAgICB0aHJlc2hvbGQ6IDM2MDAsXG4gICAgICBoYW5kbGVyOiBjcmVhdGVIYW5kbGVyKDYwLCBcIm1pbnV0ZVwiLCBcImFnb1wiKVxuICAgIH0sIHtcbiAgICAgIHRocmVzaG9sZDogODY0MDAsXG4gICAgICBoYW5kbGVyOiBjcmVhdGVIYW5kbGVyKDM2MDAsIFwiaG91clwiLCBcImFnb1wiKVxuICAgIH0sIHtcbiAgICAgIHRocmVzaG9sZDogMTcyODAwLFxuICAgICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBcInllc3RlcmRheVwiO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHRocmVzaG9sZDogNjA0ODAwLFxuICAgICAgaGFuZGxlcjogY3JlYXRlSGFuZGxlcig4NjQwMCwgXCJkYXlcIiwgXCJhZ29cIilcbiAgICB9LCB7XG4gICAgICB0aHJlc2hvbGQ6IDI1OTIwMDAsXG4gICAgICBoYW5kbGVyOiBjcmVhdGVIYW5kbGVyKDYwNDgwMCwgXCJ3ZWVrXCIsIFwiYWdvXCIpXG4gICAgfSwge1xuICAgICAgdGhyZXNob2xkOiAzMTUzNjAwMCxcbiAgICAgIGhhbmRsZXI6IGNyZWF0ZUhhbmRsZXIoMjU5MjAwMCwgXCJtb250aFwiLCBcImFnb1wiKVxuICAgIH0sIHtcbiAgICAgIHRocmVzaG9sZDogSW5maW5pdHksXG4gICAgICBoYW5kbGVyOiBjcmVhdGVIYW5kbGVyKDMxNTM2MDAwLCBcInllYXJcIiwgXCJhZ29cIilcbiAgICB9XG4gIF07XG4gIGRhdGUgPSBuZXcgRGF0ZShkYXRlX3Jhdyk7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBkaWZmID0gKG5vdy5nZXRUaW1lKCkgLSBkYXRlLmdldFRpbWUoKSkgLyAxMDAwO1xuICBpID0gMDtcbiAgd2hpbGUgKGkgPCBmb3JtYXR0ZXJzLmxlbmd0aCkge1xuICAgIGlmIChkaWZmIDwgZm9ybWF0dGVyc1tpXS50aHJlc2hvbGQpIHtcbiAgICAgIHJldHVybiBmb3JtYXR0ZXJzW2ldLmhhbmRsZXIoZGlmZik7XG4gICAgfVxuICAgIGkrKztcbiAgfVxuICByZXR1cm4gXCJcIjtcbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcHJldHRpZnk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHByaWNlLCBwcmljZVR5cGUpIHtcbiAgICBpZiAocHJpY2VUeXBlID09PSAwKSB7XG4gICAgICByZXR1cm4gXCJGcmVlXCI7XG4gICAgfVxuICAgIGlmIChwcmljZVR5cGUgPT09IDEpIHtcbiAgICAgIHJldHVybiBcIkNvbnRhY3QgT3duZXJcIjtcbiAgICB9XG4gICAgaWYgKHByaWNlVHlwZSkge1xuICAgICAgcmV0dXJuIHByaWNlLnRvU3RyaW5nKCkucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgXCIsXCIpICsgXCIgS0RcIjtcbiAgICB9XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC50b1VwcGVyQ2FzZSgpO1xuICB9O1xufTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyAoKGZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIF9DbGFzcygpIHt9XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLm5hbWUgPSBcIltwcm92aWRlcjplbnZpcm9ubWVudF1cIjtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuY29uZmlnID0ge307XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGNvbmZpZ1tcIlwiICsga2V5XTtcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS4kZ2V0ID0gW1xuICAgICAgXCIkd2luZG93XCIsIFwiJGxvZ1wiLCBcIiRiYXNlNjRcIiwgZnVuY3Rpb24oJHdpbmRvdywgY29uc29sZSwgJGJhc2U2NCkge1xuICAgICAgICB2YXIgY29uZmlnLCBlO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiaW5pdGlhbGl6aW5nXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwiZGVjb2Rpbmcgc2VydmVyLXNpZGUgZGF0YVwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25maWcgPSB7fTtcbiAgICAgICAgICBhbmd1bGFyLmV4dGVuZChjb25maWcsICR3aW5kb3cucHVibGljRGF0YSwgYW5ndWxhci5mcm9tSnNvbigkYmFzZTY0LmRlY29kZSgkd2luZG93LmNyeXB0ZWREYXRhKSkpO1xuICAgICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmRlYnVnKHRoaXMubmFtZSwgdGhpcy5jb25maWcpO1xuICAgICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5uYW1lLCBcImVycm9yIGRlY29kaW5nIHNlcnZlci1zaWRlIGRhdGFcIik7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdO1xuXG4gICAgcmV0dXJuIF9DbGFzcztcblxuICB9KSgpKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICBjb25zb2xlLmxvZyhcIltwcm92aWRlcnNdIGluaXRpYWxpemluZ1wiKTtcbiAgcmV0dXJuIGFwcC5wcm92aWRlcihcIiRlbnZpcm9ubWVudFwiLCByZXF1aXJlKFwiLi9lbnZpcm9ubWVudFwiKSk7XG59O1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzdGF0ZSwgJHJvb3RTY29wZSwgJHdpbmRvdywgY29uc29sZSkge1xuICByZXR1cm4gJHJvb3RTY29wZS4kb24oXCIkdmlld0NvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXRlLCB0bztcbiAgICBzdGF0ZSA9ICRzdGF0ZS4kY3VycmVudDtcbiAgICBpZiAoISh0eXBlb2Ygc3RhdGUuc2Nyb2xsVG8gPT09IFwiZnVuY3Rpb25cIiA/IHN0YXRlLnNjcm9sbFRvKCR3aW5kb3cuc2Nyb2xsVG8oMCwgMCkpIDogdm9pZCAwKSkge1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybjtcbiAgICAgIHRvID0gMDtcbiAgICAgIGlmIChzdGF0ZS5zY3JvbGxUby5pZCAhPT0gdm9pZCAwKSB7XG4gICAgICAgIHRvID0gJChzdGF0ZS5zY3JvbGxUby5pZCkub2Zmc2V0KCkudG9wO1xuICAgICAgfVxuICAgICAgaWYgKCQoJHdpbmRvdykuc2Nyb2xsVG9wKCkgPT09IHRvKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0ZS5zY3JvbGxUby5hbmltYXRlZCkge1xuICAgICAgICByZXR1cm4gJChkb2N1bWVudC5ib2R5KS5hbmltYXRlKHtcbiAgICAgICAgICBzY3JvbGxUb3A6IHRvXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICR3aW5kb3cuc2Nyb2xsVG8oMCwgdG8pO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkc3RhdGVcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJHdpbmRvd1wiLCBcIiRsb2dcIl07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICBjb25zb2xlLmxvZyhcIlthcHBdIHByZXBhcmluZyBydW4gc3RhZ2VzXCIpO1xuICBhcHAucnVuKHJlcXVpcmUoXCIuL2FuY2hvclNjcm9sbFwiKSk7XG4gIHJldHVybiBhcHAucnVuKHJlcXVpcmUoXCIuL3N0YXRlQ2hhbmdlXCIpKTtcbn07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHJvb3QsIGNvbnNvbGUsICRzdG9yYWdlKSB7XG4gIHZhciBib2R5O1xuICBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgaWYgKCRyb290LmJvZHlDbGFzc2VzID09IG51bGwpIHtcbiAgICAkcm9vdC5ib2R5Q2xhc3NlcyA9IHt9O1xuICB9XG4gICRyb290LiRvbihcIiRzdGF0ZUNoYW5nZVN0YXJ0XCIsIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XG4gICAgdmFyIGJvZHlpZDtcbiAgICAkcm9vdC5ib2R5U3R5bGVzID0ge307XG4gICAgJHJvb3QuYm9keUNsYXNzZXMubG9hZGluZyA9IHRydWU7XG4gICAgY29uc29sZS5sb2coXCJbcm91dGVyXSBzd2l0Y2hpbmcgZnJvbSAnXCIgKyBmcm9tU3RhdGUubmFtZSArIFwiJyB0byAnXCIgKyB0b1N0YXRlLm5hbWUgKyBcIidcIik7XG4gICAgaWYgKHRvU3RhdGUudGVtcGxhdGVVcmwgIT0gbnVsbCkge1xuICAgICAgYm9keWlkID0gdG9TdGF0ZS50ZW1wbGF0ZVVybC5yZXBsYWNlKFwiL1wiLCBcIi1cIik7XG4gICAgICByZXR1cm4gYm9keS5pZCA9IGJvZHlpZDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gJHJvb3QuJG9uKFwicGFnZS1sb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJHJvb3QuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJHJvb3QuYm9keUNsYXNzZXMubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHJvb3RTY29wZVwiLCBcIiRsb2dcIiwgXCIkc3RvcmFnZVwiXTtcbiIsIlxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgTmljayBHYWxicmVhdGgsIFN0ZXZlbiBFbmFtYWtlbFxuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3N0cmluZ2VuY29kZXJzL3NvdXJjZS9icm93c2UvI3N2bi90cnVuay9qYXZhc2NyaXB0XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXRcbiAqIHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLFxuICogY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuICogU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmdcbiAqIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAqIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EXG4gKiBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVFxuICogSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksXG4gKiBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbiAqIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1JcbiAqIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIGJhc2U2NCBlbmNvZGUvZGVjb2RlIGNvbXBhdGlibGUgd2l0aCB3aW5kb3cuYnRvYS9hdG9iXG4gKlxuICogd2luZG93LmF0b2IvYnRvYSBpcyBhIEZpcmVmb3ggZXh0ZW5zaW9uIHRvIGNvbnZlcnQgYmluYXJ5IGRhdGEgKHRoZSBcImJcIilcbiAqIHRvIGJhc2U2NCAoYXNjaWksIHRoZSBcImFcIikuXG4gKlxuICogSXQgaXMgYWxzbyBmb3VuZCBpbiBTYWZhcmkgYW5kIENocm9tZS4gIEl0IGlzIG5vdCBhdmFpbGFibGUgaW4gSUUuXG4gKlxuICogaWYgKCF3aW5kb3cuYnRvYSkgd2luZG93LmJ0b2EgPSBiYXNlNjQuZW5jb2RlXG4gKiBpZiAoIXdpbmRvdy5hdG9iKSB3aW5kb3cuYXRvYiA9IGJhc2U2NC5kZWNvZGVcbiAqXG4gKiBUaGUgb3JpZ2luYWwgc3BlY3MgZm9yIGF0b2IvYnRvYSBhcmUgYSBiaXQgbGFja2luZ1xuICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5hdG9iXG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LmJ0b2FcbiAqXG4gKiB3aW5kb3cuYnRvYSBhbmQgYmFzZTY0LmVuY29kZSB0YWtlcyBhIHN0cmluZyB3aGVyZSBjaGFyQ29kZUF0IGlzIFswLDI1NV1cbiAqIElmIGFueSBjaGFyYWN0ZXIgaXMgbm90IFswLDI1NV0sIHRoZW4gYW4gRE9NRXhjZXB0aW9uKDUpIGlzIHRocm93bi5cbiAqXG4gKiB3aW5kb3cuYXRvYiBhbmQgYmFzZTY0LmRlY29kZSB0YWtlIGEgYmFzZTY0LWVuY29kZWQgc3RyaW5nXG4gKiBJZiB0aGUgaW5wdXQgbGVuZ3RoIGlzIG5vdCBhIG11bHRpcGxlIG9mIDQsIG9yIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVyc1xuICogICB0aGVuIGFuIERPTUV4Y2VwdGlvbig1KSBpcyB0aHJvd24uXG4gKi9cbnZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkd2luZG93KSB7XG4gIHJldHVybiBuZXcgKChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBfQ2xhc3MoKSB7fVxuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5QQURDSEFSID0gXCI9XCI7XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLkFMUEhBID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCI7XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLm1ha2VET01FeGNlcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleCwgdG1wO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIG5ldyBET01FeGNlcHRpb24oRE9NRXhjZXB0aW9uLklOVkFMSURfQ0hBUkFDVEVSX0VSUik7XG4gICAgICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICAgICAgdG1wID0gX2Vycm9yO1xuICAgICAgICBleCA9IG5ldyBFcnJvcihcIkRPTSBFeGNlcHRpb24gNVwiKTtcbiAgICAgICAgZXguY29kZSA9IGV4Lm51bWJlciA9IDU7XG4gICAgICAgIGV4Lm5hbWUgPSBleC5kZXNjcmlwdGlvbiA9IFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCI7XG4gICAgICAgIHJldHVybiBleC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBcIkVycm9yOiBcIiArIGV4Lm5hbWUgKyBcIjogXCIgKyBleC5tZXNzYWdlO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmdldGJ5dGU2NCA9IGZ1bmN0aW9uKHMsIGkpIHtcbiAgICAgIHZhciBpZHg7XG4gICAgICBpZHggPSB0aGlzLkFMUEhBLmluZGV4T2Yocy5jaGFyQXQoaSkpO1xuICAgICAgaWYgKGlkeCA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5tYWtlRE9NRXhjZXB0aW9uKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWR4O1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLmRlY29kZSA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBiMTAsIGksIGltYXgsIHBhZHMsIHg7XG4gICAgICBzID0gXCJcIiArIHM7XG4gICAgICBpbWF4ID0gcy5sZW5ndGg7XG4gICAgICBpZiAoaW1heCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH1cbiAgICAgIGlmIChpbWF4ICUgNCA9PT0gITApIHtcbiAgICAgICAgdGhyb3cgdGhpcy5tYWtlRE9NRXhjZXB0aW9uKCk7XG4gICAgICB9XG4gICAgICBwYWRzID0gMDtcbiAgICAgIGlmICgocy5jaGFyQXQoaW1heCAtIDEpKSA9PT0gdGhpcy5QQURDSEFSKSB7XG4gICAgICAgIHBhZHMgPSAxO1xuICAgICAgICBpZiAoKHMuY2hhckF0KGltYXggLSAyKSkgPT09IHRoaXMuUEFEQ0hBUikge1xuICAgICAgICAgIHBhZHMgPSAyO1xuICAgICAgICB9XG4gICAgICAgIGltYXggLT0gNDtcbiAgICAgIH1cbiAgICAgIHggPSBbXTtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBpbWF4KSB7XG4gICAgICAgIGIxMCA9ICh0aGlzLmdldGJ5dGU2NChzLCBpKSkgPDwgMTggfCAodGhpcy5nZXRieXRlNjQocywgaSArIDEpKSA8PCAxMiB8ICh0aGlzLmdldGJ5dGU2NChzLCBpICsgMikpIDw8IDYgfCAodGhpcy5nZXRieXRlNjQocywgaSArIDMpKTtcbiAgICAgICAgeC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYjEwID4+IDE2LCBiMTAgPj4gOCAmIDB4ZmYsIGIxMCAmIDB4ZmYpKTtcbiAgICAgICAgaSArPSA0O1xuICAgICAgfVxuICAgICAgc3dpdGNoIChwYWRzKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBiMTAgPSAodGhpcy5nZXRieXRlNjQocywgaSkpIDw8IDE4IHwgKHRoaXMuZ2V0Ynl0ZTY0KHMsIGkgKyAxKSkgPDwgMTIgfCAodGhpcy5nZXRieXRlNjQocywgaSArIDIpKSA8PCA2O1xuICAgICAgICAgIHgucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGIxMCA+PiAxNiwgYjEwID4+IDggJiAweGZmKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBiMTAgPSAodGhpcy5nZXRieXRlNjQocywgaSkpIDw8IDE4IHwgKHRoaXMuZ2V0Ynl0ZTY0KHMsIGkgKyAxKSkgPDwgMTI7XG4gICAgICAgICAgeC5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYjEwID4+IDE2KSk7XG4gICAgICB9XG4gICAgICByZXR1cm4geC5qb2luKFwiXCIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gX0NsYXNzO1xuXG4gIH0pKCkpO1xufTtcblxudGhpcy5nZXRieXRlID0gZnVuY3Rpb24ocywgaSkge1xuICB2YXIgeDtcbiAgeCA9IHMuY2hhckNvZGVBdChpKTtcbiAgaWYgKHggPiAyNTUpIHtcbiAgICB0aHJvdyB0aGlzLm1ha2VET01FeGNlcHRpb24oKTtcbiAgfVxuICByZXR1cm4geDtcbn07XG5cbnRoaXMuZW5jb2RlID0gZnVuY3Rpb24ocykge1xuICB2YXIgYjEwLCBpLCBpbWF4LCB4O1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIk5vdCBlbm91Z2ggYXJndW1lbnRzXCIpO1xuICB9XG4gIHggPSBbXTtcbiAgcyA9IFwiXCIgKyBzO1xuICBpbWF4ID0gcy5sZW5ndGggLSBzLmxlbmd0aCAlIDM7XG4gIGlmIChzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBzO1xuICB9XG4gIGkgPSAwO1xuICB3aGlsZSAoaSA8IGltYXgpIHtcbiAgICBiMTAgPSAodGhpcy5nZXRieXRlKHMsIGkpKSA8PCAxNiB8ICh0aGlzLmdldGJ5dGUocywgaSArIDEpKSA8PCA4IHwgKHRoaXMuZ2V0Ynl0ZShzLCBpICsgMikpO1xuICAgIHgucHVzaCh0aGlzLkFMUEhBLmNoYXJBdChiMTAgPj4gMTgpKTtcbiAgICB4LnB1c2godGhpcy5BTFBIQS5jaGFyQXQoYjEwID4+IDEyICYgMHgzRikpO1xuICAgIHgucHVzaCh0aGlzLkFMUEhBLmNoYXJBdChiMTAgPj4gNiAmIDB4M2YpKTtcbiAgICB4LnB1c2godGhpcy5BTFBIQS5jaGFyQXQoYjEwICYgMHgzZikpO1xuICAgIGkgKz0gMztcbiAgfVxuICBzd2l0Y2ggKHMubGVuZ3RoIC0gaW1heCkge1xuICAgIGNhc2UgMTpcbiAgICAgIGIxMCA9ICh0aGlzLmdldGJ5dGUocywgaSkpIDw8IDE2O1xuICAgICAgeC5wdXNoKCh0aGlzLkFMUEhBLmNoYXJBdChiMTAgPj4gMTgpKSArICh0aGlzLkFMUEhBLmNoYXJBdChiMTAgPj4gMTIgJiAweDNGKSkgKyB0aGlzLlBBRENIQVIgKyB0aGlzLlBBRENIQVIpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAyOlxuICAgICAgYjEwID0gKHRoaXMuZ2V0Ynl0ZShzLCBpKSkgPDwgMTYgfCAodGhpcy5nZXRieXRlKHMsIGkgKyAxKSkgPDwgODtcbiAgICAgIHgucHVzaCgodGhpcy5BTFBIQS5jaGFyQXQoYjEwID4+IDE4KSkgKyAodGhpcy5BTFBIQS5jaGFyQXQoYjEwID4+IDEyICYgMHgzRikpICsgKHRoaXMuQUxQSEEuY2hhckF0KGIxMCA+PiA2ICYgMHgzZikpICsgdGhpcy5QQURDSEFSKTtcbiAgfVxuICByZXR1cm4geC5qb2luKFwiXCIpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJHdpbmRvd1wiXTtcbiIsInZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkd2luZG93KSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJbZmFjZWJvb2tdXCIsXG4gICAgaGFzTG9hZGVkOiBmYWxzZSxcbiAgICBvbkxvYWQ6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgd2FpdEZvckVsZW1lbnQ7XG4gICAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG4gICAgICB9XG4gICAgICB3YWl0Rm9yRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJHdpbmRvdy5GQiAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JFbGVtZW50KCk7XG4gICAgICAgICAgfSksIDI1MCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd2FpdEZvckVsZW1lbnQoKTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkd2luZG93XCJdO1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgcmV0dXJuIG5ldyAoKGZ1bmN0aW9uKCkge1xuICAgIF9DbGFzcy5wcm90b3R5cGUubmFtZSA9IFwiW3NlcnZpY2U6Z29vZ2xlLW1hcHNdXCI7XG5cbiAgICBmdW5jdGlvbiBfQ2xhc3MoKSB7XG4gICAgICB2YXIgJGZpbGVyZWYsIEFQSWtleSwgaGVhZCwgdXJsO1xuICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcImluaXRpYWxpemluZ1wiKTtcbiAgICAgIEFQSWtleSA9IFwiQUl6YVN5QlVjb09XNWp3Mkd2bEZRSTQ5RklHbDZJN2N6WGNYNWlRXCI7XG4gICAgICB1cmwgPSBcImh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcz9rZXk9XCIgKyBBUElrZXkgKyBcIiZjYWxsYmFjaz1pbml0aWFsaXplR21hcFwiO1xuICAgICAgJGZpbGVyZWYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgJGZpbGVyZWYudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgICAkZmlsZXJlZi5zcmMgPSB1cmw7XG4gICAgICBoZWFkID0gKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKSlbMF07XG4gICAgICBoZWFkLmluc2VydEJlZm9yZSgkZmlsZXJlZiwgaGVhZC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLm9uTG9hZCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgd2FpdEZvckVsZW1lbnQ7XG4gICAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XG4gICAgICB9XG4gICAgICB3YWl0Rm9yRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoKCR3aW5kb3cuZ29vZ2xlICE9IG51bGwpICYmICgkd2luZG93Lmdvb2dsZS5tYXBzICE9IG51bGwpICYmICgkd2luZG93Lmdvb2dsZS5tYXBzLkNpcmNsZSAhPSBudWxsKSkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB3YWl0Rm9yRWxlbWVudCgpO1xuICAgICAgICAgIH0pLCAyNTApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHdhaXRGb3JFbGVtZW50KCk7XG4gICAgfTtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuZGVmYXVsdFN0eWxlID0gW1xuICAgICAge1xuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlLm1hbl9tYWRlXCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZjdmMWRmXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImxhbmRzY2FwZS5uYXR1cmFsXCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZDBlM2I0XCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcImxhbmRzY2FwZS5uYXR1cmFsLnRlcnJhaW5cIixcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwibGFiZWxzXCIsXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5idXNpbmVzc1wiLFxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJ2aXNpYmlsaXR5XCI6IFwib2ZmXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5tZWRpY2FsXCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjZmJkM2RhXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInBvaS5wYXJrXCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjYmRlNmFiXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcInJvYWRcIixcbiAgICAgICAgXCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5LnN0cm9rZVwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwidmlzaWJpbGl0eVwiOiBcIm9mZlwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkXCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJsYWJlbHNcIixcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcInZpc2liaWxpdHlcIjogXCJvZmZcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmZmUxNWZcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5zdHJva2VcIixcbiAgICAgICAgXCJzdHlsZXJzXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImNvbG9yXCI6IFwiI2VmZDE1MVwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeS5maWxsXCIsXG4gICAgICAgIFwic3R5bGVyc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJjb2xvclwiOiBcIiNmZmZmZmZcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5sb2NhbFwiLFxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnkuZmlsbFwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCJibGFja1wiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIFwiZmVhdHVyZVR5cGVcIjogXCJ0cmFuc2l0LnN0YXRpb24uYWlycG9ydFwiLFxuICAgICAgICBcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnkuZmlsbFwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjY2ZiMmRiXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG4gICAgICAgIFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuICAgICAgICBcInN0eWxlcnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiY29sb3JcIjogXCIjYTJkYWYyXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdO1xuXG4gICAgcmV0dXJuIF9DbGFzcztcblxuICB9KSgpKTtcbn07XG5cbmV4cG9ydHMuJGluamVjdCA9IFtcIiR3aW5kb3dcIl07XG4iLCJ2YXIgZXhwb3J0cztcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHdpbmRvdykge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IFwiW2dvb2dsZS1yZWNhcHRjaGFdXCIsXG4gICAgb25Mb2FkOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgdmFyIHdhaXRGb3JFbGVtZW50O1xuICAgICAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgfVxuICAgICAgd2FpdEZvckVsZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCR3aW5kb3cuZ3JlY2FwdGNoYSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdhaXRGb3JFbGVtZW50KCk7XG4gICAgICAgICAgfSksIDI1MCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXR1cm4gd2FpdEZvckVsZW1lbnQoKTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkd2luZG93XCJdO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcblxuICAgIC8qXG4gICAgVGhpcyBmdW5jdGlvbiBjcmVhdGVzIHRoZSB0aHVtYm5haWwgZnJvbSB0aGUgZ2l2ZW4gZmlsZSB3aXRoIHRoZSBnaXZlblxuICAgIG9wdGlvbnMuIFRoZSBvcHRpb25zIHdpbGwgaGF2ZSB0aHJlZSBhcmd1bWVudHM6XG4gICAgICB0aHVtYm5haWxXaWR0aDogVGFyZ2V0IHdpZHRoIGZvciB0aHVtYm5haWxcbiAgICAgIHRodW1ibmFpbEhlaWdodDogVGFyZ2V0IGhlaWdodCBmb3IgdGh1bWJuYWlsXG4gICAgICBjYWxsYmFjazogQSBjYWxsYmFjayBmdW5jdGlvbiB3aGljaCByZWNlaXZlcyB0aGUgaW1hZ2VEYXRhIG9mIHRoZSBuZXdcbiAgICAgIHRodW1ibmFpbC5cbiAgICAgKi9cbiAgICBjcmVhdGVUaHVtYm5haWw6IGZ1bmN0aW9uKGZpbGUsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBmaWxlUmVhZGVyO1xuICAgICAgaWYgKG9wdGlvbnMgPT0gbnVsbCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG4gICAgICBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXI7XG4gICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKGZpbGUudHlwZSA9PT0gXCJpbWFnZS9zdmcreG1sXCIpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgb3B0aW9ucy5jYWxsYmFjayhmaWxlUmVhZGVyLnJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfdGhpcy5jcmVhdGVUaHVtYm5haWxGcm9tVXJsKGZpbGUsIGZpbGVSZWFkZXIucmVzdWx0LCBvcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpO1xuICAgICAgcmV0dXJuIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICB9LFxuICAgIGNyZWF0ZVRodW1ibmFpbEZyb21Vcmw6IGZ1bmN0aW9uKGZpbGUsIGltYWdlVXJsLCBvcHRpb25zKSB7XG4gICAgICB2YXIgaW1nO1xuICAgICAgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgIGltZy5vbmxvYWQgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBjYW52YXMsIGN0eCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZXNpemVJbmZvLCB0aHVtYm5haWw7XG4gICAgICAgICAgZmlsZS53aWR0aCA9IGltZy53aWR0aDtcbiAgICAgICAgICBmaWxlLmhlaWdodCA9IGltZy5oZWlnaHQ7XG4gICAgICAgICAgcmVzaXplSW5mbyA9IF90aGlzLnJlc2l6ZShmaWxlLCBvcHRpb25zKTtcbiAgICAgICAgICBpZiAocmVzaXplSW5mby50cmdXaWR0aCA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXNpemVJbmZvLnRyZ1dpZHRoID0gcmVzaXplSW5mby5vcHRXaWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc2l6ZUluZm8udHJnSGVpZ2h0ID09IG51bGwpIHtcbiAgICAgICAgICAgIHJlc2l6ZUluZm8udHJnSGVpZ2h0ID0gcmVzaXplSW5mby5vcHRIZWlnaHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICBjYW52YXMud2lkdGggPSByZXNpemVJbmZvLnRyZ1dpZHRoO1xuICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSByZXNpemVJbmZvLnRyZ0hlaWdodDtcbiAgICAgICAgICBfdGhpcy5kcmF3SW1hZ2VJT1NGaXgoY3R4LCBpbWcsIChyZWYgPSByZXNpemVJbmZvLnNyY1gpICE9IG51bGwgPyByZWYgOiAwLCAocmVmMSA9IHJlc2l6ZUluZm8uc3JjWSkgIT0gbnVsbCA/IHJlZjEgOiAwLCByZXNpemVJbmZvLnNyY1dpZHRoLCByZXNpemVJbmZvLnNyY0hlaWdodCwgKHJlZjIgPSByZXNpemVJbmZvLnRyZ1gpICE9IG51bGwgPyByZWYyIDogMCwgKHJlZjMgPSByZXNpemVJbmZvLnRyZ1kpICE9IG51bGwgPyByZWYzIDogMCwgcmVzaXplSW5mby50cmdXaWR0aCwgcmVzaXplSW5mby50cmdIZWlnaHQpO1xuICAgICAgICAgIHRodW1ibmFpbCA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XG4gICAgICAgICAgX3RoaXMudGh1bWJuYWlsQ3JlYXRlZChmaWxlLCB0aHVtYm5haWwpO1xuICAgICAgICAgIGlmIChvcHRpb25zLmNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmNhbGxiYWNrKHRodW1ibmFpbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcyk7XG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcInVuZGVmaW5lZFwiICYmIGNhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgIGltZy5vbmVycm9yID0gY2FsbGJhY2s7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW1nLnNyYyA9IGltYWdlVXJsO1xuICAgIH0sXG4gICAgdGh1bWJuYWlsQ3JlYXRlZDogZnVuY3Rpb24oZmlsZSwgZGF0YVVybCkge1xuICAgICAgdmFyIGksIGxlbiwgcmVmLCB0aHVtYm5haWxFbGVtZW50O1xuICAgICAgaWYgKGZpbGUucHJldmlld0VsZW1lbnQpIHtcbiAgICAgICAgZmlsZS5wcmV2aWV3RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZHotZmlsZS1wcmV2aWV3XCIpO1xuICAgICAgICByZWYgPSBmaWxlLnByZXZpZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1kei10aHVtYm5haWxdXCIpO1xuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSByZWYubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB0aHVtYm5haWxFbGVtZW50ID0gcmVmW2ldO1xuICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQuYWx0ID0gZmlsZS5uYW1lO1xuICAgICAgICAgIHRodW1ibmFpbEVsZW1lbnQuc3JjID0gZGF0YVVybDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2V0VGltZW91dCgoKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUucHJldmlld0VsZW1lbnQuY2xhc3NMaXN0LmFkZChcImR6LWltYWdlLXByZXZpZXdcIik7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpLCAxKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlc2l6ZTogZnVuY3Rpb24oZmlsZSwgb3B0aW9ucykge1xuICAgICAgdmFyIGluZm8sIHNyY1JhdGlvLCB0cmdSYXRpbztcbiAgICAgIGluZm8gPSB7XG4gICAgICAgIHNyY1g6IDAsXG4gICAgICAgIHNyY1k6IDAsXG4gICAgICAgIHNyY1dpZHRoOiBmaWxlLndpZHRoLFxuICAgICAgICBzcmNIZWlnaHQ6IGZpbGUuaGVpZ2h0XG4gICAgICB9O1xuICAgICAgc3JjUmF0aW8gPSBmaWxlLndpZHRoIC8gZmlsZS5oZWlnaHQ7XG4gICAgICBpbmZvLm9wdFdpZHRoID0gb3B0aW9ucy50aHVtYm5haWxXaWR0aCB8fCAzMDA7XG4gICAgICBpbmZvLm9wdEhlaWdodCA9IG9wdGlvbnMudGh1bWJuYWlsSGVpZ2h0IHx8IDMwMDtcbiAgICAgIGlmICgoaW5mby5vcHRXaWR0aCA9PSBudWxsKSAmJiAoaW5mby5vcHRIZWlnaHQgPT0gbnVsbCkpIHtcbiAgICAgICAgaW5mby5vcHRXaWR0aCA9IGluZm8uc3JjV2lkdGg7XG4gICAgICAgIGluZm8ub3B0SGVpZ2h0ID0gaW5mby5zcmNIZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKGluZm8ub3B0V2lkdGggPT0gbnVsbCkge1xuICAgICAgICBpbmZvLm9wdFdpZHRoID0gc3JjUmF0aW8gKiBpbmZvLm9wdEhlaWdodDtcbiAgICAgIH0gZWxzZSBpZiAoaW5mby5vcHRIZWlnaHQgPT0gbnVsbCkge1xuICAgICAgICBpbmZvLm9wdEhlaWdodCA9ICgxIC8gc3JjUmF0aW8pICogaW5mby5vcHRXaWR0aDtcbiAgICAgIH1cbiAgICAgIHRyZ1JhdGlvID0gaW5mby5vcHRXaWR0aCAvIGluZm8ub3B0SGVpZ2h0O1xuICAgICAgaWYgKGZpbGUuaGVpZ2h0IDwgaW5mby5vcHRIZWlnaHQgfHwgZmlsZS53aWR0aCA8IGluZm8ub3B0V2lkdGgpIHtcbiAgICAgICAgaW5mby50cmdIZWlnaHQgPSBpbmZvLnNyY0hlaWdodDtcbiAgICAgICAgaW5mby50cmdXaWR0aCA9IGluZm8uc3JjV2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc3JjUmF0aW8gPiB0cmdSYXRpbykge1xuICAgICAgICAgIGluZm8uc3JjSGVpZ2h0ID0gZmlsZS5oZWlnaHQ7XG4gICAgICAgICAgaW5mby5zcmNXaWR0aCA9IGluZm8uc3JjSGVpZ2h0ICogdHJnUmF0aW87XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5mby5zcmNXaWR0aCA9IGZpbGUud2lkdGg7XG4gICAgICAgICAgaW5mby5zcmNIZWlnaHQgPSBpbmZvLnNyY1dpZHRoIC8gdHJnUmF0aW87XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGluZm8uc3JjWCA9IChmaWxlLndpZHRoIC0gaW5mby5zcmNXaWR0aCkgLyAyO1xuICAgICAgaW5mby5zcmNZID0gKGZpbGUuaGVpZ2h0IC0gaW5mby5zcmNIZWlnaHQpIC8gMjtcbiAgICAgIHJldHVybiBpbmZvO1xuICAgIH0sXG4gICAgZGV0ZWN0VmVydGljYWxTcXVhc2g6IGZ1bmN0aW9uKGltZykge1xuICAgICAgdmFyIGFscGhhLCBjYW52YXMsIGN0eCwgZGF0YSwgZXksIGloLCBpdywgcHksIHJhdGlvLCBzeTtcbiAgICAgIGl3ID0gaW1nLm5hdHVyYWxXaWR0aDtcbiAgICAgIGloID0gaW1nLm5hdHVyYWxIZWlnaHQ7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY2FudmFzLndpZHRoID0gMTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBpaDtcbiAgICAgIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XG4gICAgICBkYXRhID0gKGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgMSwgaWgpKS5kYXRhO1xuICAgICAgc3kgPSAwO1xuICAgICAgZXkgPSBpaDtcbiAgICAgIHB5ID0gaWg7XG4gICAgICB3aGlsZSAocHkgPiBzeSkge1xuICAgICAgICBhbHBoYSA9IGRhdGFbKHB5IC0gMSkgKiA0ICsgM107XG4gICAgICAgIGlmIChhbHBoYSA9PT0gMCkge1xuICAgICAgICAgIGV5ID0gcHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3kgPSBweTtcbiAgICAgICAgfVxuICAgICAgICBweSA9IChleSArIHN5KSA+PiAxO1xuICAgICAgfVxuICAgICAgcmF0aW8gPSBweSAvIGloO1xuICAgICAgaWYgKHJhdGlvID09PSAwKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJhdGlvO1xuICAgICAgfVxuICAgIH0sXG4gICAgZHJhd0ltYWdlSU9TRml4OiBmdW5jdGlvbihjdHgsIGltZywgc3gsIHN5LCBzdywgc2gsIGR4LCBkeSwgZHcsIGRoKSB7XG4gICAgICB2YXIgdmVydFNxdWFzaFJhdGlvO1xuICAgICAgdmVydFNxdWFzaFJhdGlvID0gdGhpcy5kZXRlY3RWZXJ0aWNhbFNxdWFzaChpbWcpO1xuICAgICAgcmV0dXJuIGN0eC5kcmF3SW1hZ2UoaW1nLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGggLyB2ZXJ0U3F1YXNoUmF0aW8pO1xuICAgIH1cbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGFwcCkge1xuICBjb25zb2xlLmxvZyhcIltzZXJ2aWNlc10gaW5pdGlhbGl6aW5nXCIpO1xuICBhcHAuc2VydmljZShcIiRmYWNlYm9va1wiLCByZXF1aXJlKFwiLi9mYWNlYm9vay5zZGtcIikpO1xuICBhcHAuc2VydmljZShcIiRnb29nbGVNYXBzXCIsIHJlcXVpcmUoXCIuL2dvb2dsZS5tYXBzXCIpKTtcbiAgYXBwLnNlcnZpY2UoXCIkZ29vZ2xlUmVjYXB0Y2hhXCIsIHJlcXVpcmUoXCIuL2dvb2dsZS5yZWNhcHRjaGFcIikpO1xuICBhcHAuc2VydmljZShcIiRiYXNlNjRcIiwgcmVxdWlyZShcIi4vYmFzZTY0XCIpKTtcbiAgYXBwLnNlcnZpY2UoXCIkaW1hZ2VSZXNpemVyXCIsIHJlcXVpcmUoXCIuL2ltYWdlUmVzaXplclwiKSk7XG4gIGFwcC5zZXJ2aWNlKFwiJG5vdGlmaWNhdGlvbnNcIiwgcmVxdWlyZShcIi4vbm90aWZpY2F0aW9uc1wiKSk7XG4gIGFwcC5zZXJ2aWNlKFwiJHNjcm9sbGVyXCIsIHJlcXVpcmUoXCIuL3Njcm9sbGVyXCIpKTtcbiAgcmV0dXJuIGFwcC5zZXJ2aWNlKFwiJHN0b3JhZ2VcIiwgcmVxdWlyZShcIi4vc3RvcmFnZVwiKSk7XG59O1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRodHRwLCAkcm9vdCwgY29uc29sZSwgJHN0b3JhZ2UpIHtcbiAgcmV0dXJuIG5ldyAoKGZ1bmN0aW9uKCkge1xuICAgIF9DbGFzcy5wcm90b3R5cGUubmFtZSA9IFwiW3NlcnZpY2U6bm90aWZpY2F0aW9uc11cIjtcblxuICAgIGZ1bmN0aW9uIF9DbGFzcygpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJpbml0aWFsaXppbmdcIik7XG4gICAgfVxuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihtZXNzYWdlLCB0eXBlKSB7XG4gICAgICBpZiAodHlwZSA9PSBudWxsKSB7XG4gICAgICAgIHR5cGUgPSBcInN1Y2Nlc3NcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkcm9vdC4kYnJvYWRjYXN0KFwibm90aWZpY2F0aW9uXCIsIHtcbiAgICAgICAgdGV4dDogbWVzc2FnZSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgaGFzUmVhZDogZmFsc2UsXG4gICAgICAgIGZsYXNoOiB0cnVlXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmNyZWF0ZShtZXNzYWdlLCBcImVycm9yXCIpO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLnN1Y2Nlc3MgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGUobWVzc2FnZSwgXCJzdWNjZXNzXCIpO1xuICAgIH07XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLndhcm4gPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jcmVhdGUobWVzc2FnZSwgXCJ3YXJuXCIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gX0NsYXNzO1xuXG4gIH0pKCkpO1xufTtcblxuZXhwb3J0cy4kaW5qZWN0ID0gW1wiJGh0dHBcIiwgXCIkcm9vdFNjb3BlXCIsIFwiJGxvZ1wiLCBcIiRzdG9yYWdlXCJdO1xuIiwidmFyIGV4cG9ydHM7XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCR3aW5kb3csIGNvbnNvbGUpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcIltzY3JvbGxlcl1cIixcbiAgICBzY3JvbGxUbzogZnVuY3Rpb24oZUlEKSB7XG4gICAgICB2YXIgYXZhaWwsIGJvZHksIGRvY3VtZW50SGVpZ2h0LCBlbG1ZUG9zaXRpb24sIGh0bWwsIGlzQW5pbWF0aW5nLCBvbkFuaW1hdGlvbkVuZCwgc2Nyb2xsLCB3aW5kb3dIZWlnaHQsIHdpbmRvd1Njcm9sbFRvcDtcbiAgICAgIHJldHVybjtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJzY3JvbGxpbmcgdG8gI1wiICsgZUlEKTtcbiAgICAgIGlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgIGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgIGRvY3VtZW50SGVpZ2h0ID0gTWF0aC5tYXgoYm9keS5jbGllbnRIZWlnaHQsIGJvZHkub2Zmc2V0SGVpZ2h0LCBib2R5LnNjcm9sbEhlaWdodCwgaHRtbC5jbGllbnRIZWlnaHQsIGh0bWwub2Zmc2V0SGVpZ2h0LCBodG1sLnNjcm9sbEhlaWdodCk7XG4gICAgICB3aW5kb3dIZWlnaHQgPSAkd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgd2luZG93U2Nyb2xsVG9wID0gKCR3aW5kb3cucGFnZVlPZmZzZXQgfHwgaHRtbC5zY3JvbGxUb3ApIC0gKGh0bWwuY2xpZW50VG9wIHx8IDApO1xuICAgICAgZWxtWVBvc2l0aW9uID0gZnVuY3Rpb24oZUlEKSB7XG4gICAgICAgIHZhciBlbG0sIG5vZGUsIHk7XG4gICAgICAgIGVsbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVJRCk7XG4gICAgICAgIHkgPSBlbG0ub2Zmc2V0VG9wO1xuICAgICAgICBub2RlID0gZWxtO1xuICAgICAgICB3aGlsZSAobm9kZS5vZmZzZXRQYXJlbnQgJiYgbm9kZS5vZmZzZXRQYXJlbnQgIT09IGRvY3VtZW50LmJvZHkpIHtcbiAgICAgICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgeSArPSBub2RlLm9mZnNldFRvcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geTtcbiAgICAgIH07XG4gICAgICBhdmFpbCA9IGRvY3VtZW50SGVpZ2h0IC0gd2luZG93SGVpZ2h0O1xuICAgICAgc2Nyb2xsID0gZWxtWVBvc2l0aW9uKGVJRCk7XG4gICAgICBpZiAoc2Nyb2xsID4gYXZhaWwpIHtcbiAgICAgICAgc2Nyb2xsID0gYXZhaWw7XG4gICAgICB9XG4gICAgICBodG1sLnN0eWxlLnRyYW5zaXRpb24gPSBcIjFzIGVhc2UtaW4tb3V0XCI7XG4gICAgICBodG1sLnN0eWxlLm1hcmdpblRvcCA9ICh3aW5kb3dTY3JvbGxUb3AgLSBzY3JvbGwpICsgXCJweFwiO1xuICAgICAgb25BbmltYXRpb25FbmQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQuY3VycmVudFRhcmdldCA9PT0gZXZlbnQudGFyZ2V0ICYmIGlzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgYm9keS5zY3JvbGxUb3AgPSBzY3JvbGw7XG4gICAgICAgICAgaHRtbC5zdHlsZS50cmFuc2l0aW9uID0gXCJcIjtcbiAgICAgICAgICBodG1sLnN0eWxlLm1hcmdpblRvcCA9IFwiXCI7XG4gICAgICAgICAgcmV0dXJuIGlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBodG1sLmFkZEV2ZW50TGlzdGVuZXIoXCJ3ZWJraXRUcmFuc2l0aW9uRW5kXCIsIG9uQW5pbWF0aW9uRW5kKTtcbiAgICAgIGh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgb25BbmltYXRpb25FbmQpO1xuICAgICAgcmV0dXJuIGh0bWwuYWRkRXZlbnRMaXN0ZW5lcihcIm9UcmFuc2l0aW9uRW5kXCIsIG9uQW5pbWF0aW9uRW5kKTtcbiAgICB9XG4gIH07XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkd2luZG93XCIsIFwiJGxvZ1wiXTtcbiIsIlxuLypcbiAgVGhpcyBzZXJ2aWNlIG9mZmVycyBhbiBpbnRlcmZhY2UgdG8gdGhyZWUga2luZHMgb2Ygc3RvcmFnZS4gVGVtcG9yYXJ5LCBsb2NhbFxuICBhbmQgc2Vzc2lvbi5cblxuICBUZW1wb3Jhcnkgc3RvcmFnZTogVXNlIHRoaXMgdG8gc2F2ZSBvYmplY3RzIHRoYXQgb25seSBuZWVkIHRvIGxpdmUgd2l0aGluIHRoZVxuICBsaWZldGltZSBvZiB0aGUgY3VycmVudCB3aW5kb3cvdGFiLlxuXG4gIExvY2FsIHN0b3JhZ2U6IFVzZSB0aGlzIHRvIHNhdmUgb2JqZWN0cyB0aGF0IG9ubHkgbmVlZCB0byBsaXZlIGZvcmV2ZXIuIFRoZXlcbiAgZG9uJ3QgZ2V0IGVyYXNlZCB1bmxlc3MgdGhlIHVzZXIgZGVjaWRlcyB0byBjbGVhciB0aGUgYnJvd3NlcidzIHNhdmVkIGRhdGEuXG5cbiAgU2Vzc2lvbiBzdG9yYWdlOiBVc2UgdGhpcyB0byBzYXZlIG9iamVjdHMgdGhhdCBvbmx5IG5lZWQgdG8gd2l0aGluZyB0aGVcbiAgY3VycmVudCBzZXNzaW9uLiBUaGV5IGdldCBlcmFzZWQgd2hlbiB0aGUgdXNlciBjbG9zZXMgdGhlIGJyb3dzZXIuXG4gKi9cbnZhciBleHBvcnRzO1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkd2luZG93LCBjb25zb2xlLCAkZW52aXJvbm1lbnQpIHtcbiAgcmV0dXJuIG5ldyAoKGZ1bmN0aW9uKCkge1xuICAgIF9DbGFzcy5wcm90b3R5cGUubmFtZSA9IFwiW3NlcnZpY2U6c3RvcmFnZV1cIjtcblxuICAgIGZ1bmN0aW9uIF9DbGFzcygpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgXCJpbml0aWFsaXppbmdcIik7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwic2V0dGluZyB1cCB0ZW1wb3Jhcnkgc3RvcmFnZVwiKTtcbiAgICAgIHRoaXMudG1wID0gdGhpcy5fY3JlYXRlRmFsbGJhY2tTdG9yYWdlKCk7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm5hbWUsIFwic2V0dGluZyB1cCBsb2NhbCBhbmQgc2Vzc2lvbiBzdG9yYWdlXCIpO1xuICAgICAgaWYgKHRoaXMuX3N1cHBvcnRzSFRNTDVzdG9yYWdlKCkpIHtcbiAgICAgICAgdGhpcy5sb2NhbCA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX29wZXJhdGUobG9jYWxTdG9yYWdlLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKTtcbiAgICAgICAgdGhpcy5zZXNzaW9uID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5fb3BlcmF0ZShzZXNzaW9uU3RvcmFnZSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4odGhpcy5uYW1lLCBcInVzaW5nIGZhbGxiYWNrIHN0b3JhZ2VzIGZvciBsb2NhbCBhbmQgc2Vzc2lvblwiKTtcbiAgICAgICAgdGhpcy5sb2NhbCA9IHRoaXMuX2NyZWF0ZUZhbGxiYWNrU3RvcmFnZSgpO1xuICAgICAgICB0aGlzLnNlc3Npb24gPSB0aGlzLl9jcmVhdGVGYWxsYmFja1N0b3JhZ2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfQ2xhc3MucHJvdG90eXBlLl9vcGVyYXRlID0gZnVuY3Rpb24oc3RvcmFnZSwga2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKGtleSA9PT0gbnVsbCAmJiB2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc3RvcmFnZS5jbGVhcigpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIHN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9DbGFzcy5wcm90b3R5cGUuX2NyZWF0ZUZhbGxiYWNrU3RvcmFnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZuO1xuICAgICAgZm4gPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmIChrZXkgPT09IG51bGwgJiYgdmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLnByaXZhdGVEYXRhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVEYXRhW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByaXZhdGVEYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRlbGV0ZSB0aGlzLnByaXZhdGVEYXRhW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgZm4ucHJpdmF0ZURhdGEgPSB7fTtcbiAgICAgIHJldHVybiBmbjtcbiAgICB9O1xuXG4gICAgX0NsYXNzLnByb3RvdHlwZS5fc3VwcG9ydHNIVE1MNXN0b3JhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuICR3aW5kb3dbXCJsb2NhbFN0b3JhZ2VcIl0gIT0gbnVsbDtcbiAgICAgIH0gY2F0Y2ggKF9lcnJvcikge1xuICAgICAgICBlID0gX2Vycm9yO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfQ2xhc3M7XG5cbiAgfSkoKSk7XG59O1xuXG5leHBvcnRzLiRpbmplY3QgPSBbXCIkd2luZG93XCIsIFwiJGxvZ1wiLCBcIiRlbnZpcm9ubWVudFwiXTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYXBwKSB7XG4gIGNvbnNvbGUubG9nKFwiW2FwcF0gc2V0dGluZ3MgdmFsdWVzXCIpO1xuICBhcHAudmFsdWUoXCIkYW5jaG9yU2Nyb2xsXCIsIGFuZ3VsYXIubm9vcCk7XG4gIHJldHVybiBhcHAudmFsdWUoXCIkbG9nXCIsIGNvbnNvbGUpO1xufTtcbiJdfQ==
