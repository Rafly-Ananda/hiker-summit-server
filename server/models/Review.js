const mongoose = require("mongoose");

const ReviewScema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    destination_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    review_images: {
      bucket: { type: String },
      assets_key: { type: Array },
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewScema);
