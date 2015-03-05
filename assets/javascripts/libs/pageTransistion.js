var PageTransitions = (function() {

	var $main = $( '#pt-main' ),
		$pages = $main.children( 'div.pt-page' ),
		animcursor = 1,
		pagesCount = $pages.length,
		current = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;

	function init() {
		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		} );

		$pages.eq( current ).addClass( 'pt-page-current' );

		window.nextPage = nextPage;
	}

	function nextPage(reverse) {
		$pages = $main.children( 'div.pt-page' );
		$pages.each( function() {
			var $page = $(this);
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		});
		pagesCount = $pages.length;

		if(isAnimating) return false;
		isAnimating = true;

		var $currPage = $pages.eq( current );

		/* Don't animate if we are in the last page */
		if(current < pagesCount - 1) ++current;
		else return;

		var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
			outClass = '', inClass = '';

		if(reverse) {
			outClass = 'pt-page-moveToRightEasing pt-page-ontop';
			inClass = 'pt-page-moveFromLeft';
		} else {
			outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
			inClass = 'pt-page-moveFromRight';
		}

		$currPage.addClass(outClass).on(animEndEventName, function() {
			$currPage.off(animEndEventName);
			endCurrPage = true;

			if(endNextPage)  onEndAnimation($currPage, $nextPage);
		});

		$nextPage.addClass(inClass).on(animEndEventName, function() {
			$nextPage.off(animEndEventName);
			endNextPage = true;

			if(endCurrPage) onEndAnimation( $currPage, $nextPage );
		});

		if(!support) onEndAnimation( $currPage, $nextPage );
	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage($outpage, $inpage);
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr('class', $outpage.data('originalClassList'));
		$inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
	}

	init();

	return { init : init };
})();