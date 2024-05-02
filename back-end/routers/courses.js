// Path: back-end/routers/courses.js
const express = require('express')
const router = express.Router()

const courseController = require('../app/controllers/CourseController')

router.get('/show', courseController.show)



module.exports = router;