module.exports = Backbone.View.extend
  name: '[view:account-credits]'
  title: -> "Buy Credits"
  template: template['account/credits']
  events:
    "click .cta-button" : "buyHandle"

  start: ->
    @$credits = @$ ".credit-counter"
    @paymentModal = new @resources.Views.components.paymentModal
      el: @$ "#payment-modal-container"

  continue: ->
    @$credits.html @resources.currentUser.get 'credits'

  buyHandle: (event) ->
    console.log "buying", event.currentTarget.dataset.credits
    switch Number event.currentTarget.dataset.credits
      when 20 then @paymentModal.setPurchaseOptions 20, 10, 30
      when 50 then @paymentModal.setPurchaseOptions 50, 20, 60
      when 100 then @paymentModal.setPurchaseOptions 100, 30, 90

    @paymentModal.handleTransaction (error, result) ->
      console.log error, result