// Path: back-end/app/controllers/CourseController.js

const Course = require("../models/Course");
const {
  multipaleMongooseToObject,
  mongooseToObject,
} = require("../../utils/mongoose");

class CourseController {
  getList(req, res, next) {
    Course.find({})
      .then((courses) => {
        res.json({
          courses: multipaleMongooseToObject(courses),
        });
      })
      .catch(next);
  }

  addCourse(req, res, next) {
    const course = new Course(req.body);
    course
      .save()
      .then(() => {
        res.json({
          message: "Thêm khóa học thành công",
        });
      })
      .catch((error) => {
        console.log('Error when saving course:', error);
        console.log("Thêm khóa học thất bại");
        next(error);
      });
  }
}

module.exports = new CourseController();
