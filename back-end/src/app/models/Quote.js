// Path: back-end/app/models/Quote.js

const  mongoose = require('mongoose');
const Schema = mongoose.Schema;


const QuoteSchema = new mongoose.Schema({
    sayings: { type: String, required: true },
    speaker: { type: String, required: true },
  });

const Quote = mongoose.model('Quote', QuoteSchema);

module.exports = Quote;