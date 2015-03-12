/**
 * Here are the scripts that get loaded during runtime. You must list the scripts
 * here in the order they should be loaded. The app will make sure that they
 * get cached properly.
 */
window.scripts = [{
	name:"jquery",
	remoteSrc: "/javascripts/vendor/jquery.min.js",
	localSrc: "/javascripts/vendor/jquery.min.js",
},{
	name:"jquery-transit",
	remoteSrc: "/javascripts/vendor/jquery.transit.min.js",
	localSrc: "/javascripts/vendor/jquery.transit.min.js",
},{
	name:"underscore",
	remoteSrc: "/javascripts/vendor/underscore.min.js",
	localSrc: "/javascripts/vendor/underscore.min.js",
},{
	name:"backbone",
	remoteSrc: "/javascripts/vendor/backbone.min.js",
	localSrc: "/javascripts/vendor/backbone.min.js",
},{
	name:"modernizr",
	remoteSrc: "/javascripts/vendor/modernizr.min.js",
	localSrc: "/javascripts/vendor/modernizr.min.js",
},{
	name:"2checkout",
	remoteSrc: "/javascripts/vendor/2co.min.js",
	localSrc: "/javascripts/vendor/2co.min.js",
},{
	name:"dropzone",
	remoteSrc: "/javascripts/vendor/dropzone.min.js",
	localSrc: "/javascripts/vendor/dropzone.min.js",
},{
	name:"masonry",
	remoteSrc: "/javascripts/vendor/masonry.pkgd.min.js",
	localSrc: "/javascripts/vendor/masonry.pkgd.min.js",
},{
	name:"jquery-imagesloaded",
	remoteSrc: "/javascripts/vendor/imagesloaded.min.js",
	localSrc: "/javascripts/vendor/imagesloaded.min.js",
},{
	name:"tinymce",
	remoteSrc: "/javascripts/vendor/jquery.tinymce.min.js",
	localSrc: "/javascripts/vendor/jquery.tinymce.min.js",
},{
	name:"app",
	remoteSrc: "/javascripts/build/app.js",
	localSrc: "/javascripts/build/app.js",
}];

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
	$script.type = "text/javascript";
	$script.async = true;
	$script.dataset.script = script.name;

	/* Check for the script in our cache */
	var scriptCache = localStorage.getItem("script-" + script.name);

	// console.debug(script.name, scriptCache);

	/* If the cache exists, then read from it; Otherwise load the script
	 * normally */
	if(typeof Storage !== "undefined" && scriptCache && script.name != 'app') {
		$script.innerHTML = scriptCache;
		document.getElementsByTagName('head')[0].appendChild($script);
	}
	else loadScriptSync(script.remoteSrc);
}