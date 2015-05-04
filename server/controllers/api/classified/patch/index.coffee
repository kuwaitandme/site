validator = require "validator"

updatePerks   = require "./perks"
updateReports = require "./reports"
updateStatus  = require "./status"


# This function is responsible for patching specific fields of the user,
# namely the "status", "perks" or the "reports". This should be the only
# function that is able to modify these fields.
#
# The function rejects requests for various reasons and returns error codes
# with 400, 401 or 404. Any other error gets on passed to the next(..).
#
# This function also takes care of all the possible scenarios, each of which has
# been mentioned in the comments at various places.
exports = module.exports = (Classified) ->
  controller = (request, response, next) ->
    data = request.body
    id = request.params.id
    user = request.user or {}
    isModerator = request.user and user.isModerator or false

    response.contentType "application/json"

    # First check for any invalid parameters.
    if not id
      response.status 404
      return response.end '"need id"'
    if not validator.isMongoId id
      response.status 400
      return response.end '"invalid id"'

    # Check if the parameters that we accepts are there or not
    if not data.status? and not data.perks? and not data.reports?
      response.status 400
      return response.end "'patch only specific parameters'"

    # For each parameter, validate it before continuing
    if data.status  and not isValidStatus data.status, data.moderatorReason
      response.status 400
      return response.end "'invalid status/reason'"
    if data.perks and not isValidPerk data.perks
      response.status 400
      return response.end "'invalid perks'"
    if data.reports and not isValidReport data.reports
      response.status 400
      return response.end "'invalid report'"

    # If all the parameters are valid, then get the classified and start
    # validating against the user
    Classified.get id, (error, classified) ->
      # Check if the classified first of all, exists.
      if not classified
        response.status 404
        return response.end "'not found'"

      # This condition determines if the currently loggedin in user is the
      # owner of the classified or not
      isOwner = (String user._id) is (String classified.owner)

      # Check conditions for a guest classified
      if classified.guest
        # The authentication hash must match to modify this classified or
        # you must be a moderator.
        if classified.authHash != request.query.authHash and
          not isModerator
            response.status 401
            return response.end "'unauthorized'"

      # Check conditions for regular classified
      else
        # You must be the owner/moderator if you are modifying a regular
        # classified.
        if user and not isModerator and not isOwner
          response.status 401
          return response.end "'unauthorized'"

      # All the data coming in has been validated properly, so now call the
      # specific function to update the respective field.
      if data.status?       then updateStatus  classified, request, response, next
      else if data.perks?   then updatePerks   classified, request, response, next
      else if data.reports? then updateReports classified, request, response, next

      # Theoretically, you shouldn't reach this condition because of all
      # checks above, but no harm in having it here.
      else
        response.status 412
        return response.end "'patch only specific parameters'"


exports["@require"] = ["models/classified"]
exports["@singleton"] = true