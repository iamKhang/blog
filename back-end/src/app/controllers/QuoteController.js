// Path: back-end/app/controllers/QuoteController.js

const Quote = require("../models/Quote");
const {
  multipaleMongooseToObject,
  mongooseToObject,
} = require("../../utils/mongoose");

class QuoteController {
    getAllQuote(req, res, next) {
        Quote.find({})
            .then((quotes) => {
                console.log('quotes:', quotes)
                res.json({
                    quotes: multipaleMongooseToObject(quotes),
                });
            })
            .catch(next);
    }
}

module.exports = new QuoteController();
