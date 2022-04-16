const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

ReviewScema.plugin(mongoosePaginate);

module.exports = mongoose.model("Review", ReviewScema);
