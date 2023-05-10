const express = require("express");
const router = express.Router();
const { Customer } = require("../models/customer");
const { Course } = require("../models/course");
const { Enrollment, validate } = require("../models/enrollment");
const { default: mongoose } = require("mongoose");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const enrollments = await Enrollment.find();
  res.send(enrollments);
});
router.get("/:id", async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment)
      return res
        .status(404)
        .send("Berilgan IDga teng bo'lgan qabul topilmadi.");

    res.send(enrollment);
  } catch {
    return res.status(404).send("Berilgan IDga teng bo'lgan qabul topilmadi.");
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) {
    return res.status(400).send("ObjectId xato yuborildi! (costumerId)");
  }
  if (!mongoose.Types.ObjectId.isValid(req.body.courseId)) {
    return res.status(400).send("courseId xato yuborildi! (courseId)");
  }
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res
      .status(400)
      .send("Berilgan IDga mos bo'lgan toifa topilmadi (costumerId)");
  }

  const course = await Course.findById(req.body.courseId);
  if (!course) {
    return res
      .status(400)
      .send("Berilgan IDga mos bo'lgan toifa topilmadi (courseId)");
  }

  let enrollment = new Enrollment({
    customer: {
      _id: customer._id,
      name: customer.name,
    },
    course: {
      _id: course._id,
      title: course.title,
    },
    courseFee: course.fee,
  });
  if (customer.isVip) {
    enrollment.courseFee = course.fee - 0.2 * course.fee;
  }
  enrollment = await enrollment.save();

  try {
    customer.bonusPoints++;
    customer.save();
  } catch {
    res.status(400).send("Customer ga bonus berilmadi, nimadur xato ketdi!");
  }
  res.send(enrollment);
});

module.exports = router;
