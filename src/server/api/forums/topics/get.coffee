###
GET /api/forums/topic
=====================

# Description
This controller lists all the topics in the forum. It takes in the following
parameters as GET variables to narrow down the query.

TODO: prevent sql injection

# Usage
```
  GET /api/forums/topic            -> JSON [{...}, {...}]
  GET /api/forums/topic?category=1 -> JSON [{...}]
```

@param {Number} category     The category id to which topics should belong to.
@returns {Array}             An array of topics that match the query.
###
exports = module.exports = (Topics) ->
  controller = (request, response, next) ->
    Topics.query().then (results) -> response.json results


exports["@require"] = ["models/forums/topics"]
exports["@singleton"] = true
