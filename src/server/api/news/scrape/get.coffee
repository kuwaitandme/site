Promise = require "bluebird"
cheerio = require "cheerio"
Request = require "request"
validator = require "validator"


exports = module.exports = (Stories) ->
  controller = (request, response, next) ->
    url = request.query.u or ""

    Request url, (error, res, html) ->
      if not error and res.statusCode is 200
        # Parse the site
        $ = cheerio.load html

        # Get the title
        title = $("title").text().trim()

        # Return!
        response.json url: url, title: title

      # Something wicked happened! Return..
      else response.json url: url, title: ""


exports["@require"] = ["models/news/stories"]
exports["@singleton"] = true
