/**
 * [setupSpinner description]
 *
 * @return {[type]} [description]
 */
module.exports = Spinner = function() {
	var spinner = app.libs.spinner;
	var opts = {
		className: 'spinner', // The CSS class to assign to the spinner
		color: '#000', // #rgb or #rrggbb or array of colors
		corners: 1, // Corner roundness (0..1)
		direction: 1, // 1: clockwise, -1: counterclockwise
		hwaccel: false, // Whether to use hardware acceleration
		left: '50%', // Left position relative to parent
		length: 5, // The length of each line
		lines: 12, // The number of lines to draw
		radius: 7, // The radius of the inner circle
		rotate: 36, // The rotation offset
		shadow: false, // Whether to render a shadow
		speed: 1.7, // Rounds per second
		top: '50%', // Top position relative to parent
		trail: 64, // Afterglow percentage
		width: 3, // The line thickness
		zIndex: 2e9, // The z-index (defaults to 2000000000)
	};
	this.spinner = new spinner(opts);
	this.$spinner = $("#ajax-spinner .spinner");
};


/**
 * [showSpinner description]
 *
 * @return {[type]} [description]
 */
Spinner.prototype.show = function() {
	this.spinner.spin();
	this.$spinner.html(this.spinner.el);
	this.$spinner.parent().show();
};


/**
 * [hideSpinner description]
 *
 * @return {[type]} [description]
 */
Spinner.prototype.hide = function() {
	this.$spinner.parent().hide();
	this.$spinner.stop();
};