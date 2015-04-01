mongoose = require 'mongoose'

Schema = mongoose.Schema
ObjectId = Schema.ObjectId

transactions = module.exports =
  model: mongoose.model('transactions',
    classified: ObjectId
    name: String
    perks: [ Boolean ]
    success: Boolean
    total: Number
    twoCheckoutTransId: String
    orderNumber: String)