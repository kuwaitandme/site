# angularModalService.js
#
# Modal service for AngularJS - supports creating popups and modals via a
# service. Find instruction on how to use this by visiting the git repo in the
# copyright link
#
# (Created by Dave Kerr; Modified by Steven Enamakel)
# COPYRIGHT https://github.com/dwmkerr/angular-modal-service/blob/master/LICENSE
exports = module.exports = ($document, $compile, $controller, $http, $rootScope,
$q, $templateCache, $timeout) ->
  # Get the body of the document, we'll add the modal to this.
  body = $document.find "body"

  # Returns a promise which gets the template, either
  # from the template parameter or via a request to the
  # template url parameter.
  getTemplate = (template, templateUrl) ->
    deferred = $q.defer()
    if template
      deferred.resolve template
    else if templateUrl
      deferred.resolve $templateCache.get templateUrl
    else deferred.reject "No template or templateUrl has been specified."
    deferred.promise

  new class ModalService
    showModal: (options) ->
      # Create a deferred we'll resolve when the modal is ready.
      deferred = $q.defer()

      # Validate the input parameters.
      controllerName = options.controller
      if not controllerName
        deferred.reject "No controller has been specified."
        return deferred.promise

      # If a "controllerAs" option has been provided, we change the controller
      # name to use "as" syntax. $controller will automatically handle this.
      if options.controllerAs
        controllerName = "#{controllerName} as #{options.controllerAs}"

      # Get the actual html of the template.
      getTemplate(options.template, options.templateUrl).then (template) ->
        # Create a new scope for the modal.
        modalScope = $rootScope.$new()

        # Create the inputs object to the controller - this will include
        # the scope, as well as all inputs provided.
        # We will also create a deferred that is resolved with a provided
        # close function. The controller can then call "close(result)".
        # The controller can also provide a delay for closing - this is
        # helpful if there are closing animations which must finish first.
        closeDeferred = $q.defer()
        inputs =
          $scope: modalScope
          close: (result, delay) ->
            if not delay? then delay = 0
            $timeout ->
              # Resolve the "close" promise.
              closeDeferred.resolve result

              # We can now clean up the scope and remove the element from the
              # DOM.
              modalScope.$destroy()
              modalElement.remove()

              # Unless we null out all of these objects we seem to suffer
              # from memory leaks, if anyone can explain why then I'd
              # be very interested to know.
              closeDeferred = deferred = inputs = inputs.close = null
              modal = modalElement = modalScope = null
            , delay

        # If we have provided any inputs, pass them to the controller.
        if options.inputs
          for inputName of options.inputs
            inputs[inputName] = options.inputs[inputName]

        # Parse the modal HTML into a DOM element (in template form).
        modalElementTemplate = angular.element template

        # Compile then link the template element, building the actual element.
        # Set the $element on the inputs so that it can be injected if required.
        linkFn = $compile modalElementTemplate
        modalElement = linkFn modalScope
        inputs.$element = modalElement

        # Create the controller, explicitly specifying the scope to use.
        modalController = $controller controllerName, inputs

        # Finally, append the modal to the DOM.
        if options.appendElement
          # Append to custom append element
          options.appendElement.append modalElement
        else
          # Append to body when no custom append element is specified
          body.append modalElement

        # We now have a modal object...
        modal =
          close: closeDeferred.promise
          controller: modalController
          element: modalElement
          scope: modalScope
        # ...which is passed to the caller via the promise.
        deferred.resolve modal

      .then null, (error) ->
        # "catch" doesn't work in IE8.
        deferred.reject error
      deferred.promise


exports.$inject = [
  "$document"
  "$compile"
  "$controller"
  "$http"
  "$rootScope"
  "$q"
  "$templateCache"
  "$timeout"
]
