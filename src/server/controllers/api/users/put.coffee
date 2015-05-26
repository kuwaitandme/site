exports = module.exports = ->
  module.exports = (request, response, next) -> next()

module.exportdis = (request, response, next) ->
  response.contentType "application/json"

  if not request.body.credits then response.json {}

  id = request.params[0]
  POSTdata = request.body

  # if not request.body or request.body.length == 0 then return next()
  # if not request.body.token then return next()
  # if not /^[0-9A-F]*$/i.test(id) then return next()

  # perks = request.body["perks[]"]
  # price = 0
  # perks[0] = true
  # perks[1] = false
  # if perks[0] then price += 15
  # if perks[1] then price += 45
  config = global.config
  POSTdata =
    token: request.body.token
    currency: "USD"
    total: String 30#price
    billingAddr:
      "name": "Testing Tester"
      "addrLine1": "123 Test St"
      "city": "Columbus"
      "state": "Ohio"
      "zipCode": "43123"
      "country": "USA"
      "email": "example@2co.com"
      "phoneNumber": "5555555555"

    # billingAddr:
      # addrLine1: request.body["billingAddr[addrLine1]"]
      # addrLine2: request.body["billingAddr[addrLine2]"]
      # city: request.body["billingAddr[city]"]
      # country: request.body["billingAddr[country]"]
      # email: request.body["billingAddr[email]"]
      # name: "name"#request.body["billingAddr[name]"]
      # phoneNumber: request.body["billingAddr[phoneNumber]"]
      # state: request.body["billingAddr[state]"]
      # zipCode: request.body["billingAddr[zipCode]"]

  twocheckout = global.modules.twocheckout
  # twocheckout.processTransaction id, POSTdata, (error, data) ->
  # if error and false
  #   response.status error.status or 400
  #   return response.end JSON.stringify
  #     data: data
  #     error: error
  #     # transaction: transaction

  User = global.models.user
  User.addCredits request.user._id, Number request.body.credits

  response.end JSON.stringify
    status: "success"
    # transaction: transaction