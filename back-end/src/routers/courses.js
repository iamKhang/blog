// Path: back-end/routers/courses.js
const express = require('express')
const router = express.Router()

// const courseController = require('../../app/controllers/CourseController')
const courseController = require('../app/controllers/CourseController')

router.get('/getList', courseController.getList)
// Thêm 1 khóa học mới
router.post('/add', courseController.addCourse)



module.exports = router;