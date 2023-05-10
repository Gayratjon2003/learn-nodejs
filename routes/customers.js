const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let customer = new Customer({
    name: req.body.name,
    isVip: req.body.isVip,
    phone: req.body.phone,
    bonusPoints: req.body.bonusPoints,
  });
  customer = await customer.save();
  res.status(201).send(customer);
});
router.get("/:id", async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("Berilgan ID ga teng bo'lgan toifa topilmadi");

    res.send(customer);
  } catch (err) {
    return res.status(404).send("Berilgan ID ga teng bo'lgan toifa topilmadi");
  }
});
router.put("/:id", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    let customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isVip: req.body.isVip,
        phone: req.body.phone,
      },
      { new: true }
    );
    res.send(customer);
  } catch (err) {
    return res.status(404).send("Berilgan ID ga teng bo'lgan toifa topilmadi");
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("Berilgan ID ga teng bo'lgan toifa topilmadi");

    res.send(customer);
  } catch (err) {
    return res.status(404).send("Berilgan ID ga teng bo'lgan toifa topilmadi");
  }
});

module.exports = router;
