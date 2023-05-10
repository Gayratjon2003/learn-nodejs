const express = require("express");
const router = express.Router();
const { Category } = require("../models/category");
const { Course, validate } = require("../models/course");
const auth = require("../middleware/auth");
router.get("/", async (req, res) => {
  const course = await Course.find().sort("title");
  res.send(course);
});
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const category = await Category.findById(req.body.categoryId);
  if (!category) {
    return res.status(400).send("Berilgan IDga mos bo'lgan tpifa topilmadi");
  }

  let course = new Course({
    tags: req.body.tags,
    title: req.body.title,
    category: {
      _id: category._id,
      name: category.name,
    },
    trainer: req.body.trainer,
    status: req.body.status,
    fee: req.body.fee,
  });
  course = await course.save();
  res.status(201).send(course);
});
router.get("/:id", async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).send("Berilgan IDga teng bo'lgan toifa topilmadi");

    res.send(course);
  } catch (err) {
    return res.status(404).send("Berilgan IDga teng bo'lgan toifa topilmadi");
  }
});
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const category = await Category.findById(req.body.categoryId);
  if (!category) {
    return res.status(400).send("Berilgan IDga mos bo'lgan toifa topilmadi");
  }

  try {
    let course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        tags: req.body.tags,
        title: req.body.title,
        category: {
          _id: category._id,
          name: category.name,
        },
        trainer: req.body.trainer,
        status: req.body.status,
      },
      { new: true }
    );
    res.send(course);
  } catch (err) {
    return res.status(400).send("Berilgan IDga mos bo'lgan toifa topilmadi");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findByIdAndRemove(req.params.id);

    res.send(course);
  } catch (err) {
    return res.status(400).send("Berilgan IDga mos bo'lgan toifa topilmadi");
  }
});

module.exports = router;
