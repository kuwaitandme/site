Promise   = require "bluebird"
validator = require "validator"


###*
 * This controller simply queries the DB for classified that match the given
 * query that is passed as GET parameters.
 *
 * The parameters get passed directly to the model and most of filtering gets
 * done there. All the parameters listed here are to be passed as GET query
 * parameters.
 *
 * NOTE: This route has been tested with sqlmap.py as of May 12th 2015
 *
 * @param Number parent_category      The parent category
 * @param Number child_category       The child category
 * @param Number owner                The userid of the user who posted the
 *                                    classified.
 * @param Number status               The current status of the classifed
 * @param Number page                 The current page number of the query. This
 *                                    useful for multi-page queries.
 *
 * @return Array                      Returns a JSON arrays of the classifieds
 *                                    that match the given query
 *
 * @example
 * GET sitename.tld/api/classified?status=2 -> 200 JSON [{..}, {..}, ...]
 *
 * @author Steven Enamakel <me@steven.pw>
###
exports = module.exports = (Classifieds) ->
  controller = (request, response, next) ->
    Classifieds.query request.query
    .then (result) -> response.json result
    .catch next


exports["@require"] = ["models/classifieds"]
exports["@singleton"] = true
