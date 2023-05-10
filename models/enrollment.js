const mongoose = require("mongoose");
const Joi = require("joi");

const enrollmentSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  course: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxlength: 255,
      },
    }),
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
    default: Date.now,
  },
  courseFee: {
    type: Number,
    min: 0,
  },
});

const Enrollment = mongoose.model("Enrollments", enrollmentSchema);
function validateEnrollment(enrollment) {
  const schema = {
    customerId: Joi.string().required(),
    courseId: Joi.string().required(),
  };
  return Joi.validate(enrollment, schema);
}
function validateObjectId(objectId) {
  if (!mongoose.Types.ObjectId.isValid(objectId)) {
    return res.status(400).send(`${ObjectId} - objectId Emas! `);
  }
}
exports.Enrollment = Enrollment;
exports.validate = validateEnrollment;
exports.validateObjectId = validateObjectId;
