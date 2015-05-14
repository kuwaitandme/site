getArabicNoun = (noun) ->
  dict =
    "second" : "ثانية"
    "minute" : "دقيقة"
    "hour" : "ساعات"
    "day" : "أيام"
    "week" : "أسابيع"
    "month" : "أشهر"
    "year" : "سنوات"
  dict[noun]

createHandler = (divisor, noun, restOfString) ->
  (diff) ->
    # lang = App.Resources.language
    n = Math.floor diff / divisor
    # if lang.currentLanguage is "ar"
    #   arabicNum = App.Resources.Helpers.numbers.toArabic n
    #   arabicNoun = getArabicNoun noun
    #   "#{arabicNum} #{arabicNoun}"
    # else
    pluralizedNoun = "#{noun}#{if n > 1 then "s" else ""}"
    "#{n} #{pluralizedNoun} #{restOfString}"

prettify = (date_raw) ->
  formatters = [
    {
      threshold: 1
      handler: -> "just now"
    }
    {
      threshold: 60
      handler: createHandler 1, "second", "ago"
    }
    {
      threshold: 3600
      handler: createHandler 60, "minute", "ago"
    }
    {
      threshold: 86400
      handler: createHandler 3600, "hour", "ago"
    }
    {
      threshold: 172800
      handler: -> "yesterday"
    }
    {
      threshold: 604800
      handler: createHandler 86400, "day", "ago"
    }
    {
      threshold: 2592000
      handler: createHandler 604800, "week", "ago"
    }
    {
      threshold: 31536000
      handler: createHandler 2592000, "month", "ago"
    }
    {
      threshold: Infinity
      handler: createHandler 31536000, "year", "ago"
    }
  ]

  date = new Date date_raw
  now = new Date
  diff = (now.getTime() - date.getTime()) / 1000
  i = 0
  while i < formatters.length
    if diff < formatters[i].threshold
      return formatters[i].handler diff
    i++
  ""

exports = module.exports =  -> prettify