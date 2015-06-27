###*
 * angularModalService.js
 *
 * Modal service for AngularJS - supports creating popups and modals via a
 * service. Find instructions on how to use this by visiting the git repo in the
 * link below.
 *
 * (Created by Dave Kerr; Modified by Steven Enamakel)
 * https://github.com/dwmkerr/angular-modal-service
###


name = "[factory:modal]"


exports = module.exports = ($document, $compile, $controller, $http, $rootScope,
$q, $templateCache, $timeout, $log) ->
  # Keep a global variable linking to the current modal.
  currentModal = null

  # Get the body of the document, we'll add the modal to this.
  containerElement = $document.find("modal").find "section"

  # Returns a promise which gets the template, either
  # from the template parameter or via a request to the
  # template url parameter.
  getTemplate = (template, templateUrl) ->
    deferred = $q.defer()
    if template then deferred.resolve template
    else if templateUrl then deferred.resolve $templateCache.get templateUrl
    else deferred.reject "No template or templateUrl has been specified."
    deferred.promise


  # If the modal controller requested to close the modal, then we explictly
  # call the modal's close function
  $rootScope.$on "factory:modal:close", ->
    $log.log name, "explicitly closing modal"
    if currentModal? and currentModal.inputs? and currentModal.inputs.close?
      currentModal.inputs.close()


  $rootScope.$on "factory:modal:finish", ->
    $log.log name, "finishing up modal"

    # We can now clean up the scope and remove the element from the DOM.
    if currentModal?
      window.a = currentModal
      # Destroy the scope.
      if currentModal.scope? then currentModal.scope.$destroy()
      # Remove the element from the DOM
      currentModal.element.remove()


  new class ModalService
    showModal: (options) ->


      # Find the container for the modal!
      modalContainer = $document.find "modal"
      containerElement = modalContainer[0].getElementsByClassName "content"
      containerElement = angular.element containerElement

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
      getTemplate options.template, options.templateUrl
      .then (template) ->
        # Create a new scope for the modal.
        modalScope = $rootScope.$new()

        # Create the inputs object to the controller - this will include
        # the scope, as well as all inputs provided.
        #
        # We will also create a deferred that is resolved with a provided
        # close function. The controller can then call "close(result)".
        # The controller can also provide a delay for closing - this is
        # helpful if there are closing animations which must finish first.
        closeDeferred = $q.defer()
        inputs =
          $scope: modalScope
          close: (result, delay=600) ->
            # Send a message to our modal's controller to hide the modal
            $rootScope.$emit "component:modal:hide"

            $timeout delay
            .then ->
              # Resolve the "close" promise.
              closeDeferred.resolve result

              # Unless we null out all of these objects we seem to suffer
              # from memory leaks, if anyone can explain why then I'd
              # be very interested to know.
              deferred = inputs = inputs.close = null
              modal = modalElement = modalScope = null

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

        # Append to our container
        containerElement.append modalElement

        # Let the modal controller know that we want to display the modal
        $rootScope.$emit "component:modal:show"

        # We now have a modal object...
        modal =
          close: closeDeferred.promise
          controller: modalController
          element: modalElement
          inputs: inputs
          scope: modalScope
        currentModal = modal

        # ...which is passed to the caller via the promise.
        deferred.resolve modal

      .catch deferred.reject
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
  "$log"
]
