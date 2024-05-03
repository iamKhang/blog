// Path: back-end/routers/courses.js
const express = require('express')
const router = express.Router()

// const courseController = require('../../app/controllers/CourseController')
const quoteController = require('../app/controllers/QuoteController')

router.get('/getAllQuote', quoteController.getAllQuote)



module.exports = router;