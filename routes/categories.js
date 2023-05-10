const express = require("express");
const router = express.Router();
const { Category, validate } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const mongoose = require("mongoose");
router.get("/", async (req, res) => {
  //   try {
  //     const categories = await Category.find().sort("name");
  //     res.send(categories);
  //   } catch (ex) {
  //     // TODO xatoni log qilish
  //     res.status(500).send("Serverda kutilmagan xato ro'y berdi");
  //   }
  // });
  // throw new Error("Toifalarni olishda kutilmagan xato yuz berdi!");
  const categories = await Category.find().sort("name");
  res.send(categories);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let category = new Category({
    name: req.body.name,
  });
  category = await category.save();
  res.status(201).send(category);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Yaroqsiz ID");
  try {
    let category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).send("Berilgan IDga teng bo'lgan toifa topilmadi");

    res.send(category);
  } catch (err) {
    return res.status(404).send("Berilgan IDga teng bo'lgan toifa topilmadi");
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true,
      }
    );
    res.send(category);
  } catch (err) {
    return res.status(404).send("Berilgan ID ga teng bo'lgan toifa topilmadi");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    let category = await Category.findByIdAndRemove(req.params.id);
    if (!category)
      return res.status(404).send("Berilgan IDga teng bo'lgan toifa topilmadi");
    res.send(category);
  } catch (err) {
    return res.status(404).send("Berilgan IDga teng bo'lgan toifa topilmadi");
  }
});
module.exports = router;
