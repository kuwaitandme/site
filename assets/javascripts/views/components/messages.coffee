module.exports = Backbone.View.extend
  template: _.template '<li class="<%= type %>">\
    <b class="title"><%= title %></b>&nbsp;\
    <span class="content"><%= text %></span>\
  </li>'


  initialize: ->
    @$message = @$el.find('.content')
    @$title = @$el.find('.title')


  clear: -> @$el.html ''


  success: (text, title) ->
    html = @template(
      text: text
      title: title or 'Success!'
      type: 'success')
    @$el.append html


  error: (text, title) ->
    html = @template(
      text: text
      title: title or 'Error!'
      type: 'error')
    @$el.append html


  warn: (text, title) ->
    html = @template(
      text: text
      title: title or 'Warning!'
      type: 'warning')
    @$el.append html