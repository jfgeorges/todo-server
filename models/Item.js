const mongoose = require("mongoose");

const Item = mongoose.model("Item", {
  title: {
    type: String,
    minlength: 2,
    maxlength: 100,
    required: true
  },
  done: {
    type: Boolean,
    default: false,
    required: true
  },
  order: {
    type: Number
  }
});

module.exports = Item;
