mongoose = require 'mongoose'

transactions = module.exports =
  model: mongoose.model 'transactions',
    credits: Number
    name: String
    perks: [ Boolean ]
    success: Boolean
    total: Number
    twoCheckoutTransId: String
    orderNumber: String