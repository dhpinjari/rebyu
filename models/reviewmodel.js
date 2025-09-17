const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  reviewRating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  reviewImage: {
    type: String,
    default: null,
  },
  reviewTitle: {
    type: String,
    trim: true,
  },
  reviewDesc: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerModel",
    required: true,
  },
});

module.exports = mongoose.model("reviewModel", reviewSchema);
