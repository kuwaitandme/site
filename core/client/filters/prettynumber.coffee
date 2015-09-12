exports = module.exports = -> (num, decimalPlaces=1) ->
  suffix = ""
  num = Math.round +num

  factor = Math.pow 10, decimalPlaces

  if num < 1000 then str = num
  else if num < 1000000
    str = Math.floor(num / (1000 / factor)) / factor
    suffix = "K"
  else if num < 1000000000
    str = Math.floor(num / (1000000 / factor)) / factor
    suffix = "M"
  else if num < 1000000000000
    str = Math.floor(num / (1000000000 / factor)) / factor
    suffix = "B"
  else if num < 1000000000000000
    str = Math.floor(num / (1000000000000 / factor)) / factor
    suffix = "T"

  Math.floor(str) + suffix