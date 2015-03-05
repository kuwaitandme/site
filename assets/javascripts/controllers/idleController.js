/**
 * The idle controller is a function that begins downloading and caching
 * external site resources when the browser is idle for a certain period of
 * time.
 *
 * If the function detects that browser has been idle it then invokes the
 * 'performIdleTasks()' function, which then decides what should be done.
 */
var controller = module.exports = function() {

	/**
	 * Initializes the idle controller. This function forks a process that
	 * runs at every specified interval and resets itself whenever the mouse is
	 * moved or the keyboard is pressed. If the process uninterrupted for a
	 * specific number of hours then it starts performing the idle tasks.
	 *
	 * @param  Object  config   Configuration options for the idle controller.
	 */
	controller.prototype.initialize = function(config) {
		console.log("[init] idle controller");

		var that = this;
		var idleTime = 0;

		$(document).ready(function () {
			/* Increment the idle time counter every minute. */
			var idleInterval = setInterval(timerIncrement, 6 * 10000);

			/* Zero the idle timer on mouse movement or keypress */
			$(this).mousemove(function (e) { idleTime = 0; });
			$(this).keypress(function (e) { idleTime = 0; });
		});

		/* This function gets called every minute and decides if it's time to
		 * to perform the idle tasks or not */
		function timerIncrement() {
			if (idleTime < config.idleInterval) return (idleTime += 1);

			idleTime = 0;
			that.performIdleTasks();
		}

		console.warn("[warn] there are no idle tasks");
		console.log("[done] idle controller");
	};


	/**
	 * Function responsible for running a bunch of idle tasks.
	 */
	controller.prototype.performIdleTasks = function () {
		console.info("[info] performing idle tasks");
	}
}