/**
 * EXPLAIN CONTROLLER HERE
 *
 * @return {[type]} [description]
 */
var controller = module.exports = function() {
	/**
	 * [initialize description]
	 *
	 * @param  {[type]} config [description]
	 * @return {[type]}        [description]
	 */
	controller.prototype.initialize = function(config) {
		console.log("[controller:pagetransition] initializing");

		/* Setup som defaults */
		this.$main = $('#pt-main');
		this.currentPage = 0;
		this.isAnimating = false;
		this.endCurrentPage = false;
		this.endTargetPage = false;
		this.callbackCalled = false;

		/* CSS animation-end event name */
		this.animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		};
		this.animEndEventName = this.animEndEventNames[
			Modernizr.prefixed('animation') ];

		/* Support CSS animations */
		this.support = Modernizr.cssanimations;

		this.$pages = this.$main.children('div.pt-page');
		this.$pages.eq(this.currentPage).addClass('pt-page-current');
		this.$pages.eq(this.currentPage).data("index", app.controllers.router.historyIndex);
	};


	/**
	 * [transition description]
	 *
	 * @param  {[type]} options [description]
	 */
	controller.prototype.transition = function(options) {
		console.debug("[controller:pagetransition] animating with parameters", options);
		var that = this;
		var outClass = '', inClass = '';

		/* Finish any existing animations if there are any */
		this.finishAnimation();

		/* Check if the animation is locked or not */
		if(this.isAnimating) return false;
		this.isAnimating = true;

		/* Disable the router temporarily */
		app.controllers.router.disabled = true;

		/* Setup some defaults */
		options = options || {};
		this.$pages = this.$main.children('div.pt-page');
		this.$currPage = this.$pages.eq(this.currentPage);
		var pagesCount = this.$pages.length;

		this.$pages.each( function() {
			var $page = $(this);
			$page.data('originalClassList', $page.attr('class') );
		});


		/* Don't animate if we this.are in the last page */
		// if(this.currentPage < pagesCount - 1) ++this.currentPage;

		/* Get the target page and add the 'pt-page-current' class to it */
		if(options.$targetPage) this.$targetPage = options.$targetPage;
		else this.$targetPage = this.$pages.eq(this.currentPage)
		this.$targetPage.addClass('pt-page-current');

		// if(options.vertical) {
		// 	direction1 = 'pt-page-moveToRightEasing pt-page-ontop';
		// 	direction2 = 'pt-page-moveFromLeft'
		// }
		options.direction = (options.reverse ? "fromLeft" : "fromRight");
		switch(options.direction) {
			case "fromBottom": break;
			case "fromTop": break;
			case "fromLeft":
				outClass = 'pt-page-moveToRightEasing pt-page-ontop';
				inClass = 'pt-page-moveFromLeft';
				break;
			case "fromRight":
			default:
				outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
				inClass = 'pt-page-moveFromRight';
		}


		/* Setup callback functions when the animation ends on the current
		 * page */
		this.$currPage.addClass(outClass).on(that.animEndEventName, function() {
			that.$currPage.off(that.animEndEventName);

			that.endCurrentPage = true;
			if(that.endTargetPage) that.finishAnimation();
		});


		/* Setup callback functions when the animation ends on the target
		 * page */
		this.$targetPage.addClass(inClass).on(that.animEndEventName, function() {
			that.$targetPage.off(that.animEndEventName);

			that.endTargetPage = true;
			if(that.endCurrentPage) that.finishAnimation();
		});

		if(!this.support) this.finishAnimation();
	};


	/**
	 * This function is what gets called when the CSS animation finishes
	 * animating the page transitions. This is also a neat way to force the
	 * animation to stop.
	 */
	controller.prototype.finishAnimation = function() {
		if(!this.endCurrentPage && !this.endTargetPage) return;
		if(!this.$currPage && !this.$targetPage) return;

		/* Setup some flags to signal that the animation is over */
		this.endCurrentPage = false;
		this.endTargetPage = false;
		this.resetPage();
		this.isAnimating = false;

		/* Re-enable the router */
		app.controllers.router.disabled = false;
	};


	/**
	 * Resets the CSS styles for the pages that were being animated. This
	 * way we stop the CSS animations and return the classes that were removed
	 * back to the pages they were originally on.
	 */
	controller.prototype.resetPage = function() {
		this.$currPage.attr('class', this.$currPage.data('originalClassList'));
		this.$targetPage.attr('class', this.$targetPage.data('originalClassList') + ' pt-page-current');
	};
}