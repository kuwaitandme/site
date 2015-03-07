var controller = module.exports = function() {

	controller.prototype.initialize = function() {
		console.log("[controller:resourceLoader] initializing");
		this.$scripts = $("#scripts");
		this.resources = {
			'2checkout': {
				isLoaded: function () {return typeof recaptcha !== 'undefined'},
				script: "//www.2checkout.com/checkout/api/2co.min.js",
			},
			dropzone: {
				isLoaded: function () {return typeof Dropzone !== 'undefined'},
				script: "//cdnjs.cloudflare.com/ajax/libs/dropzone/4.0.1/min/dropzone.min.js",
			},
			googleMaps: {
				isLoaded: function () {return typeof google !== 'undefined'},
				script: "//maps.googleapis.com/maps/api/js?v=3.exp",
			},
			imagesLoaded: {
				isLoaded: function () {return typeof imagesLoaded !== 'undefined'},
				script: "//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.min.js",
			},
			masonry: {
				isLoaded: function () {return typeof Masonry !== 'undefined'},
				script: "//cdnjs.cloudflare.com/ajax/libs/masonry/3.2.2/masonry.pkgd.min.js",
			},
			reCaptcha: {
				isLoaded: function () {return typeof recaptcha !== 'undefined'},
				script: "//www.google.com/recaptcha/api.js"
			}
		};
	};

	controller.prototype.loadResource = function(identifier) {
		console.debug("[controller:resourceLoader] loading resource", identifier);
		var resource = this.resources[identifier];

		if(!resource)
			return console.log("[controller:resourceLoader] resource not found");

		if(resource.isLoaded())
			return console.log("[controller:resourceLoader] resource already loaded");

		var html = "<script src='" + resource.script + "'></script>";
		this.$scripts.append(html);
	};
}