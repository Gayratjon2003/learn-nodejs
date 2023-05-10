const mongoose = require("mongoose");
const Joi = require("joi");
const { categorySchema } = require("./category");
const courseSchema = new mongoose.Schema({
  tags: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  trainer: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
});

const Course = mongoose.model("Courses", courseSchema);
function validateCourse(course) {
  const schema = {
    title: Joi.string().min(3).max(50).required(),
    categoryId: Joi.string().required(),
    trainer: Joi.string().required(),
    status: Joi.string().required(),
    fee: Joi.number().required(),
    tags: Joi.array().items(Joi.string()),
  };
  return Joi.validate(course, schema);
}
exports.Course = Course;
exports.validate = validateCourse;
