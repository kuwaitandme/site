/**
 * Here are the scripts that get loaded during runtime. You must list the scripts
 * here in the order they should be loaded. The app will make sure that they
 * get cached properly.
 */
window.scripts = [{
	name:"jquery",
	remoteSrc: "//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js",
	localSrc: "/javascripts/vendor/jquery.min.js",
},{
	name:"jquery-transit",
	remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/jquery.transit/0.9.12/jquery.transit.min.js",
	localSrc: "/javascripts/vendor/jquery.transit.min.js",
},{
	name:"underscore",
	remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js",
	localSrc: "/javascripts/vendor/underscore.min.js",
},{
	name:"backbone",
	remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js",
	localSrc: "/javascripts/vendor/backbone.min.js",
},{
	name:"modernizr",
	remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js",
	localSrc: "/javascripts/vendor/modernizr.min.js",
},{
	name:"2checkout",
	remoteSrc: "//www.2checkout.com/checkout/api/2co.min.js",
	localSrc: "/javascripts/vendor/2co.min.js",
},{
	name:"dropzone",
	remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/min/dropzone.min.js",
	localSrc: "/javascripts/vendor/dropzone.min.js",
},{
	name:"masonry",
	remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/masonry/3.2.2/masonry.pkgd.min.js",
	localSrc: "/javascripts/vendor/masonry.pkgd.min.js",
},{
	name:"googleMaps",
	remoteSrc: "//maps.googleapis.com/maps/api/js?v=3.exp",
	localSrc: "/javascripts/vendor/google.maps.js",
},{
	name:"jquery-imagesloaded",
	remoteSrc: "//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.pkgd.min.js",
	localSrc: "/javascripts/vendor/imagesloaded.min.js",
},{
	name:"tinymce",
	remoteSrc: "//tinymce.cachefly.net/4.1/jquery.tinymce.min.js",
	localSrc: "/javascripts/vendor/jquery.tinymce.min.js",
},{
	name:"app",
	remoteSrc: "/javascripts/build/app.min.js",
	localSrc: "/javascripts/build/app.min.js",
}]

function loadScriptSync(src) {
	var s = document.createElement('script');
	s.src = src;
	s.type = "text/javascript";
	s.async = false;                                 // <-- this is important
	document.getElementsByTagName('head')[0].appendChild(s);
}


for (var i = scripts.length; i >= 1; i--) {
	var script = scripts[scripts.length - i];

	/* Create the DOM element to load our script */
	var $script = document.createElement("script");
	var foundInCache = false;

	$script.type = "text/javascript";
	$script.dataset.script = script.name;

	if(typeof Storage !== "undefined") {
		/* Check for the script in our cache */
		var scriptCache = localStorage.getItem("script-" + script.name);

		/* If the cache exists, then read from it; Otherwise load the script
		 * normally */
		if(scriptCache) {
			$script.innerHTML = scriptCache;
			document.getElementsByTagName('head')[0].appendChild($script);
			foundInCache = true;
		}
	}

	if(!foundInCache) loadScriptSync(script.remoteSrc);
}