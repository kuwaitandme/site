module.exports = ->
	(scope, elm, attr) ->
		raw = elm[0]

		elm.bind 'scroll', ->
			if (raw.scrollTop + raw.offsetHeight) >= raw.scrollHeight
				scope.$apply attr.whenScrolled
