dict =
  CLASSIFIED_ACTIVE: "Your classified has been approved by a moderator"

module.exports =  -> (text) -> if dict[text]? then dict[text] else text
