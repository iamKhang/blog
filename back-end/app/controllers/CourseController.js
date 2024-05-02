// Path: back-end/app/controllers/CourseController.js

const Course = require("../models/Course");
const {
  multipaleMongooseToObject,
  mongooseToObject,
} = require("../../utils/mongoose");

class CourseController {
  show(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.json({
          courses: multipaleMongooseToObject(courses),
        });
      })
      .catch(next);
  }
}

module.exports = new CourseController();
