"use strict";
const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  lineTotal: {
    type: Number,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  payers: {
    type: [String],
    required: true
  }
});

const receiptSchema = new mongoose.Schema({
  establishment: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  cash: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  tip: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  lineItems: {
    type: [lineItemSchema],
    required: true
  },
});

const Receipt = mongoose.model('Receipt', receiptSchema);

module.exports = Receipt;