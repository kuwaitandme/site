module.exports =  -> (price) ->
  if price is 0 then return "Free"
  if price is -1 then return "Contact Owner"
  if price then return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " KD"