module.exports =  -> (price, priceType) ->
  if priceType is 0 then return "Free"
  if priceType is 1 then return "Contact Owner"
  if priceType then return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD"