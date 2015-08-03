module.exports =  -> (price, priceType) ->
  priceType = Number priceType
  if priceType is 0 then return "Free"
  if priceType is 1 then return "Contact Owner"
  if priceType
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD"
