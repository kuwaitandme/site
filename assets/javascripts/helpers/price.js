module.exports = {
	/**
	 * [format description]
	 *
	 * @param  {[type]} price [description]
	 * @return {[type]}       [description]
	 */
	format: function(price) {
		if(price == 0) return "Free"
		if(price == -1) return "Contact Owner";
		if(price) return price.toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD";
	}
}