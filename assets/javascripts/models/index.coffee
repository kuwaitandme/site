# Model parent classes to be referred here. This allows any other function
# to easily instantiate the required model by just referencing from this
# module
module.exports =
  BackboneModel: require './Backbone.Model'
  categories:    require './Categories'
  classified:    require './Classified'
  classifieds:   require './Classifieds'
  locations:     require './Locations'
  user:          require "./User"