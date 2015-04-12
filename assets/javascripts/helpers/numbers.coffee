module.exports =
  withCommas: (x) ->
    x.toString().replace /\B(?=(\d{3})+(?!\d))/g, ','
  toArabic: (n) ->
    id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    number = n.toString()
    number.replace /[0-9]/g, (w) -> id[+w]