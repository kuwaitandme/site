module.exports = {
    /**
     * Finds a location, given it's id.
     */
    find: function (id) {
        var location = window.locations;

        for(var i=0; i<location.length; i++) {
            if(location[i]._id == id) return location[i];
        }
    }
};