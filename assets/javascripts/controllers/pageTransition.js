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

		this.$main = $('#pt-main');
		this.currentPage = 0;
		this.isAnimating = false;
		this.endCurrPage = false;
		this.endNextPage = false;
		this.callbackCalled = false;

		/* Animation-end event name */
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
	};


	/**
	 * [transition description]
	 *
	 * @param  {Function} callback [description]
	 * @param  {[type]}   reverse  [description]
	 * @param  {[type]}   vertical [description]
	 */
	controller.prototype.transition = function(options) {
		console.debug("[controller:pagetransition] animating with parameters", options);
		var that = this;

		/* Check if the animation is locked or not */
		if(this.isAnimating) return false;
		this.isAnimating = true;

		/* Disable the router temporarily */
		app.controllers.router.disabled = true;

		/* Setup some defaults */
		options = options || {};
		this.$pages = this.$main.children('div.pt-page');
		var pagesCount = this.$pages.length;
		var $currPage = this.$pages.eq(this.currentPage);

		this.$pages.each( function() {
			var $page = $(this);
			$page.data('originalClassList', $page.attr('class') );
		});


		/* Don't animate if we this.are in the last page */
		if(this.currentPage < pagesCount - 1) ++this.currentPage;
		else if(callback) return callback();

		var $nextPage = this.$pages.eq(this.currentPage).addClass('pt-page-current'),
			outClass = '', inClass = '';

		// if(options.vertical) {
		// 	direction1 = 'pt-page-moveToRightEasing pt-page-ontop';
		// 	direction2 = 'pt-page-moveFromLeft'
		// }
		if(options.reverse) {
			outClass = 'pt-page-moveToRightEasing pt-page-ontop';
			inClass = 'pt-page-moveFromLeft';
		} else {
			outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
			inClass = 'pt-page-moveFromRight';
		}

		$currPage.addClass(outClass).on(that.animEndEventName, function() {
			$currPage.off(that.animEndEventName);
			that.endCurrPage = true;

			if(that.endNextPage) that.onAnimationEnd($currPage, $nextPage);
		});

		$nextPage.addClass(inClass).on(that.animEndEventName, function() {
			$nextPage.off(that.animEndEventName);
			that.endNextPage = true;

			if(that.endCurrPage) that.onAnimationEnd($currPage, $nextPage);
		});

		if(!this.support) this.onAnimationEnd($currPage, $nextPage);
	};

	controller.prototype.onAnimationEnd = function($outpage, $inpage) {
		this.endCurrPage = false;
		this.endNextPage = false;
		this.resetPage($outpage, $inpage);
		this.isAnimating = false;

		/* Re-enable the router */
		app.controllers.router.disabled = false;
	};

	controller.prototype.resetPage = function($outpage, $inpage) {
		$outpage.attr('class', $outpage.data('originalClassList'));
		$inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
	};
}